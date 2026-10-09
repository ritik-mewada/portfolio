"use client";

import { Command as CommandIcon, Menu, ScanSearch, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
// Visitor theme picker: disabled for now (see src/themes/index.ts).
// import { ThemePicker } from "@/components/theme-picker";
import { site } from "@/content/site";
import { navItems, OPEN_COMMAND_MENU, QA_LENS_STATE, TOGGLE_QA_LENS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lensOn, setLensOn] = useState(false);

  useEffect(() => {
    const onState = (e: Event) => setLensOn((e as CustomEvent<boolean>).detail);
    window.addEventListener(QA_LENS_STATE, onState);
    return () => window.removeEventListener(QA_LENS_STATE, onState);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of navItems) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [isHome]);

  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav
        aria-label="Main"
        className="glass mx-auto flex max-w-5xl items-center justify-between rounded-full px-3 py-2"
      >
        <Link href="/" className="flex items-center gap-2 pl-2 font-semibold tracking-tight" onClick={() => setMobileOpen(false)}>
          <span className="grid size-7 place-items-center rounded-full bg-accent font-mono text-[11px] text-accent-foreground">
            {site.initials}
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map(({ id, label }) => (
            <li key={id}>
              <a
                href={href(id)}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-sm transition-colors",
                  active === id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active === id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-muted" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
                )}
                {label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/resume"
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors",
                pathname === "/resume" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              Resume
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_MENU))}
            className="hidden items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground sm:flex"
            aria-label="Open command menu"
          >
            <CommandIcon className="size-3" /> K
          </button>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(TOGGLE_QA_LENS))}
            aria-pressed={lensOn}
            aria-label="QA Lens: inspect this page"
            title="QA Lens (Ctrl+L / ⌘L)"
            className={cn(
              "grid size-9 place-items-center rounded-full transition-colors",
              lensOn ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <ScanSearch className="size-4" />
          </button>
          {/* <ThemePicker /> */}
          <ThemeToggle />
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto mt-2 max-w-5xl rounded-3xl glass p-3 md:hidden"
          >
            <ul className="grid gap-1">
              {navItems.map(({ id, label }) => (
                <li key={id}>
                  <a href={href(id)} onClick={() => setMobileOpen(false)} className="block rounded-2xl px-4 py-3 text-lg hover:bg-muted">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/resume" onClick={() => setMobileOpen(false)} className="block rounded-2xl px-4 py-3 text-lg hover:bg-muted">
                  Resume
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
