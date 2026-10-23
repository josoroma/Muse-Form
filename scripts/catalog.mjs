import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ROOT } from './serve.mjs';
import { DURATION } from '../runtime/timing.mjs';

const previous = JSON.parse(await readFile(resolve(ROOT, 'archive/hairline-v3/corpus/manifest.json')));
const entries = [];
for (const file of await readdir(resolve(ROOT, 'corpus/hairline'))) {
  if (file.endsWith('.json')) entries.push(...JSON.parse(await readFile(resolve(ROOT, 'corpus/hairline', file))));
}
if (entries.length !== 24 || previous.studies.some(s => entries.filter(e => e.id === s.id).length !== 1)) throw new Error('Need exactly one entry for every corpus ID.');
const studies = [];
for (const old of previous.studies) {
  const entry = entries.find(e => e.id === old.id);
  const svg = `corpus/svg/${old.id}.svg`, animated = `corpus/animated/${old.id}.svg`;
  const source = await readFile(resolve(ROOT, svg), 'utf8');
  await readFile(resolve(ROOT, animated));
  if (!entry.prompt || !entry.motionCaption) throw new Error(`${old.id}: missing prompt or motion caption.`);
  studies.push({
    id: old.id, title: entry.title || old.title, category: entry.category || old.category,
    family: old.family, familyLabel: old.familyLabel, source: old.source,
    observation: entry.observation || old.observation, prompt: entry.prompt, method: entry.method,
    review: entry.review, motion: entry.motionCaption, motionCaption: entry.motionCaption,
    media: 'native-svg', svg, image: svg, poster: svg, animated, rig: animated,
    duration: DURATION, width: 1200, height: 900, viewBox: source.match(/viewBox="([^"]+)"/)?.[1],
    provenance: old.provenance,
  });
}
const manifest = { schemaVersion: 4, title: 'Five — Drawings in motion', edition: 'Native SVG motion · 4', duration: DURATION, media: 'native-svg', studies };
await writeFile(resolve(ROOT, 'corpus/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
const notes = value => Array.isArray(value) ? value.join(' ') : typeof value === 'object' ? JSON.stringify(value) : value || '';
const introduction = `# Five — Drawings in motion

**24 static SVGs and 24 animated SVGs. Every animation loops in exactly five seconds.**

The collection uses [Hairline-inspired](https://github.com/lucasmarkes/hairline) thin contours, a charcoal ground, quiet structural lines and one focal accent. The animated versions change the drawing itself: coordinated facial features, articulated fingers, joint motion, muscle contours and character gestures. Each entry below describes its actual action.

[Download all 48 SVGs](exports/storytelling-svgs.zip) · [Reusable skill bundle](exports/seven-second-storytelling.skill.zip)

![Static drawing corpus](qa/motion-five/corpus-contact.jpg)

## Open and play

~~~sh
npm ci
npm start
~~~

Open **http://127.0.0.1:4173**. Selecting a drawing starts its animation, except when reduced motion is enabled. Play/pause, restart and scrubbing cover 0–5 seconds; Space toggles playback and arrows step outside interactive controls. Playback pauses when the tab is hidden.

The static and animated SVGs are self-contained and open directly in a browser. Animated files autoplay and loop; use the static file for reduced-motion embeddings. Delivery consists of SVG files. Older MP4s are preserved only in the archived editions.

## Drawing and movement

Native paths and vector primitives carry the artwork. There are no embedded paintings, raster filters, gradients or textures. The faces and stories use authored curves; anatomy starts from curated internal construction contours with authored repairs and motion poses. Metadata records the actual method.

Each five-second loop has readable preparation, action and recovery. Eyelids, brows, cheeks and mouths act together; fingers bend around their bases and joints; muscle contours respond to flexion or stretching; character props remain attached to their hands. Motion is built from matching-topology path poses and semantic transforms, with supporting contacts preserved. These are illustrative 2D anatomical gestures, not medically validated simulations.

Hairline informs contour hierarchy, focal restraint, occlusion and clear resting poses. Organic subjects retain their observed viewpoints. [Research notes](skills/seven-second-storytelling/references/sources.md) distinguish these choices from Hairline's isometric engine.

## Prompts, source and review

Every entry contains its drawing prompt, source observation, construction method, motion description and asset links. Supplied book photographs remain in Downloads; the distributed corpus contains original interpretations and their source IDs. [The manifest](corpus/manifest.json) preserves provenance.

Canonical inputs are corpus/svg/*.svg and corpus/hairline/*.json. The vector-*.py generators preserve geometry and pose authoring. The anatomy generator uses archived internal construction plates and Python with OpenCV, NumPy and SciPy; the face/story generators use Python's standard library. Existing SVGs need only a browser to play.

~~~sh
npm run compose       # insert authored five-second native SMIL tracks
npm run catalog       # rebuild README, manifest and skill index
npm run check         # structure, movement measurements and pose sheets
npm run playback      # sample actual automatic SVG playback across the loop
npm run verify        # playback, scrubbing, downloads and responsive gallery
npm run install-skill # update the local reusable skill
npm run bundle        # package 48 SVGs and the portable skill
~~~

QA uses Node.js 22+, pinned Playwright Core and local Chrome/Chromium; set CHROME_PATH when needed. Bundling uses Python 3. No video encoder is required. Checks measure source loop closure, repeatable seeking and substantial changes to visible geometry. Visual review checks expression, finger topology, joint attachment, occlusion and the strongest poses. Measurements support this review; they do not certify artistic quality.

Evidence: [SVG and motion checks](qa/motion-five/svg-checks.json), [automatic playback samples](qa/motion-five/playback.json), [gallery verification](qa/motion-five/verification.json), [per-drawing art review](qa/motion-five/art-review.json), and individual pose sheets below.

## Reusable skill

[Read the skill](skills/seven-second-storytelling/SKILL.md). Its existing identifier, $seven-second-storytelling, is retained for compatibility; its current default is **five seconds and SVG-only delivery**. The bundle includes all 48 SVGs, full prompts, provenance and review records. Installation updates ~/.codex/skills/seven-second-storytelling, or CODEX_HOME/skills when configured.

> Use $seven-second-storytelling to create a native SVG hand that clearly opens and curls its fingers over five seconds. Preserve believable joints and Hairline-inspired contours. Deliver static and animated SVGs, inspect the motion extremes, and record the prompt and links.

Prior editions remain in [archive/hairline-v3](archive/hairline-v3), [archive/raster-v2](archive/raster-v2) and [archive/vector-v1](archive/vector-v1).

## Corpus

| Reference | Study | Static SVG | Animated SVG |
| --- | --- | --- | --- |
${studies.map(s => `| ${s.source} | [${s.title}](#study-${s.id}) | [Drawing](${s.svg}) | [Five seconds](${s.animated}) |`).join('\n')}

## Full drawing prompts and actions
`;
const body = studies.map(s => `
<a id="study-${s.id}"></a>

### ${s.id} — ${s.title}

**Reference:** ${s.source} · **Category:** ${s.category}

**Reference observation:** ${s.observation}

**SVG drawing prompt:**

${s.prompt}

**Construction method:** ${notes(s.method)}

**Five-second action:** ${s.motionCaption}

**Author review:** ${notes(s.review?.notes || s.review)}

[Static SVG](${s.svg}) · [Animated SVG](${s.animated}) · [Pose sheet](qa/motion-five/${s.id}-contact.png) · [Playback samples](qa/motion-five/${s.id}-playback.png)
`).join('');
await writeFile(resolve(ROOT, 'README.md'), introduction + body);
await writeFile(resolve(ROOT, 'skills/seven-second-storytelling/references/corpus-index.md'), `# Five-second native SVG corpus

24 drawings with visible five-second actions. [Full prompts and provenance](../assets/corpus/manifest.json). Open the drawing and inspect the animated geometry before reuse.

| ID | Study | Still | Motion |
| --- | --- | --- | --- |
${studies.map(s => `| ${s.id} | ${s.title} | [SVG](../assets/corpus/svg/${s.id}.svg) | [Five-second SVG](../assets/corpus/animated/${s.id}.svg) |`).join('\n')}

[Visual review](../assets/quality/art-review.json) records inspected poses, repairs and limitations. These are illustrative 2D gestures, not medically validated simulations.
`);
console.log(`Cataloged ${studies.length} static SVGs and five-second animations.`);
