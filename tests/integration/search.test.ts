import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { reconcileSearchIndex, searchArchive } from "@/lib/search/service";
const db = new PrismaClient();
describe("ranked public search", () => {
  it("rebuilds and ranks the public fixture without leaking drafts", async () => {
    await db.searchAlias.deleteMany(); await db.searchDocument.deleteMany(); await reconcileSearchIndex(db);
    const title = await searchArchive({ q: "Fixture Person 001", mode: "full" }, db);
    expect(title.results[0]).toMatchObject({ type: "Person", slug: "fixture-person-001" });
    const quick = await searchArchive({ q: "Fixture Person", mode: "quick" }, db);
    expect(quick.results).toHaveLength(8); expect(quick.total).toBe(55);
    expect(quick.results.some((result) => result.slug === "fixture-person-draft")).toBe(false);
  });
  it("supports literal punctuation and typed sources/units", async () => {
    expect((await searchArchive({ q: "fixture falcon", type: "equipment" }, db)).results).toHaveLength(2);
    expect((await searchArchive({ q: "fixture source", type: "source" }, db)).results.some((result) => result.slug === "fixture-source")).toBe(true);
    await expect(searchArchive({ q: "%_" }, db)).resolves.toMatchObject({ total: 0 });
    await expect(searchArchive({ q: "x" }, db)).rejects.toThrow("INVALID_QUERY");
  });
});
afterAll(async () => { await db.$disconnect(); });
