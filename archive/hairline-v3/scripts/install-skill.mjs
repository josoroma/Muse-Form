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
for(const file of ['art-review.json','svg-checks.json','verification.json'])await cp(resolve(ROOT,'qa/hairline',file),resolve(source,'assets/quality',file));
await rm(resolve(source,'assets/quality/check-results.json'),{force:true});await rm(resolve(target,'assets/quality/check-results.json'),{force:true});
await mkdir(target,{recursive:true});await cp(source,target,{recursive:true,filter:p=>!p.includes('__pycache__')});await writeFile(resolve(target,'.storytelling-install.json'),JSON.stringify({source,name,edition:3,corpusCount:24},null,2)+'\n');console.log(`Installed 24 native drawings and 24 SVG loops at ${target}`);
