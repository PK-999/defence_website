import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ResearchDossier } from "@/components/ResearchDossier";

describe("ResearchDossier", () => {
  test("connects claims to a numbered references list", () => {
    render(<ResearchDossier dossier={{
      overview: "A researched overview.",
      keyPoints: [{ title: "Documented point", body: "A supported detail." }],
      sources: [{ label: "Official record", url: "https://example.gov/record", note: "Government publication" }],
    }} />);

    expect(screen.getByText("A researched overview.").closest("p")).toHaveTextContent("[1]");
    expect(screen.getByRole("heading", { name: "Sources and references" })).toBeVisible();
    expect(screen.getByRole("link", { name: /Official record/ })).toHaveAttribute("href", "https://example.gov/record");
  });

  test("renders research paragraphs separately from the conflict overview", () => {
    render(<ResearchDossier dossier={{
      overview: "Conflict overview text.",
      researchParagraphs: ["Research detail one.", "Research detail two."],
      keyPoints: [],
      sources: [],
    }} />);

    expect(screen.getByText("Research detail one.")).toBeVisible();
    expect(screen.getByText("Research detail two.")).toBeVisible();
    expect(screen.queryByText("Conflict overview text.")).not.toBeInTheDocument();
  });
});
