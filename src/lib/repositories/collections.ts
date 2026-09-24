import type { Prisma, PrismaClient } from "@prisma/client";
import { entityRoutes, type EntityType } from "@/lib/domain/entities";
import { historicalDateSortKey } from "@/lib/domain/dates";
import { parseCollectionQuery } from "@/lib/domain/query";
import { extractHeroYear, parseHeroDecorations } from "@/lib/heroes/grouping";
import { prisma } from "@/lib/db";

type Database = PrismaClient;

export interface FeaturedCollection {
  title: string;
  description: string;
  href: string;
}

export async function getFeaturedCollection(_db: Database = prisma): Promise<FeaturedCollection> {
  return {
    title: "Operation Vijay — Kargil 1999",
    description: "Explore the high-altitude conflict in Ladakh, operational timelines, gallantry citations, and tactical records of the 1999 Kargil War.",
    href: "/conflicts/kargil-war-1999",
  };
}

interface CollectionQuery {
  page: number;
  pageSize: number;
  q?: string;
  sort?: string;
  service?: string;
  year?: string;
  conflict?: string;
  medal?: string;
  domain?: string;
  category?: string;
  status?: string;
}

export interface CollectionItem {
  type: EntityType;
  id: string;
  slug: string;
  title: string;
  summary: string;
  href: string;
  facts: Array<{ label: string; value: string }>;
  awards?: string[];
  year?: string;
}

export interface PageResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

function textWhere(q: string | undefined): Prisma.StringFilter | undefined { return q ? { contains: q } : undefined; }

function pageResult<T>(rows: T[], total: number, query: CollectionQuery): PageResult<T> {
  const pageCount = Math.max(1, Math.ceil(total / query.pageSize));
  const current = Math.min(query.page, pageCount);
  return { items: rows, page: current, pageSize: query.pageSize, total, pageCount };
}

function boundedSkip(total: number, query: CollectionQuery): number {
  return Math.min((Math.max(1, query.page) - 1) * query.pageSize, Math.max(0, (Math.max(1, Math.ceil(total / query.pageSize)) - 1) * query.pageSize));
}

function item(type: EntityType, row: { id: string; slug: string; title: string; summary: string }, facts: Array<{ label: string; value: string }>): CollectionItem {
  return { type, id: row.id, slug: row.slug, title: row.title, summary: row.summary, href: `${entityRoutes[type]}/${encodeURIComponent(row.slug)}`, facts };
}

function historicalRows<T extends { id: string; title: string; dateStart: string }>(rows: T[]): T[] {
  return [...rows].sort((left, right) => historicalDateSortKey(left.dateStart) - historicalDateSortKey(right.dateStart) || left.title.localeCompare(right.title) || left.id.localeCompare(right.id));
}

export async function listPublicEntities(type: EntityType, input: CollectionQuery | URLSearchParams | Record<string, string | string[] | undefined>, db: Database): Promise<PageResult<CollectionItem>> {
  const query = input instanceof URLSearchParams || !("page" in input) ? parseCollectionQuery(input as URLSearchParams | Record<string, string | string[] | undefined>) : input as CollectionQuery;

  if (type === "Person") {
    const where: Prisma.PersonWhereInput = { title: textWhere(query.q), serviceBranch: query.service, year: query.year, conflict: query.conflict, decorations: query.medal ? { contains: query.medal } : undefined };
    const total = await db.person.count({ where });
    const rows = await db.person.findMany({ where, orderBy: [{ title: "asc" }, { id: "asc" }], skip: boundedSkip(total, query), take: query.pageSize, select: { id: true, slug: true, title: true, summary: true, rank: true, serviceBranch: true, year: true, decorations: true, content: true } });
    return pageResult(rows.map((row) => ({
      ...item("Person", row, [{ label: "Rank", value: row.rank ?? "Not documented" }, { label: "Service", value: row.serviceBranch ?? "Not documented" }, { label: "Awards", value: parseHeroDecorations(row.decorations).join(", ") || "Not documented" }, { label: "Year", value: extractHeroYear(row.year, row.content) }]),
      awards: parseHeroDecorations(row.decorations),
      year: extractHeroYear(row.year, row.content),
    })), total, query);
  }

  if (type === "Equipment") {
    const where: Prisma.EquipmentWhereInput = { title: textWhere(query.q), domain: query.domain, category: query.category, serviceStatus: query.status };
    const total = await db.equipment.count({ where });
    const rows = await db.equipment.findMany({ where, orderBy: [{ title: "asc" }, { id: "asc" }], skip: boundedSkip(total, query), take: query.pageSize, select: { id: true, slug: true, title: true, summary: true, domain: true, serviceStatus: true } });
    return pageResult(rows.map((row) => item("Equipment", row, [{ label: "Domain", value: row.domain }, { label: "Service", value: row.serviceStatus }])), total, query);
  }

  if (type === "Conflict") {
    const where: Prisma.ConflictWhereInput = { title: textWhere(query.q), dateStart: query.year ? { contains: query.year } : undefined };
    const total = await db.conflict.count({ where });
    const rows = await db.conflict.findMany({ where, orderBy: [{ title: "asc" }, { id: "asc" }], ...(query.sort === "date" ? {} : { skip: boundedSkip(total, query), take: query.pageSize }), select: { id: true, slug: true, title: true, summary: true, dateStart: true } });
    const ordered = query.sort === "date" ? historicalRows(rows).slice(boundedSkip(total, query), boundedSkip(total, query) + query.pageSize) : rows;
    return pageResult(ordered.map((row) => item("Conflict", row, [{ label: "Start", value: row.dateStart }])), total, query);
  }

  if (type === "Operation") {
    const where: Prisma.OperationWhereInput = { title: textWhere(query.q), category: query.category, dateStart: query.year ? { contains: query.year } : undefined };
    const total = await db.operation.count({ where });
    const rows = await db.operation.findMany({ where, orderBy: [{ title: "asc" }, { id: "asc" }], ...(query.sort === "date" ? {} : { skip: boundedSkip(total, query), take: query.pageSize }), select: { id: true, slug: true, title: true, summary: true, dateStart: true, category: true } });
    const ordered = query.sort === "date" ? historicalRows(rows).slice(boundedSkip(total, query), boundedSkip(total, query) + query.pageSize) : rows;
    return pageResult(ordered.map((row) => item("Operation", row, [{ label: "Category", value: row.category }, { label: "Start", value: row.dateStart }])), total, query);
  }

  if (type === "Unit") {
    const where: Prisma.UnitWhereInput = { title: textWhere(query.q), serviceId: query.service };
    const total = await db.unit.count({ where });
    const rows = await db.unit.findMany({ where, orderBy: [{ title: "asc" }, { id: "asc" }], skip: boundedSkip(total, query), take: query.pageSize, select: { id: true, slug: true, title: true, summary: true, unitType: true, serviceId: true } });
    return pageResult(rows.map((row) => item("Unit", row, [{ label: "Type", value: row.unitType }, { label: "Service", value: row.serviceId ?? "Not documented" }])), total, query);
  }

  // Source
  const where: Prisma.SourceWhereInput = { title: textWhere(query.q) };
  const total = await db.source.count({ where });
  const rows = await db.source.findMany({ where, orderBy: [{ title: "asc" }, { id: "asc" }], skip: boundedSkip(total, query), take: query.pageSize, select: { id: true, slug: true, title: true, summary: true, publisher: true } });
  return pageResult(rows.map((row) => item("Source", row, [{ label: "Publisher", value: row.publisher ?? "Not documented" }])), total, query);
}
