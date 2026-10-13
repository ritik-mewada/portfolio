import { site } from "@/content/site";
import { MIN_FILL_MS, contentSpamReasons, domainAcceptsMail, isDisposable, isDuplicate, rateLimited, rememberSent } from "@/lib/spam";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Bots get a normal success reply so they don't adapt; the reason goes to the server log.
const dropSpam = (reason: string, email: string) => {
  console.warn(`[contact] dropped spam (${reason}) from ${email || "unknown"}`);
  return Response.json({ ok: true });
};

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(body.name);
  const email = str(body.email);
  const message = str(body.message);
  const page = str(body.page).slice(0, 200);

  // Honeypot: real visitors never fill this hidden field.
  if (str(body.company)) return dropSpam("honeypot", email);
  // Time trap: the form reports how long it was open; scripts posting directly don't.
  const elapsed = Number(body.elapsed);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) return dropSpam("filled too fast", email);

  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (rateLimited(ip)) {
    return Response.json({ error: "Too many messages — please try again later or email me directly." }, { status: 429 });
  }

  if (name.length < 2 || name.length > 100) return Response.json({ error: "Please enter your name." }, { status: 400 });
  if (!EMAIL_RE.test(email) || email.length > 200) return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  if (message.length < 10 || message.length > 5000) return Response.json({ error: "Message should be 10–5000 characters." }, { status: 400 });

  const spam = contentSpamReasons(name, message);
  if (spam.length) return dropSpam(spam.join(", "), email);
  if (isDuplicate(email, message)) return dropSpam("duplicate", email);

  // A real person can trip these, so they get told what to fix.
  if (isDisposable(email)) return Response.json({ error: "Please use a permanent email address so I can reply." }, { status: 400 });
  if (!(await domainAcceptsMail(email))) {
    return Response.json({ error: "That email address can't receive mail — please check it." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Contact form isn't configured yet.", fallback: true }, { status: 503 });
  }

  const sentAt = new Date().toUTCString();
  const country = request.headers.get("x-vercel-ip-country");
  const details = [`Sent: ${sentAt}`, page && `Page: ${page}`, country && `Country: ${country}`].filter(Boolean) as string[];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL ?? site.email,
      reply_to: email,
      subject: `Portfolio message from ${name}`,
      text: `${name} (${email}) wrote:\n\n${message}\n\n—\n${details.join("\n")}\nReply to this email to answer ${name} directly.`,
      html:
        `<p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) wrote:</p>` +
        `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>` +
        `<hr><p style="color:#666;font-size:12px">${details.map(escapeHtml).join("<br>")}<br>Reply to this email to answer ${escapeHtml(name)} directly.</p>`,
    }),
  });

  if (!res.ok) {
    console.error(`[contact] Resend error ${res.status}: ${await res.text().catch(() => "")}`);
    return Response.json({ error: "Couldn't send right now.", fallback: true }, { status: 502 });
  }
  rememberSent(email, message);
  return Response.json({ ok: true });
}
