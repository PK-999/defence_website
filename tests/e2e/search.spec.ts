import { expect, test } from "@playwright/test";

test("full search is a GET form with source and unit filters", async ({ page }) => {
  await page.goto("/search");
  const typeFilter = page.getByRole("combobox");
  await expect(typeFilter.getByRole("option", { name: "Sources" })).toHaveCount(1);
  await expect(typeFilter.getByRole("option", { name: "Units" })).toHaveCount(1);
  await expect(page.locator("form[action='/search']")).toBeVisible();
});

test("site-wide search sends the originating section as a relevance hint", async ({ page }) => {
  let requestUrl = "";
  await page.route("**/api/search**", async (route) => {
    requestUrl = route.request().url();
    await route.continue();
  });
  await page.goto("/operations");
  await page.getByRole("button", { name: /Search/i }).click();
  const searchInput = page.locator('[role="dialog"] input[role="combobox"]');
  await searchInput.fill("fixture");
  await expect.poll(() => requestUrl).toContain("scope=operations");
});

test("collection pages do not render duplicate search boxes", async ({ page }) => {
  for (const route of ["/", "/operations", "/conflicts", "/heroes", "/arsenal", "/archive", "/intel"]) {
    await page.goto(route);
    await expect(page.locator('input[aria-label="Search collection"]')).toHaveCount(0);
    await expect(page.locator('input[name="q"]')).toHaveCount(0);
    await expect(page.locator("#intel-query")).toHaveCount(0);
  }
});
