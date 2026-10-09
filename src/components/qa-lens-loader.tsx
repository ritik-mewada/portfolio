"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { QA_LENS_STATE, TOGGLE_QA_LENS } from "@/lib/nav";

const QaLens = dynamic(() => import("@/components/qa-lens").then((m) => m.QaLens), { ssr: false });

const STORAGE_KEY = "qa-lens";

/**
 * The QA Lens is on by default for mouse users (it stays hidden until the
 * pointer moves, so it costs nothing for bots or keyboard users). On touch
 * screens it starts off, because a lens in the middle of a phone screen hides
 * content. Turning it off is remembered on that device.
 */
export function QaLensLoader() {
  const [active, setActive] = useState(false);

  const set = useCallback((on: boolean) => {
    setActive(on);
    window.dispatchEvent(new CustomEvent(QA_LENS_STATE, { detail: on }));
    try {
      localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
    } catch {
      // Storage blocked: the choice just won't be remembered.
    }
  }, []);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      // Ignore: fall back to the default.
    }
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!(saved ? saved === "on" : fine)) return;
    // Switch on once the browser is idle, so the lens never competes with the first paint.
    const start = () => {
      setActive(true);
      window.dispatchEvent(new CustomEvent(QA_LENS_STATE, { detail: true }));
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 500);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const toggle = () => set(!active);
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "l" && (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener(TOGGLE_QA_LENS, toggle);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(TOGGLE_QA_LENS, toggle);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, set]);

  const close = useCallback(() => set(false), [set]);

  return active ? <QaLens onClose={close} /> : null;
}
