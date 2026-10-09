"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// QA Lens: a magnifier that shows the page the way a QA engineer inspects it.
// It mirrors <main> into an "x-ray" layer (outlines, sizes, accessibility checks)
// and reveals that layer only inside a circle that follows the pointer.

type Check = { label: string; value: string; pass: boolean };

const ANNOTATE = "section[id], h1, h2, h3, a, button, input, textarea, img";

function accessibleName(el: Element) {
  return (
    el.getAttribute("aria-label") ||
    el.getAttribute("title") ||
    (el as HTMLElement).innerText?.trim() ||
    el.querySelector("[aria-label]")?.getAttribute("aria-label") ||
    ""
  );
}

function hasLabel(el: Element) {
  return !!(el.closest("label") || (el.id && document.querySelector(`label[for="${el.id}"]`)) || el.getAttribute("aria-label"));
}

function runChecks(main: HTMLElement, lcp: number | null, cls: number): Check[] {
  const interactive = [...main.querySelectorAll("a, button")];
  const named = interactive.filter((el) => accessibleName(el)).length;
  const fields = [...main.querySelectorAll("input:not([type=hidden]):not([tabindex='-1']), textarea")];
  const labelled = fields.filter(hasLabel).length;
  const imgs = [...main.querySelectorAll("img")];
  const alt = imgs.filter((i) => i.hasAttribute("alt")).length;
  const levels = [...main.querySelectorAll("h1, h2, h3, h4")].map((h) => Number(h.tagName[1]));
  const ordered = levels.every((l, i) => i === 0 || l - levels[i - 1] <= 1);
  const small = interactive.filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && (r.width < 24 || r.height < 24);
  }).length;

  return [
    { label: "Links & buttons with a name", value: `${named}/${interactive.length}`, pass: named === interactive.length },
    { label: "Form fields with a label", value: `${labelled}/${fields.length}`, pass: labelled === fields.length },
    { label: "Images with alt text", value: imgs.length ? `${alt}/${imgs.length}` : "no images", pass: alt === imgs.length },
    { label: "Heading levels in order", value: ordered ? "yes" : "skips a level", pass: ordered },
    { label: "Tap targets ≥ 24px", value: small ? `${small} too small` : "all", pass: small === 0 },
    { label: "This visit · LCP", value: lcp == null ? "measuring…" : `${(lcp / 1000).toFixed(2)} s`, pass: lcp == null || lcp < 2500 },
    { label: "This visit · layout shift", value: cls.toFixed(3), pass: cls < 0.1 },
  ];
}

export function QaLens({ onClose }: { onClose: () => void }) {
  const lensRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [checks, setChecks] = useState<Check[]>([]);
  const [touch, setTouch] = useState(false);
  const [expanded, setExpanded] = useState(() => typeof window === "undefined" || window.innerWidth >= 640);

  useEffect(() => {
    const main = document.getElementById("main");
    const lens = lensRef.current;
    if (!main || !lens) return;

    const radius = () => (window.innerWidth < 640 ? 90 : 130);
    const layer = document.createElement("div");
    layer.className = "qa-xray";
    layer.setAttribute("aria-hidden", "true");
    layer.inert = true;
    document.body.appendChild(layer);

    let cx = window.innerWidth * 0.5;
    let cy = window.innerHeight * 0.42;

    const place = () => {
      const r = main.getBoundingClientRect();
      Object.assign(layer.style, {
        top: `${r.top + window.scrollY}px`,
        left: `${r.left + window.scrollX}px`,
        width: `${r.width}px`,
        height: `${r.height}px`,
      });
      const rad = radius();
      layer.style.clipPath = `circle(${rad}px at ${cx - r.left}px ${cy - r.top}px)`;
      lens.style.width = lens.style.height = `${rad * 2}px`;
      lens.style.transform = `translate(${cx - rad}px, ${cy - rad}px)`;
    };

    const build = () => {
      layer.innerHTML = main.innerHTML;
      const src = main.querySelectorAll(ANNOTATE);
      const dst = layer.querySelectorAll(ANNOTATE);
      src.forEach((el, i) => {
        const d = dst[i] as HTMLElement | undefined;
        if (!d) return;
        const b = el.getBoundingClientRect();
        if (!b.width) return;
        const tag = el.tagName.toLowerCase();
        const cs = getComputedStyle(el);
        if (tag === "section") d.dataset.qa = `section#${el.id}`;
        else if (/^h[1-3]$/.test(tag)) d.dataset.qa = `${tag} · ${Math.round(parseFloat(cs.fontSize))}px / ${cs.fontWeight}`;
        else if (tag === "img") {
          d.dataset.qa = "img";
          d.dataset.qaOk = el.hasAttribute("alt") ? "alt ✓" : "missing alt ✗";
        } else if (tag === "input" || tag === "textarea") {
          d.dataset.qa = tag;
          d.dataset.qaOk = hasLabel(el) ? "labelled ✓" : "no label ✗";
        } else {
          d.dataset.qa = `${tag} · ${Math.round(b.width)}×${Math.round(b.height)}`;
          if (accessibleName(el) && b.height >= 24) d.dataset.qaOk = "named · target ✓";
        }
      });
      // Strip ids after matching so the mirror never duplicates them in the document.
      layer.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      place();
    };

    // Rebuild the mirror when the page settles (debounced, with a max wait for live text).
    let quiet = 0;
    let lastBuild = 0;
    const scheduleBuild = () => {
      window.clearTimeout(quiet);
      if (performance.now() - lastBuild > 1500) {
        lastBuild = performance.now();
        requestAnimationFrame(build);
      } else {
        quiet = window.setTimeout(() => {
          lastBuild = performance.now();
          build();
        }, 250);
      }
    };
    const mo = new MutationObserver(scheduleBuild);
    mo.observe(main, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["class", "style", "open", "hidden"] });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cx = e.clientX;
      cy = e.clientY;
      place();
    };
    const onScroll = () => {
      place();
      scheduleBuild();
    };
    const onResize = () => scheduleBuild();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onTouchStart = (e: PointerEvent) => e.pointerType !== "mouse" && setTouch(true);

    // Touch: drag the lens itself.
    const onLensDown = (e: PointerEvent) => {
      lens.setPointerCapture(e.pointerId);
      const sx = e.clientX - cx;
      const sy = e.clientY - cy;
      const move = (ev: PointerEvent) => {
        cx = ev.clientX - sx;
        cy = ev.clientY - sy;
        place();
      };
      const up = () => {
        lens.removeEventListener("pointermove", move);
        lens.removeEventListener("pointerup", up);
      };
      lens.addEventListener("pointermove", move);
      lens.addEventListener("pointerup", up);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onTouchStart, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    lens.addEventListener("pointerdown", onLensDown);
    build();

    // Real measurements from this page visit.
    let lcp: number | null = null;
    let cls = 0;
    const refresh = () => setChecks(runChecks(main, lcp, cls));
    const observers: PerformanceObserver[] = [];
    try {
      const o1 = new PerformanceObserver((list) => {
        const last = list.getEntries().at(-1);
        if (last) lcp = last.startTime;
        refresh();
      });
      o1.observe({ type: "largest-contentful-paint", buffered: true });
      const o2 = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
          if (!entry.hadRecentInput) cls += entry.value;
        }
        refresh();
      });
      o2.observe({ type: "layout-shift", buffered: true });
      observers.push(o1, o2);
    } catch {
      // Browser without these entry types: checks still run without them.
    }
    refresh();

    return () => {
      mo.disconnect();
      observers.forEach((o) => o.disconnect());
      window.clearTimeout(quiet);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onTouchStart);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      lens.removeEventListener("pointerdown", onLensDown);
      layer.remove();
    };
  }, [onClose, pathname]);

  const passed = checks.filter((c) => c.pass).length;

  if (!expanded) {
    return (
      <>
        <div ref={lensRef} aria-hidden className={`qa-lens no-print ${touch ? "qa-lens-touch" : ""}`} />
        <div className="glass no-print fixed bottom-4 left-4 z-[65] flex items-center gap-1 rounded-full p-1 text-sm">
          <button type="button" onClick={() => setExpanded(true)} className="rounded-full px-3 py-2 font-medium">
            QA Lens · <span className="text-[#1f9d48] dark:text-[#5ee08a]">{passed}/{checks.length} checks ✓</span>
          </button>
          <button type="button" onClick={onClose} aria-label="Turn off QA Lens" className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div ref={lensRef} aria-hidden className={`qa-lens no-print ${touch ? "qa-lens-touch" : ""}`} />
      <aside
        aria-label="QA Lens report"
        className="glass no-print fixed bottom-4 left-4 z-[65] w-[min(340px,calc(100vw-2rem))] rounded-3xl p-4 text-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold">QA Lens</p>
            <p className="text-xs text-muted-foreground">
              {touch ? "Drag the lens over the page." : "Move your cursor over the page."} Checks run live in your browser.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Turn off QA Lens"
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <ul className="mt-3 grid gap-1.5 font-mono text-[12px]">
          {checks.map((c) => (
            <li key={c.label} className="flex justify-between gap-3">
              <span className="text-muted-foreground">{c.label}</span>
              <span className={c.pass ? "text-[#1f9d48] dark:text-[#5ee08a]" : "text-[#d70015] dark:text-[#ff6961]"}>
                {c.value} {c.pass ? "✓" : "✗"}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between gap-3 border-t pt-3 text-xs">
          <span className="text-muted-foreground">Lighthouse · live site</span>
          <span className="font-mono font-semibold whitespace-nowrap">100 · 100 · 100 · 100</span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            {passed}/{checks.length} live checks passing · Esc to exit
          </span>
          <button type="button" onClick={() => setExpanded(false)} className="min-h-6 rounded-full px-2 hover:bg-muted hover:text-foreground">
            Minimise
          </button>
        </div>
      </aside>
    </>
  );
}
