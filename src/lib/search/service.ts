import type { Prisma, PrismaClient } from "@prisma/client";
import { entityRoutes, isEntityType, type EntityRef, type EntityType } from "@/lib/domain/entities";
import type { CollectionItem } from "@/lib/domain/types";
import { publicWhere } from "@/lib/repositories/publication";

type Database = PrismaClient | Prisma.TransactionClient;
export type SearchMode = "quick" | "full";
export type SearchInput = { q: string; type?: string; page?: number; pageSize?: number; mode?: SearchMode };
export type SearchResult = CollectionItem & { type: EntityType; score: number };
export type SearchResponse = { results: SearchResult[]; total: number; page: number; pageSize: number; pageCount: number };
const types = new Set<EntityType>(["Conflict", "Operation", "Person", "Equipment", "Unit", "Source"]);
const normalize = (value: string) => value.normalize("NFKC").trim().toLocaleLowerCase();
const href = (type: EntityType, slug: string) => `${entityRoutes[type]}/${encodeURIComponent(slug)}`;

function projectionData(ref: EntityRef, db: Database) {
  const select = { id: true, slug: true, title: true, summary: true, content: true, revision: true } as const;
  switch (ref.type) {
    case "Conflict": return db.conflict.findUnique({ where: { id: ref.id }, select });
    case "Operation": return db.operation.findUnique({ where: { id: ref.id }, select });
    case "Person": return db.person.findUnique({ where: { id: ref.id }, select });
    case "Equipment": return db.equipment.findUnique({ where: { id: ref.id }, select });
    case "Unit": return db.unit.findUnique({ where: { id: ref.id }, select });
    case "Source": return db.source.findUnique({ where: { id: ref.id }, select: { id: true, slug: true, title: true, summary: true, revision: true } });
  }
}

export async function rebuildSearchDocument(tx: Database, ref: EntityRef): Promise<void> {
  const row = await projectionData(ref, tx);
  await tx.searchDocument.deleteMany({ where: { entityType: ref.type, entityId: ref.id } });
  if (!row) return;
  const publicRow = await (async () => {
    switch (ref.type) {
      case "Conflict": return tx.conflict.findFirst({ where: { id: ref.id, ...publicWhere() }, select: { id: true } });
      case "Operation": return tx.operation.findFirst({ where: { id: ref.id, ...publicWhere() }, select: { id: true } });
      case "Person": return tx.person.findFirst({ where: { id: ref.id, ...publicWhere() }, select: { id: true } });
      case "Equipment": return tx.equipment.findFirst({ where: { id: ref.id, ...publicWhere() }, select: { id: true } });
      case "Unit": return tx.unit.findFirst({ where: { id: ref.id, ...publicWhere() }, select: { id: true } });
      case "Source": return tx.source.findFirst({ where: { id: ref.id, ...publicWhere() }, select: { id: true } });
    }
  })();
  if (!publicRow) return;
  const aliases = await tx.entityAlias.findMany({ where: { entityType: ref.type, entityId: ref.id, normalizedAlias: { not: null } }, select: { normalizedAlias: true } });
  await tx.searchDocument.create({ data: { id: `${ref.type}:${ref.id}`, entityType: ref.type, entityId: ref.id, slug: row.slug, title: row.title, titleNormalized: normalize(row.title), summary: row.summary, summaryNormalized: normalize(row.summary), bodyNormalized: normalize("content" in row ? row.content ?? "" : ""), entityRevision: row.revision, aliases: { create: aliases.flatMap((alias) => alias.normalizedAlias ? [{ normalizedAlias: normalize(alias.normalizedAlias) }] : []) } } });
}

export async function reconcileSearchIndex(db: PrismaClient): Promise<number> {
  let count = 0;
  for (const type of types) {
    const rows = await (type === "Conflict" ? db.conflict.findMany({ where: publicWhere(), select: { id: true } }) : type === "Operation" ? db.operation.findMany({ where: publicWhere(), select: { id: true } }) : type === "Person" ? db.person.findMany({ where: publicWhere(), select: { id: true } }) : type === "Equipment" ? db.equipment.findMany({ where: publicWhere(), select: { id: true } }) : type === "Unit" ? db.unit.findMany({ where: publicWhere(), select: { id: true } }) : db.source.findMany({ where: publicWhere(), select: { id: true } }));
    for (const row of rows) { await rebuildSearchDocument(db, { type, id: row.id }); count += 1; }
  }
  return count;
}

function rank(row: { titleNormalized: string; summaryNormalized: string; bodyNormalized: string; aliases: Array<{ normalizedAlias: string }> }, q: string): number {
  if (row.titleNormalized === q) return 1000; if (row.aliases.some((alias) => alias.normalizedAlias === q)) return 900; if (row.titleNormalized.startsWith(q)) return 800; if (row.aliases.some((alias) => alias.normalizedAlias.startsWith(q))) return 700; if (row.summaryNormalized.includes(q)) return 500; if (row.bodyNormalized.includes(q)) return 300; return 100;
}

export async function searchArchive(input: SearchInput, db: PrismaClient): Promise<SearchResponse> {
  const q = normalize(input.q); if (q.length < 2 || q.length > 120) throw new Error("INVALID_QUERY");
  const requestedType = input.type && input.type !== "all" ? input.type : undefined;
  const type = requestedType ? ({ conflict: "Conflict", operation: "Operation", person: "Person", equipment: "Equipment", unit: "Unit", source: "Source" } as Record<string, EntityType>)[requestedType.toLowerCase()] : undefined;
  if (requestedType && (!type || !isEntityType(type))) throw new Error("INVALID_TYPE");
  const pageSize = Math.min(24, Math.max(1, Math.trunc(input.pageSize ?? (input.mode === "quick" ? 8 : 24)))); const page = Math.max(1, Math.trunc(input.page ?? 1));
  const where: Prisma.SearchDocumentWhereInput = { ...(type ? { entityType: type } : {}), OR: [{ titleNormalized: { contains: q } }, { summaryNormalized: { contains: q } }, { bodyNormalized: { contains: q } }, { aliases: { some: { normalizedAlias: { contains: q } } } }] };
  const rows = await db.searchDocument.findMany({ where, include: { aliases: { select: { normalizedAlias: true } } }, orderBy: [{ titleNormalized: "asc" }, { id: "asc" }], take: 500 });
  const matching = rows.filter((row) => row.titleNormalized.includes(q) || row.summaryNormalized.includes(q) || row.bodyNormalized.includes(q) || row.aliases.some((alias) => alias.normalizedAlias.includes(q)));
  const ranked = matching.map((row) => ({ row, score: rank(row, q) })).sort((a, b) => b.score - a.score || a.row.title.localeCompare(b.row.title) || a.row.id.localeCompare(b.row.id));
  const pageCount = Math.max(1, Math.ceil(ranked.length / pageSize)); const currentPage = Math.min(page, pageCount); const start = (currentPage - 1) * pageSize;
  return { results: ranked.slice(start, start + pageSize).map(({ row, score }) => ({ type: row.entityType as EntityType, id: row.entityId, slug: row.slug, title: row.title, summary: row.summary, href: href(row.entityType as EntityType, row.slug), facts: [], score })), total: ranked.length, page: currentPage, pageSize, pageCount };
}
