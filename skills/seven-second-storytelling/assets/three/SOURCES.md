# Anatomy explorer: sources and scope

Anatomy references checked 22 October 2026; character provenance updated 23 October 2026. These studies use one licensed CC0 MakeHuman-derived skinned character with an original adult female identity, shared with MUSE. The five views illustrate shape and authored motion; they are not a scanned body, an exhaustive anatomical atlas, or a validated biomechanical model. Highlights identify approximate surface regions rather than measured muscle activation. Existing SVG editions remain separate.

## Short explanatory labels

| View | Structure / motion | Suggested wording |
| --- | --- | --- |
| Full body | Shoulder girdle | The shoulder girdle positions and supports the arm as it moves. [OpenStax §11.5](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs) |
| Arm | Biceps brachii | Helps bend the elbow and turn the palm forward. [OpenStax §11.5](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs) |
| Arm | Brachialis | Lies deep to the biceps and helps bend the elbow. [OpenStax §11.5](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs) |
| Arm | Triceps brachii | Helps straighten the elbow. [OpenStax §11.5](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs) |
| Hand | Finger flexors | Forearm flexor muscles act through tendons to bend the fingers. [OpenStax §11.5](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs) |
| Hand | Thenar muscles | Muscles at the thumb base help position the thumb for a grip. [OpenStax §11.5](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs) |
| Hand | Opposition | The thumb moves across the palm toward the fingertips. [OpenStax §9.5](https://openstax.org/books/anatomy-and-physiology-2e/pages/9-5-types-of-body-movements) |
| Leg | Quadriceps | The four muscles at the front of the thigh help straighten the knee. [OpenStax §11.6](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs) |
| Leg | Gastrocnemius + soleus | These calf muscles help point the foot and raise the heel. The soleus lies deeper. [OpenStax §11.6](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs) |
| Foot | Achilles tendon | Connects the calf muscles to the heel bone. [OpenStax §11.6](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs) |
| Foot | Plantar flexion | An ankle movement that points the foot; with the forefoot supported, the heel rises. [OpenStax §9.5](https://openstax.org/books/anatomy-and-physiology-2e/pages/9-5-types-of-body-movements) |
| Foot | Intrinsic foot muscles | Small muscles within the foot support its arches and help move its toes. [OpenStax §11.6](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs) |

## Modeling review notes

These are design inferences from the relationships above, not numerical physiological specifications:

- Keep the anatomical front/back and left/right consistent as the camera orbits. Labels follow the same structure in every view.
- Keep joint centers and muscle attachment regions connected during articulation. A whole-mesh stretch should not substitute for bending an elbow, knee, or finger joint.
- Show brachialis and soleus as deeper structures when isolating them; avoid presenting them as surface patches in front of biceps or gastrocnemius.
- Keep finger lengths stable. Curl segments at their joints and move the thumb across the palm with its pad oriented toward the fingers; avoid finger intersections.
- A heel raise has a supported forefoot. Keep that contact stable, preserve the Achilles connection, and distinguish ankle movement from bending the toe joints.
- Use modest illustrative changes in muscle shape; do not imply that brightness or bulge measures force, strain, or activation.

## Character sources and method

The body, facial accessories, rig, textures, proportion targets and hair originate in MakeHuman assets exported by Kasper Olesen's CharacterCreator at commit `852e48f316b90a0937234886630e4fb4cdfd1f78`. Its [pinned asset license notes](https://github.com/kblood/CharacterCreator/blob/852e48f316b90a0937234886630e4fb4cdfd1f78/LICENSE-NOTES.md#generated-files-owner-decision-2026-10-03) explicitly release those generated assets under CC0. The application consumes the GLB data and does not import CharacterCreator's GPL generator/runtime code. The [MakeHuman license](https://static.makehumancommunity.org/about/license.html) explains the separate treatment of software and character data.

Local proportion choices, blue-eye and blonde-hair materials establish one original adult woman for both FORM and MUSE. The source skin supplies connected shoulders, torso, hands, feet and digit webbing. The neutral anatomical bodysuit follows that same evaluated skin. No celebrity scan or exact likeness is claimed; supplied appearance references inform art direction and are not redistributed.

[character/anatomy.mjs](character/anatomy.mjs) authors five deterministic skeletal movements on the same 53-bone source rig. Their joint amplitudes and timings are illustration choices, not measured physiological ranges. The full-body reach, elbow bend, finger closing wave, supported knee bend and heel raise each return to their initial pose at five seconds. The surface highlights reuse body triangles and feather at their boundaries; labels and selection follow the posed skin rather than disconnected proxy shapes. A region label does not imply an isolated internal muscle model.

The character also includes 52 official CC0 facial units by Mika Suominen from [Face units 01](https://static.makehumancommunity.org/assets/assetpacks/faceunits01.html) for the shared MUSE view. An independently authored [Python builder](../scripts/build-character-expressions.py) transfers these source deltas and accessory bindings and computes normal deltas. [Character provenance and rebuilding notes](character/assets/README.md) record the pinned GLB, hashes, selected input data, license evidence and material limitations.

Skin uses physically based shading with a restrained diffuse-wrap approximation, not volumetric subsurface scattering. Hair is textured geometry, not a simulated strand groom. The continuous source mesh improves attachment and silhouette, but its topology and authored movements still require inspection for clipping and credible support; licensing and automated checks do not establish anatomical accuracy.

## Three.js implementation references

- [BufferGeometry](https://threejs.org/docs/pages/BufferGeometry.html): native vertex/index/normal data for authored meshes and lines. Changes to position data need updated normals and bounds when appropriate.
- [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html): loading local GLB character data, embedded maps, skeletal rig and morph targets.
- [SkinnedMesh](https://threejs.org/docs/pages/SkinnedMesh.html): skeletal deformation and obtaining evaluated vertex positions for the posed surface.
- [OrbitControls](https://threejs.org/docs/pages/OrbitControls.html): orbit, zoom, and pan around a target. Update the controls after manual camera changes; damping needs regular updates. Pause directed camera motion when the viewer starts orbiting.
- [Raycaster](https://threejs.org/docs/pages/Raycaster.html): pointer selection of 3D geometry. Intersections are returned nearest first; use a deliberate list of selectable structures and exclude helper lines.

Sources inform wording and spatial relationships. The character includes the CC0 external 3D assets described above. No textbook illustrations, source photographs or paid character assets are redistributed. The local engine is pinned to Three.js 0.186.1 under its included MIT license.
