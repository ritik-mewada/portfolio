import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.role}`,
    short_name: site.shortName,
    description: site.summary,
    start_url: "/",
    display: "standalone",
    background_color: "#f5f7fb",
    theme_color: "#0071e3",
    icons: [{ src: "/icon", sizes: "64x64", type: "image/png" }],
  };
}
