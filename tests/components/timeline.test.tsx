import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Timeline } from "@/components/ui/Timeline";
import { playTacticalClick } from "@/lib/tactical-audio";

vi.mock("@/lib/tactical-audio", () => ({
  isTacticalSoundMuted: () => false,
  playTacticalClick: vi.fn(),
  setTacticalSoundMuted: vi.fn(),
}));

vi.mock("@/components/TacticalSoundToggle", () => ({
  TacticalSoundToggle: () => <button type="button">Sound</button>,
}));

describe("Timeline", () => {
  test("uses timeline labels and plays a throttled sound while scrolling", () => {
    const frame = vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 1;
    });
    render(<Timeline events={[{ id: "one", date: "1947", title: "First event" }, { id: "two", date: "1948", title: "Second event" }]} />);

    expect(screen.getByRole("region", { name: "Timeline" })).toBeVisible();
    const scrollable = document.querySelector('[aria-label="Scrollable timeline"]');
    expect(scrollable).toBeVisible();
    expect(screen.queryByText("Chronology")).not.toBeInTheDocument();

    if (!scrollable) throw new Error("Scrollable timeline is missing");
    Object.defineProperty(scrollable, "scrollTop", { configurable: true, value: 64 });
    fireEvent.scroll(scrollable);

    expect(playTacticalClick).toHaveBeenCalledTimes(1);
    frame.mockRestore();
  });
});
