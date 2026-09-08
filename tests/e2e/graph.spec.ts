import { expect, test } from "@playwright/test";

test.describe("scoped graph exploration", () => {
  test("loads a selected topic and exposes a text relationship equivalent", async ({ page }) => {
    await page.goto("/graph");
    const topic = page.getByRole("button", { name: "Fixture Person 001" });
    await expect(topic).toBeVisible();
    await topic.click();
    await expect(page).toHaveURL(/type=Person&id=/);
    await expect(page.getByRole("region", { name: "Text equivalent of graph relationships" })).toBeVisible();
    await expect(page.getByText("PARTICIPATED_IN")).toBeVisible();
  });

  test("shows a retryable empty/error state for a private seed", async ({ page }) => {
    await page.goto("/graph?type=Person&id=private-seed");
    await expect(page.getByText(/public topic is unavailable/i)).toBeVisible();
  });
});
