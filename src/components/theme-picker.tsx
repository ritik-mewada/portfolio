"use client";

// Visitor theme picker. Disabled for now: it is not rendered anywhere.
// To enable: import ./themes CSS files, then uncomment <ThemePicker /> in navbar.tsx.

import { Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_THEME, THEMES, type ThemeId } from "@/themes";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "site-theme";

function applyTheme(id: ThemeId) {
  document.documentElement.dataset.siteTheme = id;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Storage blocked: the choice just won't be remembered.
  }
}

export function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ThemeId>(DEFAULT_THEME);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {}
    const id = saved && saved in THEMES ? (saved as ThemeId) : DEFAULT_THEME;
    document.documentElement.dataset.siteTheme = id;
    const t = setTimeout(() => setCurrent(id));
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("click", close);
    return () => {
      clearTimeout(t);
      window.removeEventListener("click", close);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Choose site theme"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Palette className="size-4" />
      </button>
      {open && (
        <div role="dialog" aria-label="Choose a site theme" className="glass absolute top-12 right-0 z-[80] w-[min(340px,calc(100vw-24px))] rounded-3xl p-3">
          <p className="mx-1.5 mb-2 text-xs font-semibold text-muted-foreground">Site theme</p>
          <div className="grid gap-1.5">
            {(Object.entries(THEMES) as [ThemeId, (typeof THEMES)[ThemeId]][]).map(([id, t]) => (
              <button
                key={id}
                type="button"
                aria-pressed={id === current}
                onClick={() => {
                  applyTheme(id);
                  setCurrent(id);
                  setOpen(false);
                }}
                className={cn(
                  "grid grid-cols-[44px_1fr_18px] items-center gap-3 rounded-2xl border p-2 text-left",
                  id === current ? "border-accent bg-accent-soft" : "border-transparent hover:bg-muted",
                )}
              >
                <span className="size-11 rounded-xl" style={{ background: t.swatch }} />
                <span className="grid gap-0.5">
                  <b className="text-sm font-semibold">{t.name}</b>
                  <span className="text-xs text-muted-foreground">{t.tagline}</span>
                </span>
                <span className="font-bold text-accent">{id === current ? "✓" : ""}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
