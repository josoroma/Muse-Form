# Seven — The moving sketchbook

24 original SVG drawing studies, each with a seven-second animation, a silent MP4, and a reusable art prompt. The collection draws on the 24 supplied photographs of anatomy and fantasy illustration. It includes a Codex skill for developing new drawings, character acting, and short illustrated stories.

![The original SVG corpus](qa/corpus-contact.jpg)

## Open the sketchbook

Run these commands from this directory:

```sh
npm ci
npm start
```

Open **http://127.0.0.1:4173**. Choose a drawing, press Play, scrub the seven-second timeline, or download a still SVG, animated SVG, or MP4. Space plays/pauses; left/right arrows step by one frame when focus is outside an interactive control. The gallery starts paused, honors reduced motion, and pauses when hidden. It needs a local server because it reads the corpus manifest. Individual SVGs open directly from disk.

The visual language combines warm paper, graphite/indigo contours, restrained colored washes, shadow planes, and selective hatching. These are **original interpretations**, not scanned pages, automatic tracings, or raster images wrapped in SVG. The supplied books' artists and publications have not been established; reference photographs remain in your Downloads folder and are not redistributed here. The anatomy studies are artistic references, not medically validated teaching plates.

## Use the skill

The source is [skills/seven-second-storytelling/SKILL.md](skills/seven-second-storytelling/SKILL.md). It includes drawing guidance, anatomical landmarks, facial acting, child-friendly fantasy storytelling, seven-second timing, render helpers, and this complete SVG corpus.

The [portable skill bundle](exports/seven-second-storytelling.skill.zip) includes the skill and all 48 static/animated SVG files. The films remain separately available in the corpus index below.

```sh
npm run install-skill
```

This packages the corpus and installs the skill into $CODEX_HOME/skills/seven-second-storytelling, or ~/.codex/skills/seven-second-storytelling when CODEX_HOME is unset. Start a new Codex conversation if the skill list has not refreshed. Example:

> Use $seven-second-storytelling to draw a curious pirate offering a star to a small worm. Study the attached anatomy references, make an expressive original SVG, animate a seven-second story, and export the MP4. Include the art prompt and file links in the README.

## Reproduce and check

Local rendering requires Node.js 22+, Chrome/Chromium, and FFmpeg/ffprobe. The only npm dependency is the pinned development dependency playwright-core; the gallery and SVGs have no runtime library or CDN dependency. Set CHROME_PATH if the browser is not in a standard location.

```sh
npm run catalog                 # rebuild manifest and this prompt catalog
npm run check                   # SVG checks + rendered contact sheets
npm run render                  # all 24 films, 210 frames each
npm run render -- 105232 105234  # selected films
npm run verify                  # gallery controls + encoded video checks
```

Each MP4 is **7.000 seconds, 1200 × 900, 30 fps, H.264, 210 frames**, with no audio. Frames cover [0, 7); the mathematical endpoint at 7 seconds is checked separately for loop closure. SVG groups remain editable. Standalone animated SVGs loop automatically in supporting browsers; use the still SVG for a reduced-motion embedding.

Verification evidence lives in [qa/svg-checks.json](qa/svg-checks.json), [qa/verification.json](qa/verification.json), and the six-pose contact sheets linked below. Automated checks cover XML/DOM structure, seven-second tracks, repeatable random seeking, matching loop endpoints, actual pixel changes, video metadata, and browser controls. They do not certify artistic quality or smooth endpoint velocity; the rendered drawings and loop transitions also need visual judgment.

## Inspiration and engineering choices

[Hairline](https://github.com/lucasmarkes/hairline) informed line hierarchy, a carefully composed resting frame, bounded movement, and visual inspection. Its isometric object engine and monochrome constraints were not adopted. The other supplied projects contributed timing, acting, staging, and deterministic rendering ideas:

- [Awesome motion design agent skills](https://github.com/frankxai/awesome-motion-design-agent-skills): evaluate purpose, timing, hierarchy, and accessibility separately.
- [Claude Motion](https://github.com/whaleyxbt/claude-motion): named beats, a focal action, and frame-derived state.
- [iart motion-design-skills](https://github.com/iart-ai/motion-design-skills): anticipation, arcs, weight, and follow-through.
- [HyperFrames motion reel guide](https://sunwood-ai-labs.github.io/hyperframes-motion-reel-skill/guide/getting-started): deterministic composition and verification of actual encoded output.
- [Motion Designer](https://github.com/kaventro/motion-designer): readable holds and explicit loop construction.
- [iart motion-skills](https://github.com/iart-ai/motion-skills): illustration references and render–inspect–repair practice.

The SVGs, animation tracks, gallery, and exporter are original code. No upstream engine is bundled. [Research notes](skills/seven-second-storytelling/references/sources.md) record source revisions and upstream licenses. The export path is native SVG → local Chrome → FFmpeg; it does not require Remotion, HyperFrames, an account, or a cloud service.

## Corpus index

The machine-readable [manifest](corpus/manifest.json) contains every full prompt, observation, motion description, source filename and source SHA-256 when available. One source photo maps to one original study. Files in corpus/metadata are the editable catalog inputs; running catalog regenerates the manifest and README.

| Reference | Original study | Editable still | Seven-second SVG | MP4 |
| --- | --- | --- | --- | --- |
| 105193.jpg | [Architecture beneath the face](#study-105193) | [SVG](corpus/svg/105193.svg) | [Animation](corpus/animated/105193.svg) | [Film](exports/105193.mp4) |
| 105194.jpg | [The globe beneath the lid](#study-105194) | [SVG](corpus/svg/105194.svg) | [Animation](corpus/animated/105194.svg) | [Film](exports/105194.mp4) |
| 105195.jpg | [Cartilage catching the light](#study-105195) | [SVG](corpus/svg/105195.svg) | [Animation](corpus/animated/105195.svg) | [Film](exports/105195.mp4) |
| 105196.jpg | [A smile finding its way](#study-105196) | [SVG](corpus/svg/105196.svg) | [Animation](corpus/animated/105196.svg) | [Film](exports/105196.mp4) |
| 105197.jpg | [The weight of a quiet thought](#study-105197) | [SVG](corpus/svg/105197.svg) | [Animation](corpus/animated/105197.svg) | [Film](exports/105197.mp4) |
| 105198.jpg | [A storm held behind the eyes](#study-105198) | [SVG](corpus/svg/105198.svg) | [Animation](corpus/animated/105198.svg) | [Film](exports/105198.mp4) |
| 105199.jpg | [The moment before the courage](#study-105199) | [SVG](corpus/svg/105199.svg) | [Animation](corpus/animated/105199.svg) | [Film](exports/105199.mp4) |
| 105200.jpg | [An astonishment in warm light](#study-105200) | [SVG](corpus/svg/105200.svg) | [Animation](corpus/animated/105200.svg) | [Film](exports/105200.mp4) |
| 105202.jpg | [Laughter in profile](#study-105202) | [SVG](corpus/svg/105202.svg) | [Animation](corpus/animated/105202.svg) | [Film](exports/105202.mp4) |
| 105203.jpg | [A conspiratorial wink](#study-105203) | [SVG](corpus/svg/105203.svg) | [Animation](corpus/animated/105203.svg) | [Film](exports/105203.mp4) |
| 105214.jpg | [Contrapposto · the lifted ribcage](#study-105214) | [SVG](corpus/svg/105214.svg) | [Animation](corpus/animated/105214.svg) | [Film](exports/105214.mp4) |
| 105215.jpg | [The gathering arm](#study-105215) | [SVG](corpus/svg/105215.svg) | [Animation](corpus/animated/105215.svg) | [Film](exports/105215.mp4) |
| 105216.jpg | [An open invitation](#study-105216) | [SVG](corpus/svg/105216.svg) | [Animation](corpus/animated/105216.svg) | [Film](exports/105216.mp4) |
| 105217.jpg | [The reaching hand](#study-105217) | [SVG](corpus/svg/105217.svg) | [Animation](corpus/animated/105217.svg) | [Film](exports/105217.mp4) |
| 105218.jpg | [Weight through the outer leg](#study-105218) | [SVG](corpus/svg/105218.svg) | [Animation](corpus/animated/105218.svg) | [Film](exports/105218.mp4) |
| 105219.jpg | [The descending tendon](#study-105219) | [SVG](corpus/svg/105219.svg) | [Animation](corpus/animated/105219.svg) | [Film](exports/105219.mp4) |
| 105220.jpg | [A gesture from the shoulder](#study-105220) | [SVG](corpus/svg/105220.svg) | [Animation](corpus/animated/105220.svg) | [Film](exports/105220.mp4) |
| 105221.jpg | [Five notes of balance](#study-105221) | [SVG](corpus/svg/105221.svg) | [Animation](corpus/animated/105221.svg) | [Film](exports/105221.mp4) |
| 105222.jpg | [The foot approaches](#study-105222) | [SVG](corpus/svg/105222.svg) | [Animation](corpus/animated/105222.svg) | [Film](exports/105222.mp4) |
| 105223.jpg | [The architecture of an arch](#study-105223) | [SVG](corpus/svg/105223.svg) | [Animation](corpus/animated/105223.svg) | [Film](exports/105223.mp4) |
| 105232.jpg | [The Captain Who Charted the Moon](#study-105232) | [SVG](corpus/svg/105232.svg) | [Animation](corpus/animated/105232.svg) | [Film](exports/105232.mp4) |
| 105233.jpg | [The Lantern Keeper of Willow Marsh](#study-105233) | [SVG](corpus/svg/105233.svg) | [Animation](corpus/animated/105233.svg) | [Film](exports/105233.mp4) |
| 105234.jpg | [A Small Worm and a Borrowed Star](#study-105234) | [SVG](corpus/svg/105234.svg) | [Animation](corpus/animated/105234.svg) | [Film](exports/105234.mp4) |
| 105235.jpg | [The Gardener Who Grew Another Morning](#study-105235) | [SVG](corpus/svg/105235.svg) | [Animation](corpus/animated/105235.svg) | [Film](exports/105235.mp4) |

## Full prompts and motion notes

<a id="study-105193"></a>

### 105193 — Architecture beneath the face

**Reference:** 105193.jpg · **Category:** skull-and-orbit

**What the reference teaches:** The reference isolates the bony orbit, nasal aperture and zygomatic arches. Deep occlusion is nearly black, while thin rim lights make the thickness of bone readable.

**Reusable drawing prompt:**

Create a museum-quality original native SVG drawing of an original human skull in a slight three-quarter view, domed frontal cranium, irregular sutures, unequal deep orbital cavities, a delicate nasal bridge, curved zygomatic arches and articulated upper and lower dental arcades. Use the visual lesson of reference 105193.jpg as anatomical study material; do not trace its photograph, page, lettering or composition. Compose on a 1200 × 900 warm ivory (#f3eee2) field with generous breathing room. Draw explicit editable cubic Bézier contours, a 2–3 px indigo graphite (#24343b) silhouette, broken 0.8–1.5 px interior lines, restrained contour hatching, pale upper-left light, olive gray shadow planes, muted ochre and russet accents. Make the subject feel sculptural through overlap, occlusion, perspective, curved cross-contours and reflected light. Preserve natural asymmetry and avoid icon geometry, plastic gradients, raster embeds and decorative UI. Name structural SVG groups and provide accessible title/description. Animate a seven-second looping study with anticipation, anatomically motivated independent parts and a soft settle; keep the artwork fully readable at time zero and make the ending identical.

**Seven-second choreography:**

0–1 s: hold the full drawing; 1–2 s: warm rim light gathers along the orbital arch; 2–3.4 s: the mandible rotates three degrees at the hinge; 3.4–4.8 s: the light crosses the zygomatic contour; 4.8–6 s: jaw and light settle; 6–7 s: return exactly to the initial pose.

[Static SVG](corpus/svg/105193.svg) · [Animated SVG](corpus/animated/105193.svg) · [MP4](exports/105193.mp4) · [Six-frame contact sheet](qa/105193-contact.png)


<a id="study-105194"></a>

### 105194 — The globe beneath the lid

**Reference:** 105194.jpg · **Category:** eye-anatomy

**What the reference teaches:** The eyeball and both lids wrap around a sphere. The brow ridge, tear lake, lid crease and lower orbital plane must turn in depth rather than become flat graphic outlines.

**Reusable drawing prompt:**

Create a museum-quality original native SVG drawing of a large isolated anatomical eye, eyelids wrapping around the spherical cornea, layered upper crease, detailed olive iris and dark pupil, wet tear lake at the medial corner, directional eyebrow hairs and a sculpted lower orbital plane. Use the visual lesson of reference 105194.jpg as anatomical study material; do not trace its photograph, page, lettering or composition. Compose on a 1200 × 900 warm ivory (#f3eee2) field with generous breathing room. Draw explicit editable cubic Bézier contours, a 2–3 px indigo graphite (#24343b) silhouette, broken 0.8–1.5 px interior lines, restrained contour hatching, pale upper-left light, olive gray shadow planes, muted ochre and russet accents. Make the subject feel sculptural through overlap, occlusion, perspective, curved cross-contours and reflected light. Preserve natural asymmetry and avoid icon geometry, plastic gradients, raster embeds and decorative UI. Name structural SVG groups and provide accessible title/description. Animate a seven-second looping study with anticipation, anatomically motivated independent parts and a soft settle; keep the artwork fully readable at time zero and make the ending identical.

**Seven-second choreography:**

0–1 s: quiet open gaze; 1–2 s: brow anticipates a glance; 2–2.17 s: the upper lid closes; 2.17–2.45 s: the eye reopens; 2.45–4.8 s: iris looks laterally while the brow holds; 4.8–6 s: gaze returns; 6–7 s: initial pose is restored.

[Static SVG](corpus/svg/105194.svg) · [Animated SVG](corpus/animated/105194.svg) · [MP4](exports/105194.mp4) · [Six-frame contact sheet](qa/105194-contact.png)


<a id="study-105195"></a>

### 105195 — Cartilage catching the light

**Reference:** 105195.jpg · **Category:** ear-anatomy

**What the reference teaches:** The ear has a continuous helix, a bifurcated antihelix, triangular fossa, deep concha, projecting tragus and soft lobule. Its back surface and overlapping folds are volumes, not a flat symbol.

**Reusable drawing prompt:**

Create a museum-quality original native SVG drawing of a greatly enlarged three-quarter human ear, continuous outer helix, Y-shaped antihelix branches, triangular fossa, deep conchal bowl, small projecting tragus and antitragus, soft asymmetric lobule and finely hatched turning planes. Use the visual lesson of reference 105195.jpg as anatomical study material; do not trace its photograph, page, lettering or composition. Compose on a 1200 × 900 warm ivory (#f3eee2) field with generous breathing room. Draw explicit editable cubic Bézier contours, a 2–3 px indigo graphite (#24343b) silhouette, broken 0.8–1.5 px interior lines, restrained contour hatching, pale upper-left light, olive gray shadow planes, muted ochre and russet accents. Make the subject feel sculptural through overlap, occlusion, perspective, curved cross-contours and reflected light. Preserve natural asymmetry and avoid icon geometry, plastic gradients, raster embeds and decorative UI. Name structural SVG groups and provide accessible title/description. Animate a seven-second looping study with anticipation, anatomically motivated independent parts and a soft settle; keep the artwork fully readable at time zero and make the ending identical.

**Seven-second choreography:**

0–1 s: full anatomical drawing holds; 1–2 s: a subtle cartilage highlight builds; 2–3.4 s: light follows the helix and antihelix while small sound arcs appear; 3.4–4.8 s: the highlights soften; 4.8–6 s: sound arcs and light settle; 6–7 s: match the opening drawing.

[Static SVG](corpus/svg/105195.svg) · [Animated SVG](corpus/animated/105195.svg) · [MP4](exports/105195.mp4) · [Six-frame contact sheet](qa/105195-contact.png)


<a id="study-105196"></a>

### 105196 — A smile finding its way

**Reference:** 105196.jpg · **Category:** happiness

**What the reference teaches:** Relaxed brow, cheek lifting and the outward pull of the closed smiling mouth.

**Reusable drawing prompt:**

Create a museum-quality original native SVG drawing of an original coherent male portrait expressing happiness, asymmetrical natural proportions, sculpted cranial and cheek planes, detailed olive irises, directional swept hair, true ear folds, modeled nose cartilage, expressive lips and tendons of the neck. Use the visual lesson of reference 105196.jpg as anatomical study material; do not trace its photograph, page, lettering or composition. Compose on a 1200 × 900 warm ivory (#f3eee2) field with generous breathing room. Draw explicit editable cubic Bézier contours, a 2–3 px indigo graphite (#24343b) silhouette, broken 0.8–1.5 px interior lines, restrained contour hatching, pale upper-left light, olive gray shadow planes, muted ochre and russet accents. Make the subject feel sculptural through overlap, occlusion, perspective, curved cross-contours and reflected light. Preserve natural asymmetry and avoid icon geometry, plastic gradients, raster embeds and decorative UI. Name structural SVG groups and provide accessible title/description. Animate a seven-second looping study with anticipation, anatomically motivated independent parts and a soft settle; keep the artwork fully readable at time zero and make the ending identical.

**Seven-second choreography:**

0–1 s: readable resting expression; 1–2 s: small anticipation; 2–3.4 s: A small closed-mouth smile grows through raised cheeks; a gentle blink lands before the mouth settles. 3.4–4.8 s: sustain the emotional peak; 4.8–6 s: secondary features ease back; 6–7 s: exact return to the initial pose. The coordinated blink closes at 2.17 s and reopens at 2.45 s.

[Static SVG](corpus/svg/105196.svg) · [Animated SVG](corpus/animated/105196.svg) · [MP4](exports/105196.mp4) · [Six-frame contact sheet](qa/105196-contact.png)


<a id="study-105197"></a>

### 105197 — The weight of a quiet thought

**Reference:** 105197.jpg · **Category:** sadness

**What the reference teaches:** The inner brows draw upward and together while the lip corners and gaze fall.

**Reusable drawing prompt:**

Create a museum-quality original native SVG drawing of an original coherent male portrait expressing sadness, asymmetrical natural proportions, sculpted cranial and cheek planes, detailed olive irises, directional swept hair, true ear folds, modeled nose cartilage, expressive lips and tendons of the neck. Use the visual lesson of reference 105197.jpg as anatomical study material; do not trace its photograph, page, lettering or composition. Compose on a 1200 × 900 warm ivory (#f3eee2) field with generous breathing room. Draw explicit editable cubic Bézier contours, a 2–3 px indigo graphite (#24343b) silhouette, broken 0.8–1.5 px interior lines, restrained contour hatching, pale upper-left light, olive gray shadow planes, muted ochre and russet accents. Make the subject feel sculptural through overlap, occlusion, perspective, curved cross-contours and reflected light. Preserve natural asymmetry and avoid icon geometry, plastic gradients, raster embeds and decorative UI. Name structural SVG groups and provide accessible title/description. Animate a seven-second looping study with anticipation, anatomically motivated independent parts and a soft settle; keep the artwork fully readable at time zero and make the ending identical.

**Seven-second choreography:**

0–1 s: readable resting expression; 1–2 s: small anticipation; 2–3.4 s: The gaze drops, the inner brow lifts, and the lower lip trembles once before easing. 3.4–4.8 s: sustain the emotional peak; 4.8–6 s: secondary features ease back; 6–7 s: exact return to the initial pose. The coordinated blink closes at 2.17 s and reopens at 2.45 s.

[Static SVG](corpus/svg/105197.svg) · [Animated SVG](corpus/animated/105197.svg) · [MP4](exports/105197.mp4) · [Six-frame contact sheet](qa/105197-contact.png)


<a id="study-105198"></a>

### 105198 — A storm held behind the eyes

**Reference:** 105198.jpg · **Category:** anger

**What the reference teaches:** Compressed eyebrows, narrowed lids, flared nostrils and a tense, narrow mouth.

**Reusable drawing prompt:**

Create a museum-quality original native SVG drawing of an original coherent male portrait expressing anger, asymmetrical natural proportions, sculpted cranial and cheek planes, detailed olive irises, directional swept hair, true ear folds, modeled nose cartilage, expressive lips and tendons of the neck. Use the visual lesson of reference 105198.jpg as anatomical study material; do not trace its photograph, page, lettering or composition. Compose on a 1200 × 900 warm ivory (#f3eee2) field with generous breathing room. Draw explicit editable cubic Bézier contours, a 2–3 px indigo graphite (#24343b) silhouette, broken 0.8–1.5 px interior lines, restrained contour hatching, pale upper-left light, olive gray shadow planes, muted ochre and russet accents. Make the subject feel sculptural through overlap, occlusion, perspective, curved cross-contours and reflected light. Preserve natural asymmetry and avoid icon geometry, plastic gradients, raster embeds and decorative UI. Name structural SVG groups and provide accessible title/description. Animate a seven-second looping study with anticipation, anatomically motivated independent parts and a soft settle; keep the artwork fully readable at time zero and make the ending identical.

**Seven-second choreography:**

0–1 s: readable resting expression; 1–2 s: small anticipation; 2–3.4 s: Brows squeeze inward, the eyelids narrow and the nostrils tighten, followed by a controlled release. 3.4–4.8 s: sustain the emotional peak; 4.8–6 s: secondary features ease back; 6–7 s: exact return to the initial pose. The coordinated blink closes at 2.17 s and reopens at 2.45 s.

[Static SVG](corpus/svg/105198.svg) · [Animated SVG](corpus/animated/105198.svg) · [MP4](exports/105198.mp4) · [Six-frame contact sheet](qa/105198-contact.png)


<a id="study-105199"></a>

### 105199 — The moment before the courage

**Reference:** 105199.jpg · **Category:** fear

**What the reference teaches:** Wide visible irises, lifted brows and retracted lips revealing a tense strip of teeth.

**Reusable drawing prompt:**

Create a museum-quality original native SVG drawing of an original coherent male portrait expressing fear, asymmetrical natural proportions, sculpted cranial and cheek planes, detailed olive irises, directional swept hair, true ear folds, modeled nose cartilage, expressive lips and tendons of the neck. Use the visual lesson of reference 105199.jpg as anatomical study material; do not trace its photograph, page, lettering or composition. Compose on a 1200 × 900 warm ivory (#f3eee2) field with generous breathing room. Draw explicit editable cubic Bézier contours, a 2–3 px indigo graphite (#24343b) silhouette, broken 0.8–1.5 px interior lines, restrained contour hatching, pale upper-left light, olive gray shadow planes, muted ochre and russet accents. Make the subject feel sculptural through overlap, occlusion, perspective, curved cross-contours and reflected light. Preserve natural asymmetry and avoid icon geometry, plastic gradients, raster embeds and decorative UI. Name structural SVG groups and provide accessible title/description. Animate a seven-second looping study with anticipation, anatomically motivated independent parts and a soft settle; keep the artwork fully readable at time zero and make the ending identical.

**Seven-second choreography:**

0–1 s: readable resting expression; 1–2 s: small anticipation; 2–3.4 s: A quick upward glance leads the brow lift; lips stretch, the jaw catches, then the face exhales. 3.4–4.8 s: sustain the emotional peak; 4.8–6 s: secondary features ease back; 6–7 s: exact return to the initial pose. The coordinated blink closes at 2.17 s and reopens at 2.45 s.

[Static SVG](corpus/svg/105199.svg) · [Animated SVG](corpus/animated/105199.svg) · [MP4](exports/105199.mp4) · [Six-frame contact sheet](qa/105199-contact.png)


<a id="study-105200"></a>

### 105200 — An astonishment in warm light

**Reference:** 105200.jpg · **Category:** surprise

**What the reference teaches:** Raised orbital arches, round open eyes and a lowered jaw create surprise.

**Reusable drawing prompt:**

Create a museum-quality original native SVG drawing of an original coherent male portrait expressing surprise, asymmetrical natural proportions, sculpted cranial and cheek planes, detailed olive irises, directional swept hair, true ear folds, modeled nose cartilage, expressive lips and tendons of the neck. Use the visual lesson of reference 105200.jpg as anatomical study material; do not trace its photograph, page, lettering or composition. Compose on a 1200 × 900 warm ivory (#f3eee2) field with generous breathing room. Draw explicit editable cubic Bézier contours, a 2–3 px indigo graphite (#24343b) silhouette, broken 0.8–1.5 px interior lines, restrained contour hatching, pale upper-left light, olive gray shadow planes, muted ochre and russet accents. Make the subject feel sculptural through overlap, occlusion, perspective, curved cross-contours and reflected light. Preserve natural asymmetry and avoid icon geometry, plastic gradients, raster embeds and decorative UI. Name structural SVG groups and provide accessible title/description. Animate a seven-second looping study with anticipation, anatomically motivated independent parts and a soft settle; keep the artwork fully readable at time zero and make the ending identical.

**Seven-second choreography:**

0–1 s: readable resting expression; 1–2 s: small anticipation; 2–3.4 s: The eyes open first, brows rise in delayed response, and the jaw opens into a soft gasp before recovery. 3.4–4.8 s: sustain the emotional peak; 4.8–6 s: secondary features ease back; 6–7 s: exact return to the initial pose. The coordinated blink closes at 2.17 s and reopens at 2.45 s.

[Static SVG](corpus/svg/105200.svg) · [Animated SVG](corpus/animated/105200.svg) · [MP4](exports/105200.mp4) · [Six-frame contact sheet](qa/105200-contact.png)


<a id="study-105202"></a>

### 105202 — Laughter in profile

**Reference:** 105202.jpg · **Category:** laughter-profile

**What the reference teaches:** The profile laugh combines a rising cheek, compressed eyelid, deepened nasolabial fold and lowered mandible. The teeth wrap in perspective and the neck responds to the jaw.

**Reusable drawing prompt:**

Create a museum-quality original native SVG drawing of a warmly lit expressive male head in right-facing profile laughing openly, swept-back engraved hair, anatomically folded ear, compressed crescent eyelid, raised zygomatic cheek, perspective dental arcade, descending mandible and taut neck tendons. Use the visual lesson of reference 105202.jpg as anatomical study material; do not trace its photograph, page, lettering or composition. Compose on a 1200 × 900 warm ivory (#f3eee2) field with generous breathing room. Draw explicit editable cubic Bézier contours, a 2–3 px indigo graphite (#24343b) silhouette, broken 0.8–1.5 px interior lines, restrained contour hatching, pale upper-left light, olive gray shadow planes, muted ochre and russet accents. Make the subject feel sculptural through overlap, occlusion, perspective, curved cross-contours and reflected light. Preserve natural asymmetry and avoid icon geometry, plastic gradients, raster embeds and decorative UI. Name structural SVG groups and provide accessible title/description. Animate a seven-second looping study with anticipation, anatomically motivated independent parts and a soft settle; keep the artwork fully readable at time zero and make the ending identical.

**Seven-second choreography:**

0–1 s: hold the open laugh; 1–2 s: cheek and eye anticipate; 2–3.4 s: the jaw rotates down and the cheek rises; 3.4–4.8 s: laugh peaks with a soft jaw follow-through; 4.8–6 s: jaw and eyelid settle; 6–7 s: identical opening pose.

[Static SVG](corpus/svg/105202.svg) · [Animated SVG](corpus/animated/105202.svg) · [MP4](exports/105202.mp4) · [Six-frame contact sheet](qa/105202-contact.png)


<a id="study-105203"></a>

### 105203 — A conspiratorial wink

**Reference:** 105203.jpg · **Category:** asymmetric-expression

**What the reference teaches:** A unilateral eyelid squeeze, one raised eyebrow and one tight mouth corner make an asymmetric expression.

**Reusable drawing prompt:**

Create a museum-quality original native SVG drawing of an original coherent male portrait expressing asymmetric-expression, asymmetrical natural proportions, sculpted cranial and cheek planes, detailed olive irises, directional swept hair, true ear folds, modeled nose cartilage, expressive lips and tendons of the neck. Use the visual lesson of reference 105203.jpg as anatomical study material; do not trace its photograph, page, lettering or composition. Compose on a 1200 × 900 warm ivory (#f3eee2) field with generous breathing room. Draw explicit editable cubic Bézier contours, a 2–3 px indigo graphite (#24343b) silhouette, broken 0.8–1.5 px interior lines, restrained contour hatching, pale upper-left light, olive gray shadow planes, muted ochre and russet accents. Make the subject feel sculptural through overlap, occlusion, perspective, curved cross-contours and reflected light. Preserve natural asymmetry and avoid icon geometry, plastic gradients, raster embeds and decorative UI. Name structural SVG groups and provide accessible title/description. Animate a seven-second looping study with anticipation, anatomically motivated independent parts and a soft settle; keep the artwork fully readable at time zero and make the ending identical.

**Seven-second choreography:**

0–1 s: readable resting expression; 1–2 s: small anticipation; 2–3.4 s: One brow lifts, the opposite eye winks, then one mouth corner curls with a delayed cheek response. 3.4–4.8 s: sustain the emotional peak; 4.8–6 s: secondary features ease back; 6–7 s: exact return to the initial pose. The coordinated blink closes at 2.17 s and reopens at 2.45 s.

[Static SVG](corpus/svg/105203.svg) · [Animated SVG](corpus/animated/105203.svg) · [MP4](exports/105203.mp4) · [Six-frame contact sheet](qa/105203-contact.png)


<a id="study-105214"></a>

### 105214 — Contrapposto · the lifted ribcage

**Reference:** 105214.jpg · **Category:** torso

**What the reference teaches:** The photographed page contrasts a twisting, upward-stretched ribcage with simplified torso volumes. I used the rib cage, pectoral fans, rectus rhythm and oblique counter-twist; no page text or original composition is reproduced.

**Reusable drawing prompt:**

Create an original 1200 × 900 native SVG anatomical art plate, with all important geometry within x=80–1120 and y=70–820. A cropped classical male torso turning toward high left light; ribcage lifted and pelvis counterturned. Pectorals wrap the chest, serratus slips interlock with obliques, asymmetrical abdominal intervals follow the twist. Strong ivory highlights, cool graphite occlusion beneath the pectorals, fine curved crosshatching and lost edges. Use hand-authored cubic Bézier contours, named editable anatomical groups, warm ivory #f3eee2 paper, graphite/indigo #24343b, restrained ochre and russet, continuous light direction, fine secondary contours and crosshatching. No embedded raster, page reproduction or copied text. Treat this as an artistic form study, not a clinical reference.

**Seven-second choreography:**

0–1 s settle and slight opposing anticipation; 1–3 s ribcage rotates 1.1° over planted pelvis while oblique flow lines emerge; 3–4.3 s hold the stretch; 4.3–6 s soften and return; 6–7 s regain the exact initial pose.

[Static SVG](corpus/svg/105214.svg) · [Animated SVG](corpus/animated/105214.svg) · [MP4](exports/105214.mp4) · [Six-frame contact sheet](qa/105214-contact.png)


<a id="study-105215"></a>

### 105215 — The gathering arm

**Reference:** 105215.jpg · **Category:** arm

**What the reference teaches:** The reference studies biceps/triceps masses around a flexed elbow and the changing forearm direction. The original plate emphasizes connected shoulder, upper arm and forearm volumes.

**Reusable drawing prompt:**

Create an original 1200 × 900 native SVG anatomical art plate, with all important geometry within x=80–1120 and y=70–820. A muscular arm in a purposeful curled pose, deltoid to flexed elbow to compact clenched fist. The biceps is a tapered contracting belly, forearm extensor planes run toward the wrist, four folded fingers and one crossing thumb form the hand. Left light rakes the arm; warm ivory highlights, indigo underside, fine muscle-following graphite hatching. Use hand-authored cubic Bézier contours, named editable anatomical groups, warm ivory #f3eee2 paper, graphite/indigo #24343b, restrained ochre and russet, continuous light direction, fine secondary contours and crosshatching. No embedded raster, page reproduction or copied text. Treat this as an artistic form study, not a clinical reference.

**Seven-second choreography:**

0–1 s forearm anticipates 1.5° away; 1–3 s rotate at the actual elbow by −5°; 3–4.3 s ease into the held contraction; 4.3–6 s extend with small follow-through; 6–7 s settle exactly to frame zero.

[Static SVG](corpus/svg/105215.svg) · [Animated SVG](corpus/animated/105215.svg) · [MP4](exports/105215.mp4) · [Six-frame contact sheet](qa/105215-contact.png)


<a id="study-105216"></a>

### 105216 — An open invitation

**Reference:** 105216.jpg · **Category:** hand

**What the reference teaches:** The source pairs a palm drawing with geometric construction, contrasting the thenar mound, palm creases, finger phalanges and the distinct thumb.

**Reusable drawing prompt:**

Create an original 1200 × 900 native SVG anatomical art plate, with all important geometry within x=80–1120 and y=70–820. A large open palm seen at three-quarter depth, five digits total: four independently tapered long fingers and one opposable thumb. Reveal the warm thenar mound, cupped central palm, curved transverse creases and gently unequal finger lengths. Anatomically considered joint folds, soft graphite hatching only on shadow planes, ivory grazing light and restrained ochre motion accents. Use hand-authored cubic Bézier contours, named editable anatomical groups, warm ivory #f3eee2 paper, graphite/indigo #24343b, restrained ochre and russet, continuous light direction, fine secondary contours and crosshatching. No embedded raster, page reproduction or copied text. Treat this as an artistic form study, not a clinical reference.

**Seven-second choreography:**

0–1 s tiny finger anticipation; 1–3 s index, ring and little fingers fan at their bases by −3°, 2° and 4°; 3–4.3 s the open gesture holds and palmar flow appears; 4.3–6 s digits relax in a gentle cascade; 6–7 s return to the initial open hand.

[Static SVG](corpus/svg/105216.svg) · [Animated SVG](corpus/animated/105216.svg) · [MP4](exports/105216.mp4) · [Six-frame contact sheet](qa/105216-contact.png)


<a id="study-105217"></a>

### 105217 — The reaching hand

**Reference:** 105217.jpg · **Category:** hand

**What the reference teaches:** The photographed back-of-hand studies emphasize the extensor tendons, stepped knuckles, nail perspective and the unequal phalanges.

**Reusable drawing prompt:**

Create an original 1200 × 900 native SVG anatomical art plate, with all important geometry within x=80–1120 and y=70–820. An expressive dorsal hand reaches upward, index and little finger slightly splayed. Exactly five digits; four visible nail plates and a lateral thumb. Trace the extensor tendons from wrist to their corresponding knuckles, use small broken contour accents at joints and substantial cool shadows on the far edge. The hand must read as flesh under raking studio light, not a mechanical diagram. Use hand-authored cubic Bézier contours, named editable anatomical groups, warm ivory #f3eee2 paper, graphite/indigo #24343b, restrained ochre and russet, continuous light direction, fine secondary contours and crosshatching. No embedded raster, page reproduction or copied text. Treat this as an artistic form study, not a clinical reference.

**Seven-second choreography:**

0–1 s small opposing finger rotations; 1–3 s fingers fan through a restrained 2–4° gesture while four extensor paths become visible; 3–4.3 s poised reach; 4.3–6 s relaxed follow-through; 6–7 s exact return.

[Static SVG](corpus/svg/105217.svg) · [Animated SVG](corpus/animated/105217.svg) · [MP4](exports/105217.mp4) · [Six-frame contact sheet](qa/105217-contact.png)


<a id="study-105218"></a>

### 105218 — Weight through the outer leg

**Reference:** 105218.jpg · **Category:** leg

**What the reference teaches:** The reference presents the outside lower leg, thigh-to-knee transition and the opposing rhythms of calf and tibial edge.

**Reusable drawing prompt:**

Create an original 1200 × 900 native SVG anatomical art plate, with all important geometry within x=80–1120 and y=70–820. A full sculptural outer leg in a relaxed load-bearing stance, cropped at the upper thigh. Vastus lateralis flows into a distinct patella, calf bulge lies high and tapers toward ankle, foot rests on an elliptical shadow. Graceful alternating convex and concave contours, a long lit tibial plane, cool muscle recesses, restrained russet line study. Use hand-authored cubic Bézier contours, named editable anatomical groups, warm ivory #f3eee2 paper, graphite/indigo #24343b, restrained ochre and russet, continuous light direction, fine secondary contours and crosshatching. No embedded raster, page reproduction or copied text. Treat this as an artistic form study, not a clinical reference.

**Seven-second choreography:**

0–1 s counterweight anticipation; 1–3 s a subtle 0.65° weight shift pivots at the grounded ankle and the knee-to-shin flow appears; 3–4.3 s hold; 4.3–6 s ease out with a slight overshoot; 6–7 s settle at the original position.

[Static SVG](corpus/svg/105218.svg) · [Animated SVG](corpus/animated/105218.svg) · [MP4](exports/105218.mp4) · [Six-frame contact sheet](qa/105218-contact.png)


<a id="study-105219"></a>

### 105219 — The descending tendon

**Reference:** 105219.jpg · **Category:** leg

**What the reference teaches:** The page examines the rear leg and knee, paired calf heads and their convergence toward the Achilles region.

**Reusable drawing prompt:**

Create an original 1200 × 900 native SVG anatomical art plate, with all important geometry within x=80–1120 and y=70–820. Rear three-quarter leg as a single sculptural study. Two unequal gastrocnemius heads narrow toward a long Achilles tendon; hamstring paths frame the popliteal hollow; upper thigh and heel keep a coherent turning axis. Raking upper-left light, continuous warm highlights interrupted by cool overlap shadows and delicate curved crosshatching. Use hand-authored cubic Bézier contours, named editable anatomical groups, warm ivory #f3eee2 paper, graphite/indigo #24343b, restrained ochre and russet, continuous light direction, fine secondary contours and crosshatching. No embedded raster, page reproduction or copied text. Treat this as an artistic form study, not a clinical reference.

**Seven-second choreography:**

0–1 s quiet observation; 1–2.7 s an ochre anatomical overlay progressively clarifies the separate calf heads; 2.7–4 s tendon convergence remains visible; 4–5.8 s overlay fades as tonal drawing resumes priority; 5.8–7 s original static pose, completing an exact loop.

[Static SVG](corpus/svg/105219.svg) · [Animated SVG](corpus/animated/105219.svg) · [MP4](exports/105219.mp4) · [Six-frame contact sheet](qa/105219-contact.png)


<a id="study-105220"></a>

### 105220 — A gesture from the shoulder

**Reference:** 105220.jpg · **Category:** arm

**What the reference teaches:** The photographed studies show the deltoid cap, upper-arm muscle groups, elbow and forearm as connected forms.

**Reusable drawing prompt:**

Create an original 1200 × 900 native SVG anatomical art plate, with all important geometry within x=80–1120 and y=70–820. An original arm descends diagonally from a rounded deltoid and opens into a relaxed, extended hand. Deltoid fibers fan over the shoulder cap, biceps and triceps taper at elbow, forearm planes converge through wrist into five distinct digits with believable overlap. Use broad luminous upper planes, cool crosshatched undersides, small warm accents and generous ivory negative space. Use hand-authored cubic Bézier contours, named editable anatomical groups, warm ivory #f3eee2 paper, graphite/indigo #24343b, restrained ochre and russet, continuous light direction, fine secondary contours and crosshatching. No embedded raster, page reproduction or copied text. Treat this as an artistic form study, not a clinical reference.

**Seven-second choreography:**

0–1 s observe the pose; 1–2.7 s shoulder fibers, upper-arm curve and forearm tendon flow become visible; 2.7–4 s hold the connected anatomical sweep; 4–5.8 s overlay recedes; 5.8–7 s exact initial plate. The anatomy stays grounded while the study overlay articulates its form.

[Static SVG](corpus/svg/105220.svg) · [Animated SVG](corpus/animated/105220.svg) · [MP4](exports/105220.mp4) · [Six-frame contact sheet](qa/105220-contact.png)


<a id="study-105221"></a>

### 105221 — Five notes of balance

**Reference:** 105221.jpg · **Category:** foot

**What the reference teaches:** The reference combines block construction and a tonal forefoot, showing the broad great toe and diminishing smaller toes on a receding arc.

**Reusable drawing prompt:**

Create an original 1200 × 900 native SVG anatomical art plate, with all important geometry within x=80–1120 and y=70–820. A dramatic three-quarter view of the forefoot, five toes on a spatially curved arc, broad great toe separated from four successively smaller toes. Convincing nail plates and joint folds; metatarsal mounds merge into the arch and ankle. Graphite crosshatching follows curved shadow planes, warm ivory glints define volume, cool indigo occlusion gives the foot weight. Use hand-authored cubic Bézier contours, named editable anatomical groups, warm ivory #f3eee2 paper, graphite/indigo #24343b, restrained ochre and russet, continuous light direction, fine secondary contours and crosshatching. No embedded raster, page reproduction or copied text. Treat this as an artistic form study, not a clinical reference.

**Seven-second choreography:**

0–1 s slight opposing anticipation; 1–3 s each toe gently fans 1–3° at its own base with the great toe counterturning; 3–4.3 s hold and show the tendon sweep; 4.3–6 s toes relax; 6–7 s return exactly to the starting arrangement.

[Static SVG](corpus/svg/105221.svg) · [Animated SVG](corpus/animated/105221.svg) · [MP4](exports/105221.mp4) · [Six-frame contact sheet](qa/105221-contact.png)


<a id="study-105222"></a>

### 105222 — The foot approaches

**Reference:** 105222.jpg · **Category:** foot

**What the reference teaches:** The page explores front and dorsal foot views, toe lengths, the ankle transition and tendon lines across the top of the foot.

**Reusable drawing prompt:**

Create an original 1200 × 900 native SVG anatomical art plate, with all important geometry within x=80–1120 and y=70–820. A foreshortened dorsal foot approaching the viewer, ankle receding upward. Exactly five individually drawn toes, the great toe broad and medial, remaining toes stepping away in perspective. Light follows the tibial plane and branching tendons; cool shadows turn around both malleoli. Ground the front of the foot with a soft contact shadow, fine crosshatching and broken graphite contours. Use hand-authored cubic Bézier contours, named editable anatomical groups, warm ivory #f3eee2 paper, graphite/indigo #24343b, restrained ochre and russet, continuous light direction, fine secondary contours and crosshatching. No embedded raster, page reproduction or copied text. Treat this as an artistic form study, not a clinical reference.

**Seven-second choreography:**

0–1 s toe anticipation; 1–3 s five articulated toes fan gently with maximum 3° rotation while the ankle-to-forefoot tendon study emerges; 3–4.3 s hold; 4.3–6 s release; 6–7 s recover the precise initial pose.

[Static SVG](corpus/svg/105222.svg) · [Animated SVG](corpus/animated/105222.svg) · [MP4](exports/105222.mp4) · [Six-frame contact sheet](qa/105222-contact.png)


<a id="study-105223"></a>

### 105223 — The architecture of an arch

**Reference:** 105223.jpg · **Category:** foot

**What the reference teaches:** The source contrasts inner and outer ankle heights, the heel pad and sole. The original composition selects an inner-side view to make the plantar arch readable.

**Reusable drawing prompt:**

Create an original 1200 × 900 native SVG anatomical art plate, with all important geometry within x=80–1120 and y=70–820. An inner-side foot with heel to the left and great toe to the right, ankle rising from the rear. High medial arch, soft heel pad, correct inner ankle prominence, and four partly occluded smaller toes behind the great toe. Carve form with upper-left ivory light, deep cool shadow within the arch and delicate crosshatching that follows fascia. Avoid diagram labels; let contour and light explain the structure. Use hand-authored cubic Bézier contours, named editable anatomical groups, warm ivory #f3eee2 paper, graphite/indigo #24343b, restrained ochre and russet, continuous light direction, fine secondary contours and crosshatching. No embedded raster, page reproduction or copied text. Treat this as an artistic form study, not a clinical reference.

**Seven-second choreography:**

0–1 s stillness establishes the arch; 1–2.7 s a warm contour study traces Achilles-to-heel and the plantar sweep; 2.7–4 s hold the structural relationship; 4–5.8 s fade overlay; 5.8–7 s exact original drawing, closing the seven-second study loop.

[Static SVG](corpus/svg/105223.svg) · [Animated SVG](corpus/animated/105223.svg) · [MP4](exports/105223.mp4) · [Six-frame contact sheet](qa/105223-contact.png)


<a id="study-105232"></a>

### 105232 — The Captain Who Charted the Moon

**Reference:** 105232.jpg · **Category:** pirate

**What the reference teaches:** A book photograph of two swashbucklers: convincing counterweighted poses, layered costume, foreshortened hands, broad hat silhouettes, curved cloth folds and dense directional crosshatching. The new scene studies these principles without tracing either figure.

**Reusable drawing prompt:**

Draw an original fine-ink and translucent-wash storybook illustration as editable native SVG, 1200×900 on warm ivory #f3eee2. A thoughtful bearded pirate astronomer in a weathered tricorn with a long feather, russet cutaway coat, gathered linen shirt, buckled belt, articulated trousers and tall indigo boots stands on a perspective wooden harbor dock. One hand steadies an unfolded star chart; the other bends at shoulder and elbow to lift a brass telescope toward a pale crescent moon. Give him an asymmetrical kind expression, sculpted cheeks, carefully drawn fingers and a believable center of gravity. Use custom cubic contours, flowing coat folds, tapering feather barbs, directional crosshatching, separate warm-lit and cool-shadow planes, fine brass highlights, and a clear silhouette. Compose a distant sailing ship, subdued sage sea, etched dock grain and coiled rope behind him; a small crab guards a compass in the foreground. One upper-left key light, restrained ochre/russet/sage accents, layered atmospheric depth, plenty of luminous negative space. Preserve named anatomical groups and telescope/chart props. Do not copy a photographed composition or embed raster art.

**Seven-second choreography:**

Exactly 7.000 s, continuous loop: 0–0.84 s settle and glance; 0.84–1.68 s telescope arm dips 5° in anticipation; 1.68–3.78 s lift and observe with a −5° shoulder pose; 3.78–5.04 s hold while head and chart follow subtly; 5.04–7.00 s return to the initial pose. The specific shoulder/arm/telescope group moves, with independently delayed head and chart-hand motion. All SMIL clocks are seven seconds.

[Static SVG](corpus/svg/105232.svg) · [Animated SVG](corpus/animated/105232.svg) · [MP4](exports/105232.mp4) · [Six-frame contact sheet](qa/105232-contact.png)


<a id="study-105233"></a>

### 105233 — The Lantern Keeper of Willow Marsh

**Reference:** 105233.jpg · **Category:** creature

**What the reference teaches:** A fantasy-illustration page combines long curling tentacles, dramatic thin-versus-heavy silhouettes, layered organic surfaces and a theatrical figure high above elaborate creatures. The new dragon uses the serpentine construction and etched surface rhythm, with an original gentle story.

**Reusable drawing prompt:**

Create an original sophisticated native SVG storybook plate, 1200×900, graphite/indigo #24343b on warm ivory #f3eee2, translucent sage, muted ochre and russet washes. A gentle marsh dragon with an elegantly coiled serpentine body, weighted belly, plated cross-contours, webbed hind feet, delicate sail-like wings, branching antlers, long curled whiskers and a narrow expressive muzzle carefully carries a seed lantern over lily water. Sculpt the anatomy from a strong line of action; the head, neck, shoulder, elbow and claw must connect convincingly. Draw bespoke cubic silhouettes and overlapping leaf-shaped scales, fine curved hatching, light-catching edges and distinct cool shadow planes. Its near wing opens with translucent ribs; its foreclaw supports a slender lantern handle. Surround it with atmospheric willow arches, layered reeds, elliptical lily pads, one pale flower, quiet reflections and only three tiny fireflies. Compose a single readable focal relationship between the eye and the warm lantern. Preserve separated, named head, wing, foreleg and hanging lantern groups. No traced source shapes, raster embeds or external assets.

**Seven-second choreography:**

Exactly 7.000 s, continuous loop: 0–0.84 s poised breath; 0.84–1.68 s foreleg lowers 3° and sails compress; 1.68–3.78 s lantern foreleg lifts −7°, near sail opens −12°, head bows 5°; 3.78–5.04 s warm presentation hold, lantern swings back with delayed follow-through; 5.04–7.00 s wing, head and claw recover continuously. Lantern and fireflies have seven-second subsidiary tracks with matching endpoints.

[Static SVG](corpus/svg/105233.svg) · [Animated SVG](corpus/animated/105233.svg) · [MP4](exports/105233.mp4) · [Six-frame contact sheet](qa/105233-contact.png)


<a id="study-105234"></a>

### 105234 — A Small Worm and a Borrowed Star

**Reference:** 105234.jpg · **Category:** worm

**What the reference teaches:** A fantastical worm drawing emphasizes broad compressed body masses, folded neck anatomy, strong cross-contour shading and curling horn silhouettes around a skull-like head. This original child-friendly scene keeps the weight, segmentation and curling silhouette while replacing the horror face with curiosity.

**Reusable drawing prompt:**

Draw an original richly observed native SVG woodland story illustration, 1200×900 with a warm ivory #f3eee2 paper ground and fine graphite-indigo #24343b contours. A large soft earthworm with a heavy segmented coil, compressed contact folds and a rising curved neck discovers one luminous firefly. Give the worm gently aged expressive eyelids, an asymmetrical smile, soft cheek planes, delicate freckles, two elaborately curled feelers and a leaf bonnet tied below its chin. Build the body from continuous custom cubic paths rather than stacked ellipses. Curve each cross-contour stripe around the local surface, tighten folds at compression and leave lit planes spacious. Use translucent ochre and warm clay shading, cool sage reflected light, subtle hatching and believable grounded shadows. Frame the exchange with russet mushrooms showing radial gills, deep fern fans, a hollow seed-shell home, overlapping pebbles, dew and atmospheric tree trunks. The firefly remains tiny and precious against luminous negative space. Separate the head and each feeler into named pivot groups for expressive motion. Original composition, no traced skull or copied creature, no raster art.

**Seven-second choreography:**

Exactly 7.000 s, continuous loop: 0–0.84 s curious pause; 0.84–1.68 s head inclines −3° while feelers coil inward; 1.68–3.78 s head tilts 6° toward the approaching firefly, the two feelers open with different amplitudes; 3.78–5.04 s gaze and smile hold while feelers settle later; 5.04–7.00 s firefly, head and feelers return along smooth closed tracks. The grounded body stays weight-bearing.

[Static SVG](corpus/svg/105234.svg) · [Animated SVG](corpus/animated/105234.svg) · [MP4](exports/105234.mp4) · [Six-frame contact sheet](qa/105234-contact.png)


<a id="study-105235"></a>

### 105235 — The Gardener Who Grew Another Morning

**Reference:** 105235.jpg · **Category:** zombie

**What the reference teaches:** The reference shows an expressive undead head with pronounced facial planes, irregular teeth, tousled hair, torn cloth, articulated fingers and a decorated mug. This original gently comic gardener carries over the expressive structure, sewn repairs and handled vessel, without exposed tissue or gore.

**Reusable drawing prompt:**

Create an original high-quality native SVG storybook plate, 1200×900 on ivory #f3eee2, with graphite-indigo #24343b linework and muted sage, rust and ochre washes. A kindly elderly zombie kneels in an old walled garden and carefully pours water from a bird-painted tea jug onto a small terracotta seedling. His dry skull-like face has asymmetrical living eyelids, a reassuring crooked smile, one missing tooth, sewn doll-like scars, tousled hair and a tiny daisy tucked behind his ear; no gore or exposed tissue. Draw angular cheek and neck anatomy with soft lit planes, believable elbows, slender articulated fingers wrapped around a real handle, weighted kneeling legs and worn boots. Give his patched sage jacket a russet apron, seamed pocket, repair stitches, frayed edges and specific curved cloth folds. Use hand-shaped cubic silhouettes, directional crosshatching, restrained gradients and grounded contact shadows. Compose atmospheric old masonry, a vine-covered trellis, receding garden path, cabbage, fork, trowel and a tiny earthworm helper. The lifted leaves are the emotional focal point. Separate head, upper arm, rotating forearm/jug, water and sapling into named native SVG groups; no raster assets, tracing or external dependencies.

**Seven-second choreography:**

Exactly 7.000 s, continuous loop: 0–0.84 s quiet attention; 0.84–1.68 s pouring forearm lifts back −4° in anticipation; 1.68–3.78 s forearm tips 12°, head bows kindly and the water fades in; 3.78–5.04 s pour hold, sapling responds with a delayed −3° lift and settling; 5.04–7.00 s water ceases and jug, head and leaves return smoothly to their starting poses. Native SMIL only; every duration is seven seconds.

[Static SVG](corpus/svg/105235.svg) · [Animated SVG](corpus/animated/105235.svg) · [MP4](exports/105235.mp4) · [Six-frame contact sheet](qa/105235-contact.png)
