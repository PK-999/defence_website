import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { getPublicClaims } from "@/lib/repositories/evidence";

const db = new PrismaClient();

describe("public evidence boundary", () => {
  it("returns only reviewed GOLD claims with public sources and usable locators", async () => {
    const person = await db.person.findUniqueOrThrow({ where: { slug: "fixture-person-001" }, select: { id: true } });
    const claims = await getPublicClaims({ type: "Person", id: person.id }, db);
    expect(claims.map((claim) => claim.property)).toContain("summary");
    expect(claims.every((claim) => claim.evidence.length > 0)).toBe(true);
    expect(claims.every((claim) => claim.evidence.every((evidence) => evidence.locator.length > 0))).toBe(true);
    expect(claims.some((claim) => claim.property === "candidateOnly")).toBe(false);
    expect(claims.some((claim) => claim.property === "rejectedOnly")).toBe(false);
    expect(claims.some((claim) => claim.property === "draftSourceOnly")).toBe(false);
  });

  it("does not include restricted quote text or internal storage/reviewer fields", async () => {
    const person = await db.person.findUniqueOrThrow({ where: { slug: "fixture-person-001" }, select: { id: true } });
    const claims = await getPublicClaims({ type: "Person", id: person.id }, db);
    const restricted = claims.find((claim) => claim.property === "restrictedQuote");
    expect(restricted).toBeDefined();
    expect(restricted?.evidence[0]?.quote).toBeNull();
    expect(JSON.stringify(restricted)).not.toContain("rawStoragePath");
    expect(JSON.stringify(restricted)).not.toContain("reviewerNote");
  });
});

afterAll(async () => {
  await db.$disconnect();
});
