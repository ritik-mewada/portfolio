import { resolveMx } from "node:dns/promises";
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

// Each API test posts from its own made-up IP so the per-IP rate limit doesn't leak between tests.
let ipCount = 0;
const post = (request: APIRequestContext, body: Record<string, unknown>, ip = `10.0.${process.pid % 250}.${++ipCount}`) =>
  request.post("/api/contact", { data: body, headers: { "x-real-ip": ip } });

const real = { name: "Jane Recruiter", email: "jane@gmail.com", message: "Hi Ritik, we have a QA role open at Acme. Interested?", elapsed: 9000 };

test.describe("contact form › page", () => {
  // Scoped to the real form: the QA Lens keeps an inert copy of the page for its x-ray view.
  const form = (page: Page) => page.locator("main form");

  test.beforeEach(async ({ page }) => {
    await page.goto("/#contact");
  });

  test("won't submit with empty fields", async ({ page }) => {
    let posted = false;
    await page.route("**/api/contact", (route) => {
      posted = true;
      return route.fulfill({ json: { ok: true } });
    });
    await form(page).getByRole("button", { name: "Send message" }).click();
    await expect(form(page).getByLabel("Name")).toBeFocused();
    expect(posted).toBe(false);
  });

  test("sends the message with timing and page, then clears the form", async ({ page }) => {
    const requests: Record<string, unknown>[] = [];
    await page.route("**/api/contact", (route) => {
      requests.push(route.request().postDataJSON());
      return route.fulfill({ json: { ok: true } });
    });
    await form(page).getByLabel("Name").fill(real.name);
    await form(page).getByLabel("Email").fill(real.email);
    await form(page).getByLabel("Message").fill(real.message);
    await form(page).getByRole("button", { name: "Send message" }).click();

    await expect(page.getByText("Message sent")).toBeVisible();
    await expect(form(page).getByLabel("Name")).toHaveValue("");
    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({ name: real.name, email: real.email, message: real.message, company: "", page: "/" });
    expect(typeof requests[0].elapsed).toBe("number");
  });

  test("shows the server's error message", async ({ page }) => {
    await page.route("**/api/contact", (route) => route.fulfill({ status: 400, json: { error: "Please use a permanent email address so I can reply." } }));
    await form(page).getByLabel("Name").fill(real.name);
    await form(page).getByLabel("Email").fill("tim@mailinator.com");
    await form(page).getByLabel("Message").fill(real.message);
    await form(page).getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Please use a permanent email address")).toBeVisible();
  });
});

test.describe("contact api", () => {
  test.skip(({ isMobile }) => isMobile, "API tests don't depend on the device.");

  test("a real message passes every filter", async ({ request }) => {
    // Tests run without a Resend key, so a message that clears the filters gets the "not configured" fallback.
    const res = await post(request, real);
    expect(res.status()).toBe(503);
    expect(await res.json()).toMatchObject({ fallback: true });
  });

  const silentlyDropped: [string, Record<string, unknown>][] = [
    ["honeypot filled", { ...real, company: "Acme SEO" }],
    ["posted without the form", { name: real.name, email: real.email, message: real.message }],
    ["filled in under 3 seconds", { ...real, elapsed: 800 }],
    ["SEO pitch", { ...real, message: "We can get your website on the first page of Google with SEO and backlinks. Click here." }],
    ["link stuffing", { ...real, message: "see http://a.com http://b.com http://c.com http://d.com" }],
    ["link in the name", { ...real, name: "http://spam.example" }],
  ];
  for (const [name, body] of silentlyDropped) {
    test(`drops spam: ${name}`, async ({ request }) => {
      const res = await post(request, body);
      expect(res.status()).toBe(200);
      expect(await res.json()).toEqual({ ok: true });
    });
  }

  const shownErrors: [string, Record<string, unknown>, RegExp][] = [
    ["missing name", { ...real, name: "" }, /name/],
    ["invalid email", { ...real, email: "not-an-email" }, /valid email/],
    ["message too short", { ...real, message: "hi" }, /10–5000/],
    ["disposable address", { ...real, email: "tim@mailinator.com" }, /permanent email/],
  ];
  for (const [name, body, error] of shownErrors) {
    test(`explains how to fix: ${name}`, async ({ request }) => {
      const res = await post(request, body);
      expect(res.status()).toBe(400);
      expect((await res.json()).error).toMatch(error);
    });
  }

  test("rejects a domain that can't receive mail", async ({ request }) => {
    const dns = await resolveMx("gmail.com").then(() => true, () => false);
    test.skip(!dns, "No DNS here, so the server skips this check by design.");
    const res = await post(request, { ...real, email: "jane@domain-that-does-not-exist.invalid" });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toMatch(/can't receive mail/);
  });

  test("rate-limits a 4th message within 10 minutes", async ({ request }) => {
    const ip = `10.9.${process.pid % 250}.1`;
    for (let i = 1; i <= 3; i++) expect((await post(request, { ...real, message: `${real.message} (${i})` }, ip)).status()).not.toBe(429);
    const res = await post(request, real, ip);
    expect(res.status()).toBe(429);
  });
});
