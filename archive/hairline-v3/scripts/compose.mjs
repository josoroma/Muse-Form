import{readFile,writeFile,readdir,mkdir}from'node:fs/promises';
import{resolve}from'node:path';
import{ROOT}from'./serve.mjs';
const base=JSON.parse(await readFile(resolve(ROOT,'archive/raster-v2/corpus/manifest.json'))),entries=[];
for(const file of await readdir(resolve(ROOT,'corpus/hairline')))if(file.endsWith('.json'))entries.push(...JSON.parse(await readFile(resolve(ROOT,'corpus/hairline',file))));
const selection=process.argv.slice(2);await mkdir(resolve(ROOT,'corpus/animated'),{recursive:true});
const clamp=x=>Math.max(0,Math.min(1,x));const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
function beat(t,delay=0){t=Math.max(0,t-delay);if(t<.8)return 0;if(t<1.4)return-.13*smooth((t-.8)/.6);if(t<3.2)return-.13+1.13*smooth((t-1.4)/1.8);if(t<4.1)return 1;if(t<6.1)return 1-smooth((t-4.1)/2);return 0;}
function deform(x,y,t,rig){const p=[x/1200,y/900];let dx=0,dy=0;
 for(const r of rig.regions||[]){const dist=Math.hypot((p[0]-r.center[0])/r.radius[0],(p[1]-r.center[1])/r.radius[1]);const weight=1-smooth((dist-.45)/.55);const v=r.phase==='breath'?(1-Math.cos(2*Math.PI*t/7))*.5:beat(t,r.delay||0);const tr=r.translate||[0,0],pivot=r.pivot||r.center,a=(r.rotate||0)*Math.PI/180*v;const lx=x-pivot[0]*1200,ly=y-pivot[1]*900;dx+=(tr[0]*v*1.35+Math.cos(a)*lx-Math.sin(a)*ly-lx)*weight;dy+=(tr[1]*v*1.35+Math.sin(a)*lx+Math.cos(a)*ly-ly)*weight;}
 let support=1;for(const pin of rig.pins||[]){const d=Math.hypot((p[0]-pin.center[0])/pin.radius[0],(p[1]-pin.center[1])/pin.radius[1]);support*=smooth((d-.18)/.82);}return[x+dx*support,y+dy*support];}
const number=/-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
function morph(d,t,rig){if((d.replace(number,'').match(/[A-Za-z]/g)||[]).some(c=>!'MLCQZ'.includes(c)))return d;let i=0;const values=[...d.matchAll(number)].map(m=>Number(m[0]));if(values.length%2)return d;const changed=[];for(let j=0;j<values.length;j+=2)changed.push(...deform(values[j],values[j+1],t,rig));return d.replace(number,()=>changed[i++].toFixed(2));}
const attr=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const anim=(attribute,values,times,type)=>`<${type?'animateTransform':'animate'} attributeName="${attribute}"${type?` type="${type}"`:''} dur="7s" repeatCount="indefinite" calcMode="spline" keyTimes="${times.join(';')}" keySplines="${times.slice(1).map(()=>'.42 0 .58 1').join(';')}" values="${attr(values.join(';'))}"/>`;
for(const e of entries){if(selection.length&&!selection.includes(e.id))continue;const s=base.studies.find(s=>s.id===e.id);if(!s)throw new Error(`Unknown ${e.id}`);
 let svg=await readFile(resolve(ROOT,e.svg||`corpus/svg/${e.id}.svg`),'utf8');if(/<image|<filter|<linearGradient|<radialGradient|<foreignObject|<script|<text\b/.test(svg))throw new Error(`${e.id}: expected pure line geometry`);
 let tracks=0;
 if(e.animations?.length){for(const a of e.animations){const re=new RegExp(`(<(?:g|path|circle|ellipse)\\b[^>]*\\bid=["']${a.target}["'][^>]*?)(/?>)`);const match=svg.match(re);if(!match)throw new Error(`${e.id}: missing animated target ${a.target}`);const tag=match[0].match(/^<(\w+)/)[1];const child=anim(a.attribute||'transform',a.values,a.keyTimes||[0,.5,1],a.type);svg=svg.replace(re,(_,open,end)=>end==='/>'?`${open}>${child}</${tag}>`:`${open}>${child}`);tracks++;}}
 else{const rig=await readFile(resolve(ROOT,`archive/raster-v2/corpus/animated/${e.id}.json`),'utf8').then(JSON.parse);const times=[0,.8,1.4,2.3,3.5,4.7,6.1,7];
 svg=svg.replace(/<path\b([^>]*\bd="([^"]+)"[^>]*)\s*\/>/g,(all,attributes,d)=>{const values=times.map(t=>morph(d,t,rig));if(new Set(values).size<2)return all;tracks++;return`<path ${attributes}>${anim('d',values,times.map(t=>t/7))}</path>`;});
 }
 if(!tracks){const re=/<path\b([^>]*\bstroke="#fafafa"[^>]*)\s*\/>/;if(!re.test(svg))throw new Error(`${e.id}: no motion and no focal path`);svg=svg.replace(re,(_,a)=>`<path ${a}>${anim('stroke',['#fafafa','#a1a1aa','#fafafa'],[0,.5,1])}</path>`);tracks++;}
 await writeFile(resolve(ROOT,`corpus/animated/${e.id}.svg`),svg);console.log(`${e.id}: ${tracks} native SVG tracks`);
}
