# WASMA home: Scroll Craft plan (tailored proposal)

Self-authored under explicit creative delegation; the brief, quotes and feeling curve are in `scrollcraft/builds/wasma-proposal/BRIEF.md`. This replaces the earlier "gallery with editorial interludes" build, whose row stays in `scrollcraft/FINGERPRINTS.md`.

Skill: [scroll-craft](https://github.com/nateherkai/scroll-craft), vendored at `.claude/skills/scroll-craft`. The engine is not used at runtime (Next.js and Framer Motion); its method is: brief, journey, grammar, fingerprint gate, feeling curve, score, signature move, taste floor, verification harness. Sections carry `data-sc-act` for `shoot.mjs`.

## Journey

1. Recognition: your kind of place, your kind of site on a phone.
2. Tension: the worn menu, the missed DMs, said plainly.
3. Turn (peak): scan it, and it is real.
4. Substance: clear packages with "from" prices.
5. Range: five working samples.
6. Method: one message to launch.
7. Commitment: send the proposal on WhatsApp.

## Grammar: tailored proposal (new)

The page is a proposal addressed to the visitor's kind of business, not a studio portfolio.

- **Nav:** the bar's main control is a business switch (native select), plus language and a WhatsApp CTA that carries the choice. Section anchors live in the menu, on every screen size.
- **Sequence:** recognition, friction, proof, price, range, method, proposal. Price comes before the portfolio because owners ask "how much" first (launch plan).
- **Ending:** a proposal plate, a short document filled in from the page's state, with one send button.
- **Bans:** generic studio claims (no reasons ledger, no statement banner), card grids, kinetic type, the old logo viewfinder, any price without "from".

## Fingerprint gate

Against the only row (`wasma-next`, gallery with editorial interludes):

| Dimension | wasma-next | This build | Differs |
| --- | --- | --- | --- |
| Grammar | Gallery with editorial interludes | Tailored proposal | Yes |
| Nav | Four anchors, one CTA | Business switch, anchors in the menu, WhatsApp CTA carrying state | Yes |
| Hero device | Clip-path opening from the logo square | Photo, phone and QR table card as independent parallax and pointer planes | Yes |
| Act shape | 11 acts, gallery peak, 19 vh | 7 acts, pinned scan peak, pan, 13.2 vh | Yes |
| Close | Brief composing a WhatsApp/email hand-off | Proposal plate from page state, brief form secondary | Partly; both end in WhatsApp, honestly similar |
| Signature | Square viewfinder into mini-sites | Business switch regrades every act | Yes |

5 of 6. Passes.

## Score

| Act | Device | Span (desktop) | Why |
| --- | --- | --- | --- |
| 1 Hero | `parallax` + pointer | ~1 vh | Depth from four planes moving at different rates |
| 2 Friction | `flow` | ~1 vh | Authored silence; reading, not watching |
| 3 Scan (peak) | `pin` | 3.4 vh | The frame holds while the phone scans the card; largest span |
| 4 Packages | `reveal` (row wipes) | ~1.6 vh | Each price arrives as a ruled entry |
| 5 Samples | `pan` | 2.2 vh | Lateral travel reads as options |
| 6 Process | `flow` | ~0.9 vh | Calm, short |
| 7 Proposal | `reveal` + form | ~1.6 vh | The plate wipes in, then the page stops and responds |

Families: parallax, flow, pin, reveal, pan. None twice in a row; one pin scrub, no video. No two adjacent acts share a feeling. Total ~13.2 vh desktop, 7 acts.

## Hero layer contract

| Plane | Content | Scroll | Pointer |
| --- | --- | --- | --- |
| Far | Unsplash photo for the chosen business, crossfades on change | y +140px, scale 1.06 to 1.16 | -14px |
| Air | Short ink falloff at the photo's foot | fixed to far | none |
| Mid | Phone with the live concept (inert here; operable in act 3) | y -90px | +18px, slight tilt |
| Near | Table card with a real QR code | y -190px | +34px, tilt |
| Copy | Headline, switch, CTAs | 1x | none |

Phones: copy first, then the stack bleeding to the edge with the phone and card overlapping its foot. Reduced motion: same composition, no travel, card keeps its static tilt.

## Peak choreography (desktop, motion allowed)

`scrollYProgress` of `#scan` (340 vh): 0.06 to 0.30 the phone glides over the card and its camera view shows the code; 0.20 to 0.32 the lime reticle locks; 0.32 to 0.46 a URL pill shows the demo address; 0.42 to 0.50 a shutter flash; 0.46 to 0.58 the camera view wipes up to the live demo; 0.48 to 0.66 the phone returns beside the card; after 0.56 the phone is operable and the code stays scannable. Phones and reduced motion get the end state with an "open it on this phone" button.

## Verification

`npm run typecheck && npm run lint && npm run build`, then `node scripts/verify.mjs` (81 checks, including the regrade, the ?for= deep link, the peak, reduced motion and phones) and `node scripts/axe.mjs` (0 violations, ar and en). `PHOTO_MOCK=<dir> node scripts/snap.mjs ...` serves local copies of the Unsplash photos, because the build container cannot reach their CDN.
