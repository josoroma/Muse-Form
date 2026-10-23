# Facial expressions: sources and scope

Anatomy references checked 22 October 2026; character provenance updated 23 October 2026. This edition animates one original adult female identity derived from licensed CC0 MakeHuman character data, shared with FORM. Joy, sadness, anger, fear, surprise, disgust, wink and laughter name eight authored acting presets. They are not diagnoses or a method for inferring anyone's internal feelings. The model simplifies facial anatomy for visual explanation; selection colors identify regions, not measured muscle activity.

## Anatomy wording

The following labels describe movement rather than an emotional state. Most facial-expression muscles move skin; jaw motion also changes the position of the mandible. [OpenStax, Anatomy and Physiology 2e, §11.3](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-3-axial-muscles-of-the-head-neck-and-back).

| Label | Concise explanation |
| --- | --- |
| Frontalis region | Raises the eyebrows and moves the forehead skin. |
| Corrugator region | Helps lower the eyebrows into a frown. |
| Orbicularis oculi region | Closes the eyelids, including the closing phase of a wink. |
| Upper eyelid | The levator palpebrae superioris lifts the upper lid. |
| Zygomaticus region | The zygomaticus major raises the mouth corners. |
| Orbicularis oris region | Shapes the lips and helps close the mouth opening. |
| Upper lip | The levator labii superioris helps raise it. |
| Masseter region | Elevates the mandible to help close the jaw. |

These actions are summarized from the facial-expression, eye and lower-jaw sections of [OpenStax §11.3](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-3-axial-muscles-of-the-head-neck-and-back). Lowering the mandible opens the mouth; raising it closes the mouth. [OpenStax §9.5](https://openstax.org/books/anatomy-and-physiology-2e/pages/9-5-types-of-body-movements).

Facial muscle connections vary. An anatomical study of adult specimens describes connections among the brow, lower eyelid and upper-lip regions; it supports treating neighboring facial actions as coordinated, while avoiding a claim that one isolated patch produces an entire expression. [Hur et al., 2022, PLOS ONE](https://doi.org/10.1371/journal.pone.0264148).

## Authored pose directions

These are artistic choices for this portrait, not universal templates for real people:

| Preset | Visible action to inspect |
| --- | --- |
| Joy | Mouth corners rise, cheeks lift and eyelids narrow. |
| Sadness | Inner brows rise and mouth corners lower. |
| Anger | Brows draw down and inward; lips press together. |
| Fear | Brows lift and gather; eyes widen; lips retract. |
| Surprise | Brows lift, eyelids open and the jaw lowers. |
| Disgust | Upper lip lifts with a restrained nose-region contraction. |
| Wink | One eyelid closes while the other eye remains open. |
| Laughter | Mouth corners and cheeks rise, the eyelids soften, and the jaw opens. |

Keep eyelids in contact with the eyeball as their aperture changes. A closed eye must conceal its iris. Preserve lip thickness, mouth corners and a continuous jaw-to-cheek transition. These are model-review criteria, not claims of physiological simulation. Name a highlighted area a **region** when the mesh does not isolate the actual muscle.

## Character sources and method

The user's paired front/profile laughter and surprise images inform facial proportions, coherent expression changes, hair volume and studio lighting. The later direction specifies an adult blonde woman with blue eyes, inspired by Sydney Sweeney. Local proportion choices and materials create an original identity from the licensed mesh; this is not a scan, reconstruction or exact likeness of that person. The reference images are not embedded as image planes or redistributed. FORM and MUSE load the same identity, full body, rig and neutral anatomical bodysuit.

- The body, facial accessories, rig, maps, proportion targets and hair derive from MakeHuman data exported by Kasper Olesen's CharacterCreator at commit `852e48f316b90a0937234886630e4fb4cdfd1f78`. The owner explicitly licenses these generated assets under CC0 in the [pinned license notes](https://github.com/kblood/CharacterCreator/blob/852e48f316b90a0937234886630e4fb4cdfd1f78/LICENSE-NOTES.md#generated-files-owner-decision-2026-10-03). The application imports the standard GLB data, not the project's GPL generator/runtime code. See also the [MakeHuman asset license](https://static.makehumancommunity.org/about/license.html).
- The 52 added facial deformation units are Mika Suominen's official [Face units 01 pack](https://static.makehumancommunity.org/assets/assetpacks/faceunits01.html), supplied under CC0. The [asset-pack overview](https://static.makehumancommunity.org/assets/assetpacks.html) identifies functional packs as CC0. A pinned source OBJ and selected system accessory bindings provide the correspondence to the exported mesh.
- The independently authored [expression builder](../scripts/build-character-expressions.py) maps source vertices by the original UV coordinates and transfers facial deltas without changing the character topology. MakeHuman accessory bindings carry the brows, lashes, eyes, teeth and tongue. Recomputed normal deltas share source normals across UV seams. The [asset record](../three/character/assets/README.md) preserves source URLs, hashes, licenses and rebuilding instructions; selected CC0 inputs are included locally.
- The runtime bakes one adult identity, retains expression/blink/gaze targets and clones the shared geometry for the studies. [character-face.mjs](character-face.mjs) authors bounded combinations of those targets and small skeletal head gestures on one absolute five-second timeline. Every preset begins and ends at the same neutral pose.
- Mint overlays reuse the visible body topology. Anchors and selection use the evaluated skinned surface, including the Pectoralis, Back and Pelvis regions accessible from the Full body view. Selecting Back temporarily fades the hair to expose that actual surface, then restores the hair when the selection changes. Surface regions do not isolate internal muscle bellies or constitute a muscle simulation.

Skin uses physically based materials with a restrained diffuse-wrap approximation, rather than volumetric subsurface scattering. Hair, brows and lashes use textured geometry, rather than a simulated strand groom. These are interactive visual approximations; the model and expression amplitudes are not clinically validated. Materials, source topology and the authored pose ranges still require visual inspection from frontal, profile and three-quarter views.

## Three.js references

The local engine is pinned to **Three.js 0.186.1**. Standard glTF loading, skeletal skinning and morph targets supply the geometry visible in the scene.

- [BufferGeometry](https://threejs.org/docs/pages/BufferGeometry.html) documents vertex data, morph attributes, normals and bounds. Deformation needs appropriate normal and bound updates.
- [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html) loads the local GLB character, embedded textures, skeleton and morph targets.
- [SkinnedMesh](https://threejs.org/docs/pages/SkinnedMesh.html) and [Mesh](https://threejs.org/docs/pages/Mesh.html) document skinning, morph influences and obtaining a vertex position in the current animation state. Use the same posed geometry for visible surfaces, selection and attached explanatory anchors.

The cited anatomy informs labels and relationships. It does not validate the model's proportions, exact muscle boundaries, amplitudes or timing.
