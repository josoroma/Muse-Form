import{readFile,writeFile,mkdir,cp,access,rm}from'node:fs/promises';import{resolve,join}from'node:path';import{homedir}from'node:os';import{ROOT}from'./serve.mjs';
const name='seven-second-storytelling',source=resolve(ROOT,'skills',name),target=resolve(process.env.CODEX_HOME||join(homedir(),'.codex'),'skills',name);
let exists=false;try{await access(target);exists=true;}catch{}
if(exists){let marker;try{marker=JSON.parse(await readFile(resolve(target,'.storytelling-install.json')));}catch{}if(marker?.source!==source)throw new Error(`Unrelated skill at ${target}; refusing to overwrite.`);}
for(const folder of [source,...(exists?[target]:[])]){for(const old of ['assets/corpus/svg','assets/corpus/animated','assets/corpus/plates','assets/runtime','scripts/render-cinemagraph.mjs'])await rm(resolve(folder,old),{recursive:true,force:true});}
const corpus=resolve(source,'assets/corpus');await mkdir(corpus,{recursive:true});
for(const folder of ['svg','animated'])await cp(resolve(ROOT,'corpus',folder),resolve(corpus,folder),{recursive:true,filter:p=>!p.endsWith('.html')&&!p.endsWith('.json')});
const manifest=JSON.parse(await readFile(resolve(ROOT,'corpus/manifest.json')));
for(const s of manifest.studies){s.svg=`svg/${s.id}.svg`;s.image=s.svg;s.poster=s.svg;s.animated=`animated/${s.id}.svg`;s.rig=s.animated;delete s.video;}
await writeFile(resolve(corpus,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');await mkdir(resolve(source,'assets/quality'),{recursive:true});
for(const file of ['art-review.json','svg-checks.json','playback.json','verification.json'])await cp(resolve(ROOT,'qa/motion-five',file),resolve(source,'assets/quality',file));
await rm(resolve(source,'assets/quality/check-results.json'),{force:true});await rm(resolve(target,'assets/quality/check-results.json'),{force:true});
for(const edition of ['three','expressions']){await rm(resolve(source,'assets',edition),{recursive:true,force:true});await cp(resolve(ROOT,edition),resolve(source,'assets',edition),{recursive:true});}
await mkdir(resolve(source,'assets/scripts'),{recursive:true});
await cp(resolve(ROOT,'scripts/build-character-expressions.py'),resolve(source,'assets/scripts/build-character-expressions.py'));
await mkdir(resolve(source,'assets/quality/three'),{recursive:true});
for(const file of ['checks.json','playback.json','art-review.json','hand-peak.png','foot-peak.png'])await cp(resolve(ROOT,'qa/three',file),resolve(source,'assets/quality/three',file));
await mkdir(resolve(source,'assets/quality/character'),{recursive:true});
await cp(resolve(ROOT,'qa/character/cross-view.json'),resolve(source,'assets/quality/character/cross-view.json'));
await cp(resolve(ROOT,'qa/character/materials/review.json'),resolve(source,'assets/quality/character/materials-review.json'));
await cp(resolve(ROOT,'qa/character/subdivision/asset-checks.json'),resolve(source,'assets/quality/character/hair-subdivision.json'));
await cp(resolve(ROOT,'qa/character/face-refinement/review.json'),resolve(source,'assets/quality/character/face-refinement.json'));
await cp(resolve(ROOT,'qa/character/dental-refinement/review.json'),resolve(source,'assets/quality/character/dental-refinement.json'));
await mkdir(resolve(source,'assets/quality/expressions'),{recursive:true});
for(const file of ['checks.json','playback.json','art-review.json','laughter-front-peak.png','surprise-side-peak.png'])await cp(resolve(ROOT,'qa/expressions',file),resolve(source,'assets/quality/expressions',file));
const escapeHTML=text=>String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
await writeFile(resolve(source,'assets/index.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The moving sketchbook — reusable corpus</title><link rel="icon" href="data:,"><style>body{margin:0;padding:clamp(20px,5vw,72px);background:#101014;color:#ddd;font:16px/1.6 system-ui}h1{font:42px Georgia}a{color:#a8e0d8}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:24px}article{border:1px solid #35353a;border-radius:12px;padding:16px}img{width:100%;aspect-ratio:4/3;object-fit:contain}h2{font:22px Georgia}details{margin-top:14px}header{margin-bottom:32px}</style><header><h1>The moving sketchbook</h1><p>24 static drawings and five-second native SVG animations.</p><a href="three/">Explore the five Three.js anatomy studies ↗</a> · <a href="expressions/">MUSE / Facial expressions ↗</a> · <a href="../SKILL.md">Reusable skill</a></header><main>${manifest.studies.map(s=>`<article><img src="corpus/${s.svg}" alt="${escapeHTML(s.title)}" loading="lazy"><h2>${escapeHTML(s.title)}</h2><a href="corpus/${s.svg}">Static SVG</a> · <a href="corpus/${s.animated}">Animated SVG</a><details><summary>Drawing prompt</summary><p>${escapeHTML(s.prompt)}</p></details></article>`).join('')}</main></html>`);
for(const edition of ['three','expressions']){
 let portableReadme=await readFile(resolve(source,'assets',edition,'README.md'),'utf8');
 portableReadme=portableReadme.replace(/ · \[Portable source bundle\]\([^)]+\)/,'').replaceAll('../qa/three/','../quality/three/').replaceAll('../qa/expressions/','../quality/expressions/');
 portableReadme=portableReadme.replace(/\[archive\/procedural-v3\]\([^)]+\)/g,'the source repository’s archive/procedural-v3 directory');
 portableReadme=portableReadme.replace(/## Run locally[\s\S]*?## Inspect the movement/,`## Run locally\n\nFrom this skill’s assets/ directory, run \`python3 -m http.server 4173 --bind 127.0.0.1\` and open http://127.0.0.1:4173/${edition}/. Keep the entire assets/ folder together: the portrait and anatomy views share local modules, and the SVG corpus remains linked.\n\n## Inspect the movement`);
 portableReadme=portableReadme.replace(/(?:Repository maintenance commands[^\n]*\n\n)?~~~sh\nnpm run catalog:[\s\S]*?~~~\n\n/,'The catalog and browser-check commands belong to the source repository. This portable skill includes editable model modules, complete prompts, the local engine and review records.\n\n');
 await writeFile(resolve(source,'assets',edition,'README.md'),portableReadme);
}
await mkdir(target,{recursive:true});await cp(source,target,{recursive:true,filter:p=>!p.includes('__pycache__')});await writeFile(resolve(target,'.storytelling-install.json'),JSON.stringify({source,name,edition:9,corpusCount:24,threeStudies:5,expressions:8},null,2)+'\n');console.log(`Installed 24 SVG pairs and five anatomy studies and eight facial expressions at ${target}`);
