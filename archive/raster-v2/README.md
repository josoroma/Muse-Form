# Seven — The moving atelier

24 realistic drawing and story studies, each with a high-resolution PNG, a restrained seven-second cinemagraph, an editable motion rig, a silent MP4, and its complete reusable prompt. This edition replaces the earlier flat SVG artwork with graphite anatomy/portrait plates and painted fantasy scenes.

![The realistic illustration corpus](qa/realism/plates-contact.jpg)

## Open the collection

```sh
npm ci
npm start
```

Open **http://127.0.0.1:4173**. Choose a plate, press Play, or scrub the timeline. Space plays/pauses; arrow keys step a frame outside interactive controls. Playback starts paused, honors reduced motion, and pauses when hidden. Individual HTML scenes also need the local server. PNGs and MP4s open directly.

## Medium and motion

The new masters are **1448 × 1086 raster illustrations**, generated with the built-in image generation tool and visually reviewed. Continuous halftones, coherent lighting, believable proportions, clean edges and perspective carry the realism. The fantasy scenes use painterly color and atmospheric depth.

Animation uses small authored WebGL mesh regions, fixed contact areas and selective light changes. These are **cinemagraphs of held poses**: breaths, tiny changes of intention, cloth/foliage response and light. They are not fully articulated performances or expression transformations. Rigid anatomy and props stay constrained; there is no whole-picture camera sway. SVG remains an option for future drawings where its geometry serves the art, but these paintings are not mislabeled as editable vectors.

All films are **7.000 seconds · 1200 × 900 · 30 fps · H.264 · 210 frames · silent**. The source artwork and JSON motion rig remain separate and reusable. Source photographs stay in Downloads and are not bundled. The studies are original interpretations, not traced book pages; the anatomy has not been medically validated.

## Review and reproducibility

Each illustration was inspected for anatomy, focal hierarchy, light and material, clean contours, cropping and source relevance. Corrections include portrait margins, natural arm musculature, a distinct dorsal foot view and telescope/eye alignment. Each metadata entry records the actual prompt, subjective scores and concrete review notes. Scores are judgments, not a quality certificate.

The six-pose sheets, source frame comparisons, loop/seek checks and encoded film results live in [qa/realism](qa/realism). [Individual art review](qa/realism/art-review.json), [animation checks](qa/realism/check-results.json) and [film verification](qa/realism/verification.json) distinguish visual judgment from technical checks. The first edition is preserved in [archive/vector-v1](archive/vector-v1) and is not used by the gallery.

```sh
npm run compose                 # build HTML scenes and editable rigs from reviewed metadata
npm run catalog                 # rebuild this prompt catalog and manifest
npm run check                   # rendered poses, deterministic seeks and exact loop closure
npm run render                  # all 24 films
npm run render -- 105232 105234  # selected films
npm run verify                  # encoded frames, duration and gallery controls
npm run install-skill           # refresh portable corpus and installed skill
```

Rendering requires Node.js 22+, local Chrome/Chromium, FFmpeg and ffprobe. Set CHROME_PATH for a nonstandard browser location. Playwright Core is pinned; the gallery has no CDN or runtime library dependency. The artwork is reproducible as a prompt/reference workflow, not a deterministic image-generation seed. The animation is derived from absolute time; frames cover [0,7), and the endpoint at 7 is checked separately.

## Reusable skill

[Read the skill](skills/seven-second-storytelling/SKILL.md) or use the [portable bundle](exports/seven-second-storytelling.skill.zip). It includes all 24 master paintings, HTML scenes, motion rigs, the small runtime, prompts and review guidance. Films remain available separately below. Installation targets CODEX_HOME/skills/seven-second-storytelling, falling back to ~/.codex/skills/seven-second-storytelling. Start a new Codex conversation if its available-skill list has not refreshed.

> Use $seven-second-storytelling to make a realistic, clean seven-second scene of a pirate helping a small forest creature. Inspect the references, choose a medium that supports the art, judge anatomy and contact points in the final frames, and include the complete prompt and local asset links.

## Research sources

[Hairline](https://github.com/lucasmarkes/hairline) informed line hierarchy, composed resting frames and bounded motion. Timing, staging, acting, loop design and deterministic render/inspect practice were also informed by [Awesome motion design agent skills](https://github.com/frankxai/awesome-motion-design-agent-skills), [Claude Motion](https://github.com/whaleyxbt/claude-motion), [iart motion-design-skills](https://github.com/iart-ai/motion-design-skills), [HyperFrames motion reel guide](https://sunwood-ai-labs.github.io/hyperframes-motion-reel-skill/guide/getting-started), [Motion Designer](https://github.com/kaventro/motion-designer) and [iart motion-skills](https://github.com/iart-ai/motion-skills). [Research notes](skills/seven-second-storytelling/references/sources.md) record inspected revisions and licenses. No upstream rendering engine is bundled.

## Corpus index

[Machine-readable manifest](corpus/manifest.json). Editable catalog inputs are corpus/realism/*.json. Each source maps to one study. Study 105220 is correctly identified as a bent leg/knee; the old edition's shoulder label was wrong.

| Source | Study | Master | Seven seconds | Motion rig | Film |
| --- | --- | --- | --- | --- | --- |
| 105193.jpg | [Architecture beneath the face](#study-105193) | [PNG](corpus/plates/105193.png) | [Play](corpus/animated/105193.html) | [JSON](corpus/animated/105193.json) | [MP4](exports/105193.mp4) |
| 105194.jpg | [The globe beneath the lid](#study-105194) | [PNG](corpus/plates/105194.png) | [Play](corpus/animated/105194.html) | [JSON](corpus/animated/105194.json) | [MP4](exports/105194.mp4) |
| 105195.jpg | [Cartilage catching the light](#study-105195) | [PNG](corpus/plates/105195.png) | [Play](corpus/animated/105195.html) | [JSON](corpus/animated/105195.json) | [MP4](exports/105195.mp4) |
| 105196.jpg | [A smile finding its way](#study-105196) | [PNG](corpus/plates/105196.png) | [Play](corpus/animated/105196.html) | [JSON](corpus/animated/105196.json) | [MP4](exports/105196.mp4) |
| 105197.jpg | [The weight of a quiet thought](#study-105197) | [PNG](corpus/plates/105197.png) | [Play](corpus/animated/105197.html) | [JSON](corpus/animated/105197.json) | [MP4](exports/105197.mp4) |
| 105198.jpg | [A storm held behind the eyes](#study-105198) | [PNG](corpus/plates/105198.png) | [Play](corpus/animated/105198.html) | [JSON](corpus/animated/105198.json) | [MP4](exports/105198.mp4) |
| 105199.jpg | [The moment before the courage](#study-105199) | [PNG](corpus/plates/105199.png) | [Play](corpus/animated/105199.html) | [JSON](corpus/animated/105199.json) | [MP4](exports/105199.mp4) |
| 105200.jpg | [An astonishment in warm light](#study-105200) | [PNG](corpus/plates/105200.png) | [Play](corpus/animated/105200.html) | [JSON](corpus/animated/105200.json) | [MP4](exports/105200.mp4) |
| 105202.jpg | [Laughter in profile](#study-105202) | [PNG](corpus/plates/105202.png) | [Play](corpus/animated/105202.html) | [JSON](corpus/animated/105202.json) | [MP4](exports/105202.mp4) |
| 105203.jpg | [A conspiratorial wink](#study-105203) | [PNG](corpus/plates/105203.png) | [Play](corpus/animated/105203.html) | [JSON](corpus/animated/105203.json) | [MP4](exports/105203.mp4) |
| 105214.jpg | [A Breath Through the Spiral](#study-105214) | [PNG](corpus/plates/105214.png) | [Play](corpus/animated/105214.html) | [JSON](corpus/animated/105214.json) | [MP4](exports/105214.mp4) |
| 105215.jpg | [Tension in the Turn](#study-105215) | [PNG](corpus/plates/105215.png) | [Play](corpus/animated/105215.html) | [JSON](corpus/animated/105215.json) | [MP4](exports/105215.mp4) |
| 105216.jpg | [The Palm Opens](#study-105216) | [PNG](corpus/plates/105216.png) | [Play](corpus/animated/105216.html) | [JSON](corpus/animated/105216.json) | [MP4](exports/105216.mp4) |
| 105217.jpg | [Tendons Beneath the Gesture](#study-105217) | [PNG](corpus/plates/105217.png) | [Play](corpus/animated/105217.html) | [JSON](corpus/animated/105217.json) | [MP4](exports/105217.mp4) |
| 105218.jpg | [Weight Through the Outer Leg](#study-105218) | [PNG](corpus/plates/105218.png) | [Play](corpus/animated/105218.html) | [JSON](corpus/animated/105218.json) | [MP4](exports/105218.mp4) |
| 105219.jpg | [The Calf Holds the Weight](#study-105219) | [PNG](corpus/plates/105219.png) | [Play](corpus/animated/105219.html) | [JSON](corpus/animated/105219.json) | [MP4](exports/105219.mp4) |
| 105220.jpg | [The Knee Connects the Gesture](#study-105220) | [PNG](corpus/plates/105220.png) | [Play](corpus/animated/105220.html) | [JSON](corpus/animated/105220.json) | [MP4](exports/105220.mp4) |
| 105221.jpg | [Five Toes, One Foundation](#study-105221) | [PNG](corpus/plates/105221.png) | [Play](corpus/animated/105221.html) | [JSON](corpus/animated/105221.json) | [MP4](exports/105221.mp4) |
| 105222.jpg | [The Foot Seen from Above](#study-105222) | [PNG](corpus/plates/105222.png) | [Play](corpus/animated/105222.html) | [JSON](corpus/animated/105222.json) | [MP4](exports/105222.mp4) |
| 105223.jpg | [Weight Across the Foot](#study-105223) | [PNG](corpus/plates/105223.png) | [Play](corpus/animated/105223.html) | [JSON](corpus/animated/105223.json) | [MP4](exports/105223.mp4) |
| 105232.jpg | [The Captain Who Charted the Moon](#study-105232) | [PNG](corpus/plates/105232.png) | [Play](corpus/animated/105232.html) | [JSON](corpus/animated/105232.json) | [MP4](exports/105232.mp4) |
| 105233.jpg | [The Lantern Keeper of Willow Marsh](#study-105233) | [PNG](corpus/plates/105233.png) | [Play](corpus/animated/105233.html) | [JSON](corpus/animated/105233.json) | [MP4](exports/105233.mp4) |
| 105234.jpg | [A Small Worm and a Borrowed Star](#study-105234) | [PNG](corpus/plates/105234.png) | [Play](corpus/animated/105234.html) | [JSON](corpus/animated/105234.json) | [MP4](exports/105234.mp4) |
| 105235.jpg | [The Gardener Who Grew Another Morning](#study-105235) | [PNG](corpus/plates/105235.png) | [Play](corpus/animated/105235.html) | [JSON](corpus/animated/105235.json) | [MP4](exports/105235.mp4) |

## Complete prompts and individual review

<a id="study-105193"></a>

### 105193 — Architecture beneath the face

**Reference:** 105193.jpg · **Category:** skull-and-orbit

**Reference observation:** The reference isolates the bony orbit, nasal aperture and zygomatic arches. Deep occlusion is nearly black, while thin rim lights make the thickness of bone readable.

**Generation prompt:**

Use case: illustration-story. Asset type: polished original fine-art corpus plate, landscape 4:3 composition at the highest available resolution. Create a masterful realistic graphite and soft charcoal atelier drawing on warm ivory paper. Image 1 is ONLY an anatomical/expressive reference photographed from a book: learn the anatomy and gesture; do not copy the page composition, captions, diagrams, paper skew or identity. Image 2 is ONLY the approved rendering-style reference: match its convincing volume, fine graphite grain, exquisite controlled tone, soft upper-left window light and quiet ivory ground. A finished gallery-quality drawing, refined and anatomically observed, not a photograph, not plastic CGI. Beautiful broad halftones, selective crisp focal edges, delicate secondary edges and lost edges toward the base. Absolutely no heavy uniform outlines, flat vector shapes, repetitive hatch bands, scratchy construction lines, doodles, diagrams, letters, text, signatures, watermarks or borders. Keep a clean restful composition with generous negative space; the subject fills 70–80% of image height. One complete dry adult human skull in an elegant three-quarter view turned slightly to the viewer's left, resting naturally on a subtle planar surface. Convincing cranial vault and temple, deep anatomically shaped orbital cavities, bony nasal opening, open zygomatic arches, delicate maxilla and clearly structured mandible. Upper and lower teeth are naturally interlocking, not an exaggerated grin; dental arcade recedes correctly in perspective. Tiny irregular bone pores and sutures, no grotesque damage. Light upper-left illuminates forehead and cheek rim, rich soft occlusion within orbits, believable reflected light and one quiet contact shadow. Entire skull fits inside frame without clipping.

**Motion direction:** Rigid osteological plate. A restrained local increase in the existing upper-left illumination reveals orbital depth; no mandible deformation.

**Individual review:** Clear cranial volume, correctly receding arches and convincing orbital occlusion. Dental irregularity is plausible as a drawing but not a clinically validated tooth atlas. Complete silhouette and stable contact shadow; fairly close framing suits the osteological study.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 5; composition 4.

[Master PNG](corpus/plates/105193.png) · [Seven-second scene](corpus/animated/105193.html) · [Editable rig](corpus/animated/105193.json) · [MP4](exports/105193.mp4) · [Motion sheet](qa/realism/105193-motion.jpg)

<a id="study-105194"></a>

### 105194 — The globe beneath the lid

**Reference:** 105194.jpg · **Category:** eye-anatomy

**Reference observation:** The eyeball and both lids wrap around a sphere. The brow ridge, tear lake, lid crease and lower orbital plane must turn in depth rather than become flat graphic outlines.

**Generation prompt:**

Use case: illustration-story. Asset type: polished original fine-art corpus plate, landscape 4:3 composition at the highest available resolution. Create a masterful realistic graphite and soft charcoal atelier drawing on warm ivory paper. Image 1 is ONLY an anatomical/expressive reference photographed from a book: learn the anatomy and gesture; do not copy the page composition, captions, diagrams, paper skew or identity. Image 2 is ONLY the approved rendering-style reference: match its convincing volume, fine graphite grain, exquisite controlled tone, soft upper-left window light and quiet ivory ground. A finished gallery-quality drawing, refined and anatomically observed, not a photograph, not plastic CGI. Beautiful broad halftones, selective crisp focal edges, delicate secondary edges and lost edges toward the base. Absolutely no heavy uniform outlines, flat vector shapes, repetitive hatch bands, scratchy construction lines, doodles, diagrams, letters, text, signatures, watermarks or borders. Keep a clean restful composition with generous negative space; the subject fills 70–80% of image height. A beautifully observed close study of one adult human eye and surrounding orbital planes, brow and bridge of nose at the left. Natural relaxed open eye looking slightly to the right of camera. Both eyelids visibly wrap a spherical globe with believable thickness; small tear duct, subtle wet lower lid, detailed iris whose top is partially covered by upper lid, single luminous catchlight. Realistically grouped sparse lashes and directional eyebrow hairs. Sculpt the brow ridge, upper lid crease and lower orbital volume with soft graphite tone, not dark cosmetic outlines. Fade the surrounding skin study gracefully into clean paper; eye is the single focal point.

**Motion direction:** Keep eye, lashes, pupil and lids rigid. A small warm-light breath over the orbital plane studies surface depth without pretending to animate a blink.

**Individual review:** Lids visibly envelop the globe; believable tear lake, wet lower edge and orbital brow. Iris foreshortening and grouped lashes are convincing. Fine graphite grain remains quiet and the only sharp accent is the focal eye.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 5; composition 5.

[Master PNG](corpus/plates/105194.png) · [Seven-second scene](corpus/animated/105194.html) · [Editable rig](corpus/animated/105194.json) · [MP4](exports/105194.mp4) · [Motion sheet](qa/realism/105194-motion.jpg)

<a id="study-105195"></a>

### 105195 — Cartilage catching the light

**Reference:** 105195.jpg · **Category:** ear-anatomy

**Reference observation:** The ear has a continuous helix, a bifurcated antihelix, triangular fossa, deep concha, projecting tragus and soft lobule. Its back surface and overlapping folds are volumes, not a flat symbol.

**Generation prompt:**

Use case: illustration-story. Asset type: polished original fine-art corpus plate, landscape 4:3 composition at the highest available resolution. Create a masterful realistic graphite and soft charcoal atelier drawing on warm ivory paper. Image 1 is ONLY an anatomical/expressive reference photographed from a book: learn the anatomy and gesture; do not copy the page composition, captions, diagrams, paper skew or identity. Image 2 is ONLY the approved rendering-style reference: match its convincing volume, fine graphite grain, exquisite controlled tone, soft upper-left window light and quiet ivory ground. A finished gallery-quality drawing, refined and anatomically observed, not a photograph, not plastic CGI. Beautiful broad halftones, selective crisp focal edges, delicate secondary edges and lost edges toward the base. Absolutely no heavy uniform outlines, flat vector shapes, repetitive hatch bands, scratchy construction lines, doodles, diagrams, letters, text, signatures, watermarks or borders. Keep a clean restful composition with generous negative space; the subject fills 70–80% of image height. A single large human left ear, upright, seen in a slight three-quarter view attached to a delicately indicated side of head. Draw the continuous fleshy helix, correctly branching antihelix, triangular fossa, deep conchal bowl, tragus, antitragus and attached soft lobule with exquisite subtle tonal volume. The ear is a plausible living anatomical form, not a detached plastic model or symbolic spiral. A thin suggestion of temple and neck fades into ivory paper; no stray hair covering the cartilage. Ear centered with margins, its full silhouette visible.

**Motion direction:** Cartilage remains rigid. A quiet light variation follows the already illuminated ear, retaining all conchal shadows and attachment.

**Individual review:** Readable helix, branching antihelix, concha and lobule with coherent attached skin. Excellent soft/hard edge balance. The subtle anatomical drawing remains an art study rather than a medically validated diagram.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 5; composition 5.

[Master PNG](corpus/plates/105195.png) · [Seven-second scene](corpus/animated/105195.html) · [Editable rig](corpus/animated/105195.json) · [MP4](exports/105195.mp4) · [Motion sheet](qa/realism/105195-motion.jpg)

<a id="study-105196"></a>

### 105196 — A smile finding its way

**Reference:** 105196.jpg · **Category:** happiness

**Reference observation:** Relaxed brow, cheek lifting and the outward pull of the closed smiling mouth.

**Generation prompt:**

Use case: illustration-story. Asset type: polished original fine-art corpus plate, landscape 4:3 composition at the highest available resolution. Create a masterful realistic graphite and soft charcoal atelier drawing on warm ivory paper. Image 1 is ONLY an anatomical/expressive reference photographed from a book: learn the anatomy and gesture; do not copy the page composition, captions, diagrams, paper skew or identity. Image 2 is ONLY the approved rendering-style reference: match its convincing volume, fine graphite grain, exquisite controlled tone, soft upper-left window light and quiet ivory ground. A finished gallery-quality drawing, refined and anatomically observed, not a photograph, not plastic CGI. Beautiful broad halftones, selective crisp focal edges, delicate secondary edges and lost edges toward the base. Absolutely no heavy uniform outlines, flat vector shapes, repetitive hatch bands, scratchy construction lines, doodles, diagrams, letters, text, signatures, watermarks or borders. Keep a clean restful composition with generous negative space; the subject fills 70–80% of image height. An original adult man around forty in a natural three-quarter head-and-shoulders portrait, dark wavy short hair, warm expressive eyes and a genuine restrained closed-mouth smile. Smiling cheek pads lift softly, lower lids narrow slightly, mouth corners rise with natural asymmetry; relaxed forehead and brows. A real individual with subtle skin pores, restrained stubble, believable nose cartilage and ear folds, head/neck/shoulder proportions. Dress simply in an open-collar dark linen shirt whose lower shoulders dissolve into paper. Emotion is welcoming and quietly happy, not a posed advertising grin. No props. Keep the head complete with air above hair.

**Refinement prompt:**

Edit target: the supplied graphite portrait. Make exactly one correction: reframe this SAME drawing wider so the entire portrait is about 12% smaller within the landscape 4:3 canvas. Add clean matching warm ivory paper around it, especially a clearly visible 8% margin ABOVE the highest hair strand. Retain the identical face, expression, identity, anatomical proportions, light, graphite detail, paper texture, clothing and pose. Keep both shoulders pleasantly fading into the bottom of the paper, not cut by a hard edge. No face retouching, no changed smile or gaze, no new details, no text, no border. The head must be complete with comfortable breathing room and may never touch the top edge.

**Motion direction:** A minute warm nod and relaxed shoulder breath; expression stays drawn and fixed. Eyes, nose and mouth move together without face scaling.

**Individual review:** Coordinated cheek lift and soft lower lids support a restrained closed-mouth smile. Nose, ear and neck remain dimensional. First candidate framed hair too tightly; second pass adds clean paper and softer shoulder endings.

**Subjective still scores (1–5):** anatomy 5; lighting 5; cleanliness 5; composition 5.

[Master PNG](corpus/plates/105196.png) · [Seven-second scene](corpus/animated/105196.html) · [Editable rig](corpus/animated/105196.json) · [MP4](exports/105196.mp4) · [Motion sheet](qa/realism/105196-motion.jpg)

<a id="study-105197"></a>

### 105197 — The weight of a quiet thought

**Reference:** 105197.jpg · **Category:** sadness

**Reference observation:** The inner brows draw upward and together while the lip corners and gaze fall.

**Generation prompt:**

Use case: illustration-story. Asset type: polished original fine-art corpus plate, landscape 4:3 composition at the highest available resolution. Create a masterful realistic graphite and soft charcoal atelier drawing on warm ivory paper. Image 1 is ONLY an anatomical/expressive reference photographed from a book: learn the anatomy and gesture; do not copy the page composition, captions, diagrams, paper skew or identity. Image 2 is ONLY the approved rendering-style reference: match its convincing volume, fine graphite grain, exquisite controlled tone, soft upper-left window light and quiet ivory ground. A finished gallery-quality drawing, refined and anatomically observed, not a photograph, not plastic CGI. Beautiful broad halftones, selective crisp focal edges, delicate secondary edges and lost edges toward the base. Absolutely no heavy uniform outlines, flat vector shapes, repetitive hatch bands, scratchy construction lines, doodles, diagrams, letters, text, signatures, watermarks or borders. Keep a clean restful composition with generous negative space; the subject fills 70–80% of image height. An original adult man around fifty with a long thoughtful face, slightly receding short hair and subtle gray beard stubble, in a gentle three-quarter head-and-shoulders portrait expressing quiet sadness. The gaze falls slightly downward, inner eyebrows rise and draw together, mouth is closed with barely lowered corners, soft tension in the lower lip. Tender believable emotional restraint, no cartoon frown or tears. Sculpt the orbital and cheek planes, the nose and chin, and the natural neck tendons with fine continuous graphite tone. Simple light linen shirt fading at shoulders into clean paper. Complete head and hair with at least 7% quiet margin above it.

**Refinement prompt:**

Edit target: the supplied graphite portrait. Make exactly one correction: reframe this SAME drawing wider so the entire portrait is about 12% smaller within the landscape 4:3 canvas. Add clean matching warm ivory paper around it, especially a clearly visible 8% margin ABOVE the highest hair strand. Retain the identical face, expression, identity, anatomical proportions, light, graphite detail, paper texture, clothing and pose. Keep both shoulders pleasantly fading into the bottom of the paper, not cut by a hard edge. No face retouching, no changed smile or gaze, no new details, no text, no border. The head must be complete with comfortable breathing room and may never touch the top edge.

**Motion direction:** A barely perceptible downward head intention followed by a slow breath and return; no eye or lip morphing.

**Individual review:** Inner brows lift under believable forehead tension, lowered gaze and mouth corners read as quiet sadness. Refined beard and age detail avoid a plastic finish. Reframed to preserve clear head margin and soften shoulders.

**Subjective still scores (1–5):** anatomy 5; lighting 5; cleanliness 5; composition 5.

[Master PNG](corpus/plates/105197.png) · [Seven-second scene](corpus/animated/105197.html) · [Editable rig](corpus/animated/105197.json) · [MP4](exports/105197.mp4) · [Motion sheet](qa/realism/105197-motion.jpg)

<a id="study-105198"></a>

### 105198 — A storm held behind the eyes

**Reference:** 105198.jpg · **Category:** anger

**Reference observation:** Compressed eyebrows, narrowed lids, flared nostrils and a tense, narrow mouth.

**Generation prompt:**

Use case: illustration-story. Asset type: polished original fine-art corpus plate, landscape 4:3 composition at the highest available resolution. Create a masterful realistic graphite and soft charcoal atelier drawing on warm ivory paper. Image 1 is ONLY an anatomical/expressive reference photographed from a book: learn the anatomy and gesture; do not copy the page composition, captions, diagrams, paper skew or identity. Image 2 is ONLY the approved rendering-style reference: match its convincing volume, fine graphite grain, exquisite controlled tone, soft upper-left window light and quiet ivory ground. A finished gallery-quality drawing, refined and anatomically observed, not a photograph, not plastic CGI. Beautiful broad halftones, selective crisp focal edges, delicate secondary edges and lost edges toward the base. Absolutely no heavy uniform outlines, flat vector shapes, repetitive hatch bands, scratchy construction lines, doodles, diagrams, letters, text, signatures, watermarks or borders. Keep a clean restful composition with generous negative space; the subject fills 70–80% of image height. An original adult man around thirty-five with close-cropped hair, broad cheekbones, a strong nose and light beard stubble, in a near-front three-quarter head-and-shoulders portrait expressing controlled anger. Eyebrows compress down and inward, glabella subtly furrows, upper lids narrow around a focused gaze, nostrils gently flare, lips press together in a believable firm line and jaw clenches. No teeth bared, no shouting or grotesque caricature. Natural asymmetry, restrained pores and skin folds, strong believable neck structure. Simple dark work shirt dissolving at lower shoulders into paper. Complete head with at least 7% clear paper above hair. Emotion vivid through coordinated small facial changes.

**Refinement prompt:**

Edit target: the supplied graphite portrait. Make exactly one correction: reframe this SAME drawing wider so the entire portrait is about 12% smaller within the landscape 4:3 canvas. Add clean matching warm ivory paper around it, especially a clearly visible 8% margin ABOVE the highest hair strand. Retain the identical face, expression, identity, anatomical proportions, light, graphite detail, paper texture, clothing and pose. Keep both shoulders pleasantly fading into the bottom of the paper, not cut by a hard edge. No face retouching, no changed smile or gaze, no new details, no text, no border. The head must be complete with comfortable breathing room and may never touch the top edge.

**Motion direction:** Small held head intention and restrained breath, with a deliberate settle. The stern expression remains intact.

**Individual review:** Compressed brow, narrowed lids and taut mouth clearly communicate controlled anger. Cheek and neck anatomy stay coherent under the expression. Reframing improves balance without changing the face.

**Subjective still scores (1–5):** anatomy 5; lighting 5; cleanliness 5; composition 5.

[Master PNG](corpus/plates/105198.png) · [Seven-second scene](corpus/animated/105198.html) · [Editable rig](corpus/animated/105198.json) · [MP4](exports/105198.mp4) · [Motion sheet](qa/realism/105198-motion.jpg)

<a id="study-105199"></a>

### 105199 — The moment before the courage

**Reference:** 105199.jpg · **Category:** fear

**Reference observation:** Wide visible irises, lifted brows and retracted lips revealing a tense strip of teeth.

**Generation prompt:**

Use case: illustration-story. Asset type: polished original fine-art corpus plate, landscape 4:3 composition at the highest available resolution. Create a masterful realistic graphite and soft charcoal atelier drawing on warm ivory paper. Image 1 is ONLY an anatomical/expressive reference photographed from a book: learn the anatomy and gesture; do not copy the page composition, captions, diagrams, paper skew or identity. Image 2 is ONLY the approved rendering-style reference: match its convincing volume, fine graphite grain, exquisite controlled tone, soft upper-left window light and quiet ivory ground. A finished gallery-quality drawing, refined and anatomically observed, not a photograph, not plastic CGI. Beautiful broad halftones, selective crisp focal edges, delicate secondary edges and lost edges toward the base. Absolutely no heavy uniform outlines, flat vector shapes, repetitive hatch bands, scratchy construction lines, doodles, diagrams, letters, text, signatures, watermarks or borders. Keep a clean restful composition with generous negative space; the subject fills 70–80% of image height. An original adult man in his late twenties with short tousled hair, clean-shaven narrow face, realistic eyes and fine facial features, in a three-quarter head-and-shoulders portrait expressing a sudden moment of fear held under control. Inner brows lift and tense together, upper eyelids widen with a small visible strip of sclera above the iris but eyes stay anatomically natural, lower eyelids tense. Lips part slightly and retract horizontally to reveal only a narrow strip of upper teeth; tense jaw and subtle neck tendons. No screaming, no monster face, no melodramatic bulging eyeballs, no sweat drops. Simple open-neck shirt fading at shoulder edges. Complete head with 7% paper above the hair. Clean elegant fine art finish with the emotional focal point at the eyes.

**Refinement prompt:**

Edit target: the supplied graphite portrait. Make exactly one correction: reframe this SAME drawing wider so the entire portrait is about 12% smaller within the landscape 4:3 canvas. Add clean matching warm ivory paper around it, especially a clearly visible 8% margin ABOVE the highest hair strand. Retain the identical face, expression, identity, anatomical proportions, light, graphite detail, paper texture, clothing and pose. Keep both shoulders pleasantly fading into the bottom of the paper, not cut by a hard edge. No face retouching, no changed smile or gaze, no new details, no text, no border. The head must be complete with comfortable breathing room and may never touch the top edge.

**Motion direction:** A tiny retreat and restrained breath keep the fearful pose alive. Preserve the iris, teeth and facial proportions as a single coherent region.

**Individual review:** Raised tense inner brows, upward glance and retracted parted lips distinguish fear from surprise. Teeth form a narrow plausible strip. First candidate touched the upper hair margin; second pass fixes the framing and shoulder fade.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 5; composition 5.

[Master PNG](corpus/plates/105199.png) · [Seven-second scene](corpus/animated/105199.html) · [Editable rig](corpus/animated/105199.json) · [MP4](exports/105199.mp4) · [Motion sheet](qa/realism/105199-motion.jpg)

<a id="study-105200"></a>

### 105200 — An astonishment in warm light

**Reference:** 105200.jpg · **Category:** surprise

**Reference observation:** Raised orbital arches, round open eyes and a lowered jaw create surprise.

**Generation prompt:**

Use case: illustration-story. Asset type: polished original fine-art corpus plate, landscape 4:3 composition at the highest available resolution. Create a masterful realistic graphite and soft charcoal atelier drawing on warm ivory paper. Image 1 is ONLY an anatomical/expressive reference photographed from a book: learn the anatomy and gesture; do not copy the page composition, captions, diagrams, paper skew or identity. Image 2 is ONLY the approved rendering-style reference: match its convincing volume, fine graphite grain, exquisite controlled tone, soft upper-left window light and quiet ivory ground. A finished gallery-quality drawing, refined and anatomically observed, not a photograph, not plastic CGI. Beautiful broad halftones, selective crisp focal edges, delicate secondary edges and lost edges toward the base. Absolutely no heavy uniform outlines, flat vector shapes, repetitive hatch bands, scratchy construction lines, doodles, diagrams, letters, text, signatures, watermarks or borders. Keep a clean restful composition with generous negative space; the subject fills 70–80% of image height. An original adult man around thirty with gently curled dark hair, clean-shaven face and delicate expressive features, in a near-front three-quarter head-and-shoulders portrait expressing genuine astonishment. Both brows naturally rise with fine horizontal forehead creases, eyes widen but retain natural iris size, jaw drops slightly to form a soft oval gasp. Mouth anatomy correctly articulates lips, small visible upper incisors and dark interior; lower jaw connected to believable neck. Wonder rather than terror, clear contrast to a frightened expression. Simple light linen shirt dissolving at shoulders into paper. The COMPLETE head is inside the image with generous blank paper above the hair; frame WIDER rather than cropping the hair.

**Refinement prompt:**

Edit target: the supplied graphite portrait. Make exactly one correction: reframe this SAME drawing wider so the entire portrait is about 12% smaller within the landscape 4:3 canvas. Add clean matching warm ivory paper around it, especially a clearly visible 8% margin ABOVE the highest hair strand. Retain the identical face, expression, identity, anatomical proportions, light, graphite detail, paper texture, clothing and pose. Keep both shoulders pleasantly fading into the bottom of the paper, not cut by a hard edge. No face retouching, no changed smile or gaze, no new details, no text, no border. The head must be complete with comfortable breathing room and may never touch the top edge.

**Motion direction:** Subtle upward head intention with a small chest breath; keep the astonished expression and mouth interior rigid.

**Individual review:** Raised orbital arches, clear natural irises and a softly dropped jaw read as astonishment. Mouth opening is shaped rather than symbolic. Second pass widens framing and keeps the same character.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 5; composition 5.

[Master PNG](corpus/plates/105200.png) · [Seven-second scene](corpus/animated/105200.html) · [Editable rig](corpus/animated/105200.json) · [MP4](exports/105200.mp4) · [Motion sheet](qa/realism/105200-motion.jpg)

<a id="study-105202"></a>

### 105202 — Laughter in profile

**Reference:** 105202.jpg · **Category:** laughter-profile

**Reference observation:** The profile laugh combines a rising cheek, compressed eyelid, deepened nasolabial fold and lowered mandible. The teeth wrap in perspective and the neck responds to the jaw.

**Generation prompt:**

Use case: illustration-story. Asset type: polished original fine-art corpus plate, landscape 4:3 composition at the highest available resolution. Create a masterful realistic graphite and soft charcoal atelier drawing on warm ivory paper. Image 1 is ONLY an anatomical/expressive reference photographed from a book: learn the anatomy and gesture; do not copy the page composition, captions, diagrams, paper skew or identity. Image 2 is ONLY the approved rendering-style reference: match its convincing volume, fine graphite grain, exquisite controlled tone, soft upper-left window light and quiet ivory ground. A finished gallery-quality drawing, refined and anatomically observed, not a photograph, not plastic CGI. Beautiful broad halftones, selective crisp focal edges, delicate secondary edges and lost edges toward the base. Absolutely no heavy uniform outlines, flat vector shapes, repetitive hatch bands, scratchy construction lines, doodles, diagrams, letters, text, signatures, watermarks or borders. Keep a clean restful composition with generous negative space; the subject fills 70–80% of image height. An original middle-aged adult man in clear RIGHT-facing profile caught in a warm spontaneous laugh, head slightly tipped back. Short slightly graying swept hair, realistic ear folds, eye joyfully narrowed with fine crow's feet, cheek raised, mouth opens naturally with perspective upper dental arcade and connected lower jaw; face is distinctly profile, only one eye visible. Strong nose silhouette, forehead, lips and chin form a beautiful natural contour with soft lost edges. Believable neck tendons and shoulder of a plain open-collar linen shirt, unfinished shoulders dissolving into paper. Balanced composition with empty space in front of the face, complete back of skull and ample paper above hair. No props and no exaggerated cartoon mouth.

**Refinement prompt:**

Edit target: the supplied graphite portrait. Make exactly one correction: reframe this SAME drawing wider so the entire portrait is about 12% smaller within the landscape 4:3 canvas. Add clean matching warm ivory paper around it, especially a clearly visible 8% margin ABOVE the highest hair strand. Retain the identical face, expression, identity, anatomical proportions, light, graphite detail, paper texture, clothing and pose. Keep both shoulders pleasantly fading into the bottom of the paper, not cut by a hard edge. No face retouching, no changed smile or gaze, no new details, no text, no border. The head must be complete with comfortable breathing room and may never touch the top edge.

**Motion direction:** A tiny coherent head lift and breathing response suggest the held laugh; keep jaw, teeth, eye and ear proportions fixed.

**Individual review:** Strong profile silhouette, lifted cheek, folded lid and receding dental arcade support a natural laugh. Neck follows the lifted chin. Second pass adds purposeful lead room and a safe top margin; no need to deform the jaw.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 5; composition 5.

[Master PNG](corpus/plates/105202.png) · [Seven-second scene](corpus/animated/105202.html) · [Editable rig](corpus/animated/105202.json) · [MP4](exports/105202.mp4) · [Motion sheet](qa/realism/105202-motion.jpg)

<a id="study-105203"></a>

### 105203 — A conspiratorial wink

**Reference:** 105203.jpg · **Category:** asymmetric-expression

**Reference observation:** A unilateral eyelid squeeze, one raised eyebrow and one tight mouth corner make an asymmetric expression.

**Generation prompt:**

Use case: illustration-story. Asset type: polished original fine-art corpus plate, landscape 4:3 composition at the highest available resolution. Create a masterful realistic graphite and soft charcoal atelier drawing on warm ivory paper. Image 1 is ONLY an anatomical/expressive reference photographed from a book: learn the anatomy and gesture; do not copy the page composition, captions, diagrams, paper skew or identity. Image 2 is ONLY the approved rendering-style reference: match its convincing volume, fine graphite grain, exquisite controlled tone, soft upper-left window light and quiet ivory ground. A finished gallery-quality drawing, refined and anatomically observed, not a photograph, not plastic CGI. Beautiful broad halftones, selective crisp focal edges, delicate secondary edges and lost edges toward the base. Absolutely no heavy uniform outlines, flat vector shapes, repetitive hatch bands, scratchy construction lines, doodles, diagrams, letters, text, signatures, watermarks or borders. Keep a clean restful composition with generous negative space; the subject fills 70–80% of image height. An original adult man around forty with slightly wavy dark hair and subtle stubble in a near-front head-and-shoulders portrait giving a playful conspiratorial wink. The eye on the viewer's LEFT is naturally closed by orbicularis contraction, with visible lid fold and lifted cheek; the eye on the viewer's RIGHT remains fully open, its brow slightly raised. A small asymmetric closed-mouth smile curls toward the winking side. Expression is charming and human, not exaggerated or grimacing. Perfectly coherent skull, cheeks, nose, realistic cartilage, lips and neck. Plain dark shirt fades near lower shoulders into the ivory paper. Complete head with ample blank paper above hair and both sides. Make this distinctly recognizable as a wink at first glance.

**Refinement prompt:**

Edit target: the supplied graphite portrait. Make exactly one correction: reframe this SAME drawing wider so the entire portrait is about 12% smaller within the landscape 4:3 canvas. Add clean matching warm ivory paper around it, especially a clearly visible 8% margin ABOVE the highest hair strand. Retain the identical face, expression, identity, anatomical proportions, light, graphite detail, paper texture, clothing and pose. Keep both shoulders pleasantly fading into the bottom of the paper, not cut by a hard edge. No face retouching, no changed smile or gaze, no new details, no text, no border. The head must be complete with comfortable breathing room and may never touch the top edge.

**Motion direction:** A minute knowing head inclination with a quiet breath. The existing wink stays fixed; no simulated eyelid closing or opening.

**Individual review:** Unilateral lid squeeze, raised cheek and asymmetric lip corner form a readable wink without a pasted-on eye. The open eye remains naturally shaped. Second pass fixes clipped top hair and restores clean negative space.

**Subjective still scores (1–5):** anatomy 5; lighting 5; cleanliness 5; composition 5.

[Master PNG](corpus/plates/105203.png) · [Seven-second scene](corpus/animated/105203.html) · [Editable rig](corpus/animated/105203.json) · [MP4](exports/105203.mp4) · [Motion sheet](qa/realism/105203-motion.jpg)

<a id="study-105214"></a>

### 105214 — A Breath Through the Spiral

**Reference:** 105214.jpg · **Category:** torso

**Reference observation:** The reference studies ribcage and pelvis counter-rotation, a raised shoulder and compression/stretch along the abdominal wall.

**Generation prompt:**

Use case: scientific-educational. Asset type: a finished original atelier anatomy drawing for a professional art-study corpus. Input image 1 is subject anatomy guidance from a photographed book page: extract anatomy and gesture only; do not reproduce the book, typography, diagrams, page layout, or exact drawing. Input image 2 is the definitive style reference: match its museum-quality realistic graphite and charcoal drawing, warm ivory paper, continuous tonal modeling, refined purposeful marks, subtle skin texture, controlled sharp and lost edges. A single adult male torso anatomical drawing in a gentle spiral stretch, three-quarter frontal view. Frame from the base of the neck, shoulders and upper arms fading into the paper, through the waist ending just above the pelvis; no genitals, no head. One shoulder raised so the clavicles and ribcage turn subtly against the abdominal plane. Natural athletic build rather than bodybuilder hypertrophy; pectorals merge organically into the deltoids, serratus only subtly indicated, correctly spaced abs interrupted by navel and obliques, skin remains skin. Beautiful ribcage volume, coherent contrapposto, long relaxed silhouette. Place torso in central 55 percent of the image with negative space either side. Lighting: single soft upper-left studio light; detailed halftones, dark occlusion only where anatomically appropriate, gentle reflected light; no harsh outlines. Landscape 4:3 composition, clean warm ivory paper extending to all edges, no border. The result must look like a master observational drawing, realistic and beautifully resolved, not a photograph or cartoon. Avoid flat vector shapes, cel shading, uniform repetitive hatching, heavy dark contour, overly swollen muscles, tubes, extra digits, floating anatomy stickers, muddy smudges, annotations, text, signatures and watermarks.

**Motion direction:** Seven-second breathing cycle: minute ribcage expansion and gentle raised-shoulder release, lower waist pinned. Keep chest displacement below 0.8 percent canvas and preserve clavicle attachment.

**Individual review:** Clavicles, pectorals, obliques and navel belong to one continuous torso; soft skin modeling avoids the previous separate vector patches. The torso is idealized and muscular, with intentional shoulder/neck crops. Waist and chest require restrained deformation.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 5; composition 4.

[Master PNG](corpus/plates/105214.png) · [Seven-second scene](corpus/animated/105214.html) · [Editable rig](corpus/animated/105214.json) · [MP4](exports/105214.mp4) · [Motion sheet](qa/realism/105214-motion.jpg)

<a id="study-105215"></a>

### 105215 — Tension in the Turn

**Reference:** 105215.jpg · **Category:** arm

**Reference observation:** The reference shows a flexed elbow, biceps/triceps interaction and the twisting forearm masses. The final study retains living skin rather than colored muscle diagrams.

**Generation prompt:**

Use case: scientific-educational. Asset type: a finished original atelier anatomy drawing for a professional art-study corpus. Input image 1 is subject anatomy guidance from a photographed book page: extract anatomy and gesture only; do not reproduce the book, typography, diagrams, page layout, or exact drawing. Input image 2 is the definitive style reference: match its museum-quality realistic graphite and charcoal drawing, warm ivory paper, continuous tonal modeling, refined purposeful marks, subtle skin texture, controlled sharp and lost edges. A single natural adult arm flexed at the elbow, shoulder on the left, elbow near lower right and loosely closed hand above. Show a convincing biceps contraction and triceps underside, forearm pronated slightly inward, correct wrist narrowing, tendons, soft knuckles and one believable thumb over loosely curled fingers. Include all of the softly closed fist and enough shoulder attachment; no severed stump effect. Muscles integrated under living skin, moderate athletic physique, not bodybuilder, not separate oval lobes. Compose the bent arm as a beautiful open triangle in central 75 percent of the horizontal canvas. Lighting: single soft upper-left studio light; detailed halftones, dark occlusion only where anatomically appropriate, gentle reflected light; no harsh outlines. Landscape 4:3 composition, clean warm ivory paper extending to all edges, no border. The result must look like a master observational drawing, realistic and beautifully resolved, not a photograph or cartoon. Avoid flat vector shapes, cel shading, uniform repetitive hatching, heavy dark contour, overly swollen muscles, tubes, extra digits, floating anatomy stickers, muddy smudges, annotations, text, signatures and watermarks.

**Refinement prompt:**

Use case: precise-object-edit. This is an art-direction revision to the attached graphite arm drawing. Keep its warm ivory paper, single upper-left light, fine continuous graphite rendering, bent-arm pose and plausible closed fist, but correct its excessive bodybuilder anatomy. Reduce the huge round shoulder cap and spherical biceps by about 25 percent. Draw a naturally lean adult man's arm with subtle tapered muscle contours and continuous skin, like an observational anatomical drawing of a fit everyday adult. Retain true biceps/triceps relationships, brachioradialis spiral into wrist, elbow and forearm coherent. The deltoid should merge gracefully into humerus, not a round ball sitting on it. Bicep should be an elongated subtle raised mass, not a sphere. Keep realistic creases, gentle tendons, skin texture. Open the composition out to leave at least 6 percent blank margin above the fist and below elbow and right of elbow. Softly fade shoulder base into paper at left. Landscape 4:3 professional atelier plate. No text, no labels, no watermark, no repetitive hatch pattern, no cel shading, no swollen isolated muscle lobes.

**Motion direction:** Small flex-and-release, emphasizing a restrained biceps contraction and one-degree wrist settle; shoulder, elbow and arm length pinned. Avoid translating the entire arm or deforming the fist.

**Individual review:** Regenerated once to reduce spherical shoulder and biceps bulges. Final arm has a more elongated biceps, connected elbow/forearm and plausible closed fist; still deliberately athletic and idealized. Fist and elbow remain fully in frame.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 5; composition 4.

[Master PNG](corpus/plates/105215.png) · [Seven-second scene](corpus/animated/105215.html) · [Editable rig](corpus/animated/105215.json) · [MP4](exports/105215.mp4) · [Motion sheet](qa/realism/105215-motion.jpg)

<a id="study-105216"></a>

### 105216 — The Palm Opens

**Reference:** 105216.jpg · **Category:** hand

**Reference observation:** The reference explains finger segment lengths, thumb opposition, the thenar pad and the cupped palm in perspective.

**Generation prompt:**

Use case: scientific-educational. Asset type: a finished original atelier anatomy drawing for a professional art-study corpus. Input image 1 is subject anatomy guidance from a photographed book page: extract anatomy and gesture only; do not reproduce the book, typography, diagrams, page layout, or exact drawing. Input image 2 is the definitive style reference: match its museum-quality realistic graphite and charcoal drawing, warm ivory paper, continuous tonal modeling, refined purposeful marks, subtle skin texture, controlled sharp and lost edges. A single adult open hand, palmar side toward viewer, wrist entering from lower left, fingertips angled gently toward upper right, fingers comfortably spread with slight natural flexion. Exactly five digits: one opposable thumb correctly arising from the thenar side, four graduated fingers with middle finger longest, ring slightly shorter and little finger distinctly shortest. The palm is a sculpted cupped volume with thenar and hypothenar pads, flexion creases, fine skin texture, natural finger pads and joints. Beautiful believable proportions, thumb-web hollow, subtle foreshortening, fully visible fingertips with generous blank margins. No accessories. Lighting: single soft upper-left studio light; detailed halftones, dark occlusion only where anatomically appropriate, gentle reflected light; no harsh outlines. Landscape 4:3 composition, clean warm ivory paper extending to all edges, no border. The result must look like a master observational drawing, realistic and beautifully resolved, not a photograph or cartoon. Avoid flat vector shapes, cel shading, uniform repetitive hatching, heavy dark contour, overly swollen muscles, tubes, extra digits, floating anatomy stickers, muddy smudges, annotations, text, signatures and watermarks.

**Motion direction:** A gentle palm cup and release with 0.3–0.5 percent canvas displacement around the finger bases; wrist remains pinned, finger lengths preserved, no independent detached fingertip movement.

**Individual review:** Five digits with differentiated lengths, believable thumb webbing, palmar pads and continuous wrist tendons. Finger creases follow joint planes. Clean silhouette and uninterrupted value transitions; blank space separates all fingertips.

**Subjective still scores (1–5):** anatomy 5; lighting 5; cleanliness 5; composition 5.

[Master PNG](corpus/plates/105216.png) · [Seven-second scene](corpus/animated/105216.html) · [Editable rig](corpus/animated/105216.json) · [MP4](exports/105216.mp4) · [Motion sheet](qa/realism/105216-motion.jpg)

<a id="study-105217"></a>

### 105217 — Tendons Beneath the Gesture

**Reference:** 105217.jpg · **Category:** hand

**Reference observation:** The source emphasizes dorsal tendons flowing into knuckles and finger centerlines receding in perspective.

**Generation prompt:**

Use case: scientific-educational. Asset type: original finished atelier anatomy drawing. Input image 1 is subject guidance from a photographed book page: extract anatomical relationships only, not the layout, labels or exact drawing. Input image 2 is definitive graphite rendering style: realistic living skin, beautifully resolved continuous tonal transitions, tissue and tendon detail, subtle paper grain, no heavy outline, warm ivory ground. A beautiful single adult dorsal hand, back of hand facing viewer, naturally reaching diagonally from lower left wrist toward upper right fingers. Four slightly bent and gently spaced fingers with middle longest, and a single thumb naturally angled to the side. Exactly five digits. Entire hand and fingers visible. Extensor tendons flow continuously from wrist toward each knuckle, disappearing beneath skin; realistic subtle veins, individual knuckles, skin wrinkles and short nails that follow curved fingertip planes. Natural soft taper, realistic webbing, no claws. Fingers relaxed rather than stiff or skeletal. Wrist and forearm base fade into paper at lower left. Composition fills central 75 percent of canvas. Single soft upper-left studio light, credible reflected light and narrow occlusion shadows. Warm ivory paper backdrop, restrained graphite and charcoal drawing with delicate purposeful marks, natural form shading and coherent perspective. One coherent limb study only. Landscape 4:3 canvas. Plenty of clear negative space, preserve complete extremities with at least 5 percent image margin. No diagrams, labels, arrows, text, signature, border or watermark. Not a photograph, not cartoon art, no vector patches, no repetitive hatch pattern, no muscular lobes or oversized swollen muscles, no detached-looking anatomy stickers, no muddy smudges.

**Motion direction:** Subtle knuckle lift followed by relaxation, wrist anchored and thumb contact stable. Keep deformation local to dorsal hand and proximal fingers; avoid wiggling individual fingertips.

**Individual review:** Five fingers are readable with natural nails, graduated lengths and a coherent thumb position. Extensor tendons emerge from a continuous wrist rather than parallel ropes. Slightly flexed little finger is foreshortened; it must not be stretched independently in motion.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 5; composition 5.

[Master PNG](corpus/plates/105217.png) · [Seven-second scene](corpus/animated/105217.html) · [Editable rig](corpus/animated/105217.json) · [MP4](exports/105217.mp4) · [Motion sheet](qa/realism/105217-motion.jpg)

<a id="study-105218"></a>

### 105218 — Weight Through the Outer Leg

**Reference:** 105218.jpg · **Category:** leg

**Reference observation:** The source examines lateral thigh and calf planes, knee transition and the long taper toward the ankle.

**Generation prompt:**

Use case: scientific-educational. Asset type: original finished atelier anatomy drawing. Input image 1 is subject guidance from a photographed book page: extract anatomical relationships only, not the layout, labels or exact drawing. Input image 2 is definitive graphite rendering style: realistic living skin, beautifully resolved continuous tonal transitions, tissue and tendon detail, subtle paper grain, no heavy outline, warm ivory ground. One adult lower limb in three-quarter OUTER SIDE view, standing with knee almost straight, cropped softly at upper thigh and showing complete ankle and foot grounded below. Strong but naturally proportioned anatomy: offset thigh and calf masses, subtle lateral quadriceps, clear knee/patella transition, slender tibial plane, realistic lateral ankle, Achilles insertion, and five toes foreshortened in a plausible lateral foot. The leg runs diagonally from upper left toward a foot at lower right, foot points right. No exposed bones or flayed muscle, no bodybuilder. Soft contact shadow under sole. Elegant taper, visible skin rather than muscles drawn as separate objects. Single soft upper-left studio light, credible reflected light and narrow occlusion shadows. Warm ivory paper backdrop, restrained graphite and charcoal drawing with delicate purposeful marks, natural form shading and coherent perspective. One coherent limb study only. Landscape 4:3 canvas. Plenty of clear negative space, preserve complete extremities with at least 5 percent image margin. No diagrams, labels, arrows, text, signature, border or watermark. Not a photograph, not cartoon art, no vector patches, no repetitive hatch pattern, no muscular lobes or oversized swollen muscles, no detached-looking anatomy stickers, no muddy smudges.

**Motion direction:** A restrained weight transfer through knee and calf while ankle, heel, forefoot and contact shadow remain pinned. Less than 0.8 percent lateral knee shift; no whole-leg floating.

**Individual review:** Clear asymmetry of calf and tibial planes with continuous ankle insertion and a planted five-toed foot. The long negative space strengthens the standing gesture. Quadriceps are intentionally cropped; contact shadow is tight under heel and forefoot.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 5; composition 5.

[Master PNG](corpus/plates/105218.png) · [Seven-second scene](corpus/animated/105218.html) · [Editable rig](corpus/animated/105218.json) · [MP4](exports/105218.mp4) · [Motion sheet](qa/realism/105218-motion.jpg)

<a id="study-105219"></a>

### 105219 — The Calf Holds the Weight

**Reference:** 105219.jpg · **Category:** leg

**Reference observation:** The photo studies the posterior thigh, knee hollow, two calf heads and Achilles tendon, including the interlocking forms around the rear knee.

**Generation prompt:**

Use case: scientific-educational. Asset type: original finished atelier anatomy drawing. Input image 1 is subject guidance from a photographed book page: extract anatomical relationships only, not the layout, labels or exact drawing. Input image 2 is definitive graphite rendering style: realistic living skin, beautifully resolved continuous tonal transitions, tissue and tendon detail, subtle paper grain, no heavy outline, warm ivory ground. One adult leg viewed from BEHIND in a relaxed standing posture, cropped softly below the buttock so upper thigh, hamstrings, knee hollow, both calf heads, Achilles tendon, heel and short suggestion of foot are visible. No buttocks, no genitals. The medial calf sits lower than lateral calf; the back of knee has a soft diamond hollow and tendon edges without dark outlined patches. Achilles narrows naturally into heel. The foot is planted and turned very slightly outward, its toes mostly naturally hidden beyond the heel from this rear camera view. Pose has a slight diagonal from upper right toward heel at lower center. Natural athletic build, leg subtly tapered and softly asymmetrical, credible weight bearing and contact shadow. Use a wide horizontal composition with calm negative space on both sides. Single soft upper-left studio light, credible reflected light and narrow occlusion shadows. Warm ivory paper backdrop, restrained graphite and charcoal drawing with delicate purposeful marks, natural form shading and coherent perspective. One coherent limb study only. Landscape 4:3 canvas. Plenty of clear negative space, preserve complete extremities with at least 5 percent image margin. No diagrams, labels, arrows, text, signature, border or watermark. Not a photograph, not cartoon art, no vector patches, no repetitive hatch pattern, no muscular lobes or oversized swollen muscles, no detached-looking anatomy stickers, no muddy smudges.

**Motion direction:** A subtle calf contraction traveling into a gentle knee release; keep Achilles length credible and heel/forefoot planted. Do not lift heel or move its contact shadow.

**Individual review:** Rear camera view reads clearly: calf heads differ in height, Achilles narrows into heel, toes are naturally occluded beyond the planted foot. Knee hollow is soft rather than a black diagram mark. Upper thigh is intentionally cropped to keep the study nonexplicit.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 5; composition 5.

[Master PNG](corpus/plates/105219.png) · [Seven-second scene](corpus/animated/105219.html) · [Editable rig](corpus/animated/105219.json) · [MP4](exports/105219.mp4) · [Motion sheet](qa/realism/105219-motion.jpg)

<a id="study-105220"></a>

### 105220 — The Knee Connects the Gesture

**Reference:** 105220.jpg · **Category:** leg

**Reference observation:** Corrected source mapping: 105220.jpg depicts the outer leg and a bent knee, not an arm. This study uses the seated bend to show thigh/calf connection across the knee.

**Generation prompt:**

Use case: scientific-educational. Asset type: original finished atelier anatomy drawing. Input image 1 is subject guidance from a photographed book page: extract anatomical relationships only, not the layout, labels or exact drawing. Input image 2 is definitive graphite rendering style: realistic living skin, beautifully resolved continuous tonal transitions, tissue and tendon detail, subtle paper grain, no heavy outline, warm ivory ground. A single adult bent leg observed from the OUTER SIDE, a study of the knee connection and quadriceps, based on the bent leg anatomy in input1. Seated pose, no furniture shown. Upper thigh slopes from upper left to knee at right-center; knee bent about 90 degrees; calf slopes down-left to a relaxed ankle and complete foot near lower center. Crop upper thigh softly without showing pelvis or genitals. Skin-covered anatomy: softly modeled quadriceps meet the patella, hamstring tendon transitions around the side of knee, tapered calf and Achilles, coherent ankle joint and foot with five toes seen in lateral perspective. No disconnected muscle bubbles. Render the limb as living natural form, beautiful foreshortening, no overbuilt bodybuilding. Keep complete foot well inside the frame. Single soft upper-left studio light, credible reflected light and narrow occlusion shadows. Warm ivory paper backdrop, restrained graphite and charcoal drawing with delicate purposeful marks, natural form shading and coherent perspective. One coherent limb study only. Landscape 4:3 canvas. Plenty of clear negative space, preserve complete extremities with at least 5 percent image margin. No diagrams, labels, arrows, text, signature, border or watermark. Not a photograph, not cartoon art, no vector patches, no repetitive hatch pattern, no muscular lobes or oversized swollen muscles, no detached-looking anatomy stickers, no muddy smudges.

**Motion direction:** Tiny controlled knee release and return, knee maximum displacement below 0.6 percent canvas. Pin heel, ball, toes and lower ankle, preserve thigh/calf attachment, retain contact shadow.

**Individual review:** The kneecap and lateral tendon bridge connect thigh to lower leg; calf and ankle have a continuous taper. Five foreshortened toes and a narrow contact shadow ground the foot. Cropped thigh is intentional; the final pose differs from the standing-leg studies.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 5; composition 5.

[Master PNG](corpus/plates/105220.png) · [Seven-second scene](corpus/animated/105220.html) · [Editable rig](corpus/animated/105220.json) · [MP4](exports/105220.mp4) · [Motion sheet](qa/realism/105220-motion.jpg)

<a id="study-105221"></a>

### 105221 — Five Toes, One Foundation

**Reference:** 105221.jpg · **Category:** foot

**Reference observation:** The source distinguishes broad padded toes from fingers and shows their stepped joint arc and the sloping forefoot.

**Generation prompt:**

Use case: scientific-educational. Asset type: original finished atelier anatomy drawing. Input image 1 is subject guidance from a photographed book page: extract anatomical relationships only, not the layout, labels or exact drawing. Input image 2 is definitive graphite rendering style: realistic living skin, beautifully resolved continuous tonal transitions, tissue and tendon detail, subtle paper grain, no heavy outline, warm ivory ground. One adult forefoot and toes in a close three-quarter view from slightly above. Forefoot enters naturally from upper left, toes point lower right. Focus on realistic metatarsal arch, five toes in a stepped natural arc, big toe clearly broader with two phalanges, second toe slightly shorter, third/fourth/fifth decreasing; toes are attached continuously to the foot, slightly flexed and resting on paper ground, with varied joints, soft pads, credible nails, and subtle skin folds. Show the front two thirds of the foot with ankle fading gently above-left. Soft contact shadow firmly beneath ball and toe pads. Subtle tendon relief without exaggerated rope-like veins. Avoid bead toes, fingers posing as toes or uniform cylindrical digits. Make the toes beautiful and anatomically believable, very clear in three-quarter perspective. Single soft upper-left studio light, credible reflected light and narrow occlusion shadows. Warm ivory paper backdrop, restrained graphite and charcoal drawing with delicate purposeful marks, natural form shading and coherent perspective. One coherent limb study only. Landscape 4:3 canvas. Plenty of clear negative space, preserve complete extremities with at least 5 percent image margin. No diagrams, labels, arrows, text, signature, border or watermark. Not a photograph, not cartoon art, no vector patches, no repetitive hatch pattern, no muscular lobes or oversized swollen muscles, no detached-looking anatomy stickers, no muddy smudges.

**Motion direction:** A small toe-settle gesture: minimal proximal flexion while toe pads and heel contact stay pinned. Move ball/forefoot less than 0.4 percent canvas; no bead-like individual toe translation.

**Individual review:** Five toes have broad differentiated pads and correctly oriented nails; big toe and smaller toes share a coherent forefoot. Shadows under the toe pads establish contact. Tendon relief and bone landmarks are legible without isolated ovals or repetitive hatching.

**Subjective still scores (1–5):** anatomy 5; lighting 5; cleanliness 5; composition 5.

[Master PNG](corpus/plates/105221.png) · [Seven-second scene](corpus/animated/105221.html) · [Editable rig](corpus/animated/105221.json) · [MP4](exports/105221.mp4) · [Motion sheet](qa/realism/105221-motion.jpg)

<a id="study-105222"></a>

### 105222 — The Foot Seen from Above

**Reference:** 105222.jpg · **Category:** foot

**Reference observation:** The reference provides dorsal/front and side comparisons. The chosen final plate is a true overhead view with the foot pointing down the page.

**Generation prompt:**

Use case: scientific-educational. Create a DIFFERENT VIEW from input image2. Input1 is a reference for DORSAL TOP-DOWN FOOT VIEW, viewed directly from ABOVE. Input2 is only rendering style, absolutely do not copy its three-quarter angle. Draw one realistically proportioned adult foot as observed from an overhead camera looking straight down at its top. The ankle enters from TOP CENTER, extends VERTICALLY downward, and the toes point toward BOTTOM CENTER. The foot's heel is behind it and NOT visible to either side. This must clearly be the FRONT/TOP surface of the foot, not an ankle profile or side view. All five toenails visible from above, big toe on image left, middle toe joints form a staggered curved line, little toe on right is visibly smaller. Width taper of the dorsum and metatarsals plausible, foot slightly turned at most five degrees from vertical. Four smaller toes moderately flexed, soft joints and natural lengths, no cylinders or beads. Finely detailed graphite and charcoal on warm ivory paper, continuous form shading, tissue and subtle tendon and vein relief, restrained fine marks. Single upper-left soft studio light. One foot only, centered in wide 4:3 landscape with 20 percent blank margins left and right, ankle base fades softly at top. Toes fully inside frame with blank space below. Beautiful clean atelier drawing, natural living anatomy, no text, labels, arrows, border, signature or watermark.

**Motion direction:** Barely perceptible toe spread-and-settle from the metatarsal bases, with ankle and toe-pad contact pinned. Keep each digit length stable and preserve the overhead perspective.

**Individual review:** Regenerated after the first version duplicated the three-quarter toe study. Final dorsal view clearly shows five toenails, broad first toe, a stepped arc of smaller toes, tapering dorsum and understated tendon flow. The wide margins make the front-view silhouette easy to inspect.

**Subjective still scores (1–5):** anatomy 5; lighting 5; cleanliness 5; composition 5.

[Master PNG](corpus/plates/105222.png) · [Seven-second scene](corpus/animated/105222.html) · [Editable rig](corpus/animated/105222.json) · [MP4](exports/105222.mp4) · [Motion sheet](qa/realism/105222-motion.jpg)

<a id="study-105223"></a>

### 105223 — Weight Across the Foot

**Reference:** 105223.jpg · **Category:** foot

**Reference observation:** The source teaches the continuous transition from ankle through heel and arch into the toes. This interpretation shows a lateral/dorsal three-quarter foot with the great toe on the far side; it is not a dedicated medial-arch view.

**Generation prompt:**

Create one original realistic fine-art charcoal and graphite drawing of a human foot and lower ankle in three-quarter side view, toes pointing right, heel bearing weight on a quiet studio surface. Use 105223.jpg as anatomy-construction reference only, never an edit target or page reproduction. Anatomically credible heel pad, longitudinal arch, Achilles insertion, asymmetric malleolus, long tendons under skin, five naturally overlapping toes with real knuckles and restrained nails, no detached pieces. Carefully observed organic proportions, not geometric diagram shapes. Relaxed whole foot without injury. Upper-left light, continuous tonal modeling, transparent charcoal contact shadow below heel and ball, soft halftones, selective lost edges, sparse precise pencil marks following form. Ivory cotton paper, warm graphite with a hint of sanguine in the deepest halftones. Clean deliberate atelier realism. No messy hatching, repeated synthetic contour strips, bold outlines, cel shading, cartoon, plastic CGI, labels, text or frame. Wide 4:3 composition with clean margins. Do not reproduce book layout, lettering, photograph or page borders.

**Motion direction:** A restrained shift of ankle load, less than five pixels, with heel and ball pinned. Tendon motion softens into a hold; no foot floating, detached toes or camera zoom.

**Individual review:** Five toes, integrated heel/arch/ankle and grounded cast shadow are substantially more believable than the prior vector plate. Grain is visible at full size but follows continuous tones; the upper ankle deliberately crops. Artistic reference, not a clinical atlas. Independent review corrected the view description: lateral/dorsal three-quarter anatomy rather than the old edition’s medial-arch label.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 4; composition 4.

[Master PNG](corpus/plates/105223.png) · [Seven-second scene](corpus/animated/105223.html) · [Editable rig](corpus/animated/105223.json) · [MP4](exports/105223.mp4) · [Motion sheet](qa/realism/105223-motion.jpg)

<a id="study-105232"></a>

### 105232 — The Captain Who Charted the Moon

**Reference:** 105232.jpg · **Category:** pirate

**Reference observation:** A book photograph of two swashbucklers: convincing counterweighted poses, layered costume, foreshortened hands, broad hat silhouettes, curved cloth folds and dense directional crosshatching. The new scene studies these principles without tracing either figure.

**Generation prompt:**

Use case: illustration-story. Create one original finished landscape 4:3 fine-art story illustration, a still master for a restrained seven-second living drawing. The Captain Who Charted the Moon: a weathered older seafarer, realistic full adult proportions, on a worn timber harbor pier at dusk, using a long solid brass telescope to observe a small pale crescent moon. His near hand naturally wraps the telescope barrel with credible fingers; the eyepiece meets his eye. Other hand holds a small loosely folded star chart at hip level. He wears a battered dark tricorn, one restrained feather, weathered russet long coat, linen shirt, wool trousers, and tall scuffed boots. Graying beard, subtle smile, age, pores, believable muscle and facial structure, weighted contrapposto stance with both feet grounded. Think an exceptionally accomplished observational graphite drawing gently enriched with translucent watercolor and sparse opaque gouache: continuous sculptural halftones, selectively lost edges, meticulous controlled detail around face/hands, rough cloth and matte leather distinct from brass glints. Atmospheric blue-sage harbor recedes behind him, one distant sailing vessel, low coastal hills, simple coiled rope and bollard; the human subject dominates. Natural upper-left cool sky light and soft warm remaining horizon bounce, grounded contact shadow. Strong clear silhouette, convincing perspective, quiet negative space around telescope and gaze. Composition is natural cinematic narrative, no decorative frame, no captions or lettering. No cartoon mascot, chibi, doll anatomy, cel shading, sticker outline, vector appearance, plastic 3D render, busy scratchy hatching, random surface marks, duplicated fingers, malformed hands, scattered clutter. Original drawing rather than a copied book page. Render a unified 4:3 image at high resolution with no border or text.

**Corrective prompts:**

1. Use case: precise-object-edit. Edit this illustration to correct exactly one visual storytelling issue: the pirate currently holds the telescope eyepiece too low, close to his nose rather than aligned with his eye. Keep the entire scene, full adult figure, garments, hands, pier, rope, harbor, ship, moon, framing, lighting and realistic painted finish unchanged. Raise and angle the rigid brass telescope and naturally adjust its supporting forearm/wrist so the small eyepiece visibly rests snugly at the pirate's nearer visible eye. His eye must actually be looking through the optical axis, not over the telescope. The barrel is one straight solid tube. Supporting fingers wrap it naturally with a believable grip. A slight head tilt is permitted solely to achieve this eye-to-eyepiece alignment. Preserve the anatomy and all unrelated image details. No text or frame.

**Motion direction:** Seven-second restrained cinemagraph: feather tip receives a small breeze; the two free coat hems answer with delayed motion. A small clear-water patch shifts by less than one pixel while a harbor lantern brightens slightly. Face, eye/telescope contact, chart grip, trouser support and planted boots remain pinned. The existing observing pose is held throughout. The common action envelope anticipates at 0.8–1.4 s, peaks by 3.2 s, holds until 4.1 s and settles by 6.5 s, with an exact matching loop endpoint.

**Individual review:** Generated raster illustration with a realistic painted finish; full-resolution still visually inspected. Scores are a subjective review of this still, not clinical validation or proof of animation quality. Adult head-to-body ratio, planted boots, bent supporting elbow and readable fingers improve substantially over the prior short-limbed cutout. A second ImageGen pass corrected the telescope's low eyepiece position toward the visible eye. Cloth, worn leather, matte beard and narrow brass highlights are distinct; receding harbor and ship establish depth. Pier/rope detail is intentionally denser than the quiet sky; preserve that contrast. The final is a detailed painted scene, not graphite on paper. Do not describe it as hand-authored or editable vector art. Telescope/face/hand are a rigid contact group; avoid broad deformations there.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 4; composition 4.

[Master PNG](corpus/plates/105232.png) · [Seven-second scene](corpus/animated/105232.html) · [Editable rig](corpus/animated/105232.json) · [MP4](exports/105232.mp4) · [Motion sheet](qa/realism/105232-motion.jpg)

<a id="study-105233"></a>

### 105233 — The Lantern Keeper of Willow Marsh

**Reference:** 105233.jpg · **Category:** creature

**Reference observation:** A fantasy-illustration page combines long curling tentacles, dramatic thin-versus-heavy silhouettes, layered organic surfaces and a theatrical figure high above elaborate creatures. The new dragon uses the serpentine construction and etched surface rhythm, with an original gentle story.

**Generation prompt:**

Use case: illustration-story. Create one original finished high-resolution landscape 4:3 fine-art illustrated scene, a master for a subtle seven-second living painting. The Lantern Keeper of Willow Marsh: a believable gentle marsh dragon at a quiet twilight pond, its heavy serpentine body coiled naturally on a muddy moss bank, a long elegant neck raising a narrow alert reptilian head. Plausible anatomical construction from skull through neck, shoulder, bent elbow and foreclaw. Soft olive scales, ochre belly plates, aged small branching horns, fine whiskers, calm intelligent small eyes, reptilian not humanoid face. The dragon's raised near foreclaw has three clearly separated curved digits wrapped through the small rigid metal ring handle of one antique warm glowing lantern, hanging vertically just above the water beside its neck. Batlike wings rest folded against its back with a small graceful opening, coherent articulated wing bones and thin muted parchment membranes, no enormous showy wings. Strong grounded body contact, thick tail curling back into the bank, shoulder/chest carry its weight. Realistic observed texture and weight, richly modeled continuous halftones with charcoal/graphite finesse, translucent watercolor and restrained oil/gouache color glazes. Painterly craftsmanship, refined edges, not a CGI creature render. Composition: dragon at left/center, lantern at right-center with quiet air around it, calm pond foreground with a few believable elliptical lily pads, willow roots and reeds, far misty marsh fades into soft sage-blue depth. Lantern casts warm light coherently onto the supporting claw, chest scales and a small pool reflection; cool upper-left twilight fill shapes the rest. Emphasis on the tender eye-to-lantern relationship. Controlled detail, clear silhouette, three depth planes; no visual clutter. No human arms/hands, cartoon mascot, toy dragon, big baby eyes, smile pasted on a snout, flat vector outlines, plastic shine, random scratch hatching, multiple lanterns, disconnected claws, extra limbs, text, borders or decorative frame. Full image 4:3 landscape.

**Motion direction:** Seven-second restrained cinemagraph: a shallow chest breath peaks at the middle of the loop, a willow tip responds to a small breeze and warm lantern light gently builds and settles. Face, antlers, claw/ring connection, lantern housing, grounded forepaw and belly contact are pinned. No lantern swing or wing lift is claimed. Action tracks settle by 6.4 s; breathing returns with matching position and zero endpoint velocity at 7 s.

**Individual review:** Generated raster illustration with a realistic painted finish; full-resolution still visually inspected. Scores are a subjective review of this still, not clinical validation or proof of animation quality. Continuous neck enters a weighted chest; one forepaw rests on the bank and the other curls around the lantern ring. Folded wing membranes attach along visible bones. The small eye and long muzzle preserve animal character. Warm lantern light shapes the lower jaw, chest, forearm, moss and reflection; blue twilight places the distant marsh behind the subject. Silhouette is readable despite detailed scale texture. The wing is aged/tattered by generation and the rich moss foreground is deliberate. Do not animate its rigid ribs, claws or lantern housing with a rubber mesh.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 4; composition 5.

[Master PNG](corpus/plates/105233.png) · [Seven-second scene](corpus/animated/105233.html) · [Editable rig](corpus/animated/105233.json) · [MP4](exports/105233.mp4) · [Motion sheet](qa/realism/105233-motion.jpg)

<a id="study-105234"></a>

### 105234 — A Small Worm and a Borrowed Star

**Reference:** 105234.jpg · **Category:** worm

**Reference observation:** A fantastical worm drawing emphasizes broad compressed body masses, folded neck anatomy, strong cross-contour shading and curling horn silhouettes around a skull-like head. This original child-friendly scene keeps the weight, segmentation and curling silhouette while replacing the horror face with curiosity.

**Generation prompt:**

Use case: illustration-story. Create one original finished realistic fine-art storybook painting, high resolution 4:3 landscape. A Small Worm and a Borrowed Star: an endearing yet biologically plausible fantasy woodland worm pauses on damp forest soil to regard one tiny warm firefly floating near its raised tapered head. The worm is hand-sized; the forest is seen at its eye level. A continuous heavy fleshy body flows from the low gently coiled abdomen into a softly curving raised neck/head; countless subtle segmented annuli wrap around volume, compress on the inside of the bend and spread outside it. Clay-rose warm brown skin with fine wrinkles, small scattered darker freckles, gentle moist highlights, underside pressed into soil with a real contact shadow. Head remains an animal head continuous with body, not a human face pasted onto a cylinder. A pair of very small dark attentive eyes and two delicate curved fleshy feelers can suggest curiosity; mouth is a small unobtrusive natural crease, no humanoid lips, teeth, cheekbones, bonnet or hat. Real believable weight and perspective, no snake scales or legs. Strong clear S gesture, tender sense of wonder and slightly humorous dignity. Place two softly lit realistic russet mushrooms with thin stems at one side, a few large ferns framing an airy background, moss, leaf litter and only a few dew drops. The firefly is tiny and singular in the quiet space near the creature's gaze. Early morning light slants from upper left, soft reflected green fill, forest recedes through luminous haze in three planes. A carefully observed colored-pencil/graphite foundation developed with transparent watercolor and luminous restrained gouache: continuous fine halftones, natural matte texture, selective lost edges, rich but controlled detail around creature and firefly, a coherent painted image. No broad black contour, flat cel shade, cartoon mascot, plush toy, human head, plastic render, excessive shiny slime, scratchy random hatching, decorative border, captions, symbols, letters or book-page photograph. Keep all important anatomy inside frame. Full-bleed 4:3 landscape.

**Motion direction:** Seven-second restrained cinemagraph: the firefly makes a tiny hover drift and returns; the head inclines almost imperceptibly toward it, followed by two differently delayed feeler responses. The coil and lower neck remain anchored in the soil. Firefly glow rises subtly. There is no whole-image sway. The head/feeler action anticipates at 0.8–1.4 s, peaks around 3.2–3.5 s and settles by 6.5 s; hover returns with matching zero endpoint velocity at 7 s.

**Individual review:** Generated raster illustration with a realistic painted finish; full-resolution still visually inspected. Scores are a subjective review of this still, not clinical validation or proof of animation quality. Heavy continuous coil rises into the neck without a separate human head. Annuli compress along the inner curve and spread across the outer bend. Head and feelers are gentle fantasy additions, not scientific earthworm anatomy. Warm upper-left backlight, green atmospheric fill and lower body contact ground the subject. Small firefly has clear negative space; mushrooms set scale. The skin is deliberately moist and the still has strong microtexture. Keep deformation tiny so highlights do not swim; the entire coil and soil are static anchors.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 4; composition 5.

[Master PNG](corpus/plates/105234.png) · [Seven-second scene](corpus/animated/105234.html) · [Editable rig](corpus/animated/105234.json) · [MP4](exports/105234.mp4) · [Motion sheet](qa/realism/105234-motion.jpg)

<a id="study-105235"></a>

### 105235 — The Gardener Who Grew Another Morning

**Reference:** 105235.jpg · **Category:** zombie

**Reference observation:** The reference shows an expressive undead head with pronounced facial planes, irregular teeth, tousled hair, torn cloth, articulated fingers and a decorated mug. This original gently comic gardener carries over the expressive structure, sewn repairs and handled vessel, without exposed tissue or gore.

**Generation prompt:**

Use case: illustration-story. A finished original hand-drawn and hand-painted children's fantasy book plate, landscape 4:3, highly realistic anatomical observation combined with visible graphite drawing and delicate watercolor/gouache brushwork on subtly grained warm ivory paper. This is an artistic drawing, not a photograph and not a 3D render. The Gardener Who Grew Another Morning: a kindly undead elderly gardener with believable human adult proportions kneels on one knee on dark garden soil and carefully tends one small sapling in a terracotta pot. He has an aged gaunt face, intact dry pale grey-olive skin, hollow cheeks, small gentle living eyes, reassuring closed crooked smile, wispy silver hair and a tiny daisy tucked behind one ear. A few old healed stitched seams suggest undead fantasy; no exposed skull, gore, open wounds or frightening teeth. Worn sage linen work jacket with a patched elbow, warm brown apron, rolled shirt cuff, charcoal wool trousers and scuffed work boots. His near hand has five anatomically plausible fingers naturally curled around the real handle of a small stoneware watering jug decorated with one subtle blue bird. He holds the jug above the terracotta sapling pot, with a thin believable stream of water flowing from spout to soil. Other hand supports his raised knee with a relaxed grip. Show a credible kneeling pose: rear knee and boot supported on ground, forward foot flat and knee raised. Shoulders, arms, hands, pelvis and limbs connect clearly. An old low garden wall and a receding path in soft focus, a few cabbage leaves and one slender trellis, muted morning haze. Intimate calm three-quarter view, gardener on left/center and seedling at lower right, generous atmospheric space. Realistic light from upper left models face, cloth and hand through continuous half-tones and soft core shadows, warm bounce from soil. Reserve the sharpest detail for face, jug grip and sapling; background uses broad translucent washes. Visible refined graphite contour accents, fine directional tonal pencil marks, layered pigment blooms and occasional gouache highlights distinguish materials without messy scratch texture. No cartoon mascot, doll proportions, black sticker outlines, cel shading, plastic glossy skin, repeated oval muscle pads, extra fingers, distorted jug, multiple water streams, random lettering or symbols. No title, caption, border, frame or watermark. Full 4:3 painting.

**Motion direction:** Seven-second restrained cinemagraph: the gardener holds the illustrated pouring pose, with faint garment breathing, a small hair-tip breeze and a delayed sapling response. A slight local highlight change touches the existing stream and leaves. Face, hands, ceramic jug, water endpoints, pot, supporting knee and planted boot remain fixed. This is a living held pose, not a pour-and-return cycle. All tracks return cleanly at 7 s.

**Individual review:** Generated raster illustration with a realistic painted finish; full-resolution still visually inspected. Scores are a subjective review of this still, not clinical validation or proof of animation quality. Adult proportions and a clear one-knee-down/one-foot-flat pose carry weight. Near fingers wrap the jug handle and far fingers rest over the raised knee. Gaunt features, hair and healed stitches establish a gentle undead character without gore. Jug spout, stream and soil connect; the sapling/hand/face make a clear narrative triangle. Background path and muted village recede behind warm garden light. The jug is already tilted with a visible stream in the base artwork. Preserve that held pouring pose unless separate clean layers are produced; do not claim a full pour-and-return animation from local mesh alone.

**Subjective still scores (1–5):** anatomy 4; lighting 5; cleanliness 4; composition 5.

[Master PNG](corpus/plates/105235.png) · [Seven-second scene](corpus/animated/105235.html) · [Editable rig](corpus/animated/105235.json) · [MP4](exports/105235.mp4) · [Motion sheet](qa/realism/105235-motion.jpg)
