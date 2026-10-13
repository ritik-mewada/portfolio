import { expect, test, type Page } from "@playwright/test";

test.describe("QA Lens", () => {
  test.skip(({ isMobile }) => isMobile, "The lens follows a mouse pointer; it starts off on touch screens.");

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // It switches itself on once the browser is idle after the first paint.
    await expect(page.getByRole("button", { name: /QA Lens/ })).toHaveAttribute("aria-pressed", "true");
  });

  // The lens code loads after the button turns on; keep moving until it's listening.
  const pointAt = async (page: Page, x: number, y: number) => {
    await expect(async () => {
      await page.mouse.move(x - 5, y - 5);
      await page.mouse.move(x, y);
      await expect(page.locator(".qa-lens")).toBeVisible({ timeout: 500 });
    }).toPass();
  };

  test("appears under the pointer with the x-ray view", async ({ page }) => {
    await pointAt(page, 420, 410);
    const lens = page.locator(".qa-lens");
    const box = await lens.boundingBox();
    expect(box!.x + box!.width / 2).toBeCloseTo(420, -1);
    expect(box!.y + box!.height / 2).toBeCloseTo(410, -1);
    // The x-ray copy is labelled with real tags and never exposed to assistive tech.
    const xray = page.locator(".qa-xray");
    await expect(xray).toHaveAttribute("aria-hidden", "true");
    await expect(xray.locator("[data-qa]").first()).toHaveAttribute("data-qa", /^</);
  });

  test("Ctrl+L and Escape turn it off, and the choice is remembered", async ({ page }) => {
    const button = page.getByRole("button", { name: /QA Lens/ });
    await page.keyboard.press("Control+l");
    await expect(button).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator(".qa-xray")).toHaveCount(0);

    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await pointAt(page, 300, 300);
    await page.keyboard.press("Escape");
    await expect(button).toHaveAttribute("aria-pressed", "false");

    await page.reload();
    await page.waitForTimeout(2500);
    await expect(button).toHaveAttribute("aria-pressed", "false");
  });

  test("never duplicates page ids", async ({ page }) => {
    await pointAt(page, 400, 400);
    await expect(page.locator(".qa-xray [data-qa]").first()).toBeAttached();
    expect(await page.locator(".qa-xray [id]").count()).toBe(0);
  });
});
