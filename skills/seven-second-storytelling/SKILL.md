---
name: seven-second-storytelling
description: Create Hairline-inspired native SVG drawings and expressive five-second animations, or interactive Three.js anatomy and facial-expression studies when requested. Use for facial acting, articulated hands, limbs, muscle movement and illustrated characters; not ordinary UI animation.
metadata:
  short-description: "Hairline SVGs, 3D anatomy and facial acting"
---

# Illustrated motion

Make the form worth keeping, then make its action clearly visible. Default to **static and animated native SVG with five-second loops**. An explicit Three.js request selects a separate interactive 3D edition with the same five-second motion default; preserve the accepted SVG corpus. The existing skill identifier is retained for compatibility and does not determine duration.

Use Hairline-inspired contour discipline, meaningful interior marks, clear occlusion, negative space and one focal accent. Preserve believable anatomy and composition. For SVG work, read [drawing craft](references/drawing.md), [SVG motion](references/motion.md), and relevant examples from [the corpus index](references/corpus-index.md). For requested Three.js work, read [3D motion and interaction](references/three-motion.md). [FORM](assets/three/index.html) supplies body and limb studies; [MUSE](assets/expressions/index.html) supplies a separate adult portrait with eight expressions. Read [facial acting](references/facial-expression.md) when adapting that portrait.

## Observe and draw

Inspect the actual reference and rendered drawing. Record viewpoint, proportions, gesture, support, light cues and expression. Correct mistaken source labels. Supplied book photographs inform anatomy or gesture; do not copy their page layout or redistribute them.

Use native SVG paths and semantic groups for drawings, or native 3D volumes and joint hierarchies for Three.js scenes. Do not wrap a painting inside an SVG or treat a flat image on a plane as a modeled anatomical study. If internal raster construction references supply geometry, disclose that method and curate every retained contour.

- Begin with the silhouette and joint relationships. Check digit count, length hierarchy, perspective, overlap and support.
- For SVG, use restrained, consistent non-scaling strokes. Current palette: ground `#101014`, silhouette `#a1a1aa`, interior `#52525b`, receding detail `#27272a`, focal accent `#fafafa`. For 3D, use quiet lit surfaces and one selected-structure accent.
- Resolve eyelids around eyes, finger webs, muscle planes, ankle attachments and hand/prop grips. Remove duplicate edges, texture fragments, shadow outlines and incidental tangencies.
- Keep labels clear of the focal form. Check SVG drawings at full size and a native 300-pixel viewport; check 3D scenes from the intended camera views and at mobile size.

## Make the action visible

Default to **exactly five seconds**, with matching start and end poses. Plan preparation, action, a readable extreme and recovery. The user rejected nearly static animation: a color pulse, tiny inclination or global wobble does not fulfill a request for expression, fingers or muscle motion.

Author the responsible geometry:

- **Expressions:** coordinate brows, lids, cheeks, lips and jaw while retaining one identity and shared neutral pose. A blink needs an actual closing aperture, with iris geometry occluded beneath it. A wink also affects the cheek. In 3D, deform the surrounding face with its features; inspect eye and mouth boundaries from oblique views.
- **Hands and fingers:** articulate from the correct digit bases and joints. Preserve the thumb saddle, palm volume, finger lengths and webbing. Keep the skin continuous across joints and integrate nails into their distal beds. Use distinct finger timing when it serves the gesture.
- **Muscles and limbs:** couple joint motion with relevant muscle-contour changes. Keep long-bone lengths credible, attachments continuous and supporting contacts fixed where appropriate.
- **Stories:** move the character toward an intention. Coordinate the eyes/head, body, hands and held object; secondary props support the action.

Use semantic transforms and, for SVG, authored matching-topology path poses. Three.js models use absolute poses derived from time, with joint-aware deformation. Large changes need resolved geometry and occlusion; broad elastic distortion cannot invent anatomy. Nest groups when actions need separate pivots. Avoid competing animation owners.

## Inspect and repair every asset

1. Inspect the static drawing and native thumbnail for anatomy, clean contours, composition and focal hierarchy.
2. Render start, preparation, action, strongest pose, reaction, recovery and exact five-second endpoint. Include every authored extreme and rapid eyelid closure.
3. Watch the actual standalone SVG or live Three.js scene in motion. Check attachments, joints, silhouette, grip, occlusion, crop and supporting contacts; a still sheet alone cannot reveal every timing issue.
4. Compare rest and peak at 300 pixels. Motion must be clearly readable in the requested feature, not merely numerically nonzero. Track geometric change as a diagnostic; it does not replace judgment.
5. Repair concrete defects and reopen the changed result. Repeat until material problems are resolved. Record actual repairs, inspection scope and limits without inventing quality scores.
6. Check native structure, five-second duration, loop closure, repeated/reverse seeking and reduced-motion behavior. For 3D, also verify orbit interruption, part selection, moving labels and camera framing.

## Files and delivery

- `corpus/svg/<id>.svg`: static native drawing.
- `corpus/animated/<id>.svg`: self-contained five-second SVG animation.
- `corpus/hairline/*.json`: prompts, method, observations, reviews and explicit animation specifications.
- `corpus/manifest.json` and README: complete prompts and clickable SVG links.
- `qa/motion-five/`: motion measurements, rendered poses, visual reviews and gallery checks.

For SVG requests, deliver static and animated SVGs. For explicit Three.js requests, deliver the runnable HTML/JavaScript edition, its source models and explanatory sources; keep it separate from `corpus/svg` and `corpus/animated`. Do not generate or offer MP4s unless explicitly requested. QA snapshots are internal inspection evidence. Playback supports pause, restart, scrubbing and keyboard control, starts paused for reduced motion, and pauses when hidden.

SVG project workflow: compose → catalog → check → playback → visual review and repair → verify → install-skill → bundle. Rebuild the catalog after changing review metadata. The portable skill contains the 48 SVGs, prompt manifest and separate FORM/MUSE views; `storytelling-svgs.zip` remains SVG-only. Keep `assets/expressions/` beside `assets/three/`: MUSE imports FORM's engine, shared stylesheet and runtime. Preserve the accepted edition before replacing animations; `archive/hairline-v3` preserves the drawings accepted before this motion revision. A 3D-only revision does not require recomposing untouched SVGs.

Split large corpora by subject family with disjoint source ownership. Main-agent review still resolves cross-family quality and motion issues. Disclose self-review and distinguish sampled inspection from continuous playback. [Research notes](references/sources.md) record the supplied motion projects; this collection adapts Hairline's drawing discipline rather than its isometric engine.
