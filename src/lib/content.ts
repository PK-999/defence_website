import { PrismaClient } from '@prisma/client';

// In Next.js, we should reuse the Prisma Client in development to prevent connection exhaustion
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function getSlugs(directory: string): Promise<string[]> {
  // directory mapping to prisma model
  switch(directory) {
    case 'conflicts': return (await prisma.conflict.findMany({ select: { slug: true } })).map(c => c.slug);
    case 'people': return (await prisma.person.findMany({ select: { slug: true } })).map(c => c.slug);
    case 'operations': return (await prisma.operation.findMany({ select: { slug: true } })).map(c => c.slug);
    case 'equipment': return (await prisma.equipment.findMany({ select: { slug: true } })).map(c => c.slug);
    case 'sources': return (await prisma.sourceRecord.findMany({ select: { slug: true } })).map(c => c.slug);
    default: return [];
  }
}

export async function getConflict(slug: string) {
  const entity = await prisma.conflict.findUnique({ where: { slug } });
  if (!entity) return null;
  // Parse JSON fields
  return { ...entity, theatres: JSON.parse(entity.theatres) };
}

export async function getPerson(slug: string) {
  const entity = await prisma.person.findUnique({ where: { slug } });
  return entity;
}

export async function getOperation(slug: string) {
  const entity = await prisma.operation.findUnique({ where: { slug } });
  return entity;
}

export async function getEquipment(slug: string) {
  const entity = await prisma.equipment.findUnique({ where: { slug } });
  if (!entity) return null;
  return { 
    ...entity, 
    originCountries: JSON.parse(entity.originCountries), 
    specs: JSON.parse(entity.specs) 
  };
}

export async function getSource(slug: string) {
  const entity = await prisma.sourceRecord.findUnique({ where: { slug } });
  return entity;
}
