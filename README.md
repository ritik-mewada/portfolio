# Ritik Mewada — Portfolio

[![CI](https://github.com/ritik-mewada/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/ritik-mewada/portfolio/actions/workflows/ci.yml)

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
- **Contact form** with validation and automatic spam filtering (honeypot, time trap, content checks, rate limits). It sends email through Resend when `RESEND_API_KEY` is set and falls back to opening the visitor's email app.
- **SEO:** metadata, JSON-LD `Person` schema, sitemap, robots, generated Open Graph image and favicon, web manifest.
- **Accessibility:** skip link, keyboard navigation, `prefers-reduced-motion` respected, WCAG AA contrast in both themes.
- Vercel Analytics and Speed Insights, plus Umami for custom events (section views, project and résumé opens, contact form results).
- GitHub Actions CI: lint, typecheck, build and the Playwright test suite on every push and pull request.

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

## Tests

The Playwright suite in **`tests/`** runs against a production build, on desktop Chrome and a Pixel 7 phone:

- **`tests/unit/`**: the contact form's spam filter (link stuffing, SEO pitches, rate limits, duplicates).
- **`tests/e2e/home.spec.ts`**: hero, experience order, navbar and phone menu, skip link.
- **`tests/e2e/pages.spec.ts`**: every project page, a real 404 for unknown projects, the résumé on screen and in print.
- **`tests/e2e/contact.spec.ts`**: the form in the browser, and the API's spam filter end to end.
- **`tests/e2e/qa-lens.spec.ts`**: the QA Lens follows the pointer, toggles with Ctrl+L / Esc, and never duplicates ids.
- **`tests/e2e/a11y.spec.ts`**: axe WCAG 2.1 AA checks on every page type, in dark and light themes.

```bash
npx playwright install chromium   # once
npm run build
npm test                          # or: npm run test:ui
```

### Lighthouse

`npm run lighthouse` (after a build) audits `/`, `/resume` and a project page three times each with Lighthouse's mobile profile (slow 4G, 4× slower CPU) and fails if a limit is broken (warnings are reported but don't fail the build):

| Check | Limit |
| --- | --- |
| Largest Contentful Paint | ≤ 2.5 s |
| Cumulative Layout Shift | ≤ 0.1 |
| Accessibility score | ≥ 95 |
| Best Practices score | ≥ 90 |
| SEO score | ≥ 95 |
| Performance score | ≥ 90 (warning only, for now) |
| Total Blocking Time | ≤ 300 ms (warning only, for now) |

CI runs it after the Playwright suite and keeps the HTML reports as a build artifact. The limits live in `lighthouserc.json`.

Tests never send real email or analytics: the test server runs with `RESEND_API_KEY` and the Umami ID blanked.

Copy `.env.example` to `.env.local` and fill in values as needed (all optional). Never commit `.env.local`; it is already in `.gitignore`.

## Deploying to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import this repository.
2. Add environment variables from `.env.example` in Vercel → Project → Settings → Environment Variables. Keep keys there, not in the code.
3. Deploy. Every push to `main` redeploys, and every pull request gets a preview URL.
4. (Optional) Add a custom domain under **Project → Settings → Domains**, then update `NEXT_PUBLIC_SITE_URL`.

## Roadmap

Planned improvements are listed in [TODO.md](TODO.md).
