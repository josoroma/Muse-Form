import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { startServer, ROOT } from './serve.mjs';
import { openBrowser } from '../skills/seven-second-storytelling/scripts/render-svg.mjs';
const dir=resolve(ROOT,'qa/expressions');await mkdir(dir,{recursive:true});
const {server,url}=await startServer(),browser=await openBrowser(),results=[];
try{
  const page=await browser.newPage({viewport:{width:1280,height:960},deviceScaleFactor:1,reducedMotion:'no-preference'});
  await page.goto(`${url}/expressions/`);await page.waitForFunction(()=>window.atlas);
  for(const id of ['joy','sadness','anger','fear','surprise','disgust','wink','laughter']){
    await page.evaluate(id=>atlas.setStudy(id,true),id);
    const began=Date.now(),frames=[];
    for(const target of [0,1,2,3,4,4.9,5.5]){
      await page.waitForTimeout(Math.max(0,began+target*1000-Date.now()));
      const state=await page.evaluate(()=>atlas.state);
      const bytes=await page.locator('#viewport').screenshot({path:resolve(dir,`${id}-live-${target.toFixed(1)}.png`)});
      frames.push({elapsed:(Date.now()-began)/1000,time:state.time,camera:state.camera.position,hash:createHash('sha256').update(bytes).digest('hex'),playing:state.playing});
    }
    const result={id,frames,distinctFrames:new Set(frames.map(f=>f.hash)).size,cameraChanges:new Set(frames.map(f=>f.camera.join(','))).size,loopObserved:frames.at(-1).time<1.5&&frames[5].time>4,scope:'Sampled unpaused browser playback for more than one five-second cycle, with no seeking between samples.'};
    result.pass=result.distinctFrames>=5&&result.cameraChanges>=5&&result.loopObserved&&frames.every(f=>f.playing);results.push(result);console.log(`${result.pass?'PASS':'FAIL'} ${id}: automatic model, camera and labels across five-second boundary.`);
  }
  await writeFile(resolve(dir,'playback.json'),JSON.stringify({duration:5,results,pass:results.every(r=>r.pass)},null,2)+'\n');
  if(results.some(r=>!r.pass))process.exitCode=1;
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
