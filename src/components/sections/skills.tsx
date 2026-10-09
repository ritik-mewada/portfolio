import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { hasTechIcon, TechIcon } from "@/components/tech-icon";
import { skills } from "@/content/site";

const marqueeItems = [...new Set(skills.flatMap((g) => g.items))].filter(hasTechIcon);

function Marquee({ items, reverse }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <ul
        className="flex w-max shrink-0 animate-marquee gap-3 pr-3 group-hover:[animation-play-state:paused]"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {[...items, ...items].map((name, i) => (
          <li
            key={name + i}
            aria-hidden={i >= items.length}
            className="flex items-center gap-2.5 rounded-full glass-lite px-4 py-2 text-sm whitespace-nowrap"
          >
            <TechIcon name={name} className="size-4 text-muted-foreground" />
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Skills() {
  const half = Math.ceil(marqueeItems.length / 2);
  return (
    <section id="skills" className="scroll-mt-24 py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="03"
          eyebrow="Toolbox"
          title="The stack I reach for"
          description="Comfortable across the whole lifecycle — designing the UI, writing the API, shipping the container and proving it all works."
        />
      </div>

      <div className="space-y-3">
        <Marquee items={marqueeItems.slice(0, half)} />
        <Marquee items={marqueeItems.slice(half)} reverse />
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {skills.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.05}>
            <div className="h-full rounded-2xl glass p-6">
              <h3 className="font-mono text-xs tracking-widest text-accent uppercase">{group.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="rounded-md bg-muted px-2.5 py-1 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
