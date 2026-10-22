import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { ROOT, startServer } from './serve.mjs';
import { openBrowser } from '../skills/seven-second-storytelling/scripts/render-svg.mjs';

const exec = promisify(execFile);
const uiOnly = process.argv.includes('--ui-only');
const manifest = JSON.parse(await readFile(resolve(ROOT, 'corpus/manifest.json')));
const results = { browser: {}, videos: [], errors: [] };
const browser = await openBrowser();
const { server, url } = await startServer();
await mkdir(resolve(ROOT, 'qa'), { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => results.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') results.errors.push(message.text()); });
  await page.goto(url); await page.waitForFunction(() => window.sketchbook?.id === '105232');
  assert.equal(await page.evaluate(() => sketchbook.playing), false);
  results.browser.reducedMotionStartsPaused = true;
  assert.equal(await page.locator('.card').count(), 24);
  results.browser.all24Studies = true;
  await page.locator('[data-filter="story"]').click(); assert.equal(await page.locator('.card').count(), 4);
  await page.locator('.card[data-id="105234"]').click();
  await page.waitForFunction(() => sketchbook.id === '105234');
  results.browser.filtersAndSelection = true;
  await page.evaluate(() => sketchbook.seek(2.3));
  const forward = await page.locator('#stage').screenshot();
  await page.evaluate(() => { sketchbook.seek(6.5); sketchbook.seek(2.3); });
  const backward = await page.locator('#stage').screenshot();
  assert.equal(forward.equals(backward), true); results.browser.reverseSeek = true;
  await page.locator('#play').click();
  await page.waitForFunction(() => sketchbook.time > 2.4);
  await page.locator('#play').click();
  const paused = await page.evaluate(() => sketchbook.time);
  await page.waitForTimeout(160); assert.equal(await page.evaluate(() => sketchbook.time), paused);
  results.browser.playPause = true;
  await page.locator('#restart').click(); assert.equal(await page.evaluate(() => sketchbook.time), 0);
  results.browser.restart = true;
  await page.locator('#loop').uncheck();
  await page.evaluate(() => sketchbook.seek(6.9)); await page.locator('#play').click();
  await page.waitForFunction(() => sketchbook.time === 7 && !sketchbook.playing);
  results.browser.singlePassStopsAtSeven = true;
  await page.locator('#loop').check();
  await page.locator('h1').click(); await page.keyboard.press('Space');
  await page.waitForFunction(() => sketchbook.playing && sketchbook.time < 1);
  await page.keyboard.press('Space'); assert.equal(await page.evaluate(() => sketchbook.playing), false);
  const beforeStep = await page.evaluate(() => sketchbook.time);
  await page.keyboard.press('ArrowRight');
  assert(Math.abs((await page.evaluate(() => sketchbook.time)) - beforeStep - 1/30) < 1e-6);
  results.browser.keyboardPlaybackAndStep = true;
  await page.evaluate(async () => { await sketchbook.select('105232'); sketchbook.seek(0); });
  await page.locator('[data-filter="all"]').click();
  await page.evaluate(() => scrollTo(0,0));
  await page.screenshot({ path: resolve(ROOT, 'qa/gallery-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: resolve(ROOT, 'qa/gallery-mobile.png'), fullPage: true });
  results.browser.mobileNoHorizontalOverflow = true;
  for (const study of manifest.studies) {
    await page.evaluate(id => sketchbook.select(id), study.id);
    assert.equal(await page.locator('#study-title').textContent(), study.title);
    assert.equal(await page.locator('#stage svg').count(), 1);
  }
  results.browser.everyDrawingLoads = true;
  assert.equal(results.errors.length, 0);
} catch (error) { results.errors.push(error.stack); }
finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }

for (const study of uiOnly ? [] : manifest.studies) {
  try {
    const file = resolve(ROOT, study.video);
    const { stdout } = await exec('ffprobe', ['-v','error','-select_streams','v:0','-show_entries','stream=width,height,r_frame_rate,nb_frames,codec_name:format=duration','-of','json',file]);
    const media = JSON.parse(stdout), stream = media.streams[0];
    const pass = Number(media.format.duration) === 7 && stream.width === 1200 && stream.height === 900 && stream.r_frame_rate === '30/1' && Number(stream.nb_frames) === 210 && stream.codec_name === 'h264';
    const decoded = resolve(ROOT, `qa/${study.id}-decoded.png`);
    await exec('ffmpeg', ['-hide_banner','-loglevel','error','-y','-ss','3.5','-i',file,'-frames:v','1',decoded]);
    const { stderr } = await exec('ffmpeg', ['-hide_banner','-i',decoded,'-i',resolve(ROOT,`qa/${study.id}-3.5.png`),'-lavfi','ssim','-frames:v','1','-f','null','-']);
    const ssim = Number(stderr.match(/All:([\d.]+)/)?.[1]);
    const matchesPreview = Number.isFinite(ssim) && ssim > .95;
    const result = { id: study.id, ...stream, duration: Number(media.format.duration), previewSSIM: ssim, encodedFrameMatchesPreview: matchesPreview, pass: pass && matchesPreview };
    results.videos.push(result);
    console.log(`${result.pass ? 'PASS' : 'FAIL'} ${study.id}: ${result.duration}s, ${stream.nb_frames} frames, preview SSIM ${ssim}`);
  } catch (error) { results.videos.push({ id: study.id, pass: false, error: error.message }); }
}
results.pass = !results.errors.length && (uiOnly || (results.videos.length === 24 && results.videos.every(v => v.pass)));
await writeFile(resolve(ROOT, uiOnly ? 'qa/ui-verification.json' : 'qa/verification.json'), JSON.stringify(results, null, 2) + '\n');
console.log(`Gallery and video verification: ${results.pass ? 'PASS' : 'FAIL'}`);
if (!results.pass) { console.error(results.errors); process.exitCode = 1; }
