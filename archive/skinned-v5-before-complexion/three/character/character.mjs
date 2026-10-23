import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';
import { tuneCharacterMaterials, createBodysuitMaterial, cloneCharacterMaterial } from './materials.mjs';
import { subdivideHairGeometry } from './subdivide-hair.mjs';
import { refineFacialContour } from './facial-contour.mjs';
import { refineDentition } from './dentition.mjs';

// One fixed adult identity is shared by the anatomy and facial-acting editions.
// The base, rig, texture maps and expression targets are licensed CC0; see assets/README.md.
export const IDENTITY = Object.freeze({gender_female:1,height_tall:.12,proportions_ideal:.18,muscle_min:.12,face_jaw_width_decr:.50,face_chin_decr:.26,face_nose_width_decr:.18,face_nose_length_decr:.20,face_nose_height_decr:.08,face_lips_incr:.36,face_eye_size_incr:.13,face_eye_tilt_incr:.06,face_mouth_width_decr:.04,face_ear_size_decr:.12,face_forehead_decr:.10,face_cheekbones_incr:.10});
let template, loading;
const asset = name => new URL(`./assets/${name}`,import.meta.url).href;
function bakeIdentity(scene) {
  scene.traverse(mesh=>{
    if(!mesh.isMesh||!mesh.morphTargetDictionary)return;
    const geometry=mesh.geometry.clone(),dict=mesh.morphTargetDictionary, names=Object.keys(dict).sort((a,b)=>dict[a]-dict[b]);
    const weights={...IDENTITY};
    for(const name of names)if(name.startsWith('corr_')){const[a,b]=name.slice(5).split('__');weights[name]=(weights[a]||0)*(weights[b]||0);}
    for(const kind of ['position','normal']){
      const base=geometry.attributes[kind],targets=geometry.morphAttributes[kind];if(!base||!targets)continue;
      const values=new Float32Array(base.count*3);
      for(let i=0;i<base.count;i++){
        let x=base.getX(i),y=base.getY(i),z=base.getZ(i);
        for(const [name,weight]of Object.entries(weights))if(weight&&targets[dict[name]]){const d=targets[dict[name]];x+=weight*d.getX(i);y+=weight*d.getY(i);z+=weight*d.getZ(i);}
        if(kind==='normal'){const n=Math.hypot(x,y,z)||1;x/=n;y/=n;z/=n;}values.set([x,y,z],i*3);
      }
      geometry.setAttribute(kind,new THREE.BufferAttribute(values,3));
    }
    const keep=names.filter(n=>n.startsWith('exp_')||n.startsWith('blink_')||n.startsWith('look_'));
    for(const kind of Object.keys(geometry.morphAttributes))geometry.morphAttributes[kind]=keep.map(n=>geometry.morphAttributes[kind][dict[n]]);
    geometry.computeBoundingBox();geometry.computeBoundingSphere();mesh.geometry=geometry;
    mesh.updateMorphTargets();mesh.morphTargetDictionary=Object.fromEntries(keep.map((n,i)=>[n,i]));mesh.morphTargetInfluences=keep.map(()=>0);
    mesh.userData.targetNames=keep;mesh.frustumCulled=false;
  });
}
function fitSkeleton(scene, sidecar) {
  scene.updateMatrixWorld(true);const desired=new Map(),bones=[];
  scene.traverse(b=>{if(b.isBone){bones.push(b);const p=b.getWorldPosition(new THREE.Vector3());for(const[n,w]of Object.entries(IDENTITY)){const d=sidecar.morphs[n]?.[b.name];if(d)p.addScaledVector(new THREE.Vector3(...d),w);}desired.set(b,p);}});
  // Traversal is parent-first: preserve the rig's orientations, move pivots to this identity.
  for(const b of bones){b.parent.updateMatrixWorld(true);b.position.copy(b.parent.worldToLocal(desired.get(b).clone()));b.updateMatrixWorld(true);}
  const skeletons=new Set();scene.traverse(m=>{if(m.isSkinnedMesh)skeletons.add(m.skeleton);});
  scene.updateMatrixWorld(true);for(const s of skeletons)s.calculateInverses();
}
function softenCoveredSurface(body) {
  // A fitted opaque garment should bridge small surface details. Relax only
  // the covered breast-apex patch; the face and exposed anatomy are untouched.
  const g=body.geometry,p=g.attributes.position,index=g.index;
  const adjacent=Array.from({length:p.count},()=>new Set()),amount=new Float32Array(p.count);
  for(let i=0;i<index.count;i+=3){const a=index.getX(i),b=index.getX(i+1),c=index.getX(i+2);adjacent[a].add(b).add(c);adjacent[b].add(a).add(c);adjacent[c].add(a).add(b);}
  for(let i=0;i<p.count;i++)if(p.getZ(i)>.115)amount[i]=.65*Math.exp(-(((Math.abs(p.getX(i))-.101)/.032)**2+((p.getY(i)-1.229)/.030)**2));
  for(let pass=0;pass<9;pass++){const next=p.array.slice();for(let i=0;i<p.count;i++)if(amount[i]>.002){let z=0;for(const j of adjacent[i])z+=p.getZ(j);if(adjacent[i].size)next[i*3+2]=THREE.MathUtils.lerp(p.getZ(i),z/adjacent[i].size,amount[i]);}p.array.set(next);}
  const oldNormals=g.attributes.normal.clone();g.computeVertexNormals();
  // Keep the authored normals elsewhere, especially across facial UV seams.
  const n=g.attributes.normal;for(let i=0;i<p.count;i++)if(amount[i]<.002)n.setXYZ(i,oldNormals.getX(i),oldNormals.getY(i),oldNormals.getZ(i));
}
function makeSuit(body,bones) {
  const p=body.geometry.attributes.position,ind=body.geometry.index,skin=body.geometry.attributes.skinIndex,weights=body.geometry.attributes.skinWeight;
  const pelvis=bones.get('pelvis').getWorldPosition(new THREE.Vector3()).y,clavicle=bones.get('clavicle_l').getWorldPosition(new THREE.Vector3()).y;
  const torso=new Set(['pelvis','spine_01','spine_02','spine_03','clavicle_l','clavicle_r']),indices=[];
  for(let i=0;i<ind.count;i+=3){let x=0,y=0,z=0,torsoWeight=0;for(let k=0;k<3;k++){const v=ind.getX(i+k);x+=p.getX(v)/3;y+=p.getY(v)/3;z+=p.getZ(v)/3;for(let j=0;j<4;j++)if(torso.has(body.skeleton.bones[skin.getComponent(v,j)]?.name))torsoWeight+=weights.getComponent(v,j)/3;}
    const front=z>0,neckline=clavicle-(front?.075:.015)+.065*Math.min(1,(Math.abs(x)/.14)**2),legline=pelvis-.20+.43*Math.abs(x);
    // Keep generous support outside the openings: the fragment mask, not a
    // triangle-centroid test, defines every visible garment boundary.
    if(y>pelvis-.31&&y<clavicle+.16&&Math.abs(x)<.42)indices.push(ind.getX(i),ind.getX(i+1),ind.getX(i+2));
  }
  const geometry=body.geometry.clone();geometry.setIndex(indices);const pos=geometry.attributes.position,n=geometry.attributes.normal;
  for(let i=0;i<pos.count;i++)pos.setXYZ(i,pos.getX(i)+n.getX(i)*.0012,pos.getY(i)+n.getY(i)*.0012,pos.getZ(i)+n.getZ(i)*.0012);
  // Curved cloth openings are clipped in interpolated rest coordinates rather
  // than stair-stepping along whichever coarse triangles cross a cutoff.
  geometry.setAttribute('suitRest',body.geometry.attributes.position);
  const material=createBodysuitMaterial();material.alphaToCoverage=true;material.alphaTest=.5;
  material.onBeforeCompile=shader=>{
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 suitRest; varying vec3 vSuitRest;').replace('#include <begin_vertex>','#include <begin_vertex>\nvSuitRest=suitRest;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vSuitRest;').replace('#include <alphatest_fragment>',`
      float sx=abs(vSuitRest.x);
      float front=smoothstep(-0.015,0.035,vSuitRest.z);
      float scoop=${clavicle.toFixed(6)}-mix(0.01,0.065,front)+0.12*min(1.0,pow(sx/0.16,2.0));
      float leg=${pelvis.toFixed(6)}-0.20+0.43*sx;
      float sleeve=mix(0.31,0.19,smoothstep(${(pelvis+.08).toFixed(6)},${(pelvis+.20).toFixed(6)},vSuitRest.y))+0.035*smoothstep(${(clavicle-.10).toFixed(6)},${(clavicle+.07).toFixed(6)},vSuitRest.y);
      float edge=min(scoop-vSuitRest.y,vSuitRest.y-leg);
      edge=min(edge,sleeve-sx);
      diffuseColor.a*=smoothstep(-0.0005,0.0005,edge);
      #include <alphatest_fragment>
    `);
  };
  material.customProgramCacheKey=()=> 'anatomical-suit-curved-boundaries-v2';
  geometry.computeBoundingBox();geometry.computeBoundingSphere();
  const suit=new THREE.SkinnedMesh(geometry,material);suit.name='Anatomical bodysuit';suit.bind(body.skeleton,body.bindMatrix);suit.morphTargetDictionary={...body.morphTargetDictionary};suit.morphTargetInfluences=body.morphTargetInfluences;suit.frustumCulled=false;suit.userData.isWardrobe=true;suit.userData.noCastShadow=true;body.parent.add(suit);
}
export async function loadCharacter(){
  if(template)return template;if(loading)return loading;
  loading=(async()=>{
    const loader=new GLTFLoader();
    const[bodyGLTF,hairGLTF,sidecar]=await Promise.all([loader.loadAsync(asset('adult-female-source.glb')),loader.loadAsync(asset('hair-long.glb')),fetch(asset('body-joints.json')).then(r=>{if(!r.ok)throw Error('Character joint data unavailable');return r.json();})]);
    const scene=bodyGLTF.scene;bakeIdentity(scene);refineFacialContour(scene);refineDentition(scene);bakeIdentity(hairGLTF.scene);
    hairGLTF.scene.traverse(m=>{if(m.isMesh)m.geometry=subdivideHairGeometry(m.geometry,{iterations:2,strength:.65,preserveBoundaries:false});});
    fitSkeleton(scene,sidecar);
    const body=scene.getObjectByName('Body');if(!body?.isSkinnedMesh)throw Error('Licensed character has no body skin');
    const bones=new Map(body.skeleton.bones.map(b=>[b.name,b]));
    const hairMeshes=[];hairGLTF.scene.traverse(m=>{if(m.isMesh)hairMeshes.push(m);});
    for(const m of hairMeshes){if(m.isSkinnedMesh){const idx=m.geometry.attributes.skinIndex,remap=m.skeleton.bones.map(b=>body.skeleton.bones.findIndex(o=>o.name===b.name));for(let i=0;i<idx.count;i++)for(let k=0;k<4;k++)idx.setComponent(i,k,Math.max(0,remap[idx.getComponent(i,k)]));m.skeleton=body.skeleton;m.bind(body.skeleton,body.bindMatrix);m.position.set(0,0,0);m.quaternion.identity();m.scale.set(1,1,1);}m.userData.isHair=true;body.parent.add(m);}
    softenCoveredSurface(body);tuneCharacterMaterials(scene);makeSuit(body,bones);scene.updateMatrixWorld(true);
    template=scene;return scene;
  })();return loading;
}
export function createCharacter(){
  if(!template)throw Error('Call and await loadCharacter() before creating a character');
  const root=cloneSkeleton(template),group=new THREE.Group();group.name='Aurelia · shared adult character';group.add(root);
  const meshes=[],bones=new Map();root.traverse(o=>{if(o.isBone)bones.set(o.name,o);if(o.isMesh){meshes.push(o);o.material=Array.isArray(o.material)?o.material.map(cloneCharacterMaterial):cloneCharacterMaterial(o.material);o.receiveShadow=!o.userData.noShadow&&!o.userData.surfaceOverlay;o.castShadow=o.receiveShadow&&!o.userData.noCastShadow;o.frustumCulled=false;}});
  const body=root.getObjectByName('Body'),suit=root.getObjectByName('Anatomical bodysuit');if(suit)suit.morphTargetInfluences=body.morphTargetInfluences;
  const hair=meshes.filter(m=>m.userData.isHair).map(mesh=>({mesh,castShadow:mesh.castShadow,materials:(Array.isArray(mesh.material)?mesh.material:[mesh.material]).map(material=>({material,opacity:material.opacity,transparent:material.transparent,depthWrite:material.depthWrite,alphaTest:material.alphaTest}))}));
  let inspectingBack=false;
  function setInspectionRegion(id){
    const reveal=id==='back';if(reveal===inspectingBack)return;inspectingBack=reveal;
    // Long hair normally occludes the upper back. Only during this explicit
    // anatomical selection, fade it to reveal the real surface beneath it.
    for(const h of hair){h.mesh.castShadow=reveal?false:h.castShadow;for(const state of h.materials){const m=state.material;m.opacity=reveal?.12:state.opacity;m.transparent=reveal||state.transparent;m.depthWrite=reveal?false:state.depthWrite;m.alphaTest=reveal?.02:state.alphaTest;m.needsUpdate=true;}}
  }
  const restBones=new Map([...bones].map(([n,b])=>[n,{position:b.position.clone(),quaternion:b.quaternion.clone(),scale:b.scale.clone()}]));
  function resetPose(){for(const[n,b]of bones){const r=restBones.get(n);b.position.copy(r.position);b.quaternion.copy(r.quaternion);b.scale.copy(r.scale);}for(const m of meshes)m.morphTargetInfluences?.fill(0);group.position.set(0,0,0);group.quaternion.identity();}
  function setMorph(name,value){for(const m of meshes){const i=m.morphTargetDictionary?.[name];if(i!==undefined)m.morphTargetInfluences[i]=value;}}
  function updateWorld(){group.updateMatrixWorld(true);const seen=new Set();for(const m of meshes)if(m.isSkinnedMesh&&!seen.has(m.skeleton)){m.skeleton.update();seen.add(m.skeleton);}}
  updateWorld();const height=new THREE.Box3().setFromObject(group).getSize(new THREE.Vector3()).y;
  return{group,root,body,suit,meshes,bones,restBones,resetPose,setMorph,updateWorld,setInspectionRegion,height};
}
