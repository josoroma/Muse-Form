---
name: seven-second-storytelling
description: Create clean native SVG drawings and visibly expressive five-second SVG animations from anatomy and storytelling references, with Hairline-inspired contours. Use for facial acting, articulated hands and fingers, muscle movement, gesture studies, pirates, monsters, worms and children's stories; not ordinary UI animation.
metadata:
  short-description: "Native SVG drawings with visible five-second motion"
---

# SVG storytelling

Make the drawing worth keeping, then make its action clearly visible. The current user preference is **static and animated SVG only, with five-second loops**. The existing skill identifier is retained for compatibility; its name does not determine the duration.

Use Hairline-inspired sparse contours, meaningful interior marks, clear occlusion, negative space and one focal accent. Preserve believable anatomy and composition. Read [drawing craft](references/drawing.md), [motion](references/motion.md), and relevant examples from [the corpus index](references/corpus-index.md).

## Observe and draw

Inspect the actual reference and rendered drawing. Record viewpoint, proportions, gesture, support, light cues and expression. Correct mistaken source labels. Supplied book photographs inform anatomy or gesture; do not copy their page layout or redistribute them.

Prefer native SVG paths and semantic groups. Use Three.js only when a requested real depth change needs it, while respecting requested delivery formats. Do not wrap a painting inside an SVG. If internal raster construction references supply geometry, disclose that method and curate every retained contour.

- Begin with the silhouette and joint relationships. Check digit count, length hierarchy, perspective, overlap and support.
- Use restrained, consistent non-scaling strokes. Current palette: ground `#101014`, silhouette `#a1a1aa`, interior `#52525b`, receding detail `#27272a`, focal accent `#fafafa`.
- Resolve eyelids around eyes, finger webs, muscle planes, ankle attachments and hand/prop grips. Remove duplicate edges, texture fragments, shadow outlines and incidental tangencies.
- Keep labels outside the art. Check the drawing at full size and a native 300-pixel SVG viewport.

## Make the action visible

Default to **exactly five seconds**, with matching start and end poses. Plan preparation, action, a readable extreme and recovery. The user rejected nearly static animation: a color pulse, tiny inclination or global wobble does not fulfill a request for expression, fingers or muscle motion.

Author the responsible geometry:

- **Expressions:** coordinate brows, lids, cheeks, lips and jaw. A blink needs an actual closing aperture, with iris geometry occluded beneath it. A wink also affects the cheek. Let the expression change visibly over time.
- **Hands and fingers:** articulate from the correct digit bases and joints. Preserve the thumb saddle, palm volume, finger lengths and webbing. Use distinct finger timing when it serves the gesture.
- **Muscles and limbs:** couple joint motion with relevant muscle-contour changes. Keep long-bone lengths credible, attachments continuous and supporting contacts fixed where appropriate.
- **Stories:** move the character toward an intention. Coordinate the eyes/head, body, hands and held object; secondary props support the action.

Use semantic transforms and authored matching-topology path poses. Large changes need resolved geometry and occlusion; broad elastic distortion cannot invent anatomy. Nest transform groups when actions need separate pivots. Avoid conflicting tracks on the same attribute.

## Inspect and repair every asset

1. Inspect the static drawing and native thumbnail for anatomy, clean contours, composition and focal hierarchy.
2. Render start, preparation, action, strongest pose, reaction, recovery and exact five-second endpoint. Include every authored extreme and rapid eyelid closure.
3. Watch the standalone SVG in motion. Check attachments, joints, silhouette, grip, occlusion, crop and supporting contacts; a still sheet alone cannot reveal every timing issue.
4. Compare rest and peak at 300 pixels. Motion must be clearly readable in the requested feature, not merely numerically nonzero. Track geometric change as a diagnostic; it does not replace judgment.
5. Repair concrete defects and reopen the changed result. Repeat until material problems are resolved. Record actual repairs, inspection scope and limits without inventing quality scores.
6. Check native structure, five-second duration, loop closure, repeated/reverse seeking and reduced-motion gallery behavior.

## Files and delivery

- `corpus/svg/<id>.svg`: static native drawing.
- `corpus/animated/<id>.svg`: self-contained five-second SVG animation.
- `corpus/hairline/*.json`: prompts, method, observations, reviews and explicit animation specifications.
- `corpus/manifest.json` and README: complete prompts and clickable SVG links.
- `qa/motion-five/`: motion measurements, rendered poses, visual reviews and gallery checks.

Deliver static and animated SVGs. Do not generate or offer MP4s unless the user later explicitly asks. QA snapshots are internal inspection evidence. The gallery autoplays selection unless reduced motion is enabled; it supports pause, restart, scrubbing and keyboard control and pauses when hidden.

Project workflow: compose → catalog → check → verify → install-skill → bundle. The portable bundle contains all 48 SVGs and the full prompt manifest. The `storytelling-svgs.zip` delivery contains only the static and animated SVGs. Prior editions remain archived.

Split large corpora by subject family with disjoint source ownership. Main-agent review still resolves cross-family quality and motion issues. Disclose self-review and distinguish sampled inspection from continuous playback. [Research notes](references/sources.md) record the supplied motion projects; this collection adapts Hairline's drawing discipline rather than its isometric engine.
