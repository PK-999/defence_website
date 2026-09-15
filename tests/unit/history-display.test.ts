import { describe, expect, test } from "vitest";
import { researchedText } from "@/lib/history-display";

describe("researched history display", () => {
  test("prefers the cited dossier over unsupported legacy prose", () => {
    const dossier = { overview: "Source-backed overview", keyPoints: [], sources: [] };
    expect(researchedText("Legacy assertion", dossier)).toBe("Source-backed overview");
  });

  test("retains legacy text only when no dossier exists", () => {
    expect(researchedText("Legacy record", undefined)).toBe("Legacy record");
  });

  test("uses the distinct conflict overview paragraphs instead of the dossier summary", () => {
    const dossier = {
      overview: "Research summary",
      overviewParagraphs: ["Overview paragraph one.", "Overview paragraph two."],
      researchParagraphs: ["Research paragraph one.", "Research paragraph two."],
      keyPoints: [],
      sources: [],
    };

    expect(researchedText("Legacy assertion", dossier)).toBe("Overview paragraph one.\n\nOverview paragraph two.");
  });
});
