"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { OPEN_COMMAND_MENU } from "@/lib/nav";

// The palette (cmdk + its dialog) is only downloaded the first time it's opened.
const CommandMenu = dynamic(() => import("@/components/command-menu").then((m) => m.CommandMenu), { ssr: false });

export function CommandMenuLoader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setLoaded(true);
      }
    };
    const onOpen = () => setLoaded(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_MENU, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_MENU, onOpen);
    };
  }, [loaded]);

  return loaded ? <CommandMenu defaultOpen /> : null;
}
