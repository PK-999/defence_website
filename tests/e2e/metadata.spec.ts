import { expect, test } from "@playwright/test";

test.describe("public metadata and route states", () => {
  test("public detail metadata uses the public record and canonical URL", async ({ page }) => {
    await page.goto("/heroes/fixture-person-001");
    await expect(page).toHaveTitle(/Fixture Person 001/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/heroes\/fixture-person-001$/);
  });

  test("private records are absent from metadata and sitemap", async ({ page, request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBeTruthy();
    const sitemap = await response.text();
    expect(sitemap).toContain("fixture-person-001");
    expect(sitemap).not.toContain("fixture-person-draft");
    await page.goto("/heroes/fixture-person-draft");
    await expect(page.getByRole("heading", { name: /page not found/i })).toBeVisible();
  });

  test("admin metadata is noindex and custom not-found offers recovery", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await page.goto("/route-that-does-not-exist");
    await expect(page.getByRole("heading", { name: /page not found/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /search/i })).toBeVisible();
  });
});
