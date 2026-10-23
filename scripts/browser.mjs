import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

export async function openBrowser() {
  let playwright;
  try { playwright = await import('playwright-core'); }
  catch {
    try { playwright = createRequire(resolve(process.cwd(), 'package.json'))('playwright-core'); }
    catch { throw new Error('Install the pinned playwright-core version in the current project before rendering. Run npm ci in the project root.'); }
  }
  const candidates = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', process.env.LOCALAPPDATA && `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`].filter(Boolean);
  let executablePath;
  for (const path of candidates) { try { await access(path); executablePath = path; break; } catch {} }
  if (!executablePath) throw new Error('Chrome/Chromium not found. Set CHROME_PATH to an installed browser executable.');
  return playwright.chromium.launch({ executablePath, headless: true });
}
