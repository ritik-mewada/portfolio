import { expect, test } from "@playwright/test";

// The home page's own JS chunk often arrives after the layout has hydrated. If a provider above
// the page changes its context in the meantime, React drops the server HTML and renders the page
// again: the hero repaints and Lighthouse LCP jumps from ~1.8 s to ~3.8 s. Holding that chunk back
// makes the race happen every time.
test("the hero is hydrated in place, not rendered again", async ({ page }) => {
  await page.route("**/_next/static/chunks/*.js", async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    if (body.includes("data-qa-pointer-fx")) await new Promise((r) => setTimeout(r, 1500));
    await route.fulfill({ response, body });
  });
  await page.addInitScript(() => {
    const w = window as typeof window & { heroRemoved?: boolean };
    new MutationObserver((records) => {
      for (const r of records)
        for (const n of r.removedNodes) if (n instanceof Element && (n.id === "top" || n.querySelector("#top"))) w.heroRemoved = true;
    }).observe(document, { childList: true, subtree: true });
  });

  await page.goto("/");
  // Hydrated once the hero's client code runs: the typewriter starts typing a role.
  await expect(page.locator("#top p[aria-label]")).not.toHaveText("", { timeout: 15_000 });
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => (window as typeof window & { heroRemoved?: boolean }).heroRemoved ?? false)).toBe(false);
});
