import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {ROOT} from './serve.mjs';
const original=JSON.parse(await readFile(resolve(ROOT,'archive/vector-v1/corpus/manifest.json')));
const art=[];
for(const name of await readdir(resolve(ROOT,'corpus/realism')))if(name.endsWith('.json'))art.push(...JSON.parse(await readFile(resolve(ROOT,'corpus/realism',name))));
const region=(name,center,radius,translate=[0,0],rotate=0,pivot=center,phase='action',delay=0)=>({name,center,radius,translate,rotate,pivot,phase,delay});
const pin=(center,radius=[.07,.07])=>({center,radius});
// These are authoring defaults. Each scene's landmarks and final still/motion review
// are inspected before publication. Values are deliberately small in 1200px space.
function rig(id, landmarks={}){
 const point=(key,fallback)=>{const p=landmarks[key];return Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)?p:fallback;};
 const head=point('head',[.5,.39]),chest=point('chest',[.5,.76]);
 const face=[region('head intention',head,[.28,.39],[1.2,-1.1],.22,point('neck',[.5,.72])),region('breath',chest,[.38,.25],[0,-2.4],0,chest,'breath')];
 const specs={
 '105193':{regions:[region('mandible settle',point('jaw',[.52,.71]),[.26,.2],[0,1.1],.1,point('jawHinge',[.66,.54]))],light:{center:[.46,.38],radius:[.32,.4],strength:.009}},
 '105194':{regions:[region('orbital skin settle',point('brow',[.5,.27]),[.31,.14],[0,-1.3])],light:{center:point('iris',[.51,.5]),radius:[.14,.17],strength:.018}},
 '105195':{regions:[],light:{center:point('concha',[.51,.5]),radius:[.31,.38],strength:.055}},
 '105196':{regions:face},'105197':{regions:face.map((r,i)=>i? r:{...r,translate:[.5,2.1],rotate:-.22})},
 '105198':{regions:face.map((r,i)=>i?r:{...r,translate:[0,-1.1],rotate:.15})},
 '105199':{regions:face.map((r,i)=>i?r:{...r,translate:[1.8,-1.7],rotate:.2})},
 '105200':{regions:face.map((r,i)=>i?r:{...r,translate:[0,-2.2],rotate:-.18})},
 '105202':{regions:face.map((r,i)=>i?{...r,translate:[0,-3]}:{...r,translate:[0,1.7],rotate:.3})},
 '105203':{regions:face.map((r,i)=>i?r:{...r,translate:[.8,-.8],rotate:.25})},
 '105214':{regions:[region('ribcage inhalation',point('ribcage',[.5,.4]),[.32,.34],[0,-4.2],.22,point('pelvis',[.5,.77]),'breath')],pins:[pin(point('pelvis',[.5,.8]),[.19,.13])]},
 '105215':{regions:[region('elbow contraction',point('forearm',[.68,.45]),[.32,.37],[0,-1.8],-.7,point('elbow',[.65,.7]))],pins:[pin(point('shoulder',[.25,.5]),[.14,.19])]},
 '105216':{regions:[region('index release',point('indexTip',[.42,.23]),[.09,.29],[-2.1,-1.5],-.25,point('indexBase',[.43,.54])),region('little finger release',point('littleTip',[.69,.35]),[.09,.24],[2.4,-.9],.4,point('littleBase',[.63,.56]),'action',.18)],pins:[pin(point('wrist',[.51,.85]),[.18,.12])]},
 '105217':{regions:[region('knuckle tension',point('knuckles',[.52,.49]),[.26,.23],[0,-2.2]),region('finger extension',point('middleTip',[.52,.22]),[.17,.3],[0,-2.1],.2,point('knuckles',[.52,.49]),'action',.15)],pins:[pin(point('wrist',[.47,.85]),[.18,.12])]},
 '105218':{regions:[region('calf load',point('calf',[.53,.53]),[.18,.25],[1.1,-2.1]),region('thigh settle',point('thigh',[.48,.28]),[.2,.22],[-.7,-1.5])],pins:[pin(point('ankle',[.52,.81]),[.14,.13])]},
 '105219':{regions:[region('calf tension',point('calf',[.49,.55]),[.2,.28],[1.4,-1.9],.1)],pins:[pin(point('ankle',[.5,.84]),[.16,.13])]},
 '105220':{regions:[region('knee settle',point('knee',[.54,.51]),[.24,.26],[1.4,-1.5],.2,point('hip',[.36,.24]))],pins:[pin(point('ankle',[.65,.81]),[.17,.14])]},
 '105221':{regions:[region('toe relaxation',point('toes',[.54,.4]),[.31,.2],[0,1.7]),region('forefoot settle',point('forefoot',[.5,.6]),[.28,.26],[.5,-.8])],pins:[pin(point('heel',[.45,.85]),[.23,.12])]},
 '105222':{regions:[region('instep tension',point('instep',[.51,.48]),[.24,.32],[.8,-2.1])],pins:[pin(point('toes',[.53,.82]),[.3,.12]),pin(point('ankle',[.47,.19]),[.14,.13])]},
 '105223':{regions:[region('ankle load',point('ankle',[.35,.4]),[.23,.28],[.9,2.3]),region('arch tension',point('arch',[.49,.67]),[.24,.14],[0,-1.4])],pins:[pin(point('heel',[.23,.7]),[.13,.11]),pin(point('ball',[.66,.8]),[.13,.1])]},
 '105232':{regions:[region('quiet breath',point('chest',[.5,.52]),[.2,.23],[0,-2.4],0,point('chest',[.5,.52]),'breath'),region('coat settles',point('coat',[.51,.67]),[.23,.24],[1.8,0],.15,point('waist',[.5,.6]),'action',.25)],pins:[pin(point('telescope',[.62,.33]),[.25,.11]),pin(point('feet',[.51,.87]),[.26,.11])]},
 '105233':{regions:[region('dragon breathing',point('chest',[.48,.56]),[.24,.26],[0,-3.2],0,point('chest',[.48,.56]),'breath'),region('tail follow through',point('tail',[.27,.68]),[.24,.18],[1.7,-1.2],.25,point('tailBase',[.44,.65]),'action',.3)],pins:[pin(point('hand',[.66,.48]),[.09,.1]),pin(point('ground',[.49,.85]),[.34,.12])],light:{center:point('lantern',[.7,.58]),radius:[.14,.2],strength:.055}},
 '105234':{regions:[region('curious lean',point('head',[.55,.45]),[.25,.35],[3.8,-1.9],.4,point('bodyBase',[.5,.73])),region('body follow through',point('body',[.48,.64]),[.3,.22],[1.2,-.9],0,point('bodyBase',[.5,.73]),'action',.25)],pins:[pin(point('ground',[.48,.81]),[.35,.12])]},
 '105235':{regions:[region('gentle breath',point('chest',[.48,.49]),[.21,.22],[0,-2.7],0,point('chest',[.48,.49]),'breath'),region('plant response',point('plant',[.72,.68]),[.12,.18],[1.2,-.5],.35,point('pot',[.71,.8]),'action',.3)],pins:[pin(point('hand',[.65,.54]),[.16,.1]),pin(point('feet',[.48,.87]),[.29,.1]),pin(point('pot',[.72,.82]),[.12,.1])]}
 };
 return specs[id];
}
const args=process.argv.slice(2);
for(const entry of art){
 if(args.length&&!args.includes(entry.id))continue;
 const originalEntry=original.studies.find(s=>s.id===entry.id);if(!originalEntry)throw new Error(`Unknown ID ${entry.id}`);
 await readFile(resolve(ROOT,entry.image));
 const config={id:entry.id,title:entry.title||originalEntry.title,duration:7,imageUrl:`../plates/${entry.id}.png`,...rig(entry.id,entry.landmarks)};
 if(entry.rigOverride)Object.assign(config,entry.rigOverride);
 await mkdir(resolve(ROOT,'corpus/animated'),{recursive:true});
 await writeFile(resolve(ROOT,`corpus/animated/${entry.id}.json`),JSON.stringify(config,null,2)+'\n');
 const safe=JSON.stringify(config).replaceAll('<','\\u003c');
 const title=config.title.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('\"','&quot;');
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><link rel="stylesheet" href="../../runtime/standalone.css"></head><body><main><canvas role="img" aria-label="${title}: a seven-second illustrated cinemagraph"></canvas><nav><button aria-label="Play or pause animation">Play</button><input aria-label="Time in seconds" type="range" min="0" max="7" step="0.01" value="0"><span>7 seconds</span><a href="../plates/${entry.id}.png" download>Still</a></nav><p id="error" role="status"></p></main><script id="scene-config" type="application/json">${safe}</script><script type="module" src="../../runtime/standalone.mjs"></script></body></html>`;
 await writeFile(resolve(ROOT,`corpus/animated/${entry.id}.html`),html);
}
console.log(`Composed ${args.length||art.length} illustrated scenes.`);
