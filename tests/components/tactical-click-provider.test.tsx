import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { playTacticalClick } from "@/lib/tactical-audio";
import { TacticalClickProvider } from "@/components/TacticalClickProvider";

vi.mock("@/lib/tactical-audio", () => ({ playTacticalClick: vi.fn() }));

describe("TacticalClickProvider", () => {
  test("plays the operations click for pointer and keyboard activation", () => {
    render(<TacticalClickProvider><button type="button">Open record</button><span>Read only</span></TacticalClickProvider>);
    const button = screen.getByRole("button", { name: "Open record" });

    fireEvent.pointerDown(button);
    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.click(screen.getByText("Read only"));

    expect(vi.mocked(playTacticalClick)).toHaveBeenCalledTimes(2);
  });
});
