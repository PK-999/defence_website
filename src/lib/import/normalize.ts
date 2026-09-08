import { parseHistoricalDate, HistoricalDateError } from "@/lib/domain/dates";
import { isEntityType, type EntityType } from "@/lib/domain/entities";
import { normalizeAwards, normalizeDevelopmentModel, normalizeDomain, normalizeOperationCategory, normalizeRank, normalizeService, normalizeServiceStatus } from "@/lib/domain/taxonomy";
import { normalizeEquipmentSpecs } from "@/lib/domain/equipment";
import type { ValidationIssue } from "@/lib/domain/types";

export type ImportRecord = { entityType: EntityType; externalId: string; data: Record<string, unknown> };
export type NormalizedRecord = ImportRecord & { issues: ValidationIssue[]; raw: Record<string, unknown> };
export type NormalizedImport = { schemaVersion: 1; sourceSystem: string; records: NormalizedRecord[]; issues: ValidationIssue[] };

function issue(code: string, path: string, message: string, severity: "error" | "warning" = "error"): ValidationIssue {
  return { code, path, message, severity };
}

function normalizeDateField(data: Record<string, unknown>, field: string, issues: ValidationIssue[], path: string): void {
  const value = data[field];
  if (value === undefined || value === null) return;
  if (typeof value !== "string") {
    issues.push(issue("INVALID_DATE", path, "Date must be a string or null."));
    return;
  }
  try {
    const parsed = parseHistoricalDate(value);
    data[field] = parsed.iso;
    data[`${field}Precision`] = parsed.precision;
    data[`${field}Original`] = parsed.original;
  } catch (error) {
    const code = error instanceof HistoricalDateError ? error.code : "INVALID_DATE";
    issues.push(issue(code, path, error instanceof Error ? error.message : "Invalid date."));
  }
}

function normalizeRecord(record: unknown, index: number): NormalizedRecord | null {
  const path = `records[${index}]`;
  if (typeof record !== "object" || record === null) return null;
  const candidate = record as Record<string, unknown>;
  const entityType = candidate.entityType;
  const externalId = candidate.externalId;
  const rawData = candidate.data;
  const issues: ValidationIssue[] = [];
  if (!isEntityType(entityType)) issues.push(issue("UNKNOWN_ENTITY_TYPE", `${path}.entityType`, "Entity type is not supported."));
  if (typeof externalId !== "string" || !externalId.trim()) issues.push(issue("MISSING_EXTERNAL_ID", `${path}.externalId`, "externalId is required."));
  if (typeof rawData !== "object" || rawData === null || Array.isArray(rawData)) issues.push(issue("INVALID_RECORD_DATA", `${path}.data`, "data must be an object."));
  if (!isEntityType(entityType) || typeof externalId !== "string" || typeof rawData !== "object" || rawData === null || Array.isArray(rawData)) return null;

  const data = { ...(rawData as Record<string, unknown>) };
  const raw = { ...data };
  const dateFields = entityType === "Person" ? ["birthDate", "deathDate"] : ["dateStart", "dateEnd"];
  dateFields.forEach((field) => normalizeDateField(data, field, issues, `${path}.data.${field}`));
  if (entityType === "Equipment") {
    const domain = normalizeDomain(typeof data.domain === "string" ? data.domain : null);
    const status = normalizeServiceStatus(typeof data.serviceStatus === "string" ? data.serviceStatus : null);
    const model = normalizeDevelopmentModel(typeof data.developmentModel === "string" ? data.developmentModel : null);
    data.domain = domain.value; data.serviceStatus = status.value; data.developmentModel = model.value;
    issues.push(...domain.issues.map((item) => ({ ...item, path: `${path}.data.domain` })));
    issues.push(...status.issues.map((item) => ({ ...item, path: `${path}.data.serviceStatus` })));
    issues.push(...model.issues.map((item) => ({ ...item, path: `${path}.data.developmentModel` })));
    const specs = normalizeEquipmentSpecs(data.specs);
    data.specs = specs.value;
    issues.push(...specs.issues.map((item) => ({ ...item, path: `${path}.${item.path}` })));
  }
  if (entityType === "Operation") {
    const category = normalizeOperationCategory(typeof data.category === "string" ? data.category : null);
    data.category = category.value;
    issues.push(...category.issues.map((item) => ({ ...item, path: `${path}.data.category` })));
  }
  if (entityType === "Person") {
    const rank = normalizeRank(typeof data.rank === "string" ? data.rank : null);
    const service = normalizeService(typeof data.serviceBranch === "string" ? data.serviceBranch : null);
    const awards = normalizeAwards(data.decorations ?? data.awards);
    data.rank = rank.value;
    data.serviceBranch = service.value;
    data.decorations = awards.value;
    issues.push(...rank.issues.map((item) => ({ ...item, path: `${path}.data.rank` })));
    issues.push(...service.issues.map((item) => ({ ...item, path: `${path}.data.serviceBranch` })));
    issues.push(...awards.issues.map((item) => ({ ...item, path: `${path}.data.decorations` })));
  }
  return { entityType, externalId: externalId.trim(), data, raw, issues };
}

export function normalizeImport(input: unknown): NormalizedImport {
  const envelope = Array.isArray(input) ? { schemaVersion: 1, sourceSystem: "unspecified", records: input } : input;
  const issues: ValidationIssue[] = [];
  if (typeof envelope !== "object" || envelope === null || Array.isArray(envelope)) {
    return { schemaVersion: 1, sourceSystem: "unspecified", records: [], issues: [issue("INVALID_IMPORT", "", "Import must be an envelope or record array.")] };
  }
  const object = envelope as Record<string, unknown>;
  if (object.schemaVersion !== 1) issues.push(issue("UNSUPPORTED_SCHEMA_VERSION", "schemaVersion", "Only schemaVersion 1 is supported."));
  const sourceSystem = typeof object.sourceSystem === "string" && object.sourceSystem.trim() ? object.sourceSystem.trim() : "unspecified";
  if (!Array.isArray(object.records)) return { schemaVersion: 1, sourceSystem, records: [], issues: [...issues, issue("INVALID_RECORDS", "records", "records must be an array.")] };
  const records: NormalizedRecord[] = [];
  object.records.forEach((record, index) => {
    const normalized = normalizeRecord(record, index);
    if (normalized) {
      records.push(normalized);
      return;
    }
    const path = `records[${index}]`;
    if (typeof record !== "object" || record === null || Array.isArray(record)) {
      issues.push(issue("INVALID_RECORD", path, "Each record must be an object."));
      return;
    }
    const candidate = record as Record<string, unknown>;
    if (!isEntityType(candidate.entityType)) issues.push(issue("UNKNOWN_ENTITY_TYPE", `${path}.entityType`, "Entity type is not supported."));
    if (typeof candidate.externalId !== "string" || !candidate.externalId.trim()) issues.push(issue("MISSING_EXTERNAL_ID", `${path}.externalId`, "externalId is required."));
    if (typeof candidate.data !== "object" || candidate.data === null || Array.isArray(candidate.data)) issues.push(issue("INVALID_RECORD_DATA", `${path}.data`, "data must be an object."));
  });
  return { schemaVersion: 1, sourceSystem, records, issues: [...issues, ...records.flatMap((record) => record.issues)] };
}
