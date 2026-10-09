import { GraduationCap, MapPin } from "lucide-react";
import { Counter } from "@/components/counter";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { education, site } from "@/content/site";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-28 sm:px-8">
      <SectionHeading
        index="01"
        eyebrow="About"
        title={
          <>
            Developer by trade,{" "}
            <span className="text-gradient">tester by instinct.</span>
          </>
        }
      />

      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          {site.about.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p>{p}</p>
            </Reveal>
          ))}
          <Reveal delay={0.25}>
            <p className="flex items-center gap-2 pt-2 text-sm">
              <MapPin className="size-4 text-accent" /> Based in {site.location}
            </p>
          </Reveal>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {site.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <div className="h-full rounded-2xl glass p-5">
                  <p className="text-4xl font-semibold tracking-tight">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          {education.map((e, i) => (
            <Reveal key={e.school} delay={0.2 + i * 0.06}>
              <div className="flex gap-4 rounded-2xl glass p-5">
                <GraduationCap className="mt-0.5 size-5 shrink-0 text-accent" />
                <div>
                  <p className="font-medium">{e.credential}</p>
                  <p className="text-sm text-muted-foreground">
                    {e.school} · {e.period} · {e.note}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
