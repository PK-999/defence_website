import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const schema = readFileSync(new URL("../../prisma/schema.prisma", import.meta.url), "utf8");

describe("Prisma deployment configuration", () => {
  test("includes the Vercel Linux ARM64 query engine target", () => {
    expect(schema).toContain('binaryTargets = ["native", "linux-arm64-openssl-3.0.x"]');
  });
});
