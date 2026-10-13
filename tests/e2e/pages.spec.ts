import { expect, test } from "@playwright/test";
import { experience, projects, site } from "../../src/content/site";

test.describe("projects", () => {
  test("every project card opens its case study", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('#projects a[href^="/projects/"]');
    const hrefs = new Set(await cards.evaluateAll((as) => as.map((a) => a.getAttribute("href"))));
    expect([...hrefs].sort()).toEqual(projects.map((p) => `/projects/${p.slug}`).sort());
  });

  for (const project of projects) {
    test(`${project.slug} › page renders with working links`, async ({ page }) => {
      const res = await page.goto(`/projects/${project.slug}`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.title);
      await expect(page.getByText(project.tagline, { exact: true })).toBeVisible();
      for (const repo of project.repos) {
        const link = page.locator(`a[href="${repo.url}"]`).first();
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noreferrer/);
      }
      await expect(page.getByRole("link", { name: "All projects" })).toHaveAttribute("href", "/#projects");
    });
  }

  test("unknown project returns 404", async ({ page }) => {
    const res = await page.goto("/projects/does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("expected page, received 404")).toBeVisible();
    await page.getByRole("link", { name: "Back to home" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("résumé", () => {
  test("shows contact details and every job", async ({ page }) => {
    await page.goto("/resume");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(site.name);
    await expect(page.getByRole("button", { name: "Save as PDF" })).toBeVisible();
    await expect(page.locator(`a[href="mailto:${site.email}"]`).first()).toBeVisible();
    for (const job of experience) await expect(page.getByText(job.company).first()).toBeVisible();
  });

  test("prints as a one-column sheet without site chrome", async ({ page }) => {
    await page.goto("/resume");
    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".cv-sheet")).toBeVisible();
    await expect(page.getByRole("button", { name: "Save as PDF" })).toBeHidden();
  });
});
