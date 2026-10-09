import { ArrowLeft, ArrowRight, ArrowUpRight, Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiGithub } from "react-icons/si";
import { ProjectStatusBadge } from "@/components/project-status";
import { Reveal } from "@/components/reveal";
import { TechIcon } from "@/components/tech-icon";
import { getProject, projects } from "@/content/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { title: `${project.title} — ${project.tagline}`, description: project.description },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="mx-auto max-w-4xl px-5 pt-36 pb-24 sm:px-8">
      <Reveal>
        <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> All projects
        </Link>
      </Reveal>

      <Reveal delay={0.05} className="mt-10">
        <div className="flex flex-wrap items-center gap-3">
          <ProjectStatusBadge status={project.status} />
          <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">{project.title}</h1>
        <p className="mt-3 font-serif text-2xl text-accent italic">{project.tagline}</p>
        <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{project.description}</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-3">
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground">
            Live demo <ArrowUpRight className="size-4" />
          </a>
        )}
        {project.repos.map((r) => (
          <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border bg-card px-5 py-2.5 text-sm transition-colors hover:bg-muted">
            <SiGithub className="size-4" /> {r.label}
          </a>
        ))}
      </Reveal>

      <div className="mt-16 grid gap-10 md:grid-cols-[1fr_14rem]">
        <Reveal>
          <h2 className="font-mono text-xs tracking-widest text-accent uppercase">What it does</h2>
          <ul className="mt-5 space-y-4">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 leading-relaxed">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-2xl border bg-card p-6">
            <h2 className="flex items-center gap-2 font-medium">
              <Lightbulb className="size-4 text-accent" /> What I learned
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{project.learned}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-mono text-xs tracking-widest text-accent uppercase">Stack</h2>
          <ul className="mt-5 space-y-2.5">
            {project.stack.map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-sm">
                <TechIcon name={t} className="size-4 text-muted-foreground" />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal className="mt-24 border-t pt-10">
        <Link href={`/projects/${next.slug}`} className="group flex items-center justify-between gap-4">
          <span>
            <span className="block text-sm text-muted-foreground">Next project</span>
            <span className="text-2xl font-semibold tracking-tight group-hover:text-accent">{next.title}</span>
          </span>
          <ArrowRight className="size-6 transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </article>
  );
}
