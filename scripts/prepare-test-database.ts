import { PrismaClient } from "@prisma/client";
import { spawn } from "node:child_process";
import { assertTestDatabaseUrl } from "./lib/test-database";

function executable(name: string): string {
  return process.platform === "win32" ? `${name}.cmd` : name;
}

function generateSchemaSql(env: NodeJS.ProcessEnv): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      executable("npx"),
      ["prisma", "migrate", "diff", "--from-empty", "--to-schema-datamodel", "prisma/schema.prisma", "--script"],
      { env, shell: false },
    );
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) reject(new Error(stderr || `Schema SQL generation failed with status ${code}`));
      else resolve(stdout);
    });
  });
}

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("TEST_DB_ONLY: DATABASE_URL is required");
  assertTestDatabaseUrl(url);

  const sql = await generateSchemaSql(process.env);
  const db = new PrismaClient();
  try {
    await db.$executeRawUnsafe("PRAGMA foreign_keys = ON");
    for (const statement of sql.split(";")) {
      const executableStatement = statement
        .split("\n")
        .filter((line) => !line.trimStart().startsWith("--"))
        .join("\n")
        .trim();
      if (executableStatement) await db.$executeRawUnsafe(executableStatement);
    }
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
