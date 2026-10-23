import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ROOT } from './serve.mjs';
import { getExpressionMetadata } from '../expressions/character-face.mjs';

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
const base='Use the shared licensed CC0 MakeHuman-derived skinned character as the foundation. Choose one original adult female identity with a softly tapered lower jaw, a rounded chin with natural profile projection, softly rounded cheeks, refined nose, full lips, natural eyelid geometry, expressive blue eyes and blonde hair. Use the same face, body proportions, rig and neutral anatomical bodysuit in MUSE and FORM. Retain continuous shoulders, torso, limbs, hands and feet for the Full body view. Preserve the charcoal background, serif interface, mint region overlays and soft studio lighting. Animate the face with the official CC0 facial targets transferred onto the original topology; carry brows, lashes, lips, oral surfaces, teeth and tongue with their corresponding deformations. Use a fine, clean complexion without baked gray or beard-like patches, with soft neutral-warm studio fill and preserved lip/lid definition. Keep the tongue on the recessed oral floor and align both dental arches with the lips. Keep individual teeth naturally proportioned with softly rounded incisal edges, warm ivory enamel and balanced upper/lower exposure through the lips. Keep each animation exactly five seconds with one shared neutral pose, readable preparation, a held expression and smooth recovery. Inspect front, profile and three-quarter views. Selected brow, eye, cheek, mouth, jaw, Pectoralis, Back and Pelvis regions must conform to the evaluated body surface with attached labels. Manual orbit interrupts the guided camera. ';
const method='Licensed CC0 skinned GLB with one locally selected adult identity; 52 official MakeHuman facial units transferred by source-vertex correspondence with accessory bindings; coordinated authored morph weights and small skeletal head gestures. Facial shading evaluates the combined posed surface and retains the original neutral normals. No generated portrait is used as a flat image plane.';
const studies=Object.entries(actions).map(([id,a])=>{const m=getExpressionMetadata(id);return{id,title:m.title,duration:5,view:`index.html#${id}`,source:'character-face.mjs',model:'../three/character/assets/adult-female-source.glb',svgReferenceID:a.reference,prompt:base+a.prompt,method,beats:m.beats,parts:m.parts};});
await writeFile(resolve(ROOT,'expressions/manifest.json'),JSON.stringify({title:'MUSE — The language of a face',renderer:'Three.js 0.186.1',duration:5,edition:5,identity:'One original adult blonde woman with blue eyes, shared with FORM.',appearanceReferences:['User-supplied paired front/profile laughter and surprise portraits','Subsequent user direction: adult blonde female character with blue eyes, inspired by Sydney Sweeney; original asset-based identity rather than a scan or exact likeness'],assetLicense:'CC0-1.0',assetProvenance:'../three/character/assets/README.md',studies},null,2)+'\n');
await writeFile(resolve(ROOT,'expressions/README.md'),`# MUSE — The language of a face

**Eight five-second facial-expression studies** of the same adult female character used in [FORM](../three/index.html): joy, sadness, anger, fear, surprise, disgust, wink and laughter. The licensed skinned GLB provides organic human topology; local identity choices give her blonde hair, blue eyes and a neutral anatomical bodysuit. The accepted 48 SVGs remain unchanged.

[Open MUSE](index.html) · [Portable source bundle](../exports/form-and-muse-threejs.zip) · [Character assets and license](../three/character/assets/README.md) · [Facial anatomy notes](SOURCES.md)

## Run locally

From the project root, run \`npm start\` and open **http://127.0.0.1:4173/expressions/**. The engine, character GLBs, embedded maps and supporting data are local. Keep expressions/ and three/ together and serve over HTTP.

## Inspect the movement

Choose an expression, then play, pause, restart or scrub any moment. The brow, lid, cheek, lip and jaw targets coordinate around one neutral identity. A wink closes the actual lid aperture over the iris. The jaw releases with its mouth interior, lower teeth and tongue.

Use **Portrait** for facial acting or **Full body** to inspect the complete character. Selecting **Pectoralis region**, **Back** or **Pelvis** also opens the body view. Mint highlights reuse the body’s surface triangles, and labels follow the posed skin. Selecting Back temporarily fades the long hair to reveal the surface beneath it; selecting another region restores the hair. Select a feature and frame it, or use Front, Profile and manual orbit. Manual gestures stop camera guidance; enable Guided camera to resume it. Reduced motion starts paused, and hidden tabs stop advancing.

The expression names describe authored acting poses, not diagnoses or inferred inner feelings. This is an original asset-based character, not a scan of a celebrity or a clinical anatomical model. Region overlays show selection, not measured muscle activity. Hair uses textured geometry and skin uses a restrained diffuse-wrap approximation; the model is intended for interactive illustration rather than photographic likeness. [Source and material limits](../three/character/assets/README.md).

## Source and reproduction

- [character-face.mjs](character-face.mjs): the eight expression recipes, five-second timing, body regions and metadata.
- [facial-normals.mjs](facial-normals.mjs): combined-pose facial normals with private instance buffers, exact neutral restoration and unchanged-pose caching.
- [Shared character loader](../three/character/character.mjs): fixed identity, skeleton fitting, GLB loading and character instances.
- [Facial contour](../three/character/facial-contour.mjs) and [dental refinement](../three/character/dentition.mjs): shared lower-jaw taper, rounded chin and refined crowns with attached expression targets.
- [Character materials](../three/character/materials.mjs): skin, blue eyes, blonde hair, mouth interior and clothing.
- [Surface regions](../three/character/regions.mjs): conforming selection, moving labels and posed picking.
- [Character GLB](../three/character/assets/adult-female-source.glb) and [source/licensing record](../three/character/assets/README.md).
- [Expression transfer builder](../scripts/build-character-expressions.py): independently authored data conversion from the official CC0 face-unit pack, with normal deltas and accessory bindings. Rebuilding requires Python, NumPy and SciPy.
- [studio.mjs](studio.mjs): local studio environment and portrait lights.
- [app.mjs](app.mjs): renderer, portrait/body framing, controls, selection and playback.
- [manifest.json](manifest.json): complete prompts, source IDs, phases and part descriptions.
- [Three.js license](../three/vendor/LICENSE), [browser checks](../qa/expressions/checks.json), [unpaused playback](../qa/expressions/playback.json) and [visual review](../qa/expressions/art-review.json).

The CC0 body and hair originate in MakeHuman system assets exported by Kasper Olesen’s CharacterCreator. The additional 52 facial units are by Mika Suominen and supplied by the MakeHuman Community under CC0. The source GLB retains the original proportion targets; the runtime bakes a single adult identity and keeps the expression/blink/gaze targets needed for interaction. CharacterCreator’s GPL generator/runtime code is not imported into the application.

~~~sh
npm run catalog:expressions
npm run check:expressions
npm run playback:expressions
npm run bundle:three
~~~

The preceding procedural portrait and complete earlier bundle are preserved in [archive/procedural-v3](../archive/procedural-v3). Older appearance references inform the art direction; they are not redistributed as scene assets.

## Corpus prompts

${studies.map(s=>`### ${s.id} — ${s.title}\n\n[Open expression](${s.view}) · [Acting source](${s.source}) · [Shared character GLB](${s.model})${s.svgReferenceID?` · [SVG acting reference](../corpus/animated/${s.svgReferenceID}.svg)`:''}\n\n${s.prompt}\n\n**Method:** ${s.method}\n\n**Action:** ${s.beats.map(b=>`${b.label}: ${b.description}`).join(' ')}\n`).join('\n')}`);
console.log('Cataloged eight shared-character expression studies from model metadata.');
