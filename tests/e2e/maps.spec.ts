import { expect, test } from "@playwright/test";

test.describe("deliberate maps", () => {
  test("operation pages use the same immediate, unlabelled map treatment as conflicts", async ({ page }) => {
    const tileRequests: string[] = [];
    page.on("request", (request) => { if (request.url().includes("tile.opentopomap.org")) tileRequests.push(request.url()); });
    await page.goto("/operations/fixture-operation-other");
    await expect(page.getByText("Documented locations")).toHaveCount(0);
    await expect(page.getByText("Tactical Map")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Retry map" })).toBeVisible();
    await expect(page.getByText(/OpenTopoMap/i)).toBeVisible();
    expect(tileRequests.length).toBeGreaterThan(0);
  });

  test("battle chronology moves the tactical map and renders cited field research", async ({ page }) => {
    await page.goto("/operations/battle-of-badgam-1947");
    await expect(page.getByRole("heading", { name: "Research dossier" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Full report" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Stories & field notes" })).toBeVisible();
    await expect(page.getByText("Documented locations")).toHaveCount(0);
    await expect(page.getByText("Tactical Map")).toHaveCount(0);
    await expect(page.getByLabel("Scrollable timeline")).toBeVisible();
    await expect(page.getByText("Focus map", { exact: true })).toHaveCount(0);
    const soundToggle = page.getByRole("region", { name: "Timeline" }).getByRole("button", { name: "Mute tactical click sound" });
    await soundToggle.click();
    await expect(page.getByRole("region", { name: "Timeline" }).getByRole("button", { name: "Enable tactical click sound" })).toBeVisible();
    await expect(page.getByRole("button", { name: /D Company holds Badgam/ })).toBeVisible();

    const map = page.locator("[data-map-active-marker]");
    await expect(map).toHaveAttribute("data-map-active-marker", "badgam-approach");
    await page.getByRole("button", { name: /D Company holds Badgam/ }).click();
    await expect(map).toHaveAttribute("data-map-active-marker", "badgam-hold");
    await page.getByRole("button", { name: /Airfield approach secured/ }).click();
    await expect(map).toHaveAttribute("data-map-active-marker", "badgam-airfield");
  });
});
