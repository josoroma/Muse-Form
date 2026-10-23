import * as THREE from 'three';

// Shared immutable rest topology; every instance owns its deformed attributes.
let fusedHandTemplate=null;

/** Original procedural surface study. Units are proportions, not clinical measurements. */
export function createHand() {
  const group = new THREE.Group();
  group.name = 'Articulated hand · palmar study';
  const parts = [];
  let fusedActive=false;
  const skin = new THREE.MeshStandardMaterial({ color: 0x899b9b, roughness: 0.68, metalness: 0.12 });
  const nailMaterial = new THREE.MeshStandardMaterial({ color: 0x899b9b, roughness: 0.9, metalness: 0.1 });
  const creaseMaterial = new THREE.LineBasicMaterial({ color: 0x465d60, transparent: true, opacity: 0.48 });
  let palmSurface = null;
  const surfaceRay = new THREE.Raycaster();

  function mesh(geometry, parent, material = skin) {
    const m = new THREE.Mesh(geometry, material.clone());
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function curve(parent, points, opacity = 0.48) {
    const c = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const material = creaseMaterial.clone();
    material.opacity = opacity;
    let samples = c.getPoints(48);
    if(palmSurface && (parent.name==='Palm and wrist'||parent.name==='Thenar eminence')) {
      samples=samples.map(point=>{
        const sign=point.z<0?-1:1;
        surfaceRay.set(new THREE.Vector3(point.x,point.y,sign*3),new THREE.Vector3(0,0,-sign));
        const hit=surfaceRay.intersectObject(palmSurface,false)[0];
        if(hit)point.z=hit.point.z+sign*.004;
        return point;
      });
    }
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(samples), material);
    parent.add(line);
    return line;
  }
  // Longitudinal profiles are smoothly interpolated before revolving elliptical cross sections.
  function loft(rows, radialSegments = 40, longitudinalSegments = 64) {
    const vertices = [], indices = [];
    const profile = new THREE.CatmullRomCurve3(rows.map(r => new THREE.Vector3(r[0], r[1], r[2])), false, 'centripetal');
    const front = new THREE.CatmullRomCurve3(rows.map(r => new THREE.Vector3(r[0], r[3] ?? 0, r[4] ?? 0)), false, 'centripetal');
    for (let j = 0; j <= longitudinalSegments; j++) {
      const t = j / longitudinalSegments;
      const p = profile.getPoint(t), offset = front.getPoint(t);
      for (let i = 0; i <= radialSegments; i++) {
        const angle = i / radialSegments * Math.PI * 2;
        const c = Math.cos(angle), s = Math.sin(angle);
        const x = Math.sign(c) * Math.pow(Math.abs(c), 0.94) * Math.max(0.001, p.y);
        const z = Math.sign(s) * Math.pow(Math.abs(s), 0.9) * Math.max(0.001, p.z);
        vertices.push(x + offset.y, p.x, z + offset.z);
      }
    }
    for (let j = 0; j < longitudinalSegments; j++) {
      for (let i = 0; i < radialSegments; i++) {
        const a = j * (radialSegments + 1) + i, b = a + radialSegments + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }
  function part(id, name, description, object, location) {
    const anchor = new THREE.Object3D();
    anchor.position.set(...location);
    object.add(anchor);
    object.traverse(child => {
      if (child.isMesh || child.isLine) child.userData.partId = id;
    });
    parts.push({ id, name, description, object, anchor });
  }

  const palm = new THREE.Group();
  palm.name = 'Palm and wrist';
  group.add(palm);
  const palmGeometry=loft([
    [-1.15, 0.001, 0.001, 0.03, -0.04],
    [-1.12, 0.46, 0.235, 0.03, -0.04],
    [-0.84, 0.49, 0.25, 0.025, -0.025],
    [-0.42, 0.54, 0.265, 0.015, -0.01],
    [-0.13, 0.66, 0.29, 0.02, 0],
    [0.24, 0.80, 0.31, 0.04, 0],
    [0.67, 0.90, 0.30, 0.045, -0.015],
    [1.08, 0.94, 0.275, 0.025, -0.02],
    [1.40, 0.86, 0.235, -0.01, -0.015],
    [1.60, 0.67, 0.19, -0.11, -0.01],
    [1.70, 0.48, 0.14, -0.16, -0.01],
    [1.73, 0.001, 0.001, -0.16, -0.01],
  ],64,96);
  // Sculpt muscle volume into one continuous surface; never paste separate pads onto it.
  let palmPositions=palmGeometry.attributes.position;
  let thenarWeights=new Float32Array(palmPositions.count);
  for(let i=0;i<palmPositions.count;i++){
    const x=palmPositions.getX(i),y=palmPositions.getY(i),z=palmPositions.getZ(i);
    const frontWeight=THREE.MathUtils.smoothstep(z,0.02,0.22);
    const a=Math.exp(-((x+.48)**2/.135+(y-.39)**2/.40))*frontWeight;
    const b=Math.exp(-((x-.59)**2/.075+(y-.58)**2/.46))*frontWeight;
    palmPositions.setZ(i,z+.112*a+.045*b);
    thenarWeights[i]=a;
  }
  const palmSections=[];
  for(let ring=0;ring<=96;ring++){
    const i=ring*65;
    palmSections.push({y:palmPositions.getY(i),center:(palmPositions.getX(i)+palmPositions.getX(i+32))/2,rx:(palmPositions.getX(i)-palmPositions.getX(i+32))/2,front:palmPositions.getZ(i+16),back:-palmPositions.getZ(i+48)});
  }
  // Split triangles along the anatomical patch boundary, so highlight edges follow
  // a smooth contour instead of selecting jagged whole triangles. Both regions use
  // exactly the same boundary vertices: one surface, with no overlay or z fighting.
  const thenarIndices=[],palmIndices=[];
  const positions=Array.from(palmPositions.array),weights=Array.from(thenarWeights);
  const sourceIndex=Array.from(palmGeometry.index.array),edgeCuts=new Map();
  const field=(x,y,z)=>Math.max((x+.48)**2/.19+(y-.39)**2/.48-1,(.14-z)*6);
  const distances=[];
  for(let i=0;i<palmPositions.count;i++)distances.push(field(...positions.slice(i*3,i*3+3)));
  function cutEdge(a,b){
    const key=a<b?`${a}:${b}`:`${b}:${a}`;
    if(edgeCuts.has(key))return edgeCuts.get(key);
    let low=0,high=1;
    const positive=distances[a]>=0;
    for(let n=0;n<28;n++){
      const t=(low+high)/2;
      const x=THREE.MathUtils.lerp(positions[a*3],positions[b*3],t);
      const y=THREE.MathUtils.lerp(positions[a*3+1],positions[b*3+1],t);
      const z=THREE.MathUtils.lerp(positions[a*3+2],positions[b*3+2],t);
      if((field(x,y,z)>=0)===positive)low=t;else high=t;
    }
    const t=(low+high)/2,index=positions.length/3;
    for(let k=0;k<3;k++)positions.push(THREE.MathUtils.lerp(positions[a*3+k],positions[b*3+k],t));
    weights.push(THREE.MathUtils.lerp(weights[a],weights[b],t));
    distances.push(0);edgeCuts.set(key,index);
    return index;
  }
  function clipTriangle(triangle,inside){
    const polygon=[];
    for(let i=0;i<3;i++){
      const current=triangle[i],previous=triangle[(i+2)%3];
      const keepCurrent=inside?distances[current]<=0:distances[current]>=0;
      const keepPrevious=inside?distances[previous]<=0:distances[previous]>=0;
      if(keepCurrent!==keepPrevious)polygon.push(cutEdge(previous,current));
      if(keepCurrent)polygon.push(current);
    }
    const target=inside?thenarIndices:palmIndices;
    for(let i=1;i+1<polygon.length;i++)target.push(polygon[0],polygon[i],polygon[i+1]);
  }
  for(let i=0;i<sourceIndex.length;i+=3){
    const triangle=sourceIndex.slice(i,i+3);
    clipTriangle(triangle,true);clipTriangle(triangle,false);
  }
  palmGeometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  palmGeometry.setIndex([...palmIndices,...thenarIndices]);
  palmGeometry.deleteAttribute('normal');
  palmGeometry.computeVertexNormals();
  palmPositions=palmGeometry.attributes.position;
  thenarWeights=Float32Array.from(weights);
  const palmRest=Float32Array.from(palmPositions.array);
  function palmPatch(indices){
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',palmGeometry.attributes.position);
    g.setAttribute('normal',palmGeometry.attributes.normal);
    g.setIndex(indices);
    return g;
  }
  mesh(palmPatch(palmIndices),palm);
  palmSurface=new THREE.Mesh(palmGeometry,skin);
  palmSurface.updateMatrixWorld(true);
  curve(palm, [[-0.49,-0.43,0.255],[-0.20,-0.46,0.283],[0.12,-0.45,0.29],[0.43,-0.40,0.264]],0.32);
  curve(palm, [[-0.52,-0.29,0.265],[-0.17,-0.31,0.299],[0.20,-0.29,0.3],[0.47,-0.24,0.266]],0.22);
  curve(palm, [[-0.65,1.15,0.181],[-0.38,1.00,0.269],[-0.04,0.90,0.289],[0.31,0.91,0.279],[0.67,1.02,0.213]],0.45);
  curve(palm, [[-0.67,0.91,0.191],[-0.35,0.74,0.286],[0.03,0.61,0.303],[0.37,0.53,0.282],[0.67,0.36,0.226]],0.42);
  // Dorsal metacarpal ridges remain low and quiet; no wireframe or floating tendon rods.
  for (const [x, end, slant] of [[-0.48,1.38,-0.06],[-0.08,1.51,0],[0.31,1.36,0.06],[0.64,1.15,0.08]]) {
    curve(palm, [[x*0.48,-0.20,-0.269],[x*0.75,0.38,-0.300],[x,0.89,-0.270],[x+slant,end,-0.165]],0.22);
  }
  part('palm', 'Palmar arches', 'The palm forms a stable base. Its transverse arch cups gently while the finger joints close around the grasp.', palm, [0.16,0.55,0.36]);

  const thenar = new THREE.Group();
  thenar.name = 'Thenar eminence';
  group.add(thenar);
  mesh(palmPatch(thenarIndices),thenar);
  curve(thenar, [[-0.67,0.94,0.272],[-0.44,0.76,0.410],[-0.28,0.47,0.426],[-0.27,0.18,0.390],[-0.37,-0.09,0.303]],0.43);
  part('thenar', 'Thenar eminence', 'This muscular pad at the thumb base supports opposition: the thumb turns toward the finger pads to shape a grasp.', thenar, [-0.50,0.43,0.46]);

  // A digit is one continuous skin tube. The centerline preserves phalangeal
  // lengths and rounds only a small zone around each anatomical joint.
  function continuousDigit(spec) {
    const object=new THREE.Group();
    object.name=`${spec.name} · continuous articulated skin`;
    object.position.set(...spec.position);
    group.add(object);
    const [proximal,middle,distal]=spec.l,total=proximal+middle+distal;
    const start=spec.thumb?-.68:-.58;
    const anchor=new THREE.Object3D();anchor.name=`${spec.name} label`;object.add(anchor);
    const joints=[new THREE.Object3D(),new THREE.Object3D(),new THREE.Object3D()];
    joints.forEach((j,i)=>{j.name=`${spec.name} · ${(spec.thumb?['CMC','MCP','IP']:['MCP','PIP','DIP'])[i]}`;object.add(j);});
    const capLength=distal*.30,capStart=total-capLength;
    const profile=[
      [start,.001,.001],[start+.14,.72,.76],[-.29,spec.thumb?1.19:1.065,spec.thumb?1.18:1.04],
      [0,1.035,1.025],[proximal*.34,.965,.975],[proximal*.68,.895,.925],
      [proximal,.905,.945],[proximal+middle*.36,.82,.875],
      [proximal+middle*.72,.77,.825],[proximal+middle,.775,.835],
      [total-distal*.56,.74,.825],[capStart,.66,.76]
    ];
    function profileAt(s){
      if(s>=capStart){
        const u=THREE.MathUtils.clamp((s-capStart)/capLength,0,1),round=Math.sqrt(Math.max(0,1-u*u));
        return[spec.r*.66*round,spec.d*.76*round];
      }
      for(let i=1;i<profile.length;i++)if(s<=profile[i][0]){
        const a=profile[i-1],b=profile[i],before=profile[Math.max(0,i-2)],after=profile[Math.min(profile.length-1,i+1)];
        const q=THREE.MathUtils.clamp((s-a[0])/(b[0]-a[0]),0,1),q2=q*q,q3=q2*q,span=b[0]-a[0];
        const value=k=>{
          const m0=(b[k]-before[k])/(b[0]-before[0]),m1=(after[k]-a[k])/(after[0]-a[0]);
          return Math.max(0,(2*q3-3*q2+1)*a[k]+(q3-2*q2+q)*span*m0+(-2*q3+3*q2)*b[k]+(q3-q2)*span*m1);
        };
        return[value(1)*spec.r,value(2)*spec.d];
      }
      return[0,0];
    }
    const stations=256,ys=new Float64Array(stations+1),zs=new Float64Array(stations+1);
    let current=[0,0,0];
    const bendAngle=(s)=>current[0]*THREE.MathUtils.smoothstep(s,-.11,.22)+current[1]*THREE.MathUtils.smoothstep(s,proximal-.14,proximal+.14)+current[2]*THREE.MathUtils.smoothstep(s,proximal+middle-.105,proximal+middle+.105);
    function locate(s,phi=0,offset=0){
      const index=THREE.MathUtils.clamp((s-start)/(total-start)*stations,0,stations),a=Math.min(stations-1,Math.floor(index)),q=index-a;
      const y=THREE.MathUtils.lerp(ys[a],ys[a+1],q),z=THREE.MathUtils.lerp(zs[a],zs[a+1],q),angle=bendAngle(s);
      const [rx,rz]=profileAt(s),sin=Math.sin(phi),cos=Math.cos(phi);
      const palmar=Math.max(0,sin);
      const crease=(Math.exp(-(((s-proximal)/.028)**2))+Math.exp(-(((s-proximal-middle)/.024)**2)))*.006*(.4+current[1]);
      const thickness=rz*Math.sign(sin)*Math.pow(Math.abs(sin),.92)-crease*palmar**8+offset;
      return[rx*Math.sign(cos)*Math.pow(Math.abs(cos),.96),y-thickness*Math.sin(angle),z+thickness*Math.cos(angle)];
    }
    function deform(anglesIn){
      current=anglesIn;
      ys[0]=start;zs[0]=0;
      const ds=(total-start)/stations;
      for(let i=1;i<=stations;i++){
        const mid=start+(i-.5)*ds,a=bendAngle(mid);
        ys[i]=ys[i-1]+Math.cos(a)*ds;zs[i]=zs[i-1]+Math.sin(a)*ds;
      }
      anchor.position.set(...locate(total-distal*.46,Math.PI/2,.03));
      joints.forEach((joint,i)=>{const s=[0,proximal,proximal+middle][i];const p=locate(s,0);joint.position.set(0,p[1],p[2]);joint.rotation.x=bendAngle(s);});
    }
    deform([0,0,0]);
    function deformPoint(p){
      const index=THREE.MathUtils.clamp((p.y-start)/(total-start)*stations,0,stations),a=Math.min(stations-1,Math.floor(index)),q=index-a;
      const angle=bendAngle(p.y),y=THREE.MathUtils.lerp(ys[a],ys[a+1],q),z=THREE.MathUtils.lerp(zs[a],zs[a+1],q);
      return p.set(p.x,y-p.z*Math.sin(angle),z+p.z*Math.cos(angle));
    }
    function sampleData(s){
      const index=THREE.MathUtils.clamp((s-start)/(total-start)*stations,0,stations),a=Math.min(stations-1,Math.floor(index));
      return{a,q:index-a,angle:[THREE.MathUtils.smoothstep(s,-.11,.22),THREE.MathUtils.smoothstep(s,proximal-.14,proximal+.14),THREE.MathUtils.smoothstep(s,proximal+middle-.105,proximal+middle+.105)]};
    }
    return{object,anchor,deform,joints,spec,locate,profileAt,total,start,deformPoint,angleAt:bendAngle,sampleData,ys,zs,get angles(){return current;}};
  }

  const fingers=[];
  const fingerSpecs=[
    {id:'index',name:'Index finger',position:[-.58,1.51,0],l:[.89,.65,.56],r:.225,d:.185,splay:.055,delay:.05},
    {id:'middle',name:'Middle finger',position:[-.095,1.66,0],l:[1.01,.75,.59],r:.235,d:.194,splay:.005,delay:0},
    {id:'ring',name:'Ring finger',position:[.38,1.52,0],l:[.94,.69,.56],r:.216,d:.180,splay:-.045,delay:.03},
    {id:'little',name:'Little finger',position:[.79,1.27,0],l:[.72,.51,.47],r:.179,d:.154,splay:-.12,delay:.09},
  ];
  for(const spec of fingerSpecs){
    const finger=continuousDigit(spec);fingers.push(finger);
    parts.push({id:spec.id,name:spec.name,description:`Three phalanges articulate beneath one continuous skin surface. ${spec.id==='middle'?'The longest digit leads the relaxed grasp.':spec.id==='little'?'The little finger closes slightly later to support the cupped palm.':'The pad follows a joint-controlled arc toward the palm, with a conforming nail bed on the dorsal surface.'}`,object:finger.object,anchor:finger.anchor});
  }

  const thumb=continuousDigit({id:'thumb',name:'Thumb',thumb:true,position:[-.73,.42,.08],l:[.61,.56,.55],r:.274,d:.224});
  parts.push({id:'thumb',name:'Thumb opposition',description:'Two phalanges continue from the thumb metacarpal. A broad saddle base turns its pad across the palm as the fingers flex; the skin and nail bed follow the same continuous surface.',object:thumb.object,anchor:thumb.anchor});

  function createFusedSkin(){
    const rigs=[...fingers,thumb];
    for(const rig of rigs){rig.object.updateMatrix();rig.inverseRest=rig.object.matrix.clone().invert();}
    function local(p,rig){return p.clone().applyMatrix4(rig.inverseRest);}
    function digitField(p,rig){
      const v=local(p,rig),s=v.y;
      if(s<rig.start)return Math.hypot(v.x,s-rig.start,v.z);
      if(s>rig.total)return Math.hypot(v.x,s-rig.total,v.z);
      const [rx,rz]=rig.profileAt(s),x=Math.max(.002,rx),z=Math.max(.002,rz);
      return(Math.hypot(v.x/x,v.z/z)-1)*Math.min(x,z);
    }
    function palmField(p){
      const x=p.x+.025,y=p.y-1.05,z=p.z,rxTop=.94,ryTop=.65,rzTop=.285;
      const k0=Math.hypot(x/rxTop,y/ryTop,z/rzTop),k1=Math.hypot(x/(rxTop*rxTop),y/(ryTop*ryTop),z/(rzTop*rzTop));
      const dome=k0*(k0-1)/Math.max(k1,.001);
      if(p.y>=1.3)return dome;
      let lo=0,hi=palmSections.length-1;
      while(hi-lo>1){const mid=(lo+hi)>>1;if(palmSections[mid].y<p.y)lo=mid;else hi=mid;}
      const a=palmSections[lo],b=palmSections[hi],q=THREE.MathUtils.clamp((p.y-a.y)/(b.y-a.y),0,1);
      const rx=Math.max(.001,THREE.MathUtils.lerp(a.rx,b.rx,q)),center=THREE.MathUtils.lerp(a.center,b.center,q);
      const rz=Math.max(.001,THREE.MathUtils.lerp(p.z>=0?a.front:a.back,p.z>=0?b.front:b.back,q));
      let radial=(Math.hypot((p.x-center)/rx,p.z/rz)-1)*Math.min(rx,rz);
      if(p.y<a.y||p.y>b.y)radial=Math.max(radial,Math.min(Math.abs(p.y-a.y),Math.abs(p.y-b.y)));
      return THREE.MathUtils.lerp(radial,dome,THREE.MathUtils.smoothstep(p.y,.85,1.3));
    }
    const smoothMin=(a,b,k)=>{const h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k*.25;};
    function field(p){
      let d=palmField(p),k=.03+.13*(1-THREE.MathUtils.smoothstep(p.y,1.35,2.05));
      for(const rig of rigs)d=smoothMin(d,digitField(p,rig),k);
      return d;
    }
    let vertices,region;
    if(fusedHandTemplate){vertices=Array.from(fusedHandTemplate.vertices);region=fusedHandTemplate.region;}
    else {
    const min=new THREE.Vector3(-2.3,-1.22,-.5),step=.041,nx=92,ny=135,nz=33;
    const count=nx*ny*nz,values=new Float32Array(count),grid=new Float32Array(count*3);
    const index=(x,y,z)=>x+nx*(y+ny*z),point=new THREE.Vector3();
    for(let z=0;z<nz;z++)for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){
      const i=index(x,y,z);point.set(min.x+x*step,min.y+y*step,min.z+z*step);grid.set(point.toArray(),i*3);values[i]=field(point);
    }
    vertices=[];const triangles=[],edgeVertices=new Map();
    const corners=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]];
    const tetrahedra=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
    const tetraEdges=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
    function edgeVertex(a,b){
      const key=a<b?`${a}:${b}`:`${b}:${a}`;
      if(edgeVertices.has(key))return edgeVertices.get(key);
      const t=values[a]/(values[a]-values[b]),i=vertices.length/3;
      for(let c=0;c<3;c++)vertices.push(THREE.MathUtils.lerp(grid[a*3+c],grid[b*3+c],t));
      edgeVertices.set(key,i);return i;
    }
    const va=new THREE.Vector3(),vb=new THREE.Vector3(),vc=new THREE.Vector3();
    for(let z=0;z<nz-1;z++)for(let y=0;y<ny-1;y++)for(let x=0;x<nx-1;x++){
      const cube=corners.map(c=>index(x+c[0],y+c[1],z+c[2]));
      if(cube.every(i=>values[i]>0)||cube.every(i=>values[i]<=0))continue;
      for(const tet of tetrahedra){
        const ids=tet.map(i=>cube[i]),inside=ids.filter(i=>values[i]<=0),outside=ids.filter(i=>values[i]>0);
        if(!inside.length||!outside.length)continue;
        const poly=[];
        for(const[a,b]of tetraEdges)if((values[ids[a]]<=0)!==(values[ids[b]]<=0))poly.push(edgeVertex(ids[a],ids[b]));
        const center=new THREE.Vector3();poly.forEach(i=>center.add(new THREE.Vector3().fromArray(vertices,i*3)));center.divideScalar(poly.length);
        const inward=new THREE.Vector3(),outward=new THREE.Vector3();inside.forEach(i=>inward.add(new THREE.Vector3().fromArray(grid,i*3)));outside.forEach(i=>outward.add(new THREE.Vector3().fromArray(grid,i*3)));
        const normal=outward.divideScalar(outside.length).sub(inward.divideScalar(inside.length)).normalize();
        const u=new THREE.Vector3().fromArray(vertices,poly[0]*3).sub(center).normalize(),v=new THREE.Vector3().crossVectors(normal,u).normalize();
        poly.sort((a,b)=>{va.fromArray(vertices,a*3).sub(center);vb.fromArray(vertices,b*3).sub(center);return Math.atan2(va.dot(v),va.dot(u))-Math.atan2(vb.dot(v),vb.dot(u));});
        for(let i=1;i+1<poly.length;i++)triangles.push(poly[0],poly[i],poly[i+1]);
      }
    }
    // Separate highlight regions with shared, boundary-conforming vertices.
    region=new Map(parts.map(p=>[p.id,{skin:[],nail:[]}]));const cutCache=new Map();
    const sample=i=>new THREE.Vector3().fromArray(vertices,i*3);
    function split(poly,fn,key){
      const yes=[],no=[];
      for(let i=0;i<poly.length;i++){
        const a=poly[(i+poly.length-1)%poly.length],b=poly[i],da=fn(sample(a)),db=fn(sample(b));
        if((da<=0)!==(db<=0)){
          const cacheKey=`${key}:${Math.min(a,b)}:${Math.max(a,b)}`;let c=cutCache.get(cacheKey);
          if(c===undefined){let lo=0,hi=1;for(let k=0;k<22;k++){const t=(lo+hi)/2;const d=fn(sample(a).lerp(sample(b),t));if((d<=0)===(da<=0))lo=t;else hi=t;}c=vertices.length/3;vertices.push(...sample(a).lerp(sample(b),(lo+hi)/2).toArray());cutCache.set(cacheKey,c);}
          yes.push(c);no.push(c);
        }
        (db<=0?yes:no).push(b);
      }
      return[yes,no];
    }
    const emit=(poly,target)=>{for(let i=1;i+1<poly.length;i++)target.push(poly[0],poly[i],poly[i+1]);};
    for(let i=0;i<triangles.length;i+=3){
      let remainder=triangles.slice(i,i+3);
      for(const rig of rigs){
        if(remainder.length<3)break;
        const pick=p=>{const v=local(p,rig),[rx,rz]=rig.profileAt(THREE.MathUtils.clamp(v.y,rig.start,rig.total));return Math.max(.035-v.y,Math.hypot(v.x/Math.max(.01,rx),v.z/Math.max(.01,rz))-1.45);};
        const [selected,rest]=split(remainder,pick,rig.spec.id);remainder=rest;
        if(selected.length<3)continue;
        const nailFn=p=>{const v=local(p,rig),phi=Math.atan2(v.z/rig.spec.d,v.x/rig.spec.r);const angle=phi<0?phi+Math.PI*2:phi;const distal=rig.spec.l[2];return((v.y-rig.total+distal*.43)/(distal*.30))**4+((angle-Math.PI*1.5)/.78)**4-1;};
        const[nailPoly,skinPoly]=split(selected,nailFn,`${rig.spec.id}-nail`);emit(nailPoly,region.get(rig.spec.id).nail);emit(skinPoly,region.get(rig.spec.id).skin);
      }
      if(remainder.length>=3){const[a,b]=split(remainder,p=>Math.max((p.x+.48)**2/.19+(p.y-.39)**2/.48-1,(.14-p.z)*6),'thenar');emit(a,region.get('thenar').skin);emit(b,region.get('palm').skin);}
    }
    // A later region cut can place a vertex on an earlier region's edge. Split
    // that opposing face too, so deformation never opens a T-junction crack.
    const edgeKey=(a,b)=>a<b?`${a}:${b}`:`${b}:${a}`;
    for(let pass=0;pass<2;pass++){
      const counts=new Map();
      for(const r of region.values())for(const faces of[r.skin,r.nail])for(let i=0;i<faces.length;i+=3)for(const[a,b]of[[0,1],[1,2],[2,0]]){const key=edgeKey(faces[i+a],faces[i+b]);counts.set(key,(counts.get(key)||0)+1);}
      const boundary=[...counts].filter(([,n])=>n===1).map(([key])=>key.split(':').map(Number));
      const boundaryVertices=[...new Set(boundary.flat())],splits=new Map();
      for(const[a,b]of boundary){
        const pa=new THREE.Vector3().fromArray(vertices,a*3),pb=new THREE.Vector3().fromArray(vertices,b*3),ab=pb.clone().sub(pa),length=ab.lengthSq(),middle=[];
        for(const c of boundaryVertices){if(c===a||c===b)continue;const pc=new THREE.Vector3().fromArray(vertices,c*3),t=pc.clone().sub(pa).dot(ab)/length;if(t<=1e-5||t>=1-1e-5)continue;if(pc.distanceToSquared(pa.clone().addScaledVector(ab,t))<1e-12)middle.push([t,c]);}
        if(middle.length)splits.set(edgeKey(a,b),middle.sort((x,y)=>x[0]-y[0]).map(v=>v[1]));
      }
      if(!splits.size)break;
      for(const r of region.values())for(const type of['skin','nail']){
        const source=r[type],replacement=[];
        for(let i=0;i<source.length;i+=3){
          const tri=source.slice(i,i+3),polygon=[];let changed=false;
          for(let j=0;j<3;j++){const a=tri[j],b=tri[(j+1)%3];polygon.push(a);const add=splits.get(edgeKey(a,b));if(add){changed=true;polygon.push(...(a<b?add:[...add].reverse()));}}
          if(!changed){replacement.push(...tri);continue;}
          const center=vertices.length/3;for(let axis=0;axis<3;axis++)vertices.push((vertices[tri[0]*3+axis]+vertices[tri[1]*3+axis]+vertices[tri[2]*3+axis])/3);
          for(let j=0;j<polygon.length;j++)replacement.push(center,polygon[j],polygon[(j+1)%polygon.length]);
        }
        r[type]=replacement;
      }
    }
    }
    const sample=i=>new THREE.Vector3().fromArray(vertices,i*3);
    const full=new THREE.BufferGeometry();full.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
    full.setIndex([...region.values()].flatMap(r=>[...r.skin,...r.nail]));full.computeVertexNormals();
    const positions=full.attributes.position;
    // Blend skin ownership through the root web rather than detaching a rigid digit.
    function binding(p){
      const distances=[palmField(p),...rigs.map(r=>digitField(p,r))],lowest=Math.min(...distances),weights=distances.map(d=>Math.exp(-(d-lowest)/.036)),sum=weights.reduce((a,b)=>a+b,0);
      const e=.006,n=new THREE.Vector3(
        field(p.clone().add(new THREE.Vector3(e,0,0)))-field(p.clone().add(new THREE.Vector3(-e,0,0))),
        field(p.clone().add(new THREE.Vector3(0,e,0)))-field(p.clone().add(new THREE.Vector3(0,-e,0))),
        field(p.clone().add(new THREE.Vector3(0,0,e)))-field(p.clone().add(new THREE.Vector3(0,0,-e)))
      ).normalize();
      return{p:p.clone(),normal:n,weights:weights.map(w=>w/sum),local:rigs.map(r=>local(p,r)),samples:rigs.map(r=>r.sampleData(local(p,r).y)),localNormal:rigs.map(r=>n.clone().applyMatrix3(new THREE.Matrix3().setFromMatrix4(r.inverseRest)))};
    }
    const bindings=fusedHandTemplate?.bindings||Array.from({length:positions.count},(_,i)=>binding(sample(i)));
    full.setAttribute('normal',new THREE.Float32BufferAttribute(bindings.flatMap(b=>b.normal.toArray()),3));
    if(!fusedHandTemplate)fusedHandTemplate={vertices:Float32Array.from(vertices),region,bindings};
    for(const rig of rigs)rig.currentNormalMatrix=new THREE.Matrix3();
    const oldMeshes=[];group.traverse(o=>{if(o.isMesh)oldMeshes.push(o);});oldMeshes.forEach(o=>o.removeFromParent());
    const geometries=[];
    for(const partInfo of parts){
      const entries=region.get(partInfo.id),g=new THREE.BufferGeometry();g.setAttribute('position',positions);g.setAttribute('normal',full.attributes.normal);g.setIndex([...entries.skin,...entries.nail]);
      g.addGroup(0,entries.skin.length,0);if(entries.nail.length)g.addGroup(entries.skin.length,entries.nail.length,1);
      const nail=nailMaterial.clone();nail.color.set(0x95a5a3);nail.roughness=.84;
      const m=new THREE.Mesh(g,[skin.clone(),nail]);m.userData.partId=partInfo.id;m.castShadow=m.receiveShadow=true;
      const owner=new THREE.Group();owner.name=`${partInfo.name} · unified skin region`;owner.add(m);group.add(owner);partInfo.object=owner;g.userData.vertices=[...new Set(g.index.array)];geometries.push(g);
    }
    // Reproject the quiet palm creases onto the unified surface, then bind them to it.
    const rayMesh=new THREE.Mesh(full,skin),lineBindings=[];rayMesh.updateMatrixWorld(true);
    let lineNumber=0;
    group.traverse(o=>{if(o.isLine){
      let items=fusedHandTemplate.lineBindings?.[lineNumber++];
      if(!items){items=[];const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){const p=new THREE.Vector3().fromBufferAttribute(a,i),sign=p.z<0?-1:1;surfaceRay.set(new THREE.Vector3(p.x,p.y,sign*3),new THREE.Vector3(0,0,-sign));const hit=surfaceRay.intersectObject(rayMesh)[0];if(hit)p.z=hit.point.z+sign*.003;items.push(binding(p));}}
      lineBindings.push({geometry:o.geometry,items});
    }});
    if(!fusedHandTemplate.lineBindings)fusedHandTemplate.lineBindings=lineBindings.map(b=>b.items);
    const out=new THREE.Vector3(),q=new THREE.Vector3();
    function apply(item){
      out.copy(item.p).multiplyScalar(item.weights[0]);
      for(let i=0;i<rigs.length;i++){const weight=item.weights[i+1];if(weight<.0005)continue;const rig=rigs[i];q.copy(item.local[i]);rig.deformPoint(q);q.applyMatrix4(rig.object.matrix);out.addScaledVector(q,weight);}
      return out;
    }
    function updateSkin(){
      rigs.forEach(r=>{r.object.updateMatrix();r.currentNormalMatrix.setFromMatrix4(r.object.matrix);});
      const posArray=positions.array,normals=full.attributes.normal,normArray=normals.array;
      for(let j=0;j<bindings.length;j++){
        const item=bindings[j],w0=item.weights[0];
        let px=item.p.x*w0,py=item.p.y*w0,pz=item.p.z*w0,nx=item.normal.x*w0,ny=item.normal.y*w0,nz=item.normal.z*w0;
        for(let i=0;i<rigs.length;i++){
          const weight=item.weights[i+1];if(weight<.0005)continue;
          const rig=rigs[i],sample=item.samples[i],angles=rig.angles,angle=sample.angle[0]*angles[0]+sample.angle[1]*angles[1]+sample.angle[2]*angles[2];
          const c=Math.cos(angle),sn=Math.sin(angle),v=item.local[i],n=item.localNormal[i],a=sample.a,f=sample.q;
          const y=rig.ys[a]*(1-f)+rig.ys[a+1]*f-v.z*sn,z=rig.zs[a]*(1-f)+rig.zs[a+1]*f+v.z*c,m=rig.object.matrix.elements;
          px+=(m[0]*v.x+m[4]*y+m[8]*z+m[12])*weight;py+=(m[1]*v.x+m[5]*y+m[9]*z+m[13])*weight;pz+=(m[2]*v.x+m[6]*y+m[10]*z+m[14])*weight;
          const dy=n.y*c-n.z*sn,dz=n.y*sn+n.z*c;
          nx+=(m[0]*n.x+m[4]*dy+m[8]*dz)*weight;ny+=(m[1]*n.x+m[5]*dy+m[9]*dz)*weight;nz+=(m[2]*n.x+m[6]*dy+m[10]*dz)*weight;
        }
        const length=Math.hypot(nx,ny,nz)||1,k=j*3;posArray[k]=px;posArray[k+1]=py;posArray[k+2]=pz;normArray[k]=nx/length;normArray[k+1]=ny/length;normArray[k+2]=nz/length;
      }
      positions.needsUpdate=true;normals.needsUpdate=true;
      for(const g of geometries){const box=new THREE.Box3();for(const i of g.userData.vertices)box.expandByPoint(q.fromBufferAttribute(positions,i));g.boundingBox=box;g.boundingSphere=box.getBoundingSphere(new THREE.Sphere());}
      for(const{geometry,items}of lineBindings){const p=geometry.attributes.position;items.forEach((item,i)=>{const v=apply(item);p.setXYZ(i,v.x,v.y,v.z);});p.needsUpdate=true;geometry.computeBoundingSphere();}
    }
    fusedActive=true;return{update:updateSkin};
  }

  const ease = x => { const q = THREE.MathUtils.clamp(x,0,1); return q*q*(3-2*q); };
  function grasp(t) {
    const phase = ((t%5)+5)%5;
    if(phase<0.48)return 0;
    if(phase<2.12)return ease((phase-0.48)/1.64);
    if(phase<2.85)return 1;
    if(phase<4.62)return 1-ease((phase-2.85)/1.77);
    return 0;
  }
  let fusedSkin=null;
  function update(tSeconds) {
    const g = grasp(tSeconds);
    for(const finger of fingers){
      const {spec}=finger,f=ease((g-spec.delay)/(1-spec.delay));
      finger.object.rotation.z=spec.splay*(1-f*.72);
      finger.deform([.035+f*(spec.id==='little'?.92:1.04),.055+f*.98,.045+f*.62]);
    }
    thumb.object.rotation.set(.12+g*.08,-.18-g*.36,.82-g*1.22,'XYZ');
    thumb.deform([0,.10+g*.47,.08+g*.44]);
    if(!fusedActive){
    for(let i=0;i<palmPositions.count;i++)palmPositions.array[i*3+2]=palmRest[i*3+2]+g*.014*thenarWeights[i];
    palmPositions.needsUpdate=true;
    palmGeometry.computeVertexNormals();
    }
    fusedSkin?.update();
    group.updateMatrixWorld(true);
  }
  const wristAnchor = new THREE.Object3D();
  wristAnchor.name = 'Wrist attachment';
  wristAnchor.position.set(0.03,-1.08,-0.04);
  group.add(wristAnchor);
  update(0);
  fusedSkin=createFusedSkin();
  update(0);
  const restBounds = new THREE.Box3().setFromObject(group);
  return {
    group,parts,update,wristAnchor,
    bounds:{min:restBounds.min.toArray(),max:restBounds.max.toArray()},
    camera:{ target:[-0.12,1.35,0.1], position:[5.4,3.2,10.0] },
    title:'The hand, in motion',
    subtitle:'Opposition · flexion · coordinated release',
    beats:[
      {time:0,label:'Open',description:'A relaxed palm with five distinct digits and a broad thumb web.'},
      {time:0.48,label:'Gather',description:'The finger knuckles begin the grasp; the thumb turns toward the palm.'},
      {time:2.12,label:'Grasp',description:'Interphalangeal flexion carries the pads inward. The thenar pad subtly changes with opposition.'},
      {time:2.85,label:'Release',description:'The linked joints reverse their arcs and recover the open hand.'},
      {time:4.62,label:'Settle',description:'The rest pose is held before the exact five-second loop repeats.'}
    ],
    metrics(t){const g=ease(grasp(t));return[
      {label:'Knuckle flexion',value:`${Math.round((0.035+g*1.04)*180/Math.PI)}°`},
      {label:'PIP flexion',value:`${Math.round((0.055+g*.98)*180/Math.PI)}°`},
      {label:'Cycle',value:'5.00 s'}
    ];}
  };
}
