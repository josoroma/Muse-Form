# Drawing craft

## Read before ornamenting

Write a short visual brief: subject, action, audience, camera, light, palette, material, and negative space. Derive these from the user's reference rather than defaulting every subject to the same mascot. Decide which silhouette, gesture, or expression must survive at 240 pixels wide.

Use the drawing to communicate form in this order:

1. Gesture and balance: a line of action, weight-bearing contact, opposing masses.
2. Proportion and perspective: major volumes, their axes, and a consistent viewpoint.
3. Silhouette and overlap: near forms occlude far forms; avoid confusing tangencies.
4. Three to five value families: paper/light, local midtone, form shadow, contact dark, occasional reflected light.
5. Selective details: features that identify the subject, then sparse material marks.

Small lines cannot rescue an incorrect silhouette. Repeated hatch patterns should support changing planes, not blanket the whole figure. Leave generous areas of quiet paper and an intentional light-facing edge.

## Form, light, color, composition, perspective, depth

- **Form:** construct a skull, ribcage, pelvis, or limb as volumes, then express the visible surface with contours. A forearm tapers and rotates; it is not a uniform tube. A face is not an oval with symbols pasted on it.
- **Light:** choose one main direction. Place broad form shadows opposite it, short occlusion shadows in creases, and cast shadows consistent with the contact surface. A highlight should agree across neighboring parts. Use gradients within anatomical planes, not indiscriminate shiny fills.
- **Color:** begin with a limited harmony. In the seed corpus: paper `#f3eee2`, graphite `#24343b`, muted warm ochre, russet, and occasional sage. Shift hue as well as value in shadows. Give the focal region the strongest useful contrast.
- **Composition:** set a dominant diagonal or curve, vary large and small masses, balance the focal point with negative space. Test the full motion envelope, not only the resting pose. Preserve margin at the action extreme.
- **Perspective:** use shared axes for eyes, ears, shoulders, joints, and props. Compress far-side features and foreshorten forms moving toward the viewer. Avoid stretching a flat path as a substitute for a substantial turn.
- **Depth:** layer background, far limbs, body, near limbs, props, and foreground deliberately. Reduce background contrast and detail. Opaque local fills hide far outlines where appropriate. Contact shadows anchor feet and hands.

## Anatomy and facial acting

| Subject | Structural landmarks | Motion decisions |
| --- | --- | --- |
| Skull | Cranial vault, eye sockets, zygomatic arch, nasal opening, maxilla, jaw hinge | Study a small turn or reveal light planes; keep teeth and jaw mechanically connected. |
| Eye | Globe beneath wrapping lids, inner/outer canthus, iris occlusion, brow ridge | Upper lid travels farther in a blink; eyebrow leads thought; gaze remains clipped within the opening. |
| Ear | Helix, antihelix, concha, tragus, lobe | Show depth with nested cartilage planes; subtle head-follow or an explanatory contour pass is enough. |
| Expressions | Brow angle, lid opening, cheeks, nasolabial folds, lip corners, jaw | Happiness lifts cheeks; sadness raises inner brows; anger compresses brow; fear widens tense eyes; surprise releases jaw; wink compresses one cheek. Avoid moving only a mouth symbol. |
| Torso/stretch | Ribcage and pelvis counter-rotate, shoulder line, clavicle, waist compression | One side lengthens while the other compresses. Neck and shoulder remain attached. |
| Arm | Shoulder cap, upper-arm mass, elbow, radius/ulna rhythm, wrist narrowing | Rotate at the real joint; maintain forearm length; keep hand gesture aligned with its wrist. |
| Hand | Palm wedge, thumb saddle, four finger rays, knuckle arc, webbing | Count five digits; thumb has its own opposing plane. Fingers taper and bend in linked segments. Use occlusion to hide joint seams. |
| Leg | Hip mass, quadriceps, kneecap, tibial ridge, calf, malleoli | Preserve the load path through knee and ankle. A supported foot stays planted unless lift is the action. |
| Foot | Heel block, arch, ball, big-toe direction, descending toe lengths | Show the medial arch and distinct ankle levels. Toes should not be five identical beads. Heel lift pivots through the ball of the foot. |

The corpus is artistic construction practice, not an anatomical diagnostic reference. For a physically accurate educational or medical illustration, verify the necessary structures against appropriate primary references.

## Character families

- **Pirates:** give coat, scarf, boots, hat, and prop different materials and lag. Use readable hand contact with the telescope, rope, or treasure. A bent elbow and counterbalanced torso make a gesture credible.
- **Monsters:** define a consistent invented skeleton. Distinct head/torso ratios, limb proportions, silhouette, and facial asymmetry make a character memorable. Fur or scales follow volumes.
- **Worms:** build a continuous body centerline with controlled thickness, segment rhythm, contact patches, and a traveling compression wave. Keep the head expression readable. Preserve connectedness when the body bends.
- **Dead or zombie characters:** use posture, uneven hair, hollowed planes, patched clothing, and delayed reactions. For young audiences, avoid gore and let a gentle goal carry the scene.
- **Children's stories:** show desire, effort, and a readable emotional payoff within the available time. A firefly, flower, star, or shared object can connect poses. Avoid using unexplained visual noise as story.

## SVG construction

Use a viewBox and explicit dimensions. Separate geometry and shading into meaningful groups. Prefix gradient, clip, mask, and pattern IDs with a study identifier. Give each file a useful title and description. Use local `defs`; no remote fonts, images, styles, or scripts in portable SVG output.

Prefer path contours over collections of ellipses for anatomical silhouettes. A small number of primitives is useful for construction but should not determine the finished appearance. Use thicker near silhouettes and softer secondary contours. Hatching directions should turn with the form and be clipped to their intended plane. Avoid blurred filters as a substitute for drawing shadows.

Keep transforms away from the geometry when possible: a rest-position wrapper can contain a separate animated joint group. Rotation pivots should agree with the visible anatomy. Each animated path morph must preserve path command topology; for major topology changes, author distinct poses and transition deliberately.

## Corpus prompt template

“Create an original [subject/action] as editable native SVG at [viewBox]. Use [reference ID] to study [observed craft], not to reproduce the book page. Compose [framing, gesture, camera, focal point, negative space]. Construct [anatomical landmarks and proportions]. Illuminate from [direction], with [shadow planes, contact, reflected light]. Use [palette and materials], [stroke hierarchy], and [selective texture]. Group [anatomical/prop parts] for animation. During seven seconds: [establish, anticipate, act, react, settle]. End [seamlessly at rest / at a stated final pose]. Deliver static and animated SVG, encoded video if requested, and metadata linking prompt, reference, and output.”
