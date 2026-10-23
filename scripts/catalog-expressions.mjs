import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ROOT } from './serve.mjs';
import { createFace } from '../expressions/face.mjs';

const actions={
 joy:{reference:'105196',prompt:'Raise the mouth corners into a quiet smile. Lift the cheeks and soften the lower eyelids together; keep the upper lip and chin volumes coherent. Let the face settle gently back to neutral.'},
 sadness:{reference:'105197',prompt:'Raise the inner eyebrows while the outer brows relax. Turn the mouth corners slightly downward, soften the eyelids and lower the chin just enough to support a tender, restrained acting pose.'},
 anger:{reference:'105198',prompt:'Draw the eyebrows down and inward, narrow the eyelid openings and press the lips. Preserve a composed face with readable tension, avoiding grotesque distortion or detached brow shapes.'},
 fear:{reference:'105199',prompt:'Raise and draw together the brows, widen the eyes, stretch the mouth corners slightly sideways and part the lips with a small jaw release. Coordinate the features so this differs clearly from surprise.'},
 surprise:{reference:'105200',prompt:'Lift both brows, open both eyelid apertures and lower the jaw into a rounded mouth opening. Maintain a convincing mouth cavity and attached lip, chin and cheek surfaces through the strongest pose.'},
 disgust:{reference:null,prompt:'Lift the upper lip asymmetrically, tighten the nose and lower brow region, and gently narrow the eyes. Use a fleeting, restrained recoil with a coherent nasal and cheek surface.'},
 wink:{reference:'105203',prompt:'Close one eyelid aperture fully, hide the iris behind the lid, lift the same cheek and add a small asymmetric smile. Keep the opposite eye open; reopen the closed eye smoothly before recovering neutral.'},
 laughter:{reference:'105202',prompt:'Open a broad smile with raised cheeks, softened eyes and a visible jaw release. Add a restrained head lift. Make the mouth and lips remain convincing from the profile camera, and return to the shared neutral portrait.'}
};
const base='Create an original elegant adult woman as a native Three.js sculptural portrait, with balanced facial proportions, a continuous modeled face, swept hair, actual eye and mouth openings, and a modest clothed shoulder bust. Use quiet warm porcelain surfaces, restrained lips and irises, and a dark studio stage. Keep the same identity across every expression. Animate exactly five seconds: neutral, preparation, a readable expression, a short hold, recovery and the identical neutral endpoint. Coordinate brow, eyelid, cheek, lip and jaw geometry. Preserve clean occlusion, anatomical attachments and clean silhouettes from front, three-quarter and profile views. Provide selectable facial features, source-backed explanatory labels, a seekable timeline and a guided camera that yields immediately to manual orbit. ';
const studies=Object.entries(actions).map(([id,a])=>{const m=createFace(id);return{id,title:m.title,duration:5,view:`index.html#${id}`,source:'face.mjs',svgReferenceID:a.reference,prompt:base+a.prompt,beats:m.beats,parts:m.parts.map(({id,name,description})=>({id,name,description}))};});
await writeFile(resolve(ROOT,'expressions/manifest.json'),JSON.stringify({title:'MUSE — The language of a face',renderer:'Three.js 0.186.1',duration:5,identity:'An original adult woman, procedurally sculpted for this collection.',studies},null,2)+'\n');
await writeFile(resolve(ROOT,'expressions/README.md'),`# MUSE — The language of a face

A separate Three.js facial-expression explorer alongside [FORM / Anatomy](../three/index.html). One original adult woman performs **eight five-second studies**: joy, sadness, anger, fear, surprise, disgust, wink and laughter. The accepted SVG collection remains unchanged.

[Open MUSE](index.html) · [Portable source bundle](../exports/form-and-muse-threejs.zip) · [Facial anatomy sources](SOURCES.md)

## Run locally

From the project root, run \`npm start\` and open **http://127.0.0.1:4173/expressions/**. All browser dependencies are included locally in the sibling three/ directory. Keep expressions/ and three/ together and serve over HTTP.

## Inspect the movement

Choose an expression and follow its five-second action. Pause, restart or scrub any pose; select a label or facial feature to read its role. Drag to orbit, use Front or Profile, or frame a selected feature. Manual camera gestures stop guidance; explicitly enable Guided camera to resume it. Reduced motion starts paused, and hidden tabs stop advancing.

The names describe authored acting poses. This illustrated portrait is not a scan, a clinical anatomical model, or a system for inferring internal emotion. Highlights mark the selected feature; they do not show measured muscle activation.

## Source and reproduction

- [face.mjs](face.mjs): native portrait geometry, features and coordinated expression poses.
- [app.mjs](app.mjs): renderer, camera, selection, anchored labels and five-second playback.
- [manifest.json](manifest.json): complete reproducible prompts, phases and feature descriptions.
- [Shared Three.js engine](../three/vendor/LICENSE): bundled MIT-licensed engine and controls.
- [Browser checks](../qa/expressions/checks.json), [unpaused playback](../qa/expressions/playback.json) and [visual review](../qa/expressions/art-review.json).

Repository maintenance commands (install the pinned dependencies with \`npm ci\` first):

~~~sh
npm run catalog:expressions
npm run check:expressions
npm run playback:expressions
npm run bundle:three
~~~

## Corpus prompts

${studies.map(s=>`### ${s.id} — ${s.title}\n\n[Open expression](${s.view}) · [Editable portrait](${s.source})${s.svgReferenceID?` · [SVG acting reference](../corpus/animated/${s.svgReferenceID}.svg)`:''}\n\n${s.prompt}\n\n**Action:** ${s.beats.map(b=>`${b.label}: ${b.description}`).join(' ')}\n`).join('\n')}`);
console.log('Cataloged eight facial-expression studies with prompts, source links and movement phases.');
