# WASMA next: Scroll Craft plan

Self-authored under explicit creative delegation. The user wrote: "You have creative authority. Make routine decisions yourself." Evidence comes from `docs/BRIEF.md`, `docs/ASSET-GUIDE.md`, the supplied logo collage (`docs/brand/wasma-logo-collage.jpg`) and two screenshots of the previous site (`docs/reference/`). The live reference URL could not be opened from the build container (network policy returned 403), so the previous site was judged from the screenshots only.

Skill used: [scroll-craft](https://github.com/nateherkai/scroll-craft) 0.3.x, vendored at `.claude/skills/scroll-craft` (MIT). The engine (`scrollcraft.js`) is not used at runtime because the brief requires Next.js and Framer Motion. Its method is applied instead: brief, journey, grammar, fingerprint gate, feeling curve, device score, signature move, the taste floor, and the `shoot.mjs` verification harness. Sections carry `data-sc-act` markers so the harness samples within each scene.

## The eight topics

1. **Vibe.** Premium creative studio, European editorial, Swiss typography, subtle brutalism, experimental but usable, polished and fun (from BRIEF.md).
2. **Journey.** Navigation, hero, selected work, capabilities, statement, reasons, process, featured project, services, contact, footer (the eleven requested sections).
3. **Energy.** Quiet opening, rising curiosity, a loud interactive peak in the work gallery, a calm methods interlude, an immersive featured scene, then a direct and practical close.
4. **Feeling and the one moment.** See the curve below. The moment: "The little square in their logo let me look into and try completely different websites."
5. **What no other site does.** The detached lime square is a viewfinder. It opens into working miniature products, and the visitor's chosen product follows them into the brief form.
6. **Distance from premium-minimal.** Editorial with restrained brutalism: hard rules, square corners, exposed grid, oversized type. Not maximalist.
7. **One world or scenes.** Distinct scenes with hard cuts between paper and ink grounds. No continuous camera flight.
8. **Assets.** The logo collage (vector reconstructed in `src/components/brand/Mark.tsx`). The four photographs named in ASSET-GUIDE.md were not present in this workspace, so every image slot ships an art-directed SVG scene and switches to the photograph automatically when the file is added (see `docs/IMAGE-REQUESTS.md`).

## Journey beats

1. Recognition: the exact WASMA mark, at scale, with a plain promise.
2. Curiosity: the lime square opens, and there is something live inside.
3. Desire (peak): five working concepts, each with its own language, tried in place.
4. Clarity: what the studio actually does, in disclosures with real deliverables.
5. Conviction: one sentence that travels across the page.
6. Confidence: reasons and a method you can follow.
7. Immersion: one concept, image-led, entered as a place.
8. Resolve: services, then a brief that already knows what you liked.

## Grammar

**Gallery with editorial interludes** ("exhibition" grammar). The page is an exhibition of functioning objects. The gallery act is the unit of value; the editorial acts are wall texts between rooms. Filmic one-shot lost because the visitor must be able to stop and operate things. Live surface lost because WASMA is a studio, not a single product. Continuous world lost because nothing here is a journey through a place. Typographic poster lost because the work has to be seen. Chaptered editorial lost because chapters would bury the demos. Split stage is used locally inside the gallery only.

Bans honoured: no scroll cue, no `01 / 06` counters (numbers appear only in the process, where sequence is information), no em dashes in visible copy, no glassmorphism, no glow, no gradient text, no identical card grids.

## Fingerprint gate

The registry (`scrollcraft/FINGERPRINTS.md`) was empty, so this first build has nothing to clear. Its row is recorded there.

## Feeling curve

| Act | Feeling | What causes it |
| --- | --- | --- |
| Hero | Recognition | The supplied mark drawn exactly, large, on a warm plaster plane |
| Viewfinder | Curiosity | The lime square grows into a window with a live interface inside |
| Work gallery (peak) | Desire, play | Changing a finish, a night count, a menu filter, a map district, and seeing it respond |
| Capabilities | Clarity | Plain disclosures listing what is actually delivered |
| Statement | Conviction | One sentence moving in the reading direction across a dark ground |
| Reasons | Trust | A ledger of specific commitments, revealed row by row |
| Process | Calm control | A line drawn through five steps as you read them |
| Featured SAHRA | Immersion | The courtyard opening widens until the scene fills the screen |
| Services | Practicality | A dense, honest list with scope and outputs |
| Contact | Resolve | A brief already carrying the concept the visitor chose |
| Footer | Belonging | The mark returns whole, the square back in its place |

No two adjacent acts share a feeling. The peak (work gallery) has the largest span on desktop (one sticky chapter per concept).

## Score

| Act | Device | Why |
| --- | --- | --- |
| Hero | `parallax` (three independent planes) | Depth from surface, mark and live plane moving at different rates |
| Viewfinder | `reveal` (clip-path opening) | A change of state: the brand becomes a window |
| Work gallery | `pin` (sticky stage, chapter-driven) + pointer/keyboard | The stage holds while the visitor operates it |
| Capabilities | `flow` + disclosures | Reading, not watching |
| Statement | `pan` (direction-aware) | Lateral travel in the reading direction (right to left in Arabic) |
| Reasons | `reveal` (row wipes) | Each commitment arrives as a ruled entry |
| Process | `draw` (`--p` driven SVG stroke) | Progress made visible |
| Featured | `reveal` + `parallax` (window widens, scene drifts) | Entering a place |
| Services | `flow` | Practical information needs stillness |
| Contact | pointer, form | The page stops moving and starts responding |

Device families used: parallax, reveal, pin, flow, pan, draw, pointer. No family twice in a row.

## Signature move

The lime square as viewfinder. In the hero it opens (clip-path from the square's own rectangle) into a live panel. In the gallery the square marks the active concept and frames the working demo. The chosen concept is stored in page state and pre-selects the project type in the brief form, so the selection carries to the end. The footer returns the square to its place in the mark.

## Mobile composition

Composed separately, not shrunk: the hero stacks headline, mark and an opened viewfinder band with shorter travel; the gallery becomes a sequence of full-width concept rooms with inline demos (no sticky stage); the statement pans a shorter distance with smaller type; the featured scene uses a portrait window.

## Reduced motion

All position changes are dropped. Sticky travel space collapses to natural height. The viewfinder is shown open, the statement wraps statically, the process line is fully drawn, and the featured scene is shown at its resolved state. Every control still works.

## Concept sites (each a separate route with its own grammar)

| Concept | Category | Grammar and device | Distinct interaction |
| --- | --- | --- | --- |
| SAHRA | Coastal retreat | Chaptered editorial, serif, limestone palette; courtyard window reveal, horizontal room rail | Stay planner: dates, guests, room, live estimate, enquiry handoff |
| NURA | Objects shop | Split stage, dark charcoal with forest and cobalt; pinned product stage | Variant picker, bag drawer with quantities and totals |
| NŌTE | Café digital menu | Mobile-first menu tool, terracotta and espresso; sticky category scroll-spy | Category tabs, dietary filters, item sheet, order list to show staff |
| MADAR | Property search | Live surface, cool slate and brick; map/list sync | Filter by district, bedrooms, budget; interactive SVG map; compare tray |
| SANAD | Clinic booking | Stepper flow, mint and navy; stacked step reveal | Specialty, doctor, slot, details, confirmation summary |

All five are clearly labelled fictional WASMA studio concepts.
