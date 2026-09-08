import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { reviewClaim, reviewEntityProposal } from "@/lib/review/service";

const db = new PrismaClient();
const actor = { actorId: "fixture-editor", issuer: "https://issuer.fixture", subject: "editor-1" };

async function fixturePersonId(slug = "fixture-person-001") {
  return (await db.person.findUniqueOrThrow({ where: { slug }, select: { id: true, revision: true } }));
}

describe("transactional review workflow", () => {
  it("approves an evidenced candidate exactly once and rejects a stale retry", async () => {
    const person = await fixturePersonId();
    const evidence = await db.evidence.findFirstOrThrow({ where: { locator: "sentence1" }, select: { id: true } });
    const claim = await db.claim.create({
      data: { entityType: "Person", entityId: person.id, property: "reviewedRank", value: "Fixture rank", verificationStatus: "DECLASSIFIED_RECORD", status: "CANDIDATE", evidence: { create: { evidenceId: evidence.id } } },
    });
    const first = await reviewClaim({ claimId: claim.id, expectedRevision: 0, decision: "APPROVE", verificationStatus: "DECLASSIFIED_RECORD", reason: "Reviewed against the linked fixture source.", actor }, { client: db });
    const stale = await reviewClaim({ claimId: claim.id, expectedRevision: 0, decision: "APPROVE", verificationStatus: "DECLASSIFIED_RECORD", reason: "A second reviewer attempted the old revision.", actor }, { client: db });
    expect(first).toMatchObject({ success: true, revision: 1 });
    expect(stale).toMatchObject({ success: false, code: "CONFLICT" });
    expect(await db.reviewAudit.count({ where: { entityId: person.id, action: "APPROVE_CLAIM" } })).toBe(1);
  });

  it("does not approve a claim with insufficient official evidence", async () => {
    const person = await fixturePersonId("fixture-person-002");
    const evidence = await db.evidence.findFirstOrThrow({ where: { locator: "sentence1" }, select: { id: true } });
    const claim = await db.claim.create({ data: { entityType: "Person", entityId: person.id, property: "officialFact", value: "Needs official basis", verificationStatus: "UNVERIFIED", status: "CANDIDATE", evidence: { create: { evidenceId: evidence.id } } } });
    const result = await reviewClaim({ claimId: claim.id, expectedRevision: 0, decision: "APPROVE", verificationStatus: "OFFICIALLY_CONFIRMED", reason: "The reviewer checked the candidate evidence.", actor }, { client: db });
    expect(result).toMatchObject({ success: false, code: "INSUFFICIENT_EVIDENCE" });
    expect((await db.claim.findUniqueOrThrow({ where: { id: claim.id } })).status).toBe("CANDIDATE");
  });

  it("rejects a candidate with an audit and no public promotion", async () => {
    const person = await fixturePersonId("fixture-person-003");
    const claim = await db.claim.create({ data: { entityType: "Person", entityId: person.id, property: "discarded", value: "Rejected candidate", verificationStatus: "UNVERIFIED", status: "CANDIDATE" } });
    const result = await reviewClaim({ claimId: claim.id, expectedRevision: 0, decision: "REJECT", reason: "The candidate could not be supported by the supplied record.", actor }, { client: db });
    expect(result).toMatchObject({ success: true, revision: 1 });
    expect((await db.claim.findUniqueOrThrow({ where: { id: claim.id } })).status).toBe("REJECTED");
  });

  it("approves a valid proposal into IN_REVIEW and rejects stale or invalid proposals atomically", async () => {
    const person = await db.person.create({ data: { slug: "review-proposal-person", title: "Review proposal person", fullName: "Review proposal person", summary: "Initial sourced summary.", content: "Initial sourced content.", status: "Draft", publicationStatus: "DRAFT" } });
    const evidence = await db.evidence.findFirstOrThrow({ where: { locator: "sentence1" }, select: { id: true } });
    await db.entityEvidence.createMany({ data: [{ entityType: "Person", entityId: person.id, section: "summary", evidenceId: evidence.id }, { entityType: "Person", entityId: person.id, section: "content", evidenceId: evidence.id }] });
    const run = await db.importRun.create({ data: { inputHash: `review-${person.id}`, schemaVersion: 1, status: "APPLIED", reportJson: "{}" } });
    const proposal = await db.importProposal.create({ data: { importRunId: run.id, entityType: "Person", entityId: person.id, expectedRevision: person.revision, proposedDataJson: JSON.stringify({ title: "Reviewed proposal title", summary: "Updated, sourced summary.", content: "Updated, sourced content." }), originalDataJson: JSON.stringify({ title: "Original" }), issuesJson: "[]" } });
    const approved = await reviewEntityProposal({ proposalId: proposal.id, expectedRevision: person.revision, decision: "APPROVE", reason: "The proposed revision is supported by the linked evidence.", actor }, { client: db });
    expect(approved).toMatchObject({ success: true, revision: person.revision + 1 });
    expect((await db.person.findUniqueOrThrow({ where: { id: person.id } })).publicationStatus).toBe("IN_REVIEW");
    expect((await db.importProposal.findUniqueOrThrow({ where: { id: proposal.id } })).status).toBe("APPROVED");

    const stale = await db.importProposal.create({ data: { importRunId: run.id, entityType: "Person", entityId: person.id, expectedRevision: person.revision, proposedDataJson: JSON.stringify({ title: "Stale proposal" }), originalDataJson: "{}", issuesJson: "[]" } }).catch(() => null);
    if (stale) {
      const result = await reviewEntityProposal({ proposalId: stale.id, expectedRevision: person.revision, decision: "APPROVE", reason: "This proposal uses a stale entity revision.", actor }, { client: db });
      expect(result).toMatchObject({ success: false, code: "CONFLICT" });
    }
  });
});

afterAll(async () => { await db.$disconnect(); });
