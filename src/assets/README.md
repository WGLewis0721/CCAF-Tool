# Artwork

Bespoke artwork generated with Higgsfield GPT Image 2 on 2026-10-12 for this app. Optimized WebP derivatives are embedded at build time. They contain no exam facts or rendered UI.

- tactical-atlas.webp: retired first-pass diorama, not embedded or displayed. Do not restore it as the hero background.
- mode-*.webp: six square illustrations cropped from one consistent collection, job 94ac12ff-c21b-4ddd-8fb6-04a0b05f1bc2.
- campaign-sprites.webp: coherent outpost/keep/creature/workshop/library/camp sheet, job 84a9f3c0-13e2-46ad-a311-5e40f80784a1.
- learning-symbols.webp: messages/controller/tools/archive/provenance/validation sheet, job 5ba04bae-e10a-48e2-b474-43ce62b4f1b1.
- terrain-material.webp: campaign terrain material, job e598996b-af04-47d1-8928-73aba78fafb9.

Illustrations use empty alt attributes where adjacent labels or a working diagram provide the meaning. Archie retains his original interactive SVG sprite throughout the application.

src/art.html defines reusable sheet symbols. Campaign sprites use bounded SVG foreignObject viewports and CSS background crops to keep marker hit boxes the size of the visible object. All artwork is embedded once at build time; no image-generation service runs in the client.
