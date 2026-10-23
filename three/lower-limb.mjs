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
  {x:.56,z:.78,l:.50,w:.101,h:.119,rootLift:.018,name:'Fifth toe'}
];
function toeSurface(toe,u,theta) {
  u=THREE.MathUtils.clamp(u,0,1);
  const tip=Math.sqrt(Math.max(.0001,1-((Math.max(0,u-.64))/.36)**2));
  const taper=(1-.20*u)*(u<.09 ? .88+.12*smooth(u/.09) : 1)*tip;
  const centerY=toe.h+.012-.016*u-.012*Math.sin(Math.PI*u)+(toe.rootLift||0)*(1-smooth((u-.25)/.55));
  return new THREE.Vector3(toe.x+Math.sin(theta)*toe.w*taper,Math.max(.012,centerY+Math.cos(theta)*toe.h*taper),toe.z+toe.l*u);
}
// One watertight skin replaces the intersecting forefoot and separate toe tubes.
// Immutable rest topology is cached; every assembled foot owns its pose buffers.
const footTemplates=new Map();
function footDistanceSampler(ankleHeight){
  const source=surfaceMesh((u,v)=>footSurface(u,v,0,ankleHeight),[0,1,0,TAU],76,56,true);
  const positions=source.geometry.attributes.position, normals=source.geometry.attributes.normal, indices=source.geometry.index.array, triangles=[];
  const add=(a,b,c,n)=>{const box=new THREE.Box3().setFromPoints([a,b,c]);triangles.push({triangle:new THREE.Triangle(a,b,c),normal:n,box,center:box.getCenter(new THREE.Vector3())});};
  for(let i=0;i<indices.length;i+=3){const ids=[indices[i],indices[i+1],indices[i+2]],v=ids.map(j=>new THREE.Vector3().fromBufferAttribute(positions,j));const n=ids.reduce((s,j)=>s.add(new THREE.Vector3().fromBufferAttribute(normals,j)),new THREE.Vector3()).normalize();add(...v,n);}
  for(const u of[0,1]){const center=footSurface(u,0,0,ankleHeight).add(footSurface(u,Math.PI,0,ankleHeight)).multiplyScalar(.5);for(let j=0;j<56;j++)add(center.clone(),footSurface(u,TAU*j/56,0,ankleHeight),footSurface(u,TAU*(j+1)/56,0,ankleHeight),new THREE.Vector3(0,u===0?1:0,u===1?1:0));}
  function build(items){const box=new THREE.Box3();for(const t of items)box.union(t.box);if(items.length<=10)return{box,items};const size=box.getSize(new THREE.Vector3()),axis=size.x>size.y&&size.x>size.z?'x':size.y>size.z?'y':'z';items.sort((a,b)=>a.center[axis]-b.center[axis]);const mid=items.length>>1;return{box,left:build(items.slice(0,mid)),right:build(items.slice(mid))};}
  const root=build(triangles),point=new THREE.Vector3(),closest=new THREE.Vector3(),delta=new THREE.Vector3();let best,sign;
  function boxDistance(box){let d=0;for(const k of['x','y','z']){const v=point[k]<box.min[k]?box.min[k]-point[k]:point[k]>box.max[k]?point[k]-box.max[k]:0;d+=v*v;}return d;}
  function visit(node){if(boxDistance(node.box)>best)return;if(node.items){for(const t of node.items){t.triangle.closestPointToPoint(point,closest);const distance=point.distanceToSquared(closest);if(distance<best){best=distance;sign=delta.copy(point).sub(closest).dot(t.normal)<0?-1:1;}}return;}const a=boxDistance(node.left.box),b=boxDistance(node.right.box);if(a<b){visit(node.left);visit(node.right);}else{visit(node.right);visit(node.left);}}
  source.geometry.dispose();source.material.dispose();
  return(x,y,z)=>{point.set(x,y,z);best=Infinity;sign=1;visit(root);return Math.sqrt(best)*sign;};
}
function toeDistance(toe,x,y,z){
  const u=THREE.MathUtils.clamp((z-toe.z)/toe.l,0,1),p=toeSurface(toe,u,0),q=toeSurface(toe,u,Math.PI),cy=(p.y+q.y)*.5,ry=Math.max(.001,(p.y-q.y)*.5),rx=Math.max(.001,toeSurface(toe,u,Math.PI/2).x-toe.x);
  let radial=(Math.hypot((x-toe.x)/rx,(y-cy)/ry)-1)*Math.min(rx,ry);
  if(z<toe.z)radial=Math.max(radial,toe.z-z);if(z>toe.z+toe.l)radial=Math.max(radial,z-toe.z-toe.l);
  return radial;
}
function footTemplate(ankleHeight){
  if(footTemplates.has(ankleHeight))return footTemplates.get(ankleHeight);
  const rawBodyDistance=footDistanceSampler(ankleHeight);
  function bodyDistance(x,y,z){
    if(y<.89){const shell=rawBodyDistance(x,y,z),pad=(Math.sqrt((x/.66)**4+((z-.79)/.34)**4+((y-.175)/.163)**2)-1)*.13,h=Math.max(.055-Math.abs(shell-pad),0)/.055;return Math.min(shell,pad)-h*h*.055*.25;}
    let rx,rz,cz;
    if(ankleHeight<1.5){[rx,rz,cz]=interpolate(LEG_RINGS,y);}
    else{let lo=0,hi=.27;for(let n=0;n<16;n++){const u=(lo+hi)/2,r=interpolate(FOOT_RINGS,u);if((r[1]+r[3])/2>y)lo=u;else hi=u;}const r=interpolate(FOOT_RINGS,(lo+hi)/2);rx=r[0];rz=(r[2]-r[4])/2;cz=(r[2]+r[4])/2;}
    const radial=(Math.hypot(x/rx,(z-cz)/rz)-1)*Math.min(rx,rz),d=Math.max(radial,y-ankleHeight),blend=smooth((y-.89)/.16);return blend===1?d:THREE.MathUtils.lerp(rawBodyDistance(x,y,z),d,blend);
  }
  const smoothMin=(a,b,k)=>{const h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k*.25;};
  let lastFollow=1;
  function field(x,y,z){const distances=[bodyDistance(x,y,z),...TOES.map(toe=>toeDistance(toe,x,y,z))],lowest=Math.min(...distances),weights=distances.map(d=>Math.exp(-(d-lowest)/.025)),total=weights.reduce((a,b)=>a+b,0);let follow=weights[0],d=distances[0];TOES.forEach((toe,j)=>{d=smoothMin(d,distances[j+1],.072*(1-smooth((z-toe.z-.26)/.30))+.008);follow+=weights[j+1]*(1-smooth(((z-toe.z)/toe.l-.18)/.48));});lastFollow=follow/total;return Math.max(.012-y,y-ankleHeight,d);}
  const step=.035,min=[-.78,-.03,-1.13],nx=47,ny=Math.ceil((ankleHeight+.07)/step)+1,nz=90,count=nx*ny*nz,values=new Float32Array(count),follows=new Float32Array(count),grid=new Float32Array(count*3),index=(x,y,z)=>x+nx*(y+ny*z);
  for(let z=0;z<nz;z++)for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const i=index(x,y,z),p=[min[0]+x*step,min[1]+y*step,min[2]+z*step];grid.set(p,i*3);values[i]=field(...p);follows[i]=lastFollow;}
  function sampled(data,x,y,z){const q=[x,y,z].map((v,k)=>THREE.MathUtils.clamp((v-min[k])/step,0,[nx,ny,nz][k]-1.000001)),a=q.map(Math.floor),f=q.map((v,k)=>v-a[k]);let value=0;for(let dz=0;dz<2;dz++)for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)value+=data[index(a[0]+dx,a[1]+dy,a[2]+dz)]*(dx?f[0]:1-f[0])*(dy?f[1]:1-f[1])*(dz?f[2]:1-f[2]);return value;}
  const vertices=[],triangles=[],edgeVertices=new Map(),corners=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]],tetrahedra=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]],tetraEdges=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
  function edgeVertex(a,b){const key=a<b?`${a}:${b}`:`${b}:${a}`;if(edgeVertices.has(key))return edgeVertices.get(key);const t=values[a]/(values[a]-values[b]),i=vertices.length/3;for(let c=0;c<3;c++)vertices.push(THREE.MathUtils.lerp(grid[a*3+c],grid[b*3+c],t));edgeVertices.set(key,i);return i;}
  const va=new THREE.Vector3(),vb=new THREE.Vector3();
  for(let z=0;z<nz-1;z++)for(let y=0;y<ny-1;y++)for(let x=0;x<nx-1;x++){const cube=corners.map(c=>index(x+c[0],y+c[1],z+c[2]));if(cube.every(i=>values[i]>0)||cube.every(i=>values[i]<=0))continue;for(const tet of tetrahedra){const ids=tet.map(i=>cube[i]),inside=ids.filter(i=>values[i]<=0),outside=ids.filter(i=>values[i]>0);if(!inside.length||!outside.length)continue;const poly=[];for(const[a,b]of tetraEdges)if((values[ids[a]]<=0)!==(values[ids[b]]<=0))poly.push(edgeVertex(ids[a],ids[b]));const center=new THREE.Vector3();poly.forEach(i=>center.add(new THREE.Vector3().fromArray(vertices,i*3)));center.divideScalar(poly.length);const inward=new THREE.Vector3(),outward=new THREE.Vector3();inside.forEach(i=>inward.add(new THREE.Vector3().fromArray(grid,i*3)));outside.forEach(i=>outward.add(new THREE.Vector3().fromArray(grid,i*3)));const normal=outward.divideScalar(outside.length).sub(inward.divideScalar(inside.length)).normalize(),u=new THREE.Vector3().fromArray(vertices,poly[0]*3).sub(center).normalize(),v=new THREE.Vector3().crossVectors(normal,u).normalize();poly.sort((a,b)=>{va.fromArray(vertices,a*3).sub(center);vb.fromArray(vertices,b*3).sub(center);return Math.atan2(va.dot(v),va.dot(u))-Math.atan2(vb.dot(v),vb.dot(u));});for(let i=1;i+1<poly.length;i++)triangles.push(poly[0],poly[i],poly[i+1]);}}
  // Relax the extraction lattice before semantic cuts. Alternating coefficients
  // remove voxel facets without visibly shrinking the authored toe volumes.
  const neighbors=Array.from({length:vertices.length/3},()=>new Set());for(let i=0;i<triangles.length;i+=3)for(const[a,b]of[[0,1],[1,2],[2,0]]){neighbors[triangles[i+a]].add(triangles[i+b]);neighbors[triangles[i+b]].add(triangles[i+a]);}
  for(let pass=0;pass<4;pass++)for(const amount of[.40,-.37]){const old=vertices.slice();for(let i=0;i<neighbors.length;i++){const list=neighbors[i];if(!list.size)continue;for(let k=0;k<3;k++){let mean=0;for(const j of list)mean+=old[j*3+k];vertices[i*3+k]=THREE.MathUtils.lerp(old[i*3+k],mean/list.size,amount);}}}
  // The leg edition meets its unchanged shin loft on the exact same contour.
  if(ankleHeight<1.5)for(let i=0;i<vertices.length;i+=3){const x=vertices[i],y=vertices[i+1],z=vertices[i+2];if(y<ankleHeight-.08)continue;const[rx,rz,cz]=interpolate(LEG_RINGS,y),radial=Math.hypot(x/rx,(z-cz)/rz);if(radial<.88)continue;const theta=Math.atan2(x/rx,(z-cz)/rz),p=legSurface(y,theta),w=smooth((y-ankleHeight+.08)/.05);vertices[i]=THREE.MathUtils.lerp(x,p.x,w);vertices[i+2]=THREE.MathUtils.lerp(z,p.z,w);}
  const region=new Map(['ankle','midfoot','heel','instep','forefoot',...TOES.map((_,i)=>`toe-${i+1}`)].map(id=>[id,[]])),cutCache=new Map(),sample=i=>new THREE.Vector3().fromArray(vertices,i*3);
  function split(poly,fn,key){const yes=[],no=[];for(let i=0;i<poly.length;i++){const a=poly[(i+poly.length-1)%poly.length],b=poly[i],da=fn(sample(a)),db=fn(sample(b));if((da<=0)!==(db<=0)){const cacheKey=`${key}:${Math.min(a,b)}:${Math.max(a,b)}`;let c=cutCache.get(cacheKey);if(c===undefined){let lo=0,hi=1;for(let k=0;k<22;k++){const t=(lo+hi)/2,d=fn(sample(a).lerp(sample(b),t));if((d<=0)===(da<=0))lo=t;else hi=t;}c=vertices.length/3;vertices.push(...sample(a).lerp(sample(b),(lo+hi)/2).toArray());cutCache.set(cacheKey,c);}yes.push(c);no.push(c);}(db<=0?yes:no).push(b);}return[yes,no];}
  const emit=(poly,id)=>{for(let i=1;i+1<poly.length;i++)region.get(id).push(poly[0],poly[i],poly[i+1]);};
  const regions=[...TOES.map((toe,i)=>[`toe-${i+1}`,p=>Math.max(toe.z+.18-p.z,Math.abs(p.x-toe.x)-toe.w*1.2)]),['ankle',p=>.99-p.y],['heel',p=>Math.max(p.z+.66,p.y-.88)],['instep',p=>Math.max(.34-p.y,p.z-.72)],['forefoot',p=>.76-p.z]];
  for(let i=0;i<triangles.length;i+=3){let remainder=triangles.slice(i,i+3);for(const[id,fn]of regions){if(remainder.length<3)break;const[yes,no]=split(remainder,fn,id);emit(yes,id);remainder=no;}emit(remainder,'midfoot');}
  // Region boundaries share vertices; split any later cut on its opposing face.
  const edgeKey=(a,b)=>a<b?`${a}:${b}`:`${b}:${a}`;
  for(let pass=0;pass<2;pass++){const counts=new Map();for(const faces of region.values())for(let i=0;i<faces.length;i+=3)for(const[a,b]of[[0,1],[1,2],[2,0]]){const key=edgeKey(faces[i+a],faces[i+b]);counts.set(key,(counts.get(key)||0)+1);}const boundary=[...counts].filter(([,n])=>n===1).map(([key])=>key.split(':').map(Number)),boundaryVertices=[...new Set(boundary.flat())],splits=new Map();for(const[a,b]of boundary){const pa=sample(a),pb=sample(b),ab=pb.clone().sub(pa),length=ab.lengthSq(),middle=[];for(const c of boundaryVertices){if(c===a||c===b)continue;const pc=sample(c),t=pc.clone().sub(pa).dot(ab)/length;if(t<=1e-5||t>=1-1e-5)continue;if(pc.distanceToSquared(pa.clone().addScaledVector(ab,t))<1e-12)middle.push([t,c]);}if(middle.length)splits.set(edgeKey(a,b),middle.sort((x,y)=>x[0]-y[0]).map(v=>v[1]));}if(!splits.size)break;for(const[id,source]of region){const replacement=[];for(let i=0;i<source.length;i+=3){const tri=source.slice(i,i+3),polygon=[];let changed=false;for(let j=0;j<3;j++){const a=tri[j],b=tri[(j+1)%3];polygon.push(a);const add=splits.get(edgeKey(a,b));if(add){changed=true;polygon.push(...(a<b?add:[...add].reverse()));}}if(!changed){replacement.push(...tri);continue;}const center=vertices.length/3;for(let axis=0;axis<3;axis++)vertices.push((vertices[tri[0]*3+axis]+vertices[tri[1]*3+axis]+vertices[tri[2]*3+axis])/3);for(let j=0;j<polygon.length;j++)replacement.push(center,polygon[j],polygon[(j+1)%polygon.length]);}region.set(id,replacement);}}
  const normals=[],weights=[],weightGradients=[];
  for(let i=0;i<vertices.length;i+=3){const x=vertices[i],y=vertices[i+1],z=vertices[i+2],e=.025,n=new THREE.Vector3(sampled(values,x+e,y,z)-sampled(values,x-e,y,z),sampled(values,x,y+e,z)-sampled(values,x,y-e,z),sampled(values,x,y,z+e)-sampled(values,x,y,z-e)).normalize();if(ankleHeight<1.5&&y>ankleHeight-.10){const[rx,rz,cz]=interpolate(LEG_RINGS,y);if(Math.hypot(x/rx,(z-cz)/rz)>.88){const theta=Math.atan2(x/rx,(z-cz)/rz),a=legSurface(y,theta+.001).sub(legSurface(y,theta-.001)),b=legSurface(y+.001,theta).sub(legSurface(y-.001,theta)),desired=a.cross(b).normalize();n.lerp(desired,smooth((y-ankleHeight+.10)/.07)).normalize();}}normals.push(...n.toArray());weights.push(sampled(follows,x,y,z));weightGradients.push((sampled(follows,x+e,y,z)-sampled(follows,x-e,y,z))/(2*e),(sampled(follows,x,y+e,z)-sampled(follows,x,y-e,z))/(2*e),(sampled(follows,x,y,z+e)-sampled(follows,x,y,z-e))/(2*e));}
  const result={vertices:Float32Array.from(vertices),normals:Float32Array.from(normals),weights:Float32Array.from(weights),weightGradients:Float32Array.from(weightGradients),region,followAt:(x,y,z)=>sampled(follows,x,y,z),surfaceY:(x,z)=>{let high=.8,low=.02;for(let y=.78;y>.01;y-=.02){if(sampled(values,x,y,z)<=0){low=y;high=y+.02;break;}}for(let i=0;i<20;i++){const y=(low+high)/2;if(sampled(values,x,y,z)>0)high=y;else low=y;}return(low+high)/2;}};footTemplates.set(ankleHeight,result);return result;
}
function makeFoot(prefix='foot',ankleHeight=1.70) {
  const template=footTemplate(ankleHeight),group=new THREE.Group(),body=new THREE.Group(),bodyPivot=new THREE.Group(),toesGroup=new THREE.Group();group.add(body,bodyPivot,toesGroup);
  const positions=new THREE.Float32BufferAttribute(template.vertices.slice(),3),normals=new THREE.Float32BufferAttribute(template.normals.slice(),3),geometries=[],parts=[],toes=[],anchors=[];
  const specs=[['ankle','Ankle region','The ankle narrows above the heel, with its surface continuing into the dorsum.',[.27,1.15,-.65]],['midfoot','Foot contour','A continuous skin surface joins heel, arch, metatarsal support and all five toes.',[-.48,.35,-.12]],['heel','Calcaneal region','The heel rises as the foot rolls over the supporting forefoot.',[.20,.45,-1.06]],['instep','Dorsum of foot','The instep slopes continuously from the ankle toward the metatarsals.',[.05,.73,-.08]],['forefoot','Metatarsal support','The ball of the foot carries the support as the heel lifts.',[.54,.28,.91]],...TOES.map((toe,i)=>[`toe-${i+1}`,toe.name,i===0?'The great toe has two phalanges and a broad supporting pad.':'The smaller toes continue from a shared metatarsal web; their distal pads stay planted as the heel rises.',[toe.x,.36,toe.z+toe.l*.67]])];
  for(const[id,name,description,position]of specs){const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',positions);geometry.setAttribute('normal',normals);geometry.setIndex(template.region.get(id));geometry.userData.vertices=[...new Set(geometry.index.array)];geometry.boundingBox=new THREE.Box3();for(const i of geometry.userData.vertices)geometry.boundingBox.expandByPoint(new THREE.Vector3().fromBufferAttribute(positions,i));geometry.boundingSphere=geometry.boundingBox.getBoundingSphere(new THREE.Sphere());geometries.push(geometry);const mesh=new THREE.Mesh(geometry,mat());mesh.castShadow=mesh.receiveShadow=true;mesh.userData.partId=`${prefix}-${id}`;const owner=id.startsWith('toe-')?toesGroup:body;owner.add(mesh);const p={id:`${prefix}-${id}`,name,description,object:mesh,anchor:marker(group,position)};(id.startsWith('toe-')?toes:parts).push(p);anchors.push([p.anchor,new THREE.Vector3(...position)]);}
  const toePart={id:`${prefix}-toes`,name:'Phalanges',description:'Five toes continue from one forefoot surface; the great toe is broader and the outer toes shorten.',object:toesGroup,anchor:marker(group,[-.18,.40,1.78])};anchors.push([toePart.anchor,toePart.anchor.position.clone()]);
  const details=[];
  for(const toe of TOES){for(const kind of['crease','nail']){if(kind==='crease'&&toe===TOES[4])continue;const points=[];for(let n=0;n<=32;n++){const a=TAU*n/32,u=kind==='crease'?.52:.79+.105*Math.cos(a),theta=kind==='crease'?-1+2*n/32:Math.asin(.55*Math.sin(a)),p=toeSurface(toe,u,theta);p.y=template.surfaceY(p.x,p.z)+.0025;points.push(p.toArray());}const line=arc(group,points);details.push({line,toe,rest:Float32Array.from(line.geometry.attributes.position.array)});}}
  function followAt(p){let nearest=TOES[0],distance=Infinity;for(const toe of TOES){const d=Math.abs(p.x-toe.x);if(d<distance){nearest=toe;distance=d;}}return 1-smooth(((p.z-nearest.z)/nearest.l-.18)/.48);}
  function rollPoint(x,y,z,w,angle){const c=Math.cos(angle),s=Math.sin(angle),Y=(y-.24)*c-(z-1)*s+.24,Z=(y-.24)*s+(z-1)*c+1;return new THREE.Vector3(x,Math.max(.012,THREE.MathUtils.lerp(y,Y,w)),THREE.MathUtils.lerp(z,Z,w));}
  let lastMode='',lastValue=NaN;
  function deform(mode,value){if(mode===lastMode&&value===lastValue)return;lastMode=mode;lastValue=value;const src=template.vertices;
    for(let i=0;i<positions.count;i++){const j=i*3,p=mode==='roll'?rollPoint(src[j],src[j+1],src[j+2],template.weights[i],value):bendPoint(src[j],src[j+1],src[j+2],value);positions.setXYZ(i,p.x,p.y,p.z);}
    positions.needsUpdate=true;
    // The cofactor of the roll Jacobian transports the common rest normals.
    // It includes the root/contact blend gradient, without per-frame remeshing.
    const n=new THREE.Vector3(),u=new THREE.Vector3(),v=new THREE.Vector3(),a=new THREE.Vector3(),b=new THREE.Vector3(),c=Math.cos(value),sn=Math.sin(value),eps=.0004;
    for(let i=0;i<normals.count;i++){const j=i*3;n.fromArray(template.normals,j);if(value!==0){const x=src[j],y=src[j+1],z=src[j+2];if(mode==='roll'){const w=template.weights[i],dy=(y-.24)*c-(z-1)*sn+.24-y,dz=(y-.24)*sn+(z-1)*c+1-z,gx=template.weightGradients[j],gy=template.weightGradients[j+1],gz=template.weightGradients[j+2],a=dy*gx,b=1+w*(c-1)+dy*gy,q=-w*sn+dy*gz,d=dz*gx,e=w*sn+dz*gy,f=1+w*(c-1)+dz*gz,det=b*f-q*e;n.set(det*n.x+(q*d-a*f)*n.y+(a*e-b*d)*n.z,f*n.y-e*n.z,-q*n.y+b*n.z).normalize();}else{u.set(Math.abs(n.y)<.9?0:1,Math.abs(n.y)<.9?1:0,0).cross(n).normalize();v.crossVectors(n,u);const p=bendPoint(x,y,z,value);a.copy(bendPoint(x+eps*u.x,y+eps*u.y,z+eps*u.z,value)).sub(p);b.copy(bendPoint(x+eps*v.x,y+eps*v.y,z+eps*v.z,value)).sub(p);n.crossVectors(a,b).normalize();}}normals.setXYZ(i,n.x,n.y,n.z);}normals.needsUpdate=true;
    for(const geometry of geometries){geometry.boundingBox.makeEmpty();for(const i of geometry.userData.vertices)geometry.boundingBox.expandByPoint(a.fromBufferAttribute(positions,i));geometry.boundingBox.getBoundingSphere(geometry.boundingSphere);}
    for(const[anchor,p]of anchors)anchor.position.copy(mode==='roll'?rollPoint(p.x,p.y,p.z,p.z<.8?1:followAt(p),value):bendPoint(p.x,p.y,p.z,value));
    for(const{line,toe,rest}of details){const dst=line.geometry.attributes.position;for(let i=0;i<dst.count;i++){const j=i*3,w=template.followAt(rest[j],rest[j+1],rest[j+2]),p=mode==='roll'?rollPoint(rest[j],rest[j+1],rest[j+2],w,value):bendPoint(rest[j],rest[j+1],rest[j+2],value);dst.setXYZ(i,p.x,p.y,p.z);}dst.needsUpdate=true;line.geometry.computeBoundingSphere();}
  }
  return {group,parts,toes,toePart,update:angle=>deform('roll',angle),bendAnkle:amount=>deform('bend',amount),bodyPivot,body};
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
  let last=-1;
  function update(t) {const q=action(t);if(Math.abs(q-last)<1e-7)return;last=q;foot.update(q*.36);}
  update(0);
  return {
    group:foot.group,parts:[...foot.parts,...foot.toes],update,
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
