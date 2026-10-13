"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// QA Lens: a magnifier that shows the page the way a QA engineer inspects it.
// The navbar and <main> are mirrored into a viewport-sized "x-ray" layer
// (outlines, sizes, accessibility labels) that is only revealed inside a
// circle following the pointer. Keeping the layer viewport-sized (not as tall
// as the page) avoids browser limits on painting very tall clipped layers.
// Moving the lens only changes transforms (composited, no repaint); the
// mirrored page is redrawn only when the page itself changes or scrolls.

const ANNOTATE = "section[id], h1, h2, h3, p, a, button, input, textarea, img";

// Labels read like the element's real opening tag, e.g. <a href="#projects">.
function openTag(el: Element, attr?: string) {
  const tag = el.tagName.toLowerCase();
  const value = attr && el.getAttribute(attr);
  if (!value) return `<${tag}>`;
  return `<${tag} ${attr}="${value.length > 18 ? `${value.slice(0, 17)}…` : value}">`;
}

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

// An annotated copy and its box within the mirror, so its label can slide to stay inside the lens.
type Label = { el: HTMLElement; x: number; y: number; w: number; h: number };

function annotate(src: Element, dst: Element) {
  const from = src.querySelectorAll(ANNOTATE);
  const to = dst.querySelectorAll(ANNOTATE);
  const origin = src.getBoundingClientRect();
  const labels: Label[] = [];
  from.forEach((el, i) => {
    const d = to[i] as HTMLElement | undefined;
    const b = el.getBoundingClientRect();
    if (!d || !b.width) return;
    const tag = el.tagName.toLowerCase();
    if (tag !== "section") labels.push({ el: d, x: b.left - origin.left, y: b.top - origin.top, w: b.width, h: b.height });
    if (tag === "section") d.dataset.qa = openTag(el, "id");
    else if (/^(h[1-3]|p)$/.test(tag)) {
      const cs = getComputedStyle(el);
      d.dataset.qa = `${openTag(el)} ${Math.round(parseFloat(cs.fontSize))}px · ${cs.fontWeight}`;
    } else if (tag === "img") {
      d.dataset.qa = openTag(el, "alt");
      d.dataset.qaOk = el.hasAttribute("alt") ? "alt ✓" : "missing alt ✗";
    } else if (tag === "input" || tag === "textarea") {
      d.dataset.qa = openTag(el, "type");
      d.dataset.qaOk = hasLabel(el) ? "labelled ✓" : "no label ✗";
    } else {
      const attr = el.hasAttribute("href") ? "href" : el.hasAttribute("aria-label") ? "aria-label" : undefined;
      d.dataset.qa = `${openTag(el, attr)} ${Math.round(b.width)}×${Math.round(b.height)}`;
      if (accessibleName(el) && b.height >= 24) d.dataset.qaOk = "named · target ✓";
    }
  });
  return labels;
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
    // The layer is the lens-sized window; the view inside it is viewport-sized and
    // counter-translated, so the mirror stays lined up with the page as the lens moves.
    const view = document.createElement("div");
    view.className = "qa-xray-view";
    const mainMirror = document.createElement("div");
    const headerMirror = document.createElement("div");
    mainMirror.className = headerMirror.className = "qa-xray-inner";
    view.append(mainMirror, headerMirror);
    layer.append(view);
    document.body.appendChild(layer);

    // Continuously animated elements (the skills marquee) must stay in step with the page.
    let marquees: [Element, HTMLElement][] = [];
    // Only writes when they drift apart, so a running copy stays on the compositor.
    const syncMarquees = () => {
      for (const [orig, copy] of marquees) {
        const a = orig.getAnimations()[0];
        const c = copy.getAnimations()[0];
        if (!a || !c) continue;
        if (a.playState === "paused") {
          if (c.playState !== "paused") c.pause();
          if (c.currentTime !== a.currentTime) c.currentTime = a.currentTime;
        } else if (a.startTime !== null && (c.playState === "paused" || c.startTime !== a.startTime)) {
          c.startTime = a.startTime;
        }
      }
    };

    let cx = window.innerWidth * 0.5;
    let cy = window.innerHeight * 0.42;
    let built = false;
    let mainLabels: Label[] = [];
    let headerLabels: Label[] = [];
    // Until the visitor moves the pointer (or drags the lens), nothing is shown or built.
    let visible = false;

    // Labels sit in a band across the upper part of the lens. Only the elements under
    // the lens are touched, so a move restyles a handful of labels, not the whole mirror.
    const slideLabels = (labels: Label[], left: number, top: number, rad: number) => {
      const lx = cx - left;
      const ly = cy - top;
      for (const l of labels) {
        if (l.x > lx + rad || l.x + l.w < lx - rad - 160 || l.y - 20 > ly + rad || l.y + l.h + 20 < ly - rad) continue;
        l.el.style.setProperty("--qa-dx", `${Math.round(lx - rad * 0.8 - l.x)}px`);
        l.el.style.setProperty("--qa-dy", `${Math.round(ly - rad * 0.5 - l.y)}px`);
      }
    };

    const mirrorAt = (el: HTMLElement, r: DOMRect) => {
      const width = `${r.width}px`;
      const transform = `translate(${r.left}px, ${r.top}px)`;
      if (el.style.width !== width) el.style.width = width;
      if (el.style.transform !== transform) el.style.transform = transform;
    };

    const place = () => {
      if (!visible) return;
      const rad = radius();
      const size = `${rad * 2}px`;
      const at = `translate(${cx - rad}px, ${cy - rad}px)`;
      lens.style.width = lens.style.height = layer.style.width = layer.style.height = size;
      lens.style.transform = layer.style.transform = at;
      view.style.transform = `translate(${rad - cx}px, ${rad - cy}px)`;
      const r = main.getBoundingClientRect();
      mirrorAt(mainMirror, r);
      slideLabels(mainLabels, r.left, r.top, rad);
      if (header) {
        const h = header.getBoundingClientRect();
        mirrorAt(headerMirror, h);
        slideLabels(headerLabels, h.left, h.top, rad);
      }
    };

    // Pointer and scroll events can fire several times per frame; draw once per frame.
    let pending = 0;
    const schedulePlace = () => {
      if (!pending) pending = requestAnimationFrame(() => {
        pending = 0;
        place();
      });
    };

    const build = () => {
      mainMirror.innerHTML = main.innerHTML;
      mainLabels = annotate(main, mainMirror);
      if (header) {
        headerMirror.innerHTML = header.outerHTML;
        const clone = headerMirror.firstElementChild as HTMLElement | null;
        if (clone) clone.className = "px-4 pt-4";
        headerLabels = clone ? annotate(header, clone) : [];
      }
      const origMarquees = main.querySelectorAll(".animate-marquee");
      const copyMarquees = mainMirror.querySelectorAll<HTMLElement>(".animate-marquee");
      marquees = [...origMarquees].map((el, i) => [el, copyMarquees[i]] as [Element, HTMLElement]).filter(([, c]) => c);
      for (const [orig, copy] of marquees) {
        copy.style.setProperty("animation-direction", getComputedStyle(orig).animationDirection, "important");
      }
      syncMarquees();
      // Strip ids after matching so the mirror never duplicates them in the document.
      layer.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      built = true;
      place();
    };

    // Keep animated copies in step while the lens is showing (cheap: two elements).
    let frame = 0;
    const tick = () => {
      syncMarquees();
      frame = requestAnimationFrame(tick);
    };

    const show = () => {
      if (visible) return;
      visible = true;
      frame = requestAnimationFrame(tick);
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
    // Pointer effects (hero glow, card tilt) restyle elements on every move; those
    // changes don't affect the x-ray, and rebuilding for them made the lens stutter.
    // Live text (the hero typewriter ticks every few dozen ms) is copied straight into
    // the mirror; a full rebuild for each tick made the lens hitch every second or so.
    const mirrorOf = (el: Element) => {
      const clone = headerMirror.firstElementChild;
      const [root, copy] = main.contains(el) ? [main, mainMirror] : header?.contains(el) && clone ? [header, clone] : [];
      if (!root || !copy) return null;
      const path: number[] = [];
      for (let n = el; n !== root; n = n.parentElement!) path.unshift([...n.parentElement!.children].indexOf(n));
      let m: Element | undefined = copy;
      for (const i of path) m = m?.children[i];
      return m?.tagName === el.tagName ? m : null;
    };
    const copyText = (m: MutationRecord) => {
      const el = m.type === "characterData" ? m.target.parentElement : m.type === "childList" ? (m.target as Element) : null;
      if (!built || !el || el.childElementCount) return false;
      if ([...m.addedNodes, ...m.removedNodes].some((n) => n.nodeType !== Node.TEXT_NODE)) return false;
      const copy = mirrorOf(el);
      if (copy) copy.textContent = el.textContent;
      return !!copy;
    };
    const mo = new MutationObserver((records) => {
      let rebuild = false;
      for (const m of records) {
        if (m.attributeName === "style" && (m.target as Element).closest("[data-qa-pointer-fx]")) continue;
        if (!copyText(m)) rebuild = true;
      }
      if (rebuild) scheduleBuild();
    });
    const watch = { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["class", "style", "open", "hidden", "aria-pressed"] };
    mo.observe(main, watch);
    if (header) mo.observe(header, watch);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cx = e.clientX;
      cy = e.clientY;
      show();
      schedulePlace();
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
        schedulePlace();
      };
      const up = () => {
        lens.removeEventListener("pointermove", move);
        lens.removeEventListener("pointerup", up);
      };
      lens.addEventListener("pointermove", move);
      lens.addEventListener("pointerup", up);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedulePlace, { passive: true });
    window.addEventListener("resize", scheduleBuild);
    window.addEventListener("keydown", onKey);
    lens.addEventListener("pointerdown", onLensDown);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      mo.disconnect();
      window.clearTimeout(quiet);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedulePlace);
      window.removeEventListener("resize", scheduleBuild);
      window.removeEventListener("keydown", onKey);
      lens.removeEventListener("pointerdown", onLensDown);
      layer.remove();
    };
  }, [onClose, pathname]);

  return <div ref={lensRef} hidden aria-hidden className="qa-lens no-print" />;
}
