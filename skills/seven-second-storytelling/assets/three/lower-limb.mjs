import * as THREE from 'three';

// Original, deliberately simplified surface studies. No anatomical scan data.
// All coordinates are metres-of-the-study: Y up, Z anterior, sole near Y=0.
const TAU = Math.PI * 2;
const mat = () => new THREE.MeshStandardMaterial({ color: 0x899b9b, roughness: .68, metalness: .12, side: THREE.DoubleSide });
const lineMat = () => new THREE.LineBasicMaterial({ color: 0x344e52, transparent: true, opacity: .38 });
const smooth = x => { x = THREE.MathUtils.clamp(x, 0, 1); return x*x*(3-2*x); };
const bell = (x,c,w) => Math.exp(-(((x-c)/w)**2));
const cyclic = t => ((t % 5) + 5) % 5;
function action(t) {
  t = cyclic(t);
  if (t < .55) return 0;
  if (t < 2.05) return smooth((t-.55)/1.5);
  if (t < 2.65) return 1;
  if (t < 4.5) return 1-smooth((t-2.65)/1.85);
  return 0;
}
function interpolate(knots, x) {
  let i=0;
  while (i < knots.length-2 && knots[i+1][0] < x) i++;
  const a=knots[i], b=knots[i+1];
  const s=THREE.MathUtils.clamp((x-a[0])/(b[0]-a[0]),0,1);
  // Cardinal interpolation keeps the silhouette smooth through measuring rings.
  const out=[];
  for(let j=1;j<a.length;j++) {
    const p=knots[Math.max(0,i-1)], q=knots[Math.min(knots.length-1,i+2)];
    const m0=(b[j]-p[j])/(b[0]-p[0])*(b[0]-a[0]);
    const m1=(q[j]-a[j])/(q[0]-a[0])*(b[0]-a[0]);
    out.push((2*s**3-3*s*s+1)*a[j]+(s**3-2*s*s+s)*m0+(-2*s**3+3*s*s)*b[j]+(s**3-s*s)*m1);
  }
  return out;
}
function surfaceMesh(surface, range=[0,1,0,TAU], nu=56, nv=56, reversed=false) {
  const [u0,u1,v0,v1]=range, pos=[], norms=[], idx=[];
  const du=(u1-u0)*.0005, dv=.0005;
  for(let i=0;i<=nu;i++) for(let j=0;j<=nv;j++) {
    const u=u0+(u1-u0)*i/nu, v=v0+(v1-v0)*j/nv;
    const p=surface(u,v), a=surface(u-du,v), b=surface(u+du,v), c=surface(u,v-dv), d=surface(u,v+dv);
    const U=b.sub(a), V=d.sub(c);
    const n=new THREE.Vector3().crossVectors(V,U).normalize();
    if(reversed) n.negate();
    pos.push(p.x,p.y,p.z); norms.push(n.x,n.y,n.z);
  }
  for(let i=0;i<nu;i++) for(let j=0;j<nv;j++) {
    const a=i*(nv+1)+j,b=a+nv+1,c=b+1,d=a+1;
    if(reversed) idx.push(a,b,c,a,c,d); else idx.push(a,c,b,a,d,c);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  geometry.setAttribute('normal',new THREE.Float32BufferAttribute(norms,3));
  geometry.setIndex(idx); geometry.computeBoundingSphere();
  const mesh=new THREE.Mesh(geometry,mat());
  mesh.castShadow=true; mesh.receiveShadow=true;
  mesh.userData.restPositions=new Float32Array(pos);
  mesh.userData.restNormals=new Float32Array(norms);
  return mesh;
}
function tag(object,id) { object.traverse(o=>{if(o.isMesh) o.userData.partId=id;}); }
function marker(parent,position) { const a=new THREE.Object3D();a.position.set(...position);parent.add(a);return a; }
function part(parent,id,name,description,object,position) {
  parent.add(object);tag(object,id);
  return {id,name,description,object,anchor:marker(parent,position)};
}
function arc(parent,points) {
  const c=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(c.getPoints(48)),lineMat());
  parent.add(line);return line;
}

const FOOT_RINGS=[
  // u, width, dorsal/front YZ, plantar/back YZ. A single curved loft joins
  // the Achilles/heel to the instep; its front profile never folds backward.
  [0,.29,1.70,-.31,1.70,-.93],
  [.12,.285,1.30,-.32,1.30,-.94],
  [.25,.31,1.05,-.36,.92,-1.03],
  [.38,.43,.82,-.12,.04,-.99],
  [.50,.47,.68,.10,.012,-.34],
  [.64,.56,.52,.28,.02,.15],
  [.78,.69,.43,.65,.012,.65],
  [.90,.61,.36,1.02,.025,1.02],
  [1,.015,.165,1.28,.135,1.28]
];
function footSurface(u,theta,offset=0,ankleHeight=1.70) {
  let [rx,fy,fz,by,bz]=interpolate(FOOT_RINGS,u);
  if(u<.25 && ankleHeight<1.5) {
    fy=THREE.MathUtils.lerp(ankleHeight,1.05,smooth(u/.25));
    by=THREE.MathUtils.lerp(ankleHeight,.92,smooth(u/.25));
  }
  if(u<.12) rx-=.022*(1-smooth(u/.12))*(ankleHeight<1.5?1:0);
  const dy=(fy-by)*.5,dz=(fz-bz)*.5,length=Math.hypot(dy,dz);
  let x=Math.sin(theta)*(rx+offset), y=(fy+by)*.5+Math.cos(theta)*(dy+offset*dy/length);
  const z=(fz+bz)*.5+Math.cos(theta)*(dz+offset*dz/length);
  // The medial arch lifts the plantar edge; the lateral border remains lower.
  const medial=smooth((-Math.sin(theta)-.15)/.75);
  const plantar=smooth((-Math.cos(theta)+.1)/.9);
  y += .23*bell(z,-.18,.52)*medial*plantar*smooth((u-.38)/.15);
  y = Math.max(.012,y);
  const p=new THREE.Vector3(x,y,z);
  if(ankleHeight<1.5 && u<.08) p.lerp(legSurface(ankleHeight-u*2,theta,offset),1-smooth(u/.08));
  return p;
}
const TOES=[
  {x:-.47,z:.99,l:.76,w:.181,h:.164,name:'Great toe'},
  {x:-.125,z:1.05,l:.80,w:.127,h:.142,name:'Second toe'},
  {x:.145,z:1.04,l:.70,w:.116,h:.133,name:'Third toe'},
  {x:.385,z:.95,l:.57,w:.103,h:.123,name:'Fourth toe'},
  {x:.585,z:.79,l:.45,w:.092,h:.111,name:'Fifth toe'}
];
function toeSurface(toe,u,theta) {
  u=THREE.MathUtils.clamp(u,0,1);
  const tip=Math.sqrt(Math.max(.0001,1-((Math.max(0,u-.64))/.36)**2));
  const taper=(1-.20*u)*(u<.09 ? .88+.12*smooth(u/.09) : 1)*tip;
  const centerY=toe.h+.012-.016*u-.012*Math.sin(Math.PI*u);
  return new THREE.Vector3(toe.x+Math.sin(theta)*toe.w*taper,Math.max(.012,centerY+Math.cos(theta)*toe.h*taper),toe.z+toe.l*u);
}
function makeFoot(prefix='foot',ankleHeight=1.70) {
  const group=new THREE.Group(), bodyPivot=new THREE.Group();
  group.add(bodyPivot);
  bodyPivot.position.set(0,.24,1.00);
  const body=new THREE.Group();body.position.set(0,-.24,-1.00);bodyPivot.add(body);
  const parts=[];
  const shell=surfaceMesh((u,v)=>footSurface(u,v,0,ankleHeight),[0,1,0,TAU],90,64,true);
  parts.push(part(body,`${prefix}-midfoot`,'Foot contour','The continuous foot surface connects heel, midfoot and forefoot. Its medial arch rises between the heel and the ball of the foot.',shell,[-.48,.35,-.12]));
  const heel=surfaceMesh((u,v)=>footSurface(u,v,.003,ankleHeight),[.27,.50,Math.PI*.55,Math.PI*1.45],22,32,true);
  parts.push(part(body,`${prefix}-heel`,'Calcaneal region','The heel rises as the body rolls over the supporting forefoot.',heel,[.20,.45,-1.11]));
  const dorsum=surfaceMesh((u,v)=>footSurface(u,v,.003,ankleHeight),[.29,.80,-.92,.92],30,28,true);
  parts.push(part(body,`${prefix}-instep`,'Dorsum of foot','The instep slopes from the ankle toward the metatarsals.',dorsum,[.05,.73,-.08]));
  const ball=surfaceMesh((u,v)=>footSurface(u,v,.003,ankleHeight),[.80,.96,Math.PI*.38,Math.PI*1.62],15,36,true);
  parts.push(part(body,`${prefix}-forefoot`,'Metatarsal support','The ball of the foot carries the support as the heel lifts.',ball,[.54,.28,.91]));
  const toes=[], toeMeshes=[];
  TOES.forEach((toe,i)=>{
    const m=surfaceMesh((u,v)=>toeSurface(toe,u,v),[0,1,0,TAU],30,32,true);
    toeMeshes.push(m);
    const p=part(group,`${prefix}-toe-${i+1}`,toe.name,i===0?'The great toe has two phalanges and a broad supporting pad.':'The smaller toes each have three phalanges; their lengths step down toward the lateral border.',m,[toe.x,.36,toe.z+toe.l*.67]);
    toes.push(p);
    // A single dorsal joint crease and a fine nail margin supply scale without noise.
    const crease=[];
    for(let n=0;n<=12;n++) {
      const theta=-1.0+2*n/12;
      const p=toeSurface(toe,i===0?.56:.48,theta);
      p.y+=.004; crease.push(p.toArray());
    }
    arc(group,crease);
    const nail=[];
    for(let n=0;n<=32;n++) {
      const a=TAU*n/32;
      const u=.78+.115*Math.cos(a), x=toe.x+toe.w*.57*Math.sin(a);
      const p=toeSurface(toe,u,Math.asin(THREE.MathUtils.clamp((x-toe.x)/(toe.w*(1-.20*u)), -.9,.9)));
      p.y+=.006; nail.push(p.toArray());
    }
    arc(group,nail);
  });
  const toesGroup=new THREE.Group();
  // A semantic collection for a leg view; the isolated foot lists all five digits.
  for(const p of toes) {group.remove(p.object);toesGroup.add(p.object);}
  group.add(toesGroup);
  const toePart={id:`${prefix}-toes`,name:'Phalanges',description:'Five toes provide distinct contact points; the great toe is broader and the outer toes shorten.',object:toesGroup,anchor:marker(group,[-.18,.40,1.78])};
  function update(angle) {
    bodyPivot.rotation.x=angle;
    // Toe tips stay in contact. Their short proximal region follows the rolling ball.
    const c=Math.cos(angle),s=Math.sin(angle);
    for(const mesh of toeMeshes) {
      const rest=mesh.userData.restPositions, dst=mesh.geometry.attributes.position.array;
      const toe=TOES[toeMeshes.indexOf(mesh)];
      for(let i=0;i<rest.length;i+=3) {
        const x=rest[i], y=rest[i+1], z=rest[i+2];
        const u=(z-toe.z)/toe.l, w=1-smooth(u/.43);
        const Y=(y-.24)*c-(z-1)*s+.24, Z=(y-.24)*s+(z-1)*c+1;
        dst[i]=x; dst[i+1]=Math.max(.012,THREE.MathUtils.lerp(y,Y,w));dst[i+2]=THREE.MathUtils.lerp(z,Z,w);
      }
      mesh.geometry.attributes.position.needsUpdate=true;
      mesh.geometry.computeVertexNormals();
    }
  }
  function bendAnkle(amount) {
    body.traverse(mesh=>{
      if(!mesh.isMesh||!mesh.userData.restPositions)return;
      const src=mesh.userData.restPositions,dst=mesh.geometry.attributes.position.array;
      for(let i=0;i<src.length;i+=3){const p=bendPoint(src[i],src[i+1],src[i+2],amount);dst[i]=p.x;dst[i+1]=p.y;dst[i+2]=p.z;}
      mesh.geometry.attributes.position.needsUpdate=true;mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingSphere();
    });
  }
  return {group,parts,toes,toePart,update,bendAnkle,bodyPivot,body};
}

const LEG_RINGS=[
  [.72,.245,.285,-.62],[1.02,.26,.30,-.62],[1.35,.285,.31,-.62],
  [1.90,.34,.38,-.66],[2.50,.48,.52,-.71],[3.03,.55,.56,-.73],
  [3.48,.47,.48,-.67],[3.92,.38,.38,-.60],[4.23,.405,.405,-.57],
  [4.55,.44,.43,-.60],[5.04,.52,.49,-.61],[5.65,.66,.58,-.62],
  [6.35,.78,.65,-.64],[7.12,.86,.71,-.64],[7.72,.85,.72,-.62],[8.2,.79,.69,-.60]
];
function legSurface(y,theta,offset=0) {
  const [rx,rz,z0]=interpolate(LEG_RINGS,y);
  const a=Math.atan2(Math.sin(theta),Math.cos(theta));
  // Continuous silhouette; soft asymmetries suggest muscle masses, not separate balloons.
  const quad=.040*bell(y,6.4,1.15)*(bell(a,-.60,.47)+.70*bell(a,.65,.50));
  const tear=.038*bell(y,4.82,.48)*bell(a,-.72,.40);
  const tibial=.033*bell(y,2.55,1.02)*bell(a,.06,.18);
  const calf=.047*(bell(y,3.0,.55)*bell(a,2.66,.46)+bell(y,2.82,.72)*bell(a,-2.63,.48));
  const r=offset+quad+tear+tibial+calf;
  return new THREE.Vector3(Math.sin(theta)*(rx+r),y,z0+Math.cos(theta)*(rz+r));
}
function bendPoint(x,y,z,amount) {
  const shin=.30*amount, thigh=-.39*amount;
  const ankleY=1.06, ankleZ=-.62, kneeY=4.23, kneeZ=-.57;
  // Fixed ankle attachment; the small blend below the joint keeps heel contact continuous.
  const ang=shin*smooth((y-.78)/.55), cs=Math.cos(ang),ss=Math.sin(ang);
  const lowY=ankleY+(y-ankleY)*cs-(z-ankleZ)*ss;
  const lowZ=ankleZ+(y-ankleY)*ss+(z-ankleZ)*cs;
  const c=Math.cos(shin),s=Math.sin(shin);
  const ky=ankleY+(kneeY-ankleY)*c-(kneeZ-ankleZ)*s;
  const kz=ankleZ+(kneeY-ankleY)*s+(kneeZ-ankleZ)*c;
  const ct=Math.cos(thigh),st=Math.sin(thigh);
  const highY=ky+(y-kneeY)*ct-(z-kneeZ)*st;
  const highZ=kz+(y-kneeY)*st+(z-kneeZ)*ct;
  const w=smooth((y-3.93)/.62);
  return new THREE.Vector3(x,THREE.MathUtils.lerp(lowY,highY,w),THREE.MathUtils.lerp(lowZ,highZ,w));
}
export function createLeg() {
  const group=new THREE.Group(), meshes=[], movingAnchors=[], parts=[];
  const foot=makeFoot('leg',1.10); group.add(foot.group);
  const shell=surfaceMesh((y,a)=>legSurface(y,a),[1.10,8.2,0,TAU],96,64);
  meshes.push(shell);
  const contour=part(group,'leg-contour','Leg contour','The thigh, knee and lower leg maintain one continuous form through the bend.',shell,[.71,6.4,-.58]);
  parts.push(contour);movingAnchors.push([contour.anchor,contour.anchor.position.clone()]);
  const specs=[
    ['quadriceps','Quadriceps','The anterior thigh group extends the knee and controls the lowering phase.',[4.56,8.17,-1.33,1.33],[.18,6.30,.02]],
    ['patella','Patellar region','The patella lies at the front of the knee; the surface turns with the knee angle.',[3.94,4.60,-.72,.72],[0,4.25,-.13]],
    ['tibial-ridge','Tibial ridge','The anterior border of the tibia reads as a quiet plane down the shin.',[1.27,3.92,-.22,.30],[.03,2.28,-.24]],
    ['calf','Gastrocnemius','The two superficial calf heads taper toward the Achilles tendon.',[1.76,3.96,1.45,4.83],[.38,2.90,-1.13]],
    ['achilles','Achilles tendon','The Achilles tendon continues the calf toward its attachment on the heel.',[1.10,1.94,2.57,3.70],[.02,1.27,-.94]]
  ];
  for(const [id,name,description,range,position] of specs) {
    const mesh=surfaceMesh((y,a)=>legSurface(y,a,.005),range,40,32);
    meshes.push(mesh);
    const p=part(group,`leg-${id}`,name,description,mesh,position);
    parts.push(p);movingAnchors.push([p.anchor,p.anchor.position.clone()]);
  }
  const topCap=new THREE.Mesh(new THREE.CircleGeometry(1,64),mat());
  topCap.rotation.x=-Math.PI/2;topCap.scale.set(.79,.69,1);topCap.position.set(0,8.2,-.60);group.add(topCap);tag(topCap,'leg-contour');
  // The upper attachment is also exported for integration into a body study.
  const hipAnchor=marker(group,[0,8.2,-.60]);
  parts.push(...foot.parts,foot.toePart);
  tag(foot.toePart.object,foot.toePart.id);
  let last=-1;
  function update(t) {
    const q=action(t);if(Math.abs(q-last)<1e-7)return;last=q;
    foot.bendAnkle(q);
    for(const mesh of meshes) {
      const src=mesh.userData.restPositions, dst=mesh.geometry.attributes.position.array;
      for(let i=0;i<src.length;i+=3) {
        const p=bendPoint(src[i],src[i+1],src[i+2],q);
        dst[i]=p.x;dst[i+1]=p.y;dst[i+2]=p.z;
      }
      mesh.geometry.attributes.position.needsUpdate=true;
      mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingSphere();
    }
    for(const [a,p] of movingAnchors)a.position.copy(bendPoint(p.x,p.y,p.z,q));
    hipAnchor.position.copy(bendPoint(0,8.2,-.60,q));
    topCap.position.copy(hipAnchor.position);topCap.rotation.x=-Math.PI/2-.39*q;
  }
  update(0);
  return {
    group,parts,hipAnchor,update,
    camera:{target:[0,4.0,-.20],position:[9,5.6,12]},
    title:'Load & recover',subtitle:'The leg · one continuous line of support',
    beats:[
      {time:0,label:'Stand',description:'The foot remains grounded beneath a long, quiet leg.'},
      {time:1.3,label:'Load',description:'The knee moves forward as the thigh folds above it.'},
      {time:2.35,label:'Control',description:'The anterior thigh controls the held bend.'},
      {time:3.6,label:'Recover',description:'Thigh and shin return together without sliding the foot.'}
    ],
    metrics:t=>[{label:'Knee flexion',value:`${Math.round(action(t)*39.5)}°`},{label:'Foot contact',value:'Grounded'},{label:'Cycle',value:'5.0 s'}]
  };
}

export function createFoot() {
  const foot=makeFoot('foot');
  const ankle=surfaceMesh((u,theta)=>footSurface(u,theta,.003),[0,.23,0,TAU],36,48,true);
  const anklePart=part(foot.body,'foot-ankle','Ankle region','The ankle narrows above the heel, with the malleoli defining its side contours.',ankle,[.27,1.15,-.65]);
  const cap=new THREE.Mesh(new THREE.CircleGeometry(1,48),mat());
  cap.rotation.x=-Math.PI/2;cap.scale.set(.29,.31,1);cap.position.set(0,1.70,-.62);
  foot.body.add(cap);tag(cap,'foot-ankle');
  let last=-1;
  function update(t) {const q=action(t);if(Math.abs(q-last)<1e-7)return;last=q;foot.update(q*.36);}
  update(0);
  return {
    group:foot.group,parts:[anklePart,...foot.parts,...foot.toes],update,
    camera:{target:[0,.66,.15],position:[5.2,3.8,6.8]},
    title:'From heel to forefoot',subtitle:'The foot · a controlled rise over a stable base',
    beats:[
      {time:0,label:'Settle',description:'Heel, forefoot and toes establish a broad support.'},
      {time:1.3,label:'Roll',description:'The heel lifts while pressure moves toward the metatarsal heads.'},
      {time:2.35,label:'Rise',description:'The toe tips remain planted as the proximal toes extend.'},
      {time:3.6,label:'Lower',description:'The arch and heel return in a controlled recovery.'}
    ],
    metrics:t=>[{label:'Heel rise',value:`${Math.round(action(t)*20.6)}°`},{label:'Digits',value:'5 articulated'},{label:'Support',value:'Forefoot + toes'}]
  };
}
