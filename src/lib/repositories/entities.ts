import type { PrismaClient } from "@prisma/client";
import { prisma as defaultPrisma } from "@/lib/db";
import type { EntityType } from "@/lib/domain/entities";
import { publicWhere } from "./publication";

type Database = PrismaClient;
type PublicSummary = { id: string; slug: string; title: string; summary: string };

const publicRelationWhere = publicWhere();

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function getPublicConflict(slug: string, db: Database = defaultPrisma) {
  const entity = await db.conflict.findFirst({
    where: { slug, ...publicRelationWhere },
    select: {
      id: true, slug: true, title: true, summary: true, content: true, status: true,
      dateStart: true, dateEnd: true, dateStartPrecision: true, dateEndPrecision: true,
      theatres: true, coordinates: true, referenceUrl: true, contextSummary: true, outcomeSummary: true,
    },
  });
  if (!entity) return null;
  return { ...entity, theatres: parseJson<string[]>(entity.theatres, []) };
}

export async function getPublicPerson(slug: string, db: Database = defaultPrisma) {
  return db.person.findFirst({
    where: { slug, ...publicRelationWhere },
    select: {
      id: true, slug: true, title: true, fullName: true, summary: true, content: true, status: true,
      rank: true, birthDate: true, deathDate: true, birthDatePrecision: true, deathDatePrecision: true,
      serviceBranch: true, decorations: true, conflict: true, year: true,
    },
  });
}

async function getPublicOperationBy(where: { slug?: string; id?: string }, db: Database) {
  return db.operation.findFirst({
    where: { ...where, ...publicRelationWhere },
    select: {
      id: true, slug: true, title: true, category: true, summary: true, content: true, status: true,
      dateStart: true, dateEnd: true, dateStartPrecision: true, dateEndPrecision: true, coordinates: true, referenceUrl: true,
    },
  });
}

export async function getPublicOperation(slug: string, db: Database = defaultPrisma) {
  return getPublicOperationBy({ slug }, db);
}

export async function getPublicOperationById(id: string, db: Database = defaultPrisma) {
  return getPublicOperationBy({ id }, db);
}

export async function getPublicEquipment(slug: string, db: Database = defaultPrisma) {
  const entity = await db.equipment.findFirst({
    where: { slug, ...publicRelationWhere },
    select: {
      id: true, slug: true, title: true, domain: true, category: true, summary: true, content: true, status: true,
      developmentModel: true, serviceStatus: true, inductedYear: true, retiredYear: true, originCountries: true, specs: true,
      variantLabel: true, statusAsOf: true,
    },
  });
  if (!entity) return null;
  return { ...entity, originCountries: parseJson<string[]>(entity.originCountries, []), specs: parseJson<unknown>(entity.specs, []) };
}

export async function getPublicUnit(slug: string, db: Database = defaultPrisma) {
  const entity = await db.unit.findFirst({
    where: { slug, ...publicRelationWhere },
    select: { id: true, slug: true, title: true, summary: true, content: true, serviceId: true, unitType: true, establishedDate: true, disbandedDate: true, ranksJson: true, awardsJson: true },
  });
  if (!entity) return null;
  return { ...entity, ranks: parseJson<unknown[]>(entity.ranksJson ?? "[]", []), awards: parseJson<unknown[]>(entity.awardsJson ?? "[]", []) };
}

export async function listPublicUnits(serviceId?: string, db: Database = defaultPrisma) {
  return db.unit.findMany({ where: { ...publicRelationWhere, serviceId }, orderBy: [{ title: "asc" }, { id: "asc" }], select: { id: true, slug: true, title: true, summary: true, serviceId: true, unitType: true, establishedDate: true, disbandedDate: true } });
}

export async function getPublicSource(slug: string, db: Database = defaultPrisma) {
  const entity = await db.source.findFirst({
    where: { slug, ...publicRelationWhere },
    select: {
      id: true, slug: true, title: true, summary: true, author: true, publicationDate: true, publisher: true,
      canonicalUrl: true, sourceType: true, tier: true, rightsNotes: true,
      family: { select: { name: true, tier: true } },
    },
  });
  if (!entity) return null;
  return {
    ...entity,
    publisher: entity.publisher ?? entity.family.name,
    publishedAt: entity.publicationDate,
    url: entity.canonicalUrl,
    sourceType: entity.sourceType ?? "source",
    tier: entity.tier ?? entity.family.tier,
    notes: entity.rightsNotes,
    archiveUrl: null,
  };
}

export async function getPublicEntityBySlug(entityType: EntityType, slug: string, db: Database = defaultPrisma) {
  switch (entityType) {
    case "Conflict": return getPublicConflict(slug, db);
    case "Operation": return getPublicOperation(slug, db);
    case "Person": return getPublicPerson(slug, db);
    case "Equipment": return getPublicEquipment(slug, db);
    case "Unit": return getPublicUnit(slug, db);
    case "Source": return getPublicSource(slug, db);
  }
}

export async function getPublicEntityById(entityType: EntityType, id: string, db: Database = defaultPrisma): Promise<PublicSummary | null> {
  const where = { id, ...publicRelationWhere };
  switch (entityType) {
    case "Conflict": return db.conflict.findFirst({ where, select: { id: true, slug: true, title: true, summary: true } });
    case "Operation": return db.operation.findFirst({ where, select: { id: true, slug: true, title: true, summary: true } });
    case "Person": return db.person.findFirst({ where, select: { id: true, slug: true, title: true, summary: true } });
    case "Equipment": return db.equipment.findFirst({ where, select: { id: true, slug: true, title: true, summary: true } });
    case "Unit": return db.unit.findFirst({ where, select: { id: true, slug: true, title: true, summary: true } });
    case "Source": return db.source.findFirst({ where, select: { id: true, slug: true, title: true, summary: true } });
  }
}

export async function getPublicSlugs(entityType: EntityType, db: Database = defaultPrisma): Promise<string[]> {
  const where = publicRelationWhere;
  switch (entityType) {
    case "Conflict": return (await db.conflict.findMany({ where, select: { slug: true }, orderBy: { title: "asc" } })).map((row) => row.slug);
    case "Operation": return (await db.operation.findMany({ where, select: { slug: true }, orderBy: { title: "asc" } })).map((row) => row.slug);
    case "Person": return (await db.person.findMany({ where, select: { slug: true }, orderBy: { title: "asc" } })).map((row) => row.slug);
    case "Equipment": return (await db.equipment.findMany({ where, select: { slug: true }, orderBy: { title: "asc" } })).map((row) => row.slug);
    case "Unit": return (await db.unit.findMany({ where, select: { slug: true }, orderBy: { title: "asc" } })).map((row) => row.slug);
    case "Source": return (await db.source.findMany({ where, select: { slug: true }, orderBy: { title: "asc" } })).map((row) => row.slug);
  }
}

export async function listPublicConflicts(db: Database = defaultPrisma) {
  return db.conflict.findMany({ where: publicRelationWhere, orderBy: { dateStart: "desc" }, select: { id: true, slug: true, title: true, summary: true, dateStart: true, dateEnd: true } });
}

export async function listPublicOperations(db: Database = defaultPrisma) {
  return db.operation.findMany({ where: publicRelationWhere, orderBy: { dateStart: "desc" }, select: { id: true, slug: true, title: true, summary: true, dateStart: true, dateEnd: true } });
}

export async function listPublicPeople(db: Database = defaultPrisma) {
  return db.person.findMany({ where: publicRelationWhere, orderBy: { title: "asc" }, select: { id: true, slug: true, title: true, fullName: true, summary: true, content: true, rank: true, birthDate: true, deathDate: true, serviceBranch: true, decorations: true, conflict: true, year: true } });
}

export async function listPublicEquipment(db: Database = defaultPrisma) {
  const rows = await db.equipment.findMany({ where: publicRelationWhere, orderBy: { title: "asc" }, select: { id: true, slug: true, title: true, domain: true, category: true, summary: true, content: true, status: true, developmentModel: true, serviceStatus: true, originCountries: true, specs: true, variantLabel: true, statusAsOf: true } });
  return rows.map((row) => ({ ...row, originCountries: parseJson<string[]>(row.originCountries, []), specs: parseJson<unknown>(row.specs, []) }));
}

export async function listPublicSources(db: Database = defaultPrisma) {
  const rows = await db.source.findMany({
    where: publicRelationWhere,
    orderBy: { title: "asc" },
    select: { slug: true, title: true, summary: true, publisher: true, publicationDate: true, sourceType: true, tier: true, canonicalUrl: true, family: { select: { name: true, tier: true } } },
  });
  return rows.map((row) => ({ ...row, publisher: row.publisher ?? row.family.name, tier: row.tier ?? row.family.tier }));
}

export type PublicSearchResult = PublicSummary & { type: "Conflict" | "Person" | "Operation" | "Equipment"; href: string };

export async function searchPublic(query: string, typeFilter: "all" | "conflict" | "person" | "operation" | "equipment" = "all", db: Database = defaultPrisma): Promise<PublicSearchResult[]> {
  const aliases = await db.entityAlias.findMany({ where: { alias: { contains: query } }, select: { entityId: true, entityType: true } });
  const ids = (entityType: string) => aliases.filter((alias) => alias.entityType === entityType).map((alias) => alias.entityId);
  const clause = (entityType: string) => ({
    where: { ...publicRelationWhere, OR: [{ title: { contains: query } }, { summary: { contains: query } }, ...(ids(entityType).length ? [{ id: { in: ids(entityType) } }] : [])] },
    take: 20,
    select: { id: true, title: true, slug: true, summary: true },
  });
  const results: PublicSearchResult[] = [];
  if (typeFilter === "all" || typeFilter === "conflict") {
    const rows = await db.conflict.findMany(clause("Conflict"));
    results.push(...rows.map((row) => ({ ...row, type: "Conflict" as const, href: `/conflicts/${row.slug}` })));
  }
  if (typeFilter === "all" || typeFilter === "person") {
    const rows = await db.person.findMany(clause("Person"));
    results.push(...rows.map((row) => ({ ...row, type: "Person" as const, href: `/heroes/${row.slug}` })));
  }
  if (typeFilter === "all" || typeFilter === "operation") {
    const rows = await db.operation.findMany(clause("Operation"));
    results.push(...rows.map((row) => ({ ...row, type: "Operation" as const, href: `/operations/${row.slug}` })));
  }
  if (typeFilter === "all" || typeFilter === "equipment") {
    const rows = await db.equipment.findMany(clause("Equipment"));
    results.push(...rows.map((row) => ({ ...row, type: "Equipment" as const, href: `/arsenal/${row.slug}` })));
  }
  return results;
}
