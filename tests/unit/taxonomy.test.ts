import { describe, expect, test } from "vitest";
import {
  normalizeDevelopmentModel,
  normalizeDomain,
  normalizeOperationCategory,
  normalizeAwards,
  normalizeRank,
  normalizeService,
  normalizeServiceStatus,
} from "../../src/lib/domain/taxonomy";

describe("taxonomy normalization", () => {
  test.each([
    ["Air", "air"], ["Land", "land"], ["Naval", "sea"], ["Missiles", "missile"],
  ])("maps legacy domain %s to %s", (input, expected) => {
    expect(normalizeDomain(input).value).toBe(expected);
    expect(normalizeDomain(input).issues).toEqual([]);
  });

  test("keeps unknown domains visible as review issues", () => {
    const result = normalizeDomain("classified domain");
    expect(result.value).toBe("unknown");
    expect(result.issues[0]).toMatchObject({ severity: "warning", code: "UNKNOWN_DOMAIN" });
  });

  test.each([["Active", "active"], ["Deployed", "active"], ["Under Development", "under-development"]]) (
    "normalizes service status %s",
    (input, expected) => expect(normalizeServiceStatus(input).value).toBe(expected),
  );

  test.each([["Indigenous", "indigenous"], ["Joint Venture", "joint-development"], ["Procured", "imported"]]) (
    "normalizes development model %s",
    (input, expected) => expect(normalizeDevelopmentModel(input).value).toBe(expected),
  );

  test("does not infer a service for an unknown label", () => {
    expect(normalizeService("Unknown Regiment")).toMatchObject({ value: null });
  });

  test("keeps awards and ranks exact", () => {
    expect(normalizeAwards(["Param Vir Chakra", "Param Vir Chakra", "Not a medal"]).value).toEqual(["Param Vir Chakra"]);
    expect(normalizeAwards(["Param Vir Chakra", "Not a medal"]).issues[0]).toMatchObject({ code: "UNKNOWN_AWARD", severity: "warning" });
    expect(normalizeRank("Lieutenant General").value).toBe("Lieutenant General");
    expect(normalizeRank("General-ish")).toMatchObject({ value: null, issues: [{ code: "UNKNOWN_RANK", severity: "warning" }] });
  });

  test.each([["Battle", "battle"], ["Naval Battle", "battle"], ["Humanitarian", "humanitarian"]]) (
    "maps operation category %s",
    (input, expected) => expect(normalizeOperationCategory(input).value).toBe(expected),
  );
});
