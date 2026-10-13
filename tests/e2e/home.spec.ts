import { expect, test } from "@playwright/test";
import { experience, site } from "../../src/content/site";

test.describe("hero", () => {
  test("renders name and role", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(new RegExp(site.name));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/I build web software,\s*then make sure it holds up\./);
    await expect(page.getByText(`Hi, I'm ${site.name}`)).toBeVisible();
    // The typewriter is decorative; screen readers get every role at once.
    await expect(page.getByLabel(site.rotatingRoles.join(", "))).toBeVisible();
  });

  test("links to work, résumé, GitHub and LinkedIn", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("#top");
    await expect(hero.getByRole("link", { name: /View my work/ })).toHaveAttribute("href", "#projects");
    await expect(hero.getByRole("link", { name: "Resume" })).toHaveAttribute("href", "/resume/");
    for (const [name, href] of [["GitHub", site.socials.github], ["LinkedIn", site.socials.linkedin]]) {
      const link = hero.getByRole("link", { name });
      await expect(link).toHaveAttribute("href", href);
      await expect(link).toHaveAttribute("target", "_blank");
    }
  });
});

test.describe("experience", () => {
  test("lists current role first", async ({ page }) => {
    await page.goto("/");
    const first = page.locator("#experience ol > li").first();
    await expect(first.getByRole("heading", { level: 3 })).toHaveText(experience[0].role);
    await expect(first).toContainText(experience[0].company);
    expect(experience[0].current).toBe(true);
  });
});

test.describe("navigation", () => {
  test("every section is on the home page", async ({ page }) => {
    await page.goto("/");
    for (const id of ["top", "about", "experience", "skills", "projects", "contact"]) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
  });

  test("navbar links scroll to their section", async ({ page, isMobile }) => {
    test.skip(isMobile, "The desktop navbar is hidden on phones; the menu test covers them.");
    await page.goto("/");
    const nav = page.getByRole("banner").getByRole("navigation");
    for (const [label, id] of [["Projects", "projects"], ["Contact", "contact"], ["About", "about"]]) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      // Smooth scrolling brings the section's top into the upper part of the screen
      // (the last section can't reach the very top because the page ends).
      const top = () => page.locator(`section#${id}`).evaluate((el) => el.getBoundingClientRect().top / innerHeight);
      await expect.poll(async () => { const t = await top(); return t > -0.05 && t < 0.4; }, { timeout: 5000 }).toBe(true);
    }
  });

  test("phone menu opens and navigates", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Phone-only menu.");
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("link", { name: "Resume" }).last().click();
    await expect(page).toHaveURL(/\/resume\/$/);
  });

  test("skip link jumps to the main content", async ({ page, isMobile }) => {
    test.skip(isMobile, "Keyboard navigation.");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await expect(skip).toHaveAttribute("href", "#main");
  });
});
