# Ritik Mewada — Portfolio

Personal portfolio built with **Next.js 16 (App Router, Cache Components)**, **React 19**, **TypeScript**, **Tailwind CSS v4** and **Motion**.

## Features

- Animated hero with typewriter roles, cursor spotlight and a live "test runner" card
- Experience timeline, skills marquee, bento project grid with 3D tilt cards
- Project case-study pages (`/projects/[slug]`) — statically generated
- Printable resume page (`/resume`) that is always in sync with the site content — "Save as PDF" in one click
- Live GitHub activity (repos, languages, recent work) cached and refreshed hourly
- ⌘K / Ctrl+K command palette (navigation, projects, copy email, theme)
- Dark / light / system theme, smooth scrolling (Lenis), scroll progress bar
- Contact form with validation + spam honeypot (Resend, with mailto fallback)
- SEO: metadata, JSON-LD `Person` schema, sitemap, robots, auto-generated Open Graph image and favicon, web manifest
- Accessible: skip link, keyboard navigation, `prefers-reduced-motion` respected
- Vercel Analytics + Speed Insights, GitHub Actions CI

## Editing content

Everything — bio, experience, skills, projects, education, links — lives in **`src/content/site.ts`**.
Edit that file and the home page, project pages, resume, command menu, sitemap and OG image all update.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build
```

Copy `.env.example` to `.env.local` and fill in values as needed (all optional).

## Deploying to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import this repository.
2. Add environment variables from `.env.example` (at minimum `NEXT_PUBLIC_SITE_URL` once you know your domain).
3. Deploy. Every push to the default branch redeploys; every PR gets a preview URL.
4. (Optional) Add a custom domain under **Project → Settings → Domains**, then update `NEXT_PUBLIC_SITE_URL`.
