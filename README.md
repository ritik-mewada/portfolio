# Ritik Mewada — Portfolio

[![CI](https://github.com/ritik-mewada/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/ritik-mewada/portfolio/actions/workflows/ci.yml)

Personal portfolio of Ritik Mewada, Quality Assurance Engineer. Live at **[ritik-mewada.github.io](https://ritik-mewada.github.io)**.

Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4 and Motion, and exported as a static site for GitHub Pages.

## Editing content

All content (bio, experience, skills, projects, links) lives in **`src/content/site.ts`**. The home page, project pages, résumé and sitemap update from it.

Tech logos are mapped in `src/lib/tech-icons.ts`. After adding or changing one, run `npm run icons` to rebuild `public/tech-icons.svg`.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
```

Copy `.env.example` to `.env.local` for optional keys (contact form email, analytics). Never commit `.env.local`.

## Tests

```bash
npx playwright install chromium   # once
npm run build                     # static site in out/
npm test                          # Playwright: unit, end-to-end and accessibility tests
npm run lighthouse                # speed, accessibility and SEO limits (see lighthouserc.json)
```

CI runs lint, typecheck, build, the Playwright suite and Lighthouse on every push and pull request.

## Deploying

The site deploys to GitHub Pages from `.github/workflows/deploy.yml` after CI passes on each push to `main`, and rebuilds daily to refresh the GitHub section. One-time setup:

1. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.
2. For the root URL `https://ritik-mewada.github.io`, the repository must be named `ritik-mewada.github.io`. Under any other name it is served at `https://ritik-mewada.github.io/<repo>/`; the workflow picks up the sub-path on its own.
3. Optional, under **Settings → Secrets and variables → Actions**:
   - secret `WEB3FORMS_KEY`: a free access key from [web3forms.com](https://web3forms.com) so the contact form sends email (otherwise it opens the visitor's email client);
   - variable `UMAMI_WEBSITE_ID`: enables Umami analytics (create a website at [cloud.umami.is](https://cloud.umami.is) and copy its Website ID);
   - variable `SITE_URL`: only needed for a custom domain.

To preview the exported site locally: `npm run build && node scripts/serve-static.mjs out 3000`.
