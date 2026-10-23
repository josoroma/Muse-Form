import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { startServer, ROOT } from './serve.mjs';
import { openBrowser } from '../skills/seven-second-storytelling/scripts/render-svg.mjs';

const dir=resolve(ROOT,'qa/three');await mkdir(dir,{recursive:true});
const {server,url}=await startServer();const browser=await openBrowser();
const errors=[],requests=[],report={renderer:'Three.js 0.186.1 / Chrome WebGL',duration:5,scenes:[],interactions:{},errors};
const page=await browser.newPage({viewport:{width:1440,height:1080},deviceScaleFactor:1,reducedMotion:'reduce'});
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('request',r=>requests.push(r.url()));
async function pose(time){return page.evaluate(t=>{
  atlas.seek(t);const values=[],exact=[],featureHashes={};let finite=true,meshCount=0,vertices=0;
  atlas.model.group.updateMatrixWorld(true);
  atlas.model.group.traverse(o=>{
    values.push(...o.matrixWorld.elements.map(x=>Math.round(x*1e5)));
    exact.push(...o.matrixWorld.elements);
    if(o.isMesh){meshCount++;const a=o.geometry.attributes.position;vertices+=a.count;const id=o.userData.partId;let h=featureHashes[id]??2166136261;const bits=new Uint32Array(a.array.buffer,a.array.byteOffset,a.array.length);for(let i=0;i<a.array.length;i++){const n=a.array[i];if(!Number.isFinite(n))finite=false;values.push(Math.round(n*1e5));exact.push(n);h=Math.imul(h^bits[i],16777619);}if(id)featureHashes[id]=h>>>0;}
  });
  let hash=2166136261;for(const n of values){hash^=n;hash=Math.imul(hash,16777619);}
  if(t===0)window.__neutralGeometry=exact;
  const exactNeutralMatch=t===5&&exact.length===window.__neutralGeometry?.length&&exact.every((n,i)=>n===window.__neutralGeometry[i]);
  return{hash:hash>>>0,finite,meshCount,vertices,featureHashes,exactNeutralMatch};
},time);}
try {
  await page.goto(`${url}/three/`);await page.waitForFunction(()=>window.atlas);
  report.interactions.reducedMotionStartsPaused=await page.evaluate(()=>!atlas.state.playing&&atlas.state.cameraOwner==='manual');
  for(const id of ['body','arm','hand','leg','foot']){
    await page.locator(`[data-study="${id}"]`).click();
    const rest=await pose(0),peak=await pose(2.5),end=await pose(5);
    await pose(4.25);const seekA=await pose(1.37);await pose(.4);const seekB=await pose(1.37);
    const frames=[];
    for(const t of [0,.65,1.5,2.5,3.75,5]){
      await pose(t);const file=`${id}-${t===0?'rest':t===2.5?'peak':`t${t.toFixed(2)}`}.png`;
      await page.screenshot({path:resolve(dir,file),fullPage:true});frames.push({time:t,file});
    }
    const sceneReport={id,rest,peak,end,visibleModelChange:rest.hash!==peak.hash,loopCloses:end.exactNeutralMatch,deterministicReverseSeek:seekA.hash===seekB.hash,frames,labels:await page.locator('#parts button').count()};
    sceneReport.pass=rest.finite&&peak.finite&&end.finite&&rest.meshCount>=1&&rest.vertices>1000&&sceneReport.visibleModelChange&&sceneReport.loopCloses&&sceneReport.deterministicReverseSeek;
    report.scenes.push(sceneReport);console.log(`${sceneReport.pass?'PASS':'FAIL'} ${id}: actual mesh motion, loop closure, reverse seek; ${sceneReport.labels} selectable structures.`);
  }
  await page.locator('[data-study="hand"]').click();await page.locator('#parts button[data-part="thumb"]').click();
  report.interactions.selectionAndExplanation=await page.evaluate(()=>atlas.state.selected==='thumb'&&document.getElementById('part-name').textContent==='Thumb opposition');
  const cameraBefore=await page.evaluate(()=>atlas.state.camera.position);await page.locator('#focus').click();
  report.interactions.frameSelection=JSON.stringify(cameraBefore)!==JSON.stringify(await page.evaluate(()=>atlas.state.camera.position));
  await page.locator('#overview').click();await page.locator('#show-labels').uncheck();report.interactions.hideLabels=await page.locator('#labels').isHidden();await page.locator('#show-labels').check();
  await page.locator('#timeline').fill('1.75');report.interactions.scrubPauses=await page.evaluate(()=>Math.abs(atlas.state.time-1.75)<.001&&!atlas.state.playing);
  await page.locator('#restart').click();report.interactions.restartRestoresStart=await page.evaluate(()=>atlas.state.time===0);
  await page.locator('#play').click();await page.waitForTimeout(350);await page.locator('#play').click();report.interactions.playPause=await page.evaluate(()=>atlas.state.time>0&&!atlas.state.playing);
  await page.locator('#loop').uncheck();await page.locator('#timeline').fill('4.8');await page.locator('#play').click();await page.waitForTimeout(650);report.interactions.singlePassStopsAtFive=await page.evaluate(()=>atlas.state.time===5&&!atlas.state.playing);
  await page.locator('#loop').check();await page.locator('#guided').check();await page.locator('#restart').click();await page.locator('#play').click();
  const guidedBefore=await page.evaluate(()=>atlas.state.camera.position);await page.waitForTimeout(750);const guidedAfter=await page.evaluate(()=>atlas.state.camera.position);
  report.interactions.guidedCameraMoves=JSON.stringify(guidedBefore)!==JSON.stringify(guidedAfter);
  const canvas=await page.locator('canvas').boundingBox();await page.mouse.move(canvas.x+canvas.width*.52,canvas.y+canvas.height*.58);await page.mouse.down();await page.mouse.move(canvas.x+canvas.width*.66,canvas.y+canvas.height*.62,{steps:8});await page.mouse.up();
  report.interactions.dragInterruptsGuidedCamera=await page.evaluate(()=>atlas.state.cameraOwner==='manual'&&!document.getElementById('guided').checked);
  await page.locator('canvas').focus();const keyBefore=await page.evaluate(()=>atlas.state.camera.position);await page.keyboard.press('ArrowLeft');report.interactions.keyboardOrbit=JSON.stringify(keyBefore)!==JSON.stringify(await page.evaluate(()=>atlas.state.camera.position));await page.keyboard.press('Home');
  await page.locator('#about').click();report.interactions.aboutAndSources=await page.locator('#about-dialog').isVisible();await page.keyboard.press('Escape');
  const live=await browser.newPage({viewport:{width:1280,height:960},reducedMotion:'no-preference'});await live.goto(`${url}/three/#body`);await live.waitForFunction(()=>window.atlas);
  const running0=await live.evaluate(()=>atlas.state);await live.waitForTimeout(700);const running1=await live.evaluate(()=>atlas.state);
  report.interactions.normalMotionAutoplays=running1.playing&&running1.time!==running0.time;
  await live.screenshot({path:resolve(dir,'automatic-playback.png'),fullPage:true});await live.close();
  const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:'reduce'});await mobile.goto(`${url}/three/#hand`);await mobile.waitForFunction(()=>window.atlas);
  await mobile.evaluate(()=>atlas.seek(2.5));await mobile.screenshot({path:resolve(dir,'mobile-hand.png'),fullPage:true});
  report.interactions.mobileNoHorizontalOverflow=await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
  report.interactions.mobileLabelsInside=await mobile.evaluate(()=>{const r=document.getElementById('viewport').getBoundingClientRect();return [...document.querySelectorAll('.annotation')].filter(b=>!b.hidden).every(b=>{const q=b.getBoundingClientRect();return q.left>=r.left&&q.right<=r.right&&q.top>=r.top&&q.bottom<=r.bottom;});});
  await mobile.locator('[data-study="foot"]').click();await mobile.evaluate(()=>atlas.seek(2.5));await mobile.screenshot({path:resolve(dir,'mobile-foot.png'),fullPage:true});await mobile.close();
  report.interactions.onlyLocalRequests=requests.every(r=>r.startsWith(url)||r.startsWith('data:'));
  report.sources={};for(const file of ['three/app.mjs','three/geometry.mjs','three/upper-body.mjs','three/hand.mjs','three/lower-limb.mjs'])report.sources[file]=createHash('sha256').update(await readFile(resolve(ROOT,file))).digest('hex');
  report.pass=report.scenes.every(s=>s.pass)&&Object.values(report.interactions).every(Boolean)&&errors.length===0;
  await writeFile(resolve(dir,'checks.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({interactions:report.interactions,errors,pass:report.pass},null,2));if(!report.pass)process.exitCode=1;
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
