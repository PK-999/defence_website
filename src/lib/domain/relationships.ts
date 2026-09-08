import { createHash } from "node:crypto";
import type { EntityRef, EntityType } from "./entities";
import type { RelationshipInput, ValidationIssue } from "./types";

export const relationshipPredicates = [
  "INCLUDES_OPERATION",
  "PARTICIPATED_IN",
  "COMMANDED",
  "OPERATED_BY",
  "USED_IN",
  "PART_OF",
  "DOCUMENTS",
] as const;

export type RelationshipPredicate = (typeof relationshipPredicates)[number];

const allowedShapes: Record<RelationshipPredicate, Array<[EntityType, EntityType]>> = {
  INCLUDES_OPERATION: [["Conflict", "Operation"]],
  PARTICIPATED_IN: [["Person", "Operation"]],
  COMMANDED: [["Person", "Operation"], ["Unit", "Operation"]],
  OPERATED_BY: [["Operation", "Unit"], ["Equipment", "Unit"]],
  USED_IN: [["Equipment", "Operation"]],
  PART_OF: [["Unit", "Unit"]],
  DOCUMENTS: [["Source", "Conflict"], ["Source", "Operation"], ["Source", "Person"], ["Source", "Equipment"], ["Source", "Unit"]],
};

export function validateRelationshipShape(input: RelationshipInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!relationshipPredicates.includes(input.predicate as RelationshipPredicate)) {
    issues.push({ code: "UNKNOWN_RELATIONSHIP_PREDICATE", path: "predicate", message: "Relationship predicate is not supported.", severity: "error" });
    return issues;
  }
  const shapes = allowedShapes[input.predicate as RelationshipPredicate];
  if (!shapes.some(([source, target]) => source === input.source.type && target === input.target.type)) {
    issues.push({ code: "INVALID_RELATIONSHIP_SHAPE", path: "source/target", message: `${input.predicate} cannot connect ${input.source.type} to ${input.target.type}.`, severity: "error" });
  }
  if (!input.source.id.trim() || !input.target.id.trim()) {
    issues.push({ code: "MISSING_RELATIONSHIP_ENDPOINT", path: "source/target", message: "Relationship endpoints are required.", severity: "error" });
  }
  return issues;
}

export function relationshipFingerprint(input: RelationshipInput): string {
  const canonical = [input.source.type, input.source.id, input.predicate, input.target.type, input.target.id, input.validFrom ?? null, input.validTo ?? null];
  return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}

export function entityHref(ref: EntityRef): string {
  const routes: Record<EntityType, string> = {
    Conflict: "/conflicts",
    Operation: "/operations",
    Person: "/heroes",
    Equipment: "/arsenal",
    Unit: "/forces/units",
    Source: "/archive",
  };
  return `${routes[ref.type]}/${encodeURIComponent(ref.id)}`;
}
