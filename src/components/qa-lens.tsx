"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// QA Lens: a magnifier that shows the page the way a QA engineer inspects it.
// The navbar and <main> are mirrored into a viewport-sized "x-ray" layer that
// is only revealed inside a circle following the pointer. Inside the circle the
// element under the lens is shown as its real HTML source, with a QA readout:
// the Playwright locator a tester would use and live accessibility checks.
// Keeping the layer viewport-sized (not as tall as the page) avoids browser
// limits on painting very tall clipped layers.

const TARGETS =
  "a, button, input, textarea, select, label, img, h1, h2, h3, h4, h5, h6, p, li, dt, dd, figcaption, blockquote, code, pre, time";
const VOID = new Set(["img", "input", "br", "hr"]);
const ROLES: Record<string, string> = {
  a: "link",
  button: "button",
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  h5: "heading",
  h6: "heading",
  img: "img",
  li: "listitem",
  p: "paragraph",
  textarea: "textbox",
  select: "combobox",
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

// Tailwind classes, minus variants and arbitrary values that only add noise.
function classSummary(el: Element, n: number) {
  const list = [...el.classList].filter((c) => !c.includes(":") && !c.includes("[") && !c.startsWith("animate-"));
  return list.length ? list.slice(0, n).join(" ") + (list.length > n ? " …" : "") : "";
}

function attrsOf(el: Element) {
  const out: [string, string][] = [];
  for (const name of ["id", "href", "type", "role", "aria-label", "alt"]) {
    const v = el.getAttribute(name);
    if (v !== null) out.push([name, clip(v, 28)]);
  }
  const cls = classSummary(el, 2);
  if (cls) out.push(["class", cls]);
  return out;
}

const tagHtml = (t: string) => `<span class="qa-t">${t}</span>`;
const attrHtml = ([k, v]: [string, string]) => `<span class="qa-k">${k}</span>=<span class="qa-v">"${esc(v)}"</span>`;

function sourceOf(el: Element) {
  const tag = el.tagName.toLowerCase();
  const attrs = attrsOf(el);
  const open =
    attrs.length > 1
      ? `${tagHtml(`&lt;${tag}`)}${attrs.map((a) => `\n  ${attrHtml(a)}`).join("")}${tagHtml(VOID.has(tag) ? " /&gt;" : "&gt;")}`
      : `${tagHtml(`&lt;${tag}`)}${attrs.map((a) => ` ${attrHtml(a)}`).join("")}${tagHtml(VOID.has(tag) ? " /&gt;" : "&gt;")}`;
  if (VOID.has(tag)) return open;

  const lines: string[] = [];
  for (const node of el.childNodes) {
    if (lines.length === 4) {
      lines.push('<span class="qa-m">…</span>');
      break;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) lines.push(`<span class="qa-x">${esc(clip(text, 60))}</span>`);
    } else if (node instanceof Element) {
      const ct = node.tagName.toLowerCase();
      const cls = classSummary(node, 1);
      const a = cls ? ` ${attrHtml(["class", cls])}` : "";
      const text = (node as HTMLElement).innerText?.trim().split("\n")[0];
      lines.push(
        text
          ? `${tagHtml(`&lt;${ct}`)}${a}${tagHtml("&gt;")}<span class="qa-x">${esc(clip(text, 32))}</span>${tagHtml(`&lt;/${ct}&gt;`)}`
          : `${tagHtml(`&lt;${ct}`)}${a}${tagHtml(" /&gt;")}`,
      );
    }
  }
  return `${open}${lines.map((l) => `\n  ${l}`).join("")}\n${tagHtml(`&lt;/${tag}&gt;`)}`;
}

function accessibleName(el: Element) {
  return (
    el.getAttribute("aria-label") ||
    el.getAttribute("alt") ||
    el.getAttribute("title") ||
    (el as HTMLElement).innerText?.trim().split("\n")[0] ||
    el.querySelector("[aria-label]")?.getAttribute("aria-label") ||
    ""
  );
}

function locatorOf(el: Element) {
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute("role") || (tag === "a" && !el.hasAttribute("href") ? "" : ROLES[tag]);
  const name = clip(accessibleName(el).replace(/'/g, "\\'"), 16);
  if (role) return name ? `getByRole('${role}', { name: '${name}' })` : `getByRole('${role}')`;
  if (name) return `getByText('${name}')`;
  const cls = [...el.classList].find((c) => !c.includes(":") && !c.includes("["));
  return `locator('${tag}${cls ? `.${cls}` : ""}')`;
}

// WCAG contrast of the text against the nearest solid background.
function contrastOf(el: Element) {
  const rgba = (s: string) => (s.match(/[\d.]+/g) || []).map(Number);
  const cs = getComputedStyle(el);
  const fg = rgba(cs.webkitTextFillColor || cs.color);
  if ((fg[3] ?? 1) < 0.5) return null; // gradient or transparent text
  let bg: number[] = [];
  for (let n: Element | null = el; n; n = n.parentElement) {
    const c = rgba(getComputedStyle(n).backgroundColor);
    if ((c[3] ?? 1) >= 0.9) {
      bg = c;
      break;
    }
  }
  if (!bg.length) bg = document.documentElement.classList.contains("dark") ? [5, 6, 8] : [245, 247, 251];
  const lum = ([r, g, b]: number[]) => {
    const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const [hi, lo] = [lum(fg), lum(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

function checksOf(el: Element, rect: DOMRect) {
  const tag = el.tagName.toLowerCase();
  const interactive = /^(a|button|input|textarea|select)$/.test(tag);
  const checks: string[] = [];
  const mark = (ok: boolean, label: string) => `<span class="${ok ? "qa-ok" : "qa-bad"}">${ok ? "✓" : "✗"} ${label}</span>`;
  const text = (el as HTMLElement).innerText?.trim();
  if (text) {
    const ratio = contrastOf(el);
    if (ratio) checks.push(mark(ratio >= 4.5 || (ratio >= 3 && parseFloat(getComputedStyle(el).fontSize) >= 24), `contrast ${ratio.toFixed(1)}`));
  }
  if (interactive || tag === "img") checks.push(mark(!!accessibleName(el), "name"));
  if (interactive) checks.push(mark(rect.width >= 24 && rect.height >= 24, "size"));
  return checks.join(" ");
}

export function QaLens({ onClose }: { onClose: () => void }) {
  const lensRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const main = document.getElementById("main");
    const header = document.querySelector("body > header, header");
    const lens = lensRef.current;
    if (!main || !lens) return;

    const radius = () => (window.innerWidth < 640 ? 88 : 124);
    const layer = document.createElement("div");
    layer.className = "qa-xray";
    layer.setAttribute("aria-hidden", "true");
    layer.inert = true;
    layer.style.display = "none";
    const mainMirror = document.createElement("div");
    const headerMirror = document.createElement("div");
    mainMirror.className = headerMirror.className = "qa-xray-inner";
    // In-lens inspector: dims the mirror and shows the hovered element's source + QA readout.
    const shade = document.createElement("div");
    const outline = document.createElement("div");
    const code = document.createElement("pre");
    const readout = document.createElement("div");
    shade.className = "qa-shade";
    outline.className = "qa-target";
    code.className = "qa-src";
    readout.className = "qa-readout";
    layer.append(mainMirror, headerMirror, shade, outline, code, readout);
    document.body.appendChild(layer);

    let target: Element | null = null;
    const pick = () => {
      // The x-ray layer and lens ignore the pointer, so this finds the real page element.
      const hit = document.elementsFromPoint(cx, cy).find((n) => n !== lens && !layer.contains(n));
      const inPage = hit && (main.contains(hit) || header?.contains(hit));
      return inPage ? hit.closest("a, button") || hit.closest(TARGETS) : null;
    };
    const inspect = () => {
      const el = pick();
      shade.hidden = outline.hidden = code.hidden = readout.hidden = !el;
      if (!el) {
        target = null;
        return;
      }
      const rect = el.getBoundingClientRect();
      const rad = radius();
      if (el !== target) {
        target = el;
        code.innerHTML = sourceOf(el);
        readout.innerHTML = `<span class="qa-x">${esc(locatorOf(el))}</span>${checksOf(el, rect)}`;
      }
      outline.style.cssText = `left:${rect.left - 3}px;top:${rect.top - 3}px;width:${rect.width + 6}px;height:${rect.height + 6}px`;
      code.style.cssText = `left:${cx}px;top:${cy - rad * 0.28}px;width:${rad * 1.4}px;max-height:${rad * 0.84}px`;
      readout.style.cssText = `left:${cx}px;top:${cy + rad * 0.16}px;width:${rad * 1.4}px`;
    };

    // Continuously animated elements (the skills marquee) must stay in step with the page.
    let marquees: [Element, HTMLElement][] = [];
    const syncMarquees = () => {
      for (const [orig, copy] of marquees) {
        const a = orig.getAnimations()[0];
        const c = copy.getAnimations()[0];
        if (!a || !c) continue;
        c.pause();
        c.currentTime = a.currentTime;
      }
    };

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
      syncMarquees();
      inspect();
      lens.style.width = lens.style.height = `${rad * 2}px`;
      lens.style.transform = `translate(${cx - rad}px, ${cy - rad}px)`;
    };

    const build = () => {
      mainMirror.innerHTML = main.innerHTML;
      if (header) {
        headerMirror.innerHTML = header.outerHTML;
        const clone = headerMirror.firstElementChild as HTMLElement | null;
        if (clone) clone.className = "px-4 pt-4";
      }
      const origMarquees = main.querySelectorAll(".animate-marquee");
      const copyMarquees = mainMirror.querySelectorAll<HTMLElement>(".animate-marquee");
      marquees = [...origMarquees].map((el, i) => [el, copyMarquees[i]] as [Element, HTMLElement]).filter(([, c]) => c);
      for (const [orig, copy] of marquees) {
        copy.style.setProperty("animation-direction", getComputedStyle(orig).animationDirection, "important");
      }
      // Strip ids so the mirror never duplicates them in the document.
      mainMirror.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      headerMirror.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      built = true;
      target = null;
      place();
    };

    // Keep animated copies in step every frame while the lens is showing (cheap: two elements).
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
      cancelAnimationFrame(frame);
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
