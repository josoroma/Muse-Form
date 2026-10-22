# Seven seconds, deliberately

## Timing contract

The corpus uses seven-second seamless loops. A later user may request a one-shot story that holds its ending instead; state that choice rather than imposing a loop. Seven seconds at 30 fps is **210 frames**. Export frames `n / 30` for `n = 0…209`. The mathematical endpoint `t = 7` is checked separately against `t = 0`; it is not an extra video frame.

An adaptable story rhythm, authored for this skill:

| Time | Purpose |
| --- | --- |
| 0–0.8 s | Read the character and situation. |
| 0.8–1.4 s | Thought, eye lead, weight shift, anticipation. |
| 1.4–3.8 s | One clear action on an appropriate arc. |
| 3.8–5.5 s | Reaction and delayed hair, cloth, fingers, ears, or tail. |
| 5.5–7.0 s | Settle and resolve; reconnect to the starting pose for a loop. |

Adapt the beats to the action; do not force all eyes, hands, and full scenes to use identical timings. Stagger secondary motion relative to the main action. Use a few settled poses and smooth transitions instead of continuous restless movement. Anticipation should clarify what will happen. Keep facial timing subordinate to the intended emotion.

For physical motion, distinguish a root translation from joint rotation and surface deformation. Heavy masses accelerate and settle more slowly; a hand or ribbon may overshoot. Preserve supporting contacts. For a study plate, a meaningful moving anatomy contour can complement restrained articulation, but do not imply that a moving light wash is a complete character action.

## Native SVG implementation

SMIL animations use `dur="7s"`, `repeatCount="indefinite"`, explicit `values`, and normalized `keyTimes` for a loop. First and last values match. Use smooth timing (`calcMode="spline"` with matching `keySplines`) or analytic cyclic motion when appropriate. Avoid accidental uniform motion from missing timing information. Nested groups separate rest transforms and animated transforms. If path data is interpolated, command topology must match across poses.

Use a fixed SVG layout with named groups. A deterministic preview calls `svg.pauseAnimations()` and `svg.setCurrentTime(seconds)`. The preview owns one requestAnimationFrame clock; pause and seek do not require accumulated simulation history. Export samples the exact same SVG at absolute times. Do not depend on hover, wall-clock random values, network assets, or live animation state for the exported frame.

Standalone animated SVGs autoplay in many embedding contexts, and SMIL does not automatically honor reduced-motion preferences. Supply the static SVG too. The corpus gallery starts paused, offers explicit playback, and pauses when the page is hidden.

## Render helper

Requirements: Node.js 22+, Chrome or Chromium, FFmpeg, and the renderer's tested `playwright-core@1.64.1`. In an existing project, prefer its compatible installed dependency; otherwise install the tested version as a project development dependency:

```sh
npm install --save-dev --save-exact playwright-core@1.64.1
python3 /absolute/path/to/seven-second-storytelling/scripts/lint_svg.py drawing.animated.svg
node /absolute/path/to/seven-second-storytelling/scripts/render-svg.mjs drawing.animated.svg film.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,nb_frames,codec_name:format=duration -of json film.mp4
```

Set `CHROME_PATH` if Chrome is not in a standard location. Run from the project containing the Playwright dependency. The helper intentionally rejects scripts, embedded raster images, and external asset references. It produces silent H.264, 1200 × 900, 30 fps, 210-frame MP4. It uses a local browser, not HyperFrames, Remotion, or a hosted renderer.

## Review that matters

- Inspect six poses: beginning, intention, action extreme, reaction, settling, and endpoint. Look for unwanted silhouette collisions, detached parts, clipped shadows, changing finger counts, and expression ambiguity. Review adjacent frames around any sudden change.
- Sample one timestamp after different seek orders. Its pixels should match. Compare the opening and mathematical endpoint. Inspect the final-to-first transition as well as the exact endpoint; position equality alone does not prove smooth velocity.
- Check visible motion actually occurs. Valid animation tags and a successful encoder are not evidence of a meaningful gesture.
- Verify encoded duration, frame count, dimensions, frame rate, and codec with ffprobe. Extract a frame from the final MP4 and compare it to the same browser timestamp. Inspect the decoded frame.
- Verify a narrow layout, keyboard controls, pause, replay, reverse scrubbing, reduced motion, and browser errors in any delivered gallery. Keep UI out of the exported artwork.

The project scripts automate structural checks, pixel repeatability, contact sheets, export metadata, and UI checks. They cannot certify expressive anatomy or professional artistic quality; those require actual visual review and user judgment.
