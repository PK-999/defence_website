import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { sentinelPrisma?: PrismaClient };

function resolveDatabaseUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return `file:${process.cwd()}/prisma/dev.db`;
  if (!value.startsWith("file:./")) return value;
  const relativePath = value.slice("file:./".length).replace(/^prisma\//, "");
  return `file:${process.cwd()}/prisma/${relativePath}`;
}

const databaseUrl = resolveDatabaseUrl(process.env.DATABASE_URL);

export const prisma =
  globalForPrisma.sentinelPrisma ??
  new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.sentinelPrisma = prisma;
}
