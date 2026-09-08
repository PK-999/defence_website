import { describe, expect, it } from "vitest";
import { validateMapAssets } from "@/../scripts/validate-assets";

describe("map asset manifest", () => {
  it("validates checked-in geometry, attribution, and byte budgets", async () => {
    expect(await validateMapAssets()).toEqual([]);
  });
});
