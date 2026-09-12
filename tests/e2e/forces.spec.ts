import { expect, test } from "@playwright/test";

test("forces restores the command directory with coverage and map controls", async ({ page }) => {
  await page.goto("/forces");

  await expect(page.getByRole("heading", { name: "Forces" })).toBeVisible();
  await expect(page.getByText("INDIAN ARMY", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("INDIAN NAVY", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("INDIAN AIR FORCE", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Northern Command", { exact: true })).toBeVisible();
  await expect(page.getByText("Udhampur", { exact: true })).toBeVisible();
  await expect(page.getByText("Jammu & Kashmir, Ladakh", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Show map" })).toBeVisible();
});

test("forces preserves URL tab state and keeps the reviewed units view separate", async ({ page }) => {
  await page.goto("/forces?tab=units");
  await expect(page.getByRole("heading", { name: "Forces" })).toBeVisible();
  await expect(page).toHaveURL(/tab=units/);
  await expect(page.getByRole("heading", { name: "Published units" })).toBeVisible();
});
