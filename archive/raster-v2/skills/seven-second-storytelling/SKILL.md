---
name: seven-second-storytelling
description: Create polished reference-informed drawings and seven-second illustrated motion, choosing realistic raster artwork or native SVG to suit the subject. Use for anatomy studies, expressive characters, fantasy creatures, and children's stories; not ordinary UI animation.
metadata:
  short-description: "Realistic drawings and seven-second illustrated motion"
---

# Seven-second storytelling

Make the still worth keeping before animating it. Choose the medium for the requested visual quality, preserve the reference-to-output relationship, and inspect every finished drawing and film. Default to seven seconds; honor a different requested duration, style, or delivery format.

## Read the actual reference

Open the relevant source images and rendered outputs. A screenshot of filenames is an inventory, not visual evidence. Identify subject, gesture, anatomy, viewpoint, light, materials, and what makes the drawing expressive. Correct mistaken subject mappings when the actual source contradicts existing metadata.

Extract transferable craft and compose an original study. Do not copy a photographed book page, captions, diagrams, or layout. Distinguish observed structure from invented story details. The corpus is artistic practice, not medically validated anatomy.

The [corpus index](references/corpus-index.md) maps the 24 references to prompts and outputs. Read only relevant entries in [the bundled manifest](assets/corpus/manifest.json), then inspect those assets. Source photographs remain in the user's Downloads and are not bundled.

## Choose the medium and scope of motion

- **Realistic drawn art:** prefer a high-quality raster plate when continuous shading, natural skin, expressive faces, painterly materials, or atmospheric depth matters. Use the built-in image-generation tool when available; inspect each reference first, make one call per asset, save the selected result in the project, and retain the exact prompt and provenance. Do not silently replace unavailable generation with flat vector placeholders.
- **Native SVG:** use it when shape construction, deliberate graphic contours, editability, and articulated vector motion suit the desired look. Follow the vector section of [drawing craft](references/drawing.md). An SVG containing a bitmap remains raster-backed artwork.
- **Motion:** choose a restrained cinemagraph for a finished plate whose existing silhouette and occlusions can support small movements. Use separate layers, authored poses, or an articulated rig for a blink, major bend, turn, walk, or expression change that exposes new surfaces. The pinned plate runtime cannot synthesize hidden anatomy. Name its output an illustrated cinemagraph, not fully articulated character animation.

For substantial stories, establish a readable intention, action, reaction, and resolution. For anatomical studies, a small load shift or tension/release may be the whole action. A camera drift or moving light alone does not establish character acting.

## Draw, review, repair

Read [drawing craft](references/drawing.md) before drawing and [motion and export](references/motion.md) before rigging or rendering.

1. Write a concrete art brief: subject, pose, audience, medium, camera, light, focal point, palette, and action. Keep anatomy and silhouette ahead of surface texture.
2. Finish and inspect the still at full size and thumbnail size. Check anatomy and digit count, perspective, coherent light, purposeful edges, clean negative space, and believable contact.
3. If it fails, identify a visible defect and revise that defect. Regenerate, repaint, redraw, or recompose as appropriate; compare the revision against the prior image and reference. Recheck affected areas and the full composition. Repeat until material defects are resolved; if the medium or tool cannot resolve one, change approach or clearly identify the remaining limitation.
4. Author motion from the final image's actual landmarks. Pin supporting contacts and joint attachments; use small regions around the intended moving anatomy. Inspect beginning, anticipation, extreme, return, and loop boundary. Repair elastic bones, sliding feet, detached fingers, wavy paper, clipping, or unstable light.
5. Inspect a decoded frame and playback of the final encoded film. Structural tests and numeric self-ratings are useful records, never certification of professional artistic quality. Review notes should name what was inspected, what was repaired, and any remaining limitation.

Do not claim visual QA from a contact-sheet filename, successful tool call, or encoder exit code. Open the images and inspect actual playback.

## Corpus and delivery contract

The realism edition uses:

- `corpus/plates/<id>.png`: canonical finished still.
- `corpus/realism/*.json`: authoring entries with source ID, exact prompt, observation, review notes, landmarks, and optional `rigOverride`.
- `corpus/animated/<id>.json` and `<id>.html`: composition data and local preview.
- `runtime/atelier.mjs`: deterministic pinned-mesh playback.
- Encoded MP4, manifest, and README links generated by the project workflow in the motion reference.

The installed skill carries the corresponding files under `assets/corpus/` and the runtime under `assets/runtime/`; preserve their relative layout when copying examples. Retain the native SVG corpus in `archive/vector-v1/` as historical material. Do not run its Python generators over the realism edition.

Update exact prompts and source observations when artwork changes. Export seven-second films when requested and distinguish rendered deliverables from previews. Keep gallery controls accessible: explicit play/pause, seek, restart, reduced-motion behavior, and pause when hidden. This project is a local gallery; do not imply publication or hosted rendering.

## Reuse and collaboration

Split a large corpus by subject family with one shared art direction and metadata contract. Assign disjoint files, inspect each final asset independently, and calibrate its rig from the actual image. Parallel generation does not replace individual review.

The realism edition uses warm ivory paper, continuous graphite/charcoal modeling for anatomy, and restrained painterly color for storytelling. Treat this as a starting direction, not a universal style. Preserve useful light, volume, perspective, and gesture when adapting it. [Research and attribution](references/sources.md) records the motion repositories' contributions; their graphic or isometric styles do not govern realistic character illustration.
