import {readFile,writeFile,mkdir,cp,access,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {homedir} from 'node:os';
import {ROOT} from './serve.mjs';
const name='seven-second-storytelling',source=resolve(ROOT,'skills',name),target=resolve(process.env.CODEX_HOME||join(homedir(),'.codex'),'skills',name);
let exists=false;try{await access(target);exists=true;}catch{}
if(exists){let marker;try{marker=JSON.parse(await readFile(resolve(target,'.storytelling-install.json')));}catch{}if(marker?.source!==source)throw new Error(`Unrelated skill already exists at ${target}; refusing to overwrite it.`);}
const corpus=resolve(source,'assets/corpus');await mkdir(corpus,{recursive:true});
// The initial vector edition is safely retained in archive/vector-v1.
for(const old of ['svg','animated','plates'])await rm(resolve(corpus,old),{recursive:true,force:true});
for(const folder of ['plates','animated'])await cp(resolve(ROOT,'corpus',folder),resolve(corpus,folder),{recursive:true});
await cp(resolve(ROOT,'runtime'),resolve(source,'assets/runtime'),{recursive:true});
await mkdir(resolve(source,'assets/quality'),{recursive:true});
for(const name of ['art-review.json','check-results.json','verification.json']){try{await cp(resolve(ROOT,'qa/realism',name),resolve(source,'assets/quality',name));}catch(error){if(error.code!=='ENOENT')throw error;}}
const manifest=JSON.parse(await readFile(resolve(ROOT,'corpus/manifest.json')));
for(const s of manifest.studies){s.image=`plates/${s.id}.png`;s.poster=s.image;s.animated=`animated/${s.id}.html`;s.rig=`animated/${s.id}.json`;delete s.video;}
await writeFile(resolve(corpus,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
if(exists)for(const old of ['assets/corpus/svg','assets/corpus/animated','assets/corpus/plates'])await rm(resolve(target,old),{recursive:true,force:true});
await mkdir(target,{recursive:true});await cp(source,target,{recursive:true,filter:path=>!path.includes('__pycache__')});
await writeFile(resolve(target,'.storytelling-install.json'),JSON.stringify({source,name,edition:2,corpusCount:manifest.studies.length},null,2)+'\n');
console.log(`Installed ${name} with ${manifest.studies.length} realistic plates and motion rigs at ${target}`);
