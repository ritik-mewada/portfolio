"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { QA_LENS_STATE, TOGGLE_QA_LENS } from "@/lib/nav";

// The lens is only downloaded the first time someone turns it on.
const QaLens = dynamic(() => import("@/components/qa-lens").then((m) => m.QaLens), { ssr: false });

export function QaLensLoader() {
  const [active, setActive] = useState(false);

  const set = useCallback((on: boolean) => {
    setActive(on);
    window.dispatchEvent(new CustomEvent(QA_LENS_STATE, { detail: on }));
  }, []);

  useEffect(() => {
    const toggle = () => setActive((a) => {
      window.dispatchEvent(new CustomEvent(QA_LENS_STATE, { detail: !a }));
      return !a;
    });
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
  }, []);

  return active ? <QaLens onClose={() => set(false)} /> : null;
}
