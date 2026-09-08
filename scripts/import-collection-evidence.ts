import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { validateCollectionEvidenceInput } from "../src/lib/import/collection";

type Package = {
  schemaVersion: number;
  sourceSystem: string;
  sources: Array<{ sourceId: string; slug: string; title: string; publisher: string; canonicalUrl: string; publicationDate?: string; sourceType: string; tier: string; rightsNotes: string; versionId: string; contentHash: string; rawStoragePath: string; parserVersion: string }>;
  evidence: Array<{ id: string; sourceId: string; locator: string; authorityType: string }>;
  claims: Array<{ id: string; entityType: string; entitySlug: string; property: string; value: string; evidenceIds: string[] }>;
  relationships: Array<{ id: string; sourceType: string; sourceSlug: string; targetType: string; targetSlug: string; predicate: string; validFrom?: string; validTo?: string; evidenceIds: string[] }>;
};

function argument(name: string): string | undefined { const index = process.argv.indexOf(name); return index >= 0 ? process.argv[index + 1] : undefined; }
function stableId(prefix: string, value: string): string { return `${prefix}-${createHash("sha256").update(value).digest("hex").slice(0, 24)}`; }
async function findEntityId(db: PrismaClient, type: string, slug: string): Promise<string | null> {
  switch (type) {
    case "Conflict": return (await db.conflict.findUnique({ where: { slug }, select: { id: true } }))?.id ?? null;
    case "Operation": return (await db.operation.findUnique({ where: { slug }, select: { id: true } }))?.id ?? null;
    case "Person": return (await db.person.findUnique({ where: { slug }, select: { id: true } }))?.id ?? null;
    case "Equipment": return (await db.equipment.findUnique({ where: { slug }, select: { id: true } }))?.id ?? null;
    case "Unit": return (await db.unit.findUnique({ where: { slug }, select: { id: true } }))?.id ?? null;
    case "Source": return (await db.source.findUnique({ where: { slug }, select: { id: true } }))?.id ?? null;
    default: throw new Error(`ENTITY_TYPE_UNSUPPORTED:${type}`);
  }
}

async function main(): Promise<void> {
  const inputPath = path.resolve(argument("--input") ?? "data/import/kargil-evidence.json");
  const databaseUrl = argument("--database-url") ?? process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL_REQUIRED");
  if (process.env.KARGIL_CANDIDATE_APPLY_CONFIRM !== "I_UNDERSTAND") throw new Error("KARGIL_CANDIDATE_APPLY_CONFIRM_REQUIRED");
  if (!databaseUrl.includes(".test-data")) throw new Error("CANDIDATE_DATABASE_REQUIRED");
  const pkg = JSON.parse(await readFile(inputPath, "utf8")) as Package;
  const issues = validateCollectionEvidenceInput(pkg);
  if (issues.length) throw new Error(issues.map((issue) => `${issue.code}:${issue.path}`).join("\n"));
  for (const source of pkg.sources) {
    const rawPath = path.resolve(source.rawStoragePath);
    if (!existsSync(rawPath)) throw new Error(`RAW_SOURCE_NOT_FOUND:${rawPath}`);
    const actualHash = createHash("sha256").update(await readFile(rawPath)).digest("hex");
    if (actualHash !== source.contentHash) throw new Error(`RAW_SOURCE_HASH_MISMATCH:${source.sourceId}:expected=${source.contentHash}:actual=${actualHash}`);
  }

  const db = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
  try {
    const entityIds = new Map<string, string>();
    for (const item of pkg.claims) {
      const entityId = await findEntityId(db, item.entityType, item.entitySlug);
      if (!entityId) throw new Error(`ENTITY_NOT_FOUND:${item.entityType}:${item.entitySlug}`);
      entityIds.set(`${item.entityType}:${item.entitySlug}`, entityId);
    }
    for (const item of pkg.relationships) {
      for (const endpoint of [[item.sourceType, item.sourceSlug], [item.targetType, item.targetSlug]]) {
        const key = `${endpoint[0]}:${endpoint[1]}`;
        if (entityIds.has(key)) continue;
        const entityId = await findEntityId(db, endpoint[0], endpoint[1]);
        if (!entityId) throw new Error(`ENTITY_NOT_FOUND:${key}`);
        entityIds.set(key, entityId);
      }
    }

    const result = await db.$transaction(async (tx) => {
      const sourceVersionIds = new Map<string, string>();
      for (const source of pkg.sources) {
        const familySlug = `tier-${source.tier.toLowerCase()}`;
        const family = await tx.sourceFamily.upsert({ where: { slug: familySlug }, update: {}, create: { id: stableId("source-family", familySlug), slug: familySlug, name: `Tier ${source.tier}`, tier: source.tier, description: "Candidate source family for the bounded collection." } });
        const row = await tx.source.upsert({ where: { slug: source.slug }, update: { title: source.title, summary: "Candidate source retained for evidence-first review.", publisher: source.publisher, canonicalUrl: source.canonicalUrl, sourceType: source.sourceType, tier: source.tier, rightsNotes: source.rightsNotes }, create: { id: stableId("source", source.sourceId), sourceFamilyId: family.id, slug: source.slug, title: source.title, summary: "Candidate source retained for evidence-first review.", publisher: source.publisher, publicationDate: source.publicationDate, canonicalUrl: source.canonicalUrl, sourceType: source.sourceType, tier: source.tier, rightsNotes: source.rightsNotes, publicationStatus: "DRAFT", contentKind: "EDITORIAL" } });
        const versionId = stableId("source-version", source.sourceId);
        await tx.sourceVersion.upsert({ where: { id: versionId }, update: { contentHash: source.contentHash, rawStoragePath: source.rawStoragePath, parserVersion: source.parserVersion, url: source.canonicalUrl, versionTag: source.versionId }, create: { id: versionId, sourceId: row.id, versionTag: source.versionId, accessedAt: new Date("2026-09-07T00:00:00.000Z"), url: source.canonicalUrl, format: "raw-html", contentHash: source.contentHash, rawStoragePath: source.rawStoragePath, parserVersion: source.parserVersion, httpStatus: 200 } });
        sourceVersionIds.set(source.sourceId, versionId);
      }
      const evidenceIds = new Map<string, string>();
      for (const item of pkg.evidence) {
        const id = stableId("evidence", item.id);
        await tx.evidence.upsert({ where: { id }, update: { locator: item.locator, authorityType: item.authorityType }, create: { id, sourceVersionId: sourceVersionIds.get(item.sourceId)!, locator: item.locator, quote: null, rightsSafeToDisplay: false, evidenceType: "TEXT", authorityType: item.authorityType } });
        evidenceIds.set(item.id, id);
      }
      for (const item of pkg.claims) {
        const claimId = stableId("claim", item.id);
        const claim = await tx.claim.upsert({ where: { id: claimId }, update: { value: item.value, status: "CANDIDATE", verificationStatus: "UNVERIFIED" }, create: { id: claimId, entityType: item.entityType, entityId: entityIds.get(`${item.entityType}:${item.entitySlug}`)!, property: item.property, value: item.value, verificationStatus: "UNVERIFIED", status: "CANDIDATE" } });
        for (const evidenceRef of item.evidenceIds) { const evidenceId = evidenceIds.get(evidenceRef)!; await tx.claimEvidence.upsert({ where: { claimId_evidenceId: { claimId: claim.id, evidenceId } }, update: {}, create: { claimId: claim.id, evidenceId } }); await tx.entityEvidence.upsert({ where: { entityType_entityId_section_evidenceId: { entityType: item.entityType, entityId: claim.entityId, section: item.property, evidenceId } }, update: {}, create: { entityType: item.entityType, entityId: claim.entityId, section: item.property, evidenceId } }); }
      }
      for (const item of pkg.relationships) {
        const relationshipId = stableId("relationship", item.id);
        const relationship = await tx.relationship.upsert({ where: { id: relationshipId }, update: { sourceType: item.sourceType, sourceId: entityIds.get(`${item.sourceType}:${item.sourceSlug}`)!, targetType: item.targetType, targetId: entityIds.get(`${item.targetType}:${item.targetSlug}`)!, predicate: item.predicate, status: "CANDIDATE", validFrom: item.validFrom ?? null, validTo: item.validTo ?? null }, create: { id: relationshipId, sourceType: item.sourceType, sourceId: entityIds.get(`${item.sourceType}:${item.sourceSlug}`)!, targetType: item.targetType, targetId: entityIds.get(`${item.targetType}:${item.targetSlug}`)!, predicate: item.predicate, validFrom: item.validFrom ?? null, validTo: item.validTo ?? null, status: "CANDIDATE", fingerprint: stableId("fingerprint", item.id) } });
        for (const evidenceRef of item.evidenceIds) { const evidenceId = evidenceIds.get(evidenceRef)!; await tx.relationshipEvidence.upsert({ where: { relationshipId_evidenceId: { relationshipId: relationship.id, evidenceId } }, update: {}, create: { relationshipId: relationship.id, evidenceId } }); }
      }
      return { sources: pkg.sources.length, evidence: pkg.evidence.length, claims: pkg.claims.length, relationships: pkg.relationships.length };
    });
    console.log(JSON.stringify({ status: "APPLIED_CANDIDATE", ...result }, null, 2));
  } finally { await db.$disconnect(); }
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
