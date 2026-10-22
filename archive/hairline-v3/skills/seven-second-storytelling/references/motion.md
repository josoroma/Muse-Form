# Native SVG motion and export

Use seven seconds unless the user requests another duration. At 30 fps export frames n/30 for n=0…209: 210 frames, not 211. Verify the mathematical endpoint t=7 separately.

## The movement must fit the drawing

A designed resting pose, modest anticipation, a readable action and a quiet return support this contour style. The current anatomy loops show small tension/load changes; the facial studies hold their expression; story scenes move a selected feature or group. Describe that actual scope. A stroke accent changing contrast is an attention study, not a new anatomical pose.

Use semantic groups at real pivots. Cover joints at natural occlusions. Keep eyes round under lids, digits attached, long bones stable, props rigid and supporting contacts anchored. For a bend or viewpoint change that exposes new surfaces, author those surfaces/poses or use an appropriate 3D rig. Broad shape warping cannot invent them correctly.

## Current source contract

- corpus/svg/<id>.svg is the final static drawing.
- corpus/hairline/*.json contains the art prompt, actual method, review notes and optional animations.
- Animation specs target an existing element ID: {target,type,values,keyTimes}. Type is a native animateTransform type such as rotate or translate. For a scalar/color attribute use {target,attribute,values,keyTimes} and omit type. Key times span 0…1; values must begin and end at the same pose.
- For curated anatomical contour paths, the composer derives small matching-topology d morphs from their recorded landmark regions and contact pins. Commands and control-point counts must match. This is bounded contour deformation, not a skeletal simulation.
- corpus/animated/<id>.svg contains every native seven-second SMIL track. No bitmap or external runtime is required.

The project composer uses smooth spline interpolation and validates target IDs. Preserve the drawing's coordinate system when defining pivots: some authored figures use 400 × 300 and others 1200 × 900, both delivered at 4:3. Never mix normalized landmarks, local viewBox coordinates and pixel units without converting.

## Render and inspect

From the project:

~~~sh
npm run compose -- 105214
npm run catalog
npm run check -- 105214
npm run render -- 105214
npm run verify
npm run install-skill
~~~

For a full corpus change omit ID arguments. Open each generated qa/hairline/<id>-contact.png, inspect the SVG at full size and thumbnail size, and inspect the encoded MP4. Repairs to a source drawing require recomposition, affected frame checks and re-export. Reports must distinguish static review, sampled-frame review and continuous playback inspection.

The portable helper renders a self-contained SVG locally:

~~~sh
node scripts/render-svg.mjs assets/corpus/animated/105232.svg output.mp4
~~~

Requirements: Node.js 22+, local Chrome/Chromium, FFmpeg and the project's pinned playwright-core 1.64.1. Set CHROME_PATH for a nonstandard browser. The helper rejects image, script, foreignObject and external assets. It seeks SVG SMIL through pauseAnimations() and setCurrentTime(t), captures 210 frames and encodes silent 1200 × 900 H.264 at 30 fps. No cloud service is involved.

## Quality gates

- Native structure: accessible title/description, unique IDs, valid internal references, no embedded raster, scripts, gradients or filters for this edition.
- Drawing: coherent silhouette and anatomical landmarks; clean curve joins; no doubled contours, contour fragments masquerading as anatomy or decorative noise; one useful focal accent.
- Temporal integrity: matching source loop endpoints and gentle endpoint velocity, deterministic reverse seeking, no clipping, detached joints, sliding supports or distorted grips at extremes.
- Encoding: exactly 7.000 seconds, 210 frames, 1200 × 900, 30 fps; decoded frames agree with the preview and retain legible thin lines.
- Gallery: explicit play/pause/restart and scrub, keyboard support, hidden-tab pause, reduced-motion handling and no mobile overflow.

The current endpoint check records exact pixel equality separately. It requires identical first/last animation values and permits at most 0.01% differing pixels with a mean channel delta of 0.005/255, to account for tiny antialias differences when Chromium returns rotated hairline paths to rest. Random-time reverse seeking is checked pixel-exactly.

Passing tests is not an artistic certification. If a curve is visibly broken, fix it even when XML and duration checks pass.

Standalone animated SVGs can autoplay; offer the static SVG in reduced-motion embeddings. The gallery pauses SMIL and supplies explicit playback controls. Stop its frame loop when paused or hidden, and remove old drawings when switching studies.
