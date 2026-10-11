import type { Metadata } from "next";
import localFont from "next/font/local";
import { PrintButton } from "@/components/print-button";
import { education, experience, projects, site, skills } from "@/content/site";
import "./resume.css";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${site.name} — ${site.role}.`,
  alternates: { canonical: "/resume" },
};

// Computer Modern, the LaTeX default — so the PDF reads like the Overleaf original.
const cmuSerif = localFont({
  src: [
    { path: "./fonts/cmu-serif-500-roman.woff2", weight: "400", style: "normal" },
    { path: "./fonts/cmu-serif-500-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/cmu-serif-700-roman.woff2", weight: "700", style: "normal" },
    { path: "./fonts/cmu-serif-700-italic.woff2", weight: "700", style: "italic" },
  ],
  display: "swap",
});

// Computer Modern draws ASCII "~" as a raised accent; use the math tilde instead.
const tidy = (text: string) => text.replace(/~/g, "∼");

const stripProtocol = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

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
    <div className="mx-auto max-w-4xl px-4 pt-32 pb-24 sm:px-8 print:max-w-none print:p-0">
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">A printable, always-up-to-date version of my resume.</p>
        <PrintButton />
      </div>

      <article className={`cv-sheet ${cmuSerif.className}`}>
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
                  <li key={h}>{tidy(h)}</li>
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
                    <li key={h}>{tidy(h)}</li>
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
    </div>
  );
}
