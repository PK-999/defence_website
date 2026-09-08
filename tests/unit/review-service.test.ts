import { describe, expect, test } from "vitest";
import { isAllowedEditor, parseEditorSubjects, requireEditor, UnauthorizedError } from "../../src/lib/auth/editor";

describe("editor identity configuration", () => {
  test("parses only non-empty issuer and subject pairs", () => {
    expect(parseEditorSubjects(JSON.stringify([
      { issuer: " https://id.example ", subject: " editor-1 " },
      { issuer: "", subject: "ignored" },
      { issuer: "https://id.example" },
      "ignored",
    ]))).toEqual([{ issuer: "https://id.example", subject: "editor-1" }]);
  });

  test("matches the exact issuer and subject", () => {
    const configured = [{ issuer: "https://id.example", subject: "editor-1" }];
    expect(isAllowedEditor("https://id.example", "editor-1", configured)).toBe(true);
    expect(isAllowedEditor("https://other.example", "editor-1", configured)).toBe(false);
    expect(isAllowedEditor("https://id.example", "editor-2", configured)).toBe(false);
  });
});

describe("requireEditor", () => {
  test("denies access until a validated editor identity is configured", async () => {
    await expect(requireEditor()).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
