import type { PrismaClient } from "@prisma/client";
import { prisma as defaultPrisma } from "@/lib/db";
import { entityRoutes, isEntityType, type EntityType } from "@/lib/domain/entities";
import { parseCollectionQuery } from "@/lib/domain/query";
import type { CollectionQuery, PageResult, PublicEvidence } from "@/lib/domain/types";
import { getPublicEntityById } from "./entities";
import { publicWhere } from "./publication";
import { toPublicEvidence, type EvidenceRow } from "./evidence";

type Database = PrismaClient;

export type SourceQuery = CollectionQuery & {
  sourceType?: string;
  publisher?: string;
  from?: string;
  to?: string;
};

export type SourceListItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publisher: string;
  publicationDate: string | null;
  sourceType: string;
  tier: string;
  href: string;
};

export type PublicSourceDetail = SourceListItem & {
  author: string | null;
  canonicalUrl: string | null;
  rightsNotes: string | null;
  versions: Array<{
    id: string;
    versionTag: string;
    accessedAt: string | null;
    url: string | null;
    archiveUrl: string | null;
    format: string | null;
    evidence: PublicEvidence[];
  }>;
  linkedEntities: Array<{
    type: EntityType;
    id: string;
    slug: string;
    title: string;
    href: string;
  }>;
};

function sourceQuery(input: SourceQuery | URLSearchParams | Record<string, string | string[] | undefined>): SourceQuery {
  if (input instanceof URLSearchParams || !("page" in input)) {
    const base = parseCollectionQuery(input as URLSearchParams | Record<string, string | string[] | undefined>);
    const get = (key: string) => input instanceof URLSearchParams ? input.get(key) ?? undefined : Array.isArray(input[key]) ? input[key]?.[0] : input[key];
    return { ...base, sourceType: get("sourceType")?.trim() || get("type")?.trim() || undefined, publisher: get("publisher")?.trim() || undefined, from: get("from")?.trim() || undefined, to: get("to")?.trim() || undefined };
  }
  return input as SourceQuery;
}

function page<T>(rows: T[], total: number, query: SourceQuery): PageResult<T> {
  const pageCount = Math.max(1, Math.ceil(total / query.pageSize));
  const current = Math.min(query.page, pageCount);
  return { items: rows, page: current, pageSize: query.pageSize, total, pageCount, invalid: [] };
}

export async function listPublicSources(input: SourceQuery | URLSearchParams | Record<string, string | string[] | undefined>, db: Database = defaultPrisma): Promise<PageResult<SourceListItem>> {
  const query = sourceQuery(input);
  const where = {
    ...publicWhere(),
    title: query.q ? { contains: query.q } : undefined,
    sourceType: query.sourceType,
    publisher: query.publisher ? { contains: query.publisher } : undefined,
    publicationDate: query.from || query.to ? { gte: query.from, lte: query.to } : undefined,
  };
  const total = await db.source.count({ where });
  const skip = Math.min((query.page - 1) * query.pageSize, Math.max(0, (Math.max(1, Math.ceil(total / query.pageSize)) - 1) * query.pageSize));
  const rows = await db.source.findMany({
    where,
    orderBy: query.sort === "date" ? [{ publicationDate: "desc" }, { id: "asc" }] : [{ title: "asc" }, { id: "asc" }],
    skip,
    take: query.pageSize,
    select: { id: true, slug: true, title: true, summary: true, publisher: true, publicationDate: true, sourceType: true, tier: true, family: { select: { name: true, tier: true } } },
  });
  return page(rows.map((row) => ({ id: row.id, slug: row.slug, title: row.title, summary: row.summary, publisher: row.publisher ?? row.family.name, publicationDate: row.publicationDate, sourceType: row.sourceType ?? "source", tier: row.tier ?? row.family.tier, href: `/archive/${encodeURIComponent(row.slug)}` })), total, query);
}

type EntityLink = { entityType: string; entityId: string };

export async function getPublicSourceBySlug(slug: string, db: Database = defaultPrisma): Promise<PublicSourceDetail | null> {
  const source = await db.source.findFirst({ where: { slug, ...publicWhere() }, select: { id: true, slug: true, title: true, summary: true, author: true, publicationDate: true, publisher: true, canonicalUrl: true, sourceType: true, tier: true, rightsNotes: true, family: { select: { name: true, tier: true } } } });
  if (!source) return null;

  const versions = await db.sourceVersion.findMany({
    where: { sourceId: source.id },
    orderBy: [{ accessedAt: "desc" }, { id: "asc" }],
    select: {
      id: true,
      versionTag: true,
      accessedAt: true,
      url: true,
      archiveUrl: true,
      format: true,
      evidence: {
        where: { locator: { not: null } },
        select: {
          id: true,
          locator: true,
          quote: true,
          rightsSafeToDisplay: true,
          sourceVersion: {
            select: {
              versionTag: true,
              url: true,
              archiveUrl: true,
              source: { select: { id: true, slug: true, title: true, publisher: true, canonicalUrl: true, family: { select: { name: true, tier: true } } } },
            },
          },
        },
      },
    },
  });

  const evidenceRows = versions.flatMap((version) => version.evidence.map((row) => toPublicEvidence(row as EvidenceRow)).filter((item): item is PublicEvidence => item !== null));
  const versionDetails = versions.map((version) => ({ id: version.id, versionTag: version.versionTag, accessedAt: version.accessedAt?.toISOString() ?? null, url: version.url, archiveUrl: version.archiveUrl, format: version.format, evidence: version.evidence.map((row) => toPublicEvidence(row as EvidenceRow)).filter((item): item is PublicEvidence => item !== null) }));

  const [directLinks, claimLinks, relationshipLinks] = await Promise.all([
    db.entityEvidence.findMany({ where: { evidence: { sourceVersion: { sourceId: source.id } } }, select: { entityType: true, entityId: true } }),
    db.claimEvidence.findMany({ where: { evidence: { sourceVersion: { sourceId: source.id } }, claim: { status: "GOLD", reviewedAt: { not: null }, reviewedBy: { not: null } } }, select: { claim: { select: { entityType: true, entityId: true } } } }),
    db.relationshipEvidence.findMany({ where: { evidence: { sourceVersion: { sourceId: source.id } }, relationship: { status: "GOLD", reviewedAt: { not: null }, reviewedBy: { not: null } } }, select: { relationship: { select: { sourceType: true, sourceId: true, targetType: true, targetId: true } } } }),
  ]);
  const refs = new Map<string, EntityLink>();
  const add = (ref: EntityLink) => { if (isEntityType(ref.entityType)) refs.set(`${ref.entityType}:${ref.entityId}`, ref); };
  directLinks.forEach(add);
  claimLinks.forEach((link) => add({ entityType: link.claim.entityType, entityId: link.claim.entityId }));
  relationshipLinks.forEach((link) => { add({ entityType: link.relationship.sourceType, entityId: link.relationship.sourceId }); add({ entityType: link.relationship.targetType, entityId: link.relationship.targetId }); });
  const linkedEntities = (await Promise.all([...refs.values()].map(async (ref) => {
    if (!isEntityType(ref.entityType)) return null;
    const entity = await getPublicEntityById(ref.entityType, ref.entityId, db);
    return entity ? { type: ref.entityType, id: entity.id, slug: entity.slug, title: entity.title, href: `${entityRoutes[ref.entityType]}/${encodeURIComponent(entity.slug)}` } : null;
  }))).filter((entity): entity is NonNullable<typeof entity> => entity !== null).sort((a, b) => a.title.localeCompare(b.title));

  return { id: source.id, slug: source.slug, title: source.title, summary: source.summary, publisher: source.publisher ?? source.family.name, publicationDate: source.publicationDate, sourceType: source.sourceType ?? "source", tier: source.tier ?? source.family.tier, href: `/archive/${encodeURIComponent(source.slug)}`, author: source.author, canonicalUrl: source.canonicalUrl, rightsNotes: source.rightsNotes, versions: versionDetails, linkedEntities };
}
