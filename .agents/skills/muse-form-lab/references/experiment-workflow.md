# Experiment workflow and record

Paths below are relative to the selected project root. Inspect the current implementation before relying on these hooks; this is a map of the maintained MUSE + FORM architecture, not a replacement API specification.

## Reuse points

| Need | Current source | Integration detail |
| --- | --- | --- |
| Character and identity | `three/character/character.mjs` | Await `loadCharacter()` before `createCharacter()`. Each independent view needs its own character instance. `resetPose()`, `setMorph()` and `updateWorld()` are the common composition points. |
| Facial performance | `expressions/character-face.mjs` | Recipes, IDs, phase envelopes, `createFace()` and metadata. The adapter resets bones and morphs before applying a pose; two adapters cannot own the same instance. |
| Body and limb performance | `three/character/anatomy.mjs` | Current study factories, classifications, parts, camera bounds and absolute-time movement. Use its returned study contract as the example for a new body adapter. |
| Surface inspection | `three/character/regions.mjs` | Regions, posed picking and anchors must evaluate the same deformed surface as the character, including wardrobe where applicable. |
| Facial shading | `expressions/facial-normals.mjs` | Combined-pose normals and private mutable buffers. Preserve neutral shading and instance independence. |
| Time and camera | `three/runtime/motion.mjs`, `three/runtime/camera-rig.mjs` | Reuse deterministic transport and camera ownership. A manual gesture takes control from guided motion. |
| Lighting and materials | `expressions/studio.mjs`, `three/character/materials.mjs` | Match baseline light/exposure for comparisons. Avoid changing shared defaults to test one isolated alternative. |
| Serving and browser checks | `scripts/serve.mjs`, `scripts/browser.mjs` | The server resolves static directories, including a new experiment directory. `openBrowser()` uses installed Chrome/Chromium; inspect existing checks for setup and cleanup. |

A page at `experiments/<slug>/index.html` is two levels below the project root. Its import map can resolve `three` to `../../three/vendor/three.module.js` and `three/addons/` to `../../three/vendor/addons/`. Module imports and CSS paths must reflect their own file location. Serve over HTTP and check real network requests; a source file that parses can still fail on a wrong asset URL.

Do not assume copying `app.mjs` is enough: current apps expect specific DOM controls, study IDs, factory contracts and model metadata. Reuse modules or adapt that contract deliberately. Dispose of experiment-owned render targets, event handlers and GPU resources when replacing a view; do not dispose shared cached assets still used elsewhere. The current character and adapters have no aggregate disposal API, so track ownership explicitly instead of assuming `model.dispose()` exists. For split views, keep skeletons, morph weights and writable normal buffers independent while sharing immutable data where safe.

## Sets and registration

For a set in an existing viewer, audit the recipe/factory map, navigation, default selections, catalog generator, display counts, route checks and playback checks together. The current catalogs have product-specific briefs; an additional recipe can require an added brief. Generate catalogs from their source metadata, without replacing the hand-authored root READMEs.

For an independent experiment, use a small local list of study IDs with titles, intent and duration if that helps keep navigation and checks aligned. Do not invent a central plugin or set registry that does not exist. Provide a runnable route such as `/experiments/<slug>/` and exercise each study there. The current `check-project.mjs` does not walk `experiments/` or exercise new experiment routes; add a targeted verifier using the browser/server helpers rather than counting its unchanged result as coverage. Product bundling currently includes an explicit set of files/folders: new experiment code is not automatically packaged. If delivery needs the portable bundle, update its inclusion rules and verify an extracted bundle can resolve all shared dependencies.

An experiment can remain local without being linked from the main launcher. Document its route so the user can review it. Promote it into MUSE or FORM only when that is the requested outcome, preserving existing routes and examples.

For documentation-only changes, inspect local link targets and heading anchors directly. There is currently no static-only option in `check-project.mjs`: it also opens the existing viewers, evaluates geometry and writes its report. Do not describe that full command as a lightweight documentation check.

## Experiment record

Use this compact format in the experiment's README or another user-selected record. Fill it with actual observations; omit fields that do not apply. A planned check must remain marked as planned until executed.

```markdown
# [Experiment title]

Status: [prototype / reviewed / integrated; name remaining limits]

## Intent and prompt
[What the learner or artist should be able to observe. Include the reusable
prompt and distinguish it from any verbatim original request.]

## Baseline and changes
[Source revision and any uncommitted baseline changes; modules/assets reused;
new study IDs, route, duration; the variable or performance being changed.]

## Run and inspect
[Exact launch command and route; controls; rest, peak and recovery times;
camera presets and any close-up needed to judge the result.]

## Evidence and repairs
[Actual capture paths and times, camera/crop, browser/viewport, checks executed
and their outcome. Separate visual observations from measured invariants.
Record each defect, its cause if established, the repair and the reinspection.]

## Sources and limits
[License evidence for added assets, actual limitations, unresolved defects and
the next useful test. Do not claim medical accuracy or unperformed validation.]
```

When publishing a comparison collage, preserve source paths, source revision or hashes, and crop information. Label integrated before/after images separately from a controlled single-variable diagnostic. Historical collages and source manifests in `docs/study/` demonstrate this distinction; keep those records unchanged.
