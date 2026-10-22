---
name: seven-second-storytelling
description: Create expressive native SVG drawings and seven-second character animations from visual references, with anatomy, gesture, lighting, and reusable corpus prompts. Use for drawing studies, hands and feet, facial acting, stretching, pirates, monsters, worms, gentle undead characters, and illustrated children's stories. Not for ordinary UI motion or raster-only image generation.
metadata:
  short-description: "Draw expressive SVG art and seven-second stories"
---

# Seven-second storytelling

Make the still worth keeping, then give it a meaningful action. Deliver editable SVG artwork, a seven-second animation, and the prompt that produced it. Default to a native SVG rig and local files; respect another requested medium, length, or destination.

## Read the reference as an artist

Inspect the actual images, including rotated or enlarged details when needed. A screenshot of a file list is an inventory, not the artwork. If those files are available locally, open them before asking for an upload. Record the subject, gesture, construction, light direction, line hierarchy, perspective, and what makes the drawing expressive. Do not guess an expression from its filename.

For this corpus, the supplied photographs study skulls, eyes, ears, happiness, sadness, anger, fear, surprise, profile laughter, winking, torso torsion, arms, hands, legs, feet, and fantasy characters. The bundled [corpus index](references/corpus-index.md) maps all 24 sources to original studies and full prompts. Read only the relevant entries in [assets/corpus/manifest.json](assets/corpus/manifest.json), then inspect their SVGs. Reference photos are not bundled.

Extract transferable craft. Preserve requested identity and proportions, but compose an original drawing rather than tracing a whole book page or copying its captions. Distinguish observed reference features from invented story details. These examples are reusable art references, not a medically validated anatomy atlas.

## Draw and choreograph

1. **Choose the small story.** Infer the intended audience and one readable action. Name the starting pose, anticipation, main action, reaction, and resolution. For children's storytelling, default to warmth and readable emotions; monsters and undead can be playful without losing their silhouettes. Honor a requested darker tone.
2. **Design the still.** Use [drawing craft](references/drawing.md) for anatomy, shape, light, depth, and character variants. Establish a clear silhouette and focal point before texture. Native paths and shaped shadow masses should carry the drawing; an embedded bitmap inside an SVG is not editable vector illustration.
3. **Build an articulated drawing.** Separate parts at useful joints and natural occlusions. Use stable named groups such as `head`, `brow-left`, `upper-arm`, `forearm`, `hand`, `coat-tail`, and `contact-shadow`. Add overlapping joint coverage so rotation does not expose seams. Keep a rest pose that reads independently at thumbnail size.
4. **Animate intent.** Use [motion and export](references/motion.md). Default to exactly 7.000 seconds. A character should think, act, and react; whole-picture swaying alone is insufficient. Keep bone lengths stable, fingers attached, weight supported, and secondary motion delayed. Use moderate amplitudes and meaningful holds.
5. **Inspect actual frames.** Render the start, anticipation, strongest action, reaction, settling, and endpoint. Look at the images. Fix unmotivated movement, disconnected limbs, accidental tangencies, unreadable expressions, and clipping. Check reverse seeking and replay. For a loop, compare both endpoint pose and velocity; matching positions alone can still produce a jerk.
6. **Deliver the reusable result.** Include static SVG, animated SVG or deterministic composition, requested encoded video, and a README entry with the original prompt, source identity, observation, art decisions, timing, and links. When adding to a corpus, update its manifest and gallery. Clearly distinguish tested exports from unfinished work.

## Tool choices and reusable helpers

- Draw original vector geometry directly in SVG. Prefer cubic paths, deliberate stroke hierarchy, selective cross-contours, clipped washes, and local gradients. Use image generation only when a raster deliverable is wanted or for an explicitly identified concept reference.
- Native SVG SMIL supports portable seven-second loops. Keep browser controls outside the exported SVG and use `pauseAnimations()` plus `setCurrentTime(t)` for deterministic inspection. Use a pure `render(t)` implementation when complex deformations or frame-specific drawings make a group rig unsuitable.
- [scripts/lint_svg.py](scripts/lint_svg.py) checks XML validity, self-contained assets, accessibility metadata, animation duration, duplicate IDs, and internal references. It does not judge anatomy or artistic quality.
- [scripts/render-svg.mjs](scripts/render-svg.mjs) exports native SVG animation to 210-frame, 30 fps MP4 using local Chrome and FFmpeg. It uses a pinned Playwright dependency from the current project; setup and commands are in the motion reference. Render and inspect video when requested, rather than handing over only a browser preview.
- Keep gallery playback deliberate and accessible: play/pause, restart, scrubbing, keyboard operation, no automatic playback with reduced motion, and pause when hidden. A standalone SMIL SVG can autoplay; offer its static counterpart wherever an embedding context cannot honor reduced motion.

## Delegation when useful

Split a large corpus by artistic family, with separate output files and one shared palette, framing, and metadata contract. A reference reader can identify construction, an illustrator can draw, an animator can stage motion, and a reviewer can judge rendered frames. The primary agent remains responsible for consistency and for actually opening the results. Parallel generation is not a substitute for visual review.

## Art direction for this corpus

The starting language is a warm paper ground, graphite/indigo contours, layered tonal shapes, sparse ochre or russet accents, and restrained hatching. Preserve illumination, anatomy, perspective, depth, and composition when adapting it. This is a starting point, not a required style for every later request. Hairline inspired line hierarchy, designed rest poses, bounded movement, and inspection discipline; its isometric machinery and monochrome restrictions do not govern character illustration. [Research and attribution](references/sources.md) records exactly which ideas came from each linked project.
