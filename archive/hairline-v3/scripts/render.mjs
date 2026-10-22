import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ROOT } from './serve.mjs';
import { openBrowser, renderSVG } from '../skills/seven-second-storytelling/scripts/render-svg.mjs';

const manifest = JSON.parse(await readFile(resolve(ROOT, 'corpus/manifest.json')));
const selection = process.argv.slice(2);
const studies = selection.length ? manifest.studies.filter(s => selection.includes(s.id)) : manifest.studies;
if (!studies.length || selection.some(id => !manifest.studies.some(s => s.id === id))) throw new Error('Use known corpus IDs, e.g. npm run render -- 105232');
const browser = await openBrowser();
try {
  const queue = [...studies];
  async function worker() {
    while (queue.length) {
      const study = queue.shift(); console.log(`Rendering ${study.id} — ${study.title}`);
      await renderSVG({ file: resolve(ROOT, study.animated), output: resolve(ROOT, study.video), browser });
      console.log(`Finished ${study.id}: 7.000s / 210 frames / 1200×900`);
    }
  }
  await Promise.all([worker(), worker()]);
} finally { await browser.close(); }
