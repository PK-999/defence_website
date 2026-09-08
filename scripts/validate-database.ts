import { PrismaClient } from "@prisma/client";
import { validateDatabase } from "../src/lib/publication/validate";

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL_REQUIRED");
  const client = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
  try {
    const issues = await validateDatabase({ client });
    console.log(JSON.stringify({ errors: issues.filter((issue) => issue.severity === "error"), warnings: issues.filter((issue) => issue.severity === "warning") }, null, 2));
    if (issues.some((issue) => issue.severity === "error")) process.exitCode = 1;
  } finally {
    await client.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
