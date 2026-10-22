const $ = id => document.getElementById(id);
const manifest = await fetch('corpus/manifest.json').then(r => { if (!r.ok) throw new Error('Corpus manifest unavailable. Run npm run catalog.'); return r.json(); }).catch(error => { $('stage').textContent = error.message; throw error; });
const studies = manifest.studies;
let svg, current, time = 0, playing = false, lastFrame, raf, selection = 0;
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
function setPlaying(value) {
  playing = Boolean(value && svg);
  $('play').innerHTML = playing ? 'Ⅱ <span>Pause</span>' : '▶ <span>Play</span>';
  $('play').setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
  cancelAnimationFrame(raf); lastFrame = undefined;
  if (playing) raf = requestAnimationFrame(tick);
}
function seek(value) {
  time = Math.max(0, Math.min(7, Number(value) || 0));
  svg?.setCurrentTime(time);
  $('scrub').value = time;
  $('clock').value = `${time.toFixed(2)} / 7.00`;
}
function tick(timestamp) {
  if (!playing) return;
  if (lastFrame !== undefined) {
    let next = time + Math.min((timestamp - lastFrame) / 1000, .1);
    if (next >= 7) {
      if ($('loop').checked) next %= 7;
      else { seek(7); setPlaying(false); return; }
    }
    seek(next);
  }
  lastFrame = timestamp; raf = requestAnimationFrame(tick);
}
async function select(id, updateHash = true) {
  const study = studies.find(s => s.id === id) || studies[0];
  const request = ++selection;
  setPlaying(false); $('play').disabled = true;
  const markup = await fetch(study.animated).then(r => { if (!r.ok) throw new Error(`Unable to open ${study.id}`); return r.text(); });
  if (request !== selection) return;
  const doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
  if (doc.querySelector('parsererror')) throw new Error('SVG parsing failed');
  svg = document.importNode(doc.documentElement, true);
  $('stage').replaceChildren(svg); svg.pauseAnimations(); seek(0);
  current = study; $('play').disabled = false;
  $('study-number').textContent = `STUDY ${String(studies.indexOf(study) + 1).padStart(2, '0')} / ${study.familyLabel}`;
  $('study-title').textContent = study.title;
  $('observation').textContent = study.observation;
  $('motion').textContent = typeof study.motion === 'string' ? study.motion : study.motion.map(b => typeof b === 'string' ? b : `${b.time}: ${b.action}`).join('\n');
  $('prompt').textContent = study.prompt;
  $('static-link').href = study.svg; $('animated-link').href = study.animated; $('video-link').href = study.video;
  $('source-note').textContent = `Reference ${study.source} · Original interpretation. Native paths, editable groups, no raster images.`;
  $('prompt-details').open = false; $('copy-status').textContent = '';
  document.querySelectorAll('.card').forEach(card => card.setAttribute('aria-pressed', String(card.dataset.id === study.id)));
  if (updateHash) history.replaceState(null, '', `#${study.id}`);
}
function library(filter = 'all') {
  const visible = studies.filter(s => filter === 'all' || s.family === filter);
  $('count').textContent = `${visible.length} studies`;
  $('library').replaceChildren(...visible.map(study => {
    const card = document.createElement('button'); card.className = 'card'; card.dataset.id = study.id;
    card.setAttribute('aria-pressed', String(current?.id === study.id));
    card.setAttribute('aria-label', `View ${study.title}`);
    const frame = document.createElement('div'); frame.className = 'card-image';
    const img = new Image(); img.src = study.svg; img.alt = ''; img.loading = 'lazy';
    const number = document.createElement('span'); number.className = 'card-number'; number.textContent = String(studies.indexOf(study) + 1).padStart(2, '0');
    frame.append(img, number);
    const title = document.createElement('span'); title.className = 'card-title';
    const name = document.createElement('span'); name.textContent = study.title;
    const duration = document.createElement('span'); duration.textContent = '07 SEC'; title.append(name, duration);
    const category = document.createElement('span'); category.className = 'card-category'; category.textContent = study.category;
    card.append(frame, title, category);
    card.addEventListener('click', async () => { await select(study.id); $('stage').scrollIntoView({ behavior: motionPreference.matches ? 'instant' : 'smooth', block: 'start' }); });
    return card;
  }));
}
$('play').addEventListener('click', () => { if (time >= 7) seek(0); setPlaying(!playing); });
$('restart').addEventListener('click', () => seek(0));
$('scrub').addEventListener('input', e => { setPlaying(false); seek(e.target.value); });
$('copy-prompt').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(current.prompt); $('copy-status').textContent = 'Prompt copied.'; }
  catch { const range = document.createRange(); range.selectNodeContents($('prompt')); getSelection().removeAllRanges(); getSelection().addRange(range); $('copy-status').textContent = 'Prompt selected. Use your browser’s Copy command.'; }
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); library(button.dataset.filter);
}));
document.addEventListener('keydown', e => {
  if (/INPUT|TEXTAREA|BUTTON|A|SUMMARY/.test(e.target.tagName) || e.target.isContentEditable) return;
  if (e.code === 'Space') { e.preventDefault(); if (time >= 7) seek(0); setPlaying(!playing); }
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') { e.preventDefault(); setPlaying(false); seek(time + (e.code === 'ArrowLeft' ? -1 : 1) / 30); }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) setPlaying(false); });
motionPreference.addEventListener('change', () => { if (motionPreference.matches) setPlaying(false); });
addEventListener('hashchange', () => select(location.hash.slice(1), false));
window.sketchbook = { seek, select, pause: () => setPlaying(false), get time() { return time; }, get playing() { return playing; }, get id() { return current?.id; } };
library();
await select(location.hash.slice(1) || '105232', false);
