import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { startServer, ROOT } from './serve.mjs';
import { openBrowser } from './browser.mjs';

const dir=resolve(ROOT,'qa/three');await mkdir(dir,{recursive:true});
const {server,url}=await startServer();const browser=await openBrowser();
const errors=[],requests=[],report={renderer:'Three.js 0.186.1 / Chrome WebGL',duration:5,scenes:[],interactions:{},errors};
const page=await browser.newPage({viewport:{width:1440,height:1080},deviceScaleFactor:1,reducedMotion:'reduce'});
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('request',r=>requests.push(r.url()));
async function pose(time){return page.evaluate(t=>{
  atlas.seek(t);const values=[],exact=[],featureHashes={};let finite=true,meshCount=0,vertices=0,skinnedMeshes=0;
  atlas.model.group.updateMatrixWorld(true);
  atlas.model.group.traverse(o=>{
    values.push(...o.matrixWorld.elements.map(x=>Math.round(x*1e5)));
    exact.push(...o.matrixWorld.elements);
    if(o.isMesh){meshCount++;if(o.isSkinnedMesh)skinnedMeshes++;const a=o.geometry.attributes.position;vertices+=a.count;for(let i=0;i<a.array.length;i++)if(!Number.isFinite(a.array[i]))finite=false;if(o.morphTargetInfluences){values.push(...o.morphTargetInfluences.map(n=>Math.round(n*1e5)));exact.push(...o.morphTargetInfluences);}}
  });
  // The GLB position buffer is its bind pose. The cached collision surface is
  // the actual bone-and-morph-deformed body, so hash that rather than falsely
  // treating unchanged bind vertices as a static animation.
  const surface=atlas.model.pickingMeshes?.find(o=>o.userData.isCollisionSurface),a=surface?.geometry.attributes.position;
  if(!a)throw Error('The shared character must expose its posed collision surface.');
  const bits=new Uint32Array(a.array.buffer,a.array.byteOffset,a.array.length);
  for(const n of a.array){finite=finite&&Number.isFinite(n);values.push(Math.round(n*1e5));exact.push(n);}
  for(const part of atlas.model.parts){let h=2166136261;for(const index of part.object.userData.sourceVertexIndices||[])for(let k=0;k<3;k++)h=Math.imul(h^bits[index*3+k],16777619);featureHashes[part.id]=h>>>0;}
  let identityHash=2166136261;for(const n of atlas.model.character.body.geometry.attributes.position.array)identityHash=Math.imul(identityHash^Math.round(n*1e6),16777619);
  let hash=2166136261;for(const n of values){hash^=n;hash=Math.imul(hash,16777619);}
  if(t===0)window.__neutralGeometry=exact;
  const exactNeutralMatch=t===5&&exact.length===window.__neutralGeometry?.length&&exact.every((n,i)=>n===window.__neutralGeometry[i]);
  return{hash:hash>>>0,finite,meshCount,skinnedMeshes,vertices,posedVertices:a.count,identityHash:identityHash>>>0,featureHashes,exactNeutralMatch};
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
    const views=[];
    for(const view of ['front','threequarter','side']){
      await page.locator(`#${view==='threequarter'?'front':view}`).click();
      if(view==='threequarter'){await page.locator('canvas').focus();for(let i=0;i<6;i++)await page.keyboard.press('ArrowRight');}
      for(const t of [0,1.5,2.5]){await pose(t);const file=`${id}-${view}-${t===0?'rest':t===2.5?'peak':'intermediate'}.png`;await page.locator('#viewport').screenshot({path:resolve(dir,file)});views.push({view,time:t,file});}
    }
    await page.locator('#overview').click();
    const localFeaturesChanged=Object.keys(rest.featureHashes).filter(id=>rest.featureHashes[id]!==peak.featureHashes[id]);
    const render=await page.evaluate(()=>({drawCalls:atlas.state.drawCalls,triangles:atlas.state.triangles,meanRenderMs:atlas.state.meanRenderMs}));
    const sceneReport={id,rest,peak,end,localFeaturesChanged,visibleModelChange:rest.hash!==peak.hash&&localFeaturesChanged.length>0,loopCloses:end.exactNeutralMatch,deterministicReverseSeek:seekA.hash===seekB.hash,frames,views,render,labels:await page.locator('#parts button').count()};
    sceneReport.pass=rest.finite&&peak.finite&&end.finite&&rest.skinnedMeshes>=1&&rest.posedVertices>1000&&sceneReport.visibleModelChange&&sceneReport.loopCloses&&sceneReport.deterministicReverseSeek;
    report.scenes.push(sceneReport);console.log(`${sceneReport.pass?'PASS':'FAIL'} ${id}: actual mesh motion, loop closure, reverse seek; ${sceneReport.labels} selectable structures.`);
  }
  report.interactions.sameSculptedIdentityAcrossStudies=new Set(report.scenes.map(s=>s.rest.identityHash)).size===1;
  await page.locator('[data-study="body"]').click();
  report.interactions.pectoralBackPelvisPreserved=await page.evaluate(()=>['chest','back','pelvis'].every(id=>atlas.model.parts.some(p=>p.id===id)));
  report.interactions.surfaceSelectionPreservesSkin=await page.evaluate(()=>{
    const body=atlas.model.character.body,materials=Array.isArray(body.material)?body.material:[body.material],before=materials.map(m=>m.color?.getHex());
    atlas.selectPart('pelvis');const selected=atlas.model.parts.find(p=>p.id==='pelvis').object;
    return selected.visible&&selected.isSkinnedMesh&&selected.skeleton===body.skeleton&&selected.material.transparent&&selected.material.opacity<1&&materials.every((m,i)=>m.color?.getHex()===before[i]);
  });
  report.interactions.anchorsFollowPosedSurface=await page.evaluate(()=>{
    let pass=true;for(const t of[0,1.5,2.5,5]){atlas.seek(t);const mesh=atlas.model.character.body;for(const part of atlas.model.parts){const face=part.surfaceAnchor,idx=mesh.geometry.index,point=mesh.position.clone().set(0,0,0),vertex=point.clone();for(let k=0;k<3;k++){mesh.getVertexPosition(idx.getX(face.faceIndex*3+k),vertex);point.addScaledVector(vertex,face.barycentric[k]);}mesh.localToWorld(point);part.anchor.getWorldPosition(vertex);pass=pass&&point.distanceTo(vertex)<.003;}}return pass;
  });
  await page.evaluate(()=>{atlas.selectPart('');window.__hairMaterials=atlas.model.character.meshes.filter(m=>m.userData.isHair).flatMap(mesh=>(Array.isArray(mesh.material)?mesh.material:[mesh.material]).map(material=>({opacity:material.opacity,transparent:material.transparent,depthWrite:material.depthWrite,castShadow:mesh.castShadow})));atlas.selectPart('back');});
  report.interactions.backSelectionRevealsSurface=await page.evaluate(()=>atlas.model.parts.find(p=>p.id==='back').object.visible&&atlas.model.character.meshes.filter(m=>m.userData.isHair).every(mesh=>!mesh.castShadow&&(Array.isArray(mesh.material)?mesh.material:[mesh.material]).every(material=>material.opacity<=.12&&material.transparent&&!material.depthWrite)));
  await page.locator('#front').click();await pose(2.5);await page.locator('canvas').focus();for(let i=0;i<26;i++)await page.keyboard.press('ArrowRight');
  await page.locator('#viewport').screenshot({path:resolve(dir,'body-back-selected.png')});
  report.interactions.clearSelectionRestoresHair=await page.evaluate(()=>{atlas.selectPart('');const restored=atlas.model.character.meshes.filter(m=>m.userData.isHair).flatMap(mesh=>(Array.isArray(mesh.material)?mesh.material:[mesh.material]).map(material=>({opacity:material.opacity,transparent:material.transparent,depthWrite:material.depthWrite,castShadow:mesh.castShadow})));return JSON.stringify(restored)===JSON.stringify(window.__hairMaterials);});
  await page.locator('#viewport').screenshot({path:resolve(dir,'body-back-restored.png')});
  await page.locator('#front').click();await pose(0);await page.evaluate(()=>atlas.selectPart(''));await page.locator('#show-labels').uncheck();await page.locator('#viewport').screenshot({path:resolve(dir,'shared-character-front.png')});await page.locator('#show-labels').check();
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
  const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:'reduce'});await mobile.goto(`${url}/three/#body`);await mobile.waitForFunction(()=>window.atlas);
  report.mobile=[];
  for(const id of ['body','arm','hand','leg','foot']){
    await mobile.locator(`[data-study="${id}"]`).click();
    for(const time of [0,2.5]){
      await mobile.evaluate(t=>atlas.seek(t),time);
      const file=`mobile-${id}${time===0?'-rest':''}.png`;await mobile.screenshot({path:resolve(dir,file),fullPage:true});
      const layout=await mobile.evaluate(()=>{const r=document.getElementById('viewport').getBoundingClientRect();return{noHorizontalOverflow:document.documentElement.scrollWidth<=innerWidth,labelsInside:[...document.querySelectorAll('.annotation')].filter(b=>!b.hidden).every(b=>{const q=b.getBoundingClientRect();return q.left>=r.left&&q.right<=r.right&&q.top>=r.top&&q.bottom<=r.bottom;})};});
      report.mobile.push({id,time,file,...layout});
    }
  }
  report.interactions.mobileNoHorizontalOverflow=report.mobile.every(m=>m.noHorizontalOverflow);
  report.interactions.mobileLabelsInside=report.mobile.every(m=>m.labelsInside);await mobile.close();
  report.nonLocalRequests=requests.filter(r=>!r.startsWith(url)&&!r.startsWith('data:')&&!(r.startsWith('blob:')&&new URL(r.slice(5)).origin===new URL(url).origin));
  report.interactions.onlyLocalRequests=report.nonLocalRequests.length===0;
  report.sources={};for(const file of ['three/app.mjs','three/geometry.mjs','three/character/character.mjs','three/character/anatomy.mjs','three/character/regions.mjs','three/character/materials.mjs','three/character/subdivide-hair.mjs','three/character/facial-contour.mjs','three/character/dentition.mjs','three/runtime/camera-rig.mjs','three/runtime/motion.mjs','expressions/studio.mjs'])report.sources[file]=createHash('sha256').update(await readFile(resolve(ROOT,file))).digest('hex');
  report.assets={};for(const entry of await readdir(resolve(ROOT,'three/character/assets'),{withFileTypes:true}))if(entry.isFile()){const file=`three/character/assets/${entry.name}`;report.assets[file]=createHash('sha256').update(await readFile(resolve(ROOT,file))).digest('hex');}
  report.pass=report.scenes.every(s=>s.pass)&&Object.values(report.interactions).every(Boolean)&&errors.length===0;
  await writeFile(resolve(dir,'checks.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({interactions:report.interactions,errors,pass:report.pass},null,2));if(!report.pass)process.exitCode=1;
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
