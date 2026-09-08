import type { Prisma, PrismaClient } from "@prisma/client";
import { requireEditorRole, type EditorSession } from "@/lib/auth/editor";
import type { EntityRef, EntityType } from "@/lib/domain/entities";
import type { ValidationIssue } from "@/lib/domain/types";
import { validateEntityForPublication, type PublicationDatabase } from "./validate";
import { rebuildSearchDocument } from "@/lib/search/service";

type Database = PrismaClient;
type Result =
  | { success: true; revision: number }
  | { success: false; code: "UNAUTHORIZED" | "INVALID_INPUT" | "NOT_FOUND" | "CONFLICT" | "INTERNAL_ERROR"; message: string; issues?: ValidationIssue[] };

type PublicationInput = { ref: EntityRef; expectedRevision: number; reason: string; actor?: EditorSession };
type ServiceOptions = { client?: Database };

function invalidInput(input: PublicationInput): Result | null {
  if (!Number.isInteger(input.expectedRevision) || input.expectedRevision < 0) return { success: false, code: "INVALID_INPUT", message: "expectedRevision must be a nonnegative integer." };
  if (input.reason.trim().length < 10 || input.reason.trim().length > 2000) return { success: false, code: "INVALID_INPUT", message: "A review reason between 10 and 2,000 characters is required." };
  return null;
}

async function currentEntity(tx: Prisma.TransactionClient, ref: EntityRef): Promise<{ id: string; revision: number; publicationStatus: string } | null> {
  const select = { id: true, revision: true, publicationStatus: true } as const;
  switch (ref.type) {
    case "Conflict": return tx.conflict.findUnique({ where: { id: ref.id }, select });
    case "Operation": return tx.operation.findUnique({ where: { id: ref.id }, select });
    case "Person": return tx.person.findUnique({ where: { id: ref.id }, select });
    case "Equipment": return tx.equipment.findUnique({ where: { id: ref.id }, select });
    case "Unit": return tx.unit.findUnique({ where: { id: ref.id }, select });
    case "Source": return tx.source.findUnique({ where: { id: ref.id }, select });
  }
}

async function updatePublication(tx: Prisma.TransactionClient, ref: EntityRef, data: { publicationStatus: string; reviewedAt: Date | null; reviewedBy: string | null; revision: { increment: number } }) {
  switch (ref.type) {
    case "Conflict": return tx.conflict.update({ where: { id: ref.id }, data });
    case "Operation": return tx.operation.update({ where: { id: ref.id }, data });
    case "Person": return tx.person.update({ where: { id: ref.id }, data });
    case "Equipment": return tx.equipment.update({ where: { id: ref.id }, data });
    case "Unit": return tx.unit.update({ where: { id: ref.id }, data });
    case "Source": return tx.source.update({ where: { id: ref.id }, data });
  }
}

async function execute(input: PublicationInput, action: "PUBLISH" | "WITHDRAW", options: ServiceOptions): Promise<Result> {
  const invalid = invalidInput(input);
  if (invalid) return invalid;
  let actor: EditorSession;
  try {
    actor = input.actor ?? await requireEditorRole("PUBLISHER");
  } catch {
    return { success: false, code: "UNAUTHORIZED", message: "Editor access is not configured." };
  }
  const client = options.client;
  if (!client) return { success: false, code: "INTERNAL_ERROR", message: "Publication database is not configured." };

  try {
    return await client.$transaction(async (tx) => {
      const current = await currentEntity(tx, input.ref);
      if (!current) return { success: false, code: "NOT_FOUND", message: "Entity was not found." };
      if (current.revision !== input.expectedRevision) return { success: false, code: "CONFLICT", message: "Entity changed since it was loaded." };
      if (action === "PUBLISH") {
        const issues = await validateEntityForPublication(input.ref, { client: tx as PublicationDatabase });
        const errors = issues.filter((issue) => issue.severity === "error");
        if (errors.length > 0) return { success: false, code: "INVALID_INPUT", message: "Publication validation failed.", issues: errors };
      }
      const nextStatus = action === "PUBLISH" ? "PUBLISHED" : "WITHDRAWN";
      const now = new Date();
      const updated = await updatePublication(tx, input.ref, { publicationStatus: nextStatus, reviewedAt: action === "PUBLISH" ? now : null, reviewedBy: action === "PUBLISH" ? actor.actorId : null, revision: { increment: 1 } });
      await tx.reviewAudit.create({ data: { actorId: actor.actorId, action, entityType: input.ref.type, entityId: input.ref.id, previousValue: JSON.stringify({ publicationStatus: current.publicationStatus, revision: current.revision }), nextValue: JSON.stringify({ publicationStatus: nextStatus, revision: current.revision + 1 }), reason: input.reason.trim() } });
      await rebuildSearchDocument(tx, input.ref);
      return { success: true, revision: updated.revision };
    });
  } catch (error) {
    console.error("Publication transaction failed:", error instanceof Error ? error.message : "unknown error");
    return { success: false, code: "INTERNAL_ERROR", message: "Publication could not be completed." };
  }
}

export function publishEntity(input: PublicationInput, options: ServiceOptions = {}): Promise<Result> {
  return execute(input, "PUBLISH", options);
}

export function withdrawEntity(input: PublicationInput, options: ServiceOptions = {}): Promise<Result> {
  return execute(input, "WITHDRAW", options);
}
