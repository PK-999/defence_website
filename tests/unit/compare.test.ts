import { describe, expect, it } from "vitest";
import { buildComparisonHref, normalizeComparisonSlugs } from "@/lib/domain/compare";

describe("equipment comparison state", () => {
  it("trims, deduplicates, sorts, and caps at three", () => {
    expect(normalizeComparisonSlugs([" b ", "a", "b", "c", "d"])).toEqual(["a", "b", "c"]);
  });
  it("builds deterministic encoded URLs", () => {
    expect(buildComparisonHref(["fixture-system-b", "fixture-system-a"])).toBe("/compare?items=fixture-system-a%2Cfixture-system-b");
    expect(buildComparisonHref([])).toBe("/compare");
  });
});
