import type { PrismaClient } from "@prisma/client";
import { prisma as defaultPrisma } from "@/lib/db";
import type { EntityType } from "@/lib/domain/entities";

type Database = PrismaClient;

function parseJson<T>(value: string, fallback: T): T {
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

export async function getPublicConflict(slug: string, db: Database = defaultPrisma) {
  const entity = await db.conflict.findFirst({
    where: { slug },
    select: {
      id: true, slug: true, title: true, summary: true, content: true,
      dateStart: true, dateEnd: true, theatres: true, coordinates: true,
      referenceUrl: true, contextSummary: true, outcomeSummary: true,
      people: { select: { id: true, slug: true, title: true } },
      equipment: { select: { id: true, slug: true, title: true } },
      operations: {
        orderBy: [{ dateStart: "asc" }, { title: "asc" }],
        select: { id: true, slug: true, title: true, category: true, summary: true, content: true, dateStart: true, dateEnd: true, coordinates: true, referenceUrl: true },
      },
    },
  });
  if (!entity) return null;
  return { ...entity, theatres: parseJson<string[]>(entity.theatres, []) };
}

export async function getPublicPerson(slug: string, db: Database = defaultPrisma) {
  return db.person.findFirst({
    where: { slug },
    select: { id: true, slug: true, title: true, fullName: true, summary: true, content: true, rank: true, birthDate: true, deathDate: true, serviceBranch: true, decorations: true, conflict: true, year: true },
  });
}

export async function getPublicOperation(slug: string, db: Database = defaultPrisma) {
  return db.operation.findFirst({
    where: { slug },
    select: {
      id: true, slug: true, title: true, category: true, summary: true, content: true,
      dateStart: true, dateEnd: true, coordinates: true, referenceUrl: true,
      people: { select: { id: true, slug: true, title: true } },
      conflicts: { select: { id: true, slug: true, title: true } },
    },
  });
}

export async function getPublicOperationById(id: string, db: Database = defaultPrisma) {
  return db.operation.findFirst({
    where: { id },
    select: {
      id: true, slug: true, title: true, category: true, summary: true, content: true,
      dateStart: true, dateEnd: true, coordinates: true, referenceUrl: true,
      people: { select: { id: true, slug: true, title: true } },
      conflicts: { select: { id: true, slug: true, title: true } },
    },
  });
}

export async function getPublicEquipment(slug: string, db: Database = defaultPrisma) {
  const entity = await db.equipment.findFirst({
    where: { slug },
    select: { id: true, slug: true, title: true, domain: true, category: true, summary: true, content: true, developmentModel: true, serviceStatus: true, inductedYear: true, retiredYear: true, originCountries: true, specs: true, variantLabel: true },
  });
  if (!entity) return null;
  return { ...entity, originCountries: parseJson<string[]>(entity.originCountries, []), specs: parseJson<unknown>(entity.specs, []) };
}

export async function getPublicUnit(slug: string, db: Database = defaultPrisma) {
  const entity = await db.unit.findFirst({
    where: { slug },
    select: { id: true, slug: true, title: true, summary: true, content: true, serviceId: true, unitType: true, establishedDate: true, disbandedDate: true, ranksJson: true, awardsJson: true },
  });
  if (!entity) return null;
  return { ...entity, ranks: parseJson<unknown[]>(entity.ranksJson ?? "[]", []), awards: parseJson<unknown[]>(entity.awardsJson ?? "[]", []) };
}

export async function listPublicUnits(serviceId: string | undefined, db: Database = defaultPrisma) {
  return db.unit.findMany({ where: serviceId ? { serviceId } : {}, orderBy: [{ title: "asc" }, { id: "asc" }], select: { id: true, slug: true, title: true, summary: true, serviceId: true, unitType: true, establishedDate: true, disbandedDate: true } });
}

export async function getPublicSource(slug: string, db: Database = defaultPrisma) {
  return db.source.findFirst({
    where: { slug },
    select: { id: true, slug: true, title: true, summary: true, author: true, publicationDate: true, publisher: true, canonicalUrl: true, sourceType: true, tier: true },
  });
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

export async function getPublicSlugs(entityType: EntityType, db: Database = defaultPrisma): Promise<string[]> {
  switch (entityType) {
    case "Conflict": return (await db.conflict.findMany({ select: { slug: true }, orderBy: { title: "asc" } })).map((r) => r.slug);
    case "Operation": return (await db.operation.findMany({ select: { slug: true }, orderBy: { title: "asc" } })).map((r) => r.slug);
    case "Person": return (await db.person.findMany({ select: { slug: true }, orderBy: { title: "asc" } })).map((r) => r.slug);
    case "Equipment": return (await db.equipment.findMany({ select: { slug: true }, orderBy: { title: "asc" } })).map((r) => r.slug);
    case "Unit": return (await db.unit.findMany({ select: { slug: true }, orderBy: { title: "asc" } })).map((r) => r.slug);
    case "Source": return (await db.source.findMany({ select: { slug: true }, orderBy: { title: "asc" } })).map((r) => r.slug);
  }
}

export async function listPublicConflicts(db: Database = defaultPrisma) {
  return db.conflict.findMany({ orderBy: { dateStart: "desc" }, select: { id: true, slug: true, title: true, summary: true, dateStart: true, dateEnd: true } });
}

export async function listPublicOperations(db: Database = defaultPrisma) {
  return db.operation.findMany({ orderBy: { dateStart: "desc" }, select: { id: true, slug: true, title: true, summary: true, dateStart: true, dateEnd: true } });
}
