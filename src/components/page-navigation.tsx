"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Home-page navigation helpers:
//  1. Drag to scroll: press on empty space and drag; release to glide.
//  2. Section rail: dots on the right edge, one per section.
//  3. Keyboard: J / K for next / previous section, 1–7 to jump.

const SECTIONS = [
  ["top", "Home"],
  ["about", "About"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["projects", "Projects"],
  ["github", "GitHub"],
  ["contact", "Contact"],
] as const;

const INTERACTIVE = "a, button, input, textarea, select, label, summary, [role='button'], [contenteditable='true'], .qa-lens, [data-page-nav]";

function isOverText(x: number, y: number) {
  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node } | null;
  };
  const node = doc.caretPositionFromPoint?.(x, y)?.offsetNode ?? document.caretRangeFromPoint?.(x, y)?.startContainer;
  if (!node || node.nodeType !== Node.TEXT_NODE) return false;
  const range = document.createRange();
  range.selectNodeContents(node);
  return [...range.getClientRects()].some((b) => x >= b.left && x <= b.right && y >= b.top && y <= b.bottom);
}

export function PageNavigation() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [sections, setSections] = useState<(typeof SECTIONS)[number][]>([]);
  const [current, setCurrent] = useState(0);
  const [hint, setHint] = useState(false);

  const isHome = pathname === "/";

  // Only list sections that actually rendered (e.g. GitHub hides itself if the API is down).
  useEffect(() => {
    if (!isHome) return;
    const id = requestAnimationFrame(() => setSections(SECTIONS.filter(([s]) => document.getElementById(s))));
    return () => cancelAnimationFrame(id);
  }, [isHome]);

  const indexNow = useCallback(() => {
    let idx = 0;
    sections.forEach(([s], i) => {
      const el = document.getElementById(s);
      if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) idx = i;
    });
    return idx;
  }, [sections]);

  const goTo = useCallback(
    (i: number) => {
      const k = Math.max(0, Math.min(sections.length - 1, i));
      const el = document.getElementById(sections[k]?.[0] ?? "");
      if (!el) return;
      if (lenis) lenis.scrollTo(k === 0 ? 0 : el, { offset: -80 });
      else window.scrollTo({ top: k === 0 ? 0 : el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    },
    [lenis, sections],
  );

  // Highlight the section being read.
  useEffect(() => {
    if (!sections.length) return;
    const onScroll = () => setCurrent(indexNow());
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections, indexNow]);

  // Keyboard shortcuts.
  useEffect(() => {
    if (!sections.length) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement | null)?.closest?.("input, textarea, select, [contenteditable='true'], [cmdk-root]")) return;
      const k = e.key.toLowerCase();
      if (k === "j") goTo(indexNow() + 1);
      else if (k === "k") goTo(indexNow() - 1);
      else if (/^[1-9]$/.test(k) && Number(k) <= sections.length) goTo(Number(k) - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sections, goTo, indexNow]);

  // Drag to scroll (mouse only), with a short glide on release.
  useEffect(() => {
    if (!isHome) return;
    const root = document.documentElement;
    let drag: { y: number; top: number; moved: boolean; samples: [number, number][] } | null = null;

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE) || isOverText(e.clientX, e.clientY)) return;
      drag = { y: e.clientY, top: window.scrollY, moved: false, samples: [[performance.now(), e.clientY]] };
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dy = e.clientY - drag.y;
      if (!drag.moved && Math.abs(dy) < 4) return;
      if (!drag.moved) {
        drag.moved = true;
        root.classList.add("page-dragging");
      }
      const top = drag.top - dy;
      if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
      else window.scrollTo({ top, behavior: "instant" });
      drag.samples.push([performance.now(), e.clientY]);
      if (drag.samples.length > 5) drag.samples.shift();
    };
    const up = () => {
      if (!drag) return;
      const d = drag;
      drag = null;
      root.classList.remove("page-dragging");
      if (!d.moved) return;
      // Swallow the click that follows a drag so nothing underneath gets activated.
      window.addEventListener("click", (ev) => { ev.preventDefault(); ev.stopPropagation(); }, { capture: true, once: true });
      const [t0, y0] = d.samples[0];
      const [t1, y1] = d.samples[d.samples.length - 1];
      const velocity = t1 > t0 ? -(y1 - y0) / (t1 - t0) : 0; // px per ms
      if (Math.abs(velocity) < 0.1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const target = window.scrollY + velocity * 280;
      if (lenis) lenis.scrollTo(target, { duration: 0.9 });
      else window.scrollTo({ top: target, behavior: "smooth" });
    };
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      root.classList.remove("page-dragging");
    };
  }, [isHome, lenis]);

  // One-time tip (per browser session, mouse users only).
  useEffect(() => {
    if (!sections.length || !window.matchMedia("(pointer: fine)").matches) return;
    try {
      if (sessionStorage.getItem("nav-hint") === "1") return;
      sessionStorage.setItem("nav-hint", "1");
    } catch {
      return;
    }
    const show = setTimeout(() => setHint(true), 1800);
    const hide = setTimeout(() => setHint(false), 8000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [sections]);

  if (!isHome || !sections.length) return null;

  return (
    <>
      <nav
        aria-label="Sections"
        data-page-nav
        className="glass no-print fixed top-1/2 right-4 z-[60] hidden -translate-y-1/2 flex-col gap-0.5 rounded-full px-1.5 py-2 md:flex"
      >
        {sections.map(([id, label], i) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={label}
            aria-current={i === current ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              goTo(i);
            }}
            className="group relative grid size-7 place-items-center rounded-full"
          >
            <span
              className={cn(
                "rounded-full transition-all duration-300",
                i === current ? "h-5 w-2 bg-accent" : "size-1.5 bg-muted-foreground/60 group-hover:scale-125 group-hover:bg-foreground",
              )}
            />
            <span className="pointer-events-none absolute top-1/2 right-[calc(100%+10px)] flex translate-x-1.5 -translate-y-1/2 items-center gap-2 rounded-full bg-foreground px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-background opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
              {label}
              <kbd className="rounded border border-current px-1 font-mono text-[10px] opacity-75">{i + 1}</kbd>
            </span>
          </a>
        ))}
      </nav>

      <div
        role="status"
        data-page-nav
        onClick={() => setHint(false)}
        className={cn(
          "glass no-print fixed bottom-5 left-1/2 z-[70] hidden max-w-[calc(100vw-2rem)] -translate-x-1/2 truncate rounded-full !bg-background/90 px-4 py-2.5 text-[13px] transition-all duration-300 md:block",
          hint ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        {hint && (
          <>
            <b className="mr-1.5 text-accent">Tip</b>Drag anywhere to scroll · <Kbd>J</Kbd> <Kbd>K</Kbd> next / previous section ·{" "}
            <Kbd>1</Kbd>–<Kbd>{String(sections.length)}</Kbd> jump · <Kbd>⌘L</Kbd> QA Lens
          </>
        )}
      </div>
    </>
  );
}

function Kbd({ children }: { children: string }) {
  return <kbd className="rounded border border-current px-1 font-mono text-[10.5px] opacity-75">{children}</kbd>;
}
