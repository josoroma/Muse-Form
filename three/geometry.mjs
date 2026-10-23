import * as THREE from 'three';

// Shared five-second reach/flex envelope. Earlier primitive modeling helpers
// remain in archive/procedural-v3/three/geometry.mjs.
export const smooth = t => { t = THREE.MathUtils.clamp(t, 0, 1); return t * t * (3 - 2 * t); };
export function actionAt(t) {
  const p = THREE.MathUtils.euclideanModulo(t, 5) / 5;
  if (p < .13) return 0;
  if (p < .45) return smooth((p - .13) / .32);
  if (p < .61) return 1;
  return 1 - smooth((p - .61) / .32);
}
