# MUSE: one portrait, eight expressions

Use [MUSE](../assets/expressions/index.html) for a requested 3D facial-expression study. It is an original procedural sculpture of an adult woman, separate from the FORM anatomy explorer and the accepted SVG corpus. Preserve one recognizable identity and a shared neutral pose across joy, sadness, anger, fear, surprise, disgust, wink and laughter. Laughter retains the corpus reference ID **105202**; do not invent a source ID for a newly authored pose.

Read the current `assets/expressions/face.mjs` before adapting its geometry. `createFace(expressionId)` provides the portrait group, selectable parts, pose update, beats and metrics; `EXPRESSION_IDS` and `EXPRESSIONS` enumerate the authored performances. `app.mjs` supplies its own view and imports the camera/transport from FORM. Keep `assets/expressions/` and `assets/three/` as siblings because MUSE also uses FORM's local Three.js engine and base stylesheet. Serve their parent folder over HTTP.

## Build the face, then act

Establish the complete cranial, cheek, nose, jaw and neck volumes before expression changes. The eyes and mouth need real boundaries in the facial surface, with attached lids, lips and surrounding skin. Separate feature shapes placed on an unchanged head will not create convincing full-face acting.

For a reference-led realistic portrait, establish the facial thirds, eye spacing, iris-to-aperture ratio, nasal projection and jaw profile from the supplied front and profile views. Preserve recognizable adult proportions through every expression. Add natural eyelid rims, lashes, brow hairs, a limbal ring, lip thickness, an oral cavity and an ear helix/concha only after the large volumes work. Keep hair strands grouped into coherent locks with a continuous scalp silhouette; avoid equally spaced wire stripes and floating strands. Soft studio reflections and subtle skin color/roughness variation should reveal the geometry, not conceal its defects. Review the neutral profile as closely as the frontal expression.

Derive every update from the same neutral geometry and absolute time. A five-second loop prepares, gathers into a readable extreme, releases and returns to its identical neutral endpoint. Keep proportions and identity stable while brows, eyelids, cheeks, lips, jaw and restrained head response act together. Distinguish the eight performances through local geometry, not only head tilt or shading. Use asymmetric motion where the pose calls for it, particularly a wink or upper-lip lift.

The facial sources describe movement relationships, not a biomechanical solver. Use [the expression sources](../assets/expressions/SOURCES.md) for concise label wording. Orbicularis oculi closes the lids; upper-lid elevation is a different action. Lip shaping is distinct from lowering the mandible. Call a broad surface overlay a region unless the mesh isolates that muscle. Report authored blend amounts as blend amounts; show an angle only when it corresponds to an actual defined rotation. Emotion names label these acting presets and do not establish someone's internal state.

## Boundary and motion review

Inspect the shared neutral portrait first, then every performance at its strongest pose and intermediate times, with labels and highlights both enabled and hidden. Include front, three-quarter and profile views, mobile size and the five-second return. Review actual browser playback after pose inspection; record the inspection performed rather than declaring quality from geometry counts.

- Eyelids remain attached to the face and follow the eye surface. Their aperture closes over the iris for a blink/wink, with no exposed pupil, bright strip, inverted lid or detached eye corner at closure.
- Lips retain thickness, joined corners and their connection to the cheeks. Mouth opening reveals a cavity; it does not expose a solid facial sheet, floating teeth, crossed lips or a disconnected chin.
- Cheek and brow deformation blends into the surrounding face without tears, folds caused by bad topology, normal seams or fixed patches that contradict the action.
- Neck, ears and hair remain attached through head movement. The same neutral mesh, proportions and material treatment identify the same woman in every tab.
- Selection anchors follow the posed feature. Highlights do not hide boundary defects. Camera motion yields to manual inspection and frames the complete portrait through all extremes.

Check deterministic reverse seeking and matching 0/5-second geometry, then repair and reopen any affected expressions. Keep prompts, source IDs and review evidence with the separate edition. The skill's presence and an automated pass are not a substitute for this visual review.
