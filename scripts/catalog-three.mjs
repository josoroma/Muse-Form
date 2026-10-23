import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ROOT } from './serve.mjs';
import { createBody, createArm } from '../three/upper-body.mjs';
import { createHand } from '../three/hand.mjs';
import { createLeg, createFoot } from '../three/lower-limb.mjs';

const briefs={
  body:{factory:createBody,source:'upper-body.mjs',references:['105214','105215','105218','105219'],prompt:'Create an original sculptural full-body anatomy study in Three.js. Build continuous ribcage, waist, pelvis, neck and cranial volumes, with sparse chest and facial contours; attach proportional articulated arms, hands, legs and five-toed feet. Use a quiet charcoal stage, cool stone surfaces, warm directional light and a cyan selected region. Animate a five-second reach-and-return: shoulder lift and elbow flexion, a slight trunk counter-turn and head response, with both feet planted. Keep head, shoulder, wrist and hip attachments closed. Add selectable anatomical regions and explanatory labels, and a modest guided camera arc that stops on manual orbit. Preserve matching start/end geometry.'},
  arm:{factory:createArm,source:'upper-body.mjs',references:['105215'],prompt:'Create an original native Three.js arm volume with a tapered upper arm, elbow, forearm and attached articulated hand. Give the deltoid, anterior biceps region, posterior triceps region, elbow and forearm distinct selectable identities. Keep the upper arm steady while the forearm bends around the elbow from 12 to 100 degrees over a five-second preparation, flexion, hold and release. Add modest biceps fullness without changing forearm length; the hand must remain attached and close its digits. Use smooth contour profiles, shared normals, restrained lighting, anchored labels and an interruptible guided camera.'},
  hand:{factory:createHand,source:'hand.mjs',references:['105216','105217'],prompt:'Build a clean organic Three.js hand from original contoured mesh surfaces. Establish a broad palm, thenar pad, wrist, five graduated digits, connected knuckles and a separate thumb opposition chain. Use three phalangeal segments per non-thumb finger and two beyond the thumb metacarpal; retain joint centers and consistent segment lengths. Over five seconds, gather the fingers, close a soft grasp, turn the thumb pad across the palm, hold, and release. Resolve palm and highlight boundaries with shared geometry rather than floating patches. Keep nails and creases subtle. Provide selectable finger/thenar regions, labels, a seekable timeline and a camera that yields to manual inspection.'},
  leg:{factory:createLeg,source:'lower-limb.mjs',references:['105218','105219','105220'],prompt:'Create a continuous Three.js leg anatomy study from the cropped thigh through knee, asymmetric calf, tibial ridge, Achilles region and a planted five-toed foot. Shape quadriceps and calf masses with quiet surface asymmetry. Animate a five-second loading bend and recovery: the knee advances, the thigh counter-rotates, the ankle attachment stays continuous, and the foot does not slide. Highlight selected surface regions rather than implying measured activation. Keep labels anchored to the deformed surface and show the same authored knee angle in the readout. Inspect rest, loaded peak, reverse seeking and the sole contact.'},
  foot:{factory:createFoot,source:'lower-limb.mjs',references:['105221','105222','105223'],prompt:'Build an original Three.js foot with one smooth ankle-to-heel-to-instep surface, a visible medial arch, metatarsal support and five separately formed toes with natural length hierarchy. Use restrained nail margins and joint creases. Animate a five-second heel rise of about 21 degrees around the ball of the foot, hold, and lower; toe tips remain supported while the proximal toes extend. Avoid a cylindrical ankle intersecting a shoe-like foot, folded loft surfaces, floating toes or drifting labels. Provide selectable dorsum, heel, ankle, forefoot and toe regions. Frame the union of all poses so toes and ankle remain visible throughout the guided camera arc.'}
};
const studies=[];
for(const [id,brief] of Object.entries(briefs)){
  const model=brief.factory();
  studies.push({id,title:model.title,action:model.subtitle,duration:5,view:`index.html#${id}`,source:brief.source,svgReferenceIDs:brief.references,prompt:brief.prompt,method:'Original procedural Three.js surface geometry and authored deterministic joint/mesh animation; no external model or scanned anatomy.',parts:model.parts.map(({id,name,description})=>({id,name,description})),beats:model.beats});
}
const manifest={title:'FORM — Anatomy in motion',renderer:'Three.js 0.186.1',duration:5,edition:1,scope:'Five simplified original 3D anatomy studies, separate from the accepted SVG corpus.',studies};
await writeFile(resolve(ROOT,'three/manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const readme=`# FORM — Anatomy in motion

Five original Three.js anatomy studies: **full body, arm, hand, leg and foot**. Each has a five-second movement, editable native 3D geometry, selectable structures, explanatory labels and an interruptible guided camera.

[Open the explorer](index.html) · [Portable source bundle](../exports/form-and-muse-threejs.zip) · [Existing SVG collection](../index.html) · [MUSE / Expressions](../expressions/index.html)

![Hand at the grasp pose](../qa/three/hand-peak.png)

## Run locally

From the project root:

~~~sh
npm ci
npm run build:three
npm start
~~~

Open **http://127.0.0.1:4173/three/**. The checked-in local vendor files also allow running node scripts/serve.mjs directly. Serve over HTTP; module imports need a local server rather than opening an HTML file from disk. No external asset requests or video encoder are needed.

## Inspect the movement

- Select a study, play or pause, and scrub anywhere from 0 to 5 seconds. Phase buttons jump to useful poses.
- Select a 3D form, its label or its named button. The same part ID drives highlight, explanation and anchor.
- Drag to orbit; use right-drag to pan and the wheel or visible buttons to zoom. A pointer gesture immediately releases the guided camera. Re-enable **Guided camera** explicitly to resume it.
- Use Overview, Front, Side or Frame this structure. When the canvas has keyboard focus, arrows orbit, +/− zoom and Home restores the overview.
- Reduced motion starts paused with a stationary camera. Hidden tabs stop advancing. A WebGL failure links to the native SVG collection.

The models are sculptural anatomical illustrations, not scans or validated biomechanical simulations. Surface regions simplify structure boundaries. Highlights identify the selection rather than muscle activation; angular readouts describe the authored pose. [Anatomy sources and scope](SOURCES.md) support the explanatory wording.

## Source and reproduction

| File | Purpose |
| --- | --- |
| [app.mjs](app.mjs) | Rendering, local selection, projected labels, camera ownership and transport |
| [upper-body.mjs](upper-body.mjs) | Continuous torso/arm geometry, whole-body reach, elbow flexion |
| [hand.mjs](hand.mjs) | Palm, connected finger chains, thumb opposition and grasp |
| [lower-limb.mjs](lower-limb.mjs) | Leg loading, ankle/heel continuity, forefoot support |
| [geometry.mjs](geometry.mjs) | Smooth loft profiles, semantic surface regions and shared normals |
| [manifest.json](manifest.json) | Full prompts, anatomical structures, source IDs and phases |
| [vendor/LICENSE](vendor/LICENSE) | Three.js MIT license |

The camera and timeline helpers in runtime/ were adapted from the locally supplied Taster skill. They are included here so the explorer runs independently. Three.js is pinned to 0.186.1; build:three copies the required engine and OrbitControls files with their license.

~~~sh
npm run catalog:three  # rebuild the 3D prompts and manifest
npm run check:three    # all five scenes, motion and interaction checks
npm run playback:three # sample unpaused model/camera/label motion through a loop
npm run bundle:three   # portable explorer with the preserved SVG collection
~~~

[Browser checks](../qa/three/checks.json) record actual mesh motion, exact 0/5 geometry, reverse seeking, camera interruption, selection, playback, reduced motion and mobile layout. [Automatic playback samples](../qa/three/playback.json) cover model and camera motion across the loop boundary. [Visual review](../qa/three/art-review.json) records inspected frames and concrete repairs. No continuous frame-by-frame review is claimed.

## Corpus prompts

${studies.map(s=>`### ${s.id} — ${s.title}\n\n[Open study](${s.view}) · [Editable geometry](${s.source}) · SVG reference IDs: ${s.svgReferenceIDs.join(', ')}.\n\n${s.prompt}\n\n**Action:** ${s.beats.map(b=>`${b.label}: ${b.description}`).join(' ')}\n`).join('\n')}`;
await writeFile(resolve(ROOT,'three/README.md'),readme);
console.log('Cataloged five Three.js studies with prompts, source links, structures and motion phases.');
