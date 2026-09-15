import { expect, test } from "@playwright/test";

test("groups heroes by award and then by year", async ({ page }) => {
  await page.goto("/heroes");

  const sections = page.locator('[data-testid="hero-award-section"]');
  await expect(page.locator('[data-testid="hero-award-index"]')).toHaveCount(6);
  await expect(page.getByText("2,886 heroes")).toBeVisible();
  await expect(sections).toHaveCount(6);
  await expect(sections.nth(0)).toContainText("Param Vir Chakra");
  await expect(sections.nth(1)).toContainText("Maha Vir Chakra");
  await expect(sections.nth(2)).toContainText("Vir Chakra");
  await expect(sections.nth(3)).toContainText("Ashoka Chakra");
  await expect(sections.nth(4)).toContainText("Kirti Chakra");
  await expect(sections.nth(5)).toContainText("Shaurya Chakra");
  await expect(sections.nth(0).locator('[data-testid="hero-award-year"]').first()).toContainText("1999");
  await expect(sections.nth(0).locator('[data-testid="hero-awardee"]')).toHaveCount(21);
  await expect(sections.nth(0).locator('img[alt^="Portrait of"]')).toHaveCount(21);
  await expect(sections.nth(0).locator('[data-testid="hero-awardee-grid"]').first()).toHaveClass(/lg:grid-cols-3/);
});

test("shows the enriched award directory with title-free names and formatted dates", async ({ page }) => {
  await page.goto("/heroes/awards/param-vir-chakra");

  await expect(page.getByText("21 heroes from the Ministry of Defence")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Arun Khetarpal" })).toBeVisible();
  await expect(page.getByText("16-12-1971")).toBeVisible();
  await expect(page.locator('[data-testid="researched-awardee-grid"]')).toHaveCount(9);
  await expect(page.locator('[data-testid="researched-awardee"] img')).toHaveCount(21);
});
