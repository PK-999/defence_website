import { describe, expect, it } from "vitest";
import { absoluteSiteUrl, parseSiteUrl } from "@/lib/config";

describe("site URL configuration", () => {
  it("uses a documented local origin outside production", () => {
    expect(parseSiteUrl(undefined, "development").toString()).toBe("http://localhost:3000/");
  });

  it("rejects a missing production origin", () => {
    const previous = process.env.VERCEL_URL;
    try {
      delete process.env.VERCEL_URL;
      expect(() => parseSiteUrl(undefined, "production")).toThrow("SITE_URL is required");
    } finally {
      if (previous === undefined) delete process.env.VERCEL_URL;
      else process.env.VERCEL_URL = previous;
    }
  });

  it("uses Vercel's deployment origin when SITE_URL is not injected", () => {
    const previous = process.env.VERCEL_URL;
    try {
      process.env.VERCEL_URL = "sentinel-example.vercel.app";
      expect(parseSiteUrl(undefined, "production").toString()).toBe("https://sentinel-example.vercel.app/");
    } finally {
      if (previous === undefined) delete process.env.VERCEL_URL;
      else process.env.VERCEL_URL = previous;
    }
  });

  it("rejects non-http production origins and builds canonical paths", () => {
    expect(() => parseSiteUrl("ftp://archive.example", "production")).toThrow("SITE_URL must use http or https");
    expect(absoluteSiteUrl("/heroes/fixture-person-001", "https://archive.example/", "production")).toBe("https://archive.example/heroes/fixture-person-001");
  });
});
