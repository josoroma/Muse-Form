import * as THREE from 'three';

/**
 * Surface annotations for an already sculpted mesh. No spheres, decals, or
 * guessed bone positions are used: every highlight reuses its source triangles.
 *
 * createSurfaceRegions(mesh, [
 *   { id, name, description, faces: [sourceTriangleIndex, ...],
 *     anchorPoint: [x, y, z] },
 *   { id, name, description, test: ({ centroid, normal, faceIndex }) => true,
 *     anchor: { faceIndex: 5, barycentric: [.2, .5, .3] } }
 * ])
 *
 * `test` and `anchorPoint` use the undeformed mesh-local coordinates. A source
 * triangle may belong to several regions; source-mesh picking chooses the first
 * definition, while an explicitly selected overlay resolves to its own id.
 * Call update() after changing bones/morphs and updating root world matrices.
 * Combine several returned systems when a character has several body meshes.
 */
export function createSurfaceRegions(mesh, definitions, {
  color = 0x9ee4d3, opacity = .34, anchorOffset = .0015,
  renderOrder = 4, material: materialOverride, surfaceOffset = 0, edgeFadeRings = 2,
} = {}) {
  if (!mesh?.isMesh || !mesh.geometry?.attributes.position) throw new TypeError('Surface regions require a triangle mesh.');
  if (mesh.isSkinnedMesh && !mesh.skeleton) throw new TypeError('Bind the character skeleton before creating regions.');
  const source = mesh.geometry, positions = source.attributes.position;
  const index = source.index, faceCount = Math.floor((index?.count ?? positions.count) / 3);
  const parts = [], overlays = [], records = [], faceRegions = new Map(), ids = new Set();
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const ab = new THREE.Vector3(), ac = new THREE.Vector3(), center = new THREE.Vector3(), normal = new THREE.Vector3();
  const triangle = new THREE.Triangle(), target = new THREE.Vector3(), nearest = new THREE.Vector3(), weights = new THREE.Vector3();
  const sourceIndex = offset => index ? index.getX(offset) : offset;

  function faceAt(faceIndex) {
    if (!Number.isInteger(faceIndex) || faceIndex < 0 || faceIndex >= faceCount) throw new RangeError(`Invalid source triangle ${faceIndex}.`);
    const ia = sourceIndex(faceIndex * 3), ib = sourceIndex(faceIndex * 3 + 1), ic = sourceIndex(faceIndex * 3 + 2);
    a.fromBufferAttribute(positions, ia); b.fromBufferAttribute(positions, ib); c.fromBufferAttribute(positions, ic);
    center.copy(a).add(b).add(c).multiplyScalar(1 / 3);
    normal.crossVectors(ab.subVectors(b, a), ac.subVectors(c, a)).normalize();
    return { faceIndex, a, b, c, centroid: center, normal, indices: [ia, ib, ic] };
  }

  function compactGeometry(faces, offset) {
    const remap = new Map(), originals = [], compactIndices = [];
    for (const face of faces) for (const old of faceAt(face).indices) {
      if (!remap.has(old)) { remap.set(old, originals.length); originals.push(old); }
      compactIndices.push(remap.get(old));
    }
    const geometry = new THREE.BufferGeometry();
    function copyAttribute(attribute) {
      // getComponent also handles normalized and interleaved GLTF attributes.
      const array = new Float32Array(originals.length * attribute.itemSize);
      for (let i = 0; i < originals.length; i++) for (let k = 0; k < attribute.itemSize; k++) array[i * attribute.itemSize + k] = attribute.getComponent(originals[i], k);
      const copied = new THREE.BufferAttribute(array, attribute.itemSize);
      copied.name = attribute.name;
      return copied;
    }
    for (const [name, attribute] of Object.entries(source.attributes)) geometry.setAttribute(name, copyAttribute(attribute));
    if (offset && geometry.attributes.normal) {
      const p = geometry.attributes.position, n = geometry.attributes.normal;
      for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) + n.getX(i) * offset, p.getY(i) + n.getY(i) * offset, p.getZ(i) + n.getZ(i) * offset);
    }
    for (const [name, attributes] of Object.entries(source.morphAttributes)) geometry.morphAttributes[name] = attributes.map(copyAttribute);
    geometry.morphTargetsRelative = source.morphTargetsRelative;
    geometry.setIndex(compactIndices);
    if (edgeFadeRings > 0) {
      // A short feather within the real topology avoids a serrated triangle-cut
      // border. The highlight remains the exact underlying surface.
      const edges = new Map(), neighbors = Array.from({ length: originals.length }, () => new Set());
      for (let i = 0; i < compactIndices.length; i += 3) for (let k = 0; k < 3; k++) {
        const a = compactIndices[i + k], b = compactIndices[i + (k + 1) % 3], key = a < b ? `${a},${b}` : `${b},${a}`;
        edges.set(key, (edges.get(key) || 0) + 1); neighbors[a].add(b); neighbors[b].add(a);
      }
      const distances = new Float32Array(originals.length).fill(Infinity), queue = [];
      for (const [edge, count] of edges) if (count === 1) for (const i of edge.split(',').map(Number)) if (distances[i] !== 0) { distances[i] = 0; queue.push(i); }
      for (let head = 0; head < queue.length; head++) { const i = queue[head]; for (const n of neighbors[i]) if (distances[n] > distances[i] + 1) { distances[n] = distances[i] + 1; queue.push(n); } }
      const colors = new Float32Array(originals.length * 4);
      for (let i = 0; i < originals.length; i++) colors.set([1, 1, 1, THREE.MathUtils.smoothstep(distances[i], 0, edgeFadeRings)], i * 4);
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));
    }
    geometry.computeBoundingBox(); geometry.computeBoundingSphere();
    return { geometry, originals };
  }

  for (const definition of definitions) {
    const { id, name = id, description = '' } = definition;
    if (!id || ids.has(id)) throw new TypeError('Surface region ids must be nonempty and unique for a mesh.');
    ids.add(id);
    const faces = definition.faces ? [...new Set(definition.faces)] : [];
    if (!definition.faces && typeof definition.test === 'function') for (let face = 0; face < faceCount; face++) if (definition.test(faceAt(face))) faces.push(face);
    if (!faces.length) throw new RangeError(`Surface region ${id} contains no triangles.`);
    for (const face of faces) { faceAt(face); if (!faceRegions.has(face)) faceRegions.set(face, id); }
    const { geometry, originals } = compactGeometry(faces, definition.surfaceOffset ?? surfaceOffset);
    const material = materialOverride ? materialOverride.clone() : new THREE.MeshStandardMaterial({
      color, roughness: .75, metalness: 0, transparent: true, opacity,
      depthWrite: false, depthTest: true, polygonOffset: true,
      polygonOffsetFactor: -2, polygonOffsetUnits: -2, side: THREE.FrontSide, vertexColors: edgeFadeRings > 0,
    });
    const overlay = mesh.isSkinnedMesh ? new THREE.SkinnedMesh(geometry, material) : new THREE.Mesh(geometry, material);
    overlay.name = `${name} · surface overlay`;
    // As an identity child it occupies the exact source mesh coordinate space.
    mesh.add(overlay);
    if (mesh.isSkinnedMesh) {
      overlay.bindMode = mesh.bindMode;
      overlay.bind(mesh.skeleton, mesh.bindMatrix);
      overlay.bindMatrixInverse.copy(mesh.bindMatrixInverse);
    }
    overlay.morphTargetInfluences = mesh.morphTargetInfluences;
    overlay.morphTargetDictionary = mesh.morphTargetDictionary;
    overlay.visible = false; overlay.renderOrder = renderOrder;
    overlay.castShadow = overlay.receiveShadow = false;
    overlay.frustumCulled = false;
    overlay.userData.partId = id;
    overlay.userData.surfaceOverlay = true;
    overlay.userData.noShadow = true;
    overlay.userData.sourceVertexIndices = originals;
    overlay.userData.sourceFaceIndices = faces;

    let anchorFace, barycentric;
    if (definition.anchor) {
      anchorFace = definition.anchor.faceIndex;
      if (!faces.includes(anchorFace)) throw new RangeError(`The ${id} anchor must lie on its region.`);
      barycentric = new THREE.Vector3().fromArray(definition.anchor.barycentric ?? [1 / 3, 1 / 3, 1 / 3]);
      if (![barycentric.x, barycentric.y, barycentric.z].every(n => Number.isFinite(n) && n >= 0) || Math.abs(barycentric.x + barycentric.y + barycentric.z - 1) > 1e-5) throw new RangeError(`The ${id} anchor needs normalized nonnegative barycentric weights.`);
    } else {
      if (definition.anchorPoint) target.fromArray(definition.anchorPoint);
      else { target.set(0, 0, 0); for (const face of faces) target.add(faceAt(face).centroid); target.multiplyScalar(1 / faces.length); }
      let best = Infinity;
      for (const face of faces) {
        faceAt(face); triangle.set(a, b, c); triangle.closestPointToPoint(target, nearest);
        const distance = nearest.distanceToSquared(target);
        if (distance < best) { best = distance; anchorFace = face; triangle.getBarycoord(nearest, weights); barycentric = weights.clone(); }
      }
    }
    const anchor = new THREE.Object3D(); anchor.name = `${name} · surface anchor`; mesh.add(anchor);
    const record = { id, overlay, anchor, vertexIndices: faceAt(anchorFace).indices, barycentric, anchorFace };
    const part = {
      id, name, description, object: overlay, anchor,
      surfaceAnchor: { faceIndex: anchorFace, barycentric: barycentric.toArray() },
      getBounds(out = new THREE.Box3()) {
        // A skinned mesh's cached bounds do not automatically follow its pose.
        // Compute this only when focusing a region, never every animation frame.
        if (overlay.isSkinnedMesh) { overlay.computeBoundingBox(); return out.copy(overlay.boundingBox).applyMatrix4(overlay.matrixWorld); }
        out.makeEmpty();
        for (let i = 0; i < overlay.geometry.attributes.position.count; i++) { overlay.getVertexPosition(i, target); out.expandByPoint(target); }
        return out.applyMatrix4(overlay.matrixWorld);
      },
    };
    parts.push(part); overlays.push(overlay); records.push(record);
  }

  function update() {
    for (const record of records) {
      const { vertexIndices, barycentric, anchor, overlay } = record;
      // Mesh#getVertexPosition includes morphs; SkinnedMesh adds bone skinning.
      mesh.getVertexPosition(vertexIndices[0], a); mesh.getVertexPosition(vertexIndices[1], b); mesh.getVertexPosition(vertexIndices[2], c);
      normal.crossVectors(ab.subVectors(b, a), ac.subVectors(c, a)).normalize();
      anchor.position.copy(a).multiplyScalar(barycentric.x).addScaledVector(b, barycentric.y).addScaledVector(c, barycentric.z).addScaledVector(normal, anchorOffset);
      anchor.updateMatrixWorld(true);
      // Some loaders/adapters replace the weights array while setting a pose.
      overlay.morphTargetInfluences = mesh.morphTargetInfluences;
      if (mesh.isSkinnedMesh) { overlay.bindMode = mesh.bindMode; overlay.bindMatrix.copy(mesh.bindMatrix); overlay.bindMatrixInverse.copy(mesh.bindMatrixInverse); }
    }
  }

  function setSelection(id) { for (const overlay of overlays) overlay.visible = overlay.userData.partId === id; }
  function resolveHit(hit) {
    if (!hit) return null;
    if (overlays.includes(hit.object)) return hit.object.visible ? hit.object.userData.partId : null;
    return hit.object === mesh ? faceRegions.get(hit.faceIndex) ?? null : null;
  }
  function dispose() {
    for (const { overlay, anchor } of records) { overlay.removeFromParent(); anchor.removeFromParent(); overlay.geometry.dispose(); overlay.material.dispose(); }
  }
  update();
  return { parts, overlays, setSelection, update, resolveHit, dispose, source: mesh, pickingMeshes: [mesh] };
}

/**
 * Exact CPU collision surface, updated once per pose. Repeated label/click rays
 * then intersect ordinary positions instead of re-skinning every triangle for
 * every ray. The proxy is not added to the visible scene; face indices remain
 * identical to the source. This is shared by FORM and MUSE.
 */
export function createPosedSurfacePicker(source) {
  const geometry = new THREE.BufferGeometry(), count = source.geometry.attributes.position.count;
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(count * 3), 3));
  if (source.geometry.index) geometry.setIndex(source.geometry.index);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ side: THREE.FrontSide }));
  mesh.name = `${source.name} · posed collision surface`; mesh.matrixAutoUpdate = false;
  mesh.userData.isCollisionSurface = true;
  const p = new THREE.Vector3();
  function update() {
    const positions = geometry.attributes.position;
    for (let i = 0; i < count; i++) { source.getVertexPosition(i, p); positions.setXYZ(i, p.x, p.y, p.z); }
    positions.needsUpdate = true; geometry.computeBoundingBox(); geometry.computeBoundingSphere();
    mesh.matrix.copy(source.matrixWorld); mesh.matrixWorld.copy(source.matrixWorld);
  }
  function sourceHit(hit) { return hit?.object === mesh ? { ...hit, object: source } : hit; }
  function dispose() { geometry.dispose(); mesh.material.dispose(); }
  update();
  return { mesh, update, sourceHit, dispose };
}
