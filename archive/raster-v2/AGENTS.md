# Working in this sketchbook

This project combines a local illustration gallery, a 24-study art corpus, seven-second film exports, and the portable `seven-second-storytelling` skill.

- Read `skills/seven-second-storytelling/SKILL.md` for drawing and motion work. Inspect the actual relevant source image and final rendered output; a filename list is not a visual reference.
- Choose the medium for the requested art. The realism edition uses raster plates for continuous drawing and painting tones. Native SVG remains appropriate for deliberate vector construction; a bitmap inside an SVG is still raster-backed artwork.
- Preserve each source ID across `corpus/realism/*.json`, `corpus/plates/<id>.png`, and `corpus/animated/<id>.html` plus `<id>.json`. Update exact prompts, observations, landmarks and review notes when artwork changes. Correct source mappings from actual photographs.
- Supplied photos remain in Downloads and are not bundled. The studies are original reference-informed artwork, not traced pages or medically validated anatomy.
- `runtime/atelier.mjs` drives restrained pinned-plate cinemagraphs. It cannot synthesize hidden surfaces or fully articulated turns, walks and expression changes. Use another suitable rig or authored poses when the requested action requires them, and describe the delivered motion honestly.
- Animation defaults to seven seconds with a seamless loop. Calibrate each rig to its final plate; preserve joint attachment, long-bone lengths, perspective, lighting, prop grips and supported contact at the strongest pose.
- Review every still for anatomy, digit count, light, edges, composition and contact, then inspect actual moving frames and the encoded film. Identify and repair visible defects; repeat inspection after material changes. Numeric self-ratings and structural tests do not certify artistic quality.
- The original SVG corpus and its generator outputs are historical material under `archive/vector-v1/`. Inspect old Python generators before running them; do not use them to overwrite the realism edition.
- `npm run compose -- <id>` writes previews from realism authoring entries. `npm run catalog` rebuilds the manifest and README. Persistent README introduction changes belong in `scripts/catalog.mjs`.
- After art or rig changes, run `npm run check -- <id>`, open its `qa/realism/<id>-motion.jpg` contact sheet, render affected films with `npm run render -- <id>`, and run `npm run verify`. For full-corpus changes, run full compose/check/render and verification.
- `npm run install-skill` refreshes the portable corpus and the user's installed skill. Bundled paths are `assets/corpus/` and `assets/runtime/`; preserve their relative layout. The installer refuses to replace an unrelated skill of the same name.
- The gallery is a local preview, not a published site. Do not claim publication or cloud rendering.
