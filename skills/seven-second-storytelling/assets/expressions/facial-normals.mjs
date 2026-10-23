import * as THREE from 'three';

/** Evaluate the combined face before skinning rather than summing independently
 * authored normal deltas. Positions, UVs, indices and all expression targets stay
 * shared and immutable; only this instance's normal buffer is private. */
export function createFacialNormalUpdater(body, overlays = []) {
  const source = body.geometry, p = source.attributes.position;
  const restNormals = new Float32Array(source.attributes.normal.array);
  const geometry = new THREE.BufferGeometry();
  for (const [name, attribute] of Object.entries(source.attributes)) geometry.setAttribute(name, attribute);
  const normal = new THREE.BufferAttribute(restNormals.slice(), 3).setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('normal', normal); geometry.setIndex(source.index);
  geometry.morphAttributes = { ...source.morphAttributes };
  delete geometry.morphAttributes.normal;
  geometry.morphTargetsRelative = source.morphTargetsRelative;
  geometry.groups = source.groups.map(group => ({ ...group }));
  geometry.boundingBox = source.boundingBox?.clone() || null;
  geometry.boundingSphere = source.boundingSphere?.clone() || null;
  geometry.userData = { ...source.userData };
  body.geometry = geometry; body.material.needsUpdate = true;

  const rest = new Float64Array(p.count * 3), positions = new Float64Array(p.count * 3);
  const weights = new Float32Array(p.count), weld = new Uint32Array(p.count), groups = new Map();
  const smooth = THREE.MathUtils.smoothstep;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), offset = i * 3;
    rest[offset] = x; rest[offset + 1] = y; rest[offset + 2] = z;
    // The lower neck and rear cranium retain their authored normals. A soft
    // margin avoids introducing a new lighting boundary around the face.
    weights[i] = smooth(y, 1.425, 1.455) * smooth(z, .015, .055);
    const key = `${Math.round(x * 1e6)},${Math.round(y * 1e6)},${Math.round(z * 1e6)}`;
    if (!groups.has(key)) groups.set(key, groups.size);
    weld[i] = groups.get(key);
  }
  positions.set(rest);
  const selectedGroups = new Uint8Array(groups.size);
  for (let i = 0; i < p.count; i++) if (weights[i] > 0) selectedGroups[weld[i]] = 1;
  const indices = source.index, triangles = [], relevant = new Set();
  for (let i = 0; i < indices.count; i += 3) {
    const a = indices.getX(i), b = indices.getX(i + 1), c = indices.getX(i + 2);
    if (!selectedGroups[weld[a]] && !selectedGroups[weld[b]] && !selectedGroups[weld[c]]) continue;
    triangles.push(a, b, c); relevant.add(a); relevant.add(b); relevant.add(c);
  }
  const faces = Uint32Array.from(triangles), vertices = Uint32Array.from(relevant);
  const sums = new Float64Array(groups.size * 3), neutral = new Float64Array(groups.size * 3);
  function accumulate() {
    sums.fill(0);
    for (let i = 0; i < faces.length; i += 3) {
      const ia = faces[i], ib = faces[i + 1], ic = faces[i + 2], a = ia * 3, b = ib * 3, c = ic * 3;
      const ux = positions[b] - positions[a], uy = positions[b + 1] - positions[a + 1], uz = positions[b + 2] - positions[a + 2];
      const vx = positions[c] - positions[a], vy = positions[c + 1] - positions[a + 1], vz = positions[c + 2] - positions[a + 2];
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      for (let k = 0; k < 3; k++) {
        const offset = weld[faces[i + k]] * 3;
        sums[offset] += nx; sums[offset + 1] += ny; sums[offset + 2] += nz;
      }
    }
    for (let i = 0; i < sums.length; i += 3) {
      const length = Math.hypot(sums[i], sums[i + 1], sums[i + 2]) || 1;
      sums[i] /= length; sums[i + 1] /= length; sums[i + 2] /= length;
    }
  }
  accumulate(); neutral.set(sums);
  const targets = source.morphAttributes.position;
  const previous = new Float64Array(targets.length).fill(NaN);
  const activeTargets = new Uint16Array(targets.length), activeWeights = new Float64Array(targets.length);
  const overlayNormals = overlays.map(mesh => {
    delete mesh.geometry.morphAttributes.normal;
    mesh.geometry.attributes.normal.setUsage(THREE.DynamicDrawUsage);
    mesh.material.needsUpdate = true;
    return { mesh, ids: mesh.userData.sourceVertexIndices, normal: mesh.geometry.attributes.normal };
  });
  const stats = { updates: 0, skipped: 0, meanMs: 0, maxMs: 0, vertices: vertices.length, triangles: faces.length / 3 };
  body.userData.facialNormalEvaluation = stats;
  function update() {
    const influences = body.morphTargetInfluences;
    let changed = false, count = 0;
    for (let i = 0; i < influences.length; i++) {
      if (influences[i] !== previous[i]) changed = true;
      if (influences[i] !== 0) { activeTargets[count] = i; activeWeights[count++] = influences[i]; }
    }
    if (!changed) { stats.skipped++; return false; }
    const began = performance.now(); previous.set(influences);
    if (count === 0) normal.array.set(restNormals);
    else {
      for (let n = 0; n < vertices.length; n++) {
        const i = vertices[n], offset = i * 3;
        let x = rest[offset], y = rest[offset + 1], z = rest[offset + 2];
        for (let k = 0; k < count; k++) {
          const target = targets[activeTargets[k]], weight = activeWeights[k];
          x += target.getX(i) * weight; y += target.getY(i) * weight; z += target.getZ(i) * weight;
        }
        positions[offset] = x; positions[offset + 1] = y; positions[offset + 2] = z;
      }
      accumulate();
      for (let n = 0; n < vertices.length; n++) {
        const i = vertices[n], amount = weights[i]; if (!amount) continue;
        const offset = i * 3, group = weld[i] * 3;
        // The geometric delta is relative to neutral topology: exact neutral
        // shading remains shared with FORM instead of changing the identity.
        const x = restNormals[offset] + amount * (sums[group] - neutral[group]);
        const y = restNormals[offset + 1] + amount * (sums[group + 1] - neutral[group + 1]);
        const z = restNormals[offset + 2] + amount * (sums[group + 2] - neutral[group + 2]);
        const length = Math.hypot(x, y, z) || 1;
        normal.setXYZ(i, x / length, y / length, z / length);
      }
    }
    normal.needsUpdate = true;
    for (const overlay of overlayNormals) {
      for (let i = 0; i < overlay.ids.length; i++) {
        const j = overlay.ids[i]; overlay.normal.setXYZ(i, normal.getX(j), normal.getY(j), normal.getZ(j));
      }
      overlay.normal.needsUpdate = true;
    }
    const elapsed = performance.now() - began;
    stats.meanMs += (elapsed - stats.meanMs) / ++stats.updates; stats.maxMs = Math.max(stats.maxMs, elapsed);
    return true;
  }
  return { update, stats, originalGeometry: source };
}
