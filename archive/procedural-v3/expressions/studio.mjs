import * as THREE from 'three';

/** Local studio illumination: broad reflected softboxes, a warm key and cool rim.
 * The environment is rendered from native geometry; no remote HDR or image plate.
 */
export function createPortraitStudio(renderer, scene) {
  const room = new THREE.Scene();
  room.background = new THREE.Color(0x343139);
  const panels = [];
  function softbox(position, size, color, brightness) {
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(...size),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(brightness), side: THREE.DoubleSide })
    );
    panel.position.fromArray(position); panel.lookAt(0, 0, 0); room.add(panel); panels.push(panel);
  }
  softbox([-4, 4, 6], [4, 6], 0xffe9d9, 3.1);
  softbox([5, 1, 5], [3, 5], 0xdce8f2, 1.4);
  softbox([1, 5, -4], [3, 5], 0xffd7ad, 2.7);
  softbox([0, 7, 0], [4, 4], 0xf5f0e9, 1.2);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, .035, .1, 40, { size: 256 });
  scene.environment = environment.texture;
  scene.environmentIntensity = .65;
  panels.forEach(p => { p.geometry.dispose(); p.material.dispose(); });
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xf7e8df, 0x665463, .5));
  const key = new THREE.DirectionalLight(0xffe4d1, 2.35);
  key.position.set(-4.5, 7, 8); key.target.position.set(0, 3.4, 0);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -3.5, right: 3.5, top: 3.5, bottom: -3.5, near: .5, far: 22 });
  key.shadow.normalBias = .012; key.shadow.bias = -.00005;
  key.shadow.radius = 3;
  scene.add(key, key.target);
  const fill = new THREE.DirectionalLight(0xdce6f0, .8);
  fill.position.set(5, 4.5, 6); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffc993, 2.2);
  rim.position.set(3.5, 6, -5); scene.add(rim);
  return { environment, key, fill, rim };
}
