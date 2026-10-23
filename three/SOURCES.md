# Anatomy explorer: sources and scope

Checked 22 October 2026. These are original, simplified procedural illustrations for understanding shape and motion; they are not a scanned body, an exhaustive anatomical atlas, or a validated biomechanical model. Highlights identify structures rather than measured muscle activation. Existing SVG editions remain separate.

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

## Three.js implementation references

- [BufferGeometry](https://threejs.org/docs/pages/BufferGeometry.html): native vertex/index/normal data for authored meshes and lines. Changes to position data need updated normals and bounds when appropriate.
- [OrbitControls](https://threejs.org/docs/pages/OrbitControls.html): orbit, zoom, and pan around a target. Update the controls after manual camera changes; damping needs regular updates. Pause directed camera motion when the viewer starts orbiting.
- [Raycaster](https://threejs.org/docs/pages/Raycaster.html): pointer selection of 3D geometry. Intersections are returned nearest first; use a deliberate list of selectable structures and exclude helper lines.

Sources inform wording and spatial relationships. No textbook illustrations, photographs, paid assets, or external 3D models are reproduced here.
