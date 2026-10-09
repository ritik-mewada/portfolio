import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/content/site";

const links = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, icon: Mail },
  { label: "LinkedIn", value: "in/ritikmewada", href: site.socials.linkedin, icon: FaLinkedinIn },
  { label: "GitHub", value: `@${site.githubUsername}`, href: site.socials.github, icon: SiGithub },
];

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-28 sm:px-8">
      <SectionHeading
        index="06"
        eyebrow="Contact"
        title={
          <>
            Let&apos;s build something{" "}
            <span className="text-gradient">reliable.</span>
          </>
        }
        description="Whether it's a role, a project or just a question about testing IoT systems — my inbox is open."
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <Reveal className="space-y-3">
          {links.map(({ label, value, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-2xl glass p-5 transition-colors hover:border-accent/40"
            >
              <span className="grid size-10 place-items-center rounded-full bg-muted">
                <Icon className="size-4" />
              </span>
              <span>
                <span className="block text-xs text-muted-foreground">{label}</span>
                <span className="font-medium break-all">{value}</span>
              </span>
              <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ))}
          <p className="flex items-center gap-2 px-1 pt-2 text-sm text-muted-foreground">
            <MapPin className="size-4 text-accent" /> {site.location}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
