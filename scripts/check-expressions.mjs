import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { startServer, ROOT } from './serve.mjs';
import { openBrowser } from '../skills/seven-second-storytelling/scripts/render-svg.mjs';

const dir=resolve(ROOT,'qa/expressions');await mkdir(dir,{recursive:true});
const {server,url}=await startServer();const browser=await openBrowser();
const errors=[],requests=[],report={renderer:'Three.js 0.186.1 / Chrome WebGL',duration:5,geometryMethod:'Evaluated GLB skin and morph surface, bone matrices, morph weights and region source vertices; metres.',scenes:[],interactions:{},errors};
const page=await browser.newPage({viewport:{width:1440,height:1080},deviceScaleFactor:1,reducedMotion:'reduce'});
const sourceFiles=[
  'expressions/index.html','expressions/app.mjs','expressions/character-face.mjs','expressions/studio.mjs','expressions/style.css',
  'three/style.css','three/character/character.mjs','three/character/materials.mjs','three/character/regions.mjs','three/character/subdivide-hair.mjs',
  'three/character/assets/adult-female-source.glb','three/character/assets/hair-long.glb','three/character/assets/body-joints.json',
  'three/runtime/camera-rig.mjs','three/runtime/motion.mjs',
  'three/vendor/three.module.js','three/vendor/three.core.js','three/vendor/addons/controls/OrbitControls.js',
  'three/vendor/addons/loaders/GLTFLoader.js','three/vendor/addons/utils/SkeletonUtils.js','three/vendor/addons/utils/BufferGeometryUtils.js',
  'scripts/check-expressions.mjs',
];
function monitor(p){p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('request',r=>requests.push(r.url()));}
monitor(page);
async function pose(time){return page.evaluate(t=>{
  atlas.seek(t);const model=atlas.model,exact=[],featureHashes={};let finite=true,meshCount=0,vertices=0;
  model.group.updateMatrixWorld(true);
  // Imported skinned attributes are rest data. The cached collision surface is
  // the actual body after morph targets and skeletal articulation, in metres.
  const posed=model.pickingMeshes.find(mesh=>mesh.userData.isCollisionSurface);
  if(!posed)throw Error('MUSE must expose its evaluated skinned collision surface for geometric QA');
  const array=posed.geometry.attributes.position.array;
  for(const n of array){finite&&=Number.isFinite(n);exact.push(n);}
  for(const part of model.parts){
    const ids=part.object.userData.sourceVertexIndices||[];let h=2166136261;
    for(const id of ids)for(let k=0;k<3;k++){const n=array[id*3+k];h=Math.imul(h^Math.round(n*1e7),16777619);}
    featureHashes[part.id]=h>>>0;
  }
  model.group.traverse(o=>{
    if(o.isBone)exact.push(...o.matrixWorld.elements);
    if(o.isMesh&&!o.userData.surfaceOverlay){meshCount++;vertices+=o.geometry.attributes.position.count;if(o.morphTargetInfluences)for(const n of o.morphTargetInfluences){finite&&=Number.isFinite(n);exact.push(n);}}
  });
  let hash=2166136261;for(const n of exact){hash=Math.imul(hash^Math.round(n*1e7),16777619);}
  if(t===0)window.__neutralGeometry=exact;
  const exactNeutralMatch=t===5&&exact.length===window.__neutralGeometry?.length&&exact.every((n,i)=>n===window.__neutralGeometry[i]);
  return{hash:hash>>>0,finite,meshCount,vertices,posedVertices:array.length/3,featureHashes,exactNeutralMatch,poseState:model.poseState};
},time);}
try {
  await page.goto(`${url}/expressions/`);await page.waitForFunction(()=>window.atlas);
  report.interactions.reducedMotionStartsPaused=await page.evaluate(()=>!atlas.state.playing&&atlas.state.cameraOwner==='manual');
  for(const id of ['joy','sadness','anger','fear','surprise','disgust','wink','laughter']){
    await page.locator(`[data-study="${id}"]`).click();
    const rest=await pose(0),peak=await pose(2.5),end=await pose(5);
    await pose(4.25);const seekA=await pose(1.37);await pose(.4);const seekB=await pose(1.37);
    const frames=[];
    for(const t of [0,.65,1.5,2.5,3.75,5]){
      await pose(t);const file=`${id}-${t===0?'rest':t===2.5?'peak':`t${t.toFixed(2)}`}.png`;
      await page.screenshot({path:resolve(dir,file),fullPage:true});frames.push({time:t,file});
    }
    for(const view of ['front','threequarter','side']){
      await page.locator(`#${view==='threequarter'?'front':view}`).click();
      if(view==='threequarter'){
        await page.locator('canvas').focus();
        for(let i=0;i<6;i++)await page.keyboard.press('ArrowRight');
      }
      for(const t of [0,2.5]){await pose(t);const file=`${id}-${view}-${t===0?'rest':'peak'}.png`;await page.locator('#viewport').screenshot({path:resolve(dir,file)});}
    }
    await page.locator('#overview').click();
    const localFeaturesChanged=Object.keys(rest.featureHashes).filter(id=>rest.featureHashes[id]!==peak.featureHashes[id]);
    const sceneReport={id,rest,peak,end,localFeaturesChanged,visibleModelChange:localFeaturesChanged.length>=3,loopCloses:end.exactNeutralMatch,deterministicReverseSeek:seekA.hash===seekB.hash,frames,labels:await page.locator('#parts button').count()};
    sceneReport.pass=rest.finite&&peak.finite&&end.finite&&rest.meshCount>5&&sceneReport.visibleModelChange&&sceneReport.loopCloses&&sceneReport.deterministicReverseSeek;
    report.scenes.push(sceneReport);console.log(`${sceneReport.pass?'PASS':'FAIL'} ${id}: actual mesh motion, loop closure, reverse seek; ${sceneReport.labels} selectable structures.`);
  }
  report.interactions.sharedNeutralPortrait=new Set(report.scenes.map(s=>s.rest.hash)).size===1;
  report.interactions.distinctActingPoses=new Set(report.scenes.map(s=>s.peak.hash)).size===8;
  await page.locator('[data-study="wink"]').click();await pose(2.5);
  report.interactions.winkClosesOneEye=await page.evaluate(()=>{
    const p=atlas.model.poseState;
    return p.apertureUnits==='metres'&&p.leftEyeOpen===0&&p.leftAperture<.0005&&!p.leftIrisVisible&&p.rightAperture>.004&&p.rightIrisVisible;
  });
  await pose(5);report.interactions.winkRecoversBothEyes=await page.evaluate(()=>{
    const p=atlas.model.poseState;return p.leftEyeOpen===1&&p.rightEyeOpen===1&&p.leftIrisVisible&&p.rightIrisVisible;
  });
  await page.locator('[data-study="wink"]').click();await page.locator('#parts button[data-part="eyes"]').click();
  report.interactions.selectionAndExplanation=await page.evaluate(()=>atlas.state.selected==='eyes'&&document.getElementById('part-description').textContent.length>20);
  const cameraBefore=await page.evaluate(()=>atlas.state.camera.position);await page.locator('#focus').click();
  report.interactions.frameSelection=JSON.stringify(cameraBefore)!==JSON.stringify(await page.evaluate(()=>atlas.state.camera.position));
  await page.locator('#overview').click();
  const portraitPosition=await page.evaluate(()=>atlas.state.camera.position);
  await page.locator('#wholebody').click();
  report.interactions.fullBodyButton=await page.locator('#wholebody').getAttribute('aria-pressed')==='true'&&JSON.stringify(portraitPosition)!==JSON.stringify(await page.evaluate(()=>atlas.state.camera.position));
  const originalHair=await page.evaluate(()=>atlas.model.character.meshes.filter(m=>m.userData.isHair).flatMap(m=>(Array.isArray(m.material)?m.material:[m.material]).map(a=>({opacity:a.opacity,transparent:a.transparent,depthWrite:a.depthWrite,alphaTest:a.alphaTest,castShadow:m.castShadow}))));
  report.anatomyRegions=[];
  for(const id of ['chest','back','pelvis']){
    await page.locator('#overview').click();await page.locator(`#parts button[data-part="${id}"]`).click();
    const selected=await page.evaluate(id=>{
      const m=atlas.model,part=m.parts.find(p=>p.id===id),body=m.character.body;
      const source=part.surfaceAnchor,indices=body.geometry.index;
      const expected=part.anchor.position.clone().set(0,0,0),point=expected.clone();
      for(let k=0;k<3;k++){body.getVertexPosition(indices.getX(source.faceIndex*3+k),point);expected.addScaledVector(point,source.barycentric[k]);}
      const anchorError=part.anchor.position.distanceTo(expected);
      return{id,selected:atlas.state.selected===id,fullBody:document.getElementById('wholebody').getAttribute('aria-pressed')==='true',visibleOverlay:part.object.visible,sourceFaces:part.object.userData.sourceFaceIndices.length,anchorError,conforms:anchorError<.003,explanation:document.getElementById('part-description').textContent.length>30};
    },id);
    await page.locator('#front').click();
    if(id==='back'){await page.locator('canvas').focus();for(let i=0;i<26;i++)await page.keyboard.press('ArrowRight');}
    await pose(2.5);
    selected.renderedHighlight=await page.evaluate(id=>{
      const canvas=document.querySelector('canvas'),gl=canvas.getContext('webgl2'),width=gl.drawingBufferWidth,height=gl.drawingBufferHeight;
      function pixels(){atlas.render();const data=new Uint8Array(width*height*4);gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,data);return data;}
      atlas.selectPart('');const plain=pixels();atlas.selectPart(id);const selected=pixels();let mintPixels=0,changedPixels=0;
      for(let i=0;i<plain.length;i+=4){const dr=selected[i]-plain[i],dg=selected[i+1]-plain[i+1],db=selected[i+2]-plain[i+2];if(Math.abs(dr)+Math.abs(dg)+Math.abs(db)>12)changedPixels++;if(dg-dr>3&&db-dr>2&&selected[i+1]>selected[i]+5&&selected[i+2]>selected[i]+5)mintPixels++;}
      return{changedPixels,mintPixels,pass:changedPixels>200&&mintPixels>100};
    },id);
    if(id==='back')report.interactions.backHairFades=await page.evaluate(()=>{
      const hair=atlas.model.character.meshes.filter(m=>m.userData.isHair);
      return hair.length>0&&hair.every(m=>!m.castShadow&&(Array.isArray(m.material)?m.material:[m.material]).every(a=>a.opacity<=.15&&a.transparent&&!a.depthWrite))&&document.getElementById('part-description').textContent.includes('Hair fades');
    });
    await page.locator('#viewport').screenshot({path:resolve(dir,`whole-body-${id}.png`)});
    selected.labelVisible=await page.locator('.annotation').filter({hasText:id==='chest'?'Pectoralis region':id==='back'?'Back':'Pelvis'}).isVisible();
    report.anatomyRegions.push(selected);
  }
  report.interactions.anatomySelections=report.anatomyRegions.every(p=>p.selected&&p.fullBody&&p.visibleOverlay&&p.sourceFaces>20&&p.conforms&&p.explanation&&p.labelVisible);
  report.interactions.bodyHighlightsVisible=report.anatomyRegions.every(p=>p.renderedHighlight.pass);
  report.interactions.backHairRestores=JSON.stringify(originalHair)===JSON.stringify(await page.evaluate(()=>atlas.model.character.meshes.filter(m=>m.userData.isHair).flatMap(m=>(Array.isArray(m.material)?m.material:[m.material]).map(a=>({opacity:a.opacity,transparent:a.transparent,depthWrite:a.depthWrite,alphaTest:a.alphaTest,castShadow:m.castShadow})))));
  await page.locator('#overview').click();
  report.interactions.portraitButtonRestoresView=await page.locator('#wholebody').getAttribute('aria-pressed')==='false';
  await page.locator('#parts button[data-part="eyes"]').click();
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
  const live=await browser.newPage({viewport:{width:1280,height:960},reducedMotion:'no-preference'});monitor(live);await live.goto(`${url}/expressions/#joy`);await live.waitForFunction(()=>window.atlas);
  const running0=await live.evaluate(()=>atlas.state);await live.waitForTimeout(700);const running1=await live.evaluate(()=>atlas.state);
  report.interactions.normalMotionAutoplays=running1.playing&&running1.time!==running0.time;
  await live.screenshot({path:resolve(dir,'automatic-playback.png'),fullPage:true});await live.close();
  const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:'reduce'});monitor(mobile);await mobile.goto(`${url}/expressions/#wink`);await mobile.waitForFunction(()=>window.atlas);
  await mobile.evaluate(()=>atlas.seek(2.5));await mobile.screenshot({path:resolve(dir,'mobile-wink.png'),fullPage:true});
  report.interactions.mobileNoHorizontalOverflow=await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
  report.interactions.mobileLabelsInside=await mobile.evaluate(()=>{const r=document.getElementById('viewport').getBoundingClientRect(),labels=[...document.querySelectorAll('.annotation')].filter(b=>!b.hidden);return labels.length>=2&&labels.every(b=>{const q=b.getBoundingClientRect();return q.left>=r.left&&q.right<=r.right&&q.top>=r.top&&q.bottom<=r.bottom;});});
  await mobile.locator('[data-study="surprise"]').click();await mobile.evaluate(()=>atlas.seek(2.5));await mobile.screenshot({path:resolve(dir,'mobile-surprise.png'),fullPage:true});await mobile.close();
  report.interactions.onlyLocalRequests=requests.every(r=>r.startsWith(url)||r.startsWith('data:')||r.startsWith(`blob:${url}`));
  report.sources={};for(const file of sourceFiles)report.sources[file]=createHash('sha256').update(await readFile(resolve(ROOT,file))).digest('hex');
  report.pass=report.scenes.every(s=>s.pass)&&Object.values(report.interactions).every(Boolean)&&errors.length===0;
  await writeFile(resolve(dir,'checks.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({interactions:report.interactions,errors,pass:report.pass},null,2));if(!report.pass)process.exitCode=1;
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
