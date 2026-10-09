import { ArrowUpRight, BookMarked, Users } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/content/site";
import { getGitHubSummary } from "@/lib/github";

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Kotlin: "#a97bff",
  HTML: "#e34c26",
  CSS: "#663399",
  Python: "#3572a5",
};

const monthYear = new Intl.DateTimeFormat("en-CA", { month: "short", year: "numeric", timeZone: "UTC" });

export async function GitHubActivity() {
  const data = await getGitHubSummary(site.githubUsername);
  if (!data) return null;

  const total = data.languages.reduce((n, l) => n + l.count, 0) || 1;

  return (
    <section id="github" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-28 sm:px-8">
      <SectionHeading index="05" eyebrow="Open source" title="Recently on GitHub" description="Pulled live from the GitHub API and refreshed every few hours." />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <div className="flex h-full flex-col rounded-3xl glass p-7">
            <a href={site.socials.github} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3">
              <SiGithub className="size-8" />
              <span>
                <span className="block font-semibold">@{site.githubUsername}</span>
                <span className="text-sm text-muted-foreground group-hover:text-foreground">View profile ↗</span>
              </span>
            </a>
            <dl className="mt-8 grid grid-cols-2 gap-4">
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><BookMarked className="size-3.5" /> Public repos</dt>
                <dd className="mt-1 text-3xl font-semibold">{data.publicRepos}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><Users className="size-3.5" /> Followers</dt>
                <dd className="mt-1 text-3xl font-semibold">{data.followers}</dd>
              </div>
            </dl>
            <div className="mt-auto pt-8">
              <p className="mb-3 text-xs text-muted-foreground">Languages across repos</p>
              <div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
                {data.languages.map((l) => (
                  <span key={l.name} style={{ width: `${(l.count / total) * 100}%`, background: languageColors[l.name] ?? "var(--muted-foreground)" }} />
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                {data.languages.map((l) => (
                  <li key={l.name} className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full" style={{ background: languageColors[l.name] ?? "var(--muted-foreground)" }} />
                    {l.name} <span className="opacity-60">{Math.round((l.count / total) * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {data.recent.map((r, i) => (
            <Reveal key={r.name} delay={0.05 * i}>
              <a href={r.url} target="_blank" rel="noreferrer" className="group flex h-full flex-col rounded-3xl glass p-6 transition-colors hover:border-accent/40">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-mono text-sm font-medium break-all">{r.name}</p>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                {r.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>}
                <div className="mt-auto flex items-center justify-between pt-6 text-xs text-muted-foreground">
                  {r.language ? (
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full" style={{ background: languageColors[r.language] ?? "var(--muted-foreground)" }} />
                      {r.language}
                    </span>
                  ) : <span />}
                  <span>Updated {monthYear.format(new Date(r.pushedAt))}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
