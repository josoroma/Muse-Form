import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import * as THREE from 'three';
import { subdivideHairGeometry } from '../three/character/subdivide-hair.mjs';

// A closed octahedron with one duplicated seam vertex exercises geometric
// welding without collapsing separate texture coordinates.
const source = new THREE.BufferGeometry();
const positions = [1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1,1,0,0];
source.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
source.setAttribute('normal', new THREE.Float32BufferAttribute(positions, 3));
source.setAttribute('uv', new THREE.Float32BufferAttribute([0,0,0,0,0,1,0,0,0,0,0,0,1,0], 2));
source.setIndex([0,2,4,2,1,4,1,3,4,3,0,4,2,6,5,1,2,5,3,1,5,0,3,5]);
source.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(Array.from({length:7},()=>[0,1,2,3]).flat(), 4));
source.setAttribute('skinWeight', new THREE.Float32BufferAttribute(Array.from({length:7},()=>[.1,.2,.3,.4]).flat(), 4));
source.morphAttributes.position = [new THREE.Float32BufferAttribute(Array.from({length:7},()=>[0,.1,0]).flat(), 3)];
source.morphTargetsRelative = true;
const original = Array.from(source.attributes.position.array);
const result = subdivideHairGeometry(source, {iterations:2,strength:.65,preserveBoundaries:false});
assert.deepEqual(Array.from(source.attributes.position.array), original, 'source geometry was mutated');
assert.equal(result.index.count, source.index.count * 16, 'each triangle must split into four per pass');
assert.ok(result.attributes.position.getX(0) < .95, 'true Loop weights must smooth the original surface');
for(let k=0;k<3;k++) assert.equal(result.attributes.position.getComponent(0,k), result.attributes.position.getComponent(6,k), 'welded geometry seam diverged');
assert.equal(result.attributes.uv.getX(0), 0); assert.equal(result.attributes.uv.getX(6), 1);
let maxWeightError = 0;
for(let i=0;i<result.attributes.position.count;i++) {
  const a = result.attributes.skinWeight;
  maxWeightError = Math.max(maxWeightError, Math.abs(a.getX(i)+a.getY(i)+a.getZ(i)+a.getW(i)-1));
  assert.ok(Math.abs(result.morphAttributes.position[0].getY(i)-.1) < 2e-8, 'constant relative morph drifted');
}
assert.ok(maxWeightError < 1e-6, 'skin weights must normalize');
const card = new THREE.PlaneGeometry(1,1), pinned = subdivideHairGeometry(card,{iterations:2});
for(let i=0;i<card.attributes.position.count;i++)for(let k=0;k<3;k++)assert.equal(card.attributes.position.getComponent(i,k),pinned.attributes.position.getComponent(i,k),'pinned card boundary moved');
assert.throws(()=>subdivideHairGeometry(source,{strength:NaN}),RangeError);
const report={pass:true,trueLoopSmoothing:true,sourceUntouched:true,uvSeamsPreserved:true,relativeMorphPreserved:true,cardBoundaryPinned:true,maxWeightError,...result.userData.hairSubdivision};
await mkdir(new URL('../qa/character/subdivision/',import.meta.url),{recursive:true});
await writeFile(new URL('../qa/character/subdivision/synthetic-checks.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log('PASS hair subdivision: Loop smoothing, UV seam continuity, fixed card boundaries, morph deltas and normalized skin weights.');
