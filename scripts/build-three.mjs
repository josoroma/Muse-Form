import { mkdir, cp, copyFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ROOT } from './serve.mjs';

const source = resolve(ROOT, 'node_modules/three'), dest = resolve(ROOT, 'three/vendor');
await mkdir(resolve(dest, 'addons/controls'), { recursive: true });
for (const file of ['three.module.js', 'three.core.js']) await copyFile(resolve(source, 'build', file), resolve(dest, file));
await copyFile(resolve(source, 'examples/jsm/controls/OrbitControls.js'), resolve(dest, 'addons/controls/OrbitControls.js'));
for (const file of ['loaders/GLTFLoader.js', 'utils/SkeletonUtils.js', 'utils/BufferGeometryUtils.js']) {
  await mkdir(resolve(dest, 'addons', file, '..'), { recursive: true });
  await copyFile(resolve(source, 'examples/jsm', file), resolve(dest, 'addons', file));
}
await copyFile(resolve(source, 'LICENSE'), resolve(dest, 'LICENSE'));
console.log(`Prepared local Three.js ${JSON.parse(await readFile(resolve(source, 'package.json'))).version}; the explorer makes no external asset requests.`);
