import { resolveMx, resolve4 } from "node:dns/promises";

// Spam filtering for the contact form. Obvious bot traffic is dropped silently
// (the bot is told it worked, so it learns nothing); anything a real person
// could trip gets a visible error instead, so no genuine message is lost quietly.

/** Submissions faster than this were not typed by a person. */
export const MIN_FILL_MS = 3000;

const URL_RE = /\bhttps?:\/\/|\bwww\.|\[url=|<a\s/i;
const URLS_RE = new RegExp(URL_RE.source, "gi");

// Phrases that show up in cold SEO / marketing / scam pitches, not in messages to a developer.
const SPAM_PHRASES: [RegExp, number][] = [
  [/\b(seo|backlinks?|guest ?posts?|link ?building|domain authority)\b/i, 2],
  [/\b(first page|top|rank\w*) (of|on) google\b/i, 2],
  [/\b(increase|boost|grow) (your )?(website )?(traffic|sales|leads|ranking)\b/i, 2],
  [/\b(crypto|bitcoin|forex|casino|betting|viagra|cialis|payday loan|investment opportunity)\b/i, 2],
  [/\b(unsubscribe|opt[ -]?out|click here|limited time|act now|100% free|risk[ -]free)\b/i, 1],
  [/\b(whatsapp|telegram) (me|us|number)\b/i, 1],
];

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com", "10minutemail.com",
  "tempmail.com", "temp-mail.org", "tempmail.net", "yopmail.com", "trashmail.com", "getnada.com",
  "dispostable.com", "maildrop.cc", "throwawaymail.com", "fakeinbox.com", "mintemail.com",
  "mohmal.com", "emailondeck.com", "spamgourmet.com", "mailnesia.com",
]);

/** Scores message content; 3 or more is treated as spam. Returns the reasons for logging. */
export function contentSpamReasons(name: string, message: string) {
  const reasons: string[] = [];
  let score = 0;
  if (URL_RE.test(name)) return ["link in name"];
  const links = message.match(URLS_RE)?.length ?? 0;
  if (links > 3) score += 3;
  else if (links > 2) score += 2;
  if (links > 2) reasons.push(`${links} links`);
  for (const [re, weight] of SPAM_PHRASES) {
    const hit = message.match(re);
    if (hit) {
      score += weight;
      reasons.push(`"${hit[0]}"`);
    }
  }
  const letters = message.replace(/[^a-z]/gi, "");
  if (letters.length > 30 && letters.replace(/[^A-Z]/g, "").length / letters.length > 0.7) {
    score += 1;
    reasons.push("mostly capitals");
  }
  return score >= 3 ? reasons : [];
}

export function isDisposable(email: string) {
  return DISPOSABLE_DOMAINS.has(email.split("@")[1].toLowerCase());
}

/** False only when DNS clearly says the domain can't receive mail; lookup trouble counts as fine. */
export async function domainAcceptsMail(email: string) {
  const domain = email.split("@")[1].toLowerCase();
  const missing = (e: unknown) => ["ENOTFOUND", "ENODATA"].includes((e as { code?: string }).code ?? "");
  const receives = async (d: string) => {
    try {
      if ((await resolveMx(d)).length) return true;
    } catch (e) {
      if (!missing(e)) return true;
    }
    // No MX records: mail falls back to the domain's address record.
    try {
      return (await resolve4(d)).length > 0;
    } catch (e) {
      return !missing(e);
    }
  };
  // If a domain known to work fails too, DNS itself is down: don't turn real visitors away.
  const lookup = async () => (await receives(domain)) || !(await receives("gmail.com"));
  const timeout = new Promise<boolean>((r) => setTimeout(() => r(true), 2500));
  return Promise.race([lookup(), timeout]);
}

// Per-IP limits and duplicate detection. Kept in memory, so each server instance
// counts on its own; that is enough to stop a bot hammering the form.
const LIMITS = [
  { windowMs: 10 * 60_000, max: 3 },
  { windowMs: 24 * 60 * 60_000, max: 10 },
];
const hits = new Map<string, number[]>();
const recent = new Map<string, number>();

export function rateLimited(ip: string, now = Date.now()) {
  const day = LIMITS[LIMITS.length - 1].windowMs;
  const list = (hits.get(ip) ?? []).filter((t) => now - t < day);
  const limited = LIMITS.some(({ windowMs, max }) => list.filter((t) => now - t < windowMs).length >= max);
  if (!limited) list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.delete(hits.keys().next().value!);
  return limited;
}

const messageKey = (email: string, message: string) => `${email.toLowerCase()}\n${message.replace(/\s+/g, " ").toLowerCase()}`;

/** True if the same message was already delivered within the last day (double submits, replays). */
export function isDuplicate(email: string, message: string, now = Date.now()) {
  const seen = recent.get(messageKey(email, message));
  return !!seen && now - seen < 24 * 60 * 60_000;
}

/** Call once a message is delivered, so repeats of it are skipped. */
export function rememberSent(email: string, message: string, now = Date.now()) {
  recent.set(messageKey(email, message), now);
  if (recent.size > 1000) recent.delete(recent.keys().next().value!);
}
