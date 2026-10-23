# MUSE implementation map

All paths below are relative to the verified project root. These describe the current architecture, not a substitute for reading the selected checkout.

## Add an expression

| Concern | Current hook | Required coordination |
| --- | --- | --- |
| Recipe and identity | `expressions/character-face.mjs`: `EXPRESSION_IDS`, `EXPRESSIONS`, `createFace(id)` | Add a stable ID and metadata (`title`, `subtitle`, `action`, `detail`, `morphs`, optional head `pitch/yaw/roll`). Confirm each named `exp_…` target exists in the loaded mesh; unsupported targets can silently do nothing. |
| Acting and timing | Same module: `amountAt`, `winkAt`, `beatsFor`, `update(time)` | Current updates reset the pose, apply morphs with small feature delays, update facial normals, then world transforms, regions and posed picking. Preserve the dependency order. |
| Viewer registration | `expressions/app.mjs`: `factories`; `expressions/index.html`: `data-study` buttons | The factories currently repeat the eight IDs instead of importing `EXPRESSION_IDS`. Add a button, hash route and accessible pressed state without breaking existing routes. |
| Catalog | `scripts/catalog-expressions.mjs`: `actions`, introductory prose and counts | Add the study prompt and provenance. A genuinely new study can use `reference: null`; do not invent a historical SVG match. Run `npm run catalog:expressions` to write `expressions/README.md` and `expressions/manifest.json`. |
| Product counts | Root launcher, `README.md`, viewer navigation | Search for eight-expression claims and adjust only claims affected by the new set. Root READMEs remain hand-authored. |
| Validation | `scripts/check-expressions.mjs`, `scripts/playback-expressions.mjs`, `scripts/check-project.mjs` | Each currently has an explicit eight-ID list. The expression check expects eight distinct peaks; the project check expects thirteen total studies. Update coverage/counts or derive them from canonical registrations. Verify the new route is actually exercised. |

The model receives an absolute time and resets before evaluation. Current rest/peak/recovery landmarks are 0, 2.5 and 4.25 seconds, with exactly matching 0/5 endpoints. Do not add accumulating frame rotations or unseeded noise. Use new envelopes only when the acting needs them, retaining seekability. A subtle one-feature study may need a targeted movement assertion rather than inheriting the current `localFeaturesChanged.length >= 3` threshold; do not simply remove meaningful motion coverage.

For a genuinely unavailable expression target, inspect `scripts/build-character-expressions.py`, the CC0 input pack, `three/character/assets/README.md` and transfer reports before changing conversion. The builder is independently authored; do not import upstream GPL generator/runtime code. Ordinary new recipes do not require rebuilding the GLB.

## Refine facial quality without regressions

| Symptom | Inspect first | Preserve |
| --- | --- | --- |
| Broad gray/green patches around jaw or mouth | `three/character/materials.mjs`, base-color map, `expressions/studio.mjs` and light overrides in `expressions/app.mjs` | Compare albedo-only, neutral material/normal diagnostics and final light at identical camera/pose. Fine texture and lip/lid definition should survive complexion correction. Do not hide geometry defects with stronger light. |
| Triangular creases under combined expressions | `expressions/facial-normals.mjs` | It computes normals from the combined morph surface in a private instance buffer, restores neutral normals exactly and caches unchanged poses. Never mutate shared source attributes or let one instance alter another. |
| Wide or angular lower face | `three/character/facial-contour.mjs` and identity baking in `character.mjs` | Follow attached accessories, morph offsets and profile projection. Judge front, profile and three-quarter together. |
| Block-like teeth or filled mouth aperture | `three/character/dentition.mjs`, enamel/oral materials and jaw/lip recipes | Existing individual crowns and gingiva move as connected arches; the tongue is recessed onto the oral floor. Preserve jaw targets, root attachment, bite and upper/lower exposure. Avoid floating replacement teeth or a flat white strip. |
| Highlight/label drift | `three/character/regions.mjs` and definitions in `createFace` | Regions reuse skin triangles; anchors and picking follow evaluated skin/morph geometry. Inspect camera rotation, selection and recovery. |

Skin masks and facial-region bounds currently use rest-space coordinates for this identity. They are not general anatomical coordinates. A new explicitly requested character requires recalibration rather than blind reuse. Current skin uses PBR plus restrained diffuse wrap, not true volumetric subsurface scattering. Do not describe it as a medical simulation or exact celebrity likeness.

## Verification and delivery

Run from the verified root:

```sh
npm run catalog:expressions
npm run check:expressions
npm run playback:expressions
```

Run catalog generation only when metadata changed. The playback command reads `qa/expressions/checks.json`, so current checks must precede playback. `scripts/browser.mjs` uses installed Chrome/Chromium and supports `CHROME_PATH`; no historical skill browser dependency is needed. Browser inspection exposes `window.atlas` with `setStudy`, `seek`, `selectPart`, `render`, `model` and `state` for repeatable review.

Check finite evaluated skin vertices and normals, exact neutral endpoints, reverse seek, private normal ownership, actual lid closure, oral clipping and surface anchors. Use neutral and peak comparison plus real unpaused playback across the loop boundary. Inspect new tabs on mobile, labels after rotation and manual camera takeover. A newly added expression must appear in the fresh report with meaningful distinct motion.

If shared `three/character/` code changes, also run affected `npm run check:three` and `npm run playback:three` and inspect FORM. Refresh the current product ZIP with `npm run bundle:three` when delivering a changed runnable product. No video export is needed. Record fresh source hashes and review scope; do not relabel archived screenshots as new QA.

For documentation-only edits, check local links and heading anchors directly. The current `check-project.mjs` has no static-only mode; it also runs browser geometry checks and writes its report.
