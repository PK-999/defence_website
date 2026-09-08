import { describe, expect, test } from "vitest";
import { cn } from "../../src/lib/utils";

describe("cn", () => {
  test("merges conflicting Tailwind classes while preserving conditional classes", () => {
    expect(cn("px-2", "px-4", false && "hidden", "text-sm")).toBe("px-4 text-sm");
  });
});
