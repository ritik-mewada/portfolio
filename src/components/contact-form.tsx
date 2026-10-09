"use client";

import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { site } from "@/content/site";

const inputClass =
  "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent";

export function ContactForm() {
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; fallback?: boolean };
      if (res.ok) {
        toast.success("Message sent — I'll get back to you soon.");
        form.reset();
      } else if (json.fallback) {
        const subject = encodeURIComponent(`Hello from ${data.name}`);
        const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
        window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      } else {
        toast.error(json.error ?? "Something went wrong.");
      }
    } catch {
      toast.error("Network error — please email me directly.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border bg-card p-6 sm:p-8">
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
        <textarea name="message" required minLength={10} maxLength={5000} rows={5} placeholder="Tell me about the role, team or project…" className={`${inputClass} resize-y`} />
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
