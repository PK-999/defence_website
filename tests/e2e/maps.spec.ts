import { expect, test } from "@playwright/test";

test.describe("deliberate maps", () => {
  test("does not initialize map requests until the reader activates it", async ({ page }) => {
    const tileRequests: string[] = [];
    page.on("request", (request) => { if (request.url().includes("tile.opentopomap.org")) tileRequests.push(request.url()); });
    await page.goto("/operations/fixture-operation-other");
    await expect(page.getByText("No documented coordinates are available.")).toBeVisible();
    expect(tileRequests).toHaveLength(0);
    await page.getByRole("button", { name: "Show map" }).click();
    await expect(page.getByRole("button", { name: "Retry map" })).toBeVisible();
    await expect(page.getByText(/OpenTopoMap/i)).toBeVisible();
  });

  test("battle chronology moves the tactical map and renders the field report", async ({ page }) => {
    await page.goto("/operations/battle-of-badgam-1947");
    await expect(page.getByRole("heading", { name: "Full report" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Stories & field notes" })).toBeVisible();
    await expect(page.getByText("Documented locations")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /D Company holds Badgam/ })).toBeVisible();

    const map = page.locator("[data-map-active-marker]");
    await expect(map).toHaveAttribute("data-map-active-marker", "badgam-approach");
    await page.getByRole("button", { name: /D Company holds Badgam/ }).click();
    await expect(map).toHaveAttribute("data-map-active-marker", "badgam-hold");
    await page.getByRole("button", { name: /Airfield approach secured/ }).click();
    await expect(map).toHaveAttribute("data-map-active-marker", "badgam-airfield");
  });
});
