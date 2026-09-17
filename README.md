# Kalapriti Associates

Website for **Kalapriti Associates**, an architectural and design consultancy.

React 19 + Vite, deployed to GitHub Pages.

---

## Naming

Brand, repository and deploy path are all **`kalapriti`** — they were reconciled
on 17 Sep 2026 when the repo was renamed from `kalapreeti`.

They agree today, but they are still *different things*, and conflating them
broke production twice before the rename. The rules stand:

- `vite.config.js` → `base` is the **only** place the deploy path is written.
- Every asset URL is built with `asset()` from `src/data/site.js`, which reads
  `import.meta.env.BASE_URL`. **Never hardcode the prefix in a component.**
- Every brand string comes from `BRAND` in `src/data/site.js`.

GitHub Pages serves a project site from `/<repo-name>/`, case-sensitively — so
the path follows the *repo*, not the brand. When the site moves to
`kalapriti.com`, set `base` to `/` and update the absolute URLs in
`index.html`, `public/sitemap.xml` and `public/robots.txt` (each says so inline).

---

## Setup

```bash
npm install
npm run dev      # http://localhost:5173/kalapriti/
npm run build
npm run lint
npm run deploy   # builds, then publishes dist/ to the gh-pages branch
```

## Structure

```
src/
  data/          all copy, services, process steps, contact details
  components/    Nav, Footer, Layout, Reveal, PageHeader
  pages/         Home, Projects, Services, Process, Resources, About, Contact, NotFound
  index.css      design tokens (colour, type, spacing)
  App.css        component styles
public/
  404.html       GitHub Pages SPA fallback — see note below
  robots.txt, sitemap.xml
```

Content lives in `src/data/`, not in components. To change a service, a process
step or the phone number, edit the data file.

## Routing on GitHub Pages

Pages has no SPA rewrite, so a deep link like `/kalapriti/services` would 404.
`public/404.html` encodes the path into a query string and redirects to the
index, where a snippet in `index.html` restores the URL before React mounts.
Both halves must stay in step. Remove them if the site moves to a host with
proper rewrites (Netlify, Vercel).

## Design

Light and editorial, following the client's reference sites
(thecompanyofdesign.com, dsgninterior.se). Colour is the client's supplied green
palette plus the warm neutrals from their portfolio PDF. Type is Instrument
Serif for display, Instrument Sans for everything else.

## Known placeholders

| Thing | State |
|---|---|
| Projects | Placeholder — flagged in UI via `PROJECTS_ARE_PLACEHOLDER` |
| Resources | Prototype for client review — `RESOURCES_ARE_PROTOTYPE` |
| Contact form | Sends via WhatsApp; swap `MODE` in `src/pages/Contact.jsx` once an inbox exists |
| Instagram | Points at instagram.com — real handle pending |
| OG image | Reuses `hero.png`; needs a 1200×630 card |
| Logo wordmark | `logo-mark.svg` contains a live `<text>` element set in **High Tower Text**. That font is not embedded, so the "riti" glyphs fall back to a default serif on most machines. Ask the client for a version with the text converted to outlines. |

## Tech note

Vite **8.3.0 stable** with `@vitejs/plugin-react` 6.1.1. The previous
`8.0.0-beta` pin and its `overrides` block are gone, and `npm audit` reports
**0 vulnerabilities**.
