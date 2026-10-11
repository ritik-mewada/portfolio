"use client";

import { Download } from "lucide-react";
import { site } from "@/content/site";

export function PrintButton() {
  const print = () => {
    // Browsers name the saved PDF after the document title.
    const title = document.title;
    document.title = `${site.name.replace(/\s+/g, "_")}_Resume`;
    window.print();
    document.title = title;
  };

  return (
    <button
      type="button"
      onClick={print}
      className="no-print inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.03]"
    >
      <Download className="size-4" /> Save as PDF
    </button>
  );
}
