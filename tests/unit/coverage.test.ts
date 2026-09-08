import { describe, expect, it } from "vitest";
import { calculateCoverage } from "@/lib/coverage";

describe("collection coverage metrics", () => {
  it("keeps known, indexed, sourced, and reviewed counts separate", () => {
    expect(calculateCoverage({ knownUniverseSize: 10, indexed: 8, sourced: 6, reviewed: 4 })).toEqual({
      known: { count: 10, percentage: 100 },
      indexed: { count: 8, percentage: 80 },
      sourced: { count: 6, percentage: 60 },
      reviewed: { count: 4, percentage: 40 },
    });
  });

  it("does not invent a denominator for an unknown or empty universe", () => {
    expect(calculateCoverage({ knownUniverseSize: null, indexed: 0, sourced: 0, reviewed: 0 }).reviewed).toEqual({ count: 0, percentage: null });
    expect(calculateCoverage({ knownUniverseSize: 0, indexed: 0, sourced: 0, reviewed: 0 }).sourced).toEqual({ count: 0, percentage: null });
  });
});
