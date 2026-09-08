import { expect, test } from "@playwright/test";

test("production server renders the archive home and a primary link", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "EXPLORE THE ARCHIVE" })).toBeVisible();
  await expect(page.getByRole("link", { name: /CONFLICTS Chronological timelines/i })).toHaveAttribute("href", "/conflicts");
});
