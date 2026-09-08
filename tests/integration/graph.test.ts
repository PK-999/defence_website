import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { getPublicGraphNeighborhood } from "@/lib/repositories/graph";

const db = new PrismaClient();

describe("bounded public graph", () => {
  it("returns a public one-hop neighborhood with directed evidence", async () => {
    const person = await db.person.findUniqueOrThrow({ where: { slug: "fixture-person-001" }, select: { id: true } });
    const graph = await getPublicGraphNeighborhood({ type: "Person", id: person.id }, { limit: 10 }, db);
    expect(graph?.seed.title).toBe("Fixture Person 001");
    expect(graph?.edges[0]).toMatchObject({ predicate: "PARTICIPATED_IN" });
    expect(graph?.edges[0]?.evidence.length).toBeGreaterThan(0);
    expect(graph?.nodes.length).toBeLessThanOrEqual(11);
  });

  it("does not return a draft seed or a full-database dump", async () => {
    const draft = await db.person.findUniqueOrThrow({ where: { slug: "fixture-person-draft" }, select: { id: true } });
    expect(await getPublicGraphNeighborhood({ type: "Person", id: draft.id }, { limit: 100 }, db)).toBeNull();
  });
});

afterAll(async () => db.$disconnect());
