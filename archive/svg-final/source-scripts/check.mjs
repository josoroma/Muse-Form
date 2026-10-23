import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { ROOT } from './serve.mjs';
import { DURATION } from '../runtime/timing.mjs';
import { openBrowser, mountSVG, seekFrame } from '../skills/seven-second-storytelling/scripts/render-svg.mjs';

const manifest = JSON.parse(await readFile(resolve(ROOT, 'corpus/manifest.json')));
const requested = process.argv.slice(2);
const studies = manifest.studies.filter(s => !requested.length || requested.includes(s.id));
if (!studies.length || requested.some(id => !studies.some(s => s.id === id))) throw new Error('Unknown study ID.');
const directory = resolve(ROOT, 'qa/motion-five');
await mkdir(directory, { recursive: true });
const browser = await openBrowser();
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const results = [], posters = [];

async function difference(page, first, last) {
  return page.evaluate(async sources => {
    const pixels = await Promise.all(sources.map(async source => {
      const image = new Image(); image.src = source; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
      const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, canvas.width, canvas.height).data;
    }));
    let differentPixels = 0, strongChanges = 0, inkPixels = 0, total = 0;
    for (let i = 0; i < pixels[0].length; i += 4) {
      let max = 0;
      for (let c = 0; c < 3; c++) { const d = Math.abs(pixels[0][i+c] - pixels[1][i+c]); total += d; max = Math.max(max, d); }
      if (max > 0) differentPixels++;
      const ink = Math.max(pixels[0][i], pixels[0][i+1], pixels[0][i+2], pixels[1][i], pixels[1][i+1], pixels[1][i+2]) > 38;
      if (ink) inkPixels++;
      if (ink && max >= 16) strongChanges++;
    }
    const count = pixels[0].length / 4;
    return { differentPixels, fraction: differentPixels / count, meanChannelDelta: total / (count * 3), strongChanges, inkPixels, changedInkFraction: strongChanges / Math.max(1, inkPixels) };
  }, [first, last].map(bytes => `data:image/png;base64,${bytes.toString('base64')}`));
}

try {
  for (const study of studies) {
    const page = await mountSVG(browser, resolve(ROOT, study.animated));
    const structure = await page.evaluate(() => {
      const elements = [...svg.querySelectorAll('*')], ids = elements.map(e => e.id).filter(Boolean);
      const animations = [...svg.querySelectorAll('animate,animateTransform,animateMotion')];
      const movingGeometry = animations.filter(a => /^(d|transform|points|cx|cy|r|rx|ry|x|y|x1|x2|y1|y2)$/.test(a.getAttribute('attributeName')));
      return {
        title: !!svg.querySelector('title'), description: !!svg.querySelector('desc'),
        nativeOnly: !svg.querySelector('image,filter,linearGradient,radialGradient,foreignObject,script,text'),
        duplicateIDs: ids.filter((id, i) => ids.indexOf(id) !== i), paths: svg.querySelectorAll('path').length,
        animations: animations.length, geometricTracks: movingGeometry.length,
        durationOK: animations.every(a => a.getAttribute('dur') === '5s' && a.getAttribute('repeatCount') === 'indefinite'),
        sourceEndpointsEqual: animations.every(a => { const v = a.getAttribute('values')?.split(';'); return v?.[0] === v?.at(-1); }),
        keyTimes: [...new Set(animations.flatMap(a => a.getAttribute('keyTimes').split(';').map(Number)))],
      };
    });
    const times = [...new Set([0, .5, .8, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 4.8, 5, ...structure.keyTimes.map(t => +(t * DURATION).toFixed(4))])].sort((a,b) => a-b);
    delete structure.keyTimes;
    const samples = [];
    for (const time of times) {
      await seekFrame(page, time);
      const png = await page.screenshot({ type: 'png' });
      samples.push({ time, png, hash: hash(png) });
    }
    const first = samples[0], endpoint = samples.at(-1);
    const endpointPixels = await difference(page, first.png, endpoint.png);
    await seekFrame(page, 2.3); const forward = await page.screenshot();
    await seekFrame(page, 4.7); await seekFrame(page, 2.3); const reverse = await page.screenshot();
    // Check visible change at a real 300px SVG viewport, preserving non-scaling strokes.
    const thumb = await mountSVG(browser, resolve(ROOT, study.animated), 300, 225);
    await seekFrame(thumb, 0); const thumbRest = await thumb.screenshot();
    let peak = { time: 0, changedInkFraction: 0 };
    for (const sample of samples.slice(1,-1)) {
      await seekFrame(thumb, sample.time);
      const change = await difference(thumb, thumbRest, await thumb.screenshot());
      if (change.changedInkFraction > peak.changedInkFraction) peak = { time: sample.time, ...change };
    }
    await thumb.close();
    const still = await mountSVG(browser, resolve(ROOT, study.svg));
    const stillHasNoAnimation = await still.evaluate(() => !svg.querySelector('animate,animateTransform,animateMotion'));
    const poster = await still.screenshot(); await still.close();
    posters.push({ id: study.id, title: study.title, data: poster.toString('base64') });
    const peakSample = samples.find(s => s.time === peak.time);
    await writeFile(resolve(directory, `${study.id}-peak.png`), peakSample.png);
    await writeFile(resolve(directory, `${study.id}-rest.png`), first.png);
    const result = {
      id: study.id, ...structure, stillHasNoAnimation, duration: DURATION,
      exactEndpointPixels: first.hash === endpoint.hash, endpointPixels,
      loopCloses: structure.sourceEndpointsEqual && endpointPixels.fraction <= .0001 && endpointPixels.meanChannelDelta <= .005,
      deterministicSeek: hash(forward) === hash(reverse), thumbnailMotion: peak,
      visibleGeometryMotion: structure.geometricTracks > 0 && peak.changedInkFraction >= .15 && peak.strongChanges >= 100,
      sampledTimes: times, errors: page.svgDiagnostics,
    };
    result.pass = result.title && result.description && result.nativeOnly && !result.duplicateIDs.length && result.durationOK && result.stillHasNoAnimation && result.loopCloses && result.deterministicSeek && result.visibleGeometryMotion && !result.errors.length;
    results.push(result); await page.close();
    const contactTimes = [...new Set([0, .8, 1.5, 2.5, peak.time, 3.5, 4.5, 5])].sort((a,b) => a-b);
    const sheet = await browser.newPage({ viewport: { width: 1600, height: 650 }, deviceScaleFactor: 1 });
    await sheet.setContent(`<style>body{margin:0;padding:20px;background:#e2ddd0;color:#24343b;font:14px Arial}h1{font:24px Georgia;margin:0 0 18px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}figure{margin:0}img{width:100%;display:block}figcaption{padding:6px 0}</style><h1>${study.id} · ${study.title} · FIVE SECONDS</h1><div class="grid">${contactTimes.map(t => { const s = samples.find(x => x.time === t); return `<figure><img src="data:image/png;base64,${s.png.toString('base64')}"><figcaption>${t.toFixed(2)} seconds${t === peak.time ? ' · strongest visible change' : ''}</figcaption></figure>`; }).join('')}</div>`);
    await sheet.screenshot({ path: resolve(directory, `${study.id}-contact.png`), fullPage: true }); await sheet.close();
    console.log(`${result.pass ? 'PASS' : 'FAIL'} ${study.id}: ${structure.geometricTracks} geometry tracks; ${(peak.changedInkFraction * 100).toFixed(1)}% changed ink at thumbnail; loop ${result.loopCloses}; seek ${result.deterministicSeek}`);
  }
  const page = await browser.newPage({ viewport: { width: 1600, height: 500 }, deviceScaleFactor: 1 });
  await page.setContent(`<style>body{margin:0;padding:24px;background:#e2ddd0;color:#24343b;font:14px Arial}h1{font:32px Georgia}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}figure{margin:0}img{width:100%;display:block}figcaption{padding:10px 0;font:14px Georgia}</style><h1>FIVE / Drawings in motion</h1><div class="grid">${posters.map(p => `<figure><img src="data:image/png;base64,${p.data}"><figcaption>${p.id} · ${p.title}</figcaption></figure>`).join('')}</div>`);
  await page.screenshot({ path: resolve(directory, requested.length ? 'selected-contact.jpg' : 'corpus-contact.jpg'), fullPage: true, type: 'jpeg', quality: 93 }); await page.close();
} finally { await browser.close(); }
await writeFile(resolve(directory, requested.length ? 'selected-checks.json' : 'svg-checks.json'), JSON.stringify({ duration: DURATION, motionPolicy: 'At 300x225: geometric tracks required, at least 15% of visible ink changes by 16/255 or more, and at least 100 changed pixels. This detects nearly static output; visual review still judges the action.', endpointPolicy: 'Identical source endpoints; at most 0.01% differing antialias pixels with mean RGB delta <= 0.005/255. Exact endpoint equality reported separately.', results }, null, 2) + '\n');
if (results.some(r => !r.pass)) process.exitCode = 1;
