import type { PrismaClient } from "@prisma/client";
import { prisma as defaultPrisma } from "@/lib/db";

type Database = PrismaClient;

export async function listPublicSources(db: Database = defaultPrisma) {
  return db.source.findMany({
    orderBy: { title: "asc" },
    select: { slug: true, title: true, summary: true, publisher: true, publicationDate: true, sourceType: true, tier: true, canonicalUrl: true },
  });
}

export async function getPublicSourceBySlug(slug: string, db: Database = defaultPrisma) {
  return db.source.findFirst({
    where: { slug },
    select: { id: true, slug: true, title: true, summary: true, author: true, publicationDate: true, publisher: true, canonicalUrl: true, sourceType: true, tier: true },
  });
}
