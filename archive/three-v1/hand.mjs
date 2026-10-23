import * as THREE from 'three';

/** Original procedural surface study. Units are proportions, not clinical measurements. */
export function createHand() {
  const group = new THREE.Group();
  group.name = 'Articulated hand · palmar study';
  const parts = [];
  const skin = new THREE.MeshStandardMaterial({ color: 0x899b9b, roughness: 0.68, metalness: 0.12 });
  const nailMaterial = new THREE.MeshStandardMaterial({ color: 0x899b9b, roughness: 0.9, metalness: 0.1 });
  const creaseMaterial = new THREE.LineBasicMaterial({ color: 0x465d60, transparent: true, opacity: 0.48 });
  const sphere = new THREE.SphereGeometry(1, 32, 24);
  let palmSurface = null;
  const surfaceRay = new THREE.Raycaster();

  function mesh(geometry, parent, material = skin) {
    const m = new THREE.Mesh(geometry, material.clone());
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function volume(parent, position, scale, rotation = 0, material = skin) {
    const m = mesh(sphere, parent, material);
    m.position.set(...position);
    m.scale.set(...scale);
    m.rotation.z = rotation;
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

  function segment(parent, length, radius, depth, terminal = false) {
    const rows = terminal ? [
      [-0.085,radius*0.82,depth*0.82], [0,radius,depth],
      [length*0.23,radius*0.98,depth*1.03,0,0.008],
      [length*0.57,radius*0.90,depth*0.99,0,0.014],
      [length*0.81,radius*0.74,depth*0.82,0,0.022],
      [length*0.96,radius*0.38,depth*0.43,0,0.021],
      [length,radius*0.02,depth*0.02,0,0.02]
    ] : [
      [-0.11,radius*0.90,depth*0.90], [0,radius,depth],
      [length*0.20,radius*0.985,depth*1.015],
      [length*0.52,radius*0.91,depth*0.96,0,0.008],
      [length*0.81,radius*0.86,depth*0.89],
      [length,radius*0.82,depth*0.85],
      [length+0.07,radius*0.48,depth*0.49]
    ];
    mesh(loft(rows, 32, 32), parent);
    volume(parent, [0,0,0], [radius*0.985,depth*1.07,depth*0.99]);
    curve(parent, [[-radius*.72,0.08,depth*.72],[-radius*.35,0.06,depth*.965],[0,0.055,depth*1.025],[radius*.38,0.06,depth*.96],[radius*.73,0.08,depth*.71]],0.40);
    if (terminal) {
      // A thin curved dorsal nail shell follows the distal pad instead of a flat label rectangle.
      const nail = volume(parent, [0,length*0.55,-depth*0.89], [radius*0.69,length*0.27,0.027], 0, nailMaterial);
      nail.name = 'Dorsal nail plate';
      curve(parent, [[-radius*.58,length*.34,-depth*.93],[0,length*.28,-depth*1.04],[radius*.58,length*.34,-depth*.93]],0.22);
    }
  }

  const fingers = [];
  const fingerSpecs = [
    {id:'index',name:'Index finger',x:-0.58,y:1.51,l:[0.89,0.65,0.56],r:0.205,d:0.178,splay:0.055,delay:0.05},
    {id:'middle',name:'Middle finger',x:-0.095,y:1.66,l:[1.01,0.75,0.59],r:0.216,d:0.184,splay:0.005,delay:0},
    {id:'ring',name:'Ring finger',x:0.38,y:1.52,l:[0.94,0.69,0.56],r:0.200,d:0.171,splay:-0.045,delay:0.03},
    {id:'little',name:'Little finger',x:0.79,y:1.27,l:[0.72,0.51,0.47],r:0.165,d:0.147,splay:-0.12,delay:0.09},
  ];
  for (const spec of fingerSpecs) {
    const base = new THREE.Group();
    base.name = `${spec.name} · metacarpophalangeal joint`;
    base.position.set(spec.x,spec.y,0);
    base.rotation.z = spec.splay;
    group.add(base);
    segment(base,spec.l[0],spec.r,spec.d);
    const pip = new THREE.Group();
    pip.name = `${spec.name} · proximal interphalangeal joint`;
    pip.position.y = spec.l[0];
    base.add(pip);
    segment(pip,spec.l[1],spec.r*.81,spec.d*.84);
    const dip = new THREE.Group();
    dip.name = `${spec.name} · distal interphalangeal joint`;
    dip.position.y = spec.l[1];
    pip.add(dip);
    segment(dip,spec.l[2],spec.r*.70,spec.d*.75,true);
    fingers.push({base,pip,dip,spec});
    const anchor = new THREE.Object3D();
    anchor.position.set(0,spec.l[2]*0.56,spec.d*.9);
    dip.add(anchor);
    base.traverse(child=>{if(child.isMesh||child.isLine)child.userData.partId=spec.id;});
    parts.push({id:spec.id,name:spec.name,description:`Three linked phalanges flex at the knuckle and two interphalangeal joints. ${spec.id==='middle'?'The longest digit leads the relaxed grasp.':spec.id==='little'?'The little finger closes slightly later and helps cup the ulnar side of the palm.':'The fingertip follows an arc toward the palm while the joint chain preserves segment length.'}`,object:base,anchor});
  }
  // Small interdigital webs overlap only the stationary bases, never bridge the moving tips.
  for (const [x,y,scale] of [[-0.34,1.48,0.21],[0.15,1.47,0.20],[0.60,1.26,0.20]]) {
    volume(palm,[x,y,-0.015],[scale,0.18,0.18]);
  }
  palm.traverse(child=>{if(child.isMesh||child.isLine)child.userData.partId='palm';});

  const thumb = new THREE.Group();
  thumb.name = 'Thumb · saddle and opposition';
  thumb.position.set(-0.75,0.41,0.10);
  group.add(thumb);
  // The metacarpal root remains nestled in the thenar volume through the full motion.
  segment(thumb,0.61,0.255,0.215);
  const thumbMcp = new THREE.Group();
  thumbMcp.name = 'Thumb · metacarpophalangeal joint';
  thumbMcp.position.y = 0.61;
  thumb.add(thumbMcp);
  segment(thumbMcp,0.56,0.225,0.19);
  const thumbIp = new THREE.Group();
  thumbIp.name = 'Thumb · interphalangeal joint';
  thumbIp.position.y = 0.56;
  thumbMcp.add(thumbIp);
  segment(thumbIp,0.55,0.198,0.174,true);
  const thumbAnchor = new THREE.Object3D();
  thumbAnchor.position.set(0,0.28,0.19);
  thumbIp.add(thumbAnchor);
  thumb.traverse(child=>{if(child.isMesh||child.isLine)child.userData.partId='thumb';});
  parts.push({id:'thumb',name:'Thumb opposition',description:'The thumb has two phalanges beyond its metacarpal. Its saddle-base motion turns the pad across the palm as the fingers flex, then returns to the open hand.',object:thumb,anchor:thumbAnchor});

  const ease = x => { const q = THREE.MathUtils.clamp(x,0,1); return q*q*(3-2*q); };
  function grasp(t) {
    const phase = ((t%5)+5)%5;
    if(phase<0.48)return 0;
    if(phase<2.12)return ease((phase-0.48)/1.64);
    if(phase<2.85)return 1;
    if(phase<4.62)return 1-ease((phase-2.85)/1.77);
    return 0;
  }
  function update(tSeconds) {
    const g = grasp(tSeconds);
    for(const {base,pip,dip,spec} of fingers) {
      const f = ease((g-spec.delay)/(1-spec.delay));
      base.rotation.x = 0.035 + f*(spec.id==='little'?0.92:1.04);
      base.rotation.z = spec.splay*(1-f*.72);
      pip.rotation.x = 0.055+f*0.98;
      dip.rotation.x = 0.045+f*0.62;
    }
    thumb.rotation.set(0.12+g*0.08, -0.18-g*0.36, 0.82-g*1.22, 'XYZ');
    thumbMcp.rotation.x=0.10+g*0.47;
    thumbMcp.rotation.z=-g*0.12;
    thumbIp.rotation.x=0.08+g*0.44;
    for(let i=0;i<palmPositions.count;i++)palmPositions.array[i*3+2]=palmRest[i*3+2]+g*.014*thenarWeights[i];
    palmPositions.needsUpdate=true;
    palmGeometry.computeVertexNormals();
    group.updateMatrixWorld(true);
  }
  const wristAnchor = new THREE.Object3D();
  wristAnchor.name = 'Wrist attachment';
  wristAnchor.position.set(0.03,-1.08,-0.04);
  group.add(wristAnchor);
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
