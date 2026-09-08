import type { Prisma, PrismaClient } from "@prisma/client";
import { requireEditorRole, type EditorSession } from "@/lib/auth/editor";
import { isEntityType, type EntityType } from "@/lib/domain/entities";
import type { VerificationStatus } from "@/lib/domain/types";
import { validateEntityForPublication } from "@/lib/publication/validate";

type Database = PrismaClient;
type TransactionDatabase = Prisma.TransactionClient;
type ReviewDecision = "APPROVE" | "REJECT";
type ReviewCode = "UNAUTHORIZED" | "INVALID_INPUT" | "NOT_FOUND" | "CONFLICT" | "INSUFFICIENT_EVIDENCE" | "INTERNAL_ERROR";

export type ReviewResult = { success: true; revision: number } | { success: false; code: ReviewCode; message: string };
export type ClaimReviewInput = {
  claimId: string;
  expectedRevision: number;
  decision: ReviewDecision;
  reason: string;
  verificationStatus?: VerificationStatus;
  actor?: EditorSession;
};
export type ProposalReviewInput = {
  proposalId: string;
  expectedRevision: number;
  decision: ReviewDecision;
  reason: string;
  actor?: EditorSession;
};
type ServiceOptions = { client?: Database };

const verificationStatuses = new Set<VerificationStatus>([
  "OFFICIALLY_CONFIRMED", "MULTIPLE_CREDIBLE_SOURCES", "DECLASSIFIED_RECORD", "DISPUTED", "SOURCE_CONFLICT", "UNVERIFIED",
]);

function invalidInput(reason: string, expectedRevision: number): ReviewResult | null {
  if (!Number.isInteger(expectedRevision) || expectedRevision < 0) return { success: false, code: "INVALID_INPUT", message: "expectedRevision must be a nonnegative integer." };
  if (reason.trim().length < 10 || reason.trim().length > 2000) return { success: false, code: "INVALID_INPUT", message: "A review reason between 10 and 2,000 characters is required." };
  return null;
}

async function editor(inputActor: EditorSession | undefined): Promise<EditorSession | null> {
  try { return inputActor ?? await requireEditorRole("REVIEWER"); } catch { return null; }
}

function resultError(code: ReviewCode, message: string): ReviewResult { return { success: false, code, message }; }

async function claimEvidence(tx: TransactionDatabase, claimId: string) {
  return tx.claimEvidence.findMany({
    where: { claimId },
    select: {
      evidence: {
        select: {
          locator: true, authorityType: true, authorityBasis: true,
          sourceVersion: { select: { source: { select: { id: true, author: true, publisher: true, publicationStatus: true, contentKind: true, reviewedAt: true, reviewedBy: true } } } },
        },
      },
    },
  });
}

function isPublicSource(source: { publicationStatus: string; contentKind: string; reviewedAt: Date | null; reviewedBy: string | null }): boolean {
  return source.publicationStatus === "PUBLISHED" && source.contentKind === "EDITORIAL" && Boolean(source.reviewedAt && source.reviewedBy);
}

async function verifyClaimEvidence(tx: TransactionDatabase, claimId: string, status: VerificationStatus): Promise<{ ok: true } | { ok: false; message: string }> {
  const links = await claimEvidence(tx, claimId);
  const usable = links.filter((link) => Boolean(link.evidence.locator) && isPublicSource(link.evidence.sourceVersion.source));
  if (usable.length === 0) return { ok: false, message: "At least one reviewed public source with a locator is required." };
  if (status === "OFFICIALLY_CONFIRMED" && !usable.some((link) => link.evidence.authorityType === "official-statement" && Boolean(link.evidence.authorityBasis?.trim()))) {
    return { ok: false, message: "OFFICIALLY_CONFIRMED requires official-statement evidence and an authority basis." };
  }
  if (status === "MULTIPLE_CREDIBLE_SOURCES") {
    const independent = new Set(usable.map((link) => link.evidence.sourceVersion.source.author?.trim() || link.evidence.sourceVersion.source.publisher?.trim() || link.evidence.sourceVersion.source.id));
    if (independent.size < 2) return { ok: false, message: "MULTIPLE_CREDIBLE_SOURCES requires two independently authored non-discovery sources." };
    if (usable.some((link) => link.evidence.sourceVersion.source.contentKind !== "EDITORIAL")) return { ok: false, message: "All supporting sources must be editorial records." };
  }
  return { ok: true };
}

async function updateClaim(tx: TransactionDatabase, input: ClaimReviewInput, actor: EditorSession): Promise<ReviewResult> {
  const claim = await tx.claim.findUnique({ where: { id: input.claimId }, select: { id: true, status: true, revision: true, verificationStatus: true, value: true, property: true, entityType: true, entityId: true } });
  if (!claim) return resultError("NOT_FOUND", "Claim was not found.");
  if (claim.status !== "CANDIDATE" || claim.revision !== input.expectedRevision) return resultError("CONFLICT", "Claim changed or was already reviewed.");
  const nextStatus = input.decision === "APPROVE" ? "GOLD" : "REJECTED";
  const nextVerification = input.verificationStatus ?? (input.decision === "APPROVE" ? "MULTIPLE_CREDIBLE_SOURCES" : claim.verificationStatus as VerificationStatus);
  if (!verificationStatuses.has(nextVerification)) return resultError("INVALID_INPUT", "Unsupported verification status.");
  if (input.decision === "APPROVE") {
    const evidence = await verifyClaimEvidence(tx, input.claimId, nextVerification);
    if (!evidence.ok) return resultError("INSUFFICIENT_EVIDENCE", evidence.message);
  }
  const updated = await tx.claim.updateMany({ where: { id: input.claimId, status: "CANDIDATE", revision: input.expectedRevision }, data: { status: nextStatus, verificationStatus: nextVerification, reviewedAt: new Date(), reviewedBy: actor.actorId, revision: { increment: 1 } } });
  if (updated.count !== 1) return resultError("CONFLICT", "Claim changed or was already reviewed.");
  await tx.reviewAudit.create({ data: { actorId: actor.actorId, action: input.decision === "APPROVE" ? "APPROVE_CLAIM" : "REJECT_CLAIM", entityType: claim.entityType, entityId: claim.entityId, previousValue: JSON.stringify({ status: claim.status, verificationStatus: claim.verificationStatus, revision: claim.revision, value: claim.value, property: claim.property }), nextValue: JSON.stringify({ status: nextStatus, verificationStatus: nextVerification, revision: claim.revision + 1 }), reason: input.reason.trim() } });
  return { success: true, revision: claim.revision + 1 };
}

export async function reviewClaim(input: ClaimReviewInput, options: ServiceOptions = {}): Promise<ReviewResult> {
  const invalid = invalidInput(input.reason, input.expectedRevision);
  if (invalid || !["APPROVE", "REJECT"].includes(input.decision)) return invalid ?? resultError("INVALID_INPUT", "Unsupported review decision.");
  const actor = await editor(input.actor);
  if (!actor) return resultError("UNAUTHORIZED", "Editor access is not configured or the user is not allowlisted.");
  if (!options.client) return resultError("INTERNAL_ERROR", "Review database is not configured.");
  try { return await options.client.$transaction((tx) => updateClaim(tx, input, actor)); }
  catch (error) { console.error("Claim review transaction failed:", error instanceof Error ? error.message : "unknown error"); return resultError("INTERNAL_ERROR", "Review could not be completed."); }
}

const commonProposalFields = new Set(["title", "summary", "content"]);
const proposalFields: Record<EntityType, Set<string>> = {
  Conflict: new Set([...commonProposalFields, "dateStart", "dateEnd", "dateStartPrecision", "dateEndPrecision", "theatres"]),
  Operation: new Set([...commonProposalFields, "category", "dateStart", "dateEnd", "dateStartPrecision", "dateEndPrecision"]),
  Person: new Set([...commonProposalFields, "fullName", "rank", "serviceBranch", "decorations", "birthDate", "deathDate", "birthDatePrecision", "deathDatePrecision"]),
  Equipment: new Set([...commonProposalFields, "domain", "category", "developmentModel", "serviceStatus", "originCountries", "specs", "variantLabel", "statusAsOf"]),
  Unit: new Set([...commonProposalFields, "serviceId", "unitType", "parentUnitId", "motto", "warCry", "establishedDate", "disbandedDate", "ranksJson", "awardsJson"]),
  Source: new Set([...commonProposalFields, "author", "publicationDate", "publisher", "canonicalUrl", "sourceType", "tier", "language", "rightsNotes"]),
};

function proposalData(entityType: EntityType, raw: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const allowed = proposalFields[entityType];
    return Object.fromEntries(Object.entries(parsed).filter(([key, value]) => allowed.has(key) && (typeof value === "string" || value === null || typeof value === "number" || typeof value === "boolean" || Array.isArray(value) || (typeof value === "object" && value !== null))));
  } catch { return null; }
}

function proposalEntity(tx: TransactionDatabase, type: EntityType, id: string) {
  switch (type) {
    case "Conflict": return tx.conflict.findUnique({ where: { id }, select: { id: true, revision: true, publicationStatus: true } });
    case "Operation": return tx.operation.findUnique({ where: { id }, select: { id: true, revision: true, publicationStatus: true } });
    case "Person": return tx.person.findUnique({ where: { id }, select: { id: true, revision: true, publicationStatus: true } });
    case "Equipment": return tx.equipment.findUnique({ where: { id }, select: { id: true, revision: true, publicationStatus: true } });
    case "Unit": return tx.unit.findUnique({ where: { id }, select: { id: true, revision: true, publicationStatus: true } });
    case "Source": return tx.source.findUnique({ where: { id }, select: { id: true, revision: true, publicationStatus: true } });
  }
}

async function applyProposal(tx: TransactionDatabase, type: EntityType, id: string, data: Record<string, unknown>) {
  const normalized = Object.fromEntries(Object.entries(data).map(([key, value]) => {
    const jsonFields = new Set(["theatres", "decorations", "originCountries", "specs", "ranksJson", "awardsJson"]);
    return [key, jsonFields.has(key) && typeof value !== "string" ? JSON.stringify(value) : value];
  }));
  const update = { ...normalized, publicationStatus: "IN_REVIEW", reviewedAt: null, reviewedBy: null, revision: { increment: 1 } };
  switch (type) {
    case "Conflict": return tx.conflict.update({ where: { id }, data: update });
    case "Operation": return tx.operation.update({ where: { id }, data: update });
    case "Person": return tx.person.update({ where: { id }, data: update });
    case "Equipment": return tx.equipment.update({ where: { id }, data: update });
    case "Unit": return tx.unit.update({ where: { id }, data: update });
    case "Source": return tx.source.update({ where: { id }, data: update });
  }
}

export async function reviewEntityProposal(input: ProposalReviewInput, options: ServiceOptions = {}): Promise<ReviewResult> {
  const invalid = invalidInput(input.reason, input.expectedRevision);
  if (invalid || !["APPROVE", "REJECT"].includes(input.decision)) return invalid ?? resultError("INVALID_INPUT", "Unsupported review decision.");
  const actor = await editor(input.actor);
  if (!actor) return resultError("UNAUTHORIZED", "Editor access is not configured or the user is not allowlisted.");
  if (!options.client) return resultError("INTERNAL_ERROR", "Review database is not configured.");
  try {
    return await options.client.$transaction(async (tx) => {
      const proposal = await tx.importProposal.findUnique({ where: { id: input.proposalId } });
      if (!proposal || !isEntityType(proposal.entityType)) return resultError("NOT_FOUND", "Import proposal was not found.");
      if (proposal.status !== "CANDIDATE") return resultError("CONFLICT", "Import proposal was already reviewed.");
      const entity = await proposalEntity(tx, proposal.entityType, proposal.entityId);
      if (!entity) return resultError("NOT_FOUND", "Proposed entity was not found.");
      if (entity.revision !== input.expectedRevision || proposal.expectedRevision !== input.expectedRevision) return resultError("CONFLICT", "Entity changed since the proposal was created.");
      if (input.decision === "REJECT") {
        await tx.importProposal.update({ where: { id: proposal.id }, data: { status: "REJECTED" } });
        await tx.reviewAudit.create({ data: { actorId: actor.actorId, action: "REJECT_PROPOSAL", entityType: proposal.entityType, entityId: proposal.entityId, previousValue: proposal.originalDataJson, nextValue: proposal.proposedDataJson, reason: input.reason.trim() } });
        return { success: true, revision: entity.revision };
      }
      const proposed = proposalData(proposal.entityType, proposal.proposedDataJson);
      if (!proposed || Object.keys(proposed).length === 0) return resultError("INVALID_INPUT", "Proposal contains no allowlisted content fields.");
      const updated = await applyProposal(tx, proposal.entityType, proposal.entityId, proposed);
      const issues = await validateEntityForPublication({ type: proposal.entityType, id: proposal.entityId }, { client: tx });
      if (issues.some((issue) => issue.severity === "error")) return resultError("INSUFFICIENT_EVIDENCE", "Proposal needs evidence or valid content before it can enter review.");
      await tx.importProposal.update({ where: { id: proposal.id }, data: { status: "APPROVED" } });
      await tx.reviewAudit.create({ data: { actorId: actor.actorId, action: "APPROVE_PROPOSAL", entityType: proposal.entityType, entityId: proposal.entityId, previousValue: proposal.originalDataJson, nextValue: JSON.stringify(proposed), reason: input.reason.trim() } });
      await tx.searchDocument.deleteMany({ where: { entityType: proposal.entityType, entityId: proposal.entityId } });
      return { success: true, revision: updated.revision };
    });
  } catch (error) { console.error("Proposal review transaction failed:", error instanceof Error ? error.message : "unknown error"); return resultError("INTERNAL_ERROR", "Proposal review could not be completed."); }
}
