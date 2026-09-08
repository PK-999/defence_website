import { expect, test } from "@playwright/test";
test("anonymous admin access is denied without an editor session", async ({ page }) => { await page.goto("/admin/review"); await expect(page.getByText(/Editor access is unavailable|not configured|authorized editor/i)).toBeVisible(); });
