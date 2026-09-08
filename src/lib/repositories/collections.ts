import type { Prisma, PrismaClient } from "@prisma/client";
import fs from "node:fs/promises";
import path from "node:path";
import { entityRoutes, type EntityType } from "@/lib/domain/entities";
import { parseCollectionQuery } from "@/lib/domain/query";
import type { CollectionItem, CollectionQuery, PageResult } from "@/lib/domain/types";
import { prisma } from "@/lib/db";
import { publicWhere } from "./publication";

type Database = PrismaClient;

type CollectionManifest = {
  slug: string;
  title: string;
  description: string;
  knownEntityRefs: string[];
  updatedAt: string | undefined;
};

export type FeaturedCollection = {
  slug: string;
  title: string;
  description: string;
  href: string;
};

async function readCollectionManifests(): Promise<CollectionManifest[]> {
  const directory = path.join(process.cwd(), "content", "collections");
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const manifests = await Promise.all(entries.filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map(async (entry) => {
      try {
        const parsed: unknown = JSON.parse(await fs.readFile(path.join(directory, entry.name), "utf8"));
        if (!parsed || typeof parsed !== "object") return null;
        const manifest = parsed as Partial<CollectionManifest>;
        if (typeof manifest.slug !== "string" || typeof manifest.title !== "string" || typeof manifest.description !== "string" || !Array.isArray(manifest.knownEntityRefs)) return null;
        const refs = manifest.knownEntityRefs.filter((ref): ref is string => typeof ref === "string" && ref.includes(":"));
        return refs.length > 0 ? { slug: manifest.slug, title: manifest.title, description: manifest.description, knownEntityRefs: refs, updatedAt: manifest.updatedAt } : null;
      } catch {
        return null;
      }
    }));
    return manifests.filter((manifest): manifest is CollectionManifest => manifest !== null).sort((left, right) => (right.updatedAt ?? "").localeCompare(left.updatedAt ?? "") || left.slug.localeCompare(right.slug));
  } catch {
    return [];
  }
}

export async function getFeaturedCollection(db: Database = prisma): Promise<FeaturedCollection | null> {
  const manifests = await readCollectionManifests();
  const publicFilter = publicWhere();
  for (const manifest of manifests) {
    for (const ref of manifest.knownEntityRefs) {
      const separator = ref.indexOf(":");
      const type = ref.slice(0, separator) as EntityType;
      const slug = ref.slice(separator + 1);
      if (!(type in entityRoutes) || !slug) continue;
      const where = { ...publicFilter, slug };
      let exists = false;
      if (type === "Conflict") exists = Boolean(await db.conflict.findFirst({ where }));
      if (type === "Operation") exists = Boolean(await db.operation.findFirst({ where }));
      if (type === "Person") exists = Boolean(await db.person.findFirst({ where }));
      if (type === "Equipment") exists = Boolean(await db.equipment.findFirst({ where }));
      if (type === "Unit") exists = Boolean(await db.unit.findFirst({ where }));
      if (type === "Source") exists = Boolean(await db.source.findFirst({ where }));
      if (exists) return { slug: manifest.slug, title: manifest.title, description: manifest.description, href: `${entityRoutes[type]}/${encodeURIComponent(slug)}` };
    }
  }
  return null;
}

function textWhere(q: string | undefined): Prisma.StringFilter | undefined { return q ? { contains: q } : undefined; }
function page<T>(rows: T[], total: number, query: CollectionQuery, invalid: string[]): PageResult<T> { const pageCount = Math.max(1, Math.ceil(total / query.pageSize)); const current = Math.min(query.page, pageCount); return { items: rows, page: current, pageSize: query.pageSize, total, pageCount, invalid }; }
function boundedSkip(total: number, query: CollectionQuery): number { return Math.min((Math.max(1, query.page) - 1) * query.pageSize, Math.max(0, (Math.max(1, Math.ceil(total / query.pageSize)) - 1) * query.pageSize)); }
function item(type: EntityType, row: { id: string; slug: string; title: string; summary: string }, facts: Array<{ label: string; value: string }>): CollectionItem { return { type, id: row.id, slug: row.slug, title: row.title, summary: row.summary, href: `${entityRoutes[type]}/${encodeURIComponent(row.slug)}`, facts }; }

export async function listPublicEntities(type: EntityType, input: CollectionQuery | URLSearchParams | Record<string, string | string[] | undefined>, db: Database): Promise<PageResult<CollectionItem>> {
  const query = input instanceof URLSearchParams || !("page" in input) ? parseCollectionQuery(input as URLSearchParams | Record<string, string | string[] | undefined>) : input as CollectionQuery;
  const publicFilter = publicWhere();
  const order = query.sort === "date" ? { createdAt: "desc" as const } : { title: "asc" as const };
  if (type === "Person") {
    const where: Prisma.PersonWhereInput = { ...publicFilter, title: textWhere(query.q), serviceBranch: query.service, year: query.year, conflict: query.conflict, decorations: query.medal ? { contains: query.medal } : undefined };
    const total = await db.person.count({ where }); const rows = await db.person.findMany({ where, orderBy: [{ title: "asc" }, { id: "asc" }], skip: boundedSkip(total, query), take: query.pageSize, select: { id: true, slug: true, title: true, summary: true, rank: true, serviceBranch: true, year: true } });
    return page(rows.map((row) => item("Person", row, [{ label: "Rank", value: row.rank ?? "Not documented" }, { label: "Service", value: row.serviceBranch ?? "Not documented" }])), total, query, []);
  }
  if (type === "Equipment") {
    const where: Prisma.EquipmentWhereInput = { ...publicFilter, title: textWhere(query.q), domain: query.domain, category: query.category, serviceStatus: query.status };
    const total = await db.equipment.count({ where }); const rows = await db.equipment.findMany({ where, orderBy: [{ title: "asc" }, { id: "asc" }], skip: boundedSkip(total, query), take: query.pageSize, select: { id: true, slug: true, title: true, summary: true, domain: true, serviceStatus: true } });
    return page(rows.map((row) => item("Equipment", row, [{ label: "Domain", value: row.domain }, { label: "Service", value: row.serviceStatus }])), total, query, []);
  }
  if (type === "Conflict") {
    const where = { ...publicFilter, title: textWhere(query.q) }; const total = await db.conflict.count({ where }); const rows = await db.conflict.findMany({ where, orderBy: [{ title: "asc" }, { id: "asc" }], skip: boundedSkip(total, query), take: query.pageSize, select: { id: true, slug: true, title: true, summary: true, dateStart: true } });
    return page(rows.map((row) => item("Conflict", row, [{ label: "Start", value: row.dateStart }])), total, query, []);
  }
  if (type === "Operation") {
    const where = { ...publicFilter, title: textWhere(query.q), category: query.category }; const total = await db.operation.count({ where }); const rows = await db.operation.findMany({ where, orderBy: [{ title: "asc" }, { id: "asc" }], skip: boundedSkip(total, query), take: query.pageSize, select: { id: true, slug: true, title: true, summary: true, dateStart: true, category: true } });
    return page(rows.map((row) => item("Operation", row, [{ label: "Category", value: row.category }, { label: "Start", value: row.dateStart }])), total, query, []);
  }
  if (type === "Unit") {
    const where = { ...publicFilter, title: textWhere(query.q), serviceId: query.service }; const total = await db.unit.count({ where }); const rows = await db.unit.findMany({ where, orderBy: [{ title: "asc" }, { id: "asc" }], skip: boundedSkip(total, query), take: query.pageSize, select: { id: true, slug: true, title: true, summary: true, unitType: true, serviceId: true } });
    return page(rows.map((row) => item("Unit", row, [{ label: "Type", value: row.unitType }, { label: "Service", value: row.serviceId ?? "Not documented" }])), total, query, []);
  }
  const where = { ...publicFilter, title: textWhere(query.q) }; const total = await db.source.count({ where }); const rows = await db.source.findMany({ where, orderBy: [{ title: "asc" }, { id: "asc" }], skip: boundedSkip(total, query), take: query.pageSize, select: { id: true, slug: true, title: true, summary: true, publisher: true } });
  return page(rows.map((row) => item("Source", row, [{ label: "Publisher", value: row.publisher ?? "Not documented" }])), total, query, []);
}
