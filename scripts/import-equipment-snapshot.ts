import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient, type Prisma } from "@prisma/client";
import { equipmentResearchSlug, equipmentSourceId, equipmentSourceSlug, mapEquipmentResearchRecord, type EquipmentImportRow, type EquipmentResearchRow } from "../src/lib/equipment-research-import";
import { formatEquipmentValue } from "../src/lib/equipment-presentation";
import { rebuildSearchDocument } from "../src/lib/search/service";

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_INPUT = path.join(ROOT, "indian_military_data", "equipment_records.json");
const SOURCE_SYSTEM = "indian-equipment-research-snapshot-2026-09-15";
const ACTOR = "equipment-research-snapshot-2026-09-15";
const REVIEWED_AT = new Date("2026-09-15T00:00:00.000Z");
const SOURCE_FAMILY_SLUG = "equipment-research-snapshot-2026-09-15";

const legacyDomain: Record<string, string> = { air: "airforce", Air: "airforce", land: "army", Land: "army", sea: "navy", Sea: "navy", support: "airforce" };
const legacyCategory: Record<string, string> = { "Aircraft Carrier": "ships", "Fighter Aircraft": "aircraft", "Main Battle Tank": "armoured-vehicles", "Missile Boat": "ships", "Towed Artillery": "artillery", "Transport Helicopter": "helicopters" };

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function stableId(prefix: string, value: string): string {
  return `${prefix}-${createHash("sha256").update(value).digest("hex").slice(0, 24)}`;
}

function humanize(value: string): string {
  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function parseRows(input: unknown): EquipmentResearchRow[] {
  if (!Array.isArray(input)) throw new Error("EQUIPMENT_SNAPSHOT_MUST_BE_AN_ARRAY");
  const rows = input.filter((row): row is EquipmentResearchRow => Boolean(row && typeof row === "object" && !Array.isArray(row)));
  if (rows.length !== input.length) throw new Error("EQUIPMENT_SNAPSHOT_HAS_INVALID_ROWS");
  const ids = new Set<string>();
  for (const row of rows) {
    const id = typeof row.record_id === "string" ? row.record_id : "";
    if (!id || ids.has(id)) throw new Error(`EQUIPMENT_SNAPSHOT_DUPLICATE_OR_MISSING_ID:${id || "missing"}`);
    ids.add(id);
  }
  return rows;
}

function inputHash(rows: EquipmentResearchRow[]): string {
  return createHash("sha256").update(JSON.stringify(rows)).digest("hex");
}

async function ensureSource(tx: Prisma.TransactionClient, row: EquipmentResearchRow): Promise<{ sourceId: string; evidenceId: string }> {
  const sourceKey = typeof row.source_key === "string" ? row.source_key : "unknown-source";
  const sourceSlug = equipmentSourceSlug(sourceKey);
  const sourceId = equipmentSourceId(sourceKey);
  const family = await tx.sourceFamily.upsert({
    where: { slug: SOURCE_FAMILY_SLUG },
    update: { name: "Indian defence equipment research snapshot", tier: "B", description: "Source registry for the dated, source-attributed equipment snapshot." },
    create: { id: stableId("source-family", SOURCE_FAMILY_SLUG), slug: SOURCE_FAMILY_SLUG, name: "Indian defence equipment research snapshot", tier: "B", description: "Source registry for the dated, source-attributed equipment snapshot." },
  });
  const sourceUrl = typeof row.source_url === "string" ? row.source_url : null;
  const source = await tx.source.upsert({
    where: { slug: sourceSlug },
    update: { title: `Equipment source: ${humanize(sourceKey)}`, summary: `Dated source page used for the ${humanize(sourceKey)} equipment records.`, publisher: sourceKey.includes("official") ? "Press Information Bureau / DRDO" : "Source snapshot", canonicalUrl: sourceUrl, sourceType: sourceKey.includes("official") ? "official-record" : "reference-table", tier: sourceKey.includes("official") ? "A" : "B", rightsNotes: "Citation retained; source text is not reproduced.", publicationStatus: "PUBLISHED", contentKind: "EDITORIAL", reviewedAt: REVIEWED_AT, reviewedBy: ACTOR },
    create: { id: sourceId, sourceFamilyId: family.id, slug: sourceSlug, title: `Equipment source: ${humanize(sourceKey)}`, summary: `Dated source page used for the ${humanize(sourceKey)} equipment records.`, publisher: sourceKey.includes("official") ? "Press Information Bureau / DRDO" : "Source snapshot", canonicalUrl: sourceUrl, sourceType: sourceKey.includes("official") ? "official-record" : "reference-table", tier: sourceKey.includes("official") ? "A" : "B", rightsNotes: "Citation retained; source text is not reproduced.", publicationStatus: "PUBLISHED", contentKind: "EDITORIAL", reviewedAt: REVIEWED_AT, reviewedBy: ACTOR },
  });
  const versionId = stableId("source-version", sourceKey);
  await tx.sourceVersion.upsert({
    where: { id: versionId },
    update: { versionTag: "Equipment snapshot retrieval", accessedAt: REVIEWED_AT, url: sourceUrl, format: "html-table", parserVersion: "equipment-scratch-2026-09-15", httpStatus: 200 },
    create: { id: versionId, sourceId: source.id, versionTag: "Equipment snapshot retrieval", accessedAt: REVIEWED_AT, url: sourceUrl, format: "html-table", parserVersion: "equipment-scratch-2026-09-15", httpStatus: 200 },
  });
  const evidenceId = stableId("equipment-evidence", String(row.record_id));
  const locator = `Source table ${String(row.source_table ?? "not documented")}, row ${String(row.source_row ?? "not documented")}`;
  await tx.evidence.upsert({
    where: { id: evidenceId },
    update: { sourceVersionId: versionId, locator, quote: null, rightsSafeToDisplay: false, evidenceType: "TABLE_ROW", authorityType: sourceKey.includes("official") ? "official-record" : "reference-table", authorityBasis: sourceKey },
    create: { id: evidenceId, sourceVersionId: versionId, locator, quote: null, rightsSafeToDisplay: false, evidenceType: "TABLE_ROW", authorityType: sourceKey.includes("official") ? "official-record" : "reference-table", authorityBasis: sourceKey },
  });
  return { sourceId: source.id, evidenceId };
}

async function upsertEquipment(tx: Prisma.TransactionClient, row: EquipmentResearchRow, sourceEvidence: { evidenceId: string }): Promise<string> {
  const mapped = mapEquipmentResearchRecord(row);
  const equipment = await tx.equipment.upsert({
    where: { slug: equipmentResearchSlug(mapped.title, mapped.externalId) },
    update: { title: mapped.title, domain: mapped.domain, category: mapped.category, summary: mapped.summary, content: mapped.content, status: mapped.status, developmentModel: mapped.developmentModel, serviceStatus: mapped.serviceStatus, inductedYear: mapped.inductedYear, retiredYear: mapped.retiredYear, originCountries: JSON.stringify(mapped.originCountries), specs: JSON.stringify(mapped.specs), variantLabel: mapped.variantLabel, statusAsOf: mapped.statusAsOf, publicationStatus: "PUBLISHED", contentKind: "EDITORIAL", reviewedAt: REVIEWED_AT, reviewedBy: ACTOR },
    create: { id: stableId("equipment", mapped.externalId), slug: mapped.slug, title: mapped.title, domain: mapped.domain, category: mapped.category, summary: mapped.summary, content: mapped.content, status: mapped.status, developmentModel: mapped.developmentModel, serviceStatus: mapped.serviceStatus, inductedYear: mapped.inductedYear, retiredYear: mapped.retiredYear, originCountries: JSON.stringify(mapped.originCountries), specs: JSON.stringify(mapped.specs), variantLabel: mapped.variantLabel, statusAsOf: mapped.statusAsOf, publicationStatus: "PUBLISHED", contentKind: "EDITORIAL", reviewedAt: REVIEWED_AT, reviewedBy: ACTOR },
  });
  for (const section of ["summary", "content"]) {
    await tx.entityEvidence.upsert({ where: { entityType_entityId_section_evidenceId: { entityType: "Equipment", entityId: equipment.id, section, evidenceId: sourceEvidence.evidenceId } }, update: {}, create: { entityType: "Equipment", entityId: equipment.id, section, evidenceId: sourceEvidence.evidenceId } });
  }
  await tx.importIdentity.upsert({ where: { sourceSystem_externalId_entityType: { sourceSystem: SOURCE_SYSTEM, externalId: mapped.externalId, entityType: "Equipment" } }, update: { entityId: equipment.id }, create: { sourceSystem: SOURCE_SYSTEM, externalId: mapped.externalId, entityType: "Equipment", entityId: equipment.id } });
  return equipment.id;
}

function fallbackLegacyCategory(title: string, category: string): string {
  if (legacyCategory[category]) return legacyCategory[category];
  if (/apache|chinook|helicopter|lch|mi-17/i.test(title)) return "helicopters";
  if (/aircraft|c-17|kc-135|mig-21|p-8|rafale/i.test(title)) return "aircraft";
  if (/ins |boat|ship|craft|carrier|frigate|destroyer|submarine/i.test(title)) return "ships";
  if (/atags|artillery|k9/i.test(title)) return "artillery";
  if (/missile/i.test(title)) return "missiles";
  if (/vehicle|mobility/i.test(title)) return "support-equipment";
  return category === "Defence equipment" ? "other" : category;
}

async function normalizeExistingEquipment(tx: Prisma.TransactionClient, mappedRows: EquipmentImportRow[]): Promise<string[]> {
  const importedByTitle = new Map<string, EquipmentImportRow[]>();
  for (const row of mappedRows) importedByTitle.set(row.title.toLowerCase(), [...(importedByTitle.get(row.title.toLowerCase()) ?? []), row]);
  const existing = await tx.equipment.findMany({ select: { id: true, slug: true, title: true, domain: true, category: true, serviceStatus: true, summary: true } });
  const changed: string[] = [];
  for (const row of existing) {
    if (row.slug.startsWith("equipment-")) continue;
    const normalizedDomain = legacyDomain[row.domain] ?? row.domain;
    const matching = importedByTitle.get(row.title.toLowerCase())?.find((candidate) => candidate.domain === normalizedDomain);
    const normalizedCategory = matching?.category ?? fallbackLegacyCategory(row.title, row.category);
    const normalizedStatus = matching?.serviceStatus ?? ({ active: "Deployed", planned: "Planned", retired: "Decommissioned", decommissioned: "Decommissioned" }[row.serviceStatus] ?? row.serviceStatus);
    const genericSummary = /source-backed technical facts|configuration scope and limitations|source scope varies|dated, source-attributed research snapshot/i.test(row.summary);
    const readableSummary = genericSummary ? `${row.title} is listed for ${formatEquipmentValue("domain", normalizedDomain)} with a ${formatEquipmentValue("serviceStatus", normalizedStatus).toLowerCase()} status.` : row.summary;
    if (normalizedDomain === row.domain && normalizedCategory === row.category && normalizedStatus === row.serviceStatus && readableSummary === row.summary) continue;
    await tx.equipment.update({ where: { id: row.id }, data: { domain: normalizedDomain, category: normalizedCategory, serviceStatus: normalizedStatus, summary: readableSummary } });
    changed.push(row.id);
  }
  return changed;
}

async function main(): Promise<void> {
  const mode = arg("--mode") ?? "validate";
  if (!(mode === "validate" || mode === "dry-run" || mode === "apply")) throw new Error("EQUIPMENT_SNAPSHOT_MODE_INVALID");
  if (mode === "apply" && process.env.EQUIPMENT_SNAPSHOT_APPLY_CONFIRM !== "I_UNDERSTAND") throw new Error("EQUIPMENT_SNAPSHOT_APPLY_CONFIRM_REQUIRED");
  const inputPath = path.resolve(arg("--input") ?? DEFAULT_INPUT);
  const rows = parseRows(JSON.parse(await readFile(inputPath, "utf8")) as unknown);
  const mapped = rows.map(mapEquipmentResearchRecord);
  const report = { sourceSystem: SOURCE_SYSTEM, inputPath, inputHash: inputHash(rows), mode, rows: rows.length, domains: Object.fromEntries([...new Set(mapped.map((row) => row.domain))].map((domain) => [domain, mapped.filter((row) => row.domain === domain).length])), statuses: Object.fromEntries([...new Set(mapped.map((row) => row.serviceStatus))].map((status) => [status, mapped.filter((row) => row.serviceStatus === status).length])) };
  if (mode !== "apply") { console.log(JSON.stringify(report, null, 2)); return; }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL_REQUIRED");
  const db = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
  const ids: string[] = [];
  try {
    await db.$transaction(async (tx) => {
      ids.push(...await normalizeExistingEquipment(tx, mapped));
      for (const row of rows) {
        const evidence = await ensureSource(tx, row);
        ids.push(await upsertEquipment(tx, row, evidence));
      }
      await tx.importRun.upsert({ where: { inputHash: report.inputHash }, update: { status: "APPLIED", reportJson: JSON.stringify(report) }, create: { inputHash: report.inputHash, schemaVersion: 1, status: "APPLIED", reportJson: JSON.stringify(report) } });
    }, { maxWait: 10000, timeout: 120000 });
    for (const id of ids) await rebuildSearchDocument(db, { type: "Equipment", id });
    console.log(JSON.stringify({ ...report, status: "APPLIED", imported: ids.length }, null, 2));
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
