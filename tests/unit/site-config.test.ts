import { describe, expect, it } from "vitest";
import { absoluteSiteUrl, parseSiteUrl } from "@/lib/config";

describe("site URL configuration", () => {
  it("uses a documented local origin outside production", () => {
    expect(parseSiteUrl(undefined, "development").toString()).toBe("http://localhost:3000/");
  });

  it("rejects a missing production origin", () => {
    expect(() => parseSiteUrl(undefined, "production")).toThrow("SITE_URL is required");
  });

  it("rejects non-http production origins and builds canonical paths", () => {
    expect(() => parseSiteUrl("ftp://archive.example", "production")).toThrow("SITE_URL must use http or https");
    expect(absoluteSiteUrl("/heroes/fixture-person-001", "https://archive.example/", "production")).toBe("https://archive.example/heroes/fixture-person-001");
  });
});
