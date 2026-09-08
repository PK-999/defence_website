import { describe, expect, it } from "vitest";
import { relationshipFingerprint, validateRelationshipShape } from "@/lib/domain/relationships";

describe("relationship domain rules", () => {
  it("accepts supported directed shapes and rejects reversed or unknown edges", () => {
    expect(validateRelationshipShape({ source: { type: "Person", id: "p1" }, target: { type: "Operation", id: "o1" }, predicate: "PARTICIPATED_IN" })).toEqual([]);
    expect(validateRelationshipShape({ source: { type: "Operation", id: "o1" }, target: { type: "Person", id: "p1" }, predicate: "PARTICIPATED_IN" })[0]?.code).toBe("INVALID_RELATIONSHIP_SHAPE");
    expect(validateRelationshipShape({ source: { type: "Person", id: "p1" }, target: { type: "Operation", id: "o1" }, predicate: "MADE_UP" })[0]?.code).toBe("UNKNOWN_RELATIONSHIP_PREDICATE");
  });

  it("fingerprints explicit null dates and preserves direction", () => {
    const base = { source: { type: "Person" as const, id: "p1" }, target: { type: "Operation" as const, id: "o1" }, predicate: "PARTICIPATED_IN" };
    expect(relationshipFingerprint(base)).toBe(relationshipFingerprint({ ...base, validFrom: null, validTo: null }));
    expect(relationshipFingerprint(base)).not.toBe(relationshipFingerprint({ ...base, source: base.target, target: base.source, predicate: "PARTICIPATED_IN" }));
  });
});
