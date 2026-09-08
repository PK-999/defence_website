import { describe, expect, it } from "vitest";
import manifest from "@/../data/import/kargil-evidence.json";
import { validateCollectionEvidenceInput } from "@/lib/import/collection";

describe("collection evidence package", () => {
  it("accepts the Kargil source, evidence, claims, and relationship references", () => {
    expect(validateCollectionEvidenceInput(manifest)).toEqual([]);
  });

  it("rejects an evidence reference to an unknown source", () => {
    const invalid = { ...manifest, evidence: [{ ...manifest.evidence[0], sourceId: "missing-source" }] };
    expect(validateCollectionEvidenceInput(invalid).map((issue) => issue.code)).toContain("UNKNOWN_SOURCE");
  });
});
