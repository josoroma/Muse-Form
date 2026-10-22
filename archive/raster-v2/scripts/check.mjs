import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {ROOT,startServer} from './serve.mjs';
import {openBrowser,mountFilm,frame} from './film.mjs';
const manifest=JSON.parse(await readFile(resolve(ROOT,'corpus/manifest.json')));
const requested=process.argv.slice(2),studies=manifest.studies.filter(s=>!requested.length||requested.includes(s.id));
if(!studies.length)throw new Error('No matching studies');
const {server,url}=await startServer(),browser=await openBrowser();
await mkdir(resolve(ROOT,'qa/realism'),{recursive:true});const results=[];
const hash=b=>createHash('sha256').update(b).digest('hex');
try{for(const study of studies){
 const page=await mountFilm(browser,`${url}/${study.animated}`),samples=[];
 for(const time of [0,.8,1.4,3.5,5.5,6.8,7,2.3,4.6,2.3]){const png=await frame(page,time);samples.push({time,hash:hash(png),png});}
 const metrics=await page.evaluate(()=>{
 const c=document.querySelector('canvas'),gl=c.getContext('webgl');const read=t=>{window.seek(t);let a=new Uint8Array(c.width*c.height*4);gl.readPixels(0,0,c.width,c.height,gl.RGBA,gl.UNSIGNED_BYTE,a);return a;};
 const a=read(0),b=read(3.5);let sum=0,changed=0,max=0,corners=0;
 for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){let d=0;for(let k=0;k<3;k++)d+=Math.abs(a[(y*c.width+x)*4+k]-b[(y*c.width+x)*4+k]);sum+=d;max=Math.max(max,d/3);if(d>6)changed++;if((x<20||x>c.width-21)&&(y<20||y>c.height-21))corners+=d;}
 return{meanChannelDifference:sum/(c.width*c.height*3),changedPixels:changed,maximumPixelDifference:max,cornerDifference:corners};
 });
 await writeFile(resolve(ROOT,`qa/realism/${study.id}-0.png`),samples[0].png);await writeFile(resolve(ROOT,`qa/realism/${study.id}-3.5.png`),samples[3].png);
 const result={id:study.id,duration:7,loopCloses:samples[0].hash===samples[6].hash,deterministicSeek:samples[7].hash===samples[9].hash,visibleMotion:samples[0].hash!==samples[3].hash,...metrics,errors:page.filmDiagnostics};
 result.pass=result.loopCloses&&result.deterministicSeek&&result.visibleMotion&&!result.errors.length;results.push(result);await page.close();
 const sheet=await browser.newPage({viewport:{width:1440,height:800},deviceScaleFactor:1});
 await sheet.setContent(`<style>body{margin:0;padding:16px;background:#e6e1d6;color:#24343b;font:14px Arial}h1{font:22px Georgia;margin:0 0 12px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}figure{margin:0}img{width:100%;display:block}figcaption{padding:4px 0}</style><h1>${study.id} · ${study.title}</h1><div class="grid">${samples.slice(0,6).map(s=>`<figure><img src="data:image/png;base64,${s.png.toString('base64')}"><figcaption>${s.time.toFixed(2)} seconds</figcaption></figure>`).join('')}</div>`);await sheet.screenshot({path:resolve(ROOT,`qa/realism/${study.id}-motion.jpg`),type:'jpeg',quality:94});await sheet.close();console.log(`${result.pass?'PASS':'FAIL'} ${study.id}; ${metrics.changedPixels} changed pixels; Δ ${metrics.meanChannelDifference.toFixed(3)}`);
 }
 await writeFile(resolve(ROOT,'qa/realism/check-results.json'),JSON.stringify({edition:2,generatedAt:new Date().toISOString(),results},null,2)+'\n');
 if(results.some(r=>!r.pass))process.exitCode=1;
}finally{await browser.close();server.close();}
