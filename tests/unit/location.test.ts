import { describe, expect, it } from "vitest";
import { parseLocation } from "@/lib/domain/location";

describe("reviewed locations", () => {
  it("accepts bounded coordinates with provenance metadata", () => {
    expect(parseLocation({ coordinates: [28.6, 77.2], precision: "exact", sourceUrl: "https://example.test/map", asOf: "1999" })).toEqual({ coordinates: [28.6, 77.2], precision: "exact", sourceUrl: "https://example.test/map", asOf: "1999" });
  });
  it("rejects absent, malformed, and out-of-range coordinates", () => {
    expect(parseLocation(null)).toBeNull();
    expect(parseLocation({ coordinates: [91, 77] })).toBeNull();
    expect(parseLocation({ coordinates: [28.6] })).toBeNull();
  });
});
