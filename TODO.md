# To-do

Planned improvements for the portfolio, most useful first.

## Worth doing

- [ ] **Check Google indexing.** In a few days, confirm the sitemap shows "Success" in Search Console and that `site:ritik-mewada.vercel.app` lists the pages. If nothing is indexed after two weeks, look at Indexing → Pages.
- [ ] **Link the portfolio from LinkedIn and GitHub.** LinkedIn: Contact info (Website → Portfolio), Featured, About. GitHub: the profile's website field. Helps recruiters and Google connect the site to your name.
- [ ] **Make the home page speed limits strict.** Performance is now 91–95 and Total Blocking Time 185–320 ms. CI runs Lighthouse once per page, so watch a few runs before changing `categories:performance` and `total-blocking-time` in `lighthouserc.json` from `warn` to `error`.
- [ ] **Custom domain.** Buy a domain such as `ritikmewada.dev` and connect it in Vercel → Project → Settings → Domains, then update `NEXT_PUBLIC_SITE_URL`. Also verify it in Resend, so the contact form can send from your own address and email visitors an automatic "thanks, I got your message" reply.
- [ ] **Recruiter funnel in Umami.** In Umami → Reports → Funnel, add `section_view` → `project_open` → `resume_open` → `contact_sent`. After 2–3 weeks of traffic, improve the step where most visitors drop off.
- [ ] **Maestro case study.** A short page on testing gas and airflow sensors and the device network (Modbus, MQTT, TCP/IP). Keep it general: no client names, site details, internal tools or anything under NDA.
- [ ] **Home-page heading shift.** The bold hero heading still shifts slightly (CLS ~0.04) on devices without Arial while Inter loads; a bold-weight fallback face would remove it.

## Nice to have

- [ ] **Downloadable PDF résumé.** A real file (e.g. `/Ritik_Mewada_Resume.pdf`) to link from LinkedIn and emails, either your own PDF or one generated from the `/resume` page. The current button only opens the print dialog.
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
- Current role (Maestro) rewritten as manual and hardware testing: gas-sensor calibration and bump tests, Modbus/TCP/IP/MQTT, Wireshark, Jira. Wireshark added to the skills.
- Home page Lighthouse failures on main fixed: tech icons moved to one sprite (HTML 498 KB → 188 KB) and the page no longer renders twice after load (`tests/e2e/hydration.spec.ts` guards it).
- CI about 3.5 minutes instead of 6.5 (one Lighthouse run per page).
- Google Search Console verified and sitemap submitted.

## Decided against

- Profile photo: tried in the hero (option A) and dropped.
- "Ritik OS" desktop concept: dropped in favour of the QA Lens.
- Making the repository private: the public code and passing tests are part of the portfolio.
