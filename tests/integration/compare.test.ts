import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { getPublicComparison } from "@/lib/domain/compare";

const db = new PrismaClient();

describe("public equipment comparison", () => {
  it("returns public systems, missing slugs, and compatible units only", async () => {
    const result = await getPublicComparison(["fixture-system-a", "fixture-system-b", "fixture-system-draft", "missing"], db);
    expect(result.systems.map((system) => system.slug)).toEqual(["fixture-system-a", "fixture-system-b"]);
    expect(result.missing).toEqual(["fixture-system-draft"]);
    expect(result.rows.some((row) => row.label === "ferry range")).toBe(true);
    expect(result.rows.some((row) => row.label === "combat radius")).toBe(false);
  });
});

afterAll(async () => db.$disconnect());
