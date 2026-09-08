import { expect, test } from "@playwright/test";

test.describe("sourced detail pages", () => {
  test("people pages show documented fields, unknown values, and evidence links", async ({ page }) => {
    await page.goto("/heroes/fixture-person-001");
    await expect(page.getByRole("heading", { name: "Fixture Person 001" })).toBeVisible();
    await expect(page.getByText("Not documented").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Source-linked claims" })).toBeVisible();
    await page.getByRole("button", { name: /summary/i }).click();
    await expect(page.getByRole("link", { name: /Fixture Source/ }).first()).toHaveAttribute("href", "/archive/fixture-source");
  });

  test("equipment pages show variant context and normalized specifications", async ({ page }) => {
    await page.goto("/arsenal/fixture-system-a");
    await expect(page.getByRole("heading", { name: "Fixture System A" })).toBeVisible();
    await expect(page.getByText("Fixture variant A")).toBeVisible();
    await expect(page.getByText("Combat Radius")).toBeVisible();
    await expect(page.getByText("500 km")).toBeVisible();
  });

  test("private detail slugs remain unavailable", async ({ page }) => {
    expect((await page.goto("/heroes/fixture-person-draft"))?.status()).toBe(404);
    expect((await page.goto("/arsenal/fixture-system-draft"))?.status()).toBe(404);
  });
});
