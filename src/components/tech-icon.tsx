import { techIconId, techIcons } from "@/lib/tech-icons";

export function hasTechIcon(name: string) {
  return name in techIcons;
}

// Icons come from one cached sprite (public/tech-icons.svg, built by `npm run icons`) instead of
// inline SVG paths, which made up most of the home page's HTML and its RSC payload.
export function TechIcon({ name, className }: { name: string; className?: string }) {
  if (!hasTechIcon(name)) return null;
  return (
    <svg aria-hidden className={className}>
      <use href={`/tech-icons.svg#${techIconId(name)}`} />
    </svg>
  );
}
