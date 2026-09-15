import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { listPublicEntities } from "@/lib/repositories/collections";
import { parseCollectionQuery } from "@/lib/domain/query";
const db = new PrismaClient();
describe("bounded public collections", () => {
  it("returns stable 24/24/7 pagination for the 55-person fixture", async () => {
    const first = await listPublicEntities("Person", parseCollectionQuery({ page: "1" }), db);
    const second = await listPublicEntities("Person", parseCollectionQuery({ page: "2" }), db);
    const clamped = await listPublicEntities("Person", parseCollectionQuery({ page: "999" }), db);
    expect(first.total).toBe(55); expect(first.items).toHaveLength(24); expect(second.items).toHaveLength(24); expect(clamped.page).toBe(3); expect(clamped.items).toHaveLength(7);
    expect(new Set(first.items.map((item) => item.id)).intersection(new Set(second.items.map((item) => item.id))).size).toBe(0);
  });
  it("applies public predicates before incompatible equipment filters", async () => {
    const result = await listPublicEntities("Equipment", parseCollectionQuery({ domain: "air", category: "does-not-exist" }), db);
    expect(result.total).toBe(0); expect(result.items).toEqual([]);
    const alias = await listPublicEntities("Equipment", parseCollectionQuery({ force: "air" }), db);
    expect(alias.items.every((item) => item.facts.some((fact) => fact.value === "air"))).toBe(true);
  });
  it("orders conflict and operation collections by historical start date", async () => {
    const conflicts = await listPublicEntities("Conflict", { page: 1, pageSize: 24, sort: "date" }, db);
    const operations = await listPublicEntities("Operation", { page: 1, pageSize: 24, sort: "date" }, db);

    expect(conflicts.items.map((item) => item.slug)).toEqual(["fixture-conflict-other", "fixture-conflict"]);
    expect(operations.items.map((item) => item.slug)).toEqual(["battle-of-badgam-1947", "fixture-operation-other", "fixture-operation"]);
  });
});
afterAll(async () => { await db.$disconnect(); });
