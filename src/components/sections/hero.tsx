"use client";

import { ArrowDown, ArrowUpRight, Copy, FileText, MapPin } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { toast } from "sonner";
import { ProfilePhoto } from "@/components/profile-photo";
import { experience, site } from "@/content/site";

const current = experience.find((e) => e.current);

function useTypewriter(words: readonly string[]) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(reduce ? words[0] : "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const word = words[index % words.length];
    const done = !deleting && text === word;
    const empty = deleting && text === "";
    const delay = done ? 1800 : empty ? 300 : deleting ? 35 : 70;
    const t = setTimeout(() => {
      if (done) setDeleting(true);
      else if (empty) {
        setDeleting(false);
        setIndex((i) => i + 1);
      } else setText(word.slice(0, text.length + (deleting ? -1 : 1)));
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, words, reduce]);

  return text;
}

const testLines = [
  { name: "hero › renders name and role", ms: 38 },
  { name: "experience › lists current role first", ms: 24 },
  { name: "projects › links resolve to GitHub", ms: 112 },
  { name: "contact › validates email input", ms: 57 },
  { name: "a11y › passes WCAG 2.1 AA checks", ms: 241 },
  { name: "perf › LCP under 1.5s on 4G", ms: 189 },
];

function TestRunnerCard({ className }: { className?: string }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= testLines.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 900 : 420);
    return () => clearTimeout(t);
  }, [shown]);
  const finished = shown >= testLines.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`overflow-hidden rounded-2xl border glass font-mono shadow-2xl shadow-black/10 ${className ?? ""}`}
      role="figure"
      aria-label="Example test run"
    >
      <div className="flex items-center gap-1.5 border-b px-4 py-3">
        <span className="size-2.5 rounded-full bg-red-400/80" />
        <span className="size-2.5 rounded-full bg-yellow-400/80" />
        <span className="size-2.5 rounded-full bg-green-400/80" />
        <span className="ml-3 text-muted-foreground">~/ritik — npx playwright test</span>
      </div>
      <div className="space-y-1 p-3.5">
        <p className="text-muted-foreground">Running {testLines.length} tests using 3 workers</p>
        {testLines.slice(0, shown).map((l) => (
          <motion.p key={l.name} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
            <span className="text-accent">✓</span>
            <span className="truncate">{l.name}</span>
            <span className="ml-auto text-muted-foreground">{l.ms}ms</span>
          </motion.p>
        ))}
        {finished ? (
          <p className="pt-2 text-accent">{testLines.length} passed · ready to ship</p>
        ) : (
          <span className="inline-block h-4 w-2 animate-blink bg-foreground/70 align-middle" />
        )}
      </div>
    </motion.div>
  );
}

export function Hero() {
  const role = useTypewriter(site.rotatingRoles);
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mx}px ${my}px, var(--accent-soft), transparent 70%)`;

  const copyEmail = () =>
    navigator.clipboard.writeText(site.email).then(
      () => toast.success("Email copied — talk soon!"),
      () => toast.error(site.email),
    );

  // CSS (not JS) entrance animation so hero text paints before hydration.
  const fade = (delay: number) => ({ style: { animationDelay: `${delay}s` } });

  return (
    <section
      id="top"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className="relative flex min-h-svh items-center overflow-hidden pt-28 pb-20"
    >
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.25fr_1fr] lg:pr-20 xl:pr-8">
        <div>
          <ProfilePhoto sizes="96px" className="animate-fade-up mb-6 size-24 rounded-3xl text-2xl ring-1 ring-border lg:hidden" />

          {current && (
            <a
              {...fade(0)}
              href="#experience"
              className="animate-fade-up mb-8 inline-flex items-center gap-2.5 rounded-full glass py-1.5 pr-4 pl-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="relative flex size-2 ml-1">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              Now: {current.role} at <span className="font-medium text-foreground">{current.company}</span>
            </a>
          )}

          <p {...fade(0.05)} className="animate-fade-up mb-3 font-mono text-sm text-muted-foreground">
            Hi, I&apos;m {site.name} —
          </p>
          <h1 {...fade(0.1)} className="animate-fade-up text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            I build web software,{" "}
            <span className="text-gradient">then make sure it holds up.</span>
          </h1>

          <p {...fade(0.2)} className="animate-fade-up mt-6 h-7 font-mono text-base text-foreground sm:text-lg" aria-label={site.rotatingRoles.join(", ")}>
            <span className="text-accent">&gt;</span> <span aria-hidden>{role}</span>
            <span aria-hidden className="ml-0.5 inline-block h-5 w-[2px] translate-y-1 animate-blink bg-accent" />
          </p>

          <p {...fade(0.25)} className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {site.summary}
          </p>

          <div {...fade(0.35)} className="animate-fade-up mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.03] active:scale-95"
            >
              View my work <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <FileText className="size-4" /> Resume
            </Link>
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Copy className="size-4" /> {site.email}
            </button>
          </div>

          <div {...fade(0.45)} className="animate-fade-up mt-7 flex flex-wrap items-center gap-x-5 text-muted-foreground">
            <span className="inline-flex items-center gap-2 text-sm">
              <MapPin className="size-4 text-accent" /> {site.location}
            </span>
            <a href={site.socials.github} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm transition-colors hover:text-foreground">
              <SiGithub className="size-4" /> GitHub <ArrowUpRight className="size-3" />
            </a>
            <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm transition-colors hover:text-foreground">
              <FaLinkedinIn className="size-4" /> LinkedIn <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>

        {/* Desktop: framed portrait with the test run overlapping its corner. */}
        <div className="relative hidden w-full max-w-[340px] justify-self-end pb-40 lg:block">
          <div {...fade(0.15)} className="animate-fade-up glass rounded-[32px] p-2.5">
            <ProfilePhoto priority sizes="340px" className="aspect-[4/5] w-full rounded-3xl text-6xl" />
          </div>
          <span className="glass absolute top-5 right-5 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium">
            <span className="size-2 rounded-full bg-green-500" /> {site.availability}
          </span>
          <TestRunnerCard className="absolute bottom-0 -left-12 w-[330px] text-[11.5px]" />
        </div>
      </div>
    </section>
  );
}
