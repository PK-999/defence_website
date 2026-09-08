import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { sentinelPrisma?: PrismaClient };

export const prisma = globalForPrisma.sentinelPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.sentinelPrisma = prisma;
}
