import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="no-print border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:px-8">
        <p>
          Designed &amp; built by {site.name} · Next.js, Tailwind CSS &amp; Motion
        </p>
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-xs sm:inline">
            Press <kbd className="rounded border px-1.5 py-0.5">⌘K</kbd> to explore
          </span>
          <a href={site.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-foreground">
            <SiGithub className="size-4" />
          </a>
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-foreground">
            <FaLinkedinIn className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
