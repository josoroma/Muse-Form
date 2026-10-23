import * as THREE from 'three';

export const stone = 0x899b9b;
export const material = (color = stone) => new THREE.MeshStandardMaterial({ color, roughness: .68, metalness: .12 });
export const smooth = t => { t = THREE.MathUtils.clamp(t, 0, 1); return t * t * (3 - 2 * t); };
export function actionAt(t) {
  const p = THREE.MathUtils.euclideanModulo(t, 5) / 5;
  if (p < .13) return 0;
  if (p < .45) return smooth((p - .13) / .32);
  if (p < .61) return 1;
  return 1 - smooth((p - .61) / .32);
}
export function anchor(parent, position) {
  const a = new THREE.Object3D(); a.position.fromArray(position); parent.add(a); return a;
}
export function ellipsoid(parent, center, scale, mat = material()) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), mat);
  mesh.position.fromArray(center); mesh.scale.fromArray(scale);
  mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
export function curve(parent, points, color = 0x374747, radius = .011) {
  const geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), 40, radius, 5, false);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: .85 }));
  mesh.userData.detail = true; parent.add(mesh); return mesh;
}
export function register(parts, id, name, description, object, point) {
  object.traverse(child => { if (child.isMesh && !child.userData.detail) child.userData.partId = id; });
  const part = { id, name, description, object, anchor: anchor(object, point) };
  parts.push(part); return part;
}

/** A continuous loft with shared vertex normals, split only into semantic surface regions. */
export function surfaceRegions({ rings = 64, sides = 64, sample, region, colors = {} }) {
  const positions = [], indices = [], faceRegions = [];
  for (let j = 0; j <= rings; j++) for (let i = 0; i <= sides; i++) positions.push(...sample(j / rings, i / sides * Math.PI * 2));
  for (let j = 0; j < rings; j++) for (let i = 0; i < sides; i++) {
    const a = j * (sides + 1) + i, b = a + sides + 1;
    indices.push(a, b, a + 1, b, b + 1, a + 1);
    faceRegions.push(region((j + .5) / rings, (i + .5) / sides * Math.PI * 2));
  }
  const whole = new THREE.BufferGeometry();
  whole.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); whole.setIndex(indices); whole.computeVertexNormals();
  const normals = whole.getAttribute('normal').array;
  const data = new Map();
  faceRegions.forEach((id, q) => {
    if (!data.has(id)) data.set(id, { pos: [], norm: [] });
    const d = data.get(id);
    for (let k = q * 6; k < q * 6 + 6; k++) {
      const vertex = indices[k] * 3;
      d.pos.push(...positions.slice(vertex, vertex + 3)); d.norm.push(...normals.slice(vertex, vertex + 3));
    }
  });
  whole.dispose();
  const group = new THREE.Group(), meshes = {};
  for (const [id, d] of data) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(d.pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(d.norm, 3));
    const mesh = new THREE.Mesh(geo, material(colors[id])); mesh.castShadow = mesh.receiveShadow = true;
    mesh.userData.partId = id; mesh.userData.restPositions = Float32Array.from(d.pos); mesh.userData.restNormals = Float32Array.from(d.norm);
    group.add(mesh); meshes[id] = mesh;
  }
  return { group, meshes };
}

export function interpolateProfile(points, t) {
  const n = points.length - 1, u = THREE.MathUtils.clamp(t, 0, 1) * n;
  const i = Math.min(Math.floor(u), n - 1), f = u - i;
  // A smooth derivative crosses each measuring ring; easing every span creates false ridges.
  return points[i].map((v, k) => {
    const p = points[Math.max(0, i - 1)][k], next = points[i + 1][k], q = points[Math.min(n, i + 2)][k];
    const m0 = (next - p) * .5, m1 = (q - v) * .5;
    return (2*f*f*f-3*f*f+1)*v + (f*f*f-2*f*f+f)*m0 + (-2*f*f*f+3*f*f)*next + (f*f*f-f*f)*m1;
  });
}
