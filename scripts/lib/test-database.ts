import { existsSync, lstatSync, realpathSync } from "node:fs";
import path from "node:path";

const TEST_DATABASE_ROOT = path.resolve(".test-data");

function rejectIfSymlinked(candidate: string): void {
  if (!existsSync(TEST_DATABASE_ROOT)) {
    throw new Error("TEST_DB_ONLY: .test-data does not exist");
  }

  const rootStat = lstatSync(TEST_DATABASE_ROOT);
  if (rootStat.isSymbolicLink()) {
    throw new Error("TEST_DB_ONLY: .test-data cannot be a symlink");
  }

  let current = path.dirname(candidate);
  while (true) {
    if (existsSync(current) && lstatSync(current).isSymbolicLink()) {
      throw new Error("TEST_DB_ONLY: database parent cannot be a symlink");
    }
    if (current === TEST_DATABASE_ROOT) break;
    const parent = path.dirname(current);
    if (parent === current || !current.startsWith(`${TEST_DATABASE_ROOT}${path.sep}`)) {
      throw new Error("TEST_DB_ONLY: database path escaped .test-data");
    }
    current = parent;
  }

  if (existsSync(candidate) && lstatSync(candidate).isSymbolicLink()) {
    throw new Error("TEST_DB_ONLY: database file cannot be a symlink");
  }

  const realRoot = realpathSync.native(TEST_DATABASE_ROOT);
  const realParent = realpathSync.native(path.dirname(candidate));
  const realCandidate = path.join(realParent, path.basename(candidate));
  const relative = path.relative(realRoot, realCandidate);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("TEST_DB_ONLY: resolved database path escaped .test-data");
  }
}

export function assertTestDatabaseUrl(url: string): string {
  if (typeof url !== "string" || !url.startsWith("file:")) {
    throw new Error("TEST_DB_ONLY");
  }

  const rawPath = url.slice("file:".length);
  if (!rawPath || rawPath.includes("\0")) {
    throw new Error("TEST_DB_ONLY");
  }

  const absolute = path.resolve(rawPath);
  const relative = path.relative(TEST_DATABASE_ROOT, absolute);
  if (
    !relative ||
    relative.startsWith("..") ||
    path.isAbsolute(relative) ||
    path.extname(absolute) !== ".db"
  ) {
    throw new Error("TEST_DB_ONLY");
  }

  rejectIfSymlinked(absolute);
  return absolute;
}

export function testDatabaseRoot(): string {
  return TEST_DATABASE_ROOT;
}

export function assertDestructiveSeedAllowed(): void {
  if (process.env.ALLOW_DESTRUCTIVE_SEED !== "1") {
    throw new Error("DESTRUCTIVE_SEED_DISABLED: set ALLOW_DESTRUCTIVE_SEED=1 for an isolated test database only");
  }
  assertTestDatabaseUrl(process.env.DATABASE_URL ?? "");
}
