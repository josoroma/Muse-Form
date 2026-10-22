import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {ROOT} from './serve.mjs';
const original=JSON.parse(await readFile(resolve(ROOT,'archive/vector-v1/corpus/manifest.json')));
const art=[];for(const name of await readdir(resolve(ROOT,'corpus/realism')))if(name.endsWith('.json'))art.push(...JSON.parse(await readFile(resolve(ROOT,'corpus/realism',name))));
if(art.length!==24||original.studies.some(s=>art.filter(a=>a.id===s.id).length!==1))throw new Error('Exactly one reviewed plate is required for each of the 24 source IDs.');
const captions={
105193:'Soft light reveals the planes of the skull, then gently settles.',105194:'Light moves quietly across the eye and its surrounding forms.',105195:'A slow change in light reveals the folds of the ear.',
105196:'A warm smile holds as a quiet breath lifts the shoulders.',105197:'A lowered gaze holds through a slow, thoughtful breath.',105198:'The tense expression holds with a small breath and a barely perceptible shift.',105199:'A fearful glance holds while the shoulders take a quiet breath.',105200:'A moment of astonishment, held with a small breath.',105202:'The laughing profile settles through a gentle breath.',105203:'A knowing wink holds as the head and shoulders move almost imperceptibly.',
105214:'A quiet inhalation lifts the ribcage and releases.',105215:'The flexed arm gathers a small tension, then settles.',105216:'The open fingers relax slightly while the palm stays steady.',105217:'A subtle tension passes through the back of the hand.',105218:'The calf gathers and releases tension over a planted foot.',105219:'A small calf contraction settles into the heel.',105220:'The bent leg settles through a quiet change of tension.',105221:'The toes relax while the foot keeps its weight on the ground.',105222:'A faint change of tendon tension crosses the top of the foot.',105223:'The ankle settles gently over the grounded heel and forefoot.',
105232:'A harbor breeze stirs the captain’s feather and coat while warm light trembles on the water.',105233:'The marsh keeper breathes quietly beside the lantern’s warm glow.',105234:'The small creature leans toward the firefly; its feelers answer the light.',105235:'The gardener holds a careful pour while a breeze touches the sapling and his hair.'};
const studies=[];
for(const old of original.studies){
 const a=art.find(a=>a.id===old.id),{svg,animated,poster,prompt,motion,...base}=old;
 const image=await readFile(resolve(ROOT,a.image));
 const s={...base,...a,media:'illustrated-cinemagraph',motionCaption:captions[a.id],duration:7,width:1200,height:900,fps:30,image:a.image,poster:a.image,animated:`corpus/animated/${a.id}.html`,rig:`corpus/animated/${a.id}.json`,video:`exports/${a.id}.mp4`,sourceWidth:image.readUInt32BE(16),sourceHeight:image.readUInt32BE(20),provenance:{...old.provenance,relationship:'Original generated graphite or painted interpretation informed by the supplied reference. Not a tracing or a native vector.'}};
 await readFile(resolve(ROOT,s.animated));await readFile(resolve(ROOT,s.rig));studies.push(s);
}
const manifest={schemaVersion:2,title:'Seven — The moving atelier',edition:'Realistic illustration · 2',duration:7,fps:30,frameCount:210,viewBox:[0,0,1200,900],media:'illustrated-cinemagraph',studies};
await writeFile(resolve(ROOT,'corpus/manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const intro=`# Seven — The moving atelier

24 realistic drawing and story studies, each with a high-resolution PNG, a restrained seven-second cinemagraph, an editable motion rig, a silent MP4, and its complete reusable prompt. This edition replaces the earlier flat SVG artwork with graphite anatomy/portrait plates and painted fantasy scenes.

![The realistic illustration corpus](qa/realism/plates-contact.jpg)

## Open the collection

\`\`\`sh
npm ci
npm start
\`\`\`

Open **http://127.0.0.1:4173**. Choose a plate, press Play, or scrub the timeline. Space plays/pauses; arrow keys step a frame outside interactive controls. Playback starts paused, honors reduced motion, and pauses when hidden. Individual HTML scenes also need the local server. PNGs and MP4s open directly.

## Medium and motion

The new masters are **1448 × 1086 raster illustrations**, generated with the built-in image generation tool and visually reviewed. Continuous halftones, coherent lighting, believable proportions, clean edges and perspective carry the realism. The fantasy scenes use painterly color and atmospheric depth.

Animation uses small authored WebGL mesh regions, fixed contact areas and selective light changes. These are **cinemagraphs of held poses**: breaths, tiny changes of intention, cloth/foliage response and light. They are not fully articulated performances or expression transformations. Rigid anatomy and props stay constrained; there is no whole-picture camera sway. SVG remains an option for future drawings where its geometry serves the art, but these paintings are not mislabeled as editable vectors.

All films are **7.000 seconds · 1200 × 900 · 30 fps · H.264 · 210 frames · silent**. The source artwork and JSON motion rig remain separate and reusable. Source photographs stay in Downloads and are not bundled. The studies are original interpretations, not traced book pages; the anatomy has not been medically validated.

## Review and reproducibility

Each illustration was inspected for anatomy, focal hierarchy, light and material, clean contours, cropping and source relevance. Corrections include portrait margins, natural arm musculature, a distinct dorsal foot view and telescope/eye alignment. Each metadata entry records the actual prompt, subjective scores and concrete review notes. Scores are judgments, not a quality certificate.

The six-pose sheets, source frame comparisons, loop/seek checks and encoded film results live in [qa/realism](qa/realism). [Individual art review](qa/realism/art-review.json), [animation checks](qa/realism/check-results.json) and [film verification](qa/realism/verification.json) distinguish visual judgment from technical checks. The first edition is preserved in [archive/vector-v1](archive/vector-v1) and is not used by the gallery.

\`\`\`sh
npm run compose                 # build HTML scenes and editable rigs from reviewed metadata
npm run catalog                 # rebuild this prompt catalog and manifest
npm run check                   # rendered poses, deterministic seeks and exact loop closure
npm run render                  # all 24 films
npm run render -- 105232 105234  # selected films
npm run verify                  # encoded frames, duration and gallery controls
npm run install-skill           # refresh portable corpus and installed skill
\`\`\`

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
${studies.map(s=>`| ${s.source} | [${s.title}](#study-${s.id}) | [PNG](${s.image}) | [Play](${s.animated}) | [JSON](${s.rig}) | [MP4](${s.video}) |`).join('\n')}

## Complete prompts and individual review
`;
const notes=v=>Array.isArray(v)?v.join(' '):v;
const entries=studies.map(s=>`\n<a id="study-${s.id}"></a>\n\n### ${s.id} — ${s.title}\n\n**Reference:** ${s.source} · **Category:** ${s.category}\n\n**Reference observation:** ${s.observation}\n\n**Generation prompt:**\n\n${s.prompt}\n${s.editPrompt?`\n**Corrective edit prompt:**\n\n${s.editPrompt}\n`:''}${s.revisionPrompt?`\n**Revision prompt:**\n\n${s.revisionPrompt}\n`:''}${s.refinementPrompt?`\n**Refinement prompt:**\n\n${s.refinementPrompt}\n`:''}${s.revisionPrompts?.length?`\n**Corrective prompts:**\n\n${s.revisionPrompts.map((p,i)=>`${i+1}. ${typeof p==='string'?p:JSON.stringify(p)}`).join('\n\n')}\n`:''}\n**Motion direction:** ${notes(s.motion)}\n\n**Individual review:** ${notes(s.review.notes)}\n\n**Subjective still scores (1–5):** anatomy ${s.review.anatomy}; lighting ${s.review.lighting}; cleanliness ${s.review.cleanliness}; composition ${s.review.composition}.\n\n[Master PNG](${s.image}) · [Seven-second scene](${s.animated}) · [Editable rig](${s.rig}) · [MP4](${s.video}) · [Motion sheet](qa/realism/${s.id}-motion.jpg)\n`).join('');
await writeFile(resolve(ROOT,'README.md'),intro+entries);
await mkdir(resolve(ROOT,'skills/seven-second-storytelling/references'),{recursive:true});
await writeFile(resolve(ROOT,'skills/seven-second-storytelling/references/corpus-index.md'),`# Realistic seed corpus\n\n24 original illustrated studies. Complete prompts, reviews, source hashes and motion are in [the manifest](../assets/corpus/manifest.json). These are raster paintings with separate editable motion rigs, not native SVG. Source photos are not redistributed. Open the relevant PNG, then inspect its rig and rendered extremes.\n\n| ID | Subject | Master | Motion |\n| --- | --- | --- | --- |\n${studies.map(s=>`| ${s.id} | ${s.title} | [PNG](../assets/corpus/plates/${s.id}.png) | [HTML](../assets/corpus/animated/${s.id}.html) / [JSON](../assets/corpus/animated/${s.id}.json) |`).join('\n')}\n\nUse these as craft references, not a template to paste onto every new subject. Portraits deliberately have distinct identities. Anatomy is artistic rather than medically validated. The HTML scenes need a local HTTP server rooted at the skill assets folder (or above it); each scene uses the bundled runtime.\n`);
console.log(`Cataloged ${studies.length} realistic illustrations.`);
