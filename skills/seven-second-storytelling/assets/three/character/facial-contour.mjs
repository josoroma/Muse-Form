import * as THREE from 'three';

const smooth = (a, b, x) => THREE.MathUtils.smoothstep(x, a, b);

// A restrained, fixed facial sculpt in the source's native metre coordinates.
// The broad mandibular corners taper into a rounded chin; the lips, eyes and
// cranial width keep their identity. This is baked once, never scaled per frame.
function contour(x, y, z, out) {
  const front = smooth(.025, .085, z);
  const lower = smooth(1.435, 1.465, y) * (1 - smooth(1.505, 1.552, y));
  const flank = smooth(.020, .047, Math.abs(x));
  const jaw = front * lower * (.28 + .72 * flank);
  const chin = Math.exp(-(((y - 1.466) / .018) ** 2))
    * smooth(.075, .115, z) * (1 - smooth(.028, .052, Math.abs(x)));
  // Softer brow transition, restrained nasal width and a little upper-cheek
  // fullness. The same field is applied to attached eyes, brows and lashes.
  const brow = Math.exp(-(((y - 1.589) / .014) ** 2 + ((Math.abs(x) - .030) / .026) ** 2)) * smooth(.10, .134, z) * smooth(1.582, 1.588, y);
  const nose = Math.exp(-(((y - 1.535) / .022) ** 2 + (x / .023) ** 2)) * smooth(.129, .150, z);
  const nasalWidth = Math.exp(-(((y - 1.531) / .021) ** 2)) * (1 - smooth(.021, .036, Math.abs(x))) * smooth(.112, .140, z);
  const cheek = Math.exp(-(((y - 1.537) / .021) ** 2 + ((Math.abs(x) - .047) / .020) ** 2)) * smooth(.090, .128, z);
  return out.set(x * (1 - .105 * jaw - .075 * chin - .060 * nasalWidth), y + .0024 * chin + .0004 * cheek + .0006 * nose, z - .0007 * chin - .0014 * brow - .0005 * nose + .0010 * cheek);
}

export function refineFacialContour(scene) {
  const at = new THREE.Vector3(), base = new THREE.Vector3(), plus = new THREE.Vector3(), minus = new THREE.Vector3();
  const derivative = new THREE.Matrix3(), normalMatrix = new THREE.Matrix3(), normal = new THREE.Vector3(), transformedNormal = new THREE.Vector3();
  const delta = new THREE.Vector3(), targetNormal = new THREE.Vector3();
  const epsilon = .00002;
  let changedVertices = 0, maximumOffset = 0;
  scene.traverse(mesh => {
    if (!mesh.isMesh) return;
    const geometry = mesh.geometry, positions = geometry.attributes.position, normals = geometry.attributes.normal;
    const positionTargets = geometry.morphAttributes.position || [], normalTargets = geometry.morphAttributes.normal || [];
    for (let i = 0; i < positions.count; i++) {
      at.fromBufferAttribute(positions, i);
      if (at.y < 1.425 || at.y > 1.635 || at.z < .02) continue;
      contour(at.x, at.y, at.z, base);
      const offset = at.distanceTo(base); if (offset < 1e-8) continue;
      // Transport expression displacements with the local sculpt derivative.
      // Inverse-transpose normals retain the authored smooth UV seam normals.
      for (let axis = 0; axis < 3; axis++) {
        delta.copy(at); delta.setComponent(axis, delta.getComponent(axis) + epsilon);
        contour(delta.x, delta.y, delta.z, plus);
        delta.copy(at); delta.setComponent(axis, delta.getComponent(axis) - epsilon);
        contour(delta.x, delta.y, delta.z, minus);
        plus.sub(minus).multiplyScalar(.5 / epsilon);
        derivative.elements[axis * 3] = plus.x;
        derivative.elements[axis * 3 + 1] = plus.y;
        derivative.elements[axis * 3 + 2] = plus.z;
      }
      normalMatrix.copy(derivative).invert().transpose();
      if (normals) {
        normal.fromBufferAttribute(normals, i);
        transformedNormal.copy(normal).applyMatrix3(normalMatrix).normalize();
        for (const target of normalTargets) {
          targetNormal.fromBufferAttribute(target, i).add(normal).applyMatrix3(normalMatrix).normalize().sub(transformedNormal);
          target.setXYZ(i, targetNormal.x, targetNormal.y, targetNormal.z);
        }
        normals.setXYZ(i, transformedNormal.x, transformedNormal.y, transformedNormal.z);
      }
      for (const target of positionTargets) {
        delta.fromBufferAttribute(target, i).applyMatrix3(derivative);
        target.setXYZ(i, delta.x, delta.y, delta.z);
      }
      positions.setXYZ(i, base.x, base.y, base.z);
      changedVertices++; maximumOffset = Math.max(maximumOffset, offset);
    }
    positions.needsUpdate = true; if (normals) normals.needsUpdate = true;
    geometry.computeBoundingBox(); geometry.computeBoundingSphere();
  });
  scene.userData.facialContour = { changedVertices, maximumOffsetMetres: maximumOffset, method: 'Fixed soft facial contour: lower-jaw taper, rounded chin, subtle brow/nose refinement and upper-cheek fullness; transported morphs and normals' };
  return scene.userData.facialContour;
}
