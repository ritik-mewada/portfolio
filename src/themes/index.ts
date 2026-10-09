// Theme registry.
//
// A theme = design tokens (CSS variables) + feature flags. Content lives in
// src/content/site.ts and is shared by every theme.
//
// To add a theme:
//   1. Create src/themes/<id>.css with tokens scoped to html[data-site-theme="<id>"]
//      (see classic.css) and import it in src/app/globals.css.
//   2. Add an entry below.
//   3. Uncomment <ThemePicker /> in src/components/navbar.tsx to let visitors switch.
//
// The visitor theme picker is disabled for now; only DEFAULT_THEME is used.

export type ThemeId = "liquid-glass" | "classic";

export type Theme = {
  name: string;
  tagline: string;
  /** CSS background used for the picker swatch. */
  swatch: string;
  features: { wallpaper: boolean; qaLens: boolean; pageNavigation: boolean };
};

export const THEMES: Record<ThemeId, Theme> = {
  "liquid-glass": {
    name: "Liquid Glass",
    tagline: "Frosted glass, QA Lens and smart navigation",
    swatch: "linear-gradient(135deg,#ffb4a2,#a5b4fc 50%,#7dd3fc)",
    features: { wallpaper: true, qaLens: true, pageNavigation: true },
  },
  classic: {
    name: "Classic",
    tagline: "The original look: lime accent and serif italics",
    swatch: "linear-gradient(135deg,#14151b 0 55%,#c5f04a 55% 100%)",
    features: { wallpaper: false, qaLens: true, pageNavigation: true },
  },
};

export const DEFAULT_THEME: ThemeId = "liquid-glass";
