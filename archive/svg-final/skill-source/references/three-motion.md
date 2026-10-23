# Three.js anatomy motion

Use this mode when the user requests Three.js, a real 3D anatomy scene, or interactive depth and camera inspection. Deliver a runnable HTML/JavaScript scene with its source geometry. Keep the accepted static and animated SVGs intact. Five seconds remains the default loop duration; a user-specified duration takes precedence.

## Reusable explorer

Start with [FORM](../assets/three/index.html) for anatomy or [MUSE](../assets/expressions/index.html) for facial acting. They remain separate views. Copy `assets/three/` and `assets/expressions/` as siblings: their engine, studio, stylesheet and runtime use local sibling imports. Preserve the engine files, relative paths and license. Keep both source directories even when linking to only one viewer. Serve over local HTTP rather than opening ES modules with `file://`.

The supplied edition contains five studies: full-body reach, elbow flexion, hand closing/opening, loaded leg bend, and foot heel raise. Reuse only the requested scenes. It uses a continuous licensed CC0 skinned human body with authored poses. The anatomical regions are illustrative, not a scanned subject or validated biomechanical model. [SOURCES.md](../assets/three/SOURCES.md) contains source-backed label wording and scope.

MUSE adds eight expressions on one original adult woman: joy, sadness, anger, fear, surprise, disgust, wink and laughter. Its geometry and review requirements are described in [facial acting](facial-expression.md). The expression names identify authored performance choices rather than inferred emotions in a real person.

- `character/character.mjs`: asynchronous asset loading, one adult identity, independent skeleton clones, fitted bodysuit.
- `character/anatomy.mjs`: five body/limb studies and deterministic skeletal poses.
- `character/regions.mjs`: compact skinned surface overlays, posed collision mesh and barycentric anchors.
- `character/materials.mjs`: shared PBR skin, blue eyes, blonde hair and neutral clothing.
- `character/facial-contour.mjs` and `dentition.mjs`: fixed lower-face sculpt and refinement of the licensed dental surface; keep their expression and skin attachments.
- `character/assets/README.md`: pinned provenance, CC0 evidence and asset limitations.
- `runtime/motion.mjs`: transport and time-based pose helpers.
- `runtime/camera-rig.mjs`: directed framing and interruptible OrbitControls.
- `app.mjs`: selection, projected labels, playback and inspection UI.

Each study exposes a `group`, `parts`, `update(tSeconds)`, camera suggestion, explanatory beats and metrics. Each part has a stable `id`, `name`, `description`, selectable `object` and local `anchor`. The posed collision proxy preserves original triangle IDs; `resolveHit` maps them to the same semantic part used by buttons and labels. Selected overlays share the source skeleton and morph weights, and label anchors evaluate the current source triangle.

## Form and articulation

Build recognizable volumes before adding explanatory overlays. Use smooth continuous profiles, resolved joint transitions and quiet surface landmarks. Inspect normals and silhouettes from front, side and three-quarter views; smooth lighting cannot hide a broken form. Update geometry bounds after deformation when needed for framing, picking or culling.

Use hierarchical pivots for finger segments and rigid limb motion, with localized surface deformation where a continuous contour crosses a joint. Derive every pose from stored rest geometry and the requested time; do not accumulate rotations or deformation frame by frame. Keep bone lengths credible, finger webs intact, the thumb base attached and held objects in their grip. A heel raise keeps the supporting forefoot connected to the ground. Muscle fullness may clarify motion, but should not imply measured force or activation.

For the hand study, skin should remain continuous across the palm, knuckles and finger bends. Place nail plates within the distal dorsal beds, carried by the same joint deformation; check their borders against the surrounding skin through the grasp. Surface creases explain joints without exposing separate capsule seams.

Inspect the lateral little digit from below and in profile. A toe root must enter the metatarsal volume and remain joined during heel rise; a pinky root must join the hypothenar side of the palm without a visible cap or floating cylinder. Check the user's screenshots to distinguish a little toe from a little finger, and preserve the established gesture while repairing the actual attachment.

For full-body characters, prefer a documented licensed skinned mesh with continuous shoulders, pelvis, hands and feet. Preserve license evidence and keep asset licenses separate from generator/runtime-code licenses. Keep one identity in FORM and MUSE. Framing should include the union of the motion extremes, including depth in camera space, with room for labels. Test the moving scene before choosing its default camera.

## Labels and camera

Use concise wording supported by authoritative anatomy sources, such as the OpenStax references in `SOURCES.md`. Name broad surface overlays as regions when they do not isolate an individual muscle. Do not claim visible shortening, rotation or contact that the authored geometry does not show. Metrics describe the model's authored pose, not measurements of a real person.

Keep anchors attached to the same joint hierarchy or deformation as their structures. Update world matrices before projecting labels. Hide or dim occluded anchors, avoid overlapping labels, and keep selection available through keyboard-accessible buttons. Highlights should preserve the form and remain attached through the motion.

Only one system owns the camera at a time. User orbit, pan or zoom immediately interrupts a scripted move; a deliberate guided-view action may restore it. A scrubbed timeline must reproduce the same directed camera pose as well as the same anatomy pose. Manual inspection must not be pulled back by a simultaneous animation. Fit, front, side and focus actions should remain usable at mobile sizes.

## Browser review

Review actual browser rendering, not only mesh counts or coordinate tests. Inspect rest, each authored extreme, return and the loop boundary; then sample unpaused playback. Check joint continuity, finger collisions, support, clipping, normal seams, highlights and moving labels. Distinguish sampled playback inspection from continuous viewing in review notes.

Verify repeatable forward/reverse seeking, matching five-second endpoints, pause/restart/single-pass behavior, camera interruption and selection of visible structures. Test reduced motion, hidden-tab pause, touch/orbit controls, mobile framing and WebGL failure messaging. Repair concrete defects, recheck affected views and refresh the packaged source. Preserve source links and original-model attribution alongside the deliverable; no MP4 or 3D export format is implied by this mode.

For skinning QA, inspect the actual evaluated body surface, not only the immutable rest positions. Hash morph weights and bone matrices and compare posed vertices at 0 and 5 seconds. Proxy bounds must update before raycasting. Region overlays must not occlude their own anchors or create arbitrary opaque circles on the chest. Keep labels attached while orbiting, and frame attached limbs rather than replacing them with a disconnected primitive.
