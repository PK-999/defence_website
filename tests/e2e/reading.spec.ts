import { expect, test } from "@playwright/test";
test("reading pages expose a skip link and stable heading", async ({ page }) => { await page.goto("/about"); await expect(page.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main-content"); await expect(page.getByRole("heading", { name: "About the archive" })).toBeVisible(); });
