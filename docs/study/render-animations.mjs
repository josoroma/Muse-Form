/** Render documentation previews from the actual current and archived viewers. */
import { readFile, writeFile, mkdir, mkdtemp, rm, readdir } from 'node:fs/promises';
import { resolve, dirname, extname, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import http from 'node:http';
import { startServer, ROOT } from '../../scripts/serve.mjs';
import { openBrowser } from '../../scripts/browser.mjs';

const OUT = resolve(ROOT, 'docs/study/animated');
const PYTHON = process.env.STUDY_PYTHON || 'python3';
const FPS = 10, DURATION = 5, WIDTH = 480, HEIGHT = 600;
const archive = 'archive/procedural-v3/form-and-muse-threejs.zip';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const only = process.argv.find(a => a.startsWith('--only='))?.slice(7).split(',');
const requested = key => !only || only.includes(key);
await mkdir(OUT, { recursive: true });
const scratch = await mkdtemp(resolve(tmpdir(), 'muse-form-motion-docs-'));
const errors = [], failed = [];
let legacy, browser, live;
const previous = await readFile(resolve(OUT, 'sources.json'), 'utf8').then(JSON.parse).catch(() => ({ previews: [] }));
const previews = new Map(previous.previews.map(p => [p.key, p]));
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();

async function sourceFiles(folder) {
  const files = [];
  for (const e of await readdir(resolve(ROOT, folder), { withFileTypes: true })) {
    const name = `${folder}/${e.name}`;
    if (e.isDirectory()) files.push(...await sourceFiles(name));
    else if (/\.(mjs|js|html|css|glb|json)$/.test(e.name)) files.push(name);
  }
  return files;
}
const currentHashes = {};
for (const file of [...await sourceFiles('three'), ...await sourceFiles('expressions')].sort())
  currentHashes[file] = sha(await readFile(resolve(ROOT, file)));
const currentDigest = sha(JSON.stringify(currentHashes));
const archiveHash = sha(await readFile(resolve(ROOT, archive)));

async function persist() {
  const report = {
    schemaVersion: 1, capturedAt: new Date().toISOString(), repositoryHead: revision,
    method: 'Deterministic browser time samples encoded as looping GIFs. These are documentation previews, not an unpaused playback validation or generated replacement artwork.',
    processing: 'Original geometry, materials and lighting; fixed camera, selection cleared, UI overlays hidden in the capture page only. Native SVGs are sampled with their animation clock paused. GIF uses a fixed 256-color palette and 100 ms frames.',
    fps: FPS, durationSeconds: DURATION,
    reproduce: 'STUDY_PYTHON=/path/to/python-with-Pillow node docs/study/render-animations.mjs',
    sourceSets: { ...(previous.sourceSets || {}), [currentDigest]: { kind: 'current working tree', files: currentHashes }, [archiveHash]: { kind: 'preserved complete procedural bundle', path: archive, sha256: archiveHash } },
    previews: [...previews.values()].sort((a, b) => a.key.localeCompare(b.key)),
  };
  await writeFile(resolve(OUT, 'sources.json'), JSON.stringify(report, null, 2) + '\n');
}

async function saveAnimation(page, key, locator, pose, info) {
  const frames = resolve(scratch, key.replaceAll('/', '-'));
  await mkdir(frames, { recursive: true });
  const hashes = [];
  for (let frame = 0; frame < DURATION * FPS; frame++) {
    await pose(frame / FPS);
    const bytes = await locator.screenshot({ path: resolve(frames, `${String(frame).padStart(3, '0')}.png`), animations: 'allow' });
    hashes.push(sha(bytes));
  }
  await pose(DURATION);
  const endpoint = sha(await locator.screenshot({ animations: 'allow' }));
  if (new Set(hashes).size < 3) throw new Error(`${key}: no readable changing frames captured`);
  const output = resolve(OUT, `${key}.gif`);
  await mkdir(dirname(output), { recursive: true });
  execFileSync(PYTHON, [resolve(ROOT, 'docs/study/encode-animations.py'), frames, output, String(FPS)], { stdio: 'inherit' });
  const record = { key, file: relative(ROOT, output), ...info, capturedAt: new Date().toISOString(), framesSampled: hashes.length, uniqueRenderedFrames: new Set(hashes).size, sampleTimesSeconds: hashes.map((_, i) => i / FPS), frameSha256: hashes, exactEndpointPixels: endpoint === hashes[0], endpointSha256: endpoint, gifSha256: sha(await readFile(output)) };
  previews.set(key, record); await persist();
  await rm(frames, { recursive: true, force: true });
  console.log(`Captured ${key}: ${record.uniqueRenderedFrames} unique frames; exact endpoint pixels ${record.exactEndpointPixels}`);
}

try {
  live = await startServer();
  const legacyRoot = resolve(scratch, 'procedural');
  // Unpack only the runnable viewers and engine; never write into archive/.
  execFileSync(PYTHON, ['-c', 'import sys,zipfile,pathlib\nz=zipfile.ZipFile(sys.argv[1]); root=pathlib.Path(sys.argv[2]).resolve()\nfor name in z.namelist():\n if not name.startswith(("three/","expressions/")) or name.endswith("/"): continue\n p=(root/name).resolve()\n if not p.is_relative_to(root): raise ValueError(name)\n p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(z.read(name))', resolve(ROOT, archive), legacyRoot]);
  const mime = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.glb': 'model/gltf-binary' };
  legacy = http.createServer(async (req, res) => {
    try {
      let name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (name.endsWith('/')) name += 'index.html';
      const path = resolve(legacyRoot, `.${name}`);
      if (relative(legacyRoot, path).startsWith('..')) throw new Error('Outside root');
      const bytes = await readFile(path);
      res.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream' }); res.end(bytes);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(r => legacy.listen(0, '127.0.0.1', r));
  browser = await openBrowser();
  const page = await browser.newPage({ viewport: { width: 1280, height: 960 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) failed.push({ url: r.url(), status: r.status() }); });
  for (const edition of ['current', 'procedural']) {
    const base = edition === 'current' ? live.url : `http://127.0.0.1:${legacy.address().port}`;
    for (const [view, prefix, ids] of [['three', 'form', ['body','arm','hand','leg','foot']], ['expressions', 'muse', ['joy','sadness','anger','fear','surprise','disgust','wink','laughter']]]) {
      if (!ids.some(id => requested(`${edition}/${prefix}-${id}`))) continue;
      await page.goto(`${base}/${view}/`); await page.waitForFunction(() => window.atlas);
      await page.addStyleTag({ content: `#viewport{width:${WIDTH}px!important;height:${HEIGHT}px!important;min-height:0!important;max-height:none!important;border:0!important;border-radius:0!important}.scene-heading,.scene-tools,.view-status,#labels,#leaders,#fallback{display:none!important}` });
      await page.waitForTimeout(100);
      for (const id of ids) {
        const key = `${edition}/${prefix}-${id}`; if (!requested(key)) continue;
        const zoom = edition === 'current' && prefix === 'muse' ? 1.3 : 1;
        await page.evaluate(({id,zoom}) => { atlas.setStudy(id, false); atlas.selectPart(''); atlas.camera.zoom=zoom; atlas.camera.updateProjectionMatrix(); atlas.seek(0); }, {id,zoom});
        await page.waitForTimeout(80);
        const camera = await page.evaluate(() => atlas.state.camera);
        await saveAnimation(page, key, page.locator('#viewport'), t => page.evaluate(t => atlas.seek(t), t), { edition, study: id, application: prefix.toUpperCase(), route: `${view}/#${id}`, sourceSet: edition === 'current' ? currentDigest : archiveHash, size: [WIDTH, HEIGHT], camera, cameraZoom: zoom });
      }
    }
  }
  await page.setViewportSize({ width: 480, height: 360 });
  const svgIds = ['105193','105194','105195','105196','105197','105198','105199','105200','105202','105203','105214','105215','105216','105217','105218','105219','105220','105221','105222','105223'];
  for (const id of svgIds) {
    const key = `svg/${id}`; if (!requested(key)) continue;
    const path = `archive/svg-final/corpus/animated/${id}.svg`;
    await page.goto(`${live.url}/${path}`);
    await page.evaluate(() => { const svg = document.documentElement; svg.setAttribute('width','480'); svg.setAttribute('height','360'); svg.style.cssText = 'width:480px;height:360px;display:block'; svg.pauseAnimations(); svg.setCurrentTime(0); });
    // Let the new SVG viewport and paused SMIL state reach the compositor before frame zero.
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await saveAnimation(page, key, page.locator('svg'), t => page.evaluate(t => { document.documentElement.setCurrentTime(t); for (const a of document.getAnimations()) { a.pause(); a.currentTime = t * 1000; } }, t), { edition: 'final native SVG', study: id, source: path, sourceSha256: sha(await readFile(resolve(ROOT, path))), size: [480, 360] });
  }
  if (errors.length || failed.length) throw new Error(JSON.stringify({ errors, failed }));
} finally {
  await browser?.close();
  if (live) await new Promise(r => live.server.close(r));
  if (legacy) await new Promise(r => legacy.close(r));
  await rm(scratch, { recursive: true, force: true });
}
