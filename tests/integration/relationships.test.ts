import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { getPublicRelationships } from "@/lib/repositories/relationships";
import { getPublicOperation } from "@/lib/repositories/entities";
import { getOperation } from "@/lib/content";

const db = new PrismaClient();

describe("public relationship boundary", () => {
  it("returns directed, evidenced GOLD edges and excludes candidates/private endpoints", async () => {
    const operation = await db.operation.findUniqueOrThrow({ where: { slug: "fixture-operation" }, select: { id: true } });
    const relationships = await getPublicRelationships({ type: "Operation", id: operation.id }, db);
    expect(relationships).toHaveLength(1);
    expect(relationships[0]).toMatchObject({
      source: { type: "Person", id: expect.any(String) },
      target: { type: "Operation", id: expect.any(String) },
      predicate: "PARTICIPATED_IN",
    });
    expect(relationships[0]?.sourceTitle).toBe("Fixture Person 001");
    expect(relationships[0]?.evidence.length).toBeGreaterThan(0);
  });

  it("does not infer operation participants from the legacy conflict join", async () => {
    const operation = await getPublicOperation("fixture-operation", db);
    expect(operation && "people" in operation).toBe(false);
    const loaded = await getOperation("fixture-operation");
    expect(loaded?.people).toHaveLength(1);
    expect(loaded?.people[0]?.slug).toBe("fixture-person-001");
  });
});

afterAll(async () => {
  await db.$disconnect();
});
