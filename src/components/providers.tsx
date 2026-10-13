"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { Toaster } from "sonner";

// Providers here wrap the page, so none may change a context value after mount. The page's
// JS chunk often arrives after the layout has hydrated, and a context update above a page that
// is still hydrating makes React drop its server HTML and render it again: the hero repaints
// and LCP jumps from ~1.8 s to ~3.8 s.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
      {/* Without children, Lenis registers as the root instance and useLenis() finds it anywhere. */}
      <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -80 } }} />
      <Toaster position="bottom-center" theme="system" richColors closeButton />
    </MotionConfig>
  );
}

// next-themes updates its context on mount (it reads the system theme in an effect),
// so it wraps only the components that use the theme, never the page.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
