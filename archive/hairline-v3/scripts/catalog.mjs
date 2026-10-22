import{readFile,writeFile,readdir,mkdir}from'node:fs/promises';import{resolve}from'node:path';import{ROOT}from'./serve.mjs';
const prior=JSON.parse(await readFile(resolve(ROOT,'archive/raster-v2/corpus/manifest.json'))),entries=[];
for(const f of await readdir(resolve(ROOT,'corpus/hairline')))if(f.endsWith('.json'))entries.push(...JSON.parse(await readFile(resolve(ROOT,'corpus/hairline',f))));
if(entries.length!==24||prior.studies.some(s=>entries.filter(e=>String(e.id)===s.id).length!==1))throw new Error('Need one vector entry for each of the 24 source IDs.');
const studies=[];
for(const old of prior.studies){const e=entries.find(e=>String(e.id)===old.id);const s={id:old.id,title:e.title||old.title,category:e.category||old.category,family:old.family,familyLabel:old.familyLabel,source:old.source,observation:e.observation||old.observation,prompt:e.prompt,method:e.method||'Authored native SVG contour drawing',review:e.review,motion:e.motion||e.motionCaption||old.motionCaption,motionCaption:e.motionCaption||e.motion||old.motionCaption,media:'native-svg',svg:`corpus/svg/${old.id}.svg`,image:`corpus/svg/${old.id}.svg`,poster:`corpus/svg/${old.id}.svg`,animated:`corpus/animated/${old.id}.svg`,rig:`corpus/animated/${old.id}.svg`,video:`exports/${old.id}.mp4`,duration:7,width:1200,height:900,fps:30,provenance:{...old.provenance,relationship:'Native SVG line interpretation; approved internal artwork supplies construction references. Source photographs are not redistributed.'}};
for(const k of ['svg','animated'])await readFile(resolve(ROOT,s[k]));if(!s.prompt)throw new Error(`${s.id}: missing art prompt`);studies.push(s);}
const manifest={schemaVersion:3,title:'Seven — Contours in motion',edition:'Hairline-inspired native vector · 3',duration:7,fps:30,frameCount:210,viewBox:[0,0,1200,900],media:'native-svg',studies};await writeFile(resolve(ROOT,'corpus/manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const intro=`# Seven — Contours in motion

24 native SVG drawings and seven-second loops, returning to the spare line language of [Hairline](https://github.com/lucasmarkes/hairline). The collection keeps anatomical construction from the approved realism studies and replaces painted surfaces with deliberate contours, quiet interior marks, clean negative space and a single bright focal detail.

![Native line corpus](qa/hairline/corpus-contact.jpg)

## Open the collection

\`\`\`sh
npm ci
npm start
\`\`\`

Open **http://127.0.0.1:4173**. Choose a study, play or scrub its seven seconds. Space plays/pauses; arrows step a frame outside interactive controls. The gallery starts paused and pauses when hidden. Static and animated SVGs also open directly from disk; standalone animated SVGs loop automatically, so use the static variant when embedding with reduced motion.

## Drawing and animation

Every delivered drawing is actual SVG geometry: paths and simple vector primitives, with no embedded bitmap, raster filter, gradient or grain. The graphite/painted edition remains in [archive/raster-v2](archive/raster-v2); the first vector edition remains in [archive/vector-v1](archive/vector-v1). The gallery uses the new vector files.

The anatomy studies use selectively reconstructed contours from our own approved drawings, with authored repairs. The faces are hand-authored structural curves. The four stories are newly composed from sparse native paths. Each entry below identifies its actual method. These are intentionally reduced line illustrations, not photorealistic paintings or full 3D models. SVG provides the needed contour control and portability, so Three.js is not required.

The adopted Hairline ideas are monochrome stroke hierarchy, a composed resting pose, restrained reach, clear occlusion, one focal accent and no labels inside the art. Organic anatomy keeps its observed viewpoint; this is a **Hairline-inspired adaptation**, not a claim of using its isometric engine or obeying every upstream machine-figure rule. [Source notes](skills/seven-second-storytelling/references/sources.md) record the distinction.

Native SMIL animates selected groups or matching path geometry over seven seconds. The action remains small: a gesture, tension/release, a response to a firefly, a moving feather or an accent traveling through a held study. Rigid props and supporting contacts stay anchored. The loops do not imply complete walks, turns, or facial-expression transitions.

All MP4s are **7.000 seconds · 1200 × 900 · 30 fps · H.264 · 210 frames · silent**. Encoded frames cover [0,7); the matching endpoint at seven seconds is tested separately. Supplied book photographs remain in Downloads and are not bundled. These are artistic anatomy studies, not a medically validated atlas.

## Prompts, review and reproduction

The editable catalog inputs are corpus/hairline/*.json. Each study has a full SVG art brief, method, review notes and source ID. Generator files in scripts/vector-*.py preserve geometry authoring where used. The anatomy generator reads archived internal plates and requires Python with opencv-python 5.0.0, numpy 2.5.4 and scipy 1.18.1; the face and story generators use the Python standard library. Rendering existing SVGs does not need Python. The original source filename and hash remain in [the manifest](corpus/manifest.json).

\`\`\`sh
npm run compose                 # add seven-second SVG tracks to final vector drawings
npm run catalog                 # rebuild manifest, README prompts and skill index
npm run check                   # inspect SVG structure; render poses and contact sheets
npm run render                  # export all 24 MP4s
npm run render -- 105232 105234  # selected films
npm run verify                  # gallery and encoded-frame checks
npm run install-skill           # refresh local and installed skill assets
\`\`\`

Rendering needs Node.js 22+, local Chrome/Chromium and FFmpeg/ffprobe. Set CHROME_PATH for a nonstandard browser. Playwright Core is pinned; the SVGs and gallery need no CDN or runtime library. Numeric checks establish format, seek consistency and endpoint agreement; they do not certify artistic quality. Individual contours and motion extremes are visually inspected and corrected before acceptance. Evidence is in [SVG checks](qa/hairline/svg-checks.json), [film verification](qa/hairline/verification.json), [art review](qa/hairline/art-review.json), and the per-study contact sheets below.

## Reusable skill

[Read the skill](skills/seven-second-storytelling/SKILL.md) or download the [portable skill bundle](exports/seven-second-storytelling.skill.zip). It contains all 24 static SVGs and all 24 animated SVGs, the prompt manifest, quality records and local render helpers. Installation updates ~/.codex/skills/seven-second-storytelling, or CODEX_HOME/skills when configured.

> Use $seven-second-storytelling to draw a believable pirate and a curious worm in native SVG. Use Hairline-inspired sparse contours and one focal accent, keep the forms and contacts coherent, animate a seven-second response, and include full prompts and asset links.

## Corpus index

| Reference | Study | Static SVG | Animated SVG | MP4 |
| --- | --- | --- | --- | --- |
${studies.map(s=>`| ${s.source} | [${s.title}](#study-${s.id}) | [Drawing](${s.svg}) | [Seven seconds](${s.animated}) | [Film](${s.video}) |`).join('\n')}

## Full SVG prompts and review notes
`;
const notes=v=>Array.isArray(v)?v.map(n=>typeof n==='string'?n:JSON.stringify(n)).join(' '):typeof v==='object'?JSON.stringify(v):v;
const entriesText=studies.map(s=>`\n<a id="study-${s.id}"></a>\n\n### ${s.id} — ${s.title}\n\n**Reference:** ${s.source} · **Category:** ${s.category}\n\n**Reference observation:** ${s.observation}\n\n**SVG drawing prompt:**\n\n${s.prompt}\n\n**Construction method:** ${notes(s.method)}\n\n**Seven-second movement:** ${notes(s.motion)}\n\n**Review:** ${notes(s.review?.notes||s.review)}\n\n[Static SVG](${s.svg}) · [Animated SVG](${s.animated}) · [MP4](${s.video}) · [Six-pose sheet](qa/hairline/${s.id}-contact.png)\n`).join('');await writeFile(resolve(ROOT,'README.md'),intro+entriesText);
await mkdir(resolve(ROOT,'skills/seven-second-storytelling/references'),{recursive:true});await writeFile(resolve(ROOT,'skills/seven-second-storytelling/references/corpus-index.md'),`# Native vector seed corpus\n\n24 Hairline-inspired SVG studies. [Complete prompts and provenance](../assets/corpus/manifest.json). Every drawing uses native paths; sources are not bundled. Read only the relevant entries and inspect their drawing and extreme pose.\n\n| ID | Study | Still | Motion |\n| --- | --- | --- | --- |\n${studies.map(s=>`| ${s.id} | ${s.title} | [SVG](../assets/corpus/svg/${s.id}.svg) | [Animated SVG](../assets/corpus/animated/${s.id}.svg) |`).join('\n')}\n\nThese are minimal contour interpretations, not photorealistic or medically validated plates. The animation remains deliberately bounded. [Visual review](../assets/quality/art-review.json) records the inspected evidence and limits.\n`);console.log(`Cataloged ${studies.length} native line studies.`);
