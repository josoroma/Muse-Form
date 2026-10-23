import { vectorFromMarkup } from './runtime/vector.mjs';
import { DURATION } from './runtime/timing.mjs';

const $ = id => document.getElementById(id);
const manifest = await fetch('corpus/manifest.json').then(r => { if (!r.ok) throw new Error('Corpus manifest unavailable. Run npm run catalog.'); return r.json(); }).catch(error => { $('stage').textContent = error.message; throw error; });
const studies = manifest.studies;
let scene, current, time = 0, playing = false, lastFrame, raf, selection = 0, pending;
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');

function setPlaying(value) {
  playing = Boolean(value && scene);
  $('play').innerHTML = playing ? 'Ⅱ <span>Pause</span>' : '▶ <span>Play</span>';
  $('play').setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
  cancelAnimationFrame(raf); lastFrame = undefined;
  if (playing) raf = requestAnimationFrame(tick);
}
function controlsReady(ready) {
  for (const id of ['play', 'restart', 'scrub']) $(id).disabled = !ready;
}
function seek(value) {
  time = Math.max(0, Math.min(DURATION, Number(value) || 0));
  scene?.seek(time);
  $('scrub').value = time;
  $('clock').value = `${time.toFixed(2)} / ${DURATION.toFixed(2)}`;
}
function tick(timestamp) {
  if (!playing) return;
  if (lastFrame !== undefined) {
    let next = time + Math.min((timestamp - lastFrame) / 1000, .1);
    if (next >= DURATION) {
      if ($('loop').checked) next %= DURATION;
      else { seek(DURATION); setPlaying(false); return; }
    }
    try { seek(next); }
    catch (error) { showFallback(current, error); return; }
  }
  lastFrame = timestamp; raf = requestAnimationFrame(tick);
}
function showFallback(study, error) {
  setPlaying(false); controlsReady(false);
  scene?.destroy(); scene = undefined;
  const still = new Image(); still.src = study.image; still.alt = study.title;
  const note = document.createElement('p'); note.className = 'player-error'; note.setAttribute('role', 'status');
  note.textContent = `${error.message} You can view the still or download the animated SVG below.`;
  $('stage').replaceChildren(still, note); $('stage').setAttribute('aria-busy', 'false');
}
function describe(study) {
  current = study;
  $('study-number').textContent = `STUDY ${String(studies.indexOf(study) + 1).padStart(2, '0')} / ${study.familyLabel}`;
  $('study-title').textContent = study.title;
  $('observation').textContent = study.observation;
  $('motion').textContent = study.motionCaption || (typeof study.motion === 'string' ? study.motion : study.motion.map(b => typeof b === 'string' ? b : `${b.time}: ${b.action}`).join('\n'));
  $('prompt').textContent = [study.prompt, ...[study.refinementPrompt, study.editPrompt, study.revisionPrompt, ...(study.revisionPrompts || [])].filter(Boolean).map(p => `Corrective prompt:\n${typeof p === 'string' ? p : JSON.stringify(p)}`)].join('\n\n');
  $('static-link').href = study.image; $('animated-link').href = study.rig;
  $('source-note').textContent = `Reference ${study.source} · Original interpretation. Native vector contours with a restrained five-second gesture.`;
  $('prompt-details').open = false; $('copy-status').textContent = '';
  document.querySelectorAll('.card').forEach(card => card.setAttribute('aria-pressed', String(card.dataset.id === study.id)));
}
async function select(id, updateHash = true) {
  const study = studies.find(s => s.id === id) || studies[0];
  const request = ++selection;
  pending?.abort(); pending = new AbortController();
  setPlaying(false); controlsReady(false); scene?.destroy(); scene = undefined;
  seek(0); describe(study);
  const loading = document.createElement('p'); loading.className = 'loading'; loading.textContent = 'Opening the drawing…';
  $('stage').replaceChildren(loading); $('stage').setAttribute('aria-busy', 'true');
  if (updateHash) history.replaceState(null, '', `#${study.id}`);
  let nextScene;
  try {
    const config = await fetch(study.animated, { signal: pending.signal }).then(r => { if (!r.ok) throw new Error(`Unable to open motion for ${study.id}.`); return r.text(); });
    if (request !== selection) return false;
    nextScene = vectorFromMarkup(config);
    nextScene.element.setAttribute('role','img');
    nextScene.element.setAttribute('aria-label',`${study.title}: native SVG, five-second loop`);
    if (request !== selection) { nextScene.destroy(); return false; }
    scene = nextScene; $('stage').replaceChildren(scene.element); $('stage').setAttribute('aria-busy', 'false');
    seek(0); controlsReady(true);
    if (!motionPreference.matches && !document.hidden) setPlaying(true);
    return true;
  } catch (error) {
    nextScene?.destroy();
    if (request !== selection || error.name === 'AbortError') return false;
    showFallback(study, error); return false;
  }
}
function library(filter = 'all') {
  const visible = studies.filter(s => filter === 'all' || s.family === filter);
  $('count').textContent = `${visible.length} studies`;
  $('library').replaceChildren(...visible.map(study => {
    const card = document.createElement('button'); card.className = 'card'; card.dataset.id = study.id;
    card.setAttribute('aria-pressed', String(current?.id === study.id));
    card.setAttribute('aria-label', `View ${study.title}`);
    const frame = document.createElement('div'); frame.className = 'card-image';
    const img = new Image(); img.src = study.poster || study.image; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
    const number = document.createElement('span'); number.className = 'card-number'; number.textContent = String(studies.indexOf(study) + 1).padStart(2, '0');
    frame.append(img, number);
    const title = document.createElement('span'); title.className = 'card-title';
    const name = document.createElement('span'); name.textContent = study.title;
    const duration = document.createElement('span'); duration.textContent = '05 SEC'; title.append(name, duration);
    const category = document.createElement('span'); category.className = 'card-category'; category.textContent = study.category;
    card.append(frame, title, category);
    card.addEventListener('click', async () => { if (await select(study.id)) $('stage').scrollIntoView({ behavior: motionPreference.matches ? 'instant' : 'smooth', block: 'start' }); });
    return card;
  }));
}
$('play').addEventListener('click', () => { if (time >= DURATION) seek(0); setPlaying(!playing); });
$('restart').addEventListener('click', () => seek(0));
$('scrub').addEventListener('input', e => { setPlaying(false); seek(e.target.value); });
$('copy-prompt').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('prompt').textContent); $('copy-status').textContent = 'Prompt copied.'; }
  catch { const range = document.createRange(); range.selectNodeContents($('prompt')); getSelection().removeAllRanges(); getSelection().addRange(range); $('copy-status').textContent = 'Prompt selected. Use your browser’s Copy command.'; }
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); library(button.dataset.filter);
}));
document.addEventListener('keydown', e => {
  if (/INPUT|TEXTAREA|BUTTON|A|SUMMARY/.test(e.target.tagName) || e.target.isContentEditable || !scene) return;
  if (e.code === 'Space') { e.preventDefault(); if (time >= DURATION) seek(0); setPlaying(!playing); }
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') { e.preventDefault(); setPlaying(false); seek(time + (e.code === 'ArrowLeft' ? -1 : 1) / 30); }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) setPlaying(false); });
motionPreference.addEventListener('change', () => { if (motionPreference.matches) setPlaying(false); });
addEventListener('hashchange', () => select(location.hash.slice(1), false));
window.sketchbook = { seek, select, pause: () => setPlaying(false), get time() { return time; }, get playing() { return playing; }, get id() { return current?.id; } };
library();
await select(location.hash.slice(1) || '105232', false);
