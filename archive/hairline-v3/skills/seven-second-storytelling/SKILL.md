---
name: seven-second-storytelling
description: Create clean native SVG drawings and seven-second illustrated motion from anatomy and storytelling references, with Hairline-inspired contour discipline. Use for expressive faces, hands, feet, gesture studies, pirates, monsters, worms and children's stories; not ordinary UI animation.
metadata:
  short-description: "Native SVG drawings and seven-second illustrated stories"
---

# Seven-second storytelling

Make the still worth keeping, then animate one readable intention. This user's current collection prefers **native SVG and Hairline-inspired drawing**: sparse precise contours, meaningful interior marks, clear occlusion, negative space and one focal accent. Keep believable anatomy and composition while reducing detail. The painted realism edition is a construction reference, not the current delivery format.

## Read and choose

Inspect the actual reference and the rendered drawing. A filename list is an inventory, not visual evidence. Identify subject, viewpoint, proportions, gesture, weight, lighting cues, material and emotion. Correct wrong source labels rather than perpetuating them. Do not copy a photographed book page's layout or captions; sources stay outside the distributed corpus.

Use [the corpus index](references/corpus-index.md) and relevant entries in [the bundled manifest](assets/corpus/manifest.json). Open the actual SVGs. The corpus is artistic interpretation, not a medically validated anatomy atlas.

Prefer native SVG for this collection. Use Three.js when real depth rotation or changing occlusion materially improves the requested action; a 3D library alone does not improve anatomy. Respect an explicit request for raster work, but do not replace a requested SVG with a painting embedded in an SVG wrapper. Raster reference analysis may supply construction points; the final SVG must contain independently usable vector geometry.

## Draw with fewer, better lines

Read [drawing craft](references/drawing.md). Apply Hairline's visual discipline to the subject rather than turning organic anatomy into its mechanical prisms:

- Begin with a convincing continuous silhouette and a designed rest pose. Maintain digit count, length hierarchy, joint attachment, perspective and support.
- Use one restrained stroke width. Separate contour, interior structure and receding detail by contrast. Current dark palette: plate `#101014`, silhouette `#a1a1aa`, interior `#52525b`, receding `#27272a`, focal accent `#fafafa`.
- Reserve the bright accent for one meaningful feature. Use background-colored opaque geometry to hide lines behind solid forms. No colored shadow masses, gradients, glows or generated grain in this edition.
- Draw the structure that explains the subject: eyelid wrapping an eye, thumb webbing, an ankle joining the foot, a claw holding a handle. Remove decorative texture that does not explain form.
- When deriving contours from an approved internal plate, suppress texture before extracting geometry, simplify and smooth curves, and inspect every retained feature. Automatic edges are only construction material. Repair broken silhouettes, missing eyelids or teeth, duplicates, wobble and accidental tangencies by authoring the actual shape. Preserve the honest method in metadata.
- Keep labels and explanatory prose outside the illustration. At thumbnail size, the pose and focal point should still read.

## Animate and inspect

Read [motion and export](references/motion.md). Default to exactly seven seconds and a closed loop. Use semantic groups for articulated parts, stable pivots and matching path topology for small deformations. SVG SMIL supports standalone loops and exact-time seeking. Keep bone lengths, prop geometry and ground contacts stable. A large bend, turn, blink or expression change needs appropriate articulated geometry or authored poses, not a broad elastic distortion.

Distinguish motion scope honestly. A breathing portrait holds an expression; a moving accent is a light/attention study. Neither is a complete acting cycle. For a larger story, make the intention, action and reaction visible.

For every asset:

1. Inspect the still at full size and thumbnail size: silhouette, anatomy, expression, line hierarchy, clean negative space and composition.
2. Render the start, anticipation, extreme, reaction, return and loop boundary. Check attachments, occlusion, crop and focal emphasis.
3. Identify a concrete defect, repair the responsible contour, group, pivot or timing, then reopen the changed output. Repeat until material defects are resolved. Change the method if it cannot support the requested quality.
4. Check reverse seeking and endpoint agreement. Inspect encoded video as well as browser frames; state the inspection scope accurately. Sampled frames are not continuous playback review.
5. Record specific findings and remaining limits. Numeric scores and passing format tests do not certify artistic quality.

## Current files and delivery

- `corpus/svg/<id>.svg`: canonical native drawing.
- `corpus/animated/<id>.svg`: seven-second native animation.
- `corpus/hairline/*.json`: art brief, actual construction method, observations, review and animation direction.
- `corpus/manifest.json`, README, gallery and MP4s: generated delivery index and previews.
- `qa/hairline/`: structural checks, contact sheets, individual visual review and encoded verification.

Preserve source IDs and correct observations when the art changes. Include full SVG prompts and clickable asset links in the README. The portable skill carries the drawings under `assets/corpus/`, plus quality records and render helpers. The static and animated SVGs open directly from disk. Gallery playback uses explicit play/pause, scrubbing, restart, keyboard support, reduced-motion behavior and hidden-tab pause.

In the project run compose, catalog, check, render, verify, then install-skill. After a local repair, check and render affected IDs. For a full revision, run the full set. The prior vector and raster editions remain in `archive/vector-v1/` and `archive/raster-v2/`; do not present them as current output.

## Reuse and collaboration

Split large collections by subject family with disjoint files and a shared palette/coordinate contract. The main agent still inspects the final results and resolves consistency problems. Independent critique helps; disclose when an artist reviews their own work.

[Research and attribution](references/sources.md) records the supplied motion projects. This corpus adapts Hairline's restraint and visual hierarchy; it does not claim to use its isometric engine or satisfy all its machine-figure interaction rules.
