# FORM implementation map

Confirm these hooks against the current source before editing; the architecture may evolve. All paths are project-relative.

## Study registration and integration

| Location | What an extension must account for |
| --- | --- |
| `three/character/anatomy.mjs` | `STUDIES`, `DESCRIPTIONS`, `PART_ORDER`, `getAnatomyMetadata()`, `createAnatomyStudy()`, region classification, pose branches and exported factories |
| `three/app.mjs` | Factory imports/map, default selected region, hash route, cached models, transport, labels and camera fitting |
| `three/index.html` | Study buttons, accessible labels, initial heading and study-count copy |
| `three/style.css` | Navigation sizing when the set grows |
| `scripts/catalog-three.mjs` | Per-study `briefs`, reproduction prompts, source references, manifest scope and generated count text |
| `scripts/check-three.mjs`, `scripts/playback-three.mjs`, `scripts/check-project.mjs` | Existing explicit study-ID lists; extend them or derive coverage from authoritative metadata so new actions are tested |
| `README.md`, `index.html` | Product counts and descriptions only when the collection changes; root README remains hand-authored |

The study contract consumed by `three/app.mjs` includes `group`, `character`, `parts`, `update(t)`, `motionBounds`, `fullBounds`, `pickingMeshes`, `occlusionMeshes`, `setSelection(id)`, `resolveHit(hit)`, `title`, `subtitle`, `camera`, `beats`, `metrics(t)` and `poseState`. Preserve that contract when extracting a separate study module. A new `STUDIES` entry without classification and pose logic will not produce a functioning study.

Generate `three/manifest.json` and `three/README.md` through `npm run catalog:three`; edit the catalog source rather than its generated output. Update header/footer descriptions and set counts where they become inaccurate. Do not alter `README-STUDY.md` history to imply a new experiment already occurred.

## Character and movement

`three/character/character.mjs` loads local GLBs and joint sidecar data with `loadCharacter()`. Await loading before calling `createCharacter()`. The factory clones the skeleton and materials, while some geometry remains shared. Treat shared geometry as immutable unless deliberately changing the common identity; clone writable attributes before adding per-instance deformation or normal reconstruction.

`resetPose()` restores captured bones, clears morph influences and resets the character group. `anatomy.mjs` calls it at the start of each `update(t)`, applies its relaxed standing base pose, then derives the action from `actionAt(t)` in `three/geometry.mjs`. Preserve this absolute evaluation order. Use the imported bone names and local axes, not guessed world-axis finger rotations. Existing helpers distinguish world rotations, local rotations, bone aiming and world translation.

Current digit chains are `index`, `middle`, `ring`, `pinky` and `thumb`, with `_01_`, `_02_`, `_03_` joints and `_l`/`_r` suffixes. Check the actual skeleton and skin weights before changing chains or adding controls. Mirrored limbs do not necessarily share the same signed rotation. The current soft curl is not proof that a stronger fist or grasp will avoid collisions.

Leg and heel studies preserve the reference `ball_l` position by correcting the pelvis after joint rotation. New asymmetric support or stepping actions require their own contact reasoning; do not carry that bilateral correction over blindly. Check visible plantar contact and toe roots, not just the bone's numeric position.

Motion bounds currently sample `0, 1.25, 2.5, 3.75, 5` seconds. Add relevant extrema if the new action has peaks between these times. Bounds must encompass the evaluated moving skin, and camera framing must work on narrow screens. Keep the app's camera owner model: user intent cancels guidance. Do not animate OrbitControls and a second camera controller concurrently.

Five seconds occurs in the action envelope, transport, guide camera, timeline, metrics, catalog and checks. An explicitly requested different duration needs a coherent change across those consumers rather than changing only an animation label.

## Regions, anchors and picking

`three/character/regions.mjs` provides `createSurfaceRegions()` and `createPosedSurfacePicker()`:

- Region faces refer to source-body triangle indices. Classification in `anatomy.mjs` uses rest coordinates and dominant skin weights; these approximate surface regions, not segmented internal muscles.
- Overlays reuse compacted source triangles, skin weights and morph targets. Keep their skeleton, bind transforms and morph influences synchronized. A slightly offset, feathered surface avoids floating patches and harsh edges.
- `anchorPoint` is a rest mesh-local point mapped onto a source face; explicit anchors use `faceIndex` and barycentric weights. Choose visible front/posterior surfaces deliberately rather than attaching a label to a guessed bone center.
- Update in the existing sequence: pose → `character.updateWorld()` → `regions.update()` → world matrices → `picker.update()`. The collision surface contains evaluated skin positions and retains source face indices. Use it for selection and occlusion rather than raycasting stale bind-pose geometry.
- Wardrobe hits are mapped back through source triangle indices. Rebuilding topology or garment indexing requires preserving or rebuilding that correspondence.
- Back selection intentionally fades hair through `character.setInspectionRegion(id)`. Clearing selection restores its prior materials and shadows; preserve both directions of this interaction.

## Validation that covers the new action

After motion, region or scene integration changes, run from the project root:

```sh
npm run catalog:three
npm run check:three
npm run playback:three
npm run check:project
```

Inspect actual report IDs to confirm new studies were exercised. Existing checks enumerate the original five studies in more than one loop, including mobile coverage. Passing those unchanged lists proves nothing about an added sixth study. Update meaningful checks for the new behavior, including any additional contact or articulation invariant.

`window.atlas` exposes `setStudy`, `seek`, `selectPart`, `model`, `camera` and `state` for browser QA. The model's posed collision surface exposes CPU-evaluated vertices; unchanged GLB bind positions are not evidence of static motion. Check finite evaluated vertices/normals, genuine local motion, exact 0/5-second pose equality and repeatable seeking to the same time from earlier and later times. Confirm anchors remain near their evaluated barycentric surface positions during the action and camera rotation.

Use `scripts/browser.mjs` with installed Chrome/Chromium. Sample unpaused playback through a complete boundary as well as deterministic seeks; manual frame captures alone do not test the live loop. Reuse existing report conventions under `qa/three/`, recording current source hashes and inspected views. Do not overwrite archived evidence.

Shared character, material, region, camera-runtime or studio changes also require affected MUSE checks (`npm run check:expressions` and `npm run playback:expressions`) and relevant visual review. For documentation-only edits, use link/import/navigation checks rather than geometry suites. Run `npm run bundle:three` when refreshing the distributable; the bundle must keep current product files separate from the archive and retired skills.

There is no static-only option in the current `check-project.mjs`; it also opens browsers, evaluates geometry and writes its report. For a documentation-only task, inspect relative link targets and heading anchors directly instead of treating that full command as a lightweight link check.
