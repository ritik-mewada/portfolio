import { site } from "@/content/site";

// Built by src/app/opengraph-image.png/route.tsx. Pages that set their own openGraph pass it again,
// since a page's openGraph replaces the layout's instead of merging with it.
export const ogImage = { url: "/opengraph-image.png", width: 1200, height: 630, alt: `${site.name} — ${site.role}` };
