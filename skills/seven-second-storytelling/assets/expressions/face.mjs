import * as THREE from 'three';
import {createPortraitMaterials, createHair, createFeatureHairs, captureRestPositions} from './face-detail.mjs';

/**
 * An original procedural portrait. The face is a continuous, locally sculpted
 * surface with open eye and mouth boundaries, not an assembly of facial balls.
 * All expression coordinates are derived from a neutral pose and absolute time.
 */
export const EXPRESSION_IDS = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'wink', 'laughter'];
export const EXPRESSIONS = {
  joy: { title: 'A quiet joy', subtitle: 'Cheek lift · soft eyes · rising corners', action: 'Smile', detail: 'The mouth corners lift and widen while the cheeks rise into the lower lids.', smile: 1, cheek: 1, squint: .24, open: .11, brow: .035, inner: 0, wide: .03, tilt: -.025 },
  sadness: { title: 'A tender sadness', subtitle: 'Inner brow lift · lowered corners', action: 'Feel', detail: 'The inner brows rise and draw together; the mouth corners fall and the gaze softens.', smile: -.63, cheek: -.1, squint: .15, open: .018, brow: -.025, inner: .17, tilt: .035 },
  anger: { title: 'Contained anger', subtitle: 'Brow draw · focused lids · firm lips', action: 'Focus', detail: 'The inner brows draw down toward the bridge; the lids narrow and the lips press together.', smile: -.22, cheek: .15, squint: .38, open: -.012, brow: -.03, inner: -.13, tilt: -.025 },
  fear: { title: 'A moment of fear', subtitle: 'Raised brows · wide eyes · stretched lips', action: 'Startle', detail: 'Raised inner brows and widened eyes accompany a stretched, slightly open mouth.', smile: -.35, cheek: -.1, squint: -.38, open: .20, brow: .105, inner: .10, wide: .11, tilt: .025 },
  surprise: { title: 'Open wonder', subtitle: 'Brow lift · rounded mouth · open eyes', action: 'Wonder', detail: 'Both brows lift, the upper lids rise and the jaw opens beneath a rounded mouth.', smile: 0, cheek: .02, squint: -.45, open: .39, brow: .15, inner: .035, round: .27, tilt: -.035 },
  disgust: { title: 'A passing distaste', subtitle: 'Nose wrinkle · upper lip lift · narrowed eyes', action: 'Recoil', detail: 'The upper lip rises asymmetrically and the nose wings lift; the eyes narrow with the cheek.', smile: -.2, cheek: .6, squint: .32, open: .075, brow: -.035, inner: -.045, sneer: .14, tilt: .05 },
  wink: { title: 'A knowing wink', subtitle: 'One closing lid · cheek lift · half smile', action: 'Wink', detail: 'One aperture closes fully over its iris. The same cheek lifts into a small asymmetric smile.', smile: .65, cheek: .65, squint: .08, open: .025, brow: .025, inner: .01, wink: 1, tilt: -.045 },
  laughter: { title: 'Uncontained delight', subtitle: 'Open smile · lifted cheeks · delighted eyes', action: 'Laugh', detail: 'The jaw releases beneath an open smile; lifted cheeks narrow both eyes and the head rises gently.', smile: 1.35, cheek: 1.2, squint: .73, open: .35, brow: .035, inner: .015, wide: .04, tilt: -.025 }
};

const clamp = THREE.MathUtils.clamp;
const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const gauss = (x, m, s) => Math.exp(-(((x - m) / s) ** 2));
const skinColor = 0xc4aca0;
const tau = Math.PI * 2;
const EYE_Y = 3.79, EYE_X = .435, EYE_W = .25, MOUTH_Y = 2.94, MOUTH_W = .375;
const WIDTHS = [[2.15,.20],[2.23,.36],[2.39,.55],[2.62,.72],[2.90,.84],[3.20,.97],[3.48,1.055],[3.72,1.045],[3.98,1.005],[4.22,1.015],[4.52,.965],[4.80,.79],[5.04,.46],[5.15,.025]];
const DEPTHS = [[2.15,.05],[2.30,.25],[2.50,.53],[2.72,.64],[2.95,.65],[3.20,.64],[3.48,.64],[3.79,.68],[4.10,.72],[4.52,.69],[4.80,.48],[5.15,.02]];
const NOSE = [[3.12,0],[3.20,.075],[3.27,.30],[3.35,.39],[3.43,.34],[3.62,.235],[3.82,.175],[4.04,.07],[4.20,0]];

function profile(y, rows=WIDTHS) {
  let i = 0; while (i < rows.length - 2 && y > rows[i+1][0]) i++;
  const t=clamp((y-rows[i][0])/(rows[i+1][0]-rows[i][0]),0,1), p0=rows[Math.max(0,i-1)],p1=rows[i],p2=rows[i+1],p3=rows[Math.min(rows.length-1,i+2)];
  const m1=(p2[1]-p0[1])/(p2[0]-p0[0])*(p2[0]-p1[0]),m2=(p3[1]-p1[1])/(p3[0]-p1[0])*(p2[0]-p1[0]);
  return Math.max(.008,(2*t*t*t-3*t*t+1)*p1[1]+(t*t*t-2*t*t+t)*m1+(-2*t*t*t+3*t*t)*p2[1]+(t*t*t-t*t)*m2);
}
function front(x,y) {
  const w=profile(y), edge=Math.sqrt(Math.max(0,1-(x/w)**2));
  const base=.055+profile(y,DEPTHS)*edge;
  let z=base;
  z += .125*gauss(x,0,.35)*gauss(y,2.47,.19); // rounded mental prominence
  z += .155*(gauss(x,.61,.30)+gauss(x,-.61,.30))*gauss(y,3.43,.30); // forward malar planes
  z -= .035*(gauss(x,.66,.24)+gauss(x,-.66,.24))*gauss(y,3.02,.23); // quiet buccal hollow
  z += .035*(gauss(x,.44,.31)+gauss(x,-.44,.31))*gauss(y,4.04,.14); // supraorbital ridge
  // A narrow nasal bridge, projecting rounded tip, separate alae and columella.
  const nasalWidth=.104+.055*gauss(y,3.36,.17);
  if(y>3.12&&y<4.20)z+=profile(y,NOSE)*smooth((y-3.12)/.08)*smooth((4.20-y)/.10)*gauss(x,0,nasalWidth);
  z += .115*(gauss(x,.17,.095)+gauss(x,-.17,.095))*gauss(y,3.285,.105);
  z += .075*gauss(x,0,.060)*gauss(y,3.225,.10);
  z += .045*gauss(x,0,.17)*gauss(y,3.17,.085);
  // Orbital skin follows the globe; the rims have volume rather than an outline.
  for(const side of[-1,1]){
    const dx=x-side*EYE_X,dy=y-EYE_Y;
    z+=.052*gauss(dx,0,.31)*gauss(dy,0,.24);
  }
  z += .025*(gauss(x,.065,.04)+gauss(x,-.065,.04))*gauss(y,3.105,.115); // philtral columns
  z -= .012*gauss(x,0,.04)*gauss(y,3.095,.10);
  z += .050*gauss(x,0,.39)*gauss(y,MOUTH_Y,.18); // orbicular muzzle volume
  // Every sculpted landmark returns to the shared side boundary. Without this
  // compact fade, the chin pad would leave a slit against the posterior shell.
  return base+(z-base)*smooth(edge*4);
}
function actionAt(t) {
  const p=((t%5)+5)%5;
  if(p<.52)return 0;
  if(p<2.08)return smooth((p-.52)/1.56);
  if(p<2.90)return 1;
  if(p<4.65)return 1-smooth((p-2.90)/1.75);
  return 0;
}
function mat(color,roughness=.73) { return new THREE.MeshStandardMaterial({color,roughness,metalness:0}); }
function makeMesh(parent,geometry,material,id) {
  const m=new THREE.Mesh(geometry,material);m.castShadow=m.receiveShadow=true;
  if(id)m.userData.partId=id;parent.add(m);return m;
}
function gridGeometry(nx,ny) {
  const g=new THREE.BufferGeometry(), a=new Float32Array((nx+1)*(ny+1)*3), ind=[];
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const q=j*(nx+1)+i;ind.push(q,q+1,q+nx+1,q+1,q+nx+2,q+nx+1);}
  g.setAttribute('position',new THREE.BufferAttribute(a,3));g.setIndex(ind);return g;
}
function reverse(g){const a=g.index.array;for(let i=0;i<a.length;i+=3){const b=a[i+1];a[i+1]=a[i+2];a[i+2]=b;}return g;}
function setGrid(g,nx,ny,sample) {
  const a=g.attributes.position.array;
  for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++)a.set(sample(i/nx,j/ny),3*(j*(nx+1)+i));
  g.attributes.position.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();
}
function line(parent,color,opacity=.6) {
  const g=new THREE.BufferGeometry().setFromPoints(Array.from({length:49},()=>new THREE.Vector3()));
  const l=new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:true,opacity}));parent.add(l);return l;
}
function setLine(l,sample) {
  const a=l.geometry.attributes.position;for(let i=0;i<a.count;i++){const p=sample(i/(a.count-1));a.setXYZ(i,...p);}a.needsUpdate=true;l.geometry.computeBoundingSphere();
}

function eyeEdge(side,t,upper) {
  const x=side*EYE_X+(t*2-1)*EYE_W;
  const u=side>0?t:1-t, s=Math.pow(Math.sin(Math.PI*t),.83), cant=(u*2-1)*.023;
  return [x,EYE_Y+cant+(upper?.095:-.065)*s*(upper?1+.13*Math.cos(Math.PI*u):1)];
}
function mouthEdge(t,upper) {
  const u=t*2-1,x=u*MOUTH_W,s=Math.max(0,1-u*u);
  const cupid=.008*gauss(Math.abs(u),.28,.20)-.004*gauss(u,0,.16);
  return [x,MOUTH_Y+(upper?.010*s+cupid:-.010*s)];
}
function nostrilEdge(side,t){const a=t*tau,x=side*(.145+.041*Math.cos(a)),y=3.247+.016*Math.sin(a)+side*.10*(x-side*.133);return[x,y];}
function pointInEye(x,y) { return Math.abs(x)> .12&&Math.abs(x)<.76&&Math.abs(y-EYE_Y)<.16; }

/** Triangulate the skin with real eye, mouth and nostril apertures, then refine its interior. */
function faceTopology() {
  const shape=new THREE.Shape(), outline=[];
  for(let i=0;i<=80;i++){const y=2.30+2.85*i/80;outline.push(new THREE.Vector2(profile(y),y));}
  for(let i=80;i>=0;i--){const y=2.30+2.85*i/80;outline.push(new THREE.Vector2(-profile(y),y));}
  shape.setFromPoints(outline);
  for(const side of [-1,1]){
    const pts=[];for(let i=0;i<=30;i++)pts.push(new THREE.Vector2(...eyeEdge(side,i/30,true)));for(let i=29;i>=1;i--)pts.push(new THREE.Vector2(...eyeEdge(side,i/30,false)));
    shape.holes.push(new THREE.Path(pts));
  }
  const mouth=[];for(let i=0;i<=40;i++)mouth.push(new THREE.Vector2(...mouthEdge(i/40,true)));for(let i=39;i>=1;i--)mouth.push(new THREE.Vector2(...mouthEdge(i/40,false)));shape.holes.push(new THREE.Path(mouth));
  for(const side of[-1,1])shape.holes.push(new THREE.Path(Array.from({length:40},(_,i)=>new THREE.Vector2(...nostrilEdge(side,i/40)))));
  const raw=new THREE.ShapeGeometry(shape), rawP=raw.attributes.position, rawI=raw.index.array;
  const points=[],map=new Map();let indices=[];
  function add(p){const key=p.map(x=>x.toFixed(6)).join(',');if(!map.has(key)){map.set(key,points.length);points.push(p);}return map.get(key);}
  for(let i=0;i<rawI.length;i++)indices.push(add([rawP.getX(rawI[i]),rawP.getY(rawI[i])]));raw.dispose();
  // Shared-edge subdivision is conforming: no T junctions, cracked highlights or
  // duplicate normal islands when the curved surface deforms.
  const key=(a,b)=>a<b?`${a}:${b}`:`${b}:${a}`;
  for(let iteration=0;iteration<12;iteration++){
    const mids=new Map();
    for(let i=0;i<indices.length;i+=3)for(let k=0;k<3;k++){
      const a=indices[i+k],b=indices[i+(k+1)%3],pa=points[a],pb=points[b],edgeKey=key(a,b);
      if(!mids.has(edgeKey)&&(pa[0]-pb[0])**2+(pa[1]-pb[1])**2>((pa[1]+pb[1])*.5>2.75&&(pa[1]+pb[1])*.5<4.18&&Math.abs((pa[0]+pb[0])*.5)<.85?.038:.065)**2)mids.set(edgeKey,add([(pa[0]+pb[0])/2,(pa[1]+pb[1])/2]));
    }
    if(!mids.size)break;
    const next=[];
    for(let i=0;i<indices.length;i+=3){
      const[a,b,c]=indices.slice(i,i+3),ab=mids.get(key(a,b)),bc=mids.get(key(b,c)),ca=mids.get(key(c,a)),mask=(ab!==undefined?1:0)|(bc!==undefined?2:0)|(ca!==undefined?4:0);
      if(mask===0)next.push(a,b,c);
      else if(mask===1)next.push(a,ab,c,ab,b,c);
      else if(mask===2)next.push(b,bc,a,bc,c,a);
      else if(mask===4)next.push(c,ca,b,ca,a,b);
      else if(mask===3)next.push(ab,b,bc,a,ab,bc,a,bc,c);
      else if(mask===6)next.push(b,bc,ca,b,ca,a,bc,c,ca);
      else if(mask===5)next.push(a,ab,ca,ab,b,c,ab,c,ca);
      else next.push(a,ab,ca,ab,b,bc,ca,bc,c,ab,bc,ca);
    }
    indices=next;
  }
  const boundaryEdges=new Map();
  for(let i=0;i<indices.length;i+=3)for(let k=0;k<3;k++){const a=indices[i+k],b=indices[i+(k+1)%3],q=key(a,b);boundaryEdges.set(q,(boundaryEdges.get(q)||0)+1);}
  for(const[q,count]of boundaryEdges)if(count===1)for(const id of q.split(':').map(Number)){const p=points[id];if(Math.abs(p[0])>.8*profile(p[1]))p[0]=Math.sign(p[0])*profile(p[1]);}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(points.flatMap(([x,y])=>[x,y,front(x,y)]),3));geometry.setIndex(indices);geometry.computeVertexNormals();
  return {geometry,points,indices};
}

export function createFace(expressionId='joy') {
  if(!EXPRESSIONS[expressionId])expressionId='joy';
  const spec=EXPRESSIONS[expressionId],group=new THREE.Group();group.name=`Portrait · ${expressionId}`;
  const bust=new THREE.Group(),head=new THREE.Group();group.add(bust,head);
  const materials=createPortraitMaterials(),skin=materials.skin,browMat=mat(0x49332b,.88),lipMat=materials.lip,eyeWhite=materials.sclera,irisMat=materials.iris,pupilMat=materials.pupil;
  const regions={brow:new THREE.Group(),eyes:new THREE.Group(),cheeks:new THREE.Group(),mouth:new THREE.Group(),jaw:new THREE.Group()};Object.values(regions).forEach(r=>head.add(r));
  const parts=[];
  function part(id,name,description,location){const a=new THREE.Object3D();a.position.fromArray(location);regions[id].add(a);parts.push({id,name,description,object:regions[id],anchor:a});}
  part('brow','Brow & forehead','The brows rise, lower and change their medial angle. These surface gestures suggest the action of the forehead and brow region; they are authored expression poses.',[-.47,4.13,.69]);
  part('eyes','Eyelids & gaze','Upper and lower lid margins change the visible aperture around the eyes. A closed lid covers the iris; the eyeball itself does not shrink.',[.47,3.81,.72]);
  part('cheeks','Cheek region','The cheeks rise toward the lower lids in a smile and join the upper lip in a nose-wrinkle gesture. The portrait shows surface motion, not isolated internal muscles.',[-.67,3.45,.73]);
  part('mouth','Lips & mouth corners','The corners lift, lower, stretch or draw inward. Lip contours remain attached to the surrounding face as the opening changes.',[.36,2.94,.79]);
  part('jaw','Jaw & chin','An authored jaw release lowers the chin and lower lip together. The lower face returns to the same neutral geometry at the end of the five-second cycle.',[.38,2.47,.64]);

  // A quiet clothed shoulder base and a neck that enters beneath the jaw.
  const garment=reverse(gridGeometry(96,45)),cloth=mat(0x425956,.94);
  const dressRows=[[0,1.42],[.12,1.75],[.45,1.93],[.76,1.83],[1.05,1.42],[1.30,.91],[1.55,.55],[1.62,.50]];
  setGrid(garment,96,45,(u,v)=>{const y=v*1.62,w=profile(y,dressRows),a=u*tau;return[w*Math.cos(a),y,.025-.14*v*v+(.44+.17*(1-v))*Math.sin(a)];});makeMesh(bust,garment,cloth);
  const neck=reverse(gridGeometry(72,32));setGrid(neck,72,32,(u,v)=>{const y=1.55+v*1.16,w=.440+.012*v+.060*Math.exp(-v*5)-.032*Math.sin(Math.PI*v),a=u*tau;const x=w*Math.cos(a),tendon=.013*(gauss(x,.24+.14*v,.07)+gauss(x,-.24-.14*v,.07))*Math.max(0,Math.sin(a))*Math.sin(Math.PI*v);return[x,y,-.10+(.36-.015*v-.025*Math.sin(Math.PI*v))*Math.sin(a)+tendon];});makeMesh(bust,neck,skin.clone());
  const collar=reverse(gridGeometry(72,5));setGrid(collar,72,5,(u,v)=>{const a=u*tau,w=THREE.MathUtils.lerp(.500,.475,v),d=THREE.MathUtils.lerp(.44,.352,v);return[w*Math.cos(a),1.619-.025*v,-.115+d*Math.sin(a)];});makeMesh(bust,collar,cloth.clone());
  const neckline=line(bust,0x8a9c90,.5);setLine(neckline,t=>{const a=t*tau;return[.501*Math.cos(a),1.62,-.115+.44*Math.sin(a)];});

  const topo=faceTopology(),whole=topo.geometry;
  const buckets={cheeks:[],jaw:[]};for(let i=0;i<topo.indices.length;i+=3){const yy=(topo.points[topo.indices[i]][1]+topo.points[topo.indices[i+1]][1]+topo.points[topo.indices[i+2]][1])/3;buckets[yy<2.69?'jaw':'cheeks'].push(...topo.indices.slice(i,i+3));}
  const faceMeshes=[];for(const [id,indices]of Object.entries(buckets)){const g=new THREE.BufferGeometry();g.setAttribute('position',whole.attributes.position);g.setAttribute('normal',whole.attributes.normal);g.setIndex(indices);faceMeshes.push(makeMesh(regions[id],g,skin.clone(),id));}
  const back=gridGeometry(96,80);setGrid(back,96,80,(u,v)=>{const y=2.30+2.85*v,w=profile(y),a=Math.PI/2+u*Math.PI;return[w*Math.sin(a),y,.055+.86*Math.cos(a)*Math.sqrt(Math.max(0,1-((y-3.65)/1.55)**2))];});makeMesh(head,back,skin.clone());
  const backRest=Float32Array.from(back.attributes.position.array),neckRest=Float32Array.from(neck.attributes.position.array);

  // The helix, concha, antihelix and soft lobe are one sculpted auricular surface.
  for(const side of [-1,1]){
    const ear=gridGeometry(96,32);if(side<0)reverse(ear);
    setGrid(ear,96,32,(u,v)=>{
      const a=u*tau,r=v,y=3.49+(.315+.015*Math.sin(a))*r*Math.sin(a),z=-.035+.173*r*Math.cos(a)+.025*Math.sin(a);
      const yy=y-3.49,zz=z+.035;
      const rim=.079*gauss(r,.83,.13)*(1-.23*gauss(a,Math.PI*1.5,.5));
      const antihelix=.034*gauss(zz,-.034+.035*Math.sin(yy*5),.033)*gauss(yy,.025,.23);
      const fork=.026*gauss(zz,.015+.32*Math.max(0,yy),.035)*gauss(yy,.16,.12);
      const concha=-.026*gauss(zz,.045,.065)*gauss(yy,-.055,.105),lobe=.022*gauss(a,Math.PI*1.5,.65)*gauss(r,.75,.28);
      const x=side*(1.01+(.055+rim+antihelix+fork+concha+lobe)*smooth((1-r)/.13));return[x,y,z];
    });makeMesh(head,ear,skin.clone());
    const tragus=makeMesh(head,new THREE.SphereGeometry(1,24,18),skin.clone());tragus.position.set(side*1.097,3.45,.087);tragus.scale.set(.040,.074,.040);
  }

  const hairDetail=createHair({parent:head,profile,front});

  let pose={g:0};
  function coordinates(x,y){
    const g=pose.g;
    let px=x,py=y+.09*gauss(y,2.30,.40)*Math.pow(clamp(Math.abs(x)/profile(y),0,1),1.6);
    const jawInfluence=1-smooth((y-2.34)/.91),jawDrop=spec.open*g*.57;
    py-=jawDrop*jawInfluence;
    // The mouth influence is compact: teeth and nose never stretch with it.
    const mouthWeight=gauss(y,MOUTH_Y,.29)*gauss(x,0,.58);
    const u=x/MOUTH_W;
    px+=mouthWeight*g*((spec.wide||0)*u-(spec.round||0)*x);
    const smileSide=spec.wink?(x<0?1:.50):1;
    py+=mouthWeight*g*(spec.smile*.105*smileSide*Math.pow(Math.min(1.2,Math.abs(u)),1.6));
    const lipSign=y>=MOUTH_Y?1:-1;
    const openingWeight=gauss(y,MOUTH_Y,.20)*Math.pow(Math.max(0,1-Math.min(1,Math.abs(u))**2),.7);
    py+=lipSign*spec.open*g*.5*openingWeight;
    py+=(spec.sneer||0)*g*gauss(x,-.18,.22)*gauss(y,3.03,.23);
    // Each eyelid moves independently; the remaining surface falls off smoothly.
    for(const side of [-1,1]){
      const cx=side*EYE_X,dx=x-cx,dy=y-EYE_Y;
      const horizontal=1-smooth((Math.abs(dx)-EYE_W)/.16);
      const vertical=gauss(y,EYE_Y,.23);
      const closure=spec.wink&&side===-1?0:spec.squint*g;
      py-=dy*closure*horizontal*vertical;
      py+=spec.cheek*g*.055*(spec.wink&&side===1?.35:1)*gauss(x,side*.58,.31)*gauss(y,3.45,.25);
      py+=g*(spec.brow+(spec.inner||0)*gauss(x,side*.19,.23))*gauss(y,4.08,.23)*gauss(x,cx,.44);
    }
    let z=front(x,y)+spec.cheek*g*.037*(gauss(x,.59,.30)+gauss(x,-.59,.30))*gauss(y,3.42,.3)-jawDrop*.12*jawInfluence;
    if(spec.wink){
      const dx=x+EYE_X,falloff=(1-smooth((Math.abs(dx)-EYE_W)/.16))*(1-smooth((Math.abs(y-EYE_Y)-.13)/.19)),closure=pose.wink*falloff;
      const cy=EYE_Y+.018-.022*dx/EYE_W+.014*(1-clamp((dx/EYE_W)**2,0,1));
      const cz=front(x,EYE_Y)+spec.cheek*g*.037*gauss(x,-.59,.30)*gauss(EYE_Y,3.42,.3);
      py=THREE.MathUtils.lerp(py,cy,closure);z=THREE.MathUtils.lerp(z,cz,closure);
    }
    return[px,py,z];
  }
  function transformFeature(x,y,dz=0){const p=coordinates(x,y);p[2]+=dz;return p;}

  // All local deformations are linear in the authored action and the independent
  // wink closure. Cache their position/derivative fields once; render frames only
  // blend these fields, retaining analytic normals without repeated exponentials.
  const faceFields=[],backFields=[];
  for(const state of[{g:0,wink:0},{g:1,wink:0},{g:0,wink:1},{g:1,wink:1}]){
    pose=state;const p=new Float32Array(topo.points.length*3),dx=new Float32Array(p.length),dy=new Float32Array(p.length),e=.0008;
    for(let i=0;i<topo.points.length;i++){
      const[x,y]=topo.points[i],q=coordinates(x,y),ratio=clamp(x/profile(y),-.999999,.999999),theta=Math.asin(ratio),rim=Math.abs(ratio)>.85;
      const x0=rim?coordinates(profile(y)*Math.sin(theta-e),y):coordinates(x-e,y),x1=rim?coordinates(profile(y)*Math.sin(theta+e),y):coordinates(x+e,y);
      const y0=rim?coordinates(profile(y-e)*Math.sin(theta),y-e):coordinates(x,y-e),y1=rim?coordinates(profile(y+e)*Math.sin(theta),y+e):coordinates(x,y+e),j=i*3;
      for(let k=0;k<3;k++){p[j+k]=q[k];dx[j+k]=x1[k]-x0[k];dy[j+k]=y1[k]-y0[k];}
    }
    faceFields.push({p,dx,dy});
    const posterior=new Float32Array(backRest.length);
    for(let i=0;i<backRest.length;i+=3){const x=backRest[i],y=backRest[i+1],q=coordinates(x,y);posterior[i]=q[0];posterior[i+1]=q[1]+.27*(1-smooth((y-2.3)/.90))*clamp((.055-backRest[i+2])/.7,0,1);posterior[i+2]=backRest[i+2]+q[2]-front(x,y);}
    backFields.push(posterior);
  }
  for(let f=1;f<4;f++)for(const key of['p','dx','dy'])for(let i=0;i<faceFields[f][key].length;i++)faceFields[f][key][i]-=faceFields[0][key][i];
  for(const key of['p','dx','dy'])for(let i=0;i<faceFields[3][key].length;i++)faceFields[3][key][i]-=faceFields[1][key][i]+faceFields[2][key][i];
  for(let f=1;f<4;f++)for(let i=0;i<backFields[f].length;i++)backFields[f][i]-=backFields[0][i];
  for(let i=0;i<backFields[3].length;i++)backFields[3][i]-=backFields[1][i]+backFields[2][i];
  pose={g:0,wink:0};

  const eyeRecords=[];
  for(const side of [-1,1]){
    const white=gridGeometry(48,20),iris=reverse(gridGeometry(64,8)),pupil=reverse(gridGeometry(48,4));
    for(const[g,nx,ny]of[[iris,64,8],[pupil,48,4]]){const uv=[];for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++)uv.push(i/nx,j/ny);g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));}
    const wm=makeMesh(regions.eyes,white,eyeWhite.clone(),'eyes'),im=makeMesh(regions.eyes,iris,irisMat.clone(),'eyes'),pm=makeMesh(regions.eyes,pupil,pupilMat.clone(),'eyes');
    // Small modeled glints are restrained enough to keep the stone portrait quiet.
    const glint=makeMesh(regions.eyes,new THREE.SphereGeometry(.015,12,8),mat(0xf7f0dd,.2),'eyes');
    const upper=line(regions.eyes,0x655149,.65),lower=line(regions.eyes,0x9d8276,.27);
    upper.name=`Portrait ${side<0?'left':'right'} upper eyelid margin`;lower.name=`Portrait ${side<0?'left':'right'} lower eyelid margin`;
    upper.userData.partId=lower.userData.partId='eyes';
    const brow=gridGeometry(48,3);if(side<0)reverse(brow);makeMesh(regions.brow,brow,browMat.clone(),'brow');
    const upperLid=gridGeometry(48,5),lowerLid=reverse(gridGeometry(48,5)),upperLidMesh=makeMesh(regions.eyes,upperLid,skin.clone(),'eyes'),lowerLidMesh=makeMesh(regions.eyes,lowerLid,skin.clone(),'eyes');
    const crease=line(regions.eyes,0x80645b,.22);
    const closedLid=gridGeometry(48,8),closedLidMesh=makeMesh(regions.eyes,closedLid,skin.clone(),'eyes');closedLidMesh.name='Joined upper and lower lid surface';
    eyeRecords.push({side,white,iris,pupil,wm,im,pm,glint,upper,lower,brow,upperLid,lowerLid,upperLidMesh,lowerLidMesh,closedLid,closedLidMesh,crease});
  }
  const featureHairs=createFeatureHairs({parent:head,
    sampleBrow:(side,t)=>{const x=THREE.MathUtils.lerp(side*.18,side*.79,t),y=4.045+.085*Math.sin(Math.PI*t)-.035*t;return transformFeature(x,y,.016);},
    sampleLid:(side,t)=>transformFeature(...eyeEdge(side,side<0?1-t:t,true),.016)
  });
  const upperLip=gridGeometry(64,9),lowerLip=reverse(gridGeometry(64,9));makeMesh(regions.mouth,upperLip,lipMat.clone(),'mouth');makeMesh(regions.mouth,lowerLip,lipMat.clone(),'mouth');
  const cavity=gridGeometry(64,20);makeMesh(regions.mouth,cavity,mat(0x382927,.95),'mouth');
  const teeth=[];
  for(const lower of[false,true])for(let k=-4;k<4;k++){
    const rank=k<0?-k-1:k,w=[.104,.086,.075,.064][rank]*(lower?.91:1),h=[.125,.118,.113,.103][rank]*(lower?.84:1),radius=.012;
    const shape=new THREE.Shape();shape.moveTo(-w/2+radius,0);shape.lineTo(w/2-radius,0);shape.quadraticCurveTo(w/2,0,w/2,radius);shape.lineTo(w/2,h-radius);shape.quadraticCurveTo(w/2,h,w/2-radius,h);shape.lineTo(-w/2+radius,h);shape.quadraticCurveTo(-w/2,h,-w/2,h-radius);shape.lineTo(-w/2,radius);shape.quadraticCurveTo(-w/2,0,-w/2+radius,0);
    const geometry=new THREE.ExtrudeGeometry(shape,{depth:.027,bevelEnabled:true,bevelSize:.006,bevelThickness:.006,bevelSegments:3,steps:1,curveSegments:8});
    const centers=[.054,.151,.235,.307],x=Math.sign(k+.5)*centers[rank]*(lower?.94:1),z=.625-.55*x*x;
    const mesh=makeMesh(regions.mouth,geometry,mat(0xd7cbb8,.43),'mouth');mesh.name=`${lower?'Lower':'Upper'} tooth ${k+5}`;mesh.rotation.y=-x*.65;
    teeth.push({mesh,lower,x,z,y:MOUTH_Y+(lower?-.173:.020)+.040*(x/.32)**2});
  }
  const tongue=makeMesh(regions.mouth,new THREE.SphereGeometry(1,40,24),mat(0x92554e,.65),'mouth');tongue.scale.set(.24,.058,.052);
  const lipLine=line(regions.mouth,0x60433d,.5);lipLine.userData.partId='mouth';
  const nostrils=[];for(const side of[-1,1]){const cavity=gridGeometry(48,8);if(side>0)reverse(cavity);const mesh=makeMesh(head,cavity,mat(0x4a2925,.9));nostrils.push({cavity,mesh,side});}

  function update(tSeconds){
    const g=actionAt(tSeconds);
    pose={g,wink:spec.wink?Math.min(1,g*1.45):0};
    const a=whole.attributes.position;
    const normals=whole.attributes.normal,rest=faceFields[0],act=faceFields[1],wink=faceFields[2],cross=faceFields[3],w=pose.wink,gw=g*w;
    for(let i=0;i<topo.points.length;i++){
      const j=i*3;
      a.setXYZ(i,rest.p[j]+g*act.p[j]+w*wink.p[j]+gw*cross.p[j],rest.p[j+1]+g*act.p[j+1]+w*wink.p[j+1]+gw*cross.p[j+1],rest.p[j+2]+g*act.p[j+2]+w*wink.p[j+2]+gw*cross.p[j+2]);
      const dx0=rest.dx[j]+g*act.dx[j]+w*wink.dx[j]+gw*cross.dx[j],dx1=rest.dx[j+1]+g*act.dx[j+1]+w*wink.dx[j+1]+gw*cross.dx[j+1],dx2=rest.dx[j+2]+g*act.dx[j+2]+w*wink.dx[j+2]+gw*cross.dx[j+2];
      const dy0=rest.dy[j]+g*act.dy[j]+w*wink.dy[j]+gw*cross.dy[j],dy1=rest.dy[j+1]+g*act.dy[j+1]+w*wink.dy[j+1]+gw*cross.dy[j+1],dy2=rest.dy[j+2]+g*act.dy[j+2]+w*wink.dy[j+2]+gw*cross.dy[j+2];
      const nx=dx1*dy2-dx2*dy1,ny=dx2*dy0-dx0*dy2,nz=dx0*dy1-dx1*dy0,length=Math.hypot(nx,ny,nz)||1;
      normals.setXYZ(i,nx/length,ny/length,nz/length);
      const [sx,sy]=topo.points[i];if(Math.abs(sx)/profile(sy)>.9999){const side=Math.sign(sx),e=.0008,q0=coordinates(side*profile(sy-e),sy-e),q1=coordinates(side*profile(sy+e),sy+e),tx=q1[0]-q0[0],ty=q1[1]-q0[1],l=Math.hypot(tx,ty);normals.setXYZ(i,side*ty/l,-side*tx/l,0);}
    }
    a.needsUpdate=true;normals.needsUpdate=true;whole.computeBoundingBox();whole.computeBoundingSphere();
    for(const m of faceMeshes){m.geometry.setAttribute('normal',whole.attributes.normal);m.geometry.computeBoundingBox();m.geometry.computeBoundingSphere();}
    const backP=back.attributes.position;
    for(let i=0;i<backP.array.length;i++)backP.array[i]=backFields[0][i]+g*backFields[1][i]+w*backFields[2][i]+gw*backFields[3][i];
    backP.needsUpdate=true;back.computeVertexNormals();back.computeBoundingBox();back.computeBoundingSphere();
    for(let j=0;j<=80;j++)for(const i of[0,96]){
      const index=j*97+i,x=backRest[index*3],y=backRest[index*3+1],e=.0008,side=Math.sign(x),q0=coordinates(side*profile(y-e),y-e),q1=coordinates(side*profile(y+e),y+e),dx=q1[0]-q0[0],dy=q1[1]-q0[1],l=Math.hypot(dx,dy);
      back.attributes.normal.setXYZ(index,side*dy/l,-side*dx/l,0);
    }
    back.attributes.normal.needsUpdate=true;
    const neckP=neck.attributes.position;for(let i=0;i<neckP.count;i++){const j=i*3;neckP.setXYZ(i,neckRest[j],neckRest[j+1]-spec.open*g*.42*smooth((neckRest[j+1]-1.7)/.95),neckRest[j+2]);}neckP.needsUpdate=true;neck.computeVertexNormals();neck.computeBoundingBox();neck.computeBoundingSphere();
    for(const eye of eyeRecords){
      const {side}=eye;
      function edge(t,upper){return transformFeature(...eyeEdge(side,t,upper),.008);}
      function whitePoint(u,v){const lo=edge(u,false),hi=edge(u,true),y=THREE.MathUtils.lerp(lo[1],hi[1],v),boundary=THREE.MathUtils.lerp(lo[2],hi[2],v),globe=.455+Math.sqrt(Math.max(.0025,.329**2-(lo[0]-side*EYE_X)**2-(y-EYE_Y)**2));return[lo[0],y,THREE.MathUtils.lerp(boundary,globe,Math.pow(Math.sin(Math.PI*u)*Math.sin(Math.PI*v),.55))];}
      setGrid(eye.white,48,20,whitePoint);
      const lo=edge(.5,false),hi=edge(.5,true),aperture=hi[1]-lo[1];
      const centerX=side*EYE_X,centerY=EYE_Y+.020;
      function irisPoint(u,v,radius,dz){
        const angle=u*tau,r=v*radius,xx=centerX+Math.cos(angle)*r,rel=clamp((xx-(centerX-EYE_W))/(EYE_W*2),.001,.999),low=edge(rel,false),high=edge(rel,true);
        const yy=clamp(centerY+Math.sin(angle)*r,low[1]+.002,Math.max(low[1]+.002,high[1]-.002));
        const vv=clamp((yy-low[1])/Math.max(.001,high[1]-low[1]),0,1),p=whitePoint(rel,vv);p[1]=yy;p[2]+=dz;return p;
      }
      for(const[geo,nx,ny,radius,dz]of[[eye.iris,64,8,.112,.004],[eye.pupil,48,4,.042,.008]]){
        const uv=geo.attributes.uv;setGrid(geo,nx,ny,(u,v)=>{const p=irisPoint(u,v,radius,dz),dx=p[0]-centerX,dy=p[1]-centerY;uv.setXY(Math.round(v*ny)*(nx+1)+Math.round(u*nx),((Math.atan2(dy,dx)/tau)%1+1)%1,Math.hypot(dx,dy)/radius);return p;});uv.needsUpdate=true;
      }
      // The iris is clipped by the moving aperture; collapsed boundary
      // triangles must not create dark normal spikes at nearly closed lids.
      for(const geo of[eye.iris,eye.pupil]){const n=geo.attributes.normal;for(let i=0;i<n.count;i++)n.setXYZ(i,0,0,1);n.needsUpdate=true;}
      eye.im.visible=eye.pm.visible=eye.glint.visible=aperture>.018;
      eye.wm.visible=eye.upperLidMesh.visible=eye.lowerLidMesh.visible=eye.lower.visible=aperture>.018;
      eye.closedLidMesh.visible=aperture<=.018;
      setGrid(eye.closedLid,48,8,(u,v)=>{
        const p=edge(u,true),s=Math.pow(Math.sin(Math.PI*u),.6);p[0]+=(u*2-1)*.050;p[1]+=(v-.5)*.11*s;p[2]+=.052+.004*Math.sin(Math.PI*v)*s;return p;
      });
      const gp=irisPoint(.34,.55,.112,.014);eye.glint.position.set(...gp);eye.glint.scale.setScalar(aperture<.07?.6:1);
      setLine(eye.upper,t=>{const p=edge(aperture<.018?.015+.97*t:t,true);p[2]+=aperture<.018?.065:.007;return p;});setLine(eye.lower,t=>edge(t,false));
      for(const[geometry,upper]of[[eye.upperLid,true],[eye.lowerLid,false]])setGrid(geometry,48,5,(u,v)=>{
        const[x,y]=eyeEdge(side,u,upper),s=Math.pow(Math.sin(Math.PI*u),.7),offset=(upper?1:-1)*v*(upper?.073:.041)*s;
        return transformFeature(x,y+offset,.006+.014*Math.sin(Math.PI*v)*s);
      });
      setLine(eye.crease,t=>{const[x,y]=eyeEdge(side,t,true),s=Math.sin(Math.PI*t);return transformFeature(x,y+.078*s,.008);});
      setGrid(eye.brow,48,3,(u,v)=>{
        const inner=side*.18,outer=side*.79,x=THREE.MathUtils.lerp(inner,outer,u);
        const y=4.045+.085*Math.sin(Math.PI*u)-.035*u;
        const thickness=(.044+.036*Math.sin(Math.PI*u))*(1-.78*Math.pow(u,3))*smooth(u/.075)*Math.pow(1-u,.20);
        return transformFeature(x,y+(v-.5)*thickness,.013);
      });
    }
    function lipPoint(t,v,upper){
      const [x,y]=mouthEdge(t,upper),u=t*2-1,s=Math.max(0,1-u*u);
      const thickness=(upper?.075+.025*gauss(Math.abs(u),.28,.20)-.010*gauss(u,0,.15):.108)*Math.pow(s,.68);
      const p=transformFeature(x,y+(upper?1:-1)*v*thickness,Math.pow(s,.7)*(.008*(1-v)+(upper?.032:.042)*Math.sin(Math.PI*v)));
      return p;
    }
    setGrid(upperLip,64,9,(u,v)=>lipPoint(u,v,true));setGrid(lowerLip,64,9,(u,v)=>lipPoint(u,v,false));
    setGrid(cavity,64,20,(u,v)=>{const lo=lipPoint(u,0,false),hi=lipPoint(u,0,true);return[THREE.MathUtils.lerp(lo[0],hi[0],v),THREE.MathUtils.lerp(lo[1],hi[1],v),Math.min(lo[2],hi[2])-.035-.23*Math.sin(Math.PI*v)];});
    for(const tooth of teeth){tooth.mesh.position.set(tooth.x,tooth.y-(tooth.lower?spec.open*g*.70:0),tooth.z);tooth.mesh.visible=!tooth.lower&&expressionId!=='surprise'&&spec.open*g>.028;}
    tongue.position.set(0,MOUTH_Y-.15-spec.open*g*.43,.638);tongue.visible=spec.open*g>.12;
    setLine(lipLine,t=>{const p=lipPoint(t,0,true);p[2]+=.002;return p;});lipLine.material.opacity=.40*(1-g*Math.min(1,spec.open*8));
    for(const{cavity,side}of nostrils)setGrid(cavity,48,8,(u,v)=>{const[x,y]=nostrilEdge(side,u),cx=side*.145,cy=3.247,p=coordinates(THREE.MathUtils.lerp(cx,x,v),THREE.MathUtils.lerp(cy,y,v));p[2]-=.006+.045*(1-v*v);return p;});
    for(const p of parts){const base={brow:[-.47,4.13,.69],eyes:[.47,3.81,.72],cheeks:[-.67,3.45,.73],mouth:[.36,2.94,.79],jaw:[.38,2.47,.64]}[p.id];const loc=coordinates(base[0],base[1]);p.anchor.position.set(loc[0],loc[1],loc[2]+.025);}
    head.rotation.z=spec.tilt*g;head.rotation.y=(spec.wink?-.025:spec.sneer?.02:0)*g;head.rotation.x=expressionId==='laughter'?-.045*g:0;
    featureHairs.update();
    group.updateMatrixWorld(true);
  }
  update(0);
  group.traverse(o=>{if(o.isMesh)captureRestPositions(o.geometry);});
  const bounds=new THREE.Box3().setFromObject(group);
  return{
    group,parts,update,expressionId,bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()},
    camera:{target:[0,2.95,0],position:[1.85,3.32,11.5]},
    title:spec.title,subtitle:spec.subtitle,
    beats:[
      {time:0,label:'Presence',description:'A quiet neutral portrait establishes the same identity across every expression.'},
      {time:.52,label:'Gather',description:'The first changes begin around the eyes and mouth, with the surrounding face following.'},
      {time:2.08,label:spec.action,description:spec.detail},
      {time:2.90,label:'Release',description:'The features recover together without changing the identity or resetting abruptly.'},
      {time:4.65,label:'Rest',description:'The original neutral pose returns and holds through the matching five-second endpoint.'}
    ],
    get poseState(){
      // Measurements come from the actual updated aperture vertices, in model
      // units. Left/right refer to the portrait as seen in its frontal view.
      const apertures=eyeRecords.map(e=>e.white.attributes.position.getY(20*49+24)-e.white.attributes.position.getY(24));
      return {amount:pose.g,leftEyeOpen:1-(spec.wink?pose.wink:spec.squint*pose.g),rightEyeOpen:1-spec.squint*pose.g,leftAperture:apertures[0],rightAperture:apertures[1],leftIrisVisible:eyeRecords[0].im.visible,rightIrisVisible:eyeRecords[1].im.visible,jawOpen:Math.max(0,spec.open)*pose.g,smile:spec.smile*pose.g,brow:spec.brow*pose.g};
    },
    metrics(t){const g=actionAt(t);return[{label:'Expression',value:`${Math.round(g*100)}%`},{label:'Jaw release',value:`${Math.round(Math.max(0,spec.open)*g/.39*100)}%`},{label:'Cycle',value:'5.00 s'}];}
  };
}
