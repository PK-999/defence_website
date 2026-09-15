import { expect, test } from "@playwright/test";

test.describe("timeline surfaces", () => {
  test("operation timeline shows stored dates without an inferred ongoing state", async ({ page }) => {
    await page.goto("/operations/fixture-operation");
    await expect(page.getByRole("heading", { name: "Timeline" })).toBeVisible();
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

  test("conflict timeline lists dated operations and keeps the map panel focused", async ({ page }) => {
    await page.goto("/conflicts/fixture-conflict");
    await expect(page.getByRole("button", { name: "Open Fixture Operation" })).toBeVisible();
    await expect(page.getByText("02-01-1999")).toBeVisible();
    await expect(page.getByText("Documented locations")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Retry map" })).toBeVisible();
    const map = page.locator("[data-map-active-marker]");
    const overviewMarker = await map.getAttribute("data-map-active-marker");
    await page.getByRole("button", { name: "Open Fixture Operation" }).click();
    await expect(page).toHaveURL(/event=/);
    await expect.poll(() => map.getAttribute("data-map-active-marker")).not.toBe(overviewMarker);
  });

  test("conflict timeline keeps the vertical rail scrollable and sound optional", async ({ page }) => {
    await page.goto("/conflicts/fixture-conflict");
    await expect(page.getByLabel("Scrollable conflict timeline")).toBeVisible();
    const timeline = page.getByText("TIMELINE").first();
    await expect(timeline).toBeVisible();
    const toggle = page.getByRole("button", { name: "Mute tactical click sound" }).last();
    await toggle.click();
    await expect(page.getByRole("button", { name: "Enable tactical click sound" }).last()).toBeVisible();
  });

  test("collection routes expose the vertical mission rail with dock controls", async ({ page }) => {
    for (const route of ["/operations", "/conflicts"]) {
      await page.goto(route);
      await expect(page.getByLabel("Scrollable timeline")).toBeVisible();
      await expect(page.getByRole("region", { name: "Timeline" }).getByRole("button", { name: "Mute tactical click sound" })).toBeVisible();
      const first = page.locator("[data-timeline-event]").first();
      const second = page.locator("[data-timeline-event]").nth(1);
      await expect(first).toBeVisible();
      await expect(first.getByRole("button")).toHaveAttribute("aria-current", "step");
      await second.evaluate((element) => element.scrollIntoView({ block: "center" }));
      await expect(second.getByRole("button")).toHaveAttribute("aria-current", "step");
      await expect.poll(async () => Number(await second.evaluate((element) => getComputedStyle(element).opacity))).toBeGreaterThan(0.9);
      await expect.poll(async () => Number(await first.evaluate((element) => getComputedStyle(element).opacity))).toBeLessThan(0.8);
      await second.getByRole("button").click();
      await expect(page).toHaveURL(/\/operations\/|\/conflicts\//);
    }
  });

  test("collection timeline supports year filtering without duplicate record cards", async ({ page }) => {
    await page.goto("/operations");
    await expect(page.getByText(/reviewed records/i)).toHaveCount(0);
    await page.getByLabel("Year / period").selectOption("1999");
    await expect(page.locator("[data-timeline-event]").filter({ hasText: "Fixture Operation" })).toBeVisible();
    await expect(page.locator("[data-timeline-event]").filter({ hasText: "Fixture Other Operation" })).toHaveCount(0);
    await page.goto("/conflicts");
    await page.getByLabel("Year / period").selectOption("1999");
    await expect(page.locator("[data-timeline-event]").filter({ hasText: "Fixture Conflict" })).toBeVisible();
  });
});
