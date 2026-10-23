import * as THREE from 'three';

/**
 * Native Loop subdivision for a small skinned hair mesh. Run after baking the
 * fixed identity, before binding/cloning. Returns a new geometry; source and
 * skeleton are untouched. UV seams remain distinct attribute vertices, while
 * coincident positions with compatible normals share the smoothing topology.
 * Card boundaries stay disconnected; preserveBoundaries pins their positions,
 * or false applies the standard Loop boundary rule for a rounded silhouette.
 * Non-manifold intersections are always held in place.
 */
export function subdivideHairGeometry(source, {
  iterations = 2, weldTolerance = 1e-6, weldNormalThreshold = .85,
  preserveBoundaries = true, strength = 1,
} = {}) {
  if (!source?.attributes?.position) throw new TypeError('Hair subdivision requires position attributes.');
  if (!Number.isInteger(iterations) || iterations < 0 || iterations > 2) throw new RangeError('Use zero, one or two hair subdivision passes.');
  if (!Number.isFinite(weldTolerance) || !(weldTolerance > 0) || !Number.isFinite(strength) || strength < 0 || strength > 1) throw new RangeError('Invalid hair subdivision settings.');
  let geometry = source.clone();
  const report = { iterations, inputVertices: source.attributes.position.count, inputTriangles: (source.index?.count ?? source.attributes.position.count) / 3, passes: [] };

  for (let pass = 0; pass < iterations; pass++) {
    const old = geometry, p = old.attributes.position, normals = old.attributes.normal, count = p.count;
    const canonical = new Uint32Array(count), representatives = [], buckets = new Map();
    const neighbors = [], edgeMap = new Map(), triangles = [];
    const edgeKey = (a, b) => a < b ? `${a},${b}` : `${b},${a}`;
    const at = i => old.index ? old.index.getX(i) : i;
    function compatible(a, b) {
      if (!normals) return true;
      const dot = normals.getX(a) * normals.getX(b) + normals.getY(a) * normals.getY(b) + normals.getZ(a) * normals.getZ(b);
      return dot >= weldNormalThreshold;
    }
    for (let i = 0; i < count; i++) {
      const key = [p.getX(i), p.getY(i), p.getZ(i)].map(x => Math.round(x / weldTolerance)).join(',');
      const candidates = buckets.get(key) || [];
      let id = candidates.find(id => compatible(i, representatives[id]));
      if (id === undefined) { id = representatives.length; representatives.push(i); neighbors.push(new Set()); candidates.push(id); buckets.set(key, candidates); }
      canonical[i] = id;
    }
    const indexCount = old.index?.count ?? count;
    for (let i = 0; i + 2 < indexCount; i += 3) {
      const vertices = [at(i), at(i + 1), at(i + 2)], ids = vertices.map(v => canonical[v]);
      triangles.push(vertices);
      for (let k = 0; k < 3; k++) {
        const a = ids[k], b = ids[(k + 1) % 3], opposite = ids[(k + 2) % 3];
        if (a === b) continue;
        neighbors[a].add(b); neighbors[b].add(a);
        const key = edgeKey(a, b); if (!edgeMap.has(key)) edgeMap.set(key, { a, b, opposite: [] });
        edgeMap.get(key).opposite.push(opposite);
      }
    }
    const boundaryNeighbors = representatives.map(() => new Set()), nonManifold = new Set();
    for (const { a, b, opposite } of edgeMap.values()) {
      if (opposite.length === 1) { boundaryNeighbors[a].add(b); boundaryNeighbors[b].add(a); }
      if (opposite.length > 2) { nonManifold.add(a); nonManifold.add(b); }
    }
    const vertexStencils = representatives.map((representative, id) => {
      const boundary = [...boundaryNeighbors[id]], adjacent = [...neighbors[id]], n = adjacent.length;
      if (nonManifold.has(id) || n < 3 || (boundary.length && (preserveBoundaries || boundary.length !== 2))) return [[representative, 1]];
      if (boundary.length === 2) return [[representative, 1 - .25 * strength], ...boundary.map(v => [representatives[v], .125 * strength])];
      const beta = (5 / 8 - (3 / 8 + Math.cos(2 * Math.PI / n) / 4) ** 2) / n * strength;
      return [[representative, 1 - n * beta], ...adjacent.map(v => [representatives[v], beta])];
    });
    const stencils = [], linearStencils = [];
    for (let i = 0; i < count; i++) { stencils.push(vertexStencils[canonical[i]]); linearStencils.push([[i, 1]]); }
    const splitEdges = new Map(), indices = [];
    function split(a, b) {
      // Original indices distinguish UV seams and alpha-card attribute edges.
      const key = edgeKey(a, b); if (splitEdges.has(key)) return splitEdges.get(key);
      const id = stencils.length, edge = edgeMap.get(edgeKey(canonical[a], canonical[b]));
      let stencil = [[a, .5], [b, .5]];
      if (edge?.opposite.length === 2 && !nonManifold.has(edge.a) && !nonManifold.has(edge.b)) {
        stencil = [[representatives[edge.a], .5 - .125 * strength], [representatives[edge.b], .5 - .125 * strength], ...edge.opposite.map(v => [representatives[v], .125 * strength])];
      }
      stencils.push(stencil); linearStencils.push([[a, .5], [b, .5]]); splitEdges.set(key, id); return id;
    }
    for (const [a, b, c] of triangles) {
      const ab = split(a, b), bc = split(b, c), ca = split(c, a);
      indices.push(a, ab, ca, b, bc, ab, c, ca, bc, ab, bc, ca);
    }
    geometry = new THREE.BufferGeometry();
    function interpolate(attribute, weights, normalize = false) {
      const values = new Float32Array(weights.length * attribute.itemSize);
      for (let i = 0; i < weights.length; i++) {
        for (const [vertex, weight] of weights[i]) for (let k = 0; k < attribute.itemSize; k++) values[i * attribute.itemSize + k] += attribute.getComponent(vertex, k) * weight;
        if (normalize) { const offset = i * attribute.itemSize, length = Math.hypot(values[offset], values[offset + 1], values[offset + 2]) || 1; for (let k = 0; k < 3; k++) values[offset + k] /= length; }
      }
      const result = new THREE.BufferAttribute(values, attribute.itemSize); result.name = attribute.name; return result;
    }
    for (const [name, attribute] of Object.entries(old.attributes)) {
      if (name === 'skinIndex' || name === 'skinWeight') continue;
      // UVs and strand-distance/color channels remain face-varying. Positional
      // and normal channels use the very same geometric subdivision stencil.
      const geometric = name === 'position' || name === 'normal';
      geometry.setAttribute(name, interpolate(attribute, geometric ? stencils : linearStencils, name === 'normal'));
    }
    if (old.attributes.skinIndex && old.attributes.skinWeight) {
      const joints = new Uint16Array(stencils.length * 4), weights = new Float32Array(stencils.length * 4);
      for (let i = 0; i < stencils.length; i++) {
        const influences = new Map();
        for (const [vertex, contribution] of stencils[i]) for (let k = 0; k < 4; k++) {
          const joint = old.attributes.skinIndex.getComponent(vertex, k), weight = old.attributes.skinWeight.getComponent(vertex, k) * contribution;
          if (weight > 0) influences.set(joint, (influences.get(joint) || 0) + weight);
        }
        const top = [...influences].sort((a, b) => b[1] - a[1]).slice(0, 4), total = top.reduce((sum, [, weight]) => sum + weight, 0) || 1;
        for (let k = 0; k < top.length; k++) { joints[i * 4 + k] = top[k][0]; weights[i * 4 + k] = top[k][1] / total; }
      }
      geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(joints, 4));
      geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weights, 4));
    }
    for (const [name, attributes] of Object.entries(old.morphAttributes)) geometry.morphAttributes[name] = attributes.map(attribute => interpolate(attribute, stencils));
    geometry.morphTargetsRelative = old.morphTargetsRelative;
    geometry.setIndex(indices);
    for (const group of old.groups) geometry.addGroup(group.start * 4, group.count * 4, group.materialIndex);
    geometry.computeBoundingBox(); geometry.computeBoundingSphere();
    geometry.name = source.name;
    const boundaryVertices = boundaryNeighbors.filter(n => n.size).length;
    report.passes.push({ vertices: stencils.length, triangles: indices.length / 3, weldedVertices: count - representatives.length, boundaryVertices, heldBoundaryVertices: preserveBoundaries ? boundaryVertices : boundaryNeighbors.filter((n, id) => n.size && vertexStencils[id].length === 1).length, nonManifoldVertices: nonManifold.size });
    old.dispose();
  }
  geometry.userData = { ...source.userData, hairSubdivision: report };
  return geometry;
}
