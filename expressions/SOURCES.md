# Facial expressions: sources and scope

Checked 22 October 2026. This edition is an original procedural portrait of an adult woman, with eight authored acting poses. Joy, sadness, anger, fear, surprise, disgust, wink and laughter name animation presets. They are not diagnoses or a method for inferring anyone's internal feelings. The model simplifies facial anatomy for visual explanation; selection colors identify regions, not measured muscle activity.

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

## Three.js references

The local engine is pinned to **Three.js 0.186.1**. Original JavaScript supplies the portrait geometry and expression poses; no external portrait mesh, textbook illustration or photographed face is reproduced.

- [BufferGeometry](https://threejs.org/docs/pages/BufferGeometry.html) documents vertex data, morph attributes, normals and bounds. Deformation needs appropriate normal and bound updates.
- [Mesh](https://threejs.org/docs/pages/Mesh.html) documents morph influences and obtaining a vertex position in the current animation state. Use the same posed geometry for visible surfaces, selection and attached explanatory anchors.

The cited anatomy informs labels and relationships. It does not validate the model's proportions, exact muscle boundaries, amplitudes or timing.
