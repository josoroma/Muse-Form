import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { ROOT } from './serve.mjs';
import { openBrowser, mountSVG, seekFrame } from '../skills/seven-second-storytelling/scripts/render-svg.mjs';

const manifest = JSON.parse(await readFile(resolve(ROOT, 'corpus/manifest.json')));
const requested = process.argv.slice(2);
const studies = manifest.studies.filter(s => !requested.length || requested.includes(s.id));
if (!studies.length) throw new Error('No matching studies');
const browser = await openBrowser();
await mkdir(resolve(ROOT, 'qa/hairline'), { recursive: true });
await mkdir(resolve(ROOT,'corpus/posters'),{recursive:true});
const results = [], posters = [];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function endpointDifference(page, first, last) {
  if (first.hash === last.hash) return { differentPixels: 0, fraction: 0, meanChannelDelta: 0 };
  return page.evaluate(async sources => {
    const pixels = await Promise.all(sources.map(async src => {
      const image = new Image(); image.src = src; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
      const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, canvas.width, canvas.height).data;
    }));
    let differentPixels = 0, total = 0;
    for (let i = 0; i < pixels[0].length; i += 4) {
      let changed = false;
      for (let c = 0; c < 3; c++) { const delta = Math.abs(pixels[0][i+c] - pixels[1][i+c]); total += delta; changed ||= delta !== 0; }
      if (changed) differentPixels++;
    }
    const count = pixels[0].length / 4;
    return { differentPixels, fraction: differentPixels / count, meanChannelDelta: total / (count * 3) };
  }, [first, last].map(sample => `data:image/png;base64,${sample.png.toString('base64')}`));
}
try {
  for (const study of studies) {
    const errors = [];
    const page = await mountSVG(browser, resolve(ROOT, study.animated));
    page.on('pageerror', error => errors.push(error.message));
    const structure = await page.evaluate(() => {
      const all = [...svg.querySelectorAll('*')], ids = all.map(el => el.id).filter(Boolean);
      const animations = [...svg.querySelectorAll('animate,animateTransform,animateMotion')];
      return { title: !!svg.querySelector('title'), description: !!svg.querySelector('desc'), viewBox: svg.getAttribute('viewBox'), paths: svg.querySelectorAll('path').length, nativeOnly: !svg.querySelector('image,filter,linearGradient,radialGradient,foreignObject,script,text'), duplicateIDs: ids.filter((id, i) => ids.indexOf(id) !== i), animations: animations.length, durationOK: animations.every(a => a.getAttribute('dur') === '7s' && a.getAttribute('repeatCount') === 'indefinite'), sourceEndpointsEqual: animations.every(a => { const values = a.getAttribute('values')?.split(';'); return values?.[0] === values?.at(-1); }) };
    });
    const samples = [];
    for (const time of [0, .8, 1.4, 3.5, 5.5, 6.8, 7, 2.3, 4.6, 2.3]) {
      await seekFrame(page, time);
      const png = await page.screenshot({ type: 'png' });
      samples.push({ time, hash: hash(png), png });
    }
    const still = await mountSVG(browser, resolve(ROOT, study.svg));
    const stillAnimated = await still.evaluate(() => !!svg.querySelector('animate,animateTransform,animateMotion'));
    const poster = await still.screenshot({ type: 'png' });
    await writeFile(resolve(ROOT, `corpus/posters/${study.id}.png`), poster);
    await writeFile(resolve(ROOT, `qa/hairline/${study.id}-3.5.png`), samples[3].png);
    posters.push({ title: study.title, id: study.id, data: poster.toString('base64') });
    const endpointPixels = await endpointDifference(page, samples[0], samples[6]);
    await still.close(); await page.close();
    // Chromium can retessellate a few antialiased stroke pixels after a rotation.
    // Keep that evidence: identical source poses plus a tightly bounded pixel comparison.
    const result = { id: study.id, ...structure, staticHasNoAnimation: !stillAnimated, exactEndpointPixels: samples[0].hash === samples[6].hash, endpointPixels, loopCloses: structure.sourceEndpointsEqual && endpointPixels.fraction <= .0001 && endpointPixels.meanChannelDelta <= .005, deterministicSeek: samples[7].hash === samples[9].hash, visibleMotion: samples.slice(1, 6).some(s => s.hash !== samples[0].hash), errors };
    result.pass = result.title && result.description && result.nativeOnly && !result.duplicateIDs.length && result.animations > 0 && result.durationOK && result.staticHasNoAnimation && result.loopCloses && result.deterministicSeek && result.visibleMotion && errors.length === 0;
    results.push(result);
    const sheet = await browser.newPage({ viewport: { width: 1440, height: 790 }, deviceScaleFactor: 1 });
    await sheet.setContent(`<style>body{margin:0;padding:20px;background:#e2ddd0;color:#24343b;font:14px Arial}h1{font:24px Georgia;margin:0 0 18px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}figure{margin:0}img{width:100%;display:block}figcaption{padding:5px 0}</style><h1>${study.id} · ${study.title}</h1><div class="grid">${samples.slice(0,6).map(s => `<figure><img src="data:image/png;base64,${s.png.toString('base64')}"><figcaption>${s.time.toFixed(2)} seconds</figcaption></figure>`).join('')}</div>`);
    await sheet.screenshot({ path: resolve(ROOT, `qa/hairline/${study.id}-contact.png`), fullPage: true }); await sheet.close();
    console.log(`${result.pass ? 'PASS' : 'FAIL'} ${study.id}: ${structure.paths} paths, ${structure.animations} tracks, loop ${result.loopCloses}, deterministic ${result.deterministicSeek}`);
  }
  const overview = await browser.newPage({ viewport: { width: 1600, height: 500 }, deviceScaleFactor: 1 });
  await overview.setContent(`<style>body{margin:0;padding:24px;background:#e2ddd0;color:#24343b;font:14px Arial}h1{font:32px Georgia}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}figure{margin:0}img{width:100%;display:block}figcaption{padding:10px 0;font:14px Georgia}</style><h1>SEVEN / Native contours</h1><div class="grid">${posters.map(p => `<figure><img src="data:image/png;base64,${p.data}"><figcaption>${p.id} · ${p.title}</figcaption></figure>`).join('')}</div>`);
  await overview.screenshot({ path: resolve(ROOT, requested.length ? 'qa/hairline/selected-contact.jpg' : 'qa/hairline/corpus-contact.jpg'), fullPage: true, type: 'jpeg', quality: 93 }); await overview.close();
} finally { await browser.close(); }
await writeFile(resolve(ROOT, requested.length ? 'qa/hairline/selected-checks.json' : 'qa/hairline/svg-checks.json'), JSON.stringify({ duration: 7, endpointPolicy: 'Equal source endpoint values; no more than 0.01% differing pixels and mean RGB delta <= 0.005/255. Exact pixel equality is reported separately; thin rotated strokes can have tiny browser rasterization differences.', results }, null, 2) + '\n');
if (results.some(r => !r.pass)) process.exitCode = 1;
