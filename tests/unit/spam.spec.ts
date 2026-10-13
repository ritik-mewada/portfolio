import { expect, test } from "@playwright/test";
import { contentSpamReasons, isDisposable, isDuplicate, rateLimited, rememberSent } from "../../src/lib/spam";

test.describe("spam filter › message content", () => {
  test("lets a normal message through", () => {
    expect(contentSpamReasons("Jane Recruiter", "Hi Ritik, we have a QA role open at Acme. Interested in a chat?")).toEqual([]);
  });

  test("lets a message with a couple of links through", () => {
    expect(contentSpamReasons("Jane", "Job post: https://acme.com/jobs/qa and our team page https://acme.com/team")).toEqual([]);
  });

  test("flags link stuffing", () => {
    const reasons = contentSpamReasons("Bob", "see http://a.com http://b.com http://c.com http://d.com");
    expect(reasons).toContain("4 links");
  });

  test("flags a link in the name", () => {
    expect(contentSpamReasons("http://spam.example", "Hello there, nice site")).toEqual(["link in name"]);
  });

  test("flags SEO pitches", () => {
    const reasons = contentSpamReasons("Mark", "We can get your website on the first page of Google with SEO and backlinks.");
    expect(reasons.length).toBeGreaterThan(0);
  });

  test("does not flag a single marketing-ish word on its own", () => {
    expect(contentSpamReasons("Ana", "Our team works on SEO tooling and needs a QA engineer. Would you like to talk?")).toEqual([]);
  });
});

test.describe("spam filter › email addresses", () => {
  test("recognises disposable domains, case-insensitively", () => {
    expect(isDisposable("tim@Mailinator.com")).toBe(true);
    expect(isDisposable("tim@gmail.com")).toBe(false);
  });
});

test.describe("spam filter › rate limit", () => {
  test("allows 3 messages per 10 minutes per IP, then blocks", () => {
    const ip = `unit-${Math.random()}`;
    const t = 1_000_000;
    expect([rateLimited(ip, t), rateLimited(ip, t + 1), rateLimited(ip, t + 2)]).toEqual([false, false, false]);
    expect(rateLimited(ip, t + 3)).toBe(true);
    expect(rateLimited(`${ip}-other`, t + 3)).toBe(false);
  });

  test("allows more once the 10-minute window has passed", () => {
    const ip = `unit-${Math.random()}`;
    const t = 2_000_000;
    for (let i = 0; i < 3; i++) rateLimited(ip, t + i);
    expect(rateLimited(ip, t + 11 * 60_000)).toBe(false);
  });

  test("caps a day at 10 messages", () => {
    const ip = `unit-${Math.random()}`;
    let t = 3_000_000;
    for (let i = 0; i < 10; i++, t += 11 * 60_000) expect(rateLimited(ip, t)).toBe(false);
    expect(rateLimited(ip, t)).toBe(true);
  });
});

test.describe("spam filter › duplicates", () => {
  test("skips a repeat of a delivered message, ignoring case and spacing", () => {
    const email = `dup-${Math.random()}@example.com`;
    expect(isDuplicate(email, "Hello   there Ritik")).toBe(false);
    rememberSent(email, "Hello there Ritik");
    expect(isDuplicate(email.toUpperCase(), "hello there   ritik")).toBe(true);
  });

  test("does not treat a message as sent until it is remembered", () => {
    const email = `dup-${Math.random()}@example.com`;
    expect(isDuplicate(email, "First try")).toBe(false);
    expect(isDuplicate(email, "First try")).toBe(false);
  });
});
