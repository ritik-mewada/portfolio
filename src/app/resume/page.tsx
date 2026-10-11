import type { Metadata } from "next";
import { PrintButton } from "@/components/print-button";
import { education, experience, projects, site, skills } from "@/content/site";
import "./resume.css";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${site.name} — ${site.role}.`,
  alternates: { canonical: "/resume" },
};

const stripProtocol = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 border-b pb-2 font-mono text-xs tracking-widest text-accent uppercase">{children}</h2>;
}

// On-screen view in the site's glass style. Hidden when printing.
function ScreenResume() {
  return (
    <div className="no-print mx-auto max-w-3xl px-5 pt-32 pb-24 sm:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">A printable, always-up-to-date version of my resume.</p>
        <PrintButton />
      </div>

      <div className="rounded-3xl glass p-8 sm:p-12">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">{site.name}</h1>
          <p className="mt-1 text-lg text-muted-foreground">{experience[0].role}</p>
          <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
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
              <div key={job.company + job.start}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">
                    {job.role} · <span className="font-normal">{job.company}</span>
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {job.start} – {job.end}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{job.location}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed marker:text-accent">
                  {job.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
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

        <section className="mt-8">
          <Heading>Selected projects</Heading>
          <ul className="space-y-2 text-sm">
            {projects
              .filter((p) => p.featured)
              .map((p) => (
                <li key={p.slug}>
                  <span className="font-semibold">{p.title}</span> — {p.tagline}.{" "}
                  <span className="text-muted-foreground">{p.stack.slice(0, 5).join(", ")}</span>
                </li>
              ))}
          </ul>
        </section>

        <section className="mt-8">
          <Heading>Education</Heading>
          <ul className="space-y-2 text-sm">
            {education.map((e) => (
              <li key={e.school} className="flex flex-wrap justify-between gap-2">
                <span>
                  <span className="font-semibold">{e.credential}</span> · {e.school}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="cv-section">
      <h2 className="cv-section-title">{title}</h2>
      {children}
    </section>
  );
}

export default function ResumePage() {
  return (
    <>
      <ScreenResume />

      {/* Print-only: what "Save as PDF" produces. */}
      <article className="cv-sheet">
        <header className="cv-header">
          <h1 className="cv-name">{site.name}</h1>
          <p className="cv-contact">
            <span>{site.location}</span>
            <span>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </span>
            <span>
              <a href={site.socials.linkedin}>{stripProtocol(site.socials.linkedin)}</a>
            </span>
            <span>
              <a href={site.socials.github}>{stripProtocol(site.socials.github)}</a>
            </span>
            <span>
              <a href={site.url}>{stripProtocol(site.url)}</a>
            </span>
          </p>
        </header>

        <Section title="Summary">
          <p className="cv-summary">{site.summary}</p>
        </Section>

        <Section title="Experience">
          {experience.map((job) => (
            <div key={job.company + job.start} className="cv-entry">
              <div className="cv-row">
                <span className="cv-strong">{job.company}</span>
                <span>
                  {job.start} – {job.end}
                </span>
              </div>
              <div className="cv-row cv-sub">
                <span>{job.role}</span>
                <span>{job.location}</span>
              </div>
              <ul className="cv-bullets">
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        <Section title="Projects">
          {projects
            .filter((p) => p.featured)
            .map((p) => (
              <div key={p.slug} className="cv-entry">
                <div className="cv-row">
                  <span>
                    <span className="cv-strong">{p.title}</span> |{" "}
                    <em className="cv-sub">{p.stack.slice(0, 5).join(", ")}</em>
                  </span>
                  <span>{p.year}</span>
                </div>
                <ul className="cv-bullets">
                  {p.highlights.slice(0, 2).map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
        </Section>

        <Section title="Technical Skills">
          <dl className="cv-skills">
            {skills.map((g) => (
              <div key={g.title}>
                <dt>{g.title}: </dt>
                <dd>{g.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Education">
          {education.map((e) => (
            <div key={e.school} className="cv-entry">
              <div className="cv-row">
                <span className="cv-strong">{e.school}</span>
                <span>{e.location}</span>
              </div>
              <div className="cv-row cv-sub">
                <span>
                  {e.credential} · {e.note}
                </span>
                <span>{e.period}</span>
              </div>
            </div>
          ))}
        </Section>
      </article>
    </>
  );
}
