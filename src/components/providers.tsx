"use client";

import { ThemeProvider } from "next-themes";
import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -80 } }}>
          {children}
        </ReactLenis>
      </MotionConfig>
      <Toaster position="bottom-center" theme="system" richColors closeButton />
    </ThemeProvider>
  );
}
