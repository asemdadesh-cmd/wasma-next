# Image requests

The four photographs described in `docs/ASSET-GUIDE.md` were not present in this workspace, and the build container could not download generated images at full resolution (network policy). Every photo slot therefore ships an art-directed SVG scene with the same composition, palette and quiet zones.

**Swapping in photographs needs no code change.** Save each image as WebP at the exact path below and rebuild (`npm run build`). `src/lib/photos.ts` detects the file at build time and the `Scene` component renders it with `next/image` instead of the SVG.

| File (exact path) | Used in |
| --- | --- |
| `public/images/studio-surface.webp` | Home hero far plane |
| `public/images/sahra-retreat.webp` | Home featured scene, SAHRA courtyard reveal, SAHRA room crops |
| `public/images/nura-objects.webp` | NURA hero |
| `public/images/note-cafe.webp` | NŌTE hero |

All four: **1536 × 1024 (3:2 landscape)**, no text, no logos, no people, no watermark. Keep PNG masters in `assets/images/` if you want them versioned; only the WebP files are served.

Convert with any of: `cwebp -q 82 in.png -o out.webp`, Squoosh (squoosh.app), or `npx sharp-cli -i in.png -o out.webp -f webp -q 82`.

## Copy-paste prompts (ChatGPT image generation)

Use one shared preamble so the four images read as one shoot:

> Editorial photograph, medium format, natural colour, hard directional late-afternoon light from the left, crisp shadows, high material detail, restrained palette, generous negative space, no people, no text, no logos, no watermark, 3:2 landscape, 1536×1024.

### 1. studio-surface
> [preamble] Warm ivory lime-plaster wall filling the frame, perfectly clean. A stepped architectural edge runs vertically on the right fifth of the frame. A strong diagonal shadow crosses the lower half from bottom-left rising to the right. The upper-left two thirds stay quiet and evenly lit for overlaid dark text. Nothing else in the frame.

### 2. sahra-retreat
> [preamble] A small limestone coastal retreat. A wide rectangular courtyard opening, centred slightly right of middle, frames a calm deep-blue Mediterranean sea and clear sky. A white linen curtain hangs in the left side of the opening. Pale textured limestone walls either side. A shallow cobalt-blue pool runs across the foreground with gentle ripples. An olive branch enters from the top-left corner. Hard shadow falls across the right wall.

### 3. nura-objects
> [preamble] Three objects standing on a brushed steel surface against a charcoal plaster wall: a forest-green glass bottle with a narrow neck (left), an ivory glazed ceramic jar with a lid (centre), a plain kraft paper carton (right). Blank packaging, no labels. A thin cobalt-blue edge light grazes the objects from the right. The upper-left of the frame is dark, empty wall for light text.

### 4. note-cafe
> [preamble] Top-down view on a terracotta-red plaster table: a double espresso in a white cup on a saucer (left of centre), a glazed brioche bun (right of centre), a silver spoon aligned between them, and an espresso-brown linen napkin along the bottom edge. Wide empty space between the cup and pastry.

## Optional extras (would further strengthen the concepts)

- `public/images/madar-tripoli.webp`: aerial dusk view of a Mediterranean city of low white buildings and palms, no landmarks or text. Not wired yet; MADAR currently uses its live SVG map by design.
- `public/images/sanad-clinic.webp`: calm clinic reception in mint and white, soft daylight, no people. Not wired yet.

Ask and these can be wired into the concepts the same way.
