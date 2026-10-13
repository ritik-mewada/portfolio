import type { NextConfig } from "next";
import { basePath } from "./src/lib/base-path";

// Built as a static site for GitHub Pages. The deploy workflow sets NEXT_PUBLIC_BASE_PATH when the
// site is served from a sub-path (a project site like user.github.io/portfolio); it is empty at a root URL.
const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Each page is written as dir/index.html, which GitHub Pages serves at /dir/ (and redirects /dir to it).
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
