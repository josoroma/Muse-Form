# Seven — Contours in motion

24 native SVG drawings and seven-second loops, returning to the spare line language of [Hairline](https://github.com/lucasmarkes/hairline). The collection keeps anatomical construction from the approved realism studies and replaces painted surfaces with deliberate contours, quiet interior marks, clean negative space and a single bright focal detail.

![Native line corpus](qa/hairline/corpus-contact.jpg)

## Open the collection

```sh
npm ci
npm start
```

Open **http://127.0.0.1:4173**. Choose a study, play or scrub its seven seconds. Space plays/pauses; arrows step a frame outside interactive controls. The gallery starts paused and pauses when hidden. Static and animated SVGs also open directly from disk; standalone animated SVGs loop automatically, so use the static variant when embedding with reduced motion.

## Drawing and animation

Every delivered drawing is actual SVG geometry: paths and simple vector primitives, with no embedded bitmap, raster filter, gradient or grain. The graphite/painted edition remains in [archive/raster-v2](archive/raster-v2); the first vector edition remains in [archive/vector-v1](archive/vector-v1). The gallery uses the new vector files.

The anatomy studies use selectively reconstructed contours from our own approved drawings, with authored repairs. The faces are hand-authored structural curves. The four stories are newly composed from sparse native paths. Each entry below identifies its actual method. These are intentionally reduced line illustrations, not photorealistic paintings or full 3D models. SVG provides the needed contour control and portability, so Three.js is not required.

The adopted Hairline ideas are monochrome stroke hierarchy, a composed resting pose, restrained reach, clear occlusion, one focal accent and no labels inside the art. Organic anatomy keeps its observed viewpoint; this is a **Hairline-inspired adaptation**, not a claim of using its isometric engine or obeying every upstream machine-figure rule. [Source notes](skills/seven-second-storytelling/references/sources.md) record the distinction.

Native SMIL animates selected groups or matching path geometry over seven seconds. The action remains small: a gesture, tension/release, a response to a firefly, a moving feather or an accent traveling through a held study. Rigid props and supporting contacts stay anchored. The loops do not imply complete walks, turns, or facial-expression transitions.

All MP4s are **7.000 seconds · 1200 × 900 · 30 fps · H.264 · 210 frames · silent**. Encoded frames cover [0,7); the matching endpoint at seven seconds is tested separately. Supplied book photographs remain in Downloads and are not bundled. These are artistic anatomy studies, not a medically validated atlas.

## Prompts, review and reproduction

The editable catalog inputs are corpus/hairline/*.json. Each study has a full SVG art brief, method, review notes and source ID. Generator files in scripts/vector-*.py preserve geometry authoring where used. The anatomy generator reads archived internal plates and requires Python with opencv-python 5.0.0, numpy 2.5.4 and scipy 1.18.1; the face and story generators use the Python standard library. Rendering existing SVGs does not need Python. The original source filename and hash remain in [the manifest](corpus/manifest.json).

```sh
npm run compose                 # add seven-second SVG tracks to final vector drawings
npm run catalog                 # rebuild manifest, README prompts and skill index
npm run check                   # inspect SVG structure; render poses and contact sheets
npm run render                  # export all 24 MP4s
npm run render -- 105232 105234  # selected films
npm run verify                  # gallery and encoded-frame checks
npm run install-skill           # refresh local and installed skill assets
```

Rendering needs Node.js 22+, local Chrome/Chromium and FFmpeg/ffprobe. Set CHROME_PATH for a nonstandard browser. Playwright Core is pinned; the SVGs and gallery need no CDN or runtime library. Numeric checks establish format, seek consistency and endpoint agreement; they do not certify artistic quality. Individual contours and motion extremes are visually inspected and corrected before acceptance. Evidence is in [SVG checks](qa/hairline/svg-checks.json), [film verification](qa/hairline/verification.json), [art review](qa/hairline/art-review.json), and the per-study contact sheets below.

## Reusable skill

[Read the skill](skills/seven-second-storytelling/SKILL.md) or download the [portable skill bundle](exports/seven-second-storytelling.skill.zip). It contains all 24 static SVGs and all 24 animated SVGs, the prompt manifest, quality records and local render helpers. Installation updates ~/.codex/skills/seven-second-storytelling, or CODEX_HOME/skills when configured.

> Use $seven-second-storytelling to draw a believable pirate and a curious worm in native SVG. Use Hairline-inspired sparse contours and one focal accent, keep the forms and contacts coherent, animate a seven-second response, and include full prompts and asset links.

## Corpus index

| Reference | Study | Static SVG | Animated SVG | MP4 |
| --- | --- | --- | --- | --- |
| 105193.jpg | [Three-quarter skull](#study-105193) | [Drawing](corpus/svg/105193.svg) | [Seven seconds](corpus/animated/105193.svg) | [Film](exports/105193.mp4) |
| 105194.jpg | [Eye and eyelid structure](#study-105194) | [Drawing](corpus/svg/105194.svg) | [Seven seconds](corpus/animated/105194.svg) | [Film](exports/105194.mp4) |
| 105195.jpg | [Auricle and concha](#study-105195) | [Drawing](corpus/svg/105195.svg) | [Seven seconds](corpus/animated/105195.svg) | [Film](exports/105195.mp4) |
| 105196.jpg | [A quiet smile](#study-105196) | [Drawing](corpus/svg/105196.svg) | [Seven seconds](corpus/animated/105196.svg) | [Film](exports/105196.mp4) |
| 105197.jpg | [Quiet sadness](#study-105197) | [Drawing](corpus/svg/105197.svg) | [Seven seconds](corpus/animated/105197.svg) | [Film](exports/105197.mp4) |
| 105198.jpg | [Contained anger](#study-105198) | [Drawing](corpus/svg/105198.svg) | [Seven seconds](corpus/animated/105198.svg) | [Film](exports/105198.mp4) |
| 105199.jpg | [A moment of fear](#study-105199) | [Drawing](corpus/svg/105199.svg) | [Seven seconds](corpus/animated/105199.svg) | [Film](exports/105199.mp4) |
| 105200.jpg | [Open surprise](#study-105200) | [Drawing](corpus/svg/105200.svg) | [Seven seconds](corpus/animated/105200.svg) | [Film](exports/105200.mp4) |
| 105202.jpg | [Laughter in profile](#study-105202) | [Drawing](corpus/svg/105202.svg) | [Seven seconds](corpus/animated/105202.svg) | [Film](exports/105202.mp4) |
| 105203.jpg | [A knowing wink](#study-105203) | [Drawing](corpus/svg/105203.svg) | [Seven seconds](corpus/animated/105203.svg) | [Film](exports/105203.mp4) |
| 105214.jpg | [A Breath Through the Spiral](#study-105214) | [Drawing](corpus/svg/105214.svg) | [Seven seconds](corpus/animated/105214.svg) | [Film](exports/105214.mp4) |
| 105215.jpg | [Tension in the Turn](#study-105215) | [Drawing](corpus/svg/105215.svg) | [Seven seconds](corpus/animated/105215.svg) | [Film](exports/105215.mp4) |
| 105216.jpg | [The Palm Opens](#study-105216) | [Drawing](corpus/svg/105216.svg) | [Seven seconds](corpus/animated/105216.svg) | [Film](exports/105216.mp4) |
| 105217.jpg | [Tendons Beneath the Gesture](#study-105217) | [Drawing](corpus/svg/105217.svg) | [Seven seconds](corpus/animated/105217.svg) | [Film](exports/105217.mp4) |
| 105218.jpg | [Weight Through the Outer Leg](#study-105218) | [Drawing](corpus/svg/105218.svg) | [Seven seconds](corpus/animated/105218.svg) | [Film](exports/105218.mp4) |
| 105219.jpg | [The Calf Holds the Weight](#study-105219) | [Drawing](corpus/svg/105219.svg) | [Seven seconds](corpus/animated/105219.svg) | [Film](exports/105219.mp4) |
| 105220.jpg | [The Knee Connects the Gesture](#study-105220) | [Drawing](corpus/svg/105220.svg) | [Seven seconds](corpus/animated/105220.svg) | [Film](exports/105220.mp4) |
| 105221.jpg | [Five Toes, One Foundation](#study-105221) | [Drawing](corpus/svg/105221.svg) | [Seven seconds](corpus/animated/105221.svg) | [Film](exports/105221.mp4) |
| 105222.jpg | [The Foot Seen from Above](#study-105222) | [Drawing](corpus/svg/105222.svg) | [Seven seconds](corpus/animated/105222.svg) | [Film](exports/105222.mp4) |
| 105223.jpg | [The Foot in Three-Quarter View](#study-105223) | [Drawing](corpus/svg/105223.svg) | [Seven seconds](corpus/animated/105223.svg) | [Film](exports/105223.mp4) |
| 105232.jpg | [The Captain Who Charted the Moon](#study-105232) | [Drawing](corpus/svg/105232.svg) | [Seven seconds](corpus/animated/105232.svg) | [Film](exports/105232.mp4) |
| 105233.jpg | [The Lantern Keeper of Willow Marsh](#study-105233) | [Drawing](corpus/svg/105233.svg) | [Seven seconds](corpus/animated/105233.svg) | [Film](exports/105233.mp4) |
| 105234.jpg | [A Small Worm and a Borrowed Star](#study-105234) | [Drawing](corpus/svg/105234.svg) | [Seven seconds](corpus/animated/105234.svg) | [Film](exports/105234.mp4) |
| 105235.jpg | [The Gardener Who Grew Another Morning](#study-105235) | [Drawing](corpus/svg/105235.svg) | [Seven seconds](corpus/animated/105235.svg) | [Film](exports/105235.mp4) |

## Full SVG prompts and review notes

<a id="study-105193"></a>

### 105193 — Three-quarter skull

**Reference:** 105193.jpg · **Category:** skull-and-orbit

**Reference observation:** The reference isolates the bony orbit, nasal aperture and zygomatic arches. Deep occlusion is nearly black, while thin rim lights make the thickness of bone readable.

**SVG drawing prompt:**

Create a clean native SVG drawing, 1200 by 900 pixels with a 400 by 300 viewBox. A complete adult skull in three-quarter view facing left. Preserve the continuous cranial vault, unequal receding orbital cavities, nasal aperture, open zygomatic arch and attached mandible. A compact natural dental arcade has distinct incisor, canine and molar forms and a quieter lower row. Reserve the focal line for the near orbital rim. Use Hairline-inspired contour discipline adapted to organic anatomy: background #101014, silhouette #a1a1aa, internal structure #52525b, receding detail #27272a, and one meaningful focal contour #fafafa. Use a uniform 0.92-pixel non-scaling stroke with round caps and joins. Favor continuous anatomical cubic curves, meaningful occlusion and clear negative space. No embedded raster images, filled tonal shapes, gradients, filters, grain, repetitive hatching, labels, borders or text. Keep a complete silhouette and generous safe margins. The original source photo supplies anatomical context; the internal realistic corpus plate supplies proportional construction. Rebuild selected contours independently, without copying a photographed page layout. Animate only the stated restrained action in a seamless seven-second loop; preserve all facial feature dimensions and attachment.

**Construction method:** Hand-authored native cubic anatomical contours informed by the original source observation and the owned realistic-v2 construction plate; no automatic edge trace, bitmap embedding or generated texture in the final SVG.

**Seven-second movement:** The skull holds still while the near orbital rim gently changes emphasis.

**Review:** The full vault and mandible stay connected. The dental arcade was redrawn with varying crown shapes after the first repeated-capsule version; this is an artistic osteological study, not a dental or medical atlas.

[Static SVG](corpus/svg/105193.svg) · [Animated SVG](corpus/animated/105193.svg) · [MP4](exports/105193.mp4) · [Six-pose sheet](qa/hairline/105193-contact.png)

<a id="study-105194"></a>

### 105194 — Eye and eyelid structure

**Reference:** 105194.jpg · **Category:** eye-anatomy

**Reference observation:** The eyeball and both lids wrap around a sphere. The brow ridge, tear lake, lid crease and lower orbital plane must turn in depth rather than become flat graphic outlines.

**SVG drawing prompt:**

Create a clean native SVG drawing, 1200 by 900 pixels with a 400 by 300 viewBox. An enlarged human eye viewed obliquely. The upper lid wraps the globe, the lower rim has a shallow asymmetric curve, and the tear duct joins the inner corner. Clip the circular iris and pupil beneath the actual lid aperture. Suggest brow and nose bridge with a few continuous contours; no eyelash texture or radiating iris decoration. Use Hairline-inspired contour discipline adapted to organic anatomy: background #101014, silhouette #a1a1aa, internal structure #52525b, receding detail #27272a, and one meaningful focal contour #fafafa. Use a uniform 0.92-pixel non-scaling stroke with round caps and joins. Favor continuous anatomical cubic curves, meaningful occlusion and clear negative space. No embedded raster images, filled tonal shapes, gradients, filters, grain, repetitive hatching, labels, borders or text. Keep a complete silhouette and generous safe margins. The original source photo supplies anatomical context; the internal realistic corpus plate supplies proportional construction. Rebuild selected contours independently, without copying a photographed page layout. Animate only the stated restrained action in a seamless seven-second loop; preserve all facial feature dimensions and attachment.

**Construction method:** Hand-authored native cubic anatomical contours informed by the original source observation and the owned realistic-v2 construction plate; no automatic edge trace, bitmap embedding or generated texture in the final SVG.

**Seven-second movement:** A quiet emphasis moves through the upper eyelid while the anatomy remains fixed.

**Review:** The iris and pupil are explicitly clipped beneath the upper lid. Unequal lid arcs, tear duct and lower orbital fold establish depth without a cartoon full-circle eye. The sparse brow is structural rather than individual hair texture. Independent review identified an overly narrow pupil; it was broadened to a near-circular foreshortened form and re-rendered.

[Static SVG](corpus/svg/105194.svg) · [Animated SVG](corpus/animated/105194.svg) · [MP4](exports/105194.mp4) · [Six-pose sheet](qa/hairline/105194-contact.png)

<a id="study-105195"></a>

### 105195 — Auricle and concha

**Reference:** 105195.jpg · **Category:** ear-anatomy

**Reference observation:** The ear has a continuous helix, a bifurcated antihelix, triangular fossa, deep concha, projecting tragus and soft lobule. Its back surface and overlapping folds are volumes, not a flat symbol.

**SVG drawing prompt:**

Create a clean native SVG drawing, 1200 by 900 pixels with a 400 by 300 viewBox. One upright dimensional human ear, with a continuous helix, a branching antihelix, concha, tragus, antitragus and fleshy lobe. Show the connections between folds and preserve clean negative spaces. A short temporal attachment places the ear on a head without drawing the entire head. Focus the upper helix. Use Hairline-inspired contour discipline adapted to organic anatomy: background #101014, silhouette #a1a1aa, internal structure #52525b, receding detail #27272a, and one meaningful focal contour #fafafa. Use a uniform 0.92-pixel non-scaling stroke with round caps and joins. Favor continuous anatomical cubic curves, meaningful occlusion and clear negative space. No embedded raster images, filled tonal shapes, gradients, filters, grain, repetitive hatching, labels, borders or text. Keep a complete silhouette and generous safe margins. The original source photo supplies anatomical context; the internal realistic corpus plate supplies proportional construction. Rebuild selected contours independently, without copying a photographed page layout. Animate only the stated restrained action in a seamless seven-second loop; preserve all facial feature dimensions and attachment.

**Construction method:** Hand-authored native cubic anatomical contours informed by the original source observation and the owned realistic-v2 construction plate; no automatic edge trace, bitmap embedding or generated texture in the final SVG.

**Seven-second movement:** The upper helix receives one slow seven-second emphasis cycle.

**Review:** The outer helix, antihelix branch, tragus and lobe are separately readable and connected. Interior folds have lower contrast than the silhouette; no spiral icon or decorative texture is used.

[Static SVG](corpus/svg/105195.svg) · [Animated SVG](corpus/animated/105195.svg) · [MP4](exports/105195.mp4) · [Six-pose sheet](qa/hairline/105195-contact.png)

<a id="study-105196"></a>

### 105196 — A quiet smile

**Reference:** 105196.jpg · **Category:** happiness

**Reference observation:** Relaxed brow, cheek lifting and the outward pull of the closed smiling mouth.

**SVG drawing prompt:**

Create a clean native SVG drawing, 1200 by 900 pixels with a 400 by 300 viewBox. A three-quarter adult male portrait with a relaxed smile and a slight head tilt. Lift the cheeks, soften the lower eyelids and curve the lips upward asymmetrically. Preserve adult cranial proportions, a dimensional ear, a believable nose and an open shirt collar. Clip both irises under reduced eyelid apertures; focus only the near upper eyelid. Use Hairline-inspired contour discipline adapted to organic anatomy: background #101014, silhouette #a1a1aa, internal structure #52525b, receding detail #27272a, and one meaningful focal contour #fafafa. Use a uniform 0.92-pixel non-scaling stroke with round caps and joins. Favor continuous anatomical cubic curves, meaningful occlusion and clear negative space. No embedded raster images, filled tonal shapes, gradients, filters, grain, repetitive hatching, labels, borders or text. Keep a complete silhouette and generous safe margins. The original source photo supplies anatomical context; the internal realistic corpus plate supplies proportional construction. Rebuild selected contours independently, without copying a photographed page layout. Animate only the stated restrained action in a seamless seven-second loop; preserve all facial feature dimensions and attachment.

**Construction method:** Hand-authored native cubic anatomical contours informed by the original source observation and the owned realistic-v2 construction plate; no automatic edge trace, bitmap embedding or generated texture in the final SVG.

**Seven-second movement:** A held smile with a very small head inclination, returning to the same pose.

**Review:** Revised the eye apertures and clipped both irises after the earlier staring appearance. A single near lid is bright; the far eye is subordinate. The held smile uses cheek and lip curves, with small restrained head motion.

[Static SVG](corpus/svg/105196.svg) · [Animated SVG](corpus/animated/105196.svg) · [MP4](exports/105196.mp4) · [Six-pose sheet](qa/hairline/105196-contact.png)

<a id="study-105197"></a>

### 105197 — Quiet sadness

**Reference:** 105197.jpg · **Category:** sadness

**Reference observation:** The inner brows draw upward and together while the lip corners and gaze fall.

**SVG drawing prompt:**

Create a clean native SVG drawing, 1200 by 900 pixels with a 400 by 300 viewBox. An older adult male with an elongated face, receding swept hair and a lowered gaze. Raise and draw together the inner brows; keep the eyelids heavy and the mouth corners quietly lowered. Use nasolabial and chin contours to explain the expression instead of a generic frown. Preserve an attached long neck and open collar. Use Hairline-inspired contour discipline adapted to organic anatomy: background #101014, silhouette #a1a1aa, internal structure #52525b, receding detail #27272a, and one meaningful focal contour #fafafa. Use a uniform 0.92-pixel non-scaling stroke with round caps and joins. Favor continuous anatomical cubic curves, meaningful occlusion and clear negative space. No embedded raster images, filled tonal shapes, gradients, filters, grain, repetitive hatching, labels, borders or text. Keep a complete silhouette and generous safe margins. The original source photo supplies anatomical context; the internal realistic corpus plate supplies proportional construction. Rebuild selected contours independently, without copying a photographed page layout. Animate only the stated restrained action in a seamless seven-second loop; preserve all facial feature dimensions and attachment.

**Construction method:** Hand-authored native cubic anatomical contours informed by the original source observation and the owned realistic-v2 construction plate; no automatic edge trace, bitmap embedding or generated texture in the final SVG.

**Seven-second movement:** The sad expression holds while the head settles by a fraction of a degree.

**Review:** Distinct long jaw, inner-brow lift, downcast irises and heavy lids communicate sadness. Hair and beard are reduced to directional boundaries. No tears or theatrical expression morph is claimed.

[Static SVG](corpus/svg/105197.svg) · [Animated SVG](corpus/animated/105197.svg) · [MP4](exports/105197.mp4) · [Six-pose sheet](qa/hairline/105197-contact.png)

<a id="study-105198"></a>

### 105198 — Contained anger

**Reference:** 105198.jpg · **Category:** anger

**Reference observation:** Compressed eyebrows, narrowed lids, flared nostrils and a tense, narrow mouth.

**SVG drawing prompt:**

Create a clean native SVG drawing, 1200 by 900 pixels with a 400 by 300 viewBox. A broad-jawed adult male turned slightly left. Compress the inner brows, narrow the eyes, tighten the nostril wings and press the lips. Show a square mandibular angle, short swept hair and neck tension with a few restrained curves. Focus one near upper eyelid; avoid decorative forehead hatch marks. Use Hairline-inspired contour discipline adapted to organic anatomy: background #101014, silhouette #a1a1aa, internal structure #52525b, receding detail #27272a, and one meaningful focal contour #fafafa. Use a uniform 0.92-pixel non-scaling stroke with round caps and joins. Favor continuous anatomical cubic curves, meaningful occlusion and clear negative space. No embedded raster images, filled tonal shapes, gradients, filters, grain, repetitive hatching, labels, borders or text. Keep a complete silhouette and generous safe margins. The original source photo supplies anatomical context; the internal realistic corpus plate supplies proportional construction. Rebuild selected contours independently, without copying a photographed page layout. Animate only the stated restrained action in a seamless seven-second loop; preserve all facial feature dimensions and attachment.

**Construction method:** Hand-authored native cubic anatomical contours informed by the original source observation and the owned realistic-v2 construction plate; no automatic edge trace, bitmap embedding or generated texture in the final SVG.

**Seven-second movement:** A held angry expression with a tiny coherent head inclination.

**Review:** The wider mandible, compressed glabella, narrow eye apertures and pressed lips distinguish this portrait from sadness. Both irises remain contained by their lids; one focal upper lid carries the eye contact.

[Static SVG](corpus/svg/105198.svg) · [Animated SVG](corpus/animated/105198.svg) · [MP4](exports/105198.mp4) · [Six-pose sheet](qa/hairline/105198-contact.png)

<a id="study-105199"></a>

### 105199 — A moment of fear

**Reference:** 105199.jpg · **Category:** fear

**Reference observation:** Wide visible irises, lifted brows and retracted lips revealing a tense strip of teeth.

**SVG drawing prompt:**

Create a clean native SVG drawing, 1200 by 900 pixels with a 400 by 300 viewBox. An adult male looking upward to the right, with raised knitted inner brows, tense wide eyes, a retracted slightly parted mouth and taut neck tendons. The lower lids remain supportive and the upper teeth are a short quiet strip. Use a slim asymmetrical jaw and swept hair. Keep the fear readable through coordinated facial muscles, not bulging eyeballs. Use Hairline-inspired contour discipline adapted to organic anatomy: background #101014, silhouette #a1a1aa, internal structure #52525b, receding detail #27272a, and one meaningful focal contour #fafafa. Use a uniform 0.92-pixel non-scaling stroke with round caps and joins. Favor continuous anatomical cubic curves, meaningful occlusion and clear negative space. No embedded raster images, filled tonal shapes, gradients, filters, grain, repetitive hatching, labels, borders or text. Keep a complete silhouette and generous safe margins. The original source photo supplies anatomical context; the internal realistic corpus plate supplies proportional construction. Rebuild selected contours independently, without copying a photographed page layout. Animate only the stated restrained action in a seamless seven-second loop; preserve all facial feature dimensions and attachment.

**Construction method:** Hand-authored native cubic anatomical contours informed by the original source observation and the owned realistic-v2 construction plate; no automatic edge trace, bitmap embedding or generated texture in the final SVG.

**Seven-second movement:** A held fearful glance with a tiny head recoil and return; the expression is not morphed.

**Review:** Fear uses an upward side gaze, brow knitting, horizontal mouth tension and restrained upper teeth. It differs from surprise in both gaze and mouth geometry. The native curves simplify the muscle planes without deforming the eyes. Independent review identified an upper eyelid too narrow for the expression; both upper lids were lifted while the lower rims stayed fixed, then re-rendered.

[Static SVG](corpus/svg/105199.svg) · [Animated SVG](corpus/animated/105199.svg) · [MP4](exports/105199.mp4) · [Six-pose sheet](qa/hairline/105199-contact.png)

<a id="study-105200"></a>

### 105200 — Open surprise

**Reference:** 105200.jpg · **Category:** surprise

**Reference observation:** Raised orbital arches, round open eyes and a lowered jaw create surprise.

**SVG drawing prompt:**

Create a clean native SVG drawing, 1200 by 900 pixels with a 400 by 300 viewBox. An adult male with a rounder cranial shape and loose swept curls. Raise both inner and outer brows, show naturally wide eyes and drop the lower jaw for a soft vertically open mouth. Keep eyelids wrapped around clipped irises and the upper dental edge in perspective. Avoid a circular emoji mouth or symmetric graphic eyes. Use Hairline-inspired contour discipline adapted to organic anatomy: background #101014, silhouette #a1a1aa, internal structure #52525b, receding detail #27272a, and one meaningful focal contour #fafafa. Use a uniform 0.92-pixel non-scaling stroke with round caps and joins. Favor continuous anatomical cubic curves, meaningful occlusion and clear negative space. No embedded raster images, filled tonal shapes, gradients, filters, grain, repetitive hatching, labels, borders or text. Keep a complete silhouette and generous safe margins. The original source photo supplies anatomical context; the internal realistic corpus plate supplies proportional construction. Rebuild selected contours independently, without copying a photographed page layout. Animate only the stated restrained action in a seamless seven-second loop; preserve all facial feature dimensions and attachment.

**Construction method:** Hand-authored native cubic anatomical contours informed by the original source observation and the owned realistic-v2 construction plate; no automatic edge trace, bitmap embedding or generated texture in the final SVG.

**Seven-second movement:** A held surprised expression with a small coherent head inclination and return.

**Review:** The more vertical open mouth, evenly raised brows and level gaze separate surprise from fear. Jaw and throat remain attached. The drawing contains no continuous expression transition; it holds one authored pose. Independent review identified normal-width eyes beneath strongly raised brows; the upper lids were lifted without moving the lower rims, then re-rendered. The mouth was also widened and made less circular.

[Static SVG](corpus/svg/105200.svg) · [Animated SVG](corpus/animated/105200.svg) · [MP4](exports/105200.mp4) · [Six-pose sheet](qa/hairline/105200-contact.png)

<a id="study-105202"></a>

### 105202 — Laughter in profile

**Reference:** 105202.jpg · **Category:** laughter-profile

**Reference observation:** The profile laugh combines a rising cheek, compressed eyelid, deepened nasolabial fold and lowered mandible. The teeth wrap in perspective and the neck responds to the jaw.

**SVG drawing prompt:**

Create a clean native SVG drawing, 1200 by 900 pixels with a 400 by 300 viewBox. A right-facing adult male profile in laughter. Draw one eye only, compressed by a raised cheek. Connect forehead, nasal bridge, nose tip, upper lip, receding open mouth, lower lip and chin as a continuous profile silhouette. A small perspective dental edge sits beneath the upper lip. Show the near ear and the neck leading naturally into an open collar. Use Hairline-inspired contour discipline adapted to organic anatomy: background #101014, silhouette #a1a1aa, internal structure #52525b, receding detail #27272a, and one meaningful focal contour #fafafa. Use a uniform 0.92-pixel non-scaling stroke with round caps and joins. Favor continuous anatomical cubic curves, meaningful occlusion and clear negative space. No embedded raster images, filled tonal shapes, gradients, filters, grain, repetitive hatching, labels, borders or text. Keep a complete silhouette and generous safe margins. The original source photo supplies anatomical context; the internal realistic corpus plate supplies proportional construction. Rebuild selected contours independently, without copying a photographed page layout. Animate only the stated restrained action in a seamless seven-second loop; preserve all facial feature dimensions and attachment.

**Construction method:** Hand-authored native cubic anatomical contours informed by the original source observation and the owned realistic-v2 construction plate; no automatic edge trace, bitmap embedding or generated texture in the final SVG.

**Seven-second movement:** A held profile laugh with a small backward inclination and return.

**Review:** The single-eye profile has a connected nose, lip and chin contour. The mouth interior recedes toward its corner, and the short dental edge follows the upper lip. This is a held laugh with head intention, not a complete jaw-opening cycle.

[Static SVG](corpus/svg/105202.svg) · [Animated SVG](corpus/animated/105202.svg) · [MP4](exports/105202.mp4) · [Six-pose sheet](qa/hairline/105202-contact.png)

<a id="study-105203"></a>

### 105203 — A knowing wink

**Reference:** 105203.jpg · **Category:** asymmetric-expression

**Reference observation:** A unilateral eyelid squeeze, one raised eyebrow and one tight mouth corner make an asymmetric expression.

**SVG drawing prompt:**

Create a clean native SVG drawing, 1200 by 900 pixels with a 400 by 300 viewBox. An adult male portrait with one eye closed, the same-side cheek lifted, the other eye gently open, and an asymmetric closed-mouth smile. Coordinate the closed lid, crow-feet and compressed cheek rather than deleting the eye. Draw distinct swept hair, a tapered jaw and a crew-neck shirt. Reserve the focal accent for the closed eyelid. Use Hairline-inspired contour discipline adapted to organic anatomy: background #101014, silhouette #a1a1aa, internal structure #52525b, receding detail #27272a, and one meaningful focal contour #fafafa. Use a uniform 0.92-pixel non-scaling stroke with round caps and joins. Favor continuous anatomical cubic curves, meaningful occlusion and clear negative space. No embedded raster images, filled tonal shapes, gradients, filters, grain, repetitive hatching, labels, borders or text. Keep a complete silhouette and generous safe margins. The original source photo supplies anatomical context; the internal realistic corpus plate supplies proportional construction. Rebuild selected contours independently, without copying a photographed page layout. Animate only the stated restrained action in a seamless seven-second loop; preserve all facial feature dimensions and attachment.

**Construction method:** Hand-authored native cubic anatomical contours informed by the original source observation and the owned realistic-v2 construction plate; no automatic edge trace, bitmap embedding or generated texture in the final SVG.

**Seven-second movement:** A held wink with a small head inclination and return.

**Review:** The closed lid, cheek lift and asymmetric smile are authored together. The opposite iris is clipped beneath a normal narrow aperture. The wink remains held; motion does not claim to open or close the eyelid.

[Static SVG](corpus/svg/105203.svg) · [Animated SVG](corpus/animated/105203.svg) · [MP4](exports/105203.mp4) · [Six-pose sheet](qa/hairline/105203-contact.png)

<a id="study-105214"></a>

### 105214 — A Breath Through the Spiral

**Reference:** 105214.jpg · **Category:** torso

**Reference observation:** The reference studies ribcage and pelvis counter-rotation, a raised shoulder and compression/stretch along the abdominal wall.

**SVG drawing prompt:**

Draw a breath through the spiral as native SVG anatomical line art derived from the owned 105214 graphite plate. Preserve the original gesture, perspective, joints and digit topology. Use charcoal #101014 ground, a thin #a1a1aa silhouette, sparse #52525b structural contours and one #fafafa focal contour. Smooth the curves; remove texture scratches, shadow bands and redundant anatomy marks. No raster embedding, gradients, filters, shading fills or labels. Compose at 1200 by 900 with clear contact and negative space.

**Construction method:** Low-pass structural edge extraction from owned plate; graph-connected curves, directional gap joining, cubic simplification and per-subject removal/repair. Anatomical silhouette gaps are explicitly repaired at the torso, dorsal hand and foot contact contours.

**Seven-second movement:** A quiet inhalation lifts the ribcage and releases.

**Review:** Inspected the native SVG in Chrome at full size and in the contact sheet. Reconnected the armpit and raised-shoulder contours after the raster source faded there; ribcage/waist counter-rotation remains readable. Cropped neck and arm ends are intentional study framing.

[Static SVG](corpus/svg/105214.svg) · [Animated SVG](corpus/animated/105214.svg) · [MP4](exports/105214.mp4) · [Six-pose sheet](qa/hairline/105214-contact.png)

<a id="study-105215"></a>

### 105215 — Tension in the Turn

**Reference:** 105215.jpg · **Category:** arm

**Reference observation:** The reference shows a flexed elbow, biceps/triceps interaction and the twisting forearm masses. The final study retains living skin rather than colored muscle diagrams.

**SVG drawing prompt:**

Draw tension in the turn as native SVG anatomical line art derived from the owned 105215 graphite plate. Preserve the original gesture, perspective, joints and digit topology. Use charcoal #101014 ground, a thin #a1a1aa silhouette, sparse #52525b structural contours and one #fafafa focal contour. Smooth the curves; remove texture scratches, shadow bands and redundant anatomy marks. No raster embedding, gradients, filters, shading fills or labels. Compose at 1200 by 900 with clear contact and negative space.

**Construction method:** Low-pass structural edge extraction from owned plate; graph-connected curves, directional gap joining, cubic simplification and per-subject removal/repair. Anatomical silhouette gaps are explicitly repaired at the torso, dorsal hand and foot contact contours.

**Seven-second movement:** The flexed arm gathers a small tension, then settles.

**Review:** Inspected the native SVG in Chrome. Preserved the elbow triangle, tapered forearm and closed fist while reducing the bodybuilder-looking shadow divisions to a small number of continuous anatomical lines.

[Static SVG](corpus/svg/105215.svg) · [Animated SVG](corpus/animated/105215.svg) · [MP4](exports/105215.mp4) · [Six-pose sheet](qa/hairline/105215-contact.png)

<a id="study-105216"></a>

### 105216 — The Palm Opens

**Reference:** 105216.jpg · **Category:** hand

**Reference observation:** The reference explains finger segment lengths, thumb opposition, the thenar pad and the cupped palm in perspective.

**SVG drawing prompt:**

Draw the palm opens as native SVG anatomical line art derived from the owned 105216 graphite plate. Preserve the original gesture, perspective, joints and digit topology. Use charcoal #101014 ground, a thin #a1a1aa silhouette, sparse #52525b structural contours and one #fafafa focal contour. Smooth the curves; remove texture scratches, shadow bands and redundant anatomy marks. No raster embedding, gradients, filters, shading fills or labels. Compose at 1200 by 900 with clear contact and negative space.

**Construction method:** Low-pass structural edge extraction from owned plate; graph-connected curves, directional gap joining, cubic simplification and per-subject removal/repair. Anatomical silhouette gaps are explicitly repaired at the torso, dorsal hand and foot contact contours.

**Seven-second movement:** The open fingers relax slightly while the palm stays steady.

**Review:** Inspected the native SVG in Chrome. Five digits, thumb opposition, finger-web topology and the palmar cup read clearly. The outside contour is stronger than the sparse palm and joint creases; texture scratches were removed.

[Static SVG](corpus/svg/105216.svg) · [Animated SVG](corpus/animated/105216.svg) · [MP4](exports/105216.mp4) · [Six-pose sheet](qa/hairline/105216-contact.png)

<a id="study-105217"></a>

### 105217 — Tendons Beneath the Gesture

**Reference:** 105217.jpg · **Category:** hand

**Reference observation:** The source emphasizes dorsal tendons flowing into knuckles and finger centerlines receding in perspective.

**SVG drawing prompt:**

Draw tendons beneath the gesture as native SVG anatomical line art derived from the owned 105217 graphite plate. Preserve the original gesture, perspective, joints and digit topology. Use charcoal #101014 ground, a thin #a1a1aa silhouette, sparse #52525b structural contours and one #fafafa focal contour. Smooth the curves; remove texture scratches, shadow bands and redundant anatomy marks. No raster embedding, gradients, filters, shading fills or labels. Compose at 1200 by 900 with clear contact and negative space.

**Construction method:** Low-pass structural edge extraction from owned plate; graph-connected curves, directional gap joining, cubic simplification and per-subject removal/repair. Anatomical silhouette gaps are explicitly repaired at the torso, dorsal hand and foot contact contours.

**Seven-second movement:** A subtle tension passes through the back of the hand.

**Review:** Inspected the native SVG in Chrome and repaired the thumb web, lower palm and wrist silhouette. Five digits are connected through a clear dorsal-hand outline. Tendon and knuckle lines remain subordinate; the small finger retains its source foreshortening.

[Static SVG](corpus/svg/105217.svg) · [Animated SVG](corpus/animated/105217.svg) · [MP4](exports/105217.mp4) · [Six-pose sheet](qa/hairline/105217-contact.png)

<a id="study-105218"></a>

### 105218 — Weight Through the Outer Leg

**Reference:** 105218.jpg · **Category:** leg

**Reference observation:** The source examines lateral thigh and calf planes, knee transition and the long taper toward the ankle.

**SVG drawing prompt:**

Draw weight through the outer leg as native SVG anatomical line art derived from the owned 105218 graphite plate. Preserve the original gesture, perspective, joints and digit topology. Use charcoal #101014 ground, a thin #a1a1aa silhouette, sparse #52525b structural contours and one #fafafa focal contour. Smooth the curves; remove texture scratches, shadow bands and redundant anatomy marks. No raster embedding, gradients, filters, shading fills or labels. Compose at 1200 by 900 with clear contact and negative space.

**Construction method:** Low-pass structural edge extraction from owned plate; graph-connected curves, directional gap joining, cubic simplification and per-subject removal/repair. Anatomical silhouette gaps are explicitly repaired at the torso, dorsal hand and foot contact contours.

**Seven-second movement:** The calf gathers and releases tension over a planted foot.

**Review:** Inspected the native SVG in Chrome. Repaired the heel-to-arch contact contour and removed the cast-shadow line; the knee/calf/ankle relationship is continuous. Removed short nonstructural leg marks to preserve negative space.

[Static SVG](corpus/svg/105218.svg) · [Animated SVG](corpus/animated/105218.svg) · [MP4](exports/105218.mp4) · [Six-pose sheet](qa/hairline/105218-contact.png)

<a id="study-105219"></a>

### 105219 — The Calf Holds the Weight

**Reference:** 105219.jpg · **Category:** leg

**Reference observation:** The photo studies the posterior thigh, knee hollow, two calf heads and Achilles tendon, including the interlocking forms around the rear knee.

**SVG drawing prompt:**

Draw the calf holds the weight as native SVG anatomical line art derived from the owned 105219 graphite plate. Preserve the original gesture, perspective, joints and digit topology. Use charcoal #101014 ground, a thin #a1a1aa silhouette, sparse #52525b structural contours and one #fafafa focal contour. Smooth the curves; remove texture scratches, shadow bands and redundant anatomy marks. No raster embedding, gradients, filters, shading fills or labels. Compose at 1200 by 900 with clear contact and negative space.

**Construction method:** Low-pass structural edge extraction from owned plate; graph-connected curves, directional gap joining, cubic simplification and per-subject removal/repair. Anatomical silhouette gaps are explicitly repaired at the torso, dorsal hand and foot contact contours.

**Seven-second movement:** A small calf contraction settles into the heel.

**Review:** Inspected the native SVG in Chrome. Reconnected the rear heel and trimmed the false ground-shadow tail. Asymmetric calf heads, knee hollow and Achilles direction remain readable with fewer short vein fragments.

[Static SVG](corpus/svg/105219.svg) · [Animated SVG](corpus/animated/105219.svg) · [MP4](exports/105219.mp4) · [Six-pose sheet](qa/hairline/105219-contact.png)

<a id="study-105220"></a>

### 105220 — The Knee Connects the Gesture

**Reference:** 105220.jpg · **Category:** leg

**Reference observation:** Corrected source mapping: 105220.jpg depicts the outer leg and a bent knee, not an arm. This study uses the seated bend to show thigh/calf connection across the knee.

**SVG drawing prompt:**

Draw the knee connects the gesture as native SVG anatomical line art derived from the owned 105220 graphite plate. Preserve the original gesture, perspective, joints and digit topology. Use charcoal #101014 ground, a thin #a1a1aa silhouette, sparse #52525b structural contours and one #fafafa focal contour. Smooth the curves; remove texture scratches, shadow bands and redundant anatomy marks. No raster embedding, gradients, filters, shading fills or labels. Compose at 1200 by 900 with clear contact and negative space.

**Construction method:** Low-pass structural edge extraction from owned plate; graph-connected curves, directional gap joining, cubic simplification and per-subject removal/repair. Anatomical silhouette gaps are explicitly repaired at the torso, dorsal hand and foot contact contours.

**Seven-second movement:** The bent leg settles through a quiet change of tension.

**Review:** Inspected the native SVG in Chrome. Correct leg category follows the actual source. The bent-knee connection and heel/sole are continuous; removed the stray heel tip and reduced short interior marks. The upper-thigh crop is intentional.

[Static SVG](corpus/svg/105220.svg) · [Animated SVG](corpus/animated/105220.svg) · [MP4](exports/105220.mp4) · [Six-pose sheet](qa/hairline/105220-contact.png)

<a id="study-105221"></a>

### 105221 — Five Toes, One Foundation

**Reference:** 105221.jpg · **Category:** foot

**Reference observation:** The source distinguishes broad padded toes from fingers and shows their stepped joint arc and the sloping forefoot.

**SVG drawing prompt:**

Draw five toes, one foundation as native SVG anatomical line art derived from the owned 105221 graphite plate. Preserve the original gesture, perspective, joints and digit topology. Use charcoal #101014 ground, a thin #a1a1aa silhouette, sparse #52525b structural contours and one #fafafa focal contour. Smooth the curves; remove texture scratches, shadow bands and redundant anatomy marks. No raster embedding, gradients, filters, shading fills or labels. Compose at 1200 by 900 with clear contact and negative space.

**Construction method:** Low-pass structural edge extraction from owned plate; graph-connected curves, directional gap joining, cubic simplification and per-subject removal/repair. Anatomical silhouette gaps are explicitly repaired at the torso, dorsal hand and foot contact contours.

**Seven-second movement:** The toes relax while the foot keeps its weight on the ground.

**Review:** Inspected the native SVG in Chrome. Repaired the heel, forefoot and stepped toe silhouette; five toe forms remain distinct. Removed shadow bands under the heel and the least useful short vein traces. Interior marks describe joints and nail planes rather than tonal shading.

[Static SVG](corpus/svg/105221.svg) · [Animated SVG](corpus/animated/105221.svg) · [MP4](exports/105221.mp4) · [Six-pose sheet](qa/hairline/105221-contact.png)

<a id="study-105222"></a>

### 105222 — The Foot Seen from Above

**Reference:** 105222.jpg · **Category:** foot

**Reference observation:** The reference provides dorsal/front and side comparisons. The chosen final plate is a true overhead view with the foot pointing down the page.

**SVG drawing prompt:**

Draw the foot seen from above as native SVG anatomical line art derived from the owned 105222 graphite plate. Preserve the original gesture, perspective, joints and digit topology. Use charcoal #101014 ground, a thin #a1a1aa silhouette, sparse #52525b structural contours and one #fafafa focal contour. Smooth the curves; remove texture scratches, shadow bands and redundant anatomy marks. No raster embedding, gradients, filters, shading fills or labels. Compose at 1200 by 900 with clear contact and negative space.

**Construction method:** Low-pass structural edge extraction from owned plate; graph-connected curves, directional gap joining, cubic simplification and per-subject removal/repair. Anatomical silhouette gaps are explicitly repaired at the torso, dorsal hand and foot contact contours.

**Seven-second movement:** A faint change of tendon tension crosses the top of the foot.

**Review:** Inspected the native SVG in Chrome. A true dorsal view with all five toes, graduated widths and a continuous front edge. Replaced the fragmented left ankle with one deliberate continuous contour and removed its duplicate fragments. Long metatarsal/tendon directions retain the viewpoint.

[Static SVG](corpus/svg/105222.svg) · [Animated SVG](corpus/animated/105222.svg) · [MP4](exports/105222.mp4) · [Six-pose sheet](qa/hairline/105222-contact.png)

<a id="study-105223"></a>

### 105223 — The Foot in Three-Quarter View

**Reference:** 105223.jpg · **Category:** foot

**Reference observation:** The source teaches the continuous transition from ankle through heel and arch into the toes. This interpretation shows a lateral/dorsal three-quarter foot with the great toe on the far side; it is not a dedicated medial-arch view.

**SVG drawing prompt:**

Draw the foot in three-quarter view as native SVG anatomical line art derived from the owned 105223 graphite plate. Preserve the original gesture, perspective, joints and digit topology. Use charcoal #101014 ground, a thin #a1a1aa silhouette, sparse #52525b structural contours and one #fafafa focal contour. Smooth the curves; remove texture scratches, shadow bands and redundant anatomy marks. No raster embedding, gradients, filters, shading fills or labels. Compose at 1200 by 900 with clear contact and negative space.

**Construction method:** Low-pass structural edge extraction from owned plate; graph-connected curves, directional gap joining, cubic simplification and per-subject removal/repair. Anatomical silhouette gaps are explicitly repaired at the torso, dorsal hand and foot contact contours.

**Seven-second movement:** The ankle settles gently over the grounded heel and forefoot.

**Review:** Inspected the native SVG in Chrome. Rebuilt the lost heel/arch/anterior-ankle silhouette around the retained observed toe contours. Smoothed the little-toe sole shelf and the pointed great-toe lip into deliberate anatomical arcs. Removed cast-shadow bands and low-value short traces. This is a curated line interpretation of the owned plate, not a 3D reconstruction.

[Static SVG](corpus/svg/105223.svg) · [Animated SVG](corpus/animated/105223.svg) · [MP4](exports/105223.mp4) · [Six-pose sheet](qa/hairline/105223-contact.png)

<a id="study-105232"></a>

### 105232 — The Captain Who Charted the Moon

**Reference:** 105232.jpg · **Category:** pirate

**Reference observation:** A book photograph of two swashbucklers: convincing counterweighted poses, layered costume, foreshortened hands, broad hat silhouettes, curved cloth folds and dense directional crosshatching. The new scene studies these principles without tracing either figure.

**SVG drawing prompt:**

An adult weathered seafarer standing on a pier, eye aligned with a long brass telescope, a star chart held at his side. Build native cubic silhouettes with adult proportions, five-finger grips and planted boots; retain only the hat, coat construction, face profile, telescope sections and sparse harbor depth cues. Use charcoal occlusion plates, a 1.1-pixel monochrome stroke hierarchy and one bright lens rim. No texture trace, image, gradient, glow, caption or colored fill.

**Construction method:** Hand-authored native SVG contour geometry informed by the prior generated pose; no raster embedded or automatic paint trace.

**Seven-second movement:** The hat feather answers a small sea breeze while the telescope, hands, coat and planted boots stay rigid.

**Review:** Inspected full-size rest and authored feather extreme. Adult body proportion and long planted legs remain coherent; the profile meets the eyepiece and raised fingers interrupt the tube as a grip. Softened the initially angular beard. Sparse pier and ship retain depth. Only the feather moves; there is no telescope lift or coat-body motion.

[Static SVG](corpus/svg/105232.svg) · [Animated SVG](corpus/animated/105232.svg) · [MP4](exports/105232.mp4) · [Six-pose sheet](qa/hairline/105232-contact.png)

<a id="study-105233"></a>

### 105233 — The Lantern Keeper of Willow Marsh

**Reference:** 105233.jpg · **Category:** creature

**Reference observation:** A fantasy-illustration page combines long curling tentacles, dramatic thin-versus-heavy silhouettes, layered organic surfaces and a theatrical figure high above elaborate creatures. The new dragon uses the serpentine construction and etched surface rhythm, with an original gentle story.

**SVG drawing prompt:**

A grounded heavy marsh dragon with a continuous curved neck, folded wing bones and a claw genuinely supporting a lantern ring. Author clean silhouettes and a few structural creases; keep the paw, tail and belly on the bank. Monochrome charcoal Hairline-inspired line hierarchy, with the flame as the only bright accent. Omit scales, foliage noise and tonal shading; native SVG geometry only.

**Construction method:** Hand-authored native SVG contour geometry informed by the prior generated pose; no raster embedded or automatic paint trace.

**Seven-second movement:** The lantern sways from a fixed ring while the dragon keeps its grasp, folded wings and planted ground contacts.

**Review:** Inspected full-size rest and lantern rotation extreme. Ring remains in the claw, the lamp rotates from its suspension point, and the heavy body, tail and resting paw stay fixed. Removed small spine marks whose attachment was ambiguous. Wing membranes remain a simplified invented structure. No wingbeat or body lift is claimed.

[Static SVG](corpus/svg/105233.svg) · [Animated SVG](corpus/animated/105233.svg) · [MP4](exports/105233.mp4) · [Six-pose sheet](qa/hairline/105233-contact.png)

<a id="study-105234"></a>

### 105234 — A Small Worm and a Borrowed Star

**Reference:** 105234.jpg · **Category:** worm

**Reference observation:** A fantastical worm drawing emphasizes broad compressed body masses, folded neck anatomy, strong cross-contour shading and curling horn silhouettes around a skull-like head. This original child-friendly scene keeps the weight, segmentation and curling silhouette while replacing the horror face with curiosity.

**SVG drawing prompt:**

A continuous coiled soft-bodied worm raises its small animal-like head toward a firefly. Construct an authored swept contour with sparse curved segment seams, two fine feelers and a small near eye. Keep the coil weighted on the ground, the mushrooms quiet and the firefly the single bright stroke. Native SVG paths on charcoal, no bitmap, texture, gradient, glow or human face pasted onto the worm.

**Construction method:** Hand-authored native SVG contour geometry informed by the prior generated pose; no raster embedded or automatic paint trace.

**Seven-second movement:** The firefly makes a returning hover and the attached feelers turn toward it; the continuous body holds its weighted coil.

**Review:** Inspected full-size rest and authored firefly/feeler extreme. Widened the coil bend to remove offset-curve self-intersection, and moved the eye off the silhouette. Feelers rotate at their visible roots; the continuous body remains weighted. Segment rhythm is deliberately sparse and somewhat regular. No crawling or major neck bend is claimed.

[Static SVG](corpus/svg/105234.svg) · [Animated SVG](corpus/animated/105234.svg) · [MP4](exports/105234.mp4) · [Six-pose sheet](qa/hairline/105234-contact.png)

<a id="study-105235"></a>

### 105235 — The Gardener Who Grew Another Morning

**Reference:** 105235.jpg · **Category:** zombie

**Reference observation:** The reference shows an expressive undead head with pronounced facial planes, irregular teeth, tousled hair, torn cloth, articulated fingers and a decorated mug. This original gently comic gardener carries over the expressive structure, sewn repairs and handled vessel, without exposed tissue or gore.

**SVG drawing prompt:**

An elderly kindly undead gardener kneels with one boot planted and one knee down, holding a ceramic jug by its handle to water a sapling. Author believable adult proportions, a clear five-digit grip, restrained facial creases and a few stitches without gore. Quiet native cubic contours on charcoal; water is the single bright accent. Use only background-colored occlusion plates, no texture trace, colored fill, gradients or embedded image.

**Construction method:** Hand-authored native SVG contour geometry informed by the prior generated pose; no raster embedded or automatic paint trace.

**Seven-second movement:** The sapling makes a gentle anchored lean; the adult pose, handle grip, jug, water source, knee, boot and pot stay fixed.

**Review:** Inspected full-size rest and sapling extreme. Bent the near fingers around the handle and raised its arc to make the grip continuous. Planted boot, grounded knee and pot retain their contact; sapling pivots at the soil line. Water and jug are held contours. This does not perform a full pouring action.

[Static SVG](corpus/svg/105235.svg) · [Animated SVG](corpus/animated/105235.svg) · [MP4](exports/105235.mp4) · [Six-pose sheet](qa/hairline/105235-contact.png)
