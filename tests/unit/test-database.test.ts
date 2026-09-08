import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { assertTestDatabaseUrl } from "../../scripts/lib/test-database";

const testRoot = path.resolve(".test-data");
let temporaryRoot: string;

beforeAll(async () => {
  await mkdir(testRoot, { recursive: true });
  temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "sentinel-test-db-"));
});

afterAll(async () => {
  await rm(temporaryRoot, { recursive: true, force: true });
});

describe("assertTestDatabaseUrl", () => {
  test("accepts an absolute database file directly below .test-data", () => {
    const candidate = path.join(testRoot, "integration.db");
    expect(assertTestDatabaseUrl(`file:${candidate}`)).toBe(candidate);
  });

  test.each([
    "prisma/dev.db",
    "../prisma/dev.db",
    "/tmp/test-production.db",
  ])("rejects a database outside .test-data: %s", (candidate) => {
    expect(() => assertTestDatabaseUrl(`file:${candidate}`)).toThrow("TEST_DB_ONLY");
  });

  test.each(["", "sqlite://localhost/test.db", "file:.test-data/data.sqlite"]) (
    "rejects malformed database URLs: %s",
    (url) => {
      expect(() => assertTestDatabaseUrl(url)).toThrow("TEST_DB_ONLY");
    },
  );

  test("rejects a symlinked destination file", async () => {
    const target = path.join(temporaryRoot, "outside.db");
    const link = path.join(testRoot, "linked.db");
    await writeFile(target, "not a database");
    await rm(link, { force: true });
    await symlink(target, link);

    try {
      expect(() => assertTestDatabaseUrl(`file:${link}`)).toThrow("TEST_DB_ONLY");
    } finally {
      await rm(link, { force: true });
    }
  });
});
