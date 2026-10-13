# To-do

Planned improvements for the portfolio, most useful first.

## Worth doing

- [ ] **Speed up the home page.** Lighthouse performance is 82–91 because of Total Blocking Time (~300–400 ms) from hydration and the animations (drifting wallpaper, skills marquee, glass effects). Goal: performance ≥ 90 on the CI runner, then change `categories:performance` and `total-blocking-time` in `lighthouserc.json` from `warn` to `error`.
- [ ] **Custom domain.** Buy a domain such as `ritikmewada.dev` and connect it in Vercel → Project → Settings → Domains, then update `NEXT_PUBLIC_SITE_URL`. Also verify it in Resend, so the contact form can send from your own address and email visitors an automatic "thanks, I got your message" reply.
- [ ] **Recruiter funnel in Umami.** In Umami → Reports → Funnel, add `section_view` → `project_open` → `resume_open` → `contact_sent`. After 2–3 weeks of traffic, improve the step where most visitors drop off.
- [ ] **Maestro case study.** A short page on testing gas and airflow sensors and the device network (Modbus, MQTT, TCP/IP). Keep it general: no client names, site details, internal tools or anything under NDA.
- [ ] **Home-page heading shift.** The bold hero heading still shifts slightly (CLS ~0.04) on devices without Arial while Inter loads; a bold-weight fallback face would remove it.

## Nice to have

- [ ] **Visual regression tests.** Playwright screenshots of each page that fail on unexpected layout changes (update the snapshots when the design changes on purpose).
- [ ] **Performance line on the hero test card.** Once the home page passes the Lighthouse limits, add a real performance check back to the card in `src/components/sections/hero.tsx`.
- [ ] **Better link previews.** Customise the Open Graph image shown when the link is shared on LinkedIn (`src/app/opengraph-image.tsx`).
- [ ] **Theme picker.** Turn on the visitor theme switcher (`src/themes/index.ts`, `src/components/navbar.tsx`) or finish the Classic theme.
- [ ] **Polish GitHub projects.** Add screenshots or short GIFs to the project pages and write READMEs for the most-clicked repos.

## Done

- Contact form sends email through Resend, with automatic spam filtering.
- Vercel Analytics, Speed Insights and Umami event tracking.
- Playwright test suite (unit, end-to-end, accessibility) and Lighthouse checks in CI.
- Save-as-PDF résumé.

## Decided against

- Profile photo: tried in the hero (option A) and dropped.
- "Ritik OS" desktop concept: dropped in favour of the QA Lens.
- Making the repository private: the public code and passing tests are part of the portfolio.
