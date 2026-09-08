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
});
