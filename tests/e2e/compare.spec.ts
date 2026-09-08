import { expect, test } from "@playwright/test";

test.describe("equipment comparison", () => {
  test("adds systems from Arsenal and reconstructs a semantic comparison URL", async ({ page }) => {
    await page.goto("/arsenal");
    await page.getByRole("button", { name: "Add Fixture System A" }).click();
    await page.getByRole("button", { name: "Add Fixture System B" }).click();
    await page.getByRole("link", { name: "Compare selected" }).click();
    await expect(page).toHaveURL(/\/compare\?items=fixture-system-a%2Cfixture-system-b/);
    await expect(page.getByRole("columnheader", { name: /Fixture System A/ })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /Fixture System B/ })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /winner/i })).toHaveCount(0);
  });

  test("supports remove and clear without exposing private systems", async ({ page }) => {
    await page.goto("/compare?items=fixture-system-a,fixture-system-draft");
    await expect(page.getByText(/Unavailable or private systems: fixture-system-draft/)).toBeVisible();
    await page.getByRole("button", { name: "Remove Fixture System A" }).click();
    await expect(page.getByRole("link", { name: "Compare selected" })).toHaveCount(0);
  });
});
