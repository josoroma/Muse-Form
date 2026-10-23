import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = resolve(root, 'dist/pages');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

// Publish the current viewers and their local assets. Documentation links lead
// to GitHub, where the full study history and archive remain available.
for (const path of ['index.html', 'expressions', 'three', 'docs/brand', 'docs/product']) {
  await cp(resolve(root, path), resolve(output, path), { recursive: true });
}
await writeFile(resolve(output, '.nojekyll'), '');
console.log('GitHub Pages site built in dist/pages/');
