import * as THREE from 'three';
import { actionAt, surfaceRegions, interpolateProfile, register, anchor, ellipsoid, curve, material } from './geometry.mjs';
import { createHand } from './hand.mjs';
import { createLeg } from './lower-limb.mjs';

export function createArm({ withHand = true, connected = false } = {}) {
  const group = new THREE.Group(), parts = [];
  const profile = [
    [.02, .02, .02], [.26, .23, 0], [.28, .25, -.02], [.38, .34, -.03],
    [.47, .40, -.06], [.46, .39, -.04], [.34, .33, 0], [.34, .34, 0],
    [.47, .45, .04], [.53, .52, .08], [.57, .56, .06], [.62, .57, 0],
    [.56, .53, -.03], [.45, .43, -.04], [.26, .25, -.04]
  ];
  const height = 6.45, elbowY = 3.05;
  function sample(u, a) {
    const y = u * height, [rx, rz, offset] = interpolateProfile(profile, u);
    const biceps = Math.exp(-(((y - 4.55) / .85) ** 2)) * Math.max(0, Math.sin(a)) ** 2 * .14;
    return [Math.cos(a) * rx, y, Math.sin(a) * (rz + biceps) + offset];
  }
  const names = {
    shoulder: ['Deltoid', 'The deltoid forms the shoulder cap and helps lift the upper arm.'],
    biceps: ['Biceps brachii', 'This anterior upper-arm muscle helps bend the elbow. Its belly becomes more prominent in this flexed pose.'],
    triceps: ['Triceps brachii', 'The triceps lies behind the upper arm and straightens the elbow. Compare its posterior position with the biceps as the forearm bends.'],
    forearm: ['Forearm flexors', 'Forearm muscles transmit force through tendons toward the wrist and fingers. The forearm moves as a unit below the elbow.'],
    elbow: ['Elbow joint', 'The forearm bends around the elbow. The upper arm stays steady during this isolated flexion study.']
  };
  const region = (u, a) => u > .79 ? 'shoulder' : u > .54 ? (Math.sin(a) > .05 ? 'biceps' : 'triceps') : u > .43 ? 'elbow' : 'forearm';
  const surface = surfaceRegions({ sample, region, rings: 96, sides: 64 }); group.add(surface.group);
  const shoulderCap=new THREE.Mesh(new THREE.CircleGeometry(1,64),material());shoulderCap.position.set(0,height,-.04);shoulderCap.rotation.x=-Math.PI/2;shoulderCap.scale.set(.26,.25,1);shoulderCap.userData.partId='shoulder';group.add(shoulderCap);
  if(connected){shoulderCap.visible=false;const deltoid=ellipsoid(group,[0,5.98,-.015],[.54,.65,.51]);deltoid.userData.partId='shoulder';}
  const points = { shoulder: [0, 5.9, .53], biceps: [0, 4.55, .72], triceps: [.18, 4.6, -.47], elbow: [.33, 3.05, .02], forearm: [.12, 1.9, .38] };
  for (const [id, mesh] of Object.entries(surface.meshes)) register(parts, id, ...names[id], mesh, points[id]);
  const forearmPivot = new THREE.Group(); forearmPivot.position.y = elbowY; group.add(forearmPivot);
  let hand;
  if (withHand) {
    hand = createHand();
    const attach = new THREE.Group(); forearmPivot.add(attach);
    attach.position.set(0, -elbowY + .44, 0); attach.rotation.z = Math.PI; attach.scale.setScalar(.36);
    attach.add(hand.group);
    // The hand module supplies its wrist origin so the seam stays attached during flexion.
    if (hand.wristAnchor) hand.group.position.sub(hand.wristAnchor.position);
    else hand.group.position.y = .75;
    hand.group.traverse(m => { if (m.isMesh) m.userData.partId = 'grip'; });
    parts.push({ id: 'grip', name: 'Hand & wrist', description: 'The hand travels with the forearm. Finger joints close the grasp while the wrist remains attached.', object: hand.group, anchor: anchor(hand.group, [0, 1, .3]) });
  }
  const V = new THREE.Vector3();
  function deform(x, y, z, angle, load) {
    const bulge = Math.exp(-(((y - 4.6) / .9) ** 2)) * load;
    x *= 1 + .035 * bulge; z += Math.max(0, z) * .10 * bulge;
    const weight = 1 - THREE.MathUtils.smoothstep(y, 2.85, 3.4);
    const dy = y - elbowY, ca = Math.cos(-angle), sa = Math.sin(-angle);
    return V.set(x, THREE.MathUtils.lerp(y, elbowY + dy * ca - z * sa, weight), THREE.MathUtils.lerp(z, dy * sa + z * ca, weight));
  }
  function update(t) {
    const load = actionAt(t), angle = THREE.MathUtils.degToRad(12 + load * 88);
    for (const mesh of Object.values(surface.meshes)) {
      const rest = mesh.userData.restPositions, attr = mesh.geometry.attributes.position;
      const normals = mesh.geometry.attributes.normal, rn = mesh.userData.restNormals;
      for (let i = 0; i < attr.count; i++) {
        const p = deform(rest[i * 3], rest[i * 3 + 1], rest[i * 3 + 2], angle, load); attr.setXYZ(i, p.x, p.y, p.z);
        const w = 1 - THREE.MathUtils.smoothstep(rest[i * 3 + 1], 2.85, 3.4), a = -angle * w, c = Math.cos(a), s = Math.sin(a);
        normals.setXYZ(i, rn[i * 3], rn[i * 3 + 1] * c - rn[i * 3 + 2] * s, rn[i * 3 + 1] * s + rn[i * 3 + 2] * c);
      }
      attr.needsUpdate = normals.needsUpdate = true; mesh.geometry.computeBoundingSphere();
    }
    for (const p of parts) if (points[p.id]) p.anchor.position.copy(deform(...points[p.id], angle, load));
    forearmPivot.rotation.x = -angle;
    hand?.update(t);
  }
  update(0);
  return { group, parts, update, title: 'The shape of a bend.', subtitle: 'Elbow flexion',
    camera: { position: [8, 4.5, 12], target: [0, 3.2, .9] },
    beats: [{ time: 0, label: 'Prepare', description: 'Find the shoulder, elbow and wrist.' }, { time: 1.5, label: 'Flex', description: 'The forearm turns around the elbow; the upper arm stays steady.' }, { time: 2.5, label: 'Hold', description: 'Observe the fuller anterior biceps contour.' }, { time: 3.5, label: 'Release', description: 'The forearm lowers and the muscle contour returns.' }],
    metrics: t => [{ label: 'Elbow flexion', value: `${Math.round(12 + actionAt(t) * 88)}°` }, { label: 'Action', value: actionAt(t) > .8 ? 'Hold' : actionAt(t) > .05 ? 'Moving' : 'Rest' }] };
}

export function createBody() {
  const group = new THREE.Group(), parts = [];
  const pelvis = new THREE.Group(); group.add(pelvis);
  const trunk = new THREE.Group(); trunk.position.y = 4.25; pelvis.add(trunk);
  const profile = [[.62,.43,0],[.94,.54,0],[.88,.51,0],[.72,.43,0],[.67,.41,0],[.76,.45,0],[.98,.58,.04],[1.16,.61,.02],[1.17,.52,0],[.68,.36,0],[.31,.29,0],[.28,.26,0]];
  function torsoSample(u, a) {
    const y = u * 3.55, [rx,rz,off] = interpolateProfile(profile,u);
    let x = Math.cos(a) * rx, z = Math.sin(a) * rz + off;
    // Subtle paired chest and abdominal planes; never decorative wireframe triangles.
    const front = Math.max(0,Math.sin(a));
    z += .11 * Math.exp(-(((y-2.55)/.37)**2)) * front * Math.sin(a*2)**2;
    z += .012 * Math.exp(-(((y-1.55)/.7)**2)) * front * Math.cos((y-1.1)*13);
    return [x,y,z];
  }
  const surf = surfaceRegions({ rings: 88, sides: 80, sample:torsoSample, region(u,a) { if(u<.24)return 'pelvis'; if(u>.89)return 'neck'; if(Math.sin(a)<.05)return 'back'; if(u>.56)return 'chest'; return Math.abs(Math.cos(a))>.65?'obliques':'abdomen'; } });
  trunk.add(surf.group);
  function onTorso(x,y){const [rx]=interpolateProfile(profile,y/3.55);const a=Math.acos(THREE.MathUtils.clamp(x/rx,-.99,.99));const p=torsoSample(y/3.55,a);p[2]+=.009;return p;}
  for(const side of [-1,1])curve(trunk,[[side*.12,2.27],[side*.42,2.22],[side*.73,2.3],[side*.96,2.5]].map(([x,y])=>onTorso(x,y)),0x4d6360,.009);
  curve(trunk,[[0,2.77],[0,2.45],[0,2.14]].map(([x,y])=>onTorso(x,y)),0x4b605c,.008);
  for(const side of [-1,1])curve(trunk,[[side*.38,1.72],[side*.35,1.28],[side*.22,.92]].map(([x,y])=>onTorso(x,y)),0x596c66,.006);
  const info = {
    pelvis:['Pelvis','The pelvis connects the trunk to the legs and provides the base for this reaching pose.',[.65,.4,.37]],
    neck:['Neck','The neck supports the head while the shoulder and arm change position.',[.15,3.38,.25]],
    back:['Back','Posterior trunk muscles help maintain posture as the arms move.',[-.3,2.35,-.59]],
    chest:['Pectoralis region','The chest connects the upper arm visually to the ribcage. Watch the shoulder and chest relationship during the reach.',[.6,2.55,.62]],
    abdomen:['Abdominal wall','The abdominal wall supports the trunk. A small counter-turn keeps the gesture connected through the body.',[.2,1.45,.46]],
    obliques:['External oblique region','The side of the torso links ribcage and pelvis, revealing the direction of trunk rotation.',[.7,1.6,.24]]
  };
  for(const [id,mesh] of Object.entries(surf.meshes)) register(parts,id,...info[id].slice(0,2),mesh,info[id][2]);
  // A sculptural head with continuous cranial, jaw and chin profiles.
  const headGroup=new THREE.Group();headGroup.position.set(0,3.44,0);trunk.add(headGroup);
  const headProfile=[[.16,.23,.12],[.30,.32,.12],[.42,.39,.08],[.48,.46,.04],[.51,.48,0],[.49,.44,-.03],[.37,.34,-.04],[.02,.02,-.04]];
  const headSurf=surfaceRegions({rings:56,sides:64,sample(u,a){const [rx,rz,off]=interpolateProfile(headProfile,u);return [Math.cos(a)*rx,u*1.28,Math.sin(a)*rz+off];},region:()=> 'head'});headGroup.add(headSurf.group);
  const nose=ellipsoid(headGroup,[0,.59,.475],[.075,.17,.12]);
  for(const s of [-1,1]) {
    ellipsoid(headGroup,[s*.48,.6,-.015],[.09,.18,.095]);
    curve(headGroup,[[s*.075,.79,.46],[s*.21,.82,.438],[s*.34,.78,.355]],0x425151,.012);
    curve(headGroup,[[s*.09,.7,.47],[s*.19,.67,.463],[s*.29,.7,.413]],0x435555,.009);
  }
  curve(headGroup,[[-.15,.35,.43],[0,.33,.465],[.15,.35,.43]],0x455757,.011);
  register(parts,'head','Head & gaze','The head turns slightly toward the reaching hand; gaze gives the movement a direction.',headGroup,[.35,.78,.4]);
  const shoulders=[];
  for(const side of [-1,1]) {
    const arm=createArm({connected:true}); const pivot=new THREE.Group();pivot.position.set(side*1.11,2.6,0);trunk.add(pivot);
    const unit=new THREE.Group();unit.scale.set(side*.48,.48,.48);pivot.add(unit);arm.group.position.y=-5.95;unit.add(arm.group);
    arm.group.traverse(m=>{if(m.isMesh)m.userData.partId=side===1?'reach-arm':'support-arm';});
    const id=side===1?'reach-arm':'support-arm';
    parts.push({id,name:side===1?'Reaching arm':'Balancing arm',description:side===1?'The shoulder lifts the upper arm while the elbow bends. The hand leads a connected reaching gesture.':'The opposite arm gives the reaching pose balance and a clear silhouette.',object:arm.group,anchor:anchor(pivot,[side*.12,-1.0,.2])});
    shoulders.push({side,arm,pivot});
  }
  for(const side of [-1,1]) {
    const leg=createLeg();leg.group.scale.set(side*.55,.55,.55);leg.group.position.set(side*.47,0,.33);group.add(leg.group);leg.update(0);
    leg.group.traverse(m=>{if(m.isMesh)m.userData.partId='support-legs';});
    if(side===1)parts.push({id:'support-legs',name:'Supporting legs',description:'The feet stay grounded while the upper body reaches. Support makes the gesture readable.',object:leg.group,anchor:anchor(leg.group,[.2,4.8,.6])});
  }
  function update(t) {
    const u=actionAt(t);
    trunk.rotation.y=-.09*u;trunk.rotation.z=.025*u;headGroup.rotation.y=.15*u;
    for(const {side,arm,pivot} of shoulders) {
      arm.update(side===1?t:0);
      pivot.rotation.z=side*(.12+(side===1?.89:.22)*u);
      pivot.rotation.x=side===1?-.17*u:0;
    }
  }
  update(0);
  return {group,parts,update,title:'A gesture is a whole-body event.',subtitle:'Reach & return',
    camera:{position:[12,8.6,20],target:[0,4.65,0]},
    beats:[{time:0,label:'Ground',description:'The feet establish support before the arm moves.'},{time:1.5,label:'Reach',description:'The shoulder lifts, the elbow bends, and the trunk gently counter-turns.'},{time:2.5,label:'Hold',description:'Follow the connected line from the planted foot to the reaching hand.'},{time:3.5,label:'Return',description:'The shoulder and arm settle back into the same resting pose.'}],
    metrics:t=>[{label:'Shoulder lift',value:`${Math.round((.12+.89*actionAt(t))*180/Math.PI)}°`},{label:'Support',value:'Feet planted'}]};
}
