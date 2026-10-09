# To-do

Planned improvements for the portfolio, most useful first. Each one gets a demo before any code changes.

## Worth doing

- [ ] **Contact form sends email directly.** Create a free [Resend](https://resend.com) account, then add `RESEND_API_KEY` in Vercel → Project → Settings → Environment Variables. The code already exists (`src/app/api/contact/route.ts`). Until the key is added, the form only opens the visitor's own email app.
- [ ] **PDF resume download.** Add a "Download PDF" button with the real resume, so recruiters can attach it to an application.
- [ ] **Maestro case study.** A short page on testing gas and airflow sensors and the device network (Modbus, MQTT, TCP/IP). Keep it general: no client names, site details, internal tools or anything under NDA.
- [ ] **Custom domain.** Buy a domain such as `ritikmewada.com` and connect it in Vercel → Project → Settings → Domains. Then update `NEXT_PUBLIC_SITE_URL`.

## Nice to have

- [ ] **Visitor analytics.** Turn on Web Analytics in the Vercel dashboard. The tracking code is already installed.
- [ ] **Better link previews.** Customise the Open Graph image shown when the link is shared on LinkedIn (`src/app/opengraph-image.tsx`).
- [ ] **Theme picker.** Turn on the visitor theme switcher (`src/themes/index.ts`, `src/components/navbar.tsx`) or finish the Classic theme.
- [ ] **Polish GitHub projects.** Add screenshots or short GIFs to the project pages and write READMEs for the most-clicked repos.

## Decided against

- Profile photo: tried in the hero (option A) and dropped.
- "Ritik OS" desktop concept: dropped in favour of the QA Lens.
