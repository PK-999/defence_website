import { createHash } from "node:crypto";
import { PrismaClient, type Prisma } from "@prisma/client";
import { normalizeImport, type NormalizedImport, type NormalizedRecord } from "./normalize";
import type { EntityType } from "@/lib/domain/entities";
import type { ValidationIssue } from "@/lib/domain/types";

export type ImportMode = "validate" | "dry-run" | "apply";
export type ImportReport = {
  inputHash: string;
  schemaVersion: number;
  sourceSystem: string;
  mode: ImportMode;
  status: "VALIDATED" | "DRY_RUN" | "APPLIED" | "REJECTED" | "UNCHANGED";
  proposedCreates: number;
  proposedUpdates: number;
  unchanged: number;
  conflicts: number;
  warnings: ValidationIssue[];
  errors: ValidationIssue[];
  records: Array<{ entityType: EntityType; externalId: string; action: "create" | "proposal" | "unchanged" | "rejected" }>;
};

type ImportOptions = { databaseUrl?: string; client?: PrismaClient };
type Existing = { id: string; publicationStatus?: string; revision?: number } | null;

function hashInput(input: unknown): string {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

function commonData(record: NormalizedRecord): { slug: string; title: string; summary: string; content: string | null; status: string; publicationStatus: string; contentKind: string } {
  const data = record.data;
  return {
    slug: data.slug as string,
    title: data.title as string,
    summary: data.summary as string,
    content: typeof data.content === "string" ? data.content : null,
    status: typeof data.status === "string" ? data.status : "Imported",
    publicationStatus: "DRAFT",
    contentKind: "EDITORIAL",
  };
}

function requiredIssues(record: NormalizedRecord): ValidationIssue[] {
  const path = `records.${record.externalId}.data`;
  const issues: ValidationIssue[] = [];
  for (const field of ["slug", "title", "summary"]) {
    if (typeof record.data[field] !== "string" || !(record.data[field] as string).trim()) {
      issues.push({ code: "MISSING_REQUIRED_FIELD", path: `${path}.${field}`, message: `${field} is required.`, severity: "error" });
    }
  }
  if ((record.entityType === "Conflict" || record.entityType === "Operation") && typeof record.data.dateStart !== "string") {
    issues.push({ code: "MISSING_REQUIRED_FIELD", path: `${path}.dateStart`, message: "dateStart is required.", severity: "error" });
  }
  if (record.entityType === "Person" && typeof record.data.fullName !== "string") {
    issues.push({ code: "MISSING_REQUIRED_FIELD", path: `${path}.fullName`, message: "fullName is required.", severity: "error" });
  }
  if (record.entityType === "Operation" && typeof record.data.category !== "string") {
    issues.push({ code: "MISSING_REQUIRED_FIELD", path: `${path}.category`, message: "category is required.", severity: "error" });
  }
  if (record.entityType === "Equipment" && typeof record.data.domain !== "string") {
    issues.push({ code: "MISSING_REQUIRED_FIELD", path: `${path}.domain`, message: "domain is required.", severity: "error" });
  }
  if (record.entityType === "Source" && typeof record.data.sourceFamilyId !== "string") {
    issues.push({ code: "MISSING_REQUIRED_FIELD", path: `${path}.sourceFamilyId`, message: "sourceFamilyId is required.", severity: "error" });
  }
  return issues;
}

async function entityById(tx: Prisma.TransactionClient, entityType: EntityType, id: string): Promise<Existing> {
  switch (entityType) {
    case "Conflict": return tx.conflict.findUnique({ where: { id }, select: { id: true, publicationStatus: true, revision: true } });
    case "Operation": return tx.operation.findUnique({ where: { id }, select: { id: true, publicationStatus: true, revision: true } });
    case "Person": return tx.person.findUnique({ where: { id }, select: { id: true, publicationStatus: true, revision: true } });
    case "Equipment": return tx.equipment.findUnique({ where: { id }, select: { id: true, publicationStatus: true, revision: true } });
    case "Unit": return tx.unit.findUnique({ where: { id }, select: { id: true, publicationStatus: true, revision: true } });
    case "Source": return tx.source.findUnique({ where: { id }, select: { id: true, publicationStatus: true, revision: true } });
  }
}

async function existingEntity(tx: Prisma.TransactionClient, sourceSystem: string, record: NormalizedRecord): Promise<Existing> {
  const identity = await tx.importIdentity.findUnique({ where: { sourceSystem_externalId_entityType: { sourceSystem, externalId: record.externalId, entityType: record.entityType } }, select: { entityId: true } });
  if (identity) return entityById(tx, record.entityType, identity.entityId);
  const slug = record.data.slug;
  if (typeof slug !== "string") return null;
  switch (record.entityType) {
    case "Conflict": return tx.conflict.findUnique({ where: { slug }, select: { id: true, publicationStatus: true, revision: true } });
    case "Operation": return tx.operation.findUnique({ where: { slug }, select: { id: true, publicationStatus: true, revision: true } });
    case "Person": return tx.person.findUnique({ where: { slug }, select: { id: true, publicationStatus: true, revision: true } });
    case "Equipment": return tx.equipment.findUnique({ where: { slug }, select: { id: true, publicationStatus: true, revision: true } });
    case "Unit": return tx.unit.findUnique({ where: { slug }, select: { id: true, publicationStatus: true, revision: true } });
    case "Source": return tx.source.findUnique({ where: { slug }, select: { id: true, publicationStatus: true, revision: true } });
  }
}

async function createEntity(tx: Prisma.TransactionClient, record: NormalizedRecord): Promise<string> {
  const data = record.data;
  const base = commonData(record);
  switch (record.entityType) {
    case "Conflict": {
      const row = await tx.conflict.create({ data: { ...base, dateStart: data.dateStart as string, dateEnd: typeof data.dateEnd === "string" ? data.dateEnd : null, dateStartPrecision: typeof data.dateStartPrecision === "string" ? data.dateStartPrecision : "unknown", dateEndPrecision: typeof data.dateEndPrecision === "string" ? data.dateEndPrecision : "unknown", theatres: JSON.stringify(Array.isArray(data.theatres) ? data.theatres : []) } });
      return row.id;
    }
    case "Operation": {
      const row = await tx.operation.create({ data: { ...base, category: data.category as string, dateStart: data.dateStart as string, dateEnd: typeof data.dateEnd === "string" ? data.dateEnd : null, dateStartPrecision: typeof data.dateStartPrecision === "string" ? data.dateStartPrecision : "unknown", dateEndPrecision: typeof data.dateEndPrecision === "string" ? data.dateEndPrecision : "unknown" } });
      return row.id;
    }
    case "Person": {
      const row = await tx.person.create({ data: { ...base, fullName: data.fullName as string, rank: typeof data.rank === "string" ? data.rank : null, serviceBranch: typeof data.serviceBranch === "string" ? data.serviceBranch : null, decorations: JSON.stringify(Array.isArray(data.decorations) ? data.decorations : []), birthDate: typeof data.birthDate === "string" ? data.birthDate : null, deathDate: typeof data.deathDate === "string" ? data.deathDate : null, birthDatePrecision: typeof data.birthDatePrecision === "string" ? data.birthDatePrecision : "unknown", deathDatePrecision: typeof data.deathDatePrecision === "string" ? data.deathDatePrecision : "unknown" } });
      return row.id;
    }
    case "Equipment": {
      const row = await tx.equipment.create({ data: { ...base, domain: data.domain as string, category: typeof data.category === "string" ? data.category : "unknown", developmentModel: typeof data.developmentModel === "string" ? data.developmentModel : "unknown", serviceStatus: typeof data.serviceStatus === "string" ? data.serviceStatus : "unknown", originCountries: JSON.stringify(Array.isArray(data.originCountries) ? data.originCountries : []), specs: JSON.stringify(data.specs ?? []) } });
      return row.id;
    }
    case "Unit": {
      const row = await tx.unit.create({ data: { slug: data.slug as string, title: data.title as string, summary: data.summary as string, content: typeof data.content === "string" ? data.content : null, unitType: typeof data.unitType === "string" ? data.unitType : "unknown", serviceId: typeof data.serviceId === "string" ? data.serviceId : null, ranksJson: JSON.stringify(data.ranks ?? []), awardsJson: JSON.stringify(data.awards ?? []), publicationStatus: "DRAFT", contentKind: "EDITORIAL" } });
      return row.id;
    }
    case "Source": {
      if (typeof data.sourceFamilyId !== "string") throw new Error("SOURCE_FAMILY_REQUIRED");
      const row = await tx.source.create({ data: { slug: data.slug as string, title: data.title as string, summary: data.summary as string, sourceFamilyId: data.sourceFamilyId, author: typeof data.author === "string" ? data.author : null, publicationDate: typeof data.publicationDate === "string" ? data.publicationDate : null, publisher: typeof data.publisher === "string" ? data.publisher : null, canonicalUrl: typeof data.canonicalUrl === "string" ? data.canonicalUrl : null, sourceType: typeof data.sourceType === "string" ? data.sourceType : null, tier: typeof data.tier === "string" ? data.tier : null, publicationStatus: "DRAFT", contentKind: "EDITORIAL" } });
      return row.id;
    }
  }
}

export async function importContent(input: unknown, mode: ImportMode, options: ImportOptions = {}): Promise<ImportReport> {
  const normalized: NormalizedImport = normalizeImport(input);
  const inputHash = hashInput(input);
  const errors = [...normalized.issues, ...normalized.records.flatMap(requiredIssues)].filter((item) => item.severity === "error");
  const warnings = [...normalized.issues, ...normalized.records.flatMap((record) => record.issues)].filter((item) => item.severity === "warning");
  const report: ImportReport = { inputHash, schemaVersion: normalized.schemaVersion, sourceSystem: normalized.sourceSystem, mode, status: errors.length ? "REJECTED" : mode === "validate" ? "VALIDATED" : mode === "dry-run" ? "DRY_RUN" : "APPLIED", proposedCreates: errors.length ? 0 : normalized.records.length, proposedUpdates: 0, unchanged: 0, conflicts: 0, warnings, errors, records: normalized.records.map((record) => ({ entityType: record.entityType, externalId: record.externalId, action: errors.length ? "rejected" : "create" })) };
  if (mode !== "apply" || errors.length) return report;
  if (!options.client && !options.databaseUrl) throw new Error("IMPORT_DATABASE_REQUIRED");

  const db = options.client ?? new PrismaClient({ datasources: { db: { url: options.databaseUrl } } });
  try {
    const existingRun = await db.importRun.findUnique({ where: { inputHash } });
    if (existingRun) return { ...report, status: "UNCHANGED", proposedCreates: 0, unchanged: normalized.records.length, records: normalized.records.map((record) => ({ entityType: record.entityType, externalId: record.externalId, action: "unchanged" })) };
    return await db.$transaction(async (tx) => {
      const run = await tx.importRun.create({ data: { inputHash, schemaVersion: normalized.schemaVersion, status: "APPLYING", reportJson: JSON.stringify(report) } });
      let creates = 0; let unchanged = 0; let conflicts = 0;
      const records = [] as ImportReport["records"];
      for (const record of normalized.records) {
        const existing = await existingEntity(tx, normalized.sourceSystem, record);
        if (existing?.publicationStatus === "PUBLISHED") {
          await tx.importProposal.create({ data: { importRunId: run.id, entityType: record.entityType, entityId: existing.id, expectedRevision: existing.revision ?? 0, proposedDataJson: JSON.stringify(record.data), originalDataJson: JSON.stringify(existing), issuesJson: JSON.stringify(record.issues), status: "CANDIDATE" } });
          conflicts += 1; records.push({ entityType: record.entityType, externalId: record.externalId, action: "proposal" });
          continue;
        }
        if (existing) { unchanged += 1; records.push({ entityType: record.entityType, externalId: record.externalId, action: "unchanged" }); continue; }
        const entityId = await createEntity(tx, record);
        await tx.importIdentity.create({ data: { sourceSystem: normalized.sourceSystem, externalId: record.externalId, entityType: record.entityType, entityId } });
        creates += 1; records.push({ entityType: record.entityType, externalId: record.externalId, action: "create" });
      }
      const finalReport = { ...report, status: "APPLIED" as const, proposedCreates: creates, unchanged, conflicts, records };
      await tx.importRun.update({ where: { id: run.id }, data: { status: "APPLIED", reportJson: JSON.stringify(finalReport) } });
      return finalReport;
    });
  } finally {
    if (!options.client) await db.$disconnect();
  }
}
