import { describe, expect, it } from "vitest";
import candidates from "@/../data/import/war-1971-initial-candidates.json";
import evidence from "@/../data/import/war-1971-evidence.json";
import manifest from "@/../content/collections/war-1971.json";
import { validateCollectionEvidenceInput } from "@/lib/import/collection";

describe("1971 starter collection package", () => {
  it("keeps the finite candidate scope aligned across manifest and entity import", () => {
    expect(candidates.records).toHaveLength(5);
    expect(manifest.knownUniverseSize).toBe(5);
    expect(manifest.knownEntityRefs).toEqual(expect.arrayContaining([
      "Conflict:indo-pakistani-war-1971",
      "Operation:operation-trident-1971",
      "Operation:battle-of-longewala-1971",
      "Person:jagjit-singh-aurora",
      "Equipment:vidyut-class-missile-boat-1971",
    ]));
  });

  it("accepts only known source and evidence references", () => {
    expect(validateCollectionEvidenceInput(evidence)).toEqual([]);
    expect(evidence.sources).toHaveLength(5);
    expect(evidence.evidence).toHaveLength(8);
    expect(evidence.relationships).toHaveLength(3);
  });
});
