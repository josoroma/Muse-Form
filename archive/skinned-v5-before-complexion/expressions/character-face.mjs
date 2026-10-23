import * as THREE from 'three';
import { loadCharacter, createCharacter } from '../three/character/character.mjs';
import { createSurfaceRegions, createPosedSurfacePicker } from '../three/character/regions.mjs';

export { loadCharacter };
export const EXPRESSION_IDS = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'wink', 'laughter'];
const PARTS = [
  { id: 'brow', name: 'Brow & forehead', description: 'The brows lift, lower and draw toward the bridge. The skin and attached brow hairs follow the same sculpted expression targets.' },
  { id: 'eyes', name: 'Eyelids & gaze', description: 'The lids move over full eyeballs. Closing a lid covers the iris; the lashes follow the lid margin without shrinking the eye.' },
  { id: 'cheeks', name: 'Cheek region', description: 'The cheek surface rises toward the lower lids and joins the mouth corners in a smile. These are authored surface motions, not measured muscle activation.' },
  { id: 'mouth', name: 'Lips & mouth corners', description: 'The lips lift, press, narrow or part together with the surrounding face. The mouth interior, teeth and tongue remain attached to their sculpted geometry.' },
  { id: 'jaw', name: 'Jaw & chin', description: 'The lower face releases beneath the upper jaw, carrying the lower teeth and tongue. A restrained range preserves the chin and lip silhouette in profile.' },
  { id: 'chest', name: 'Pectoralis region', description: 'A surface overlay indicates the upper chest beneath the anatomical bodysuit. The continuous shoulders and clavicles connect the torso to the arms.' },
  { id: 'back', name: 'Back', description: 'The posterior trunk joins the shoulders, waist and pelvis. Hair fades while you inspect this region so the true back surface is visible; the highlight and label follow the same skinned surface during rotation.' },
  { id: 'pelvis', name: 'Pelvis', description: 'The pelvic region connects the waist and hips to the thighs. The mint highlight marks the covered surface rather than exposed internal anatomy.' },
];
// Fear and wonder support the lower lip while releasing the jaw. This keeps
// the shortened lower crowns behind the lip rather than displaying a row of
// isolated blocks; upper-lip lift stays restrained instead of forcing a grin.
export const EXPRESSIONS = {
  joy: { title: 'A quiet joy', subtitle: 'Cheek lift · soft eyes · rising corners', action: 'Smile', detail: 'The corners lift with the cheeks while the eyes soften into a restrained smile.', morphs: { mouthSmileLeft: .53, mouthSmileRight: .53, cheekSquintLeft: .15, cheekSquintRight: .15, eyeSquintLeft: .10, eyeSquintRight: .10, jawOpen: .025 }, roll: -.018 },
  sadness: { title: 'A tender sadness', subtitle: 'Inner brow lift · lowered corners', action: 'Feel', detail: 'The inner brows lift, the mouth corners turn down and the chin lowers gently.', morphs: { browInnerUp: .48, browDownLeft: .12, browDownRight: .12, mouthFrownLeft: .38, mouthFrownRight: .38, eyeSquintLeft: .08, eyeSquintRight: .08, mouthShrugLower: .10 }, pitch: .025 },
  anger: { title: 'Contained anger', subtitle: 'Brow draw · focused lids · firm lips', action: 'Focus', detail: 'The brows draw inward, the lids narrow and the lips press together in a controlled acting pose.', morphs: { browDownLeft: .62, browDownRight: .62, eyeSquintLeft: .24, eyeSquintRight: .24, mouthPressLeft: .30, mouthPressRight: .30, noseSneerLeft: .055, noseSneerRight: .055 }, pitch: .012 },
  fear: { title: 'A moment of fear', subtitle: 'Raised brows · wide eyes · stretched lips', action: 'Startle', detail: 'The inner brows rise with widened eyes and a small, laterally stretched mouth opening.', morphs: { browInnerUp: .55, browOuterUpLeft: .18, browOuterUpRight: .18, browDownLeft: .10, browDownRight: .10, eyeWideLeft: .33, eyeWideRight: .33, mouthStretchLeft: .22, mouthStretchRight: .22, mouthFrownLeft: .06, mouthFrownRight: .06, mouthUpperUpLeft: .25, mouthUpperUpRight: .25, mouthShrugLower: .16, jawOpen: .22 }, pitch: -.012 },
  surprise: { title: 'Open wonder', subtitle: 'Brow lift · rounded mouth · open eyes', action: 'Wonder', detail: 'Both brows lift, the eyelids open and the lips round around a modest jaw release.', morphs: { browInnerUp: .43, browOuterUpLeft: .40, browOuterUpRight: .40, eyeWideLeft: .34, eyeWideRight: .34, jawOpen: .34, mouthFunnel: .22, mouthPucker: .025, mouthUpperUpLeft: .18, mouthUpperUpRight: .18, mouthShrugLower: .28 }, pitch: -.018 },
  disgust: { title: 'A passing distaste', subtitle: 'Nose wrinkle · upper lip lift · narrowed eyes', action: 'Recoil', detail: 'One side of the upper lip rises with the nose while the brows and eyes tighten briefly.', morphs: { noseSneerLeft: .38, noseSneerRight: .16, mouthUpperUpLeft: .26, mouthUpperUpRight: .10, browDownLeft: .20, browDownRight: .16, eyeSquintLeft: .18, eyeSquintRight: .12, mouthPressRight: .10, jawOpen: .035 }, yaw: .025, roll: .02 },
  wink: { title: 'A knowing wink', subtitle: 'One closing lid · cheek lift · half smile', action: 'Wink', detail: 'The viewer-left eye closes fully. Its cheek lifts into a half smile while the opposite eye stays open.', morphs: { mouthSmileRight: .36, mouthSmileLeft: .22, cheekSquintRight: .15, browOuterUpLeft: .12, jawOpen: .02 }, roll: -.025 },
  laughter: { title: 'Uncontained delight', subtitle: 'Open smile · lifted cheeks · delighted eyes', action: 'Laugh', detail: 'An open smile raises the cheeks and narrows the eyes while the lower jaw releases beneath the upper teeth.', morphs: { mouthSmileLeft: .90, mouthSmileRight: .90, cheekSquintLeft: .28, cheekSquintRight: .28, eyeSquintLeft: .30, eyeSquintRight: .30, eyeBlinkLeft: .12, eyeBlinkRight: .12, jawOpen: .30, mouthUpperUpLeft: .40, mouthUpperUpRight: .40 }, pitch: -.027, roll: -.012 },
};
const clamp = THREE.MathUtils.clamp;
const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const phase = time => THREE.MathUtils.euclideanModulo(time, 5);
function amountAt(time, delay = 0) {
  const t = phase(time);
  if (t <= .52 + delay || t >= 4.65) return 0;
  if (t < 2.08) return smooth((t - .52 - delay) / (1.56 - delay));
  if (t <= 2.90) return 1;
  return 1 - smooth((t - 2.90) / 1.75);
}
function winkAt(time) {
  const t = phase(time);
  if (t <= 1.05 || t >= 3.75) return 0;
  if (t < 1.82) return smooth((t - 1.05) / .77);
  if (t <= 2.90) return 1;
  return 1 - smooth((t - 2.90) / .85);
}
function beatsFor(spec) {
  return [
    { time: 0, label: 'Presence', description: 'The same adult character begins in a relaxed neutral pose.' },
    { time: .52, label: 'Gather', description: 'The brows and eyelids begin the action; the cheeks and mouth follow.' },
    { time: 2.08, label: spec.action, description: spec.detail },
    { time: 2.90, label: 'Release', description: 'The expression eases back through the same attached facial surfaces.' },
    { time: 4.65, label: 'Rest', description: 'The shared neutral geometry returns and holds through the matching five-second endpoint.' },
  ];
}
/** Metadata can be cataloged in Node without loading GLBs, images or WebGL. */
export function getExpressionMetadata(id = 'joy') {
  const spec = EXPRESSIONS[id] || EXPRESSIONS.joy;
  return { title: spec.title, subtitle: spec.subtitle, beats: beatsFor(spec), parts: PARTS.map(part => ({ ...part })), duration: 5 };
}

/** Create after await loadCharacter(): one licensed identity, eight acting poses. */
export function createFace(expressionId = 'joy') {
  if (!EXPRESSION_IDS.includes(expressionId)) expressionId = 'joy';
  const spec = EXPRESSIONS[expressionId], character = createCharacter();
  const { group, body, bones } = character;
  group.name = `MUSE · ${spec.title}`;
  const p = body.geometry.attributes.position;
  const q = new THREE.Quaternion(), parentQ = new THREE.Quaternion(), headInverse = new THREE.Quaternion();
  const axis = new THREE.Vector3(), tmp = new THREE.Vector3(), lo = new THREE.Vector3(), hi = new THREE.Vector3();
  const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0), Z = new THREE.Vector3(0, 0, 1);
  const eyeMesh = character.meshes.find(m => m.name === 'Eyes_1') || character.meshes.find(m => /Eyes/.test(m.name));
  const eyesBox = eyeMesh?.geometry.boundingBox?.clone() || new THREE.Box3(new THREE.Vector3(-.045, 1.554, .108), new THREE.Vector3(.045, 1.584, .131));
  const eyeY = eyesBox.getCenter(new THREE.Vector3()).y, eyeX = .0294;
  let topY = -Infinity; for (let i = 0; i < p.count; i++) topY = Math.max(topY, p.getY(i));
  const pelvisY = bones.get('pelvis').getWorldPosition(tmp).y;
  const neckY = bones.get('neck_01').getWorldPosition(tmp).y;
  const front = ({ centroid: v, normal }) => v.z > .074 && normal.z > -.35;
  const definitions = [
    { id: 'brow', test: f => front(f) && f.centroid.y > eyeY + .009 && f.centroid.y < eyeY + .044 && Math.abs(f.centroid.x) < .065, anchorPoint: [-.033, eyeY + .020, .145] },
    { id: 'eyes', test: f => front(f) && f.centroid.y > eyeY - .019 && f.centroid.y < eyeY + .012 && Math.abs(f.centroid.x) > .011 && Math.abs(f.centroid.x) < .064, anchorPoint: [.036, eyeY + .001, .134] },
    { id: 'cheeks', test: f => front(f) && f.centroid.y > eyeY - .060 && f.centroid.y < eyeY - .017 && Math.abs(f.centroid.x) > .027 && Math.abs(f.centroid.x) < .076, anchorPoint: [-.053, eyeY - .035, .131] },
    { id: 'mouth', test: f => front(f) && f.centroid.y > eyeY - .086 && f.centroid.y < eyeY - .047 && Math.abs(f.centroid.x) < .041 && f.centroid.z > .112, anchorPoint: [.025, eyeY - .063, .146] },
    { id: 'jaw', test: f => f.centroid.z > .052 && f.centroid.y > eyeY - .126 && f.centroid.y < eyeY - .083 && Math.abs(f.centroid.x) < .071, anchorPoint: [.032, eyeY - .107, .115] },
    { id: 'chest', test: f => f.centroid.z > .035 && f.centroid.y > neckY - .29 && f.centroid.y < neckY - .065 && Math.abs(f.centroid.x) < .18, anchorPoint: [-.07, neckY - .17, .14], surfaceOffset: .0020 },
    { id: 'back', test: f => f.centroid.z < .025 && f.centroid.y > pelvisY + .09 && f.centroid.y < neckY - .04 && Math.abs(f.centroid.x) < .18, anchorPoint: [.045, neckY - .21, -.075], surfaceOffset: .0020 },
    { id: 'pelvis', test: f => f.centroid.y > pelvisY - .13 && f.centroid.y < pelvisY + .065 && Math.abs(f.centroid.x) < .18, anchorPoint: [.09, pelvisY - .025, .12], surfaceOffset: .0020 },
  ].map(definition => ({ ...PARTS.find(part => part.id === definition.id), ...definition }));
  const regions = createSurfaceRegions(body, definitions, { opacity: .25, anchorOffset: .002, surfaceOffset: .0002 });
  for (const part of regions.parts) if (['chest', 'back', 'pelvis'].includes(part.id)) {
    part.object.material.color.setHex(0x59d8bd); part.object.material.opacity = .52;
  }
  const picker = createPosedSurfacePicker(body);
  const triangleRegions = new Map();
  for (const overlay of regions.overlays) for (const f of overlay.userData.sourceFaceIndices) {
    const ind = body.geometry.index, key = [0, 1, 2].map(k => ind.getX(f * 3 + k)).join(',');
    if (!triangleRegions.has(key)) triangleRegions.set(key, overlay.userData.partId);
  }
  function rotateWorld(name, direction, angle) {
    const bone = bones.get(name); if (!bone || !angle) return;
    bone.parent.updateWorldMatrix(true, false); bone.parent.getWorldQuaternion(parentQ).invert();
    axis.copy(direction).applyQuaternion(parentQ).normalize();
    bone.quaternion.premultiply(q.setFromAxisAngle(axis, angle)); bone.updateWorldMatrix(false, true);
  }
  function closestVertex(point) {
    let best = Infinity, index = 0;
    for (let i = 0; i < p.count; i++) {
      const d = (p.getX(i) - point[0]) ** 2 + (p.getY(i) - point[1]) ** 2 + (p.getZ(i) - point[2]) ** 2;
      if (d < best) { best = d; index = i; }
    }
    return index;
  }
  // Rest-surface lid landmarks, measured in metres. A signed gap becomes zero
  // when the upper margin covers the lower margin; it is never a scale trick.
  const lidPairs = [-1, 1].map(side => ({
    upper: closestVertex([side * eyeX, eyeY + .0041, .1308]),
    lower: closestVertex([side * eyeX, eyeY - .0050, .1298]),
  }));
  function aperture(pair) {
    body.getVertexPosition(pair.upper, hi); body.getVertexPosition(pair.lower, lo);
    body.localToWorld(hi); body.localToWorld(lo);
    bones.get('head').getWorldQuaternion(headInverse).invert();
    return Math.max(0, hi.sub(lo).applyQuaternion(headInverse).y);
  }
  let currentTime = 0, currentAmount = 0, currentWink = 0, applied = {};
  function update(time) {
    currentTime = time; currentAmount = amountAt(time); currentWink = expressionId === 'wink' ? winkAt(time) : 0;
    character.resetPose();
    // This matches FORM's relaxed standing base; the imported skin keeps the
    // elbows, finger webbing and all phalanges continuous through the pose.
    rotateWorld('upperarm_l', Z, -.46); rotateWorld('upperarm_r', Z, .46);
    applied = {};
    for (const [name, weight] of Object.entries(spec.morphs)) {
      const delay = /^(mouth|jaw)/.test(name) ? .12 : /^cheek/.test(name) ? .06 : 0;
      const value = weight * amountAt(time, delay);
      character.setMorph(`exp_${name}`, value); applied[`exp_${name}`] = value;
    }
    if (expressionId === 'wink') {
      character.setMorph('exp_eyeBlinkRight', currentWink); applied.exp_eyeBlinkRight = currentWink;
    }
    rotateWorld('head', X, (spec.pitch || 0) * currentAmount);
    rotateWorld('head', Y, (spec.yaw || 0) * currentAmount);
    rotateWorld('head', Z, (spec.roll || 0) * currentAmount);
    character.updateWorld(); regions.update(); group.updateMatrixWorld(true); picker.update();
  }
  update(0);
  const neutralGaps = lidPairs.map(aperture);
  const bodyBounds = new THREE.Box3().setFromObject(group);
  bodyBounds.expandByScalar(.018);
  // The default portrait frames crown, face, neck and upper shoulders. The same
  // complete skinned character remains available for whole-body inspection.
  const viewBounds = new THREE.Box3(new THREE.Vector3(-.185, eyeY - .245, -.15), new THREE.Vector3(.185, topY + .035, .19));
  const center = viewBounds.getCenter(new THREE.Vector3());
  function resolveHit(hit) {
    hit = picker.sourceHit(hit);
    const direct = regions.resolveHit(hit); if (direct) return direct;
    if (!hit?.object) return null;
    if (/Eyebrows/.test(hit.object.name)) return 'brow';
    if (/Eyes|Eyelashes/.test(hit.object.name)) return 'eyes';
    if (/Teeth|Tongue/.test(hit.object.name)) return 'mouth';
    if (hit.object.userData.isWardrobe && hit.faceIndex != null) {
      const ind = hit.object.geometry.index;
      return triangleRegions.get([0, 1, 2].map(k => ind.getX(hit.faceIndex * 3 + k)).join(',')) || null;
    }
    return null;
  }
  return {
    group, character, parts: regions.parts, expressionId, update, viewBounds, bodyBounds,
    motionBounds: viewBounds.clone(), fullBounds: bodyBounds.clone(),
    bounds: { min: bodyBounds.min.toArray(), max: bodyBounds.max.toArray() },
    title: spec.title, subtitle: spec.subtitle, beats: beatsFor(spec),
    camera: { target: center.toArray(), position: center.clone().add(new THREE.Vector3(.14, .018, .90)).toArray() },
    setSelection(id) { regions.setSelection(id); character.setInspectionRegion(id); }, resolveHit,
    pickingMeshes: [picker.mesh], occlusionMeshes: [picker.mesh],
    get poseState() {
      const gaps = lidPairs.map(aperture), open = gaps.map((gap, i) => clamp(gap / Math.max(neutralGaps[i], .0001), 0, 1));
      return { amount: currentAmount, leftEyeOpen: open[0], rightEyeOpen: open[1], leftAperture: gaps[0], rightAperture: gaps[1], apertureUnits: 'metres', leftIrisVisible: gaps[0] > .0005, rightIrisVisible: gaps[1] > .0005, jawOpen: applied.exp_jawOpen || 0, smile: ((applied.exp_mouthSmileLeft || 0) + (applied.exp_mouthSmileRight || 0)) / 2, brow: applied.exp_browInnerUp || 0, morphs: { ...applied }, time: phase(currentTime), skinning: true, identity: 'shared-adult-female' };
    },
    metrics(time) { return [{ label: 'Expression', value: `${Math.round(amountAt(time) * 100)}%` }, { label: 'Jaw release', value: `${Math.round((spec.morphs.jawOpen || 0) * amountAt(time, .12) * 100)}%` }, { label: 'Cycle', value: '5.00 s' }]; },
  };
}
