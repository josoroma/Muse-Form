import * as THREE from 'three';

// Original native detail: groomed geometry and analytic shaders, with no images.
const TAU = Math.PI * 2;
const mix = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;
const smooth = t => { t=clamp(t,0,1); return t*t*(3-2*t); };
const V = a => new THREE.Vector3(...a);
const hash = n => { const x=Math.sin(n*127.1+311.7)*43758.5453; return x-Math.floor(x); };

/** Freeze shader coordinates once, after the model's first neutral update. */
export function captureRestPositions(geometry) {
  if(!geometry.attributes.portraitRest && geometry.attributes.position) {
    geometry.setAttribute('portraitRest',geometry.attributes.position.clone());
  }
  return geometry;
}

function cloneSafe(material, install) {
  install(material);
  material.clone=function(){
    const copy=new this.constructor(); copy.copy(this);
    return cloneSafe(copy,install);
  };
  return material;
}

const REST_VERTEX = `
attribute vec3 portraitRest;
varying vec3 vPortraitRest;
`;
const NOISE = `
float portraitHash(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}
float portraitNoise(vec3 p) {
  vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(portraitHash(i),portraitHash(i+vec3(1,0,0)),f.x),
                 mix(portraitHash(i+vec3(0,1,0)),portraitHash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(portraitHash(i+vec3(0,0,1)),portraitHash(i+vec3(1,0,1)),f.x),
                 mix(portraitHash(i+vec3(0,1,1)),portraitHash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
`;

function skinShader(material) {
  material.customProgramCacheKey=()=> 'portrait-skin-rest-v3';
  material.onBeforeCompile=shader=>{
    shader.vertexShader=shader.vertexShader.replace('#include <common>',`#include <common>\n${REST_VERTEX}`)
      .replace('#include <begin_vertex>','#include <begin_vertex>\nvPortraitRest = portraitRest;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>\nvarying vec3 vPortraitRest;\n${NOISE}`)
      .replace('#include <color_fragment>',`#include <color_fragment>
        vec3 rp=vPortraitRest;
        float cheeks=exp(-pow((abs(rp.x)-0.59)/0.29,2.0)-pow((rp.y-3.40)/0.24,2.0));
        float nose=exp(-pow(rp.x/0.21,2.0)-pow((rp.y-3.33)/0.17,2.0));
        float warm=min(1.0,cheeks*0.8+nose*0.35);
        float mottling=portraitNoise(rp*34.0)-0.5;
        diffuseColor.rgb *= mix(vec3(1.0),vec3(1.035,0.925,0.91),warm*0.40);
        diffuseColor.rgb *= 1.0+mottling*0.016;
      `)
      .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor+(portraitNoise(vPortraitRest*135.0)-0.5)*0.055,0.34,0.75);
      `)
      .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
        float pore=portraitNoise(vPortraitRest*195.0)+0.30*portraitNoise(vPortraitRest*370.0);
        vec3 px=dFdx(vViewPosition), py=dFdy(vViewPosition);
        vec3 rx=cross(py,normal), ry=cross(normal,px);
        float det=dot(px,rx);
        vec3 grad=dFdx(pore)*rx+dFdy(pore)*ry;
        if(abs(det)>1e-12) normal=normalize(abs(det)*normal-sign(det)*grad*0.000055);
      `);
  };
}

function lipShader(material) {
  material.customProgramCacheKey=()=> 'portrait-lip-rest-v2';
  material.onBeforeCompile=shader=>{
    shader.vertexShader=shader.vertexShader.replace('#include <common>',`#include <common>\n${REST_VERTEX}`)
      .replace('#include <begin_vertex>','#include <begin_vertex>\nvPortraitRest = portraitRest;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>\nvarying vec3 vPortraitRest;\n${NOISE}`)
      .replace('#include <color_fragment>',`#include <color_fragment>
        float striae=sin(vPortraitRest.x*410.0+portraitNoise(vPortraitRest*32.0)*4.0)*0.5+0.5;
        diffuseColor.rgb*=0.98+0.025*striae;
      `)
      .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
        roughnessFactor+=0.035*(portraitNoise(vPortraitRest*vec3(170.0,9.0,30.0))-0.5);
      `);
  };
}

/** Polar UVs: u is angle / 2pi, v is radius / iris radius. */
export function createIrisMaterial() {
  const olive=new THREE.Color(0x4d6246), amber=new THREE.Color(0x7b774c), limbus=new THREE.Color(0x23382c);
  function install(material) {
    material.customProgramCacheKey=()=> 'portrait-hazel-iris-polar-v3';
    material.onBeforeCompile=shader=>{
      shader.uniforms.irisOlive={value:olive};shader.uniforms.irisAmber={value:amber};shader.uniforms.irisLimbus={value:limbus};
      shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 vIrisPolar;')
        .replace('#include <begin_vertex>','#include <begin_vertex>\nvIrisPolar = uv;');
      shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
        varying vec2 vIrisPolar;
        uniform vec3 irisOlive, irisAmber, irisLimbus;
      `).replace('#include <color_fragment>',`#include <color_fragment>
        float angle=vIrisPolar.x*6.28318530718, r=vIrisPolar.y;
        float f1=sin(angle*113.0+sin(angle*17.0)*2.0+r*9.0);
        float f2=sin(angle*197.0-r*7.0+sin(angle*43.0));
        float fiber=clamp(0.5+0.29*f1+0.21*f2,0.0,1.0);
        float collarette=exp(-pow((r-(0.53+0.025*sin(angle*19.0)))/0.038,2.0));
        vec3 c=mix(irisOlive,irisAmber,(1.0-smoothstep(0.43,0.63,r))*.72);
        c*=0.69+0.47*fiber;
        c=mix(c,irisAmber*0.75,collarette*0.44);
        c=mix(c,irisLimbus,smoothstep(0.85,0.995,r)*0.92);
        c*=0.93+0.07*sin(r*88.0+fiber*3.0);
        diffuseColor.rgb=c;
      `);
    };
  }
  return cloneSafe(new THREE.MeshPhysicalMaterial({color:0x75805a,roughness:.27,metalness:0,clearcoat:.85,clearcoatRoughness:.09,envMapIntensity:1.05}),install);
}

export function createPortraitMaterials() {
  const skin=cloneSafe(new THREE.MeshPhysicalMaterial({color:0xd1ad98,roughness:.49,metalness:0,clearcoat:.055,clearcoatRoughness:.40,sheen:.11,sheenColor:0xdcae97,sheenRoughness:.78,envMapIntensity:.72}),skinShader);
  const lip=cloneSafe(new THREE.MeshPhysicalMaterial({color:0xad6967,roughness:.34,metalness:0,clearcoat:.30,clearcoatRoughness:.26,envMapIntensity:.72}),lipShader);
  const hair=new THREE.MeshPhysicalMaterial({color:0x30201c,roughness:.45,metalness:0,clearcoat:.18,clearcoatRoughness:.40,envMapIntensity:.78});
  const sclera=new THREE.MeshPhysicalMaterial({color:0xd7d1c5,roughness:.22,metalness:0,clearcoat:1,clearcoatRoughness:.065,envMapIntensity:1.0});
  const pupil=new THREE.MeshPhysicalMaterial({color:0x101613,roughness:.18,metalness:0,clearcoat:1,clearcoatRoughness:.06,envMapIntensity:.85});
  const cornea=new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.045,metalness:0,clearcoat:1,clearcoatRoughness:.025,transparent:true,opacity:.12,depthWrite:false,envMapIntensity:1.15});
  return {skin,lip,lips:lip,hair,sclera,eyeWhite:sclera,iris:createIrisMaterial(),pupil,cornea};
}

function mesh(parent,geometry,material) {
  const m=new THREE.Mesh(geometry,material);m.castShadow=true;m.receiveShadow=true;
  m.name='Native groomed hair';m.userData.portraitHair=true;parent.add(m);return m;
}

function sampledSurface(fn,nu,nv) {
  const p=[],uv=[],indices=[];
  for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){p.push(...fn(i/nu,j/nv));uv.push(i/nu,j/nv);}
  for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=j*(nu+1)+i,b=a+nu+1;indices.push(a,b,a+1,a+1,b,b+1);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}

// All strand families share one buffer per tone, rather than one draw per hair.
function strandBatch(parent,curves,color,opacity) {
  const p=[];
  for(const curve of curves)for(let i=1;i<curve.length;i++)p.push(...curve[i-1].toArray(),...curve[i].toArray());
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));
  const line=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false}));
  line.userData.portraitHair=true;line.userData.noShadow=true;line.name='Batched fine hair strands';parent.add(line);return line;
}

function tubeBatch(parent,paths,material,sides=5) {
  const p=[],uv=[],indices=[];
  for(const {points,radius} of paths){
    const offset=p.length/3;
    for(let i=0;i<points.length;i++){
      const t=i/(points.length-1),prev=points[Math.max(0,i-1)],next=points[Math.min(points.length-1,i+1)];
      const tangent=next.clone().sub(prev).normalize();
      let n=points[i].clone().sub(new THREE.Vector3(0,3.65,0)).normalize();
      n.addScaledVector(tangent,-n.dot(tangent)).normalize();
      if(n.lengthSq()<.1)n.set(0,0,1);
      const b=new THREE.Vector3().crossVectors(tangent,n).normalize();
      const rr=radius*Math.max(.035,Math.pow(Math.sin(Math.PI*(.04+.96*t)),.36))*(1-.78*Math.pow(t,3));
      for(let k=0;k<=sides;k++){
        const a=k/sides*TAU,v=points[i].clone().addScaledVector(n,Math.cos(a)*rr).addScaledVector(b,Math.sin(a)*rr);
        p.push(...v.toArray());uv.push(t,k/sides);
      }
      if(i)for(let k=0;k<sides;k++){const a=offset+(i-1)*(sides+1)+k,b=a+sides+1;indices.push(a,b,a+1,a+1,b,b+1);}
    }
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return mesh(parent,g,material);
}

/** Swept brunette cap, gathered low bun and fine face-framing locks. */
export function createHair({parent,profile,front}={}) {
  if(!parent)throw new TypeError('createHair requires a parent head group');
  const group=new THREE.Group();group.name='Swept brunette hair';parent.add(group);
  const hair=new THREE.MeshPhysicalMaterial({color:0x201715,roughness:.57,metalness:0,clearcoat:.045,clearcoatRoughness:.48,envMapIntensity:.63});
  const lockMat=new THREE.MeshPhysicalMaterial({color:0x2d211b,roughness:.53,metalness:0,clearcoat:.05,clearcoatRoughness:.48,envMapIntensity:.63});
  function capPoint(a,v,lift=0) {
    const s=Math.sin(a),c=Math.cos(a),f=Math.max(0,c);
    const bottom=3.00+1.62*Math.pow(f,1.75)+.36*s*s+.055*s*f-.040*Math.exp(-(((a-.13)/.17)**2));
    const thetaMax=Math.acos(clamp((bottom-3.68)/1.69,-1,1));
    const theta=.012+v*(thetaMax-.012),sy=Math.sin(theta),cy=Math.cos(theta);
    const ripple=.0017*Math.sin(a*51+v*8)*Math.sin(Math.PI*v);
    const tuck=.045*smooth((v-.87)/.13);
    let x=(1.135+ripple-tuck)*sy*s;
    const y=3.68+1.69*cy, z=.025+(.995+ripple-tuck)*sy*c;
    const earTuck=.16*Math.exp(-(((y-3.49)/.39)**2)-((z+.035)/.25)**2);
    x-=Math.sign(x)*earTuck;
    const n=new THREE.Vector3(x/1.135,(y-3.68)/1.69,(z-.025)/.995).normalize();
    return new THREE.Vector3(x,y,z).addScaledVector(n,lift);
  }
  const cap=sampledSurface((u,v)=>capPoint((u-.5)*TAU,v).toArray(),168,80);
  mesh(group,cap,hair);

  const strands=[[],[],[]],locks=[];
  for(const side of [-1,1])for(let k=0;k<42;k++){
    const root=.035+.955*(k+.30*(hash(k+side*73)-.5))/41;
    const endAngle=side*(3.08+.035*hash(k+side*51));
    const points=[];
    for(let n=0;n<=44;n++){
      const t=n/44,a=side*.012+endAngle*Math.pow(t,.89),v=mix(root,.92+.045*root,t*t);
      points.push(capPoint(a,v,.005+.003*Math.sin(Math.PI*t)));
    }
    if(k%3===0)locks.push({points,radius:.005+.003*hash(k+side*57)});
    for(let j=0;j<4;j++){
      const id=(side+2)*1000+k*11+j,curve=[];
      for(let n=0;n<=42;n++){
        const t=n/42,a=side*(.008+j*.0035)+endAngle*Math.pow(t,.89)+.003*Math.sin(t*6+id),v=mix(root+(j-1.5)*(.002+hash(id)*.003),.92+.045*root+(j-1.5)*.002,t*t);
        curve.push(capPoint(a,clamp(v,.008,1),.006+hash(id)*.003));
      }
      strands[id%3].push(curve);
    }
  }
  tubeBatch(group,locks,lockMat,5);

  // The sagittal part continues over the crown: rear roots flow into the nape.
  // This closes the groom over the back of the head instead of leaving a shell.
  for(const side of[-1,1])for(let k=0;k<30;k++)for(let j=0;j<3;j++){
    const id=4000+(side+2)*1000+k*7+j,startAngle=side*(1.13+1.96*(k+hash(id)*.35)/29),curve=[];
    for(let n=0;n<=46;n++){
      const t=n/46,a=mix(startAngle,side*(3.12+(j-1)*.004),Math.pow(t,.82)),v=.018+.955*t;
      curve.push(capPoint(a+.004*Math.sin(t*7+id),v+(j-1)*.002,.006+hash(id)*.003));
    }
    strands[id%3].push(curve);
  }

  // A gentle off-centre part, fine enough to expose scalp without a painted stripe.
  const part=[];
  for(let i=0;i<=50;i++)part.push(capPoint(.015,.05+i/50*.92,.014));
  strandBatch(group,[part],0x806452,.22);

  // Gathered coil: one organic bun surface with a quiet spiral groom.
  const bunCenter=new THREE.Vector3(.035,3.16,-.88);
  const bunPoint=(a,b,offset=0)=>{
    const r=1+.009*Math.sin(a*7+b*4);
    return new THREE.Vector3(bunCenter.x+(.63+offset)*Math.cos(b)*Math.sin(a)*r,
      bunCenter.y+(.54+offset)*Math.sin(b),bunCenter.z-(.46+offset)*Math.cos(b)*Math.cos(a)*r);
  };
  mesh(group,sampledSurface((u,v)=>bunPoint(u*TAU,-Math.PI/2+v*Math.PI).toArray(),80,48),hair.clone());
  const bunLocks=[];
  for(let j=0;j<66;j++){
    const points=[];
    for(let n=0;n<=46;n++){
      const t=n/46,a=(j+.30*hash(j))/66*TAU+t*2.4,b=-1.30+t*2.62;
      points.push(bunPoint(a,b,.009));
    }
    strands[j%3].push(points);
    if(j%10===0)bunLocks.push({points,radius:.006});
  }
  tubeBatch(group,bunLocks,lockMat,5);

  // A few S-shaped tendrils sit in front of the ears, ending near jaw and neck.
  const tendrils=[];
  for(const side of [-1,1])for(let j=0;j<2;j++){
    const offset=j*.045,control=[
      [side*(.99+offset),4.18-j*.06,.40],
      [side*(1.09+offset),3.87-j*.07,.48],
      [side*(1.075+offset),3.57-j*.10,.50],
      [side*(1.105+offset),3.31-j*.10,.43],
      [side*(1.00+offset),3.02-j*.10,.45],
      [side*(.97+offset),2.78-j*.09,.35],
      [side*(1.04+offset),2.58-j*.11,.20]
    ];
    const path=new THREE.CatmullRomCurve3(control.map(V)),points=path.getPoints(72);
    tendrils.push({points,radius:j?.010:.017});
    for(let k=0;k<5;k++)strands[(k+j)%3].push(points.map((p,n)=>p.clone().add(new THREE.Vector3((k-2)*.004,0,.004*Math.sin(n*.10+k)))));
  }
  tubeBatch(group,tendrils,lockMat,6);

  // Only a handful of crown flyaways, not a noisy fur shell.
  for(let k=0;k<8;k++){
    const side=k%2?1:-1,curve=[];
    for(let n=0;n<=32;n++){
      const t=n/32,a=side*(.15+1.7*t),v=.20+.60*t+.025*k;
      curve.push(capPoint(a,Math.min(.98,v),.022+.022*Math.sin(Math.PI*t)));
    }
    strands[k%3].push(curve);
  }
  strandBatch(group,strands[0],0x80634f,.19);
  strandBatch(group,strands[1],0x624837,.23);
  strandBatch(group,strands[2],0x181211,.19);
  return {group,update(){},dispose(){group.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();});parent.remove(group);}};
}

/**
 * Fine native brow hairs and upper lashes, attached to the posed feature curves.
 * Both callbacks sample inner → outer at t=0..1 and return a Vector3 or [x,y,z].
 * Call update() after the main face has assumed its absolute pose.
 */
export function createFeatureHairs({parent,sampleBrow,sampleLid}={}) {
  if(!parent||!sampleBrow||!sampleLid)throw new TypeError('Feature hairs require parent, sampleBrow and sampleLid');
  const group=new THREE.Group();group.name='Attached brow and lash hairs';parent.add(group);
  const rings=5,sides=4,stride=(rings+1)*(sides+1),vec=p=>p.isVector3?p.clone():new THREE.Vector3(...p);
  function family(count,kind,color) {
    const geometry=new THREE.BufferGeometry(),positions=new Float32Array(count*2*stride*3),indices=[];
    for(let h=0;h<count*2;h++)for(let r=0;r<rings;r++)for(let s=0;s<sides;s++){
      const a=h*stride+r*(sides+1)+s,b=a+sides+1;indices.push(a,b,a+1,a+1,b,b+1);
    }
    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setIndex(indices);
    const material=new THREE.MeshStandardMaterial({color,roughness:.68,metalness:0});
    const object=new THREE.Mesh(geometry,material);object.name=kind==='brow'?'Individual eyebrow hairs':'Curled upper eyelashes';
    object.userData.noShadow=true;object.castShadow=object.receiveShadow=false;group.add(object);
    return{geometry,positions,count,kind};
  }
  const brows=family(58,'brow',0x30231e),lashes=family(15,'lash',0x241b18);
  function updateFamily(f) {
    let h=0;
    for(const side of[-1,1]){
      const mid=f.kind==='lash'?vec(sampleLid(side,.5)):null;
      const arcRise=mid?mid.y-(vec(sampleLid(side,.025)).y+vec(sampleLid(side,.975)).y)*.5:0;
      const lidOpen=clamp(arcRise/.075,0,1);
      for(let i=0;i<f.count;i++,h++){
      const t=(i+.5)/f.count,id=i+(side+2)*127;
      const root=vec((f.kind==='brow'?sampleBrow:sampleLid)(side,t));
      let delta,control,radius;
      if(f.kind==='brow'){
        root.y+=(hash(id)-.5)*.012;root.z+=.004;
        delta=new THREE.Vector3(side*(.008+.033*t),.043*(1-t)-.009*t,.012+.005*hash(id+3));
        delta.multiplyScalar(.78+.40*hash(id+1));
        control=root.clone().addScaledVector(delta,.62).add(new THREE.Vector3(0,.007,.004));
        radius=.0017+.0007*hash(id+4);
      }else{
        root.z+=.002;
        const size=.65+.42*Math.sin(Math.PI*t*.78);
        delta=new THREE.Vector3(side*(.008+.034*t),mix(-.035,.028+.012*Math.sin(Math.PI*t),lidOpen),.055+.020*t).multiplyScalar(size);
        control=root.clone().add(new THREE.Vector3(delta.x*.35,delta.y*.30,delta.z*.66));
        radius=.0020+.0004*hash(id+4);
      }
      const tip=root.clone().add(delta),curve=new THREE.QuadraticBezierCurve3(root,control,tip);
      for(let r=0;r<=rings;r++){
        const u=r/rings,p=curve.getPoint(u),tangent=curve.getTangent(u).normalize();
        const n=new THREE.Vector3(1,0,0).addScaledVector(tangent,-tangent.x).normalize();
        const b=new THREE.Vector3().crossVectors(tangent,n).normalize(),rr=radius*Math.max(.025,Math.pow(1-u,.65));
        for(let s=0;s<=sides;s++){
          const angle=s/sides*TAU,q=p.clone().addScaledVector(n,Math.cos(angle)*rr).addScaledVector(b,Math.sin(angle)*rr);
          f.positions.set(q.toArray(),3*(h*stride+r*(sides+1)+s));
        }
      }
    }
    }
    f.geometry.attributes.position.needsUpdate=true;f.geometry.computeVertexNormals();f.geometry.computeBoundingSphere();
  }
  return{group,update(){updateFamily(brows);updateFamily(lashes);},dispose(){group.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});parent.remove(group);}};
}
