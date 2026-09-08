import { PrismaClient } from "@prisma/client";
import { seedLegacyFixtures } from "../tests/helpers/seed-fixtures";

const db = new PrismaClient();

seedLegacyFixtures(db)
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
