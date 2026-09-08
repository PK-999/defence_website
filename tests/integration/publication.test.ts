import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { getPublicEntityBySlug, getPublicSlugs } from "@/lib/repositories/entities";
import { validateEntityForPublication } from "@/lib/publication/validate";
import { validateDatabase } from "@/lib/publication/validate";
import { publishEntity, withdrawEntity } from "@/lib/publication/service";

const db = new PrismaClient();

describe("public publication boundary", () => {
  it("returns only reviewed editorial records for every public entity type", async () => {
    const expected: Array<["Conflict" | "Operation" | "Person" | "Equipment" | "Unit" | "Source", string, string]> = [
      ["Conflict", "fixture-conflict", "fixture-conflict-draft"],
      ["Operation", "fixture-operation", "fixture-operation-draft"],
      ["Person", "fixture-person-001", "fixture-person-draft"],
      ["Equipment", "fixture-system-a", "fixture-system-draft"],
      ["Unit", "fixture-unit", "fixture-unit-draft"],
      ["Source", "fixture-source", "fixture-source-draft"],
    ];

    for (const [entityType, publicSlug, hiddenSlug] of expected) {
      const entity = await getPublicEntityBySlug(entityType, publicSlug, db);
      expect(entity?.slug).toBe(publicSlug);
      expect(await getPublicEntityBySlug(entityType, hiddenSlug, db)).toBeNull();
      expect(await getPublicSlugs(entityType, db)).toContain(publicSlug);
    }
  });

  it("does not expose a hidden guessed slug through repository reads", async () => {
    expect(await getPublicEntityBySlug("Person", "fixture-person-withdrawn", db)).toBeNull();
    expect(await getPublicEntityBySlug("Person", "fixture-person-demo", db)).toBeNull();
  });

  it("rejects publication without narrative evidence and leaves state/audit unchanged", async () => {
    const candidate = await db.person.create({
      data: { slug: "fixture-publication-invalid", title: "Fixture Invalid Publication", fullName: "Fixture Invalid Publication", summary: "Synthetic candidate.", status: "Draft", publicationStatus: "DRAFT" },
    });
    const issues = await validateEntityForPublication({ type: "Person", id: candidate.id }, { client: db });
    expect(issues.some((issue) => issue.code === "MISSING_ENTITY_EVIDENCE")).toBe(true);
    const result = await publishEntity({ ref: { type: "Person", id: candidate.id }, expectedRevision: 0, reason: "A sufficiently specific review reason.", actor: { actorId: "fixture-editor", issuer: "fixture", subject: "editor" } }, { client: db });
    expect(result.success).toBe(false);
    expect((await db.person.findUniqueOrThrow({ where: { id: candidate.id } })).publicationStatus).toBe("DRAFT");
    expect(await db.reviewAudit.count({ where: { entityId: candidate.id } })).toBe(0);
  });

  it("publishes and withdraws a fully evidenced candidate transactionally", async () => {
    const evidence = await db.evidence.findFirstOrThrow({ where: { locator: "sentence1" }, select: { id: true } });
    const candidate = await db.person.create({
      data: { slug: "fixture-publication-cycle", title: "Fixture Publication Cycle", fullName: "Fixture Publication Cycle", summary: "Synthetic candidate with evidence.", content: "Synthetic candidate body.", status: "Draft", publicationStatus: "DRAFT" },
    });
    await db.entityEvidence.createMany({ data: [{ entityType: "Person", entityId: candidate.id, section: "summary", evidenceId: evidence.id }, { entityType: "Person", entityId: candidate.id, section: "content", evidenceId: evidence.id }] });
    const actor = { actorId: "fixture-editor", issuer: "fixture", subject: "editor" };
    const published = await publishEntity({ ref: { type: "Person", id: candidate.id }, expectedRevision: 0, reason: "Reviewed against the linked synthetic source.", actor }, { client: db });
    expect(published).toMatchObject({ success: true, revision: 1 });
    expect(await getPublicEntityBySlug("Person", "fixture-publication-cycle", db)).not.toBeNull();
    expect(await db.reviewAudit.count({ where: { entityId: candidate.id, action: "PUBLISH" } })).toBe(1);

    const withdrawn = await withdrawEntity({ ref: { type: "Person", id: candidate.id }, expectedRevision: 1, reason: "Withdrawn for fixture verification.", actor }, { client: db });
    expect(withdrawn).toMatchObject({ success: true, revision: 2 });
    expect(await getPublicEntityBySlug("Person", "fixture-publication-cycle", db)).toBeNull();
  });

  it("reports polymorphic reference errors without repairing the database", async () => {
    const clean = await validateDatabase({ client: db });
    expect(clean.filter((issue) => issue.severity === "error")).toEqual([]);
    const invalid = await db.claim.create({ data: { entityType: "Person", entityId: "missing-entity", property: "bad", value: "bad", verificationStatus: "UNVERIFIED" } });
    const issues = await validateDatabase({ client: db });
    expect(issues.some((issue) => issue.code === "INVALID_CLAIM_SUBJECT")).toBe(true);
    await db.claim.delete({ where: { id: invalid.id } });
  });
});

afterAll(async () => {
  await db.$disconnect();
});
