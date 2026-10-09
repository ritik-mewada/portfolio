# Ritik Mewada — Portfolio

Personal portfolio of Ritik Mewada, Quality Assurance Engineer. Live at **[ritik-mewada.vercel.app](https://ritik-mewada.vercel.app)**.

Built with **Next.js 16 (App Router, Cache Components)**, **React 19**, **TypeScript**, **Tailwind CSS v4** and **Motion**.

## Features

- **Liquid Glass design:** frosted-glass surfaces over a slowly drifting colour background. Dark mode by default, with light and system modes.
- **QA Lens:** a magnifier that follows the mouse and shows the page the way a tester inspects it: element outlines, sizes, heading styles and accessibility labels. It's on by default for mouse users and off on touch screens. Toggle it with ⌘L / Ctrl+L or the navbar button; Esc turns it off and the choice is remembered.
- **Page navigation:** drag empty space to scroll, a section rail on the right edge, J / K for next and previous section, and 1–7 to jump to a section.
- **⌘K / Ctrl+K command palette:** navigation, projects, copy email, theme and QA Lens.
- **Sections:** animated hero with typewriter roles and a live "test runner" card, experience timeline, skills marquee, project cards with 3D tilt, and contact.
- **Project case-study pages** (`/projects/[slug]`), statically generated.
- **Printable resume page** (`/resume`) that always matches the site content.
- **Live GitHub activity** (repos, languages, recent work), cached and refreshed hourly.
- **Contact form** with validation and a spam honeypot. It sends email through Resend when `RESEND_API_KEY` is set and falls back to opening the visitor's email app.
- **SEO:** metadata, JSON-LD `Person` schema, sitemap, robots, generated Open Graph image and favicon, web manifest.
- **Accessibility:** skip link, keyboard navigation, `prefers-reduced-motion` respected, WCAG AA contrast in both themes.
- Vercel Analytics and Speed Insights, plus GitHub Actions CI (lint, typecheck, build).

## Editing content

Everything (bio, experience, skills, projects, education, links) lives in **`src/content/site.ts`**.
Edit that file and the home page, project pages, resume, command menu, sitemap and Open Graph image all update.

## Themes

Themes are design tokens plus feature flags, registered in **`src/themes/index.ts`**; the file explains how to add one. Liquid Glass is the only active theme. The visitor theme picker and the Classic theme are built but switched off for now.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build
```

Copy `.env.example` to `.env.local` and fill in values as needed (all optional). Never commit `.env.local`; it is already in `.gitignore`.

## Deploying to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import this repository.
2. Add environment variables from `.env.example` in Vercel → Project → Settings → Environment Variables. Keep keys there, not in the code.
3. Deploy. Every push to `main` redeploys, and every pull request gets a preview URL.
4. (Optional) Add a custom domain under **Project → Settings → Domains**, then update `NEXT_PUBLIC_SITE_URL`.

## Roadmap

Planned improvements are listed in [TODO.md](TODO.md).
