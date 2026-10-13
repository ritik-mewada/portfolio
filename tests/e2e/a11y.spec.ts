import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { projects } from "../../src/content/site";

const pages = ["/", "/resume/", `/projects/${projects[0].slug}/`, "/this-page-does-not-exist"];

for (const theme of ["dark", "light"] as const) {
  test.describe(`a11y › ${theme} theme`, () => {
    // Settled colours: entrance animations would otherwise be caught half-faded.
    test.use({ reducedMotion: "reduce", colorScheme: theme });

    test.beforeEach(async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
    });

    for (const path of pages) {
      test(`${path} meets WCAG 2.1 AA`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          // The QA Lens x-ray is a decorative, aria-hidden copy of the page.
          .exclude(".qa-xray")
          .analyze();
        const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.help} → ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`);
        expect(summary).toEqual([]);
      });
    }
  });
}
