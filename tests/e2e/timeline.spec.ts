import { expect, test } from "@playwright/test";

test.describe("chronology surfaces", () => {
  test("operation chronology shows stored dates without an inferred ongoing state", async ({ page }) => {
    await page.goto("/operations/fixture-operation");
    await expect(page.getByRole("heading", { name: "Chronology" })).toBeVisible();
    await expect(page.getByText("Recorded start date")).toBeVisible();
    await expect(page.getByText(/ongoing/i)).toHaveCount(0);
  });

  test("invalid explorer event falls back to the overview and preserves URL state", async ({ page }) => {
    await page.goto("/conflicts/fixture-conflict?view=explorer&event=missing-event");
    await expect(page.getByRole("heading", { name: "Conflict Overview" })).toBeVisible();
    const overview = page.getByRole("button", { name: "Open Conflict Overview" });
    await overview.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/view=explorer&event=overview/);
    await expect(overview).toHaveAttribute("aria-pressed", "true");
  });
});
