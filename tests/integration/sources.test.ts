import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { listPublicSources, getPublicSourceBySlug } from "@/lib/repositories/sources";

const db = new PrismaClient();

describe("public source library", () => {
  it("filters and paginates only reviewed source rows", async () => {
    const page = await listPublicSources({ page: 1, pageSize: 1, sort: "title", publisher: "Fixture Publisher" }, db);
    expect(page.total).toBe(1);
    expect(page.items).toHaveLength(1);
    expect(page.items[0]?.slug).toBe("fixture-source");
    const draft = await listPublicSources({ page: 1, pageSize: 24, sort: "title", sourceType: "other" }, db);
    expect(draft.items.some((source) => source.slug === "fixture-source-draft")).toBe(false);
  });

  it("returns every public evidence item and only public linked entities", async () => {
    const source = await getPublicSourceBySlug("fixture-source", db);
    expect(source).not.toBeNull();
    expect(source?.versions.flatMap((version) => version.evidence)).toHaveLength(2);
    expect(source?.versions.flatMap((version) => version.evidence).map((evidence) => evidence.quote)).toContain(null);
    expect(source?.linkedEntities.every((entity) => entity.slug !== "fixture-person-draft")).toBe(true);
    expect(source?.linkedEntities.some((entity) => entity.slug === "fixture-person-001")).toBe(true);
  });

  it("does not expose a draft source by slug", async () => {
    expect(await getPublicSourceBySlug("fixture-source-draft", db)).toBeNull();
  });
});

afterAll(async () => db.$disconnect());
