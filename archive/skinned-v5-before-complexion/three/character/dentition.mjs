import * as THREE from 'three';
import { subdivideHairGeometry } from './subdivide-hair.mjs';

// Refine the licensed dental mesh after the adult identity has been baked.
// Its existing crowns, gums, UV atlas, jaw targets and skin attachment remain
// the source of the result. No replacement rows or floating white primitives.
function connectedComponents(geometry) {
  const p = geometry.attributes.position, parent = Uint32Array.from({ length: p.count }, (_, i) => i);
  const find = i => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
  const join = (a, b) => { parent[find(a)] = find(b); };
  const weld = new Map();
  for (let i = 0; i < p.count; i++) {
    const key = [p.getX(i), p.getY(i), p.getZ(i)].map(x => Math.round(x * 1e6)).join(',');
    if (weld.has(key)) join(i, weld.get(key)); else weld.set(key, i);
  }
  const index = geometry.index;
  for (let i = 0; i < index.count; i += 3) { join(index.getX(i), index.getX(i + 1)); join(index.getX(i), index.getX(i + 2)); }
  const groups = new Map();
  for (let i = 0; i < p.count; i++) { const key = find(i); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(i); }
  return [...groups.values()];
}

function smoothNormals(geometry, positions) {
  const temporary = new THREE.BufferGeometry();
  temporary.setIndex(geometry.index); temporary.setAttribute('position', positions);
  temporary.computeVertexNormals();
  const normal = temporary.attributes.normal, p = positions, groups = new Map();
  for (let i = 0; i < p.count; i++) {
    const key = [p.getX(i), p.getY(i), p.getZ(i)].map(x => Math.round(x * 1e6)).join(',');
    if (!groups.has(key)) groups.set(key, []); groups.get(key).push(i);
  }
  for (const ids of groups.values()) {
    let x = 0, y = 0, z = 0;
    for (const i of ids) { x += normal.getX(i); y += normal.getY(i); z += normal.getZ(i); }
    const length = Math.hypot(x, y, z) || 1;
    for (const i of ids) normal.setXYZ(i, x / length, y / length, z / length);
  }
  return normal;
}

/** Preserve the local affine jaw action when crown proportions change. */
function preserveJawMotion(geometry, ids, oldPositions) {
  const p = geometry.attributes.position, center = new THREE.Vector3();
  for (const i of ids) center.add(new THREE.Vector3().fromBufferAttribute(oldPositions, i));
  center.multiplyScalar(1 / ids.length);
  const covariance = Array(9).fill(0), offset = new THREE.Vector3();
  for (const i of ids) {
    offset.fromBufferAttribute(oldPositions, i).sub(center);
    const a = offset.toArray();
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) covariance[r * 3 + c] += a[r] * a[c];
  }
  const inverse = new THREE.Matrix3().set(...covariance).invert();
  for (const target of geometry.morphAttributes.position || []) {
    const mean = new THREE.Vector3(); let magnitude = 0;
    for (const i of ids) { offset.fromBufferAttribute(target, i); magnitude += offset.lengthSq(); mean.add(offset); }
    if (magnitude < 1e-15) continue;
    mean.multiplyScalar(1 / ids.length);
    const cross = Array(9).fill(0), delta = new THREE.Vector3();
    for (const i of ids) {
      const a = offset.fromBufferAttribute(oldPositions, i).sub(center).toArray();
      const d = delta.fromBufferAttribute(target, i).sub(mean).toArray();
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) cross[r * 3 + c] += d[r] * a[c];
    }
    const derivative = new THREE.Matrix3().set(...cross).multiply(inverse);
    for (const i of ids) {
      offset.fromBufferAttribute(p, i).sub(delta.fromBufferAttribute(oldPositions, i)).applyMatrix3(derivative);
      target.setXYZ(i, target.getX(i) + offset.x, target.getY(i) + offset.y, target.getZ(i) + offset.z);
    }
  }
}

export function refineDentition(scene) {
  const reports = [];
  scene.traverse(mesh => {
    if (!mesh.isMesh || mesh.name !== 'Teeth' || mesh.userData.dentitionRefined) return;
    const geometry = mesh.geometry.clone(), p = geometry.attributes.position;
    const source = p.clone(), jaw = geometry.morphAttributes.position?.[mesh.morphTargetDictionary?.exp_jawOpen];
    const components = connectedComponents(geometry), report = { upperCrowns: 0, lowerCrowns: 0, sourceVertices: p.count, lowerHeightScale: .80 };
    for (const ids of components) {
      // Individual enamel crowns are separate small connected components;
      // the much larger gingiva/oral lining is excluded from crown resizing.
      if (ids.length < 24 || ids.length > 180) continue;
      let minY = Infinity, maxY = -Infinity, centerZ = 0, jawDrop = 0;
      for (const i of ids) { minY = Math.min(minY, p.getY(i)); maxY = Math.max(maxY, p.getY(i)); centerZ += p.getZ(i); jawDrop += jaw?.getY(i) || 0; }
      centerZ /= ids.length;
      const lower = jawDrop / ids.length < -.001;
      // Front lower crowns are smaller than the upper incisors. The posterior
      // bite remains almost unchanged; no row is translated away from its gums.
      const front = THREE.MathUtils.smoothstep(centerZ, .112, .128);
      const height = lower ? THREE.MathUtils.lerp(.96, .80, front) : THREE.MathUtils.lerp(1, .98, front);
      const root = lower ? minY : maxY;
      for (const i of ids) {
        p.setY(i, root + (p.getY(i) - root) * height);
        if (lower) p.setZ(i, p.getZ(i) - .00035 * front);
      }
      preserveJawMotion(geometry, ids, source);
      report[lower ? 'lowerCrowns' : 'upperCrowns']++;
    }
    // One restrained pass rounds incisal corners and removes the coarse facets
    // without turning the separate teeth into a single featureless white strip.
    const refined = subdivideHairGeometry(geometry, { iterations: 1, strength: .55, preserveBoundaries: true, weldNormalThreshold: -.99 });
    geometry.dispose();
    const base = refined.attributes.position, normal = smoothNormals(refined, base);
    refined.setAttribute('normal', normal);
    refined.morphAttributes.normal = (refined.morphAttributes.position || []).map(target => {
      const values = new Float32Array(base.count * 3); let moved = false;
      for (let i = 0; i < target.count; i++) if (Math.abs(target.getX(i)) + Math.abs(target.getY(i)) + Math.abs(target.getZ(i)) > 1e-9) { moved = true; break; }
      if (moved) {
        const posed = base.clone();
        for (let i = 0; i < base.count; i++) posed.setXYZ(i, base.getX(i) + target.getX(i), base.getY(i) + target.getY(i), base.getZ(i) + target.getZ(i));
        const targetNormal = smoothNormals(refined, posed);
        for (let i = 0; i < base.count; i++) values.set([targetNormal.getX(i) - normal.getX(i), targetNormal.getY(i) - normal.getY(i), targetNormal.getZ(i) - normal.getZ(i)], i * 3);
      }
      return new THREE.BufferAttribute(values, 3);
    });
    report.vertices = refined.attributes.position.count; report.triangles = refined.index.count / 3;
    refined.userData = { ...refined.userData, dentition: report }; delete refined.userData.hairSubdivision;
    refined.computeBoundingBox(); refined.computeBoundingSphere();
    mesh.geometry = refined; mesh.userData.dentitionRefined = true; reports.push(report);
  });
  return reports;
}
