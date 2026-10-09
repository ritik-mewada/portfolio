import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { experience } from "@/content/site";
import { cn } from "@/lib/utils";

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-28 sm:px-8">
      <SectionHeading
        index="02"
        eyebrow="Experience"
        title="Where I've worked"
        description="From full-stack product teams to quality engineering for industrial IoT."
      />

      <ol className="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-border md:before:left-[calc(12rem+7px)]">
        {experience.map((job, i) => (
          <li key={job.company + job.start} className="relative md:grid md:grid-cols-[12rem_1fr] md:gap-8">
            <Reveal delay={0.05} className="mb-3 pl-8 md:mb-0 md:pt-6 md:pl-0">
              <p className="font-mono text-xs text-muted-foreground md:text-right md:pr-8">
                {job.start} — {job.end}
              </p>
            </Reveal>

            <span
              aria-hidden
              className={cn(
                "absolute top-1 left-0 size-[15px] rounded-full border-2 bg-background md:top-7 md:left-[12rem]",
                job.current ? "border-accent shadow-[0_0_0_6px_var(--accent-soft)]" : "border-border",
              )}
            />

            <Reveal delay={0.1 + i * 0.02} className="pl-8 md:pl-8">
              <article className="group rounded-2xl glass p-6 transition-colors hover:border-accent/40">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">{job.role}</h3>
                    <p className="text-muted-foreground">
                      {job.url ? (
                        <a href={job.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-foreground hover:text-accent">
                          {job.company} <ArrowUpRight className="size-3.5" />
                        </a>
                      ) : (
                        <span className="font-medium text-foreground">{job.company}</span>
                      )}{" "}
                      · {job.location}
                    </p>
                  </div>
                  {job.current && (
                    <span className="rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[11px] text-accent">Current</span>
                  )}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{job.summary}</p>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
                  {job.stack.map((t) => (
                    <li key={t} className="rounded-full border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
