import { expect, test } from "@playwright/test";
test("forces preserves URL tab state and has an honest empty units state", async ({ page }) => { await page.goto("/forces?tab=units"); await expect(page.getByRole("heading", { name: "Forces" })).toBeVisible(); await expect(page).toHaveURL(/tab=units/); });
