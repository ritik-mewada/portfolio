"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { flushQueuedEvents, track } from "@/lib/analytics";

const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

// Recognises the links worth counting by where they point, so individual links don't need tagging.
function linkEvent(a: HTMLAnchorElement): [string, Record<string, string>] | null {
  const href = a.getAttribute("href") ?? "";
  const from = a.closest("section[id]")?.id ?? (a.closest("header") ? "nav" : a.closest("footer") ? "footer" : "page");
  if (href.startsWith("mailto:")) return ["email_click", { from }];
  if (href === "/resume" || href.startsWith("/resume#") || href.startsWith("/resume?")) return ["resume_open", { from }];
  const project = href.match(/^\/projects\/([^/?#]+)/);
  if (project) return ["project_open", { project: project[1] }];
  if (/^https?:\/\//.test(href)) {
    const host = new URL(href).hostname.replace(/^www\./, "");
    if (host === window.location.hostname) return null;
    const destination = host.includes("linkedin.com") ? "LinkedIn" : host === "github.com" ? "GitHub" : host;
    return ["outbound_click", { destination, from }];
  }
  return null;
}

/**
 * Loads Umami and records clicks and section views. Renders nothing and tracks
 * nothing unless NEXT_PUBLIC_UMAMI_WEBSITE_ID is set (so local dev isn't counted).
 */
export function Umami() {
  const pathname = usePathname();

  useEffect(() => {
    if (!WEBSITE_ID) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      const event = a && linkEvent(a as HTMLAnchorElement);
      if (event) track(...event);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // Each section counts once per page view, however often it scrolls past.
  useEffect(() => {
    if (!WEBSITE_ID) return;
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!entry.isIntersecting || seen.has(id)) continue;
          seen.add(id);
          io.unobserve(entry.target);
          track("section_view", { section: id, page: pathname });
        }
      },
      { threshold: 0.35 },
    );
    document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  if (!WEBSITE_ID) return null;
  return <Script src="https://cloud.umami.is/script.js" data-website-id={WEBSITE_ID} strategy="afterInteractive" onReady={flushQueuedEvents} />;
}
