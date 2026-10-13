import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { basePath } from "@/lib/base-path";

// Rendered once at build time: the site is exported as static files.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.role}`,
    short_name: site.shortName,
    description: site.summary,
    start_url: `${basePath}/`,
    display: "standalone",
    background_color: "#f5f7fb",
    theme_color: "#0071e3",
    icons: [{ src: `${basePath}/icon.png`, sizes: "64x64", type: "image/png" }],
  };
}
