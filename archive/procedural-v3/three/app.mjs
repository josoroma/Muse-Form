import * as THREE from 'three';
import { createCameraRig } from './runtime/camera-rig.mjs';
import { createTransport } from './runtime/motion.mjs';
import { createBody, createArm } from './upper-body.mjs';
import { createHand } from './hand.mjs';
import { createLeg, createFoot } from './lower-limb.mjs';

const $ = id => document.getElementById(id);
const factories = { body: createBody, arm: createArm, hand: createHand, leg: createLeg, foot: createFoot };
const keys = Object.keys(factories), cache = new Map(), samples = [];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let renderer, active, study = 'body', selected = '', modelBounds, radius = 5, cameraOwner = 'guided';
let transport = createTransport({ duration: 5, loop: true }), lastTime = 0, wasPlaying = false, previousPoseTime = -1;
let labelButtons = [], meshes = [], dirtyLabels = true;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 1, .05, 150);
const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2(), world = new THREE.Vector3();
let rig;

try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.32;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute('aria-label', '3D anatomy. Drag to orbit, scroll to zoom, arrows to rotate, plus or minus to zoom, Home for overview.');
  $('canvas-host').append(renderer.domElement);
  renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); transport.pause(); $('fallback').hidden = false; });
  scene.add(new THREE.HemisphereLight(0xcce0df, 0x30312c, 2.1));
  const key = new THREE.DirectionalLight(0xffedd5, 4.0); key.position.set(-7, 12, 9); scene.add(key);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.camera.left = -12; key.shadow.camera.right = 12; key.shadow.camera.top = 14; key.shadow.camera.bottom = -10; key.shadow.normalBias = .035; key.shadow.bias = -.00012;
  const rim = new THREE.DirectionalLight(0x79afbc, 3.0); rim.position.set(7, 7, -6); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xb9c4f1, .65); fill.position.set(0, 4, 8); scene.add(fill);
  const stage = new THREE.Group(); scene.add(stage);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.ShadowMaterial({ opacity: .24 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; floor.position.y = -.025; stage.add(floor);
  const ringPoints=[];for(let i=0;i<=128;i++){const a=i/128*Math.PI*2;ringPoints.push(new THREE.Vector3(Math.cos(a),0,Math.sin(a)));}
  const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(ringPoints), new THREE.LineBasicMaterial({color:0x59736c,transparent:true,opacity:.3}));ring.position.y=-.02;stage.add(ring);
  const cross = new THREE.Group();stage.add(cross);
  for(const axis of [0,1]) {const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(axis?0:-1.3,0,axis?-1.3:0),new THREE.Vector3(axis?0:1.3,0,axis?1.3:0)]),new THREE.LineDashedMaterial({color:0x456059,transparent:true,opacity:.2,dashSize:.07,gapSize:.10}));line.computeLineDistances();cross.add(line);}cross.position.y=-.018;
  camera.position.set(12, 9, 20);
  rig = createCameraRig(camera, renderer.domElement, { target:[0,4.5,0], radius:6, minDistance:1, maxDistance:60, reducedMotion:reduced.matches, onUserIntent: manual });

  function resize() {
    const { width, height } = $('viewport').getBoundingClientRect(); renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
    if(active) overview(0, false);
    dirtyLabels = true;
  }
  new ResizeObserver(resize).observe($('viewport'));
  function modelInfo(model) {
    model.group.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(model.group), center = bounds.getCenter(new THREE.Vector3()), size = bounds.getSize(new THREE.Vector3());
    return { bounds, center, size, radius: size.length() / 2 };
  }
  function overview(duration = .7, makeManual = true) {
    if(!active)return;
    if(makeManual) manual();
    const bounds=active.motionBounds||modelInfo(active).bounds;
    const center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());
    const mobile=innerWidth<760;
    const direction=new THREE.Vector3(...active.camera.position).sub(new THREE.Vector3(...active.camera.target)).normalize();
    // Fit the height and width independently, retaining useful space above the study.
    const right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),direction).normalize(),up=new THREE.Vector3().crossVectors(direction,right).normalize();
    const tanV=Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),tanH=tanV*camera.aspect;
    let distance=0;
    for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){
      const d=new THREE.Vector3(x,y,z).sub(center),depth=d.dot(direction);
      distance=Math.max(distance,depth+Math.abs(d.dot(right))/tanH,depth+Math.abs(d.dot(up))/tanV);
    }
    distance*=mobile?1.34:1.18;
    const target=center.clone(); target.y+=size.y*(mobile?.06:.025);
    camera.near=.03;camera.far=150;camera.updateProjectionMatrix();
    rig.controls.cursor.copy(target);rig.controls.maxTargetRadius=Math.max(2,size.length());
    rig.focus({position:target.clone().addScaledVector(direction,distance).toArray(),target:target.toArray(),duration});
    active.baseCamera={position:target.clone().addScaledVector(direction,distance),target};
  }
  function manual() { cameraOwner='manual';$('guided').checked=false; rig?.cancelShot();$('camera-status').textContent='Free inspection'; }
  function guideAt(time) {
    if(cameraOwner!=='guided'||!active.baseCamera)return;
    const base=active.baseCamera, offset=base.position.clone().sub(base.target);
    const wave=Math.sin(Math.PI*2*time/5), arc=.14*wave;
    offset.applyAxisAngle(new THREE.Vector3(0,1,0),arc);
    camera.position.copy(base.target).add(offset);rig.controls.target.copy(base.target);
    camera.lookAt(base.target);camera.updateMatrixWorld();
  }
  function updateHighlight() {
    for(const mesh of meshes) for(const mat of Array.isArray(mesh.material)?mesh.material:[mesh.material]) {
      if(!mat.userData.baseColor)continue;
      const isSelected=selected&&mesh.userData.partId===selected;
      mat.color.copy(mat.userData.baseColor);
      if(isSelected)mat.color.set(0x5bbbaa);
      if(mat.emissive){mat.emissive.set(isSelected?0x143f35:0x000000);mat.emissiveIntensity=isSelected?.14:0;}
    }
    for(const button of $('parts').querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.part===selected));
    dirtyLabels=true;
  }
  function selectPart(id, announce=true) {
    const part=active.parts.find(p=>p.id===id);selected=part?id:'';
    $('part-name').textContent=part?.name||'Select a structure';
    $('part-description').textContent=part?.description||'Choose a label or a form to follow its role in the movement.';
    $('focus').disabled=!part;
    if(announce)$('announcement').textContent=part?`${part.name}. ${part.description}`:'Selection cleared.';
    updateHighlight();render();
  }
  function setStudy(id, autoplay=!reduced.matches) {
    if(!factories[id])return;
    transport.pause();if(active)scene.remove(active.group);
    study=id;if(!cache.has(id))cache.set(id,factories[id]());active=cache.get(id);scene.add(active.group);
    if(!active.motionBounds){
      active.motionBounds=new THREE.Box3();
      for(const t of [0,1.25,2.5,3.75,5]){active.update(t);active.group.updateMatrixWorld(true);active.motionBounds.union(new THREE.Box3().setFromObject(active.group));}
    }
    active.update(0);active.group.updateMatrixWorld(true);previousPoseTime=0;
    ({bounds:modelBounds,radius}=modelInfo(active));
    floor.position.y=modelBounds.min.y-.025;ring.position.y=floor.position.y+.005;cross.position.y=floor.position.y+.006;
    const span=Math.max(modelBounds.max.x-modelBounds.min.x,modelBounds.max.z-modelBounds.min.z)*.85;
    ring.scale.setScalar(span);cross.scale.setScalar(span);ring.position.x=cross.position.x=0;
    meshes=[];active.group.traverse(obj=>{if(obj.isMesh){meshes.push(obj);obj.castShadow=obj.receiveShadow=true;for(const mat of Array.isArray(obj.material)?obj.material:[obj.material]){if(mat.color&&!mat.userData.baseColor)mat.userData.baseColor=mat.color.clone();}}});
    $('scene-number').textContent=`STUDY ${String(keys.indexOf(id)+1).padStart(2,'0')} / ${active.subtitle.toUpperCase()}`;
    $('scene-title').textContent=active.title;
    document.querySelectorAll('[data-study]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.study===id)));
    $('parts').replaceChildren(...active.parts.map(p=>{const button=document.createElement('button');button.textContent=p.name;button.dataset.part=p.id;button.setAttribute('aria-pressed','false');button.onclick=()=>selectPart(p.id);return button;}));
    $('beat-buttons').replaceChildren(...active.beats.map((beat,i)=>{const b=document.createElement('button');b.textContent=String(i+1).padStart(2,'0');b.title=beat.label;b.setAttribute('aria-label',`Show ${beat.label}`);b.onclick=()=>seek(beat.time);return b;}));
    transport=createTransport({duration:5,loop:$('loop').checked});if(autoplay)transport.play();
    cameraOwner=reduced.matches?'manual':'guided';$('guided').checked=!reduced.matches;$('camera-status').textContent=reduced.matches?'Free inspection':'Guided view';
    overview(0,false);
    const defaults={body:'chest',arm:'biceps',hand:'thenar',leg:'leg-quadriceps',foot:'foot-instep'};
    selectPart(active.parts.some(p=>p.id===defaults[id])?defaults[id]:active.parts[0].id,false);
    history.replaceState(null,'',`#${id}`);$('announcement').textContent=`${id} study. ${active.subtitle}.`;render();
  }
  function rebuildLabels() {
    const chosen=active.parts.find(p=>p.id===selected);
    const list=[chosen,...active.parts.filter(p=>p!==chosen)].filter(Boolean).slice(0,innerWidth<760?2:3);
    $('labels').replaceChildren();$('leaders').replaceChildren();
    labelButtons=list.map((part,index)=>{
      const button=document.createElement('button');button.className=`annotation${part.id===selected?' selected':''}`;button.textContent=part.name;button.onclick=()=>selectPart(part.id);$('labels').append(button);
      const path=document.createElementNS('http://www.w3.org/2000/svg','path'),dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.setAttribute('r','3');$('leaders').append(path,dot);return{part,index,button,path,dot};
    });dirtyLabels=false;
  }
  function updateLabels() {
    if(dirtyLabels)rebuildLabels();
    const visible=$('show-labels').checked;$('labels').hidden=!visible;$('leaders').style.display=visible?'':'none';if(!visible)return;
    const rect=$('viewport').getBoundingClientRect(),used=[];
    for(const l of labelButtons) {
      l.part.anchor.getWorldPosition(world);const projected=world.clone().project(camera);
      const px=(projected.x*.5+.5)*rect.width,py=(-projected.y*.5+.5)*rect.height;
      const hide=projected.z>1||projected.z< -1||px<12||px>rect.width-12||py<100||py>rect.height-65;
      l.button.hidden=hide;l.path.style.display=l.dot.style.display=hide?'none':'';if(hide)continue;
      const width=l.button.offsetWidth||140,height=31;
      const right=px>rect.width*.50;
      let x=right?Math.min(rect.width-width-20,px+48):Math.max(20,px-width-48),y=Math.max(145,Math.min(rect.height-115,py-17));
      for(const r of used)if(x<r.x+r.w+10&&x+width>r.x-10&&Math.abs(y-r.y)<height+12)y=r.y+height+12;
      y=Math.min(rect.height-105,y);used.push({x,y,w:width});
      l.button.style.left=`${x}px`;l.button.style.top=`${y}px`;
      const endX=right?x:x+width,endY=y+height/2;
      l.path.setAttribute('d',`M${px},${py} L${endX+(right?-12:12)},${endY} L${endX},${endY}`);
      l.dot.setAttribute('cx',px);l.dot.setAttribute('cy',py);
      // Dim labels anchored behind the visible surface instead of claiming an exposed structure.
      const direction=world.clone().sub(camera.position),distance=direction.length();raycaster.set(camera.position,direction.normalize());
      const hit=raycaster.intersectObjects(meshes,false)[0];const occluded=hit&&hit.distance<distance-radius*.025&&hit.object.userData.partId!==l.part.id;
      l.button.style.opacity=occluded?'.48':'1';l.path.style.opacity=occluded?'.25':'.7';
    }
  }
  function updateUI(time,playing) {
    $('timeline').value=time;$('clock').innerHTML=`${time.toFixed(2)} <span>/ 5.00</span>`;
    $('play').innerHTML=playing?'Ⅱ <span>Pause</span>':'▶ <span>Play</span>';$('play').setAttribute('aria-label',playing?'Pause motion':'Play motion');
    let i=0;active.beats.forEach((b,n)=>{if(time>=b.time)i=n;});const beat=active.beats[i];
    $('beat-count').textContent=`${String(i+1).padStart(2,'0')} / ${String(active.beats.length).padStart(2,'0')}`;
    $('beat-title').textContent=beat.label;$('beat-description').textContent=beat.description;
    [...$('beat-buttons').children].forEach((b,n)=>{b.classList.toggle('active',n===i);b.setAttribute('aria-pressed',String(n===i));});
    const metrics=active.metrics?.(time)||[];
    $('metrics').replaceChildren(...metrics.map(m=>{const el=document.createElement('div');el.className='metric';const label=document.createElement('span'),value=document.createElement('strong');label.textContent=m.label;value.textContent=m.value;el.append(label,value);return el;}));
  }
  function render() {
    if(!active)return;
    const {time,playing}=transport.getState();
    if(time!==previousPoseTime){active.update(time);previousPoseTime=time;}
    guideAt(time);active.group.updateMatrixWorld(true);camera.updateMatrixWorld(true);updateLabels();updateUI(time,playing);renderer.render(scene,camera);
  }
  function seek(time) {transport.pause();transport.seek(time);render();}
  $('play').onclick=()=>{transport.toggle();render();};$('restart').onclick=()=>{transport.seek(0);if(!reduced.matches)transport.play();render();};
  $('timeline').oninput=e=>seek(Number(e.target.value));
  $('loop').onchange=()=>{const state=transport.getState();transport=createTransport({duration:5,time:state.time,loop:$('loop').checked});if(state.playing)transport.play();render();};
  $('guided').onchange=()=>{if($('guided').checked){rig.cancelShot();cameraOwner='guided';$('camera-status').textContent='Guided view';overview(0,false);}else manual();render();};
  $('show-labels').onchange=()=>render();
  $('overview').onclick=()=>overview();$('zoom-in').onclick=()=>{rig.zoomBy(1.2);render();};$('zoom-out').onclick=()=>{rig.zoomBy(1/1.2);render();};
  for(const [id,dir] of [['front',[0,.14,1]],['side',[1,.16,0]]])$(id).onclick=()=>{manual();const bounds=active.motionBounds||modelInfo(active).bounds,center=bounds.getCenter(new THREE.Vector3()),r=bounds.getSize(new THREE.Vector3()).length()/2;rig.fit({center:center.toArray(),radius:r*.90,direction:dir,duration:.7});};
  $('focus').onclick=()=>{const part=active.parts.find(p=>p.id===selected);if(!part)return;manual();const bounds=new THREE.Box3().setFromObject(part.object),center=bounds.getCenter(new THREE.Vector3());const r=Math.max(.45,bounds.getSize(new THREE.Vector3()).length()*.55);rig.fit({center:center.toArray(),radius:Math.min(r,radius*.75),duration:.8});};
  $('clear-selection').onclick=()=>selectPart('');document.querySelectorAll('[data-study]').forEach(b=>b.onclick=()=>setStudy(b.dataset.study));
  $('about').onclick=()=>$('about-dialog').showModal();$('close-about').onclick=()=>$('about-dialog').close();
  let down;
  renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});
  renderer.domElement.addEventListener('pointerup',e=>{
    if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)return;
    const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);
    const hit=raycaster.intersectObjects(meshes,false).find(h=>h.object.userData.partId&&active.parts.some(p=>p.id===h.object.userData.partId));if(hit)selectPart(hit.object.userData.partId);
  });
  renderer.domElement.addEventListener('keydown',e=>{
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();manual();const offset=camera.position.clone().sub(rig.controls.target);if(e.key==='ArrowLeft'||e.key==='ArrowRight')offset.applyAxisAngle(new THREE.Vector3(0,1,0),e.key==='ArrowLeft'?-.12:.12);else offset.applyAxisAngle(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0),e.key==='ArrowUp'?-.08:.08);camera.position.copy(rig.controls.target).add(offset);rig.controls.update();render();}
    if(e.key==='+'||e.key==='='){e.preventDefault();rig.zoomBy(1.2);}if(e.key==='-'){e.preventDefault();rig.zoomBy(1/1.2);}if(e.key==='Home'){e.preventDefault();overview();}
  });
  document.addEventListener('keydown',e=>{if(e.target.matches('input,button,a,canvas')||$('about-dialog').open)return;if(e.code==='Space'){e.preventDefault();transport.toggle();render();}if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();seek(transport.getState().time+(e.key==='ArrowLeft'?-.1:.1));}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){wasPlaying=transport.getState().playing;transport.pause();}else{lastTime=0;if(wasPlaying)transport.play();}});
  reduced.addEventListener('change',()=>{rig.setReducedMotion(reduced.matches);if(reduced.matches){transport.pause();manual();}render();});
  function tick(now) {
    requestAnimationFrame(tick);if(document.hidden)return;
    const dt=lastTime?Math.min((now-lastTime)/1000,.08):0;lastTime=now;transport.update(dt);
    if(cameraOwner==='manual')rig.update(dt);
    const before=performance.now();render();samples.push(performance.now()-before);if(samples.length>120)samples.shift();
  }
  resize();setStudy(keys.includes(location.hash.slice(1))?location.hash.slice(1):'body');requestAnimationFrame(tick);
  // A small inspection API supports reproducible browser QA, without bypassing UI behavior.
  window.atlas={setStudy,seek,selectPart,render,get model(){return active;},get camera(){return camera;},get state(){return{study,selected,cameraOwner,...transport.getState(),camera:rig.getState(),drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,meanRenderMs:samples.reduce((a,b)=>a+b,0)/Math.max(1,samples.length)};}};
} catch(error) {
  console.error(error);$('fallback').hidden=false;$('play').disabled=true;
}
