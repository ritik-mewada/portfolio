import { expect, test, type Page } from "@playwright/test";

const WEB3FORMS = "https://api.web3forms.com/submit";
// Delivery tests need a Web3Forms key built into the site; CI builds with a placeholder one.
const hasKey = !!process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const real = { name: "Jane Recruiter", email: "jane@gmail.com", message: "Hi Ritik, we have a QA role open at Acme. Interested?" };

// Scoped to the real form: the QA Lens keeps an inert copy of the page for its x-ray view.
const form = (page: Page) => page.locator("main form");

async function fill(page: Page, fields: Partial<typeof real> = {}) {
  const { name, email, message } = { ...real, ...fields };
  await form(page).getByLabel("Name").fill(name);
  await form(page).getByLabel("Email").fill(email);
  await form(page).getByLabel("Message").fill(message);
}

const submit = (page: Page) => form(page).getByRole("button", { name: "Send message" }).click();

test.describe("contact form", () => {
  let requests: Record<string, unknown>[];

  test.beforeEach(async ({ page }) => {
    requests = [];
    await page.route(WEB3FORMS, (route) => {
      requests.push(route.request().postDataJSON());
      return route.fulfill({ json: { success: true } });
    });
    await page.clock.install();
    await page.goto("/#contact");
  });

  // Skips the time trap: a person takes longer than 3 seconds to write a message.
  const typeLikeAPerson = (page: Page) => page.clock.fastForward(10_000);

  test("won't submit with empty fields", async ({ page }) => {
    await submit(page);
    await expect(form(page).getByLabel("Name")).toBeFocused();
    expect(requests).toHaveLength(0);
  });

  test("sends the message with its page, then clears the form", async ({ page }) => {
    test.skip(!hasKey, "Built without NEXT_PUBLIC_WEB3FORMS_KEY.");
    await fill(page);
    await typeLikeAPerson(page);
    await submit(page);

    await expect(page.getByText("Message sent")).toBeVisible();
    await expect(form(page).getByLabel("Name")).toHaveValue("");
    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({ ...real, access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY, page: "/" });
  });

  test("says so when the network fails", async ({ page }) => {
    test.skip(!hasKey, "Built without NEXT_PUBLIC_WEB3FORMS_KEY.");
    await page.route(WEB3FORMS, (route) => route.abort());
    await fill(page);
    await typeLikeAPerson(page);
    await submit(page);
    await expect(page.getByText("Network error")).toBeVisible();
  });

  test("asks for a permanent address instead of a disposable one", async ({ page }) => {
    await fill(page, { email: "tim@mailinator.com" });
    await typeLikeAPerson(page);
    await submit(page);
    await expect(page.getByText("Please use a permanent email address")).toBeVisible();
    expect(requests).toHaveLength(0);
  });

  const spam: [string, (page: Page) => Promise<void>][] = [
    ["honeypot filled", (page) => form(page).locator('input[name="company"]').evaluate((el: HTMLInputElement) => (el.value = "Acme SEO")).then(() => typeLikeAPerson(page))],
    ["filled in under 3 seconds", async () => {}],
    ["SEO pitch", (page) => fill(page, { message: "We can get your website on the first page of Google with SEO and backlinks. Click here." }).then(() => typeLikeAPerson(page))],
    ["link in the name", (page) => fill(page, { name: "http://spam.example" }).then(() => typeLikeAPerson(page))],
  ];
  for (const [name, setup] of spam) {
    test(`drops spam silently: ${name}`, async ({ page }) => {
      await fill(page);
      await setup(page);
      await submit(page);
      // The bot sees the usual success message, but nothing is sent.
      await expect(page.getByText("Message sent")).toBeVisible();
      expect(requests).toHaveLength(0);
    });
  }
});
