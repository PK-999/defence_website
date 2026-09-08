import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { assertTestDatabaseUrl } from "./lib/test-database";

function executable(name: string): string {
  return process.platform === "win32" ? `${name}.cmd` : name;
}

function run(command: string, args: string[], env: NodeJS.ProcessEnv): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { env, stdio: "inherit", shell: false });
    child.on("error", reject);
    child.on("close", (code, signal) => resolve(code ?? (signal ? 1 : 0)));
  });
}

async function removeDatabaseFiles(database: string): Promise<void> {
  for (const suffix of ["", "-journal", "-shm", "-wal"]) {
    await rm(`${database}${suffix}`, { force: true });
  }
}

async function main(): Promise<void> {
  const root = path.resolve(".test-data");
  await mkdir(root, { recursive: true });
  const database = assertTestDatabaseUrl(`file:${path.join(root, "integration.db")}`);
  if (existsSync(database)) await removeDatabaseFiles(database);

  const env: NodeJS.ProcessEnv = { ...process.env, DATABASE_URL: `file:${database}`, NODE_ENV: "test" };
  const prismaStatus = await run(executable("npx"), ["tsx", "scripts/prepare-test-database.ts"], env);
  if (prismaStatus !== 0) process.exit(prismaStatus);
  const seedStatus = await run(executable("npx"), ["tsx", "scripts/seed-test-fixtures.ts"], env);
  if (seedStatus !== 0) process.exit(seedStatus);

  const args = ["vitest", "run", "--config", "vitest.integration.config.mts", ...process.argv.slice(2)];
  const status = await run(executable("npx"), args, env);
  process.exit(status);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
