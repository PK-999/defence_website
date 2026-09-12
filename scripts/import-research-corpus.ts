import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient, type Prisma } from "@prisma/client";
import { publishEntity } from "../src/lib/publication/service";
import type { EntityRef } from "../src/lib/domain/entities";

type SourceRecord = {
  id: string; url: string; title: string; publisher?: string; publicationDate?: string | null;
  tier?: string; finalUrl?: string; accessedAt?: string; sha256?: string; rawPath?: string;
};
type PvcProfile = {
  id: string; name: string; rankAtAction: string; service: string; medal: string; story: string;
  actionDateFromNarrative: string; sourceId: string; sourceUrl: string; locator: string;
};
type OperationFact = {
  id: string; name: string; type: string; date: string; parentConflict: string;
  summary: string; sourceId: string; sourceUrl: string;
};
type EquipmentFact = {
  id: string; entity: string; service: string; field: string; value: unknown; unit?: string | null;
  effectiveDate?: string | null; scope?: string; note?: string; sourceId: string; sourceUrl: string; locator: string;
};

const ROOT = path.resolve(__dirname, "..");
const CORPUS = path.join(ROOT, "docs/research/2026-09-09-defence-corpus");
const DATA = path.join(CORPUS, "data");
const ACTOR = "research-batch-2026-09-09";
const REASON = "Reviewed against the retrieved primary source and locator in the 2026-09-09 research corpus.";

const pvcSlugs: Record<string, string> = {
  "Somnath Sharma": "maj-somnath-sharma", "Jadunath Singh": "jadu-nath-singh", "Rama Raghoba Rane": "2nd-lt-rama-raghoba-rane",
  "Piru Singh": "chm-piru-singh", "Karam Singh": "karam-singh", "Gurbachan Singh Salaria": "capt-gurbachan-singh-salaria",
  "Dhan Singh Thapa": "maj-dhan-singh-thapa", "Joginder Singh": "sub-joginder-singh", "Shaitan Singh": "maj-shaitan-singh",
  "Ardeshir Burzorji Tarapore": "lt-col-ardeshir-tarapore", "Abdul Hamid": "cqmh-abdul-hamid", "Albert Ekka": "l/nk-albert-ekka",
  "Nirmal Jit Singh Sekhon": "fg-off-nirmal-jit-singh-sekhon", "Hoshiar Singh": "maj-hoshiar-singh", "Arun Khetarpal": "2nd-lt-arun-khetarpal",
  "Bana Singh": "bana-singh", "Ramaswamy Parameswaran": "maj-ramaswamy-parameswaran", "Manoj Kumar Pandey": "lt-manoj-kumar-pandey",
  "Yogendra Singh Yadav": "gdr-yogendra-singh-yadav", "Sanjay Kumar": "rfn-sanjay-kumar", "Vikram Batra": "capt-vikram-batra",
};

function readJson<T>(name: string): T { return JSON.parse(readFileSync(path.join(DATA, name), "utf8")) as T; }
function stable(prefix: string, value: string): string { return `${prefix}-${createHash("sha256").update(value).digest("hex").slice(0, 24)}`; }
function slugify(value: string): string { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function arg(name: string): string | undefined { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : undefined; }
function sourceType(source: SourceRecord): string { return source.tier?.startsWith("primary") ? "official-record" : "technical-source"; }
function sourceTier(source: SourceRecord): string { return source.tier?.startsWith("primary") ? "A" : "B"; }

function loadSelectedSources(): { sources: SourceRecord[]; pvc: PvcProfile[]; operations: OperationFact[]; equipment: EquipmentFact[] } {
  const sources = readJson<SourceRecord[]>("sources.json");
  const byId = new Map(sources.map((source) => [source.id, source]));
  const pvc = readJson<PvcProfile[]>("pvc-recipient-profiles.json");
  const operations = readJson<OperationFact[]>("operation-primary-facts.json");
  const equipment = readJson<EquipmentFact[]>("equipment-primary-facts.json");
  const ids = new Set([...pvc.map((x) => x.sourceId), ...operations.map((x) => x.sourceId), ...equipment.map((x) => x.sourceId)]);
  const selected = [...ids].map((id) => byId.get(id)).filter((x): x is SourceRecord => Boolean(x?.rawPath && x.url));
  return { sources: selected, pvc, operations, equipment };
}

function validateCorpus(input: ReturnType<typeof loadSelectedSources>): string[] {
  const errors: string[] = [];
  for (const source of input.sources) {
    const raw = path.join(CORPUS, source.rawPath ?? "");
    if (!existsSync(raw)) errors.push(`RAW_SOURCE_NOT_FOUND:${source.id}`);
  }
  for (const profile of input.pvc) if (!pvcSlugs[profile.name]) errors.push(`PVC_SLUG_NOT_MAPPED:${profile.name}`);
  return errors;
}

function equipmentDomain(name: string): string {
  if (/INS |P-8|Vikrant|Himgiri|Arnala|Androth|Ikshak|Mahe|Nistar|Surat|Tamal|Udaygiri|Vaghsheer|Diving/i.test(name)) return "sea";
  if (/Rafale|Apache|C-17|Chinook|KC-135|MiG|LCH|P-8/i.test(name)) return "air";
  if (/missile|BrahMos|ATAGS|Arjun|K9|High Mobility/i.test(name)) return "land";
  return "support";
}
function equipmentModel(name: string): string { return /Arjun|ATAGS|K9|LCH|INS |Vikrant|Himgiri|Arnala|Androth|Ikshak|Mahe|Nistar|Surat|Tamal|Udaygiri|Vaghsheer/i.test(name) ? "indigenous" : "imported"; }

async function ensureSource(tx: Prisma.TransactionClient, source: SourceRecord): Promise<{ sourceId: string; evidenceId: string }> {
  const familySlug = `research-${sourceTier(source).toLowerCase()}`;
  const family = await tx.sourceFamily.upsert({ where: { slug: familySlug }, update: {}, create: { id: stable("source-family", familySlug), slug: familySlug, name: `Research ${sourceTier(source)} sources`, tier: sourceTier(source), description: "Retrieved source material from the reviewed defence research corpus." } });
  const slug = `research-${slugify(source.id)}`;
  const row = await tx.source.upsert({ where: { slug }, update: { title: source.title, publisher: source.publisher ?? "Research corpus", canonicalUrl: source.finalUrl ?? source.url, publicationDate: source.publicationDate ?? null, sourceType: sourceType(source), tier: sourceTier(source), rightsNotes: "Citation and locator retained; source text is not reproduced. Verify reuse rights before displaying excerpts." }, create: { id: stable("source", source.id), sourceFamilyId: family.id, slug, title: source.title, summary: `Retrieved ${source.publisher ?? "source"} record retained for evidence-backed defence research.`, publisher: source.publisher ?? "Research corpus", canonicalUrl: source.finalUrl ?? source.url, publicationDate: source.publicationDate ?? null, sourceType: sourceType(source), tier: sourceTier(source), rightsNotes: "Citation and locator retained; source text is not reproduced. Verify reuse rights before displaying excerpts.", publicationStatus: "DRAFT", contentKind: "EDITORIAL" } });
  const versionId = stable("source-version", source.id);
  await tx.sourceVersion.upsert({ where: { id: versionId }, update: { versionTag: source.id, accessedAt: source.accessedAt ? new Date(source.accessedAt) : null, url: source.finalUrl ?? source.url, format: "gzip-captured-source", contentHash: source.sha256 ?? null, rawStoragePath: path.join(CORPUS, source.rawPath ?? ""), parserVersion: "research-corpus-2026-09-09", httpStatus: 200 }, create: { id: versionId, sourceId: row.id, versionTag: source.id, accessedAt: source.accessedAt ? new Date(source.accessedAt) : null, url: source.finalUrl ?? source.url, format: "gzip-captured-source", contentHash: source.sha256 ?? null, rawStoragePath: path.join(CORPUS, source.rawPath ?? ""), parserVersion: "research-corpus-2026-09-09", httpStatus: 200 } });
  const evidenceId = stable("evidence", source.id);
  await tx.evidence.upsert({ where: { id: evidenceId }, update: { locator: "Retrieved source document; see linked claim locator.", authorityType: sourceType(source), authorityBasis: source.publisher ?? "Retrieved source" }, create: { id: evidenceId, sourceVersionId: versionId, locator: "Retrieved source document; see linked claim locator.", quote: null, rightsSafeToDisplay: false, evidenceType: "TEXT", authorityType: sourceType(source), authorityBasis: source.publisher ?? "Retrieved source" } });
  return { sourceId: row.id, evidenceId };
}

async function publish(db: PrismaClient, ref: EntityRef): Promise<void> {
  const current = await (() => {
    switch (ref.type) {
      case "Person": return db.person.findUnique({ where: { id: ref.id }, select: { revision: true, publicationStatus: true } });
      case "Operation": return db.operation.findUnique({ where: { id: ref.id }, select: { revision: true, publicationStatus: true } });
      case "Equipment": return db.equipment.findUnique({ where: { id: ref.id }, select: { revision: true, publicationStatus: true } });
      case "Conflict": return db.conflict.findUnique({ where: { id: ref.id }, select: { revision: true, publicationStatus: true } });
      case "Source": return db.source.findUnique({ where: { id: ref.id }, select: { revision: true, publicationStatus: true } });
      case "Unit": return db.unit.findUnique({ where: { id: ref.id }, select: { revision: true, publicationStatus: true } });
    }
  })();
  if (!current) throw new Error(`ENTITY_NOT_FOUND:${ref.type}:${ref.id}`);
  if (current.publicationStatus === "PUBLISHED") return;
  const result = await publishEntity({ ref, expectedRevision: current.revision, reason: REASON, actor: { actorId: ACTOR, issuer: "batch", subject: ACTOR, roles: ["REVIEWER", "PUBLISHER"] } }, { client: db });
  if (!result.success) throw new Error(`PUBLISH_FAILED:${ref.type}:${ref.id}:${result.code}:${result.message}`);
}

async function main(): Promise<void> {
  const mode = arg("--mode") ?? "validate";
  const input = loadSelectedSources();
  const errors = validateCorpus(input);
  const counts = { sources: input.sources.length, pvcProfiles: input.pvc.length, operations: input.operations.length, equipmentEntities: new Set(input.equipment.map((x) => x.entity)).size, equipmentFacts: input.equipment.length, stagedRows: readJson<unknown[]>("historical-award-roster.json").length + readJson<unknown[]>("conflict-operation-discovery.json").length + readJson<unknown[]>("biographical-facts.json").length };
  if (mode === "validate") { console.log(JSON.stringify({ mode, counts, errors }, null, 2)); if (errors.length) process.exitCode = 1; return; }
  if (mode !== "apply") throw new Error("MODE_MUST_BE_VALIDATE_OR_APPLY");
  if (process.env.RESEARCH_IMPORT_CONFIRM !== "I_UNDERSTAND") throw new Error("RESEARCH_IMPORT_CONFIRM_REQUIRED");
  if (errors.length) throw new Error(errors.join("\n"));
  const db = new PrismaClient();
  const sourceMap = new Map<string, { sourceId: string; evidenceId: string }>();
  try {
    await db.$transaction(async (tx) => { for (const source of input.sources) sourceMap.set(source.id, await ensureSource(tx, source)); });
    for (const source of input.sources) await publish(db, { type: "Source", id: sourceMap.get(source.id)!.sourceId });

    for (const profile of input.pvc) {
      const person = await db.person.findUnique({ where: { slug: pvcSlugs[profile.name] } });
      if (!person) throw new Error(`PVC_PERSON_NOT_FOUND:${profile.name}`);
      const evidenceId = sourceMap.get(profile.sourceId)?.evidenceId;
      if (!evidenceId) throw new Error(`PVC_SOURCE_NOT_FOUND:${profile.sourceId}`);
      const content = `${profile.story}\n\nAction date shown by the memorial profile: ${profile.actionDateFromNarrative}. The research note preserves this as a narrative date and does not infer the legal award year.`;
      await db.person.update({ where: { id: person.id }, data: { rank: profile.rankAtAction, serviceBranch: profile.service.includes("Air") ? "Air Force" : "Army", summary: profile.story, content, status: "Verified primary profile", decorations: JSON.stringify([profile.medal]) } });
      await db.entityEvidence.upsert({ where: { entityType_entityId_section_evidenceId: { entityType: "Person", entityId: person.id, section: "summary", evidenceId } }, update: {}, create: { entityType: "Person", entityId: person.id, section: "summary", evidenceId } });
      await db.entityEvidence.upsert({ where: { entityType_entityId_section_evidenceId: { entityType: "Person", entityId: person.id, section: "content", evidenceId } }, update: {}, create: { entityType: "Person", entityId: person.id, section: "content", evidenceId } });
      const claimId = stable("claim", `pvc-${profile.id}-story`);
      await db.claim.upsert({ where: { id: claimId }, update: { value: profile.story, status: "GOLD", verificationStatus: "OFFICIALLY_CONFIRMED", reviewedAt: new Date(), reviewedBy: ACTOR }, create: { id: claimId, entityType: "Person", entityId: person.id, property: "gallantryStory", value: profile.story, status: "GOLD", verificationStatus: "OFFICIALLY_CONFIRMED", reviewedAt: new Date(), reviewedBy: ACTOR } });
      await db.claimEvidence.upsert({ where: { claimId_evidenceId: { claimId, evidenceId } }, update: {}, create: { claimId, evidenceId } });
      await publish(db, { type: "Person", id: person.id });
    }

    const operationSlugs: Record<string, string> = { "Operation Bison": "operation-bison-1948", "Operation Safed Sagar": "operation-safed-sagar", Tololing: "kargil-battle-of-tololing", "Tiger Hill": "kargil-tiger-hill", "Operation Meghdoot": "operation-meghdoot-1984" };
    for (const fact of input.operations) {
      const evidenceId = sourceMap.get(fact.sourceId)?.evidenceId; if (!evidenceId) throw new Error(`OPERATION_SOURCE_NOT_FOUND:${fact.sourceId}`);
      const slug = operationSlugs[fact.name];
      let operation = await db.operation.findUnique({ where: { slug } });
      if (!operation) operation = await db.operation.create({ data: { slug, title: fact.name, category: fact.type === "operation" ? "combat" : "battle", summary: fact.summary, content: fact.summary, status: "Verified primary record", dateStart: fact.date, dateStartPrecision: "day", publicationStatus: "DRAFT", contentKind: "EDITORIAL", referenceUrl: fact.sourceUrl } });
      else operation = await db.operation.update({ where: { id: operation.id }, data: { summary: fact.summary, content: fact.summary, status: "Verified primary record", category: fact.type === "operation" ? "combat" : "battle", dateStart: fact.date, dateStartPrecision: "day", referenceUrl: fact.sourceUrl } });
      for (const section of ["summary", "content"]) await db.entityEvidence.upsert({ where: { entityType_entityId_section_evidenceId: { entityType: "Operation", entityId: operation.id, section, evidenceId } }, update: {}, create: { entityType: "Operation", entityId: operation.id, section, evidenceId } });
      await publish(db, { type: "Operation", id: operation.id });
    }

    const grouped = new Map<string, EquipmentFact[]>(); for (const fact of input.equipment) grouped.set(fact.entity, [...(grouped.get(fact.entity) ?? []), fact]);
    for (const [name, facts] of grouped) {
      const slug = `research-${slugify(name)}`; const first = facts[0]; const specs = facts.map((fact) => ({ field: fact.field, value: fact.value, unit: fact.unit ?? null, effectiveDate: fact.effectiveDate ?? null, scope: fact.scope ?? null, note: fact.note ?? null, sourceId: fact.sourceId, locator: fact.locator }));
      const evidenceId = sourceMap.get(first.sourceId)?.evidenceId; if (!evidenceId) throw new Error(`EQUIPMENT_SOURCE_NOT_FOUND:${first.sourceId}`);
      const summary = `${name} — source-backed technical facts for ${first.service}. Configuration scope and limitations are retained per specification.`;
      const content = `${summary}\n\n${facts.map((fact) => `${fact.field}: ${fact.value}${fact.unit ? ` ${fact.unit}` : ""}. ${fact.scope ?? ""}`).join("\n")}`;
      let equipment = await db.equipment.findUnique({ where: { slug } });
      if (!equipment) equipment = await db.equipment.create({ data: { slug, title: name, domain: equipmentDomain(name), category: "Defence equipment", summary, content, status: "Verified primary specification", developmentModel: equipmentModel(name), serviceStatus: /procurement|planned/i.test(name) ? "planned" : "active", originCountries: JSON.stringify([first.service.includes("Navy") ? "India" : "India", "Source scope varies"]), specs: JSON.stringify(specs), statusAsOf: first.effectiveDate ?? null, publicationStatus: "DRAFT", contentKind: "EDITORIAL" } });
      else equipment = await db.equipment.update({ where: { id: equipment.id }, data: { summary, content, specs: JSON.stringify(specs), status: "Verified primary specification" } });
      for (const section of ["summary", "content"]) await db.entityEvidence.upsert({ where: { entityType_entityId_section_evidenceId: { entityType: "Equipment", entityId: equipment.id, section, evidenceId } }, update: {}, create: { entityType: "Equipment", entityId: equipment.id, section, evidenceId } });
      await publish(db, { type: "Equipment", id: equipment.id });
    }
    console.log(JSON.stringify({ status: "PUBLISHED_PRIMARY_SUBSET", counts }, null, 2));
  } finally { await db.$disconnect(); }
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
