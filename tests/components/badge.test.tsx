import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Badge } from "../../src/components/ui/badge";

describe("Badge", () => {
  test("renders its label as a semantic status element", () => {
    render(<Badge>Reviewed</Badge>);
    expect(screen.getByText("Reviewed")).toBeInTheDocument();
  });
});
