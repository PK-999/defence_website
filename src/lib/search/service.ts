import type { PrismaClient } from "@prisma/client";
import { entityRoutes, type EntityType } from "@/lib/domain/entities";
import type { CollectionItem } from "@/lib/domain/types";
import { isSearchScope, searchScopeBoost, type SearchScope } from "@/lib/search/context";

export type SearchMode = "quick" | "full";
export type SearchInput = {
  q: string;
  type?: string;
  scope?: SearchScope;
  page?: number;
  pageSize?: number;
  mode?: SearchMode;
};

export type SearchResult = CollectionItem & { type: EntityType; score: number };
export type SearchResponse = {
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

const normalize = (value: string) => value.normalize("NFKC").trim().toLocaleLowerCase();
const href = (type: EntityType, slug: string) => `${entityRoutes[type]}/${encodeURIComponent(slug)}`;

function rank(title: string, summary: string, q: string): number {
  const t = normalize(title);
  const s = normalize(summary);
  if (t === q) return 1000;
  if (t.startsWith(q)) return 800;
  if (t.includes(q)) return 500;
  if (s.includes(q)) return 300;
  return 100;
}

export async function searchArchive(input: SearchInput, db: PrismaClient): Promise<SearchResponse> {
  const q = normalize(input.q);
  if (q.length < 2 || q.length > 120) throw new Error("INVALID_QUERY");

  const pageSize = Math.min(24, Math.max(1, Math.trunc(input.pageSize ?? (input.mode === "quick" ? 8 : 24))));
  const page = Math.max(1, Math.trunc(input.page ?? 1));
  const filterType = input.type && input.type !== "all" ? input.type.toLowerCase() : null;

  const results: SearchResult[] = [];

  // Search Conflicts
  if (!filterType || filterType === "conflict") {
    const rows = await db.conflict.findMany({
      where: { OR: [{ title: { contains: input.q } }, { summary: { contains: input.q } }] },
      take: 20,
      select: { id: true, slug: true, title: true, summary: true, dateStart: true },
    });
    for (const r of rows) {
      results.push({
        type: "Conflict",
        id: r.id,
        slug: r.slug,
        title: r.title,
        summary: r.summary,
        href: href("Conflict", r.slug),
        facts: [{ label: "Start", value: r.dateStart }],
        score: rank(r.title, r.summary, q),
      });
    }
  }

  // Search Operations
  if (!filterType || filterType === "operation") {
    const rows = await db.operation.findMany({
      where: { OR: [{ title: { contains: input.q } }, { summary: { contains: input.q } }] },
      take: 20,
      select: { id: true, slug: true, title: true, summary: true, category: true, dateStart: true },
    });
    for (const r of rows) {
      results.push({
        type: "Operation",
        id: r.id,
        slug: r.slug,
        title: r.title,
        summary: r.summary,
        href: href("Operation", r.slug),
        facts: [{ label: "Category", value: r.category }, { label: "Date", value: r.dateStart }],
        score: rank(r.title, r.summary, q),
      });
    }
  }

  // Search Persons (Heroes)
  if (!filterType || filterType === "person" || filterType === "hero") {
    const rows = await db.person.findMany({
      where: { OR: [{ fullName: { contains: input.q } }, { summary: { contains: input.q } }] },
      take: 20,
      select: { id: true, slug: true, fullName: true, summary: true, rank: true, serviceBranch: true },
    });
    for (const r of rows) {
      results.push({
        type: "Person",
        id: r.id,
        slug: r.slug,
        title: r.fullName,
        summary: r.summary,
        href: href("Person", r.slug),
        facts: [{ label: "Rank", value: r.rank ?? "N/A" }, { label: "Service", value: r.serviceBranch ?? "N/A" }],
        score: rank(r.fullName, r.summary, q),
      });
    }
  }

  // Search Equipment (Arsenal)
  if (!filterType || filterType === "equipment" || filterType === "arsenal") {
    const rows = await db.equipment.findMany({
      where: { OR: [{ title: { contains: input.q } }, { summary: { contains: input.q } }] },
      take: 20,
      select: { id: true, slug: true, title: true, summary: true, domain: true, category: true },
    });
    for (const r of rows) {
      results.push({
        type: "Equipment",
        id: r.id,
        slug: r.slug,
        title: r.title,
        summary: r.summary,
        href: href("Equipment", r.slug),
        facts: [{ label: "Domain", value: r.domain }, { label: "Category", value: r.category }],
        score: rank(r.title, r.summary, q),
      });
    }
  }

  // Search Units
  if (!filterType || filterType === "unit") {
    const rows = await db.unit.findMany({
      where: { OR: [{ title: { contains: input.q } }, { summary: { contains: input.q } }] },
      take: 20,
      select: { id: true, slug: true, title: true, summary: true, unitType: true, serviceId: true },
    });
    for (const r of rows) {
      results.push({
        type: "Unit",
        id: r.id,
        slug: r.slug,
        title: r.title,
        summary: r.summary,
        href: href("Unit", r.slug),
        facts: [{ label: "Type", value: r.unitType }, { label: "Service", value: r.serviceId ?? "N/A" }],
        score: rank(r.title, r.summary, q),
      });
    }
  }

  // Search Sources
  if (!filterType || filterType === "source") {
    const rows = await db.source.findMany({
      where: { OR: [{ title: { contains: input.q } }, { summary: { contains: input.q } }] },
      take: 20,
      select: { id: true, slug: true, title: true, summary: true, publisher: true },
    });
    for (const r of rows) {
      results.push({
        type: "Source",
        id: r.id,
        slug: r.slug,
        title: r.title,
        summary: r.summary,
        href: href("Source", r.slug),
        facts: [{ label: "Publisher", value: r.publisher ?? "N/A" }],
        score: rank(r.title, r.summary, q),
      });
    }
  }

  const scope = isSearchScope(input.scope) ? input.scope : undefined;
  results.sort((a, b) => (b.score + searchScopeBoost(b.type, scope)) - (a.score + searchScopeBoost(a.type, scope)));

  const total = results.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const paginated = results.slice(start, start + pageSize);

  return {
    results: paginated,
    total,
    page: currentPage,
    pageSize,
    pageCount,
  };
}
