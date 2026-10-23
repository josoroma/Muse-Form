import * as THREE from 'three';
import { createCharacter } from './character.mjs';
import { createSurfaceRegions, createPosedSurfacePicker } from './regions.mjs';
import { actionAt } from '../geometry.mjs';

const clamp = THREE.MathUtils.clamp;
const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0), Z = new THREE.Vector3(0, 0, 1);
const STUDIES = {
  body: { title: 'A gesture is a whole-body event.', subtitle: 'Reach & return', action: 'Reach', description: 'The shoulder lifts the arm; the elbow and fingers follow while both feet remain planted.', direction: [.38, .08, 1] },
  arm: { title: 'The shape of a bend.', subtitle: 'Elbow flexion', action: 'Flex', description: 'The forearm bends at the elbow. The wrist and hand travel with the continuous skin surface.', direction: [.30, .12, 1] },
  hand: { title: 'The hand, in motion.', subtitle: 'Opposition · flexion · release', action: 'Close', description: 'The fingers curl in sequence through their knuckles and phalanges; the thumb turns toward the palm.', direction: [-.15, .08, 1] },
  leg: { title: 'The architecture of support.', subtitle: 'Load & recover', action: 'Load', description: 'The hips, knees and ankles share a shallow supported bend, then recover together.', direction: [.52, .10, 1] },
  foot: { title: 'From heel to forefoot.', subtitle: 'Rise & settle', action: 'Rise', description: 'The heels rise while the forefoot remains the support. The toes recover with the same connected foot surface.', direction: [.70, .35, 1] },
};

const DESCRIPTIONS = {
    chest: ['Pectoralis region', 'The pectoral region spans the upper chest beneath the bodysuit. Follow its continuous connection toward the shoulder as the arm reaches.'],
    back: ['Back', 'The posterior trunk supports posture during the reach. This surface overlay follows the back as the torso turns. Selecting Back fades the hair so its surface stays visible; clearing the selection restores the hair.'],
    pelvis: ['Pelvis', 'The pelvis joins trunk and lower limbs. The highlighted surface indicates the pelvic region beneath the bodysuit.'],
    abdomen: ['Abdominal wall', 'The abdominal surface links the ribcage to the pelvis and moves with the trunk.'],
    head: ['Head & gaze', 'The same adult character appears in FORM and MUSE. The head turns gently toward the reaching hand.'],
    shoulder: ['Deltoid region', 'The shoulder contour blends continuously into the upper arm. The skin follows the imported shoulder rig.'],
    biceps: ['Biceps region', 'The anterior upper-arm surface follows elbow flexion. The overlay indicates the underlying region, rather than an exposed muscle.'],
    triceps: ['Triceps region', 'The posterior upper-arm region travels with the same continuous shoulder and arm surface.'],
    forearm: ['Forearm', 'The forearm carries the wrist and hand through the bend. Skin weights blend across the elbow and wrist.'],
    grip: ['Hand & wrist', 'The hand travels with the forearm. Its continuous wrist attachment remains intact while the fingers begin to close.'],
    thenar: ['Thenar region', 'The base of the thumb remains integrated with the palm as opposition brings the thumb toward the fingers.'],
    palm: ['Palm', 'The continuous palm supports the finger bases and the thumb. Its skin remains connected as the hand closes.'],
    thumb: ['Thumb opposition', 'The thumb turns at its base and bends through its own joint chain, preserving its distinct direction across the palm.'],
    index: ['Index finger', 'Three articulated phalanges bend from the knuckle, with the finger remaining connected to the palm.'],
    middle: ['Middle finger', 'The middle finger keeps the longest central proportion while its joints participate in the closing wave.'],
    ring: ['Ring finger', 'The ring finger closes with the neighboring fingers through its own connected joint chain.'],
    pinky: ['Little finger', 'The shorter little finger emerges naturally from the ulnar palm and curls through its three joints.'],
    'leg-quadriceps': ['Quadriceps region', 'The front of the thigh spans the hip-to-knee relationship during this shallow supported bend.'],
    'leg-hamstrings': ['Hamstring region', 'The posterior thigh stays connected through hip and knee as the body lowers and recovers.'],
    'leg-knee': ['Knee region', 'The knee bends while the thigh and calf remain joined by the continuous skinned mesh.'],
    'leg-calf': ['Calf region', 'The calf connects knee and ankle; its contour follows the supporting leg through the movement.'],
    'foot-ankle': ['Ankle region', 'The ankle transmits the rise from the supporting forefoot into the leg.'],
    'foot-instep': ['Dorsum of foot', 'The upper surface of the foot follows the heel rise. Every toe is part of the same connected skin mesh.'],
    'foot-toes': ['Forefoot & toes', 'The forefoot supports the heel rise while the toes remain attached to the foot.'],
    'foot-heel': ['Heel', 'The heel lifts from the floor and settles back into the same resting position.'],
  };

const PART_ORDER = {
  body: ['chest', 'back', 'pelvis', 'abdomen', 'shoulder', 'head'],
  arm: ['biceps', 'shoulder', 'forearm', 'triceps', 'grip'],
  hand: ['thenar', 'index', 'thumb', 'palm', 'middle', 'ring', 'pinky'],
  leg: ['leg-quadriceps', 'leg-knee', 'leg-calf', 'leg-hamstrings'],
  foot: ['foot-instep', 'foot-ankle', 'foot-toes', 'foot-heel'],
};

export function getAnatomyMetadata(study = 'body') {
  const spec = STUDIES[study];
  if (!spec) throw new RangeError(`Unknown anatomy study: ${study}`);
  return {
    title: spec.title, subtitle: spec.subtitle,
    parts: PART_ORDER[study].map(id => ({ id, name: DESCRIPTIONS[id][0], description: DESCRIPTIONS[id][1] })),
    beats: [
      { time: 0, label: 'Prepare', description: 'The connected character establishes the resting pose before the movement begins.' },
      { time: 1.5, label: spec.action, description: spec.description },
      { time: 2.5, label: 'Hold', description: 'Inspect the silhouette and the selected surface from the front, side or an orbiting view.' },
      { time: 3.5, label: 'Release', description: 'The joint chain reverses smoothly and returns to the same pose at five seconds.' },
    ],
  };
}

/** Five anatomical studies of one shared, licensed, skinned character. */
export function createAnatomyStudy(study = 'body') {
  if (!STUDIES[study]) throw new RangeError(`Unknown anatomy study: ${study}`);
  const spec = STUDIES[study], character = createCharacter();
  const { group, body, bones } = character;
  const q = new THREE.Quaternion(), parentQ = new THREE.Quaternion(), axis = new THREE.Vector3(), v = new THREE.Vector3();
  const regionByFace = new Map(), regionFaces = new Map(), geometry = body.geometry;
  const skinIndex = geometry.attributes.skinIndex, skinWeight = geometry.attributes.skinWeight;
  const sourceIndex = n => geometry.index ? geometry.index.getX(n) : n;
  const count = Math.floor((geometry.index?.count ?? geometry.attributes.position.count) / 3);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), center = new THREE.Vector3();
  character.updateWorld();
  const thumbBaseRest = bones.get('thumb_01_l').getWorldPosition(new THREE.Vector3());
  const shoulderRest = bones.get('upperarm_l').getWorldPosition(new THREE.Vector3());
  const elbowRest = bones.get('lowerarm_l').getWorldPosition(new THREE.Vector3());
  const wristRest = bones.get('hand_l').getWorldPosition(new THREE.Vector3());
  const upperAxis = elbowRest.clone().sub(shoulderRest), upperLengthSquared = upperAxis.lengthSq();

  function bone(name) { return bones.get(name); }
  function rotateWorld(name, direction, angle) {
    const joint = bone(name); if (!joint || angle === 0) return;
    joint.parent.updateWorldMatrix(true, false);
    joint.parent.getWorldQuaternion(parentQ).invert();
    axis.copy(direction).applyQuaternion(parentQ).normalize();
    q.setFromAxisAngle(axis, angle); joint.quaternion.premultiply(q);
    joint.updateWorldMatrix(false, true);
  }
  function rotateLocal(name, direction, angle) { const joint = bone(name); if (joint && angle) joint.quaternion.multiply(q.setFromAxisAngle(direction, angle)); }
  function translateWorld(name, delta) {
    const joint = bone(name); if (!joint) return;
    joint.parent.updateWorldMatrix(true, false); joint.parent.getWorldQuaternion(parentQ).invert();
    joint.position.add(v.copy(delta).applyQuaternion(parentQ)); joint.updateWorldMatrix(false, true);
  }
  function aimBone(name, childName, desiredDirection) {
    const joint = bone(name), child = bone(childName); joint.updateWorldMatrix(true, true);
    const from = child.getWorldPosition(new THREE.Vector3()).sub(joint.getWorldPosition(new THREE.Vector3())).normalize();
    const rotation = new THREE.Quaternion().setFromUnitVectors(from, desiredDirection.clone().normalize());
    joint.getWorldQuaternion(q).premultiply(rotation);
    joint.parent.getWorldQuaternion(parentQ).invert(); joint.quaternion.copy(parentQ.multiply(q));
    joint.updateWorldMatrix(false, true);
  }
  function presentPalm() {
    aimBone('lowerarm_l', 'hand_l', new THREE.Vector3(.55, 1, .18));
    const wrist = bone('hand_l').getWorldPosition(new THREE.Vector3());
    const index = bone('index_01_l').getWorldPosition(new THREE.Vector3());
    const pinky = bone('pinky_01_l').getWorldPosition(new THREE.Vector3());
    const middle = bone('middle_01_l').getWorldPosition(new THREE.Vector3());
    const direction = wrist.clone().sub(bone('lowerarm_l').getWorldPosition(new THREE.Vector3())).normalize();
    const normal = new THREE.Vector3().crossVectors(pinky.sub(index), middle.sub(wrist)).normalize();
    const desired = Z.clone().addScaledVector(direction, -Z.dot(direction)).normalize();
    normal.addScaledVector(direction, -normal.dot(direction)).normalize();
    const angle = Math.atan2(direction.dot(new THREE.Vector3().crossVectors(normal, desired)), normal.dot(desired));
    rotateWorld('lowerarm_l', direction, angle);
  }
  function fingerPose(side, amount) {
    ['index', 'middle', 'ring', 'pinky'].forEach((finger, i) => {
      // The ulnar fingers initiate the closing wave; each phalanx remains part
      // of the imported skin rather than a detached primitive.
      const u = clamp(amount * 1.16 - (3 - i) * .045, 0, 1);
      for (const [joint, angle] of [[1, .70], [2, .86], [3, .48]]) rotateLocal(`${finger}_0${joint}_${side}`, X, u * angle);
    });
    rotateLocal(`thumb_01_${side}`, Z, (side === 'l' ? -.24 : .24) * amount);
    rotateLocal(`thumb_02_${side}`, X, .32 * amount);
    rotateLocal(`thumb_03_${side}`, X, .28 * amount);
  }

  // Identify actual body triangles from their authored skin weights and rest
  // surface positions. The pectoral overlay is one broad upper-chest region;
  // there are no decorative circles or disconnected anatomical patches.
  function dominant(indices) {
    const sums = new Map();
    for (const vertex of indices) for (let k = 0; k < 4; k++) {
      const index = skinIndex.getComponent(vertex, k), weight = skinWeight.getComponent(vertex, k);
      sums.set(index, (sums.get(index) || 0) + weight);
    }
    let best = -1, winner = 0; for (const [id, weight] of sums) if (weight > best) { best = weight; winner = id; }
    return body.skeleton.bones[winner]?.name || '';
  }

  function classify(name, p) {
    if (study === 'body') {
      if (/head|neck/.test(name)) return 'head';
      if (/upperarm|clavicle/.test(name)) return 'shoulder';
      if (/spine/.test(name)) return p.z < .015 ? 'back' : p.y > 1.17 ? 'chest' : 'abdomen';
      if (name === 'pelvis') return 'pelvis';
      return null;
    }
    if (study === 'arm') {
      if (name === 'upperarm_l') return v.subVectors(p, shoulderRest).dot(upperAxis) / upperLengthSquared < .25 ? 'shoulder' : p.z > .08 ? 'biceps' : 'triceps';
      if (name === 'clavicle_l' && p.x > shoulderRest.x) return 'shoulder';
      if (name === 'lowerarm_l') return 'forearm';
      if (name === 'hand_l') return 'grip';
      return null;
    }
    if (study === 'hand') {
      if (name === 'hand_l') return p.distanceTo(thumbBaseRest) < .052 ? 'thenar' : 'palm';
      const match = /^(thumb|index|middle|ring|pinky)_\d\d_l$/.exec(name);
      return match ? match[1] : null;
    }
    if (study === 'leg') {
      if (name === 'thigh_l') return p.y < .54 ? 'leg-knee' : p.z > .05 ? 'leg-quadriceps' : 'leg-hamstrings';
      if (name === 'calf_l') return p.y > .49 ? 'leg-knee' : 'leg-calf';
      return null;
    }
    if (study === 'foot') {
      if (name === 'calf_l' && p.y < .15) return 'foot-ankle';
      if (name === 'foot_l') return p.y > .135 ? 'foot-ankle' : p.z < .025 ? 'foot-heel' : 'foot-instep';
      if (name === 'ball_l') return 'foot-toes';
    }
    return null;
  }
  for (let face = 0; face < count; face++) {
    const ids = [sourceIndex(face * 3), sourceIndex(face * 3 + 1), sourceIndex(face * 3 + 2)];
    body.getVertexPosition(ids[0], a); body.getVertexPosition(ids[1], b); body.getVertexPosition(ids[2], c);
    center.copy(a).add(b).add(c).multiplyScalar(1 / 3);
    const id = classify(dominant(ids), center); if (!id) continue;
    if (!regionFaces.has(id)) regionFaces.set(id, []); regionFaces.get(id).push(face); regionByFace.set(face, id);
  }
  const definitions = [...regionFaces].map(([id, faces]) => ({
    id, name: DESCRIPTIONS[id][0], description: DESCRIPTIONS[id][1], faces,
    surfaceOffset: ['chest', 'back', 'pelvis', 'abdomen', 'shoulder', 'biceps', 'triceps', 'leg-quadriceps', 'leg-hamstrings'].includes(id) ? .0017 : .0002,
  }));
  // A front-biased anchor keeps anatomical callouts on the visible, intended
  // surface. Back and posterior regions explicitly use their posterior surface.
  for (const definition of definitions) {
    if (study === 'arm') {
      const points = {
        shoulder: shoulderRest.clone().lerp(elbowRest, .12).add(new THREE.Vector3(.025, .01, .025)),
        biceps: shoulderRest.clone().lerp(elbowRest, .55).add(new THREE.Vector3(0, 0, .055)),
        triceps: shoulderRest.clone().lerp(elbowRest, .55).add(new THREE.Vector3(0, 0, -.045)),
        forearm: elbowRest.clone().lerp(wristRest, .50).add(new THREE.Vector3(0, 0, .035)),
        grip: wristRest.clone().add(new THREE.Vector3(.02, -.025, .015)),
      };
      definition.anchorPoint = points[definition.id].toArray();
      continue;
    }
    const posterior = ['back', 'triceps', 'leg-hamstrings', 'foot-heel'].includes(definition.id);
    let extreme = posterior ? Infinity : -Infinity, selectedFace = definition.faces[0];
    for (const face of definition.faces) {
      const ia = sourceIndex(face * 3), ib = sourceIndex(face * 3 + 1), ic = sourceIndex(face * 3 + 2);
      body.getVertexPosition(ia, a); body.getVertexPosition(ib, b); body.getVertexPosition(ic, c);
      const z = (a.z + b.z + c.z) / 3;
      if (posterior ? z < extreme : z > extreme) { extreme = z; selectedFace = face; }
    }
    definition.anchor = { faceIndex: selectedFace, barycentric: [1 / 3, 1 / 3, 1 / 3] };
  }
  const regions = createSurfaceRegions(body, definitions, { color: 0x59d8bd, opacity: .42, anchorOffset: .0012 });
  const picker = createPosedSurfacePicker(body);
  const preferred = PART_ORDER[study];
  regions.parts.sort((a, b) => preferred.indexOf(a.id) - preferred.indexOf(b.id));
  const bodyTriangles = new Map();
  for (const [face, id] of regionByFace) bodyTriangles.set([sourceIndex(face * 3), sourceIndex(face * 3 + 1), sourceIndex(face * 3 + 2)].join(','), id);
  function resolveHit(hit) {
    hit = picker.sourceHit(hit);
    const direct = regions.resolveHit(hit); if (direct) return direct;
    if (!hit?.object.userData.isWardrobe || hit.faceIndex == null) return null;
    const index = hit.object.geometry.index, base = hit.faceIndex * 3;
    return bodyTriangles.get([index.getX(base), index.getX(base + 1), index.getX(base + 2)].join(',')) || null;
  }
  const toeRest = bone('ball_l').getWorldPosition(new THREE.Vector3());
  const delta = new THREE.Vector3();
  function update(t) {
    character.resetPose();
    const u = actionAt(t);
    // Bring the imported display A-pose into a quiet standing rest, without
    // changing the connected shoulder/arm anatomy or the shared identity.
    rotateWorld('upperarm_l', Z, -.46);
    rotateWorld('upperarm_r', Z, .46);
    if (study === 'body') {
      rotateWorld('spine_03', Y, -.075 * u);
      rotateWorld('clavicle_l', Z, .065 * u);
      rotateWorld('upperarm_l', Z, .69 * u);
      rotateWorld('upperarm_l', X, -.30 * u);
      rotateWorld('lowerarm_l', X, -.40 * u);
      rotateWorld('head', Y, .12 * u);
      fingerPose('l', .42 * u); fingerPose('r', .16 * u);
    } else if (study === 'arm' || study === 'hand') {
      rotateWorld('upperarm_l', Z, study === 'hand' ? .24 : .12);
      rotateWorld('upperarm_l', X, -.12);
      if (study === 'hand') presentPalm();
      else rotateWorld('lowerarm_l', X, -.95 * u);
      fingerPose('l', study === 'hand' ? u : .34 * u);
    } else if (study === 'leg') {
      const flex = .27 * u;
      for (const side of ['l', 'r']) {
        rotateWorld(`thigh_${side}`, X, -flex);
        rotateWorld(`calf_${side}`, X, flex * 2);
        rotateWorld(`foot_${side}`, X, -flex);
      }
      character.updateWorld(); bone('ball_l').getWorldPosition(delta);
      delta.subVectors(toeRest, delta); translateWorld('pelvis', delta);
    } else if (study === 'foot') {
      const rise = .30 * u;
      for (const side of ['l', 'r']) { rotateWorld(`foot_${side}`, X, rise); rotateWorld(`ball_${side}`, X, -rise); }
      character.updateWorld(); bone('ball_l').getWorldPosition(delta);
      delta.subVectors(toeRest, delta); translateWorld('pelvis', delta);
    }
    character.updateWorld(); regions.update(); group.updateMatrixWorld(true); picker.update();
  }
  const viewVertices = new Set();
  if (study === 'body') for (let i = 0; i < geometry.attributes.position.count; i++) viewVertices.add(i);
  else for (const faces of regionFaces.values()) for (const face of faces) for (let k = 0; k < 3; k++) viewVertices.add(sourceIndex(face * 3 + k));
  function posedBounds(all = false) {
    const bounds = new THREE.Box3();
    if (all) for (let i = 0; i < geometry.attributes.position.count; i++) { body.getVertexPosition(i, v); bounds.expandByPoint(body.localToWorld(v)); }
    else for (const i of viewVertices) { body.getVertexPosition(i, v); bounds.expandByPoint(body.localToWorld(v)); }
    return bounds;
  }
  const motionBounds = new THREE.Box3(), fullBounds = new THREE.Box3();
  for (const t of [0, 1.25, 2.5, 3.75, 5]) { update(t); motionBounds.union(posedBounds()); fullBounds.union(posedBounds(true)); }
  motionBounds.expandByScalar(study === 'body' ? .035 : .012); fullBounds.expandByScalar(.035);
  update(0);
  const cameraCenter = motionBounds.getCenter(new THREE.Vector3());
  const cameraDirection = new THREE.Vector3(...spec.direction).normalize();
  return {
    group, character, parts: regions.parts, update, motionBounds, fullBounds,
    pickingMeshes: [picker.mesh], occlusionMeshes: [picker.mesh],
    setSelection: id => { regions.setSelection(id); character.setInspectionRegion(id); },
    resolveHit,
    title: spec.title, subtitle: spec.subtitle,
    camera: { target: cameraCenter.toArray(), position: cameraCenter.clone().addScaledVector(cameraDirection, 3).toArray() },
    beats: getAnatomyMetadata(study).beats,
    metrics: t => [{ label: 'Movement', value: `${Math.round(actionAt(t) * 100)}%` }, { label: 'Cycle', value: '5.00 s' }],
    get poseState() { return { study, skinning: true, identity: 'shared-adult-female' }; },
  };
}

export const createBody = () => createAnatomyStudy('body');
export const createArm = () => createAnatomyStudy('arm');
export const createHand = () => createAnatomyStudy('hand');
export const createLeg = () => createAnatomyStudy('leg');
export const createFoot = () => createAnatomyStudy('foot');
