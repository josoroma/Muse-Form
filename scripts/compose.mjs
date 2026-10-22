import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ROOT } from './serve.mjs';
import { DURATION } from '../runtime/timing.mjs';

const entries = [];
for (const file of await readdir(resolve(ROOT, 'corpus/hairline'))) {
  if (file.endsWith('.json')) entries.push(...JSON.parse(await readFile(resolve(ROOT, 'corpus/hairline', file))));
}
const requested = process.argv.slice(2);
if (requested.some(id => !entries.some(e => e.id === id))) throw new Error('Unknown study ID.');
await mkdir(resolve(ROOT, 'corpus/animated'), { recursive: true });
const escapeAttribute = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const topology = value => value.match(/[a-df-zA-DF-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g)?.map(t => /^[a-z]$/i.test(t) ? t : '#').join(' ');

for (const entry of entries) {
  if (requested.length && !requested.includes(entry.id)) continue;
  let svg = await readFile(resolve(ROOT, entry.svg || `corpus/svg/${entry.id}.svg`), 'utf8');
  if (/<(?:image|filter|linearGradient|radialGradient|foreignObject|script|text|animate)\b/.test(svg)) throw new Error(`${entry.id}: expected static native geometry.`);
  if (!entry.animations?.length) throw new Error(`${entry.id}: author explicit visible motion; no fallback pulse.`);
  const targets = new Set();
  for (const track of entry.animations) {
    const attribute = track.attribute || 'transform';
    const values = track.values.map(String);
    const times = track.keyTimes || [0, .5, 1];
    const key = `${track.target}:${attribute}`;
    if (targets.has(key)) throw new Error(`${entry.id}: competing tracks on ${key}; use nested groups.`);
    targets.add(key);
    if (values.length !== times.length || times[0] !== 0 || times.at(-1) !== 1 || times.some((t, i) => i && t <= times[i-1])) throw new Error(`${entry.id}: invalid key times for ${key}.`);
    if (values[0] !== values.at(-1)) throw new Error(`${entry.id}: open loop for ${key}.`);
    if (attribute === 'd' && values.some(v => topology(v) !== topology(values[0]))) throw new Error(`${entry.id}: mismatched path topology for ${key}.`);
    const tag = track.type ? 'animateTransform' : 'animate';
    const mode = track.calcMode || 'spline';
    const splines = track.keySplines || times.slice(1).map(() => '.42 0 .58 1');
    const child = `<${tag} attributeName="${attribute}"${track.type ? ` type="${track.type}"` : ''} dur="${DURATION}s" repeatCount="indefinite" calcMode="${mode}" keyTimes="${times.join(';')}"${mode === 'spline' ? ` keySplines="${splines.join(';')}"` : ''} values="${escapeAttribute(values.join(';'))}"/>`;
    const target = new RegExp(`(<(?:g|path|circle|ellipse|line|polyline|polygon|rect)\\b[^>]*\\bid=["']${escapeRegex(track.target)}["'][^>]*?)(/?>)`);
    const match = svg.match(target);
    if (!match) throw new Error(`${entry.id}: missing target ${track.target}.`);
    const elementName = match[0].match(/^<(\w+)/)[1];
    svg = svg.replace(target, (_, open, end) => end === '/>' ? `${open}>${child}</${elementName}>` : `${open}>${child}`);
  }
  await writeFile(resolve(ROOT, `corpus/animated/${entry.id}.svg`), svg);
  console.log(`${entry.id}: ${entry.animations.length} authored tracks, ${DURATION}-second loop`);
}
