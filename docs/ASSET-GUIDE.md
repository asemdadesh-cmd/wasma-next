# Original image assets

Four new original images were generated specifically for this next WASMA direction and visually inspected. Each master is 1536 × 1024, landscape 3:2. WebP delivery copies retain the full composition; PNG masters are preserved. See assets/manifest.json for dimensions, paths and SHA-256 checksums.

## studio-surface

Files: assets/images/studio-surface.png and .webp.

Warm ivory plaster, hard architectural light, a stepped edge at right and a strong diagonal shadow in the lower half. Use as a quiet hero material plane or editorial divider, preferably at low visual prominence. The upper-left region is quiet for dark type, but do not put dark text across the diagonal shadow without a separate reliable text surface. This is a clean background; compose the exact vector logo and the live interface plane separately in code.

Suggested background position: center center on desktop; left center on mobile if used. The hero can also use solid off-white on mobile. It is not a photographic logo, a 3D model or a transparent cutout.

## sahra-retreat

Files: assets/images/sahra-retreat.png and .webp.

Limestone retreat with courtyard opening, olive foreground, sea, cobalt pool and white curtain. Use for SAHRA hospitality, feature storytelling and architecture-led editorial layouts. It contains high-detail textured surfaces; use text beside it or on an explicitly contrast-safe surface.

Suggested focal point: 56% 50%; use the full image in the main feature where possible. A narrow/mobile crop centered on the opening can hide the curtain, so consider a separate natural-aspect image rather than treating one crop as universal.

## nura-objects

Files: assets/images/nura-objects.png and .webp.

Forest-green bottle, ivory jar and paper carton on brushed metal, charcoal wall and cobalt edge light. Use for NURA product/commerce editorial panels. Upper-left negative space can hold light semantic text after contrast verification. The products form a single photographic composition, not separate product photos or independently animated cutouts.

Suggested object position: 68% 55% for a portrait window, with the complete composition shown elsewhere. Do not place three identical crops under different products and imply distinct product photography. Use honest typographic product rows or useful variants/details instead. Do not pretend labels exist on the blank packaging.

## note-cafe

Files: assets/images/note-cafe.png and .webp.

Espresso and glazed pastry on a terracotta-red surface, an aligned spoon and espresso-brown linen. Use for NŌTE café identity and digital-menu editorial scenes. The wide central gap supports open composition; UI text should usually sit beside the image or on a solid background. For phones, favor the complete 3:2 image or a measured crop at 50% 50%; verify that the cup and pastry remain readable.

## Implementation rules

- Move or copy WebP delivery files into the implemented app's public/images folder. Keep masters in the repository; do not import PNG originals into every runtime screen.
- Use explicit dimensions/aspect ratio and useful alt text. Prioritize only an image actually needed for the first viewport, and lazy-load later scenes.
- All generated scenes depict fictional editorial concepts. They are not photos of WASMA's actual clients, products, premises or commissioned work.
- These are opaque photographic images, with no alpha channel contract. Do not fake layered photography by moving the same baked image twice. The hero's true independent planes should be the clean surface, vector mark, live HTML interface, and semantic typography.
- Do not burn copy or buttons into these files. Build complete interfaces around them.
- When more assets materially improve an experience, write a precise request in docs/IMAGE-REQUESTS.md for the collaborating image-generation agent. Complete the current build with the supplied assets; do not leave broken references or placeholders while waiting.
