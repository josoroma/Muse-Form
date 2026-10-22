import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { createHash } from 'node:crypto';
import { ROOT } from './serve.mjs';

const files = (await readdir(resolve(ROOT, 'corpus/metadata'))).filter(f => f.endsWith('.json'));
let studies = [];
for (const file of files) studies.push(...JSON.parse(await readFile(resolve(ROOT, 'corpus/metadata', file))));
const expected = ['105193','105194','105195','105196','105197','105198','105199','105200','105202','105203','105214','105215','105216','105217','105218','105219','105220','105221','105222','105223','105232','105233','105234','105235'];
studies = studies.map(study => ({ ...study, id: String(study.id) })).sort((a,b) => a.id.localeCompare(b.id));
if (studies.length !== 24 || expected.some(id => studies.filter(s => s.id === id).length !== 1)) throw new Error('The catalog requires exactly one entry for every one of the 24 source references.');
let previous;
try { previous = JSON.parse(await readFile(resolve(ROOT, 'corpus/manifest.json'))); } catch {}
for (const study of studies) {
  for (const key of ['title','category','source','observation','prompt','motion','svg','animated']) if (!study[key]) throw new Error(`${study.id}: missing ${key}`);
  await readFile(resolve(ROOT, study.svg)); await readFile(resolve(ROOT, study.animated));
  study.family = Number(study.id) >= 105232 ? 'story' : Number(study.id) >= 105214 ? 'anatomy' : 'face';
  study.familyLabel = { story: 'LITTLE STORIES', anatomy: 'BODY & MOVEMENT', face: 'FACES & EXPRESSIONS' }[study.family];
  study.duration = 7; study.width = 1200; study.height = 900; study.fps = 30;
  study.video = `exports/${study.id}.mp4`; study.poster = `corpus/posters/${study.id}.png`;
  try {
    const source = await readFile(resolve(homedir(), 'Downloads', study.source));
    study.provenance = { sourceFilename: study.source, sha256: createHash('sha256').update(source).digest('hex'), sourceBytes: source.length, relationship: 'Original vector interpretation of the supplied drawing reference; not a traced reproduction.', sourceIncluded: false };
  } catch { study.provenance = previous?.studies.find(s => s.id === study.id)?.provenance || { sourceFilename: study.source, sourceIncluded: false }; }
}
const manifest = { schemaVersion: 1, title: 'Seven — The moving sketchbook', duration: 7, fps: 30, frameCount: 210, viewBox: [0,0,1200,900], media: 'native-svg', studies };
await writeFile(resolve(ROOT, 'corpus/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
const motionText = motion => typeof motion === 'string' ? motion : motion.map(b => typeof b === 'string' ? b : `${b.time}: ${b.action}`).join('\n');
const introduction = `# Seven — The moving sketchbook

24 original SVG drawing studies, each with a seven-second animation, a silent MP4, and a reusable art prompt. The collection draws on the 24 supplied photographs of anatomy and fantasy illustration. It includes a Codex skill for developing new drawings, character acting, and short illustrated stories.

![The original SVG corpus](qa/corpus-contact.jpg)

## Open the sketchbook

Run these commands from this directory:

\`\`\`sh
npm ci
npm start
\`\`\`

Open **http://127.0.0.1:4173**. Choose a drawing, press Play, scrub the seven-second timeline, or download a still SVG, animated SVG, or MP4. Space plays/pauses; left/right arrows step by one frame when focus is outside an interactive control. The gallery starts paused, honors reduced motion, and pauses when hidden. It needs a local server because it reads the corpus manifest. Individual SVGs open directly from disk.

The visual language combines warm paper, graphite/indigo contours, restrained colored washes, shadow planes, and selective hatching. These are **original interpretations**, not scanned pages, automatic tracings, or raster images wrapped in SVG. The supplied books' artists and publications have not been established; reference photographs remain in your Downloads folder and are not redistributed here. The anatomy studies are artistic references, not medically validated teaching plates.

## Use the skill

The source is [skills/seven-second-storytelling/SKILL.md](skills/seven-second-storytelling/SKILL.md). It includes drawing guidance, anatomical landmarks, facial acting, child-friendly fantasy storytelling, seven-second timing, render helpers, and this complete SVG corpus.

The [portable skill bundle](exports/seven-second-storytelling.skill.zip) includes the skill and all 48 static/animated SVG files. The films remain separately available in the corpus index below.

\`\`\`sh
npm run install-skill
\`\`\`

This packages the corpus and installs the skill into \$CODEX_HOME/skills/seven-second-storytelling, or ~/.codex/skills/seven-second-storytelling when CODEX_HOME is unset. Start a new Codex conversation if the skill list has not refreshed. Example:

> Use $seven-second-storytelling to draw a curious pirate offering a star to a small worm. Study the attached anatomy references, make an expressive original SVG, animate a seven-second story, and export the MP4. Include the art prompt and file links in the README.

## Reproduce and check

Local rendering requires Node.js 22+, Chrome/Chromium, and FFmpeg/ffprobe. The only npm dependency is the pinned development dependency playwright-core; the gallery and SVGs have no runtime library or CDN dependency. Set CHROME_PATH if the browser is not in a standard location.

\`\`\`sh
npm run catalog                 # rebuild manifest and this prompt catalog
npm run check                   # SVG checks + rendered contact sheets
npm run render                  # all 24 films, 210 frames each
npm run render -- 105232 105234  # selected films
npm run verify                  # gallery controls + encoded video checks
\`\`\`

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
${studies.map(s => `| ${s.source} | [${s.title}](#study-${s.id}) | [SVG](${s.svg}) | [Animation](${s.animated}) | [Film](${s.video}) |`).join('\n')}

## Full prompts and motion notes
`;
const entries = studies.map(s => `
<a id="study-${s.id}"></a>

### ${s.id} — ${s.title}

**Reference:** ${s.source} · **Category:** ${s.category}

**What the reference teaches:** ${s.observation}

**Reusable drawing prompt:**

${s.prompt}

**Seven-second choreography:**

${motionText(s.motion)}

[Static SVG](${s.svg}) · [Animated SVG](${s.animated}) · [MP4](${s.video}) · [Six-frame contact sheet](qa/${s.id}-contact.png)
`).join('\n');
await writeFile(resolve(ROOT, 'README.md'), introduction + entries);
await mkdir(resolve(ROOT, 'skills/seven-second-storytelling/references'), { recursive: true });
await writeFile(resolve(ROOT, 'skills/seven-second-storytelling/references/corpus-index.md'), `# Seed corpus\n\n24 original interpretations of the supplied anatomy and fantasy drawing references. Full observations, prompts, motion, and source hashes are in [the manifest](../assets/corpus/manifest.json). Local source photos are not included.\n\n| ID | Subject | Still | Motion |\n| --- | --- | --- | --- |\n${studies.map(s => `| ${s.id} | ${s.title} | [SVG](../assets/corpus/svg/${s.id}.svg) | [Animated SVG](../assets/corpus/animated/${s.id}.svg) |`).join('\n')}\n\nChoose a relevant example; do not load all drawings for every request. Read it as a construction and staging reference, not an immutable template. The same face proportions across expression studies support comparison; new characters should receive their own anatomy and identity.\n`);
console.log(`Cataloged ${studies.length} drawings; wrote manifest, README prompts, and skill corpus index.`);
