import { expect, test } from "@playwright/test";

test.describe("intel ledger", () => {
  test("exposes the complete research channels and source status", async ({ page }) => {
    await page.goto("/intel");
    await expect(page.getByRole("heading", { name: "The research room" })).toBeVisible();
    await expect(page.getByText("14,711 collected records")).toBeVisible();
    await expect(page.getByRole("link", { name: /Award roster/ })).toHaveAttribute("href", /section=historicalAwardRoster/);
    await expect(page.getByText("research_only").first()).toBeVisible();
  });

  test("searches a full award roster section", async ({ page }) => {
    await page.goto("/intel?section=historicalAwardRoster&q=Somnath");
    await expect(page.getByRole("heading", { name: "Award roster" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "MAJ SOMNATH SHARMA", exact: false })).toBeVisible();
    await expect(page.getByText("Open record payload").first()).toBeVisible();
  });
});
