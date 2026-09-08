import { expect, test } from "@playwright/test";

test("full search is a GET form with source and unit filters", async ({ page }) => {
  await page.goto("/search");
  const typeFilter = page.getByRole("combobox");
  await expect(typeFilter.getByRole("option", { name: "Sources" })).toHaveCount(1);
  await expect(typeFilter.getByRole("option", { name: "Units" })).toHaveCount(1);
  await expect(page.locator("form[action='/search']")).toBeVisible();
});
