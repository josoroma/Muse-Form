import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { ROOT } from './serve.mjs';
import { openBrowser, mountSVG } from '../skills/seven-second-storytelling/scripts/render-svg.mjs';
const manifest = JSON.parse(await readFile(resolve(ROOT, 'corpus/manifest.json')));
const directory = resolve(ROOT, 'qa/motion-five');
await mkdir(directory, { recursive: true });
const browser = await openBrowser();
const queue = [...manifest.studies], results = [];
const hash = b => createHash('sha256').update(b).digest('hex');
try {
  async function worker() {
    while (queue.length) {
      const study = queue.shift();
      const page = await mountSVG(browser, resolve(ROOT, study.animated), 400, 300);
      const samples = [];
      await page.evaluate(() => { svg.setCurrentTime(0); svg.unpauseAnimations(); });
      for (const target of [0, .6, 1.2, 1.8, 2.4, 3, 3.6, 4.2, 4.8, 5.3]) {
        await page.waitForFunction(t => svg.getCurrentTime() >= t, target);
        const png = await page.screenshot();
        const actual = await page.evaluate(() => svg.getCurrentTime());
        samples.push({ actual, hash: hash(png), png });
      }
      const running = await page.evaluate(() => !svg.animationsPaused());
      const result = { id: study.id, naturallyRunning: running, timeSamples: samples.map(s => +s.actual.toFixed(3)), distinctFrames: new Set(samples.map(s => s.hash)).size, crossesFiveSecondBoundary: samples.at(-1).actual >= 5.3, scope: 'Observed automatic SVG playback through sampled screenshots; no repeated seeking between samples.' };
      result.pass = running && result.distinctFrames >= 5 && result.crossesFiveSecondBoundary;
      results.push(result); await page.close();
      const contact = await browser.newPage({ viewport: { width: 1600, height: 750 }, deviceScaleFactor: 1 });
      await contact.setContent(`<style>body{margin:0;padding:20px;background:#e2ddd0;color:#24343b;font:14px Arial}h1{font:22px Georgia}.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}figure{margin:0}img{display:block;width:100%}figcaption{padding:6px 0}</style><h1>${study.id} · automatic playback, crossing the five-second loop</h1><div class="grid">${samples.map(s => `<figure><img src="data:image/png;base64,${s.png.toString('base64')}"><figcaption>${s.actual.toFixed(2)} seconds elapsed</figcaption></figure>`).join('')}</div>`);
      await contact.screenshot({ path: resolve(directory, `${study.id}-playback.png`), fullPage: true }); await contact.close();
      console.log(`${result.pass ? 'PASS' : 'FAIL'} ${study.id}: automatic motion, ${result.distinctFrames} distinct sampled frames, crosses loop boundary`);
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()]);
} finally { await browser.close(); }
results.sort((a,b) => a.id.localeCompare(b.id));
await writeFile(resolve(directory, 'playback.json'), JSON.stringify({ duration: 5, results, pass: results.length === 24 && results.every(r => r.pass) }, null, 2) + '\n');
if (results.some(r => !r.pass)) process.exitCode = 1;
