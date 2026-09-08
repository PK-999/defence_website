import net from "node:net";
import { spawn } from "node:child_process";
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

async function assertPortFree(port: number): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const server = net.createServer();
    server.once("error", () => reject(new Error(`E2E_PORT_IN_USE: ${port}`)));
    server.listen(port, "127.0.0.1", () => server.close(() => resolve()));
  });
}

async function main(): Promise<void> {
  await assertPortFree(3100);
  const root = path.resolve(".test-data");
  await mkdir(root, { recursive: true });
  const database = assertTestDatabaseUrl(`file:${path.join(root, "e2e.db")}`);
  for (const suffix of ["", "-journal", "-shm", "-wal"]) await rm(`${database}${suffix}`, { force: true });

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    DATABASE_URL: `file:${database}`,
    NODE_ENV: "test",
    SITE_URL: "http://127.0.0.1:3100",
    SENTINEL_TEST_RUN: "1",
  };
  const migrateStatus = await run(executable("npx"), ["tsx", "scripts/prepare-test-database.ts"], env);
  if (migrateStatus !== 0) process.exit(migrateStatus);
  const seedStatus = await run(executable("npx"), ["tsx", "scripts/seed-test-fixtures.ts"], env);
  if (seedStatus !== 0) process.exit(seedStatus);
  const buildStatus = await run(executable("npx"), ["next", "build"], env);
  if (buildStatus !== 0) process.exit(buildStatus);

  const args = ["playwright", "test", "--config=playwright.config.ts", ...process.argv.slice(2)];
  const status = await run(executable("npx"), args, env);
  process.exit(status);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
