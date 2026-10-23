import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ROOT } from './serve.mjs';
import { getAnatomyMetadata } from '../three/character/anatomy.mjs';

const common = 'Use the shared adult female character from the licensed CC0 MakeHuman-derived GLB, with its continuous human topology, 53-bone rig, skin weights and embedded textures. Bake one fixed original identity with blonde hair, blue eyes, soft facial contours and a neutral anatomical bodysuit; use exactly the same identity in FORM and MUSE. Keep shoulders, clavicles, waist, hips, limbs, hands and feet organically connected. Use the existing charcoal stage, serif interface, soft studio illumination and mint selection accent. Selected regions reuse the character surface triangles, with translucent feathered overlays and anchors that follow the evaluated skinned surface. Keep the five-second timeline, responsive controls and guided camera; manual orbit interrupts guidance. Restore the exact neutral pose at five seconds. ';
const briefs = {
  body: { references: ['105214','105215','105218','105219'], prompt: 'Frame the complete character in a relaxed standing pose. Animate a controlled reach and return through the clavicle, shoulder, elbow, wrist and fingers, with a small trunk counter-turn and head response. Keep both feet supported. Preserve selectable Pectoralis region, Back and Pelvis surfaces, plus the abdominal wall, shoulder and head. Inspect front, profile, three-quarter and posterior silhouettes; do not add circular chest markings.' },
  arm: { references: ['105215'], prompt: 'Frame the same character’s arm from shoulder through fingertips. Bend the forearm at its anatomical elbow pivot while the shoulder and upper arm remain coherent. Let the attached hand travel with the forearm and soften the fingers into the gesture. Provide selectable deltoid, biceps, triceps, forearm and hand/wrist regions. Keep the source skin continuous at shoulder, elbow and wrist; the selected surface indicates a region rather than isolated internal muscle anatomy.' },
  hand: { references: ['105216','105217'], prompt: 'Closely frame the same skinned character’s hand, retaining the original palm, finger webs, thumb base, nails and graduated digit proportions. Author an ordered soft closing wave through the knuckles and phalangeal joints, with the ulnar fingers starting slightly earlier and the thumb turning toward the palm. Keep the little finger rooted in the ulnar palm. Avoid intersections and abrupt joint angles. Provide selectable palm, thenar region, thumb and individual fingers, with labels attached to their moving surface.' },
  leg: { references: ['105218','105219','105220'], prompt: 'Frame the same character’s thigh, knee, calf and attached foot. Author a shallow supported bend shared across the hip, knee and ankle, then recover. Correct the pelvis position to preserve forefoot support. Keep continuous thigh-to-knee and calf-to-ankle transitions, with selectable anterior thigh, posterior thigh, knee and calf regions. Inspect the supporting contact and the contour throughout the five-second movement.' },
  foot: { references: ['105221','105222','105223'], prompt: 'Frame the same character’s ankle and complete five-toed foot. Raise the heel through the foot/forefoot joint chain while the forefoot remains supported, hold briefly, and settle. Preserve the continuous arch, heel, instep and toe roots, especially the short lateral little toe. Provide selectable ankle, dorsum, forefoot/toes and heel surfaces. Inspect frontal, medial, lateral, three-quarter and underside views at rest and peak; the toes must remain part of the same connected skin surface.' },
};
const method = 'Licensed CC0 MakeHuman-derived GLB topology, textures and skinning; one locally selected adult identity; authored deterministic skeletal animation; surface-triangle overlays and posed anchors. The mesh is externally authored asset data, not a new procedural sculpt or scan.';
const studies = Object.entries(briefs).map(([id, brief]) => {
  const model = getAnatomyMetadata(id);
  return { id, title: model.title, action: model.subtitle, duration: 5, view: `index.html#${id}`, source: 'character/anatomy.mjs', model: 'character/assets/adult-female-source.glb', svgReferenceIDs: brief.references, prompt: common + brief.prompt, method, parts: model.parts, beats: model.beats };
});
const manifest = { title: 'FORM — Anatomy in motion', renderer: 'Three.js 0.186.1', duration: 5, edition: 3, identity: 'One original adult blonde woman with blue eyes, shared with MUSE.', scope: 'Five views of one licensed skinned character: full body, arm, hand, leg and foot. The accepted SVG corpus remains separate.', assetLicense: 'CC0-1.0', assetProvenance: 'character/assets/README.md', studies };
await writeFile(resolve(ROOT, 'three/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
await writeFile(resolve(ROOT, 'three/README.md'), `# FORM — Anatomy in motion

Five anatomical studies of **one shared adult female character**: full body, arm, hand, leg and foot. The licensed skinned GLB supplies continuous human topology, connected fingers and toes, and embedded skin and eye maps. Local code sets the blonde, blue-eyed identity, materials and five-second movements. [MUSE](../expressions/index.html) uses the same character for facial acting.

[Open FORM](index.html) · [Portable source bundle](../exports/form-and-muse-threejs.zip) · [SVG collection](../index.html) · [Character assets and license](character/assets/README.md)

![Hand during the closing gesture](../qa/three/hand-peak.png)

## Run locally

From the project root:

~~~sh
npm ci
npm run build:three
npm start
~~~

Open **http://127.0.0.1:4173/three/**. The included vendor files also allow running node scripts/serve.mjs directly. Serve over HTTP so JavaScript modules and GLBs load correctly. The browser loads the character, textures and engine locally; no external model service or video encoder is required.

## Inspect the movement

- Choose a study, play or pause, and scrub from 0 to 5 seconds. Phase buttons jump to useful poses.
- Select a surface, label or named button. The mint overlay, explanation and label refer to the same underlying surface triangles.
- Inspect Pectoralis region, Back and Pelvis in the full-body study. The bodysuit and region overlays follow the body skin.
- Drag to orbit, right-drag to pan and scroll or use the visible buttons to zoom. Manual gestures interrupt guidance; enable **Guided camera** to resume it.
- Use Overview, Front, Side or Frame this structure. Canvas keyboard shortcuts are arrows to orbit, +/− to zoom and Home for overview.
- Reduced motion starts paused. Hidden tabs stop advancing. A WebGL fallback links to the native SVG collection.

This is an illustrative skinned character, not a body scan or a medically validated anatomical simulator. Surface labels indicate approximate regions beneath the skin and clothing. Highlights show selection, not muscle activation; movement percentages describe the authored animation. [Sources and scope](SOURCES.md) explain those limits.

## Source and reproduction

| File | Purpose |
| --- | --- |
| [app.mjs](app.mjs) | Rendering, camera ownership, selection, labels and transport |
| [character/character.mjs](character/character.mjs) | Shared identity, GLB loading, skeleton fitting, cloning and bodysuit |
| [character/anatomy.mjs](character/anatomy.mjs) | Five skeletal movement studies and metadata |
| [character/materials.mjs](character/materials.mjs) | Skin, blue eyes, blonde hair, oral surfaces and clothing |
| [character/regions.mjs](character/regions.mjs) | Conforming overlays, posed anchors and cached picking surface |
| [character/assets/adult-female-source.glb](character/assets/adult-female-source.glb) | CC0 character mesh, rig, textures and facial morphs |
| [Character provenance](character/assets/README.md) | Pinned upstream sources, licenses and material limitations |
| [Expression transfer builder](../scripts/build-character-expressions.py) | Reproducible transfer of official CC0 facial targets to the GLB |
| [manifest.json](manifest.json) | Complete prompts, source IDs, structures and phases |
| [vendor/LICENSE](vendor/LICENSE) | Three.js MIT license |

The body and hair derive from CC0 MakeHuman assets exported by Kasper Olesen’s CharacterCreator. Its generator/runtime code is not imported. The new local adapters consume standard glTF data. The expression builder uses Python with NumPy and SciPy, the pinned source GLB, and selected CC0 inputs preserved in character/assets/makehuman-expression-inputs.zip. Camera and timeline helpers were adapted from the locally supplied Taster skill. Three.js is pinned to 0.186.1.

~~~sh
npm run catalog:three
npm run check:three
npm run playback:three
npm run bundle:three
~~~

[Browser checks](../qa/three/checks.json) inspect evaluated skinned geometry, exact endpoints, reverse seeking and interactions. [Playback samples](../qa/three/playback.json) inspect unpaused motion. [Visual review](../qa/three/art-review.json) records inspected views and repairs; these checks do not certify anatomical or artistic accuracy. The preceding procedural edition is preserved in [archive/procedural-v3](../archive/procedural-v3).

## Corpus prompts

${studies.map(s => `### ${s.id} — ${s.title}\n\n[Open study](${s.view}) · [Movement source](${s.source}) · [Character GLB](${s.model}) · SVG reference IDs: ${s.svgReferenceIDs.join(', ')}.\n\n${s.prompt}\n\n**Method:** ${s.method}\n\n**Action:** ${s.beats.map(b => `${b.label}: ${b.description}`).join(' ')}\n`).join('\n')}`);
console.log('Cataloged five shared-character anatomy studies from model metadata.');
