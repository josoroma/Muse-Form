import * as THREE from 'three';

/** Local studio illumination: broad reflected softboxes, a warm key and cool rim.
 * The environment is rendered from native geometry; no remote HDR or image plate.
 */
export function createPortraitStudio(renderer, scene) {
  const room = new THREE.Scene();
  room.background = new THREE.Color(0x3b3836);
  const panels = [];
  function softbox(position, size, color, brightness) {
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(...size),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(brightness), side: THREE.DoubleSide })
    );
    panel.position.fromArray(position); panel.lookAt(0, 0, 0); room.add(panel); panels.push(panel);
  }
  softbox([-4, 4, 6], [4, 6], 0xfff1e7, 2.8);
  softbox([5, 1, 5], [4, 6], 0xeef0f1, 1.8);
  softbox([1, 5, -4], [3, 5], 0xffd7ad, 2.7);
  softbox([0, 7, 0], [4, 4], 0xf5f0e9, 1.2);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, .035, .1, 40, { size: 256 });
  scene.environment = environment.texture;
  scene.environmentIntensity = .72;
  panels.forEach(p => { p.geometry.dispose(); p.material.dispose(); });
  pmrem.dispose();

  // Neutral-warm reflected light keeps the jaw and lip surround from acquiring
  // a gray-purple cast. The broad fill still preserves cheek and nose volume.
  scene.add(new THREE.HemisphereLight(0xf7eee7, 0x8b7770, .58));
  const key = new THREE.DirectionalLight(0xffeee3, 1.95);
  key.position.set(-4.5, 7, 8); key.target.position.set(0, 3.4, 0);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -3.5, right: 3.5, top: 3.5, bottom: -3.5, near: .5, far: 22 });
  key.shadow.normalBias = .012; key.shadow.bias = -.00005;
  key.shadow.radius = 3;
  scene.add(key, key.target);
  const fill = new THREE.DirectionalLight(0xeef0f2, 1.0);
  fill.position.set(5, 4.5, 6); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffdbba, 1.7);
  rim.position.set(3.5, 6, -5); scene.add(rim);
  return { environment, key, fill, rim };
}
