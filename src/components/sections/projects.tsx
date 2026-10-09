import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SiGithub } from "react-icons/si";
import { ProjectStatusBadge } from "@/components/project-status";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/spotlight-card";
import { TechIcon } from "@/components/tech-icon";
import { projects, site } from "@/content/site";
import { cn } from "@/lib/utils";

const featured = projects.filter((p) => p.featured);
const others = projects.filter((p) => !p.featured);
// Bento layout: wide, narrow / narrow, wide
const spans = ["md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-4"];

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-28 sm:px-8">
      <SectionHeading
        index="04"
        eyebrow="Projects"
        title="Things I've built on my own time"
        description="Most of my best work lives in private company repos. These are side projects I build to learn new tools and patterns — some finished, some still evolving."
      />

      <div className="grid gap-4 md:grid-cols-6">
        {featured.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.06} className={cn(spans[i % spans.length])}>
            <SpotlightCard className="h-full">
              <Link href={`/projects/${p.slug}`} className="relative flex h-full flex-col p-7">
                <div className="flex items-center justify-between gap-3">
                  <ProjectStatusBadge status={p.status} />
                  <span className="font-mono text-xs text-muted-foreground">{p.year}</span>
                </div>
                <h3 className="mt-8 text-2xl font-semibold tracking-tight">
                  {p.title}
                  <ArrowUpRight className="ml-1 inline size-5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </h3>
                <p className="mt-1 font-serif text-lg text-accent italic">{p.tagline}</p>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-8" aria-label="Technologies">
                  {p.stack.slice(0, 6).map((t) => (
                    <li key={t} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs">
                      <TechIcon name={t} className="size-3" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Link>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      {others.length > 0 && (
        <Reveal className="mt-16">
          <h3 className="mb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">More experiments</h3>
          <ul className="divide-y rounded-2xl border bg-card">
            {others.map((p) => (
              <li key={p.slug}>
                <Link href={`/projects/${p.slug}`} className="group flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-4 transition-colors hover:bg-muted/60">
                  <span className="font-medium">{p.title}</span>
                  <span className="text-sm text-muted-foreground">{p.tagline}</span>
                  <span className="ml-auto hidden font-mono text-xs text-muted-foreground sm:inline">{p.stack.slice(0, 3).join(" · ")}</span>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      <Reveal className="mt-10 text-center">
        <a href={site.socials.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <SiGithub className="size-4" /> Everything else is on GitHub <ArrowUpRight className="size-3.5" />
        </a>
      </Reveal>
    </section>
  );
}
