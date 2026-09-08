import type { Prisma, PrismaClient } from "@prisma/client";
import { isEntityType, type EntityRef, type EntityType } from "@/lib/domain/entities";
import { validateRelationshipShape } from "@/lib/domain/relationships";
import type { ValidationIssue } from "@/lib/domain/types";
import { publicWhere } from "@/lib/repositories/publication";

export type PublicationDatabase = PrismaClient | Prisma.TransactionClient;

function error(code: string, path: string, message: string): ValidationIssue {
  return { code, path, message, severity: "error" };
}

function warning(code: string, path: string, message: string): ValidationIssue {
  return { code, path, message, severity: "warning" };
}

function parseJson(value: string | null | undefined, path: string, issues: ValidationIssue[]): unknown {
  if (value === null || value === undefined) return null;
  try {
    return JSON.parse(value);
  } catch {
    issues.push(error("MALFORMED_JSON", path, "Stored JSON is malformed."));
    return null;
  }
}

function validUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function entityExists(ref: EntityRef, db: PublicationDatabase): Promise<boolean> {
  switch (ref.type) {
    case "Conflict": return Boolean(await db.conflict.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "Operation": return Boolean(await db.operation.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "Person": return Boolean(await db.person.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "Equipment": return Boolean(await db.equipment.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "Unit": return Boolean(await db.unit.findUnique({ where: { id: ref.id }, select: { id: true } }));
    case "Source": return Boolean(await db.source.findUnique({ where: { id: ref.id }, select: { id: true } }));
  }
}

async function getEntity(ref: EntityRef, db: PublicationDatabase): Promise<Record<string, unknown> | null> {
  switch (ref.type) {
    case "Conflict": return db.conflict.findUnique({ where: { id: ref.id }, select: { id: true, slug: true, title: true, summary: true, content: true, theatres: true, dateStart: true, dateEnd: true } });
    case "Operation": return db.operation.findUnique({ where: { id: ref.id }, select: { id: true, slug: true, title: true, summary: true, content: true, category: true, dateStart: true, dateEnd: true } });
    case "Person": return db.person.findUnique({ where: { id: ref.id }, select: { id: true, slug: true, title: true, fullName: true, summary: true, content: true, serviceBranch: true, rank: true } });
    case "Equipment": return db.equipment.findUnique({ where: { id: ref.id }, select: { id: true, slug: true, title: true, summary: true, content: true, domain: true, category: true, developmentModel: true, serviceStatus: true, originCountries: true, specs: true } });
    case "Unit": return db.unit.findUnique({ where: { id: ref.id }, select: { id: true, slug: true, title: true, summary: true, content: true, serviceId: true, unitType: true, ranksJson: true, awardsJson: true } });
    case "Source": return db.source.findUnique({ where: { id: ref.id }, select: { id: true, slug: true, title: true, summary: true, publisher: true, author: true, canonicalUrl: true, sourceType: true, tier: true, rightsNotes: true, sourceFamilyId: true } });
  }
}

async function validateEvidenceSections(ref: EntityRef, entity: Record<string, unknown>, db: PublicationDatabase, issues: ValidationIssue[]): Promise<void> {
  const sections = ["summary"];
  if (typeof entity.content === "string" && entity.content.trim()) sections.push("content");
  for (const section of sections) {
    const evidence = await db.entityEvidence.findMany({
      where: { entityType: ref.type, entityId: ref.id, section, evidence: { locator: { not: null }, sourceVersion: { source: publicWhere() } } },
      select: { id: true },
    });
    if (evidence.length === 0) issues.push(error("MISSING_ENTITY_EVIDENCE", `${ref.type}:${ref.id}.${section}`, `Published ${section} requires at least one reviewed evidence link to a public source.`));
  }
}

export async function validateEntityForPublication(ref: EntityRef, options: { client?: PublicationDatabase } = {}): Promise<ValidationIssue[]> {
  const db = options.client;
  if (!db) throw new Error("PUBLICATION_DATABASE_REQUIRED");
  const issues: ValidationIssue[] = [];
  const entity = await getEntity(ref, db);
  if (!entity) return [error("ENTITY_NOT_FOUND", `${ref.type}:${ref.id}`, "Entity does not exist.")];
  for (const field of ["slug", "title", "summary"]) {
    if (typeof entity[field] !== "string" || !entity[field].trim()) issues.push(error("MISSING_REQUIRED_FIELD", `${ref.type}:${ref.id}.${field}`, `${field} is required before publication.`));
  }

  if (ref.type === "Source") {
    if (!(typeof entity.publisher === "string" && entity.publisher.trim()) && !(typeof entity.author === "string" && entity.author.trim())) issues.push(error("SOURCE_IDENTITY_INCOMPLETE", `${ref.type}:${ref.id}.publisher`, "A source needs a publisher or author."));
    if (!validUrl(typeof entity.canonicalUrl === "string" ? entity.canonicalUrl : null)) issues.push(error("INVALID_SOURCE_URL", `${ref.type}:${ref.id}.canonicalUrl`, "Source URLs must use HTTP or HTTPS."));
    if (typeof entity.sourceType !== "string" || !entity.sourceType.trim()) issues.push(error("MISSING_SOURCE_TYPE", `${ref.type}:${ref.id}.sourceType`, "Source classification is required."));
    if (typeof entity.tier !== "string" || !entity.tier.trim()) issues.push(error("MISSING_SOURCE_TIER", `${ref.type}:${ref.id}.tier`, "Source tier is required."));
    if (typeof entity.rightsNotes !== "string" || !entity.rightsNotes.trim()) issues.push(error("MISSING_RIGHTS_NOTES", `${ref.type}:${ref.id}.rightsNotes`, "Rights notes are required."));
    const versions = await db.sourceVersion.findMany({ where: { sourceId: ref.id }, select: { id: true, versionTag: true } });
    if (versions.length === 0 || versions.some((version) => !version.versionTag.trim())) issues.push(error("SOURCE_VERSION_REQUIRED", `${ref.type}:${ref.id}.versions`, "At least one named source version is required."));
    return issues;
  }

  if (ref.type === "Conflict") {
    parseJson(typeof entity.theatres === "string" ? entity.theatres : null, `${ref.type}:${ref.id}.theatres`, issues);
    if (typeof entity.dateStart !== "string" || !entity.dateStart.trim()) issues.push(error("MISSING_START_DATE", `${ref.type}:${ref.id}.dateStart`, "A conflict requires a documented start date."));
  }
  if (ref.type === "Operation") {
    if (typeof entity.category !== "string" || !["combat", "evacuation", "humanitarian", "peacekeeping", "maritime-security", "rescue", "battle", "event", "other"].includes(entity.category)) issues.push(error("INVALID_OPERATION_CATEGORY", `${ref.type}:${ref.id}.category`, "Operation category is not canonical."));
  }
  if (ref.type === "Equipment") {
    if (!['air', 'land', 'sea', 'missile', 'space-isr', 'support', 'unknown'].includes(String(entity.domain))) issues.push(error("INVALID_DOMAIN", `${ref.type}:${ref.id}.domain`, "Equipment domain is not canonical."));
    if (!['active', 'retired', 'under-development', 'planned', 'limited', 'unknown'].includes(String(entity.serviceStatus))) issues.push(error("INVALID_SERVICE_STATUS", `${ref.type}:${ref.id}.serviceStatus`, "Equipment service status is not canonical."));
    if (!['indigenous', 'joint-development', 'license-produced', 'imported', 'mixed', 'unknown'].includes(String(entity.developmentModel))) issues.push(error("INVALID_DEVELOPMENT_MODEL", `${ref.type}:${ref.id}.developmentModel`, "Equipment development model is not canonical."));
    parseJson(typeof entity.originCountries === "string" ? entity.originCountries : null, `${ref.type}:${ref.id}.originCountries`, issues);
    parseJson(typeof entity.specs === "string" ? entity.specs : null, `${ref.type}:${ref.id}.specs`, issues);
  }
  await validateEvidenceSections(ref, entity, db, issues);
  return issues;
}

export async function validateDatabase(options: { client?: PublicationDatabase } = {}): Promise<ValidationIssue[]> {
  const db = options.client;
  if (!db) throw new Error("PUBLICATION_DATABASE_REQUIRED");
  const issues: ValidationIssue[] = [];
  const claims = await db.claim.findMany({ select: { id: true, entityType: true, entityId: true, evidence: { select: { evidenceId: true } } } });
  for (const claim of claims) {
    if (!isEntityType(claim.entityType) || !(await entityExists({ type: claim.entityType, id: claim.entityId }, db))) issues.push(error("INVALID_CLAIM_SUBJECT", `Claim:${claim.id}`, "Claim subject does not resolve to an entity."));
    if (claim.evidence.length === 0) issues.push(warning("CLAIM_WITHOUT_EVIDENCE", `Claim:${claim.id}`, "Candidate or rejected claim has no evidence yet."));
  }
  const relationships = await db.relationship.findMany({ select: { id: true, sourceType: true, sourceId: true, targetType: true, targetId: true, predicate: true } });
  for (const relationship of relationships) {
    if (!isEntityType(relationship.sourceType) || !isEntityType(relationship.targetType)) {
      issues.push(error("INVALID_RELATIONSHIP_ENDPOINT_TYPE", `Relationship:${relationship.id}`, "Relationship endpoint type is unknown."));
      continue;
    }
    issues.push(...validateRelationshipShape({ source: { type: relationship.sourceType, id: relationship.sourceId }, target: { type: relationship.targetType, id: relationship.targetId }, predicate: relationship.predicate }));
    if (!(await entityExists({ type: relationship.sourceType, id: relationship.sourceId }, db))) issues.push(error("MISSING_RELATIONSHIP_SOURCE", `Relationship:${relationship.id}`, "Relationship source does not exist."));
    if (!(await entityExists({ type: relationship.targetType, id: relationship.targetId }, db))) issues.push(error("MISSING_RELATIONSHIP_TARGET", `Relationship:${relationship.id}`, "Relationship target does not exist."));
  }
  const aliases = await db.entityAlias.findMany({ select: { id: true, entityType: true, entityId: true } });
  for (const alias of aliases) {
    if (!isEntityType(alias.entityType) || !(await entityExists({ type: alias.entityType, id: alias.entityId }, db))) issues.push(error("INVALID_ALIAS_TARGET", `EntityAlias:${alias.id}`, "Alias target does not exist."));
  }
  return issues;
}
