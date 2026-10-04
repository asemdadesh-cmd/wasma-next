# WASMA وسمة: studio website

Arabic-first website for WASMA, a Libya-based web and digital studio. The lime square in the logo is a viewfinder: it opens into five working miniature websites (fictional studio concepts), and whichever one the visitor likes follows them into the project brief.

- **Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, Framer Motion, `next/font`.
- **Languages:** Arabic (default, RTL) and English (LTR). Language and direction are server-rendered on `<html>`.
- **Routes:** `/ar`, `/en`, and five concept sites at `/{lang}/work/{sahra|nura|note|madar|sanad}`, plus a localized 404.
- **Design method:** the [Scroll Craft](https://github.com/nateherkai/scroll-craft) skill, vendored in `.claude/skills/scroll-craft`. Plan: `docs/SCROLL-SCORE.md`.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000  (redirects to /ar)
```

Production build:

```bash
npm run build
npm start            # http://localhost:3000
```

Checks:

```bash
npm run typecheck
npm run lint
```

## Verification scripts (need a running server and Chromium)

```bash
npm run build && npx next start -p 3200 &
node scripts/verify.mjs http://localhost:3200      # 63 functional checks: routing, RTL, 404, forms, hand-offs, every concept, reduced motion, overflow
node scripts/axe.mjs http://localhost:3200         # axe-core audit of all 14 routes
SCROLLCRAFT_CHROME=/path/to/chrome node .claude/skills/scroll-craft/scripts/shoot.mjs --url http://localhost:3200/ar --out lab/desktop
```

The scripts default to Chromium at `/opt/pw-browsers/...` (the cloud container). Locally, set `CHROME=/path/to/chrome` for `verify.mjs`.

## Project structure

```
src/
  app/[lang]/            root layout (lang/dir), home, 404, concept routes, OG image
  app/api/brief/         no-JavaScript fallback for the brief form (POST, nothing stored)
  components/brand/      exact vector mark (measured from the supplied logo)
  components/home/       hero, work gallery, sections, contact
  components/mini/       miniature working demos used in the hero and gallery
  components/concepts/   the five full concept sites + WASMA frame
  components/scenes/     SVG stand-ins and the photo slot component
  lib/                   i18n, dictionaries (ar/en), projects, sample data, brief logic
docs/                    brief, asset guide, scroll score, image requests, verification
```

## Contact hand-off

The brief form validates input, then composes a message the visitor sends themselves via **WhatsApp (+218 91 330 9237)** or **email (asemdadesh@gmail.com)**. Nothing is sent or stored by the server, and the page says so. Without JavaScript the form POSTs to `/api/brief`, which returns the same composed message and links. To receive briefs server-side later, add an email provider (e.g. Resend) in `src/app/api/brief/route.ts`.

## Photographs

Image slots currently render art-directed SVG scenes. Drop the four WebP files into `public/images/` and rebuild to switch to photographs automatically. Prompts and exact filenames: `docs/IMAGE-REQUESTS.md`.

## Deploy

Any Node 20+ host that runs Next.js works. Recommended: **Vercel**.

1. Import the GitHub repository in Vercel (framework preset: Next.js, no build settings to change).
2. Set `NEXT_PUBLIC_SITE_URL` to the production origin (e.g. `https://wasma.ly`). It drives canonical URLs, `hreflang`, the sitemap and OG metadata. Without it the site uses `https://wasma.studio` as a placeholder.
3. Deploy. `proxy.ts` (Next 16's middleware) handles the `/` to `/ar` redirect and the remembered-language cookie, so the app needs a Node/Edge runtime, not static export.

Self-hosting: `npm ci && npm run build && npm start` behind a reverse proxy (port 3000 by default, `-p` to change).
