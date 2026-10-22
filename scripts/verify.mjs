import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { ROOT, startServer } from './serve.mjs';
import { openBrowser } from '../skills/seven-second-storytelling/scripts/render-svg.mjs';

const manifest = JSON.parse(await readFile(resolve(ROOT, 'corpus/manifest.json')));
const results = { browser: {},  errors: [] };
const browser = await openBrowser();
const { server, url } = await startServer();
await mkdir(resolve(ROOT, 'qa/motion-five'), { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => results.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') results.errors.push(message.text()); });
  await page.goto(url); await page.waitForFunction(() => window.sketchbook?.id === '105232' && document.querySelector('#stage')?.getAttribute('aria-busy') === 'false');
  assert.equal(await page.evaluate(() => sketchbook.playing), false);
  results.browser.reducedMotionStartsPaused = true;
  assert.equal(await page.locator('.card').count(), 24);
  results.browser.all24Studies = true;
  await page.locator('[data-filter="story"]').click(); assert.equal(await page.locator('.card').count(), 4);
  await page.locator('.card[data-id="105234"]').click();
  await page.waitForFunction(() => sketchbook.id === '105234' && document.querySelector('#stage').getAttribute('aria-busy') === 'false');
  results.browser.filtersAndSelection = true;
  await page.evaluate(() => sketchbook.seek(2.3));
  const forward = await page.locator('#stage').screenshot();
  await page.evaluate(() => { sketchbook.seek(4.5); sketchbook.seek(2.3); });
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
  await page.evaluate(() => sketchbook.seek(4.9)); await page.locator('#play').click();
  await page.waitForFunction(() => sketchbook.time === 5 && !sketchbook.playing);
  results.browser.singlePassStopsAtFive = true;
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
  await page.evaluate(async () => {scrollTo(0,0);await Promise.all([...document.querySelectorAll('.card img')].map(img=>{img.loading='eager';return img.decode();}));});
  await page.screenshot({ path: resolve(ROOT, 'qa/motion-five/gallery-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: resolve(ROOT, 'qa/motion-five/gallery-mobile.png'), fullPage: true });
  results.browser.mobileNoHorizontalOverflow = true;
  for (const study of manifest.studies) {
    await page.evaluate(id => sketchbook.select(id), study.id);
    assert.equal(await page.locator('#study-title').textContent(), study.title);
    assert.equal(await page.locator('#stage svg').count(), 1);
  }
  results.browser.everyDrawingLoads = true;
  assert.equal(await page.locator('#video-link').count(), 0);
  assert.equal(await page.locator('#scrub').getAttribute('max'), '5');
  results.browser.onlySVGDownloads = true;
  const automatic = await browser.newPage({ reducedMotion: 'no-preference' });
  await automatic.goto(url);
  await automatic.waitForFunction(() => window.sketchbook?.playing && sketchbook.time > .2);
  results.browser.normalMotionAutoplays = true;
  await automatic.close();
  assert.equal(results.errors.length, 0);
} catch (error) { results.errors.push(error.stack); }
finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }

results.pass = !results.errors.length;
await writeFile(resolve(ROOT, 'qa/motion-five/verification.json'), JSON.stringify(results, null, 2) + '\n');
console.log(`SVG gallery verification: ${results.pass ? 'PASS' : 'FAIL'}`);
if (!results.pass) { console.error(results.errors); process.exitCode = 1; }
