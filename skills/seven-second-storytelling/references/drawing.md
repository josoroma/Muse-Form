# Native SVG drawing craft

This collection uses Hairline-inspired restraint: believable anatomy, a clear silhouette, sparse structural curves, deliberate occlusion and one focal accent. Build usable vector geometry. A painting embedded in an SVG wrapper does not meet this workflow.

## Observe and construct

Inspect the actual reference and write a short brief: subject, viewpoint, gesture, support, expression, light direction, focal feature and negative space. A source photograph informs anatomy or gesture; a style reference informs visual language. Keep those roles distinct. Do not copy a book page's layout or captions, and correct inaccurate source labels.

Resolve the drawing in this order:

1. **Gesture and balance:** establish the line of action, weight-bearing contact and opposing masses.
2. **Proportion and perspective:** place the major volumes, their axes and the near/far relationships from one consistent viewpoint.
3. **Silhouette and overlap:** connect visible boundaries and make occlusion legible. Trace each limb or digit through its attachment before adding detail.
4. **Structural contours:** add only lines that explain joints, planes, folds, cartilage, tendons or a meaningful material edge.
5. **Focal emphasis:** choose one useful bright feature and remove marks competing with it.

Small lines cannot rescue incorrect proportions. Test the pose and focal point at 240 pixels wide. Preserve quiet areas and enough margin for the full motion envelope.

## Contour, light and depth

| Decision | Current practice |
| --- | --- |
| Form | Construct skull, ribcage, pelvis and limbs as volumes before expressing their visible surface with curves. A forearm tapers and rotates; a face has wrapping planes, not pasted-on symbols. |
| Stroke hierarchy | Use one restrained width: about `.9` for anatomy/faces and `1.1` for stories in the current 1200 × 900 output, with round caps and joins and `vector-effect="non-scaling-stroke"`. Separate near contour from interior and receding structure by contrast, not heavy outlines. |
| Palette | Ground `#101014`; silhouette `#a1a1aa`; structural interior `#52525b`; optional receding detail `#27272a`; one focal contour `#fafafa`. Do not distribute bright accents across unrelated features. |
| Light | Read the reference's light to understand planes and choose the focal edge. Translate that information into selective contour emphasis and quiet interiors. Do not convert every tonal boundary into a line. This edition does not use painted shadow masses, gradients, glows or grain. |
| Perspective | Align eyes, ears, shoulders, joints and props to shared axes. Compress far-side features and foreshorten forms approaching the viewer. A substantial turn needs newly resolved geometry, not a stretched flat path. |
| Depth and occlusion | Order background, far limbs, body, near limbs, props and foreground deliberately. Background-colored opaque shapes may hide lines behind solid forms. Keep visible boundaries and support contacts clear. |
| Composition | Balance the dominant gesture with negative space. Near forms receive the clearest contour; subordinate elements remain quieter. Check cropping and overlap at both rest and the strongest pose. |

Avoid tonal fills, cast-shadow bands, repetitive hatching, surface speckle and labels inside the illustration. A physically present crease or overlap may deserve a line; an incidental lighting boundary usually does not. Do not manufacture depth by adding more marks everywhere.

## Native construction and reference-derived geometry

Use a `viewBox`, explicit dimensions, a useful `title` and `desc`, and meaningful groups for independently moving parts. The anatomy and story drawings use `viewBox="0 0 1200 900"`; faces use `viewBox="0 0 400 300"`, also delivered at 1200 × 900. Use local viewBox coordinates for pivots. Keep the SVG self-contained: no remote fonts, images, styles or scripts. Prefix clip and mask IDs with the study ID. The background plate and necessary occlusion shapes are the only filled regions in this edition.

Prefer purposeful path contours to collections of ellipses for anatomical boundaries. Primitives are useful construction aids; they should not dictate a tubular or bead-like finished form. Smooth curves without erasing important changes at joints, nail planes, knuckles or facial features. Keep curves editable; M/C paths work well with the current morph compositor.

If an approved internal plate supplies construction geometry:

1. Suppress texture before extracting candidate contours. Treat the result as provisional geometry, not finished anatomy.
2. Choose long connected boundaries and the few internal features that explain the subject. Discard grain, shadow outlines, duplicate edges, stray fragments and arbitrary tonal contours.
3. Smooth and simplify useful curves. Inspect the result against the reference so simplification does not erase eyelids, finger webs, joints or toe separation.
4. Author missing structure. Reconnect a broken silhouette, resolve an eye or thumb base, and remove little hooks or shelves left by source shadows. Do not bridge a genuine occlusion just to close every path.
5. Inspect each retained feature at full size and thumbnail size. A low path count is a useful constraint, not evidence of quality.

Record whether geometry was drawn directly or curated from an owned plate. Do not describe derived curves as a 3D reconstruction or a traced source page. The canonical drawing is `corpus/svg/<id>.svg`; record its prompt, method, observations and review in `corpus/hairline/*.json`. Large construction data may live separately under `corpus/hairline/geometry/`.

Keep rest-position and animated transforms separate. Joint pivots must agree with the visible anatomy. A path morph must preserve command topology; major silhouette or occlusion changes need authored poses or suitable articulated geometry. Use Three.js when real depth changes are necessary, then apply the same contour and anatomy checks to the rendered result.

## Anatomy and facial acting

| Subject | Structural landmarks | Motion decisions |
| --- | --- | --- |
| Skull | Cranial vault, eye sockets, zygomatic arch, nasal opening, maxilla, jaw hinge | Keep teeth and jaw mechanically connected. A substantial turn needs a new viewpoint or real depth. |
| Eye | Globe beneath wrapping lids, inner/outer canthus, iris occlusion, brow ridge | Upper lid travels farther in a blink; eyebrow leads thought; gaze stays within the opening. |
| Ear | Helix, antihelix, concha, tragus, lobe | Use nested cartilage contours and clear occlusion. Subtle head-follow or a contour emphasis is enough for a study. |
| Expressions | Brow angle, lid opening, cheeks, nasolabial folds, lip corners, jaw | Happiness lifts cheeks; sadness raises inner brows; anger compresses the brow; fear widens tense eyes; surprise releases the jaw; a wink compresses one cheek. Do not move only a mouth symbol. |
| Torso/stretch | Counter-rotating ribcage and pelvis, shoulder line, clavicle, waist compression | One side lengthens while the other compresses. Neck and shoulders remain attached. |
| Arm | Shoulder cap, upper-arm mass, elbow, radius/ulna rhythm, wrist narrowing | Rotate at the joint; maintain forearm length; align the hand gesture with its wrist. |
| Hand | Palm wedge, thumb saddle, four finger rays, knuckle arc, webbing | Count five digits and follow each to its base. Thumb opposition differs from finger bending. Fingers taper and bend in linked segments. |
| Leg | Hip mass, quadriceps, kneecap, tibial ridge, calf, malleoli | Preserve the load path through knee and ankle. A supported foot stays planted unless lifting is the action. |
| Foot | Heel block, arch, ball, big-toe direction, distinct toe lengths | Show the appropriate arch and offset ankle landmarks for the observed viewpoint; do not imply that a dorsal/lateral view reveals the medial arch. Toes are not five identical beads. Heel lift pivots through the ball of the foot. |

Reject detached oval muscle shapes, spherical biceps, uniform tubes and identical digits. Interior lines must explain anatomy rather than partition every muscle into an outlined patch. The corpus is artistic construction practice, not a medically validated anatomy atlas.

## Character families

- **Pirates:** distinguish coat, scarf, boots, hat and prop through shape, selective seams and motion lag. Hands must visibly hold the telescope, rope or treasure. Use a bent elbow and counterbalanced torso for a credible gesture.
- **Monsters:** define a consistent invented skeleton. Head/torso ratios, limb proportions, silhouette and facial asymmetry establish identity. Include only a few fur or scale contours that explain a form.
- **Worms:** maintain a continuous body centerline, controlled thickness, restrained segment rhythm and contact patches. A traveling compression wave must preserve connectedness and keep the expression readable.
- **Dead or zombie characters:** use posture, uneven hair, hollowed planes, patched clothing and delayed reactions. For young audiences, let a gentle goal carry the scene without gore.
- **Children's stories:** show desire, effort and a readable emotional payoff. A firefly, flower, star or shared object can connect the poses. Every prop and accent should help tell the story.

## Per-asset visual gate and repair loop

| Check | Inspect | Repair when it fails |
| --- | --- | --- |
| Anatomy and pose | Digit count, attachments, joint centers, proportions, foreshortening and supported weight; follow each limb across overlaps. | Redraw the responsible contour or pose. Recheck the reference and adjacent forms. |
| Form and light cues | Silhouette explains the volume; interior curves follow its planes; the single focal contour has a purpose. | Remove tonal-boundary traces and redundant marks; correct the plane or focal selection. |
| Edges and cleanliness | Connected visible boundaries; no accidental gaps, doubled edges, hooks, shadow shelves, wobble or tiny debris. | Author the missing connection, trim the fragment or simplify the curve. Reopen the rendered SVG after the edit. |
| Composition and contact | Pose reads at thumbnail size; margins survive motion; hands grip props and feet meet their support. | Recompose, correct occlusion or repair the contact geometry before rigging. |
| Identity and action | Expression and silhouette match the brief; repeated views are materially distinct; motion preserves the structure. | Revisit the viewpoint, acting pose or motion method instead of polishing the wrong result. |
| Native output | Editable vector geometry, correct dimensions, one focal accent, meaningful grouping and no embedded bitmap or forbidden effects. | Fix the source SVG and regenerate derived files. Structural validity does not establish drawing quality. |

Compare the actual reference, full-size still and thumbnail after each material revision. Write concrete observations, repair the responsible geometry, then inspect the changed render. Repeat until visible material faults are resolved. Numeric self-scores do not certify quality. Check anatomy, contact and occlusion again at the strongest animated pose; the complete motion gate is in [motion and export](motion.md).

## Corpus prompt template

“Draw an original [subject and pose] as native SVG contour art. Reference [source ID] supplies [observed anatomy or gesture]; [style reference] supplies contour restraint, without copying page layout or captions. Compose [viewpoint, framing, gesture, focal feature, negative space]. Preserve [landmarks, proportions, digit count, attachment and support]. Use a charcoal `#101014` ground, a `.9` non-scaling `#a1a1aa` silhouette, sparse `#52525b` structural curves, optional `#27272a` receding detail and one meaningful `#fafafa` focal contour. Read [light direction] to understand planes and select emphasis, without tracing every shadow. Use smooth editable paths and necessary background-colored occlusion shapes. Avoid [specific anatomy defects], broken boundaries, duplicate edges, stray fragments, tonal fills, gradients, filters, grain, bitmap embedding and in-art labels. Deliver a self-contained 1200 × 900 SVG with title, description and semantic groups. Record the exact prompt, reference roles and actual construction method.”

Write the action separately: “[starting pose], [intention], [small action], [reaction], [return or final hold]. Use [path morphs / articulated groups / authored poses / real 3D] because [visible motion requirement]. Preserve [bone lengths and rigid props]. Pin [support contacts and attachment points]. Inspect [subject-specific extreme-pose risks]. Deliver a five-second native SVG loop and its static SVG; link both, the prompt and source ID.”

If the user explicitly requests raster work, choose that medium deliberately and keep its format and provenance honest. Use the image-generation workflow, inspect the actual output with the same anatomy, composition and contact gates, and document the changed deliverables. Raster guidance is separate from this native SVG edition.
