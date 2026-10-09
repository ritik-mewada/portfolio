import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.role}`,
    short_name: site.shortName,
    description: site.summary,
    start_url: "/",
    display: "standalone",
    background_color: "#121318",
    theme_color: "#121318",
    icons: [{ src: "/icon", sizes: "64x64", type: "image/png" }],
  };
}
