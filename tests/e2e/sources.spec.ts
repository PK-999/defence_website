import { expect, test } from "@playwright/test";

test.describe("source provenance journey", () => {
  test("opens a public source and exposes evidence through keyboard disclosure", async ({ page }) => {
    await page.goto("/archive");
    await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
    await page.getByRole("link", { name: /Fixture Source/i }).click();
    await expect(page.getByRole("heading", { name: "Fixture Source" })).toBeVisible();
    const disclosure = page.getByRole("button", { name: /Locator: sentence2/i }).first();
    await disclosure.focus();
    await page.keyboard.press("Enter");
    await expect(disclosure).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("Quote unavailable for display.")).toBeVisible();
  });

  test("does not expose a draft source", async ({ page }) => {
    const response = await page.goto("/archive/fixture-source-draft");
    expect(response?.status()).toBe(404);
  });
});
