import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Rendered once at build time: the site is exported as static files.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
