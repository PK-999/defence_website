import { expect, test } from "@playwright/test";

test("lists the canonical PVC and AC recipient sets year-wise", async ({ page }) => {
  await page.goto("/heroes/awards/param-vir-chakra");
  await expect(page.getByRole("heading", { level: 1, name: "Param Vir Chakra" })).toBeVisible();
  await expect(page.locator('[data-testid="researched-awardee"]')).toHaveCount(21);
  await expect(page.locator('[data-testid="researched-award-year"]').first()).toContainText("1999");

  await page.goto("/heroes/awards/ashoka-chakra");
  await expect(page.getByRole("heading", { level: 1, name: "Ashoka Chakra" })).toBeVisible();
  await expect(page.locator('[data-testid="researched-awardee"]')).toHaveCount(98);
});

test("shows a source-linked awardee biography and medal story", async ({ page }) => {
  await page.goto("/heroes/awardees/1049");
  await expect(page.getByRole("heading", { level: 1, name: "Somnath Sharma" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Biography and service record" })).toBeVisible();
  await expect(page.getByText("The delaying stand at Badgam")).toBeVisible();
  await expect(page.getByText("4 KUMAON", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /Ministry of Defence awardee record Canonical name/ })).toHaveAttribute("href", "https://gallantryawards.gov.in/awardee/1049");
  await expect(page.getByRole("link", { name: /Official biographical profile/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Official award citation/ }).first()).toBeVisible();
});

test("adds a research dossier and sources to a history record", async ({ page }) => {
  await page.goto("/operations/battle-of-badgam-1947");
  await expect(page.locator('[data-testid="research-dossier"]')).toContainText("Airfield as lifeline");
  await expect(page.getByRole("heading", { name: "Sources and references" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Major Somnath Sharma official record/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Full report" })).toHaveCount(0);
  await expect(page.getByText(/source-linked battle fixture/)).toHaveCount(0);
});
