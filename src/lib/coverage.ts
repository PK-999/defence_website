import { readFile } from "node:fs/promises";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";
import { prisma as defaultPrisma } from "@/lib/db";
import { publicWhere } from "@/lib/repositories/publication";
import type { EntityType } from "@/lib/domain/entities";

type CountInput = { knownUniverseSize: number | null; indexed: number; sourced: number; reviewed: number };
type Metric = { count: number; percentage: number | null };
export type CoverageResult = { known: Metric; indexed: Metric; sourced: Metric; reviewed: Metric };

export function calculateCoverage(input: CountInput): CoverageResult {
  const denominator = input.knownUniverseSize && input.knownUniverseSize > 0 ? input.knownUniverseSize : null;
  const metric = (count: number): Metric => ({ count, percentage: denominator === null ? null : Math.round((count / denominator) * 100) });
  return { known: metric(input.knownUniverseSize ?? 0), indexed: metric(input.indexed), sourced: metric(input.sourced), reviewed: metric(input.reviewed) };
}

type CollectionManifest = { slug: string; title: string; knownUniverseSize?: number | null; knownEntityRefs: string[] };
type EntityRow = { id: string; publicationStatus: string; reviewedAt: Date | null; reviewedBy: string | null };
type Database = PrismaClient;

async function findEntity(type: EntityType, ref: string, db: Database): Promise<EntityRow | null> {
  const idOrSlug = ref.split(":").slice(1).join(":");
  if (!idOrSlug) return null;
  const where = { OR: [{ id: idOrSlug }, { slug: idOrSlug }] };
  const select = { id: true, publicationStatus: true, reviewedAt: true, reviewedBy: true } as const;
  switch (type) {
    case "Conflict": return db.conflict.findFirst({ where, select });
    case "Operation": return db.operation.findFirst({ where, select });
    case "Person": return db.person.findFirst({ where, select });
    case "Equipment": return db.equipment.findFirst({ where, select });
    case "Unit": return db.unit.findFirst({ where, select });
    case "Source": return db.source.findFirst({ where, select });
  }
}

function parseRef(ref: string): { type: EntityType; value: string } | null {
  const separator = ref.indexOf(":");
  if (separator < 1) return null;
  const type = ref.slice(0, separator) as EntityType;
  if (!["Conflict", "Operation", "Person", "Equipment", "Unit", "Source"].includes(type)) return null;
  return { type, value: ref };
}

export async function getCollectionCoverage(slug: string, db: Database = defaultPrisma): Promise<{ manifest: CollectionManifest; metrics: CoverageResult }> {
  const manifest = JSON.parse(await readFile(path.join(process.cwd(), "content/collections", `${slug}.json`), "utf8")) as CollectionManifest;
  const rows = await Promise.all(manifest.knownEntityRefs.map(async (ref) => {
    const parsed = parseRef(ref);
    return parsed ? { parsed, row: await findEntity(parsed.type, parsed.value, db) } : { parsed: null, row: null };
  }));
  const indexedRows = rows.filter((item): item is { parsed: { type: EntityType; value: string }; row: EntityRow } => item.row !== null);
  let sourced = 0;
  for (const item of indexedRows) {
    const [direct, claims] = await Promise.all([
      db.entityEvidence.count({ where: { entityType: item.parsed.type, entityId: item.row.id, evidence: { sourceVersion: { source: publicWhere() } } } }),
      db.claim.count({ where: { entityType: item.parsed.type, entityId: item.row.id, status: "GOLD", evidence: { some: { evidence: { sourceVersion: { source: publicWhere() } } } } } }),
    ]);
    if (direct + claims > 0) sourced += 1;
  }
  const reviewed = indexedRows.filter(({ row }) => row.publicationStatus === "PUBLISHED" && row.reviewedAt !== null && Boolean(row.reviewedBy)).length;
  return { manifest, metrics: calculateCoverage({ knownUniverseSize: manifest.knownUniverseSize ?? null, indexed: indexedRows.length, sourced, reviewed }) };
}
