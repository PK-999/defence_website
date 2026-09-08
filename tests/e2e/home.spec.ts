import { expect, test } from "@playwright/test";

test.describe("focused discovery home", () => {
  test("puts purpose, search, and real subject choices in the first journey", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Start with a question" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Search/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /CONFLICTS/i }).first()).toHaveAttribute("href", "/conflicts");
    await expect(page.getByRole("link", { name: /PEOPLE/i }).first()).toHaveAttribute("href", "/heroes");
    await expect(page.getByRole("link", { name: /ARSENAL/i }).first()).toHaveAttribute("href", "/arsenal");
    await expect(page.locator('a[href="/people"]')).toHaveCount(0);
  });

  test("shows a truthful empty-state route when no collection is public", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("The archive is being built")).toBeVisible();
    await expect(page.getByRole("link", { name: /Browse the archive/i })).toHaveAttribute("href", "/conflicts");
    await expect(page.getByRole("link", { name: /View sources/i })).toHaveAttribute("href", "/archive");
  });
});
