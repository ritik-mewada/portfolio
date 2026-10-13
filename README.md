# Ritik Mewada — Portfolio

[![CI](https://github.com/ritik-mewada/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/ritik-mewada/portfolio/actions/workflows/ci.yml)

Personal portfolio of Ritik Mewada, Quality Assurance Engineer. Live at **[ritik-mewada.vercel.app](https://ritik-mewada.vercel.app)**.

Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4 and Motion.

## Editing content

All content (bio, experience, skills, projects, links) lives in **`src/content/site.ts`**. The home page, project pages, résumé and sitemap update from it.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
```

Copy `.env.example` to `.env.local` for optional keys (contact form email, analytics). Never commit `.env.local`.

## Tests

```bash
npx playwright install chromium   # once
npm run build
npm test                          # Playwright: unit, end-to-end and accessibility tests
npm run lighthouse                # speed, accessibility and SEO limits (see lighthouserc.json)
```

CI runs lint, typecheck, build, the Playwright suite and Lighthouse on every push and pull request.

## Deploying

Import the repository at [vercel.com/new](https://vercel.com/new) and add the variables from `.env.example` under **Settings → Environment Variables**. Every push to `main` redeploys.
