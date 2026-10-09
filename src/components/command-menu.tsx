"use client";

import { Command } from "cmdk";
import { useLenis } from "lenis/react";
import {
  ArrowUpRight,
  Briefcase,
  Copy,
  FileText,
  FolderGit2,
  Home,
  Mail,
  Monitor,
  Moon,
  Sparkles,
  Sun,
  User,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { toast } from "sonner";
import { projects, site } from "@/content/site";
import { OPEN_COMMAND_MENU } from "@/lib/nav";

const sectionIcons = {
  about: User,
  experience: Briefcase,
  skills: Sparkles,
  projects: FolderGit2,
  contact: Mail,
} as const;

export function CommandMenu({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const { setTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_MENU, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_MENU, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  const goToSection = (id: string) => {
    if (pathname === "/") lenis?.scrollTo(`#${id}`, { offset: -80 });
    else router.push(`/#${id}`);
  };

  const itemClass =
    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground data-[selected=true]:bg-muted data-[selected=true]:text-foreground";

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command menu"
      overlayClassName="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
      contentClassName="fixed top-[15vh] left-1/2 z-[80] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border bg-card shadow-2xl"
    >
      <Command.Input
        placeholder="Type a command or search…"
        className="w-full border-b bg-transparent px-4 py-4 text-sm outline-none placeholder:text-muted-foreground"
      />
      <Command.List data-lenis-prevent className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
        <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
          No results found.
        </Command.Empty>

        <Command.Group heading="Navigate" className="cmdk-group">
          <Command.Item className={itemClass} onSelect={() => run(() => (pathname === "/" ? lenis?.scrollTo(0) : router.push("/")))}>
            <Home className="size-4" /> Home
          </Command.Item>
          {(Object.keys(sectionIcons) as (keyof typeof sectionIcons)[]).map((id) => {
            const Icon = sectionIcons[id];
            return (
              <Command.Item key={id} className={itemClass} onSelect={() => run(() => goToSection(id))}>
                <Icon className="size-4" /> {id[0].toUpperCase() + id.slice(1)}
              </Command.Item>
            );
          })}
          <Command.Item className={itemClass} onSelect={() => run(() => router.push("/resume"))}>
            <FileText className="size-4" /> Resume
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Projects" className="cmdk-group">
          {projects.map((p) => (
            <Command.Item
              key={p.slug}
              value={`project ${p.title} ${p.tagline}`}
              className={itemClass}
              onSelect={() => run(() => router.push(`/projects/${p.slug}`))}
            >
              <FolderGit2 className="size-4" /> {p.title}
              <span className="ml-auto truncate text-xs opacity-60">{p.tagline}</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Actions" className="cmdk-group">
          <Command.Item
            className={itemClass}
            onSelect={() =>
              run(() => {
                navigator.clipboard.writeText(site.email).then(
                  () => toast.success("Email copied to clipboard"),
                  () => toast.error("Couldn't copy — " + site.email),
                );
              })
            }
          >
            <Copy className="size-4" /> Copy email address
          </Command.Item>
          <Command.Item className={itemClass} onSelect={() => run(() => window.open(site.socials.github, "_blank"))}>
            <SiGithub className="size-4" /> GitHub <ArrowUpRight className="ml-auto size-3.5" />
          </Command.Item>
          <Command.Item className={itemClass} onSelect={() => run(() => window.open(site.socials.linkedin, "_blank"))}>
            <FaLinkedinIn className="size-4" /> LinkedIn <ArrowUpRight className="ml-auto size-3.5" />
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Theme" className="cmdk-group">
          <Command.Item className={itemClass} onSelect={() => run(() => setTheme("light"))}>
            <Sun className="size-4" /> Light
          </Command.Item>
          <Command.Item className={itemClass} onSelect={() => run(() => setTheme("dark"))}>
            <Moon className="size-4" /> Dark
          </Command.Item>
          <Command.Item className={itemClass} onSelect={() => run(() => setTheme("system"))}>
            <Monitor className="size-4" /> System
          </Command.Item>
        </Command.Group>
      </Command.List>
      <div className="flex items-center justify-between border-t px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
        <span>↑↓ to navigate · ↵ to select</span>
        <span>esc to close</span>
      </div>
    </Command.Dialog>
  );
}
