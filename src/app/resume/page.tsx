import type { Metadata } from "next";
import { PrintButton } from "@/components/print-button";
import { education, experience, projects, site, skills } from "@/content/site";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${site.name} — ${site.role}.`,
  alternates: { canonical: "/resume" },
};

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 border-b pb-2 font-mono text-xs tracking-widest text-accent uppercase print:text-black">{children}</h2>;
}

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-24 sm:px-8 print:max-w-none print:p-0 print:text-[11px] print:text-black">
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">A printable, always-up-to-date version of my resume.</p>
        <PrintButton />
      </div>

      <div className="rounded-3xl glass p-8 sm:p-12 print:rounded-none print:border-0 print:bg-white print:p-0">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">{site.name}</h1>
          <p className="mt-1 text-lg text-muted-foreground print:text-black">{experience[0].role}</p>
          <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground print:text-black">
            <span>{site.location}</span>·<a href={`mailto:${site.email}`}>{site.email}</a>·
            <a href={site.socials.linkedin}>linkedin.com/in/ritikmewada</a>·<a href={site.socials.github}>github.com/{site.githubUsername}</a>
          </p>
        </header>

        <section className="mt-8">
          <Heading>Summary</Heading>
          <p className="text-sm leading-relaxed">{site.summary}</p>
        </section>

        <section className="mt-8">
          <Heading>Experience</Heading>
          <div className="space-y-6">
            {experience.map((job) => (
              <div key={job.company + job.start} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">
                    {job.role} · <span className="font-normal">{job.company}</span>
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground print:text-black">
                    {job.start} – {job.end}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground print:text-black">{job.location}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed marker:text-accent">
                  {job.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 break-inside-avoid">
          <Heading>Skills</Heading>
          <dl className="space-y-1.5 text-sm">
            {skills.map((g) => (
              <div key={g.title} className="flex flex-wrap gap-x-2">
                <dt className="font-semibold">{g.title}:</dt>
                <dd>{g.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-8 break-inside-avoid">
          <Heading>Selected projects</Heading>
          <ul className="space-y-2 text-sm">
            {projects
              .filter((p) => p.featured)
              .map((p) => (
                <li key={p.slug}>
                  <span className="font-semibold">{p.title}</span> — {p.tagline}.{" "}
                  <span className="text-muted-foreground print:text-black">{p.stack.slice(0, 5).join(", ")}</span>
                </li>
              ))}
          </ul>
        </section>

        <section className="mt-8 break-inside-avoid">
          <Heading>Education</Heading>
          <ul className="space-y-2 text-sm">
            {education.map((e) => (
              <li key={e.school} className="flex flex-wrap justify-between gap-2">
                <span>
                  <span className="font-semibold">{e.credential}</span> · {e.school}
                </span>
                <span className="font-mono text-xs text-muted-foreground print:text-black">
                  {e.period} · {e.note}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
