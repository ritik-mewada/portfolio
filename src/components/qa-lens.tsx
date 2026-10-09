"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// QA Lens: a magnifier that shows the page the way a QA engineer inspects it.
// The navbar and <main> are mirrored into a viewport-sized "x-ray" layer
// (outlines, sizes, accessibility labels) that is only revealed inside a
// circle following the pointer. Keeping the layer viewport-sized (not as tall
// as the page) avoids browser limits on painting very tall clipped layers.

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

function annotate(src: Element, dst: Element) {
  const from = src.querySelectorAll(ANNOTATE);
  const to = dst.querySelectorAll(ANNOTATE);
  from.forEach((el, i) => {
    const d = to[i] as HTMLElement | undefined;
    const b = el.getBoundingClientRect();
    if (!d || !b.width) return;
    const tag = el.tagName.toLowerCase();
    if (tag === "section") d.dataset.qa = `section#${el.id}`;
    else if (/^h[1-3]$/.test(tag)) {
      const cs = getComputedStyle(el);
      d.dataset.qa = `${tag} · ${Math.round(parseFloat(cs.fontSize))}px / ${cs.fontWeight}`;
    } else if (tag === "img") {
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
}

export function QaLens({ onClose }: { onClose: () => void }) {
  const lensRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const main = document.getElementById("main");
    const header = document.querySelector("body > header, header");
    const lens = lensRef.current;
    if (!main || !lens) return;

    const radius = () => (window.innerWidth < 640 ? 56 : 76);
    const layer = document.createElement("div");
    layer.className = "qa-xray";
    layer.setAttribute("aria-hidden", "true");
    layer.inert = true;
    layer.style.display = "none";
    const mainMirror = document.createElement("div");
    const headerMirror = document.createElement("div");
    mainMirror.className = headerMirror.className = "qa-xray-inner";
    layer.append(mainMirror, headerMirror);
    document.body.appendChild(layer);

    let cx = window.innerWidth * 0.5;
    let cy = window.innerHeight * 0.42;
    let built = false;
    // Until the visitor moves the pointer (or drags the lens), nothing is shown or built.
    let visible = false;

    const place = () => {
      if (!visible) return;
      const rad = radius();
      const r = main.getBoundingClientRect();
      layer.style.clipPath = `circle(${rad}px at ${cx}px ${cy}px)`;
      mainMirror.style.width = `${r.width}px`;
      mainMirror.style.transform = `translate(${r.left}px, ${r.top}px)`;
      if (header) {
        const h = header.getBoundingClientRect();
        headerMirror.style.width = `${h.width}px`;
        headerMirror.style.transform = `translate(${h.left}px, ${h.top}px)`;
      }
      lens.style.width = lens.style.height = `${rad * 2}px`;
      lens.style.transform = `translate(${cx - rad}px, ${cy - rad}px)`;
    };

    const build = () => {
      mainMirror.innerHTML = main.innerHTML;
      annotate(main, mainMirror);
      if (header) {
        headerMirror.innerHTML = header.outerHTML;
        const clone = headerMirror.firstElementChild as HTMLElement | null;
        if (clone) clone.className = "px-4 pt-4";
        if (clone) annotate(header, clone);
      }
      // Strip ids after matching so the mirror never duplicates them in the document.
      layer.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      built = true;
      place();
    };

    const show = () => {
      if (visible) return;
      visible = true;
      lens.hidden = false;
      layer.style.display = "block";
      if (!built) build();
      place();
    };

    // Rebuild the mirror when the page settles (debounced, with a max wait for live text).
    let quiet = 0;
    let lastBuild = 0;
    const scheduleBuild = () => {
      if (!visible) return;
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
    const watch = { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["class", "style", "open", "hidden", "aria-pressed"] };
    mo.observe(main, watch);
    if (header) mo.observe(header, watch);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cx = e.clientX;
      cy = e.clientY;
      show();
      place();
    };
    const onScroll = () => {
      place();
      scheduleBuild();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();

    // Touch: the lens appears mid-screen and is dragged with a finger.
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (touch) {
      lens.classList.add("qa-lens-touch");
      show();
    }
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
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleBuild);
    window.addEventListener("keydown", onKey);
    lens.addEventListener("pointerdown", onLensDown);

    return () => {
      mo.disconnect();
      window.clearTimeout(quiet);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleBuild);
      window.removeEventListener("keydown", onKey);
      lens.removeEventListener("pointerdown", onLensDown);
      layer.remove();
    };
  }, [onClose, pathname]);

  return <div ref={lensRef} hidden aria-hidden className="qa-lens no-print" />;
}
