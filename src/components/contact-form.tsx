"use client";

import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";
import { MIN_FILL_MS, contentSpamReasons, isDisposable, isDuplicate, rememberSent } from "@/lib/spam";

const inputClass =
  "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent";

// Messages are delivered by Web3Forms (https://web3forms.com). The access key only lets
// someone send mail to the inbox it was made for, so it is safe to ship to the browser.
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

function openEmailClient({ name, email, message }: Record<string, string>) {
  const subject = encodeURIComponent(`Hello from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
}

export function ContactForm() {
  const [pending, setPending] = useState(false);
  // When the form appeared; submissions faster than a person can type are dropped.
  const openedAt = useRef(0);
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const data = { name: raw.name.trim(), email: raw.email.trim(), message: raw.message.trim() };
    const sent = () => {
      toast.success("Message sent — I'll get back to you soon.");
      form.reset();
      openedAt.current = Date.now();
    };

    // Bots get the normal success message so they don't adapt; the kind of spam is counted in analytics.
    const spam = raw.company
      ? "honeypot"
      : Date.now() - openedAt.current < MIN_FILL_MS
        ? "too fast"
        : contentSpamReasons(data.name, data.message).length
          ? "content"
          : isDuplicate(data.email, data.message)
            ? "duplicate"
            : null;
    if (spam) {
      track("contact_blocked", { reason: spam });
      return sent();
    }
    if (isDisposable(data.email)) return void toast.error("Please use a permanent email address so I can reply.");
    if (!ACCESS_KEY) return openEmailClient(data);

    setPending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio message from ${data.name}`,
          from_name: "Portfolio",
          ...data,
          page: window.location.pathname,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (res.ok && json.success) {
        rememberSent(data.email, data.message);
        track("contact_sent");
        sent();
      } else {
        // Delivery failed (bad key, quota, outage): hand the message to the visitor's email client instead.
        openEmailClient(data);
      }
    } catch {
      toast.error("Network error — please email me directly.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl glass p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium">Name</span>
          <input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Jane Doe" className={inputClass} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">Email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="jane@company.com" className={inputClass} />
        </label>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-medium">Message</span>
        <textarea name="message" required minLength={10} maxLength={5000} rows={5} placeholder="Tell me about the role, team, or project…" className={`${inputClass} resize-y`} />
      </label>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 sm:w-auto"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
