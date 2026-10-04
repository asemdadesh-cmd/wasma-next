@AGENTS.md

# WASMA site: working notes for agents

- Arabic is the default locale. Design RTL first; use logical utilities (`ms-`, `pe-`, `start-`, `end-`) and check every change in `/ar` and `/en`.
- Never apply letter-spacing to Arabic (globals.css forces 0 under `:lang(ar)`). Use Western digits in copy.
- Brand: near black `#0B0D0C`, warm off-white `#F4F1E8`, lime `#BFFF38` (fills and markers only, never text on paper). Square corners on studio pages. The mark lives in `src/components/brand/Mark.tsx`; do not redraw it.
- Copy lives in `src/lib/dictionaries/{ar,en}.ts` (en is typed against ar). Concept copy lives inside each concept file.
- Custom CSS classes go inside `@layer components` in globals.css, otherwise they override Tailwind utilities such as `hidden`.
- Every motion effect needs a reduced-motion path (`useReducedMotion`) with no pinned travel and no hidden content.
- No em dashes in visible copy, no scroll cues, no invented statistics. Concepts must stay labelled fictional.
- Before pushing: `npm run typecheck && npm run lint && npm run build`, then `node scripts/verify.mjs` and `node scripts/axe.mjs` against `next start -p 3200`.
- Scroll Craft skill: `.claude/skills/scroll-craft`. Plan in `docs/SCROLL-SCORE.md`, registry in `scrollcraft/FINGERPRINTS.md`.
