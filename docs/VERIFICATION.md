# Verification report

Run in the cloud build container on 2026-10-04 against the production build (`next build` + `next start -p 3200`), headless Chromium 1194 via Playwright. Commands are listed in the README.

## Build and static checks

| Check | Result |
| --- | --- |
| `npm run typecheck` (tsc, strict) | Pass, 0 errors |
| `npm run lint` (eslint-config-next 16, core-web-vitals + TS) | Pass, 0 errors, 0 warnings |
| `npm run build` (Next 16.3.8, Turbopack) | Pass. 12 pages prerendered as static HTML (`/ar`, `/en`, 10 concept pages); proxy, API route, OG image and catch-all are on-demand |

## Functional checks: `scripts/verify.mjs` (70/70 pass)

Routing and language: `/` redirects to `/ar`; SSR HTML carries `lang="ar" dir="rtl"` and `lang="en" dir="ltr"`; the language switch keeps the path and stores a cookie that bare URLs honour; unknown paths return HTTP 404 with localized copy; unsupported locales redirect into Arabic.

Home: the viewfinder is `inert` until opened, opens on scroll, switches concepts, and its demos change real state; gallery tabs follow the ARIA tabs pattern with RTL-aware arrow keys; the gallery NURA demo adds to the bag; "I want something like this" pre-selects that concept and infers the project type in the brief; concept pages carry `?like=` into the brief.

Brief: empty submit shows a focused error summary and `aria-invalid` fields; a valid brief produces a WhatsApp link to `wa.me/218913309237` and a `mailto:asemdadesh@gmail.com` link, both containing the composed message; with JavaScript disabled the form POSTs to `/api/brief`, returns the composed message, and puts no personal data in the URL.

Concepts: SAHRA estimate updates with room/guests, warns on over-capacity, prepares a request and states nothing is sent; NURA bag drawer is a modal dialog that merges identical lines, totals with delivery, closes on Escape and restores focus; NŌTE adds items with options, filters by diet, and opens show-to-staff mode (phone viewport); MADAR filters narrow results, compare opens a table dialog, empty state offers reset; SANAD validates details and offers a real `.ics` calendar file.

Reduced motion: hero, statement and featured scene have no pinned travel; the viewfinder is shown open and operable.

Phone choreography: one hero mounted after hydration; the phone hero is pinned, starts with the viewfinder closed and opens to over 75% of the screen on scroll; the gallery renders five stacked sticky cards that overlap while scrolling; no console errors.

Mobile: menu button visible, desktop CTA hidden, modal menu opens and closes on Escape; no horizontal overflow at 390 px and at 360 px on all seven main routes.

## Accessibility: `scripts/axe.mjs`

axe-core on all 14 routes (7 Arabic, 7 English, including 404): **0 violations** after fixes. The first run found 16 (empty-label decorative image roles, the concept banner outside a landmark, a duplicate region label, two contrast misses at 4.06 and 4.1:1); all were fixed and the run repeated.

Keyboard: tab order from the top is skip link, logo, four nav links, language switch, CTA, hero CTAs, then gallery. Every stop shows a visible focus ring. The closed viewfinder is skipped.

## Scroll Craft harness (`shoot.mjs`, Arabic home)

| Run | Frames | Result |
| --- | --- | --- |
| Desktop 1440 × 900 | 30 | Contact sheet reviewed. Harness flags "dead scroll" only between natural-flow sections |
| Phone 390 × 844 | 30 | Same; flags are flow-to-flow |
| Reduced motion 1440 × 900 | 29 | Same |

The harness detects change through its own engine's cues, clips and `data-sc-verify-state`. It cannot see ordinary document movement in natural-flow sections, so it reports those spans as dead. To check this rather than assume it, consecutive frames were pixel-diffed (ImageMagick, 2% fuzz): the smallest change between any two consecutive frames was 7.7% of pixels on desktop, 3% on phone and 7.6% with reduced motion. No sampled scroll interval is static. Custom stages (hero, statement, featured, gallery) publish their rendered values on `data-sc-verify-state`.

Contrast is covered by axe (above); the harness reported no contrast or never-peaking-cue findings.

## Scroll smoothness: `scripts/perf.mjs`

Scripted scroll at 1400 px/s through each page, frame intervals recorded with `requestAnimationFrame`, headless Chromium with CPU throttling via DevTools Protocol.

| Page | Viewport | CPU slowdown | Avg fps | p99 frame | Frames over 25 ms | Long tasks |
| --- | --- | --- | --- | --- | --- | --- |
| `/ar` | 390 × 844 | 4× | 60 | 16.8 ms | 0 | 0 |
| `/ar` | 390 × 844 | 6× | 60 | 16.8 ms | 0 | 0 |
| `/ar/work/sahra` | 390 × 844 | 6× | 59.8 | 16.8 ms | 1 | 0 |
| `/ar/work/nura` | 390 × 844 | 4× | 60 | 16.8 ms | 0 | 0 |
| `/ar/work/note` | 390 × 844 | 4× | 60 | 16.8 ms | 0 | 0 |
| `/ar` | 1440 × 900 | 1× | 59.7 | 16.8 ms | 3 | 0 |

What this measures: main-thread cost (scroll handlers, React updates, style recalculation) stays well inside the frame budget even on a throttled CPU. What it does not measure: real GPU rasterization and compositing on a phone. Headless Chromium rasterizes in software and its frame clock is not a real display, so treat these as evidence that the JavaScript is cheap, not as a device benchmark.

## Defects found during verification and fixed

- Custom `.btn` CSS was unlayered and overrode Tailwind's `hidden`, so the desktop CTA showed on phones and pushed the menu button off-screen. Moved component CSS into `@layer components`.
- Hero viewfinder too small on phones; added a separate phone geometry (full-width band).
- Gallery stage went blank mid-transition (`AnimatePresence mode="wait"`); switched to an overlapping crossfade.
- Last gallery chapter let the sticky stage scroll away; added trailing space.
- Statement type at 22rem showed under two words at a time; reduced to 15rem.
- MADAR filters took half a phone screen; made them collapsible on phones.
- English hero wrapped to four lines; shortened to two.
- All routes rendered dynamically because the 404 read request headers; the 404 now derives its locale from the path and pages prerender.
- SAHRA label sat blue-on-blue over the pool; moved to the dark band.
- Phone hero (second round): the fading headline drew above the growing viewfinder; fixed stacking and faded it sooner. The open SAHRA demo left dead space on tall phones; its image band now grows to fill.
- NURA hero copy had a hard-edged backdrop and, in Arabic, landed on the beige carton; the scene now mirrors in RTL and the backdrop is gone.
- English desktop headline wrapped to three lines; English uses a smaller display size.

## Not verified

- Real devices (iOS Safari, Android Chrome). Only headless Chromium with touch emulation was used; real finger momentum, iOS address-bar resizing, GPU raster cost and real-network performance were not measured. Please open it on your phone and tell me anything that stutters.
- Firefox and Safari engines.
- Screen-reader output (VoiceOver/TalkBack) was not listened to; semantics were checked by axe and by inspecting roles and labels.
- The live reference site could not be opened from the container (proxy 403), so it was compared only through the supplied screenshots.
- Real photographs: not present, so the SVG stand-ins were verified, not the `next/image` photo path. The photo path is exercised by type-checking and code review only.
- Lighthouse/Web Vitals were not run.
- Deployment: see the delivery notes.
