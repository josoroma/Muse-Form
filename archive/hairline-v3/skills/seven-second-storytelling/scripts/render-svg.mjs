import { readFile, mkdir, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

export async function openBrowser() {
  let playwright;
  try { playwright = await import('playwright-core'); }
  catch {
    try { playwright = createRequire(resolve(process.cwd(), 'package.json'))('playwright-core'); }
    catch { throw new Error('Install the pinned playwright-core version in the current project before rendering. See the skill motion reference.'); }
  }
  const candidates = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', process.env.LOCALAPPDATA && `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`].filter(Boolean);
  let executablePath;
  for (const path of candidates) { try { await access(path); executablePath = path; break; } catch {} }
  if (!executablePath) throw new Error('Chrome/Chromium not found. Set CHROME_PATH to an installed browser executable.');
  return playwright.chromium.launch({ executablePath, headless: true });
}

export async function mountSVG(browser, file, width = 1200, height = 900) {
  const markup = await readFile(file, 'utf8');
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const diagnostics = [];
  page.on('pageerror', error => diagnostics.push(error.message));
  page.on('console', message => { if (message.type() === 'error') diagnostics.push(message.text()); });
  page.svgDiagnostics = diagnostics;
  // Corpus drawings must be self-contained. Refuse all network requests during rendering.
  await page.route('**/*', route => route.abort());
  await page.setContent('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#f3eee2}svg{display:block;width:100%;height:100%}</style></head><body></body></html>');
  await page.evaluate(text => {
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    if (doc.querySelector('parsererror')) throw new Error('Malformed SVG');
    if (doc.querySelector('script,foreignObject,image')) throw new Error('Expected native, self-contained SVG paths, without scripts, foreignObject, or raster images.');
    for (const el of doc.querySelectorAll('*')) for (const attr of el.attributes) {
      if (/^on/i.test(attr.name) || (/href$/i.test(attr.name) && !attr.value.startsWith('#'))) throw new Error('Active or external SVG content is not supported.');
    }
    const svg = document.importNode(doc.documentElement, true);
    document.body.append(svg); svg.pauseAnimations(); svg.setCurrentTime(0);
    window.seek = t => { svg.pauseAnimations(); svg.setCurrentTime(Math.max(0, Math.min(7, t))); };
    window.svg = svg;
  }, markup);
  await page.evaluate(() => new Promise(requestAnimationFrame));
  if (diagnostics.length) { await page.close(); throw new Error(`SVG drawing errors: ${diagnostics.join('; ')}`); }
  return page;
}

export async function seekFrame(page, time) {
  await page.evaluate(async t => { window.seek(t); await new Promise(requestAnimationFrame); }, time);
  if (page.svgDiagnostics?.length) throw new Error(`SVG drawing errors: ${page.svgDiagnostics.join('; ')}`);
}

export async function renderSVG({ file, output, browser, width = 1200, height = 900, fps = 30, onProgress }) {
  if (!Number.isInteger(fps) || fps < 1 || fps > 120) throw new Error('fps must be an integer from 1 through 120');
  if (![width, height].every(n => Number.isInteger(n) && n > 0 && n % 2 === 0)) throw new Error('Video dimensions must be positive, even integers');
  const ownBrowser = !browser;
  browser ||= await openBrowser();
  let page, encoder;
  try {
    page = await mountSVG(browser, file, width, height);
    await mkdir(dirname(output), { recursive: true });
    encoder = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-vcodec', 'png', '-i', 'pipe:0', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-frames:v', String(7 * fps), '-movflags', '+faststart', output], { stdio: ['pipe', 'ignore', 'pipe'] });
    let errorText = ''; encoder.stderr.on('data', chunk => errorText += chunk);
    let pipeError; encoder.stdin.on('error', error => pipeError = error);
    const done = new Promise((resolve, reject) => { encoder.once('error', reject); encoder.once('close', code => code === 0 ? resolve() : reject(new Error(`FFmpeg exited ${code}: ${errorText}`))); });
    // Attach a handler immediately so an early encoder error cannot become unhandled.
    done.catch(() => {});
    for (let frame = 0; frame < 7 * fps; frame++) {
      if (pipeError) throw pipeError;
      await seekFrame(page, frame / fps);
      const pixels = await page.screenshot({ type: 'png' });
      if (!encoder.stdin.write(pixels)) await once(encoder.stdin, 'drain');
      if (frame % fps === 0) onProgress?.(frame / fps);
    }
    encoder.stdin.end(); await done;
  } catch (error) { encoder?.kill(); throw error; }
  finally { await page?.close(); if (ownBrowser) await browser.close(); }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [file, output] = process.argv.slice(2);
  if (!file || !output) { console.error('Usage: node render-svg.mjs drawing.animated.svg film.mp4'); process.exitCode = 1; }
  else { await renderSVG({ file: resolve(file), output: resolve(output) }); console.log(`Rendered exactly 210 frames / 7.000 seconds: ${output}`); }
}
