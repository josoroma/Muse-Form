# Seven seconds, deliberately

## Timing and honest motion scope

Default to a seven-second seamless loop. Honor a requested one-shot ending or different duration. Seven seconds at 30 fps is **210 frames**: export `n / 30` for `n = 0…209`. Check the mathematical endpoint `t = 7` separately; it is not an extra video frame.

The pinned-plate runtime's default action envelope is:

| Time | Purpose |
| --- | --- |
| 0–0.8 s | Read the illustration at rest. |
| 0.8–1.4 s | Small anticipation. |
| 1.4–3.2 s | Ease toward the action extreme. |
| 3.2–4.1 s | Hold the readable extreme. |
| 4.1–6.1 s | Return and settle. |
| 6.1–7.0 s | Rest across the loop boundary. |

Delayed secondary regions may follow this envelope; the separate breath phase uses a smooth seven-second cosine cycle. Adapt timing to intent instead of moving everything together. A controlled anatomy tension/release can be a complete study action. A larger character story requires readable thought, action and reaction.

A raster plate plus small pinned mesh deformations is an **illustrated cinemagraph**. It preserves the finished drawing while suggesting breath, load, a subtle lean or material settling. It cannot create newly exposed surfaces, independent closed eyelids, a new mouth interior, or a major viewpoint change. Use layered artwork, an articulated rig, authored poses, or another suitable animation workflow for those requirements. Do not label lighting changes alone as character acting.

## Pinned-plate authoring

The realism corpus stores the still at `corpus/plates/<id>.png`. Authoring entries in `corpus/realism/*.json` contain the source ID, exact art prompt, observations, review notes, actual normalized landmarks and optional `rigOverride`. Composition writes `corpus/animated/<id>.json` and `<id>.html`; the HTML loads `runtime/atelier.mjs` through relative paths.

The runtime samples the source plate on a mesh and computes frames from absolute time. It is not accumulated simulation. Never depend on wall-clock randomness, hover or a previous seek to produce the exported frame.

Each region has `name`, normalized `center` and elliptical `radius`, `translate`, optional `rotate` and `pivot`, `phase`, and `delay`. Translation values are pixels in the 1200 × 900 composition; rotation is degrees. Pin centers/radii are normalized. Maximum supported counts are **12 regions and 8 pins**. Overlapping regions add their displacement, so inspect the combined result.

Calibrate against the final plate rather than reusing another image's rig:

- Locate actual joints, silhouette, digits, contact patches and prop grips. Diagonal hands and overhead feet need different regions from front-facing defaults.
- Prefer narrow, modest local displacement for muscle tension or a small load shift. Long bones retain length; wrists, knees and ankles remain connected.
- Pin supporting heel/ball/toe pads, hands gripping objects, and nonmoving joint attachments. Pins also protect the contact shadow where needed.
- Keep deformation away from large blank paper regions and image boundaries. Reject rippling paper, rubbery anatomy, sliding contact or warped props.
- Use illumination only where the scene motivates it, such as a lantern glow. Preserve the plate's main light direction.
- If the requested amplitude or action breaks silhouette, occlusion or structure, change the animation method instead of increasing a mesh warp.

All regions must return smoothly. Compare first/last poses and motion near the boundary; matching positions alone cannot prove a seamless velocity transition.

## Project workflow

From this repository after editing plates or authoring metadata:

~~~sh
npm run compose -- 105214
npm run catalog
npm run check -- 105214
npm run render -- 105214
npm run verify
npm run install-skill
~~~

Replace the ID with the affected study or studies. For a full corpus revision, run compose, check and render without ID arguments, then the full verify. Catalog rebuilds the manifest and README from authoring metadata; edit `scripts/catalog.mjs` for persistent introduction changes.

Open each generated `qa/realism/<id>-motion.jpg` contact sheet and the actual preview. The check covers absolute-time repeatability, matching endpoints, visible pixel change and browser errors; it does not establish anatomy or expressive quality. Render then verify the encoded film. The installer refreshes the portable assets and installed skill after the source corpus is ready.

## Portable rendering

The installed skill contains plates and compositions under `assets/corpus/`, runtime files under `assets/runtime/`, and the helper `scripts/render-cinemagraph.mjs`. Preserve that relative layout when copying an example.

Requirements: Node.js 22+, local Chrome/Chromium, FFmpeg and a compatible project installation of `playwright-core` (tested here with `1.64.1`). Set `CHROME_PATH` when the browser is outside standard locations. From the skill folder, with dependency resolution available:

~~~sh
node scripts/render-cinemagraph.mjs assets/corpus/animated/105232.html output.mp4
~~~

An optional third positional argument sets the asset root for a copied composition. The helper serves local files, seeks the canvas at exact frame times, and encodes silent H.264 at 1200 × 900, 30 fps, 210 frames. It also exports `openBrowser`, `mountFilm`, `frame`, and `renderFilm` for project scripts. Rendering is local, not a hosted service.

## Film inspection and repair

Inspect the actual start, anticipation, strongest action, return, settling, and endpoint at useful size. Play the result at normal speed, then scrub slowly around any suspicious change.

| Gate | Reject or repair |
| --- | --- |
| Structure | Detached joints, changing digit counts, elastic bones, bent prop geometry or new seams. |
| Contact and light | Sliding feet, floating hands, moving ground shadows without a lift, contradictory illumination. |
| Cleanliness | Wavy paper, halos, texture swimming, edge tearing, clipping or abrupt blur. |
| Acting | Unreadable action, unintended emotion, perpetual restless motion, camera drift presented as articulation. |
| Loop and seeking | A visible jump, velocity snap or different frame reached by reverse seeking. |
| Encoded film | Wrong duration/count/resolution, frozen export, artifacts, or mismatch with the browser pose. |

Identify the exact visible defect and revise the responsible plate, region, pin, timing, or animation method. Re-render the affected frames; compare before/after and recheck attachments and contact at the new extreme. Repeat until material faults are resolved. Record residual limits honestly; neither a numeric self-score nor passing checks certifies artistic quality.

Use `ffprobe` to verify duration, frame count, dimensions, frame rate and codec. Inspect a frame decoded from the final MP4 against the browser at the same timestamp. The project verify script performs metadata and decoded-frame comparisons; visual inspection remains necessary.

Test delivered gallery controls at narrow width: keyboard operation, play/pause, replay, reverse seek, reduced-motion behavior, hidden-tab pausing, and browser errors. Keep UI out of exported artwork.

## Optional native SVG workflow

For a genuinely vector-appropriate study, use self-contained semantic groups, stable joint pivots and `dur="7s"` SMIL or deterministic authored transforms. Matching path topology is necessary for morphs. Use explicit easing and matching endpoints; do not stretch a flat path to fake a major turn.

A deterministic SVG preview calls `pauseAnimations()` and `setCurrentTime(seconds)`. The retained `scripts/lint_svg.py` and `scripts/render-svg.mjs` helpers support this mode; the vector renderer intentionally rejects embedded raster images, scripts and remote assets. They are not the renderer for the realism plates.

Standalone SMIL may autoplay and does not automatically honor reduced motion. Supply the static vector variant and accessible external controls. Preserve archived vector studies as historical outputs rather than presenting them as the new realism edition.
