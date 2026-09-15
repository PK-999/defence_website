import { expect, test } from "@playwright/test";

test("forces restores the command directory with coverage and map controls", async ({ page }) => {
  await page.goto("/forces");

  await expect(page.getByRole("heading", { name: "Forces", exact: true })).toBeVisible();
  await expect(page.getByText("INDIAN ARMY", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("INDIAN NAVY", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("INDIAN AIR FORCE", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Northern Command", { exact: true })).toBeVisible();
  await expect(page.getByText("Udhampur", { exact: true })).toBeVisible();
  await expect(page.getByText("Jammu & Kashmir, Ladakh", { exact: true })).toBeVisible();
  await expect(page.getByText(/not legal boundaries, unit dispositions, base coordinates/)).toBeVisible();
  await expect(page.getByText("Listed bases:", { exact: false })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Army command headquarters listing/ }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Show map" })).toBeVisible();
});

test("forces popups show the command lead rank without listing base names", async ({ page }) => {
  await page.goto("/forces?service=INDIAN+ARMY");
  await page.getByRole("button", { name: "Show map" }).click();
  await expect(page.getByRole("button", { name: "Map shown" })).toBeVisible();
  const marker = page.locator(".leaflet-marker-icon").first();
  if (await marker.count() === 0) return;
  await marker.click();

  await expect(page.getByText("Top rank", { exact: true })).toBeVisible();
  await expect(page.getByText("Major Bases", { exact: false })).toHaveCount(0);
  await expect(page.getByText("Strategic Base", { exact: false })).toHaveCount(0);
  await expect(page.getByText("Coverage", { exact: true })).toBeVisible();
});

test("organization places the three services side by side and tri-service below", async ({ page }) => {
  await page.goto("/forces?tab=organization");

  const hierarchy = page.locator('[data-testid="service-hierarchy"]');
  await expect(hierarchy).toHaveCount(3);
  await expect(hierarchy.nth(0)).toContainText("INDIAN ARMY");
  await expect(hierarchy.nth(1)).toContainText("INDIAN NAVY");
  await expect(hierarchy.nth(2)).toContainText("INDIAN AIR FORCE");
  await expect(page.locator('[data-testid="tri-service-hierarchy"]')).toHaveCount(1);
  await expect(page.getByText("Reference directory", { exact: true })).toHaveCount(0);
});

test("forces preserves URL tab state and keeps the reviewed units view separate", async ({ page }) => {
  await page.goto("/forces?tab=units");
  await expect(page.getByRole("heading", { name: "Forces", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/tab=units/);
  await expect(page.getByRole("heading", { name: "Renowned regiments, fleets and squadrons" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "13 JAK Rifles" })).toBeVisible();
  await expect(page.getByText("Prashasta Ranveerta", { exact: false })).toBeVisible();
  await expect(page.getByText("Bole So Nihal, Sat Sri Akal", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sources and references" }).first()).toBeVisible();
  await expect(page.locator('a[href="/heroes/vikram-batra"]')).toHaveCount(0);
  await expect(page.locator('a[href="/heroes/nirmal-jit-singh-sekhon"]')).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Published units" })).toBeVisible();
});
