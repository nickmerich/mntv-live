/* MNTv Live prototype v2 · five-knob deck · demo data only */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const W = 1600, H = 900, PW = 440, PH = 960;

/* ---------------- data ---------------- */
const PAL = {
  p: ['#3a1f4a', '#1d1a24', '#5a2a66', 'rgba(239,149,255,.34)', '#ef95ff'],
  c: ['#163040', '#141218', '#1c4a5e', 'rgba(42,212,252,.30)', '#2ad4fc'],
  m: ['#163a30', '#141218', '#1d5a48', 'rgba(25,255,184,.28)', '#19ffb8'],
  r: ['#4a1f3f', '#141218', '#6a2a5a', 'rgba(255,117,216,.34)', '#ff75d8'],
  y: ['#3d3416', '#141218', '#5c4c1c', 'rgba(255,224,102,.28)', '#ffe066'],
};
const M = [
  { id: 'theo', role: 'founder', co: 'roadie · touring app', k: 'c', grind: 'pitch deck', gl: 1420, drop: { len: 58, win: 'first 500 artists on the roadie beta', stuck: 'venue data is a mess', ask: 'know a booking agent who would test it?' } },
  { id: 'jules', role: 'artist', co: 'singer · songwriter', k: 'm', grind: 'finishing a hook', gl: 610, drop: { len: 60, win: 'new single crossed 100k streams', stuck: 'my live set still feels thin', ask: 'who has run a laptop-only live rig?' } },
  { id: 'maya', role: 'artist', co: 'producer · beats · sync', k: 'p', grind: 'stems for a sync pitch', gl: 2280, drop: { len: 52, win: 'placed a beat with a sync house', stuck: 'pricing my stems', ask: 'how do you price sync under 10k?' } },
  { id: 'ren', role: 'founder', co: 'fanclub · fan app', k: 'r', grind: null, drop: null },
  { id: 'kai', role: 'tech', co: 'creative technologist · live visuals', k: 'c', grind: 'shader for a 2k-cap show', gl: 1730, drop: { len: 41, win: 'shipped visuals for a 2k-cap show', stuck: 'need an artist to pilot v2', ask: 'any artist want custom visuals, free?' } },
  { id: 'ari', role: 'artist', co: 'rapper · pittsburgh', k: 'm', grind: 'verse 2', gl: 840, drop: { len: 47, win: 'sold out a 300-cap room', stuck: 'merch cash flow', ask: 'who prints merch on consignment?' } },
  { id: 'dev', role: 'founder', co: 'stems marketplace', k: 'p', grind: 'investor update', gl: 1190, drop: null },
  { id: 'lux', role: 'artist', co: 'dj · producer', k: 'r', grind: 'tour routing', gl: 2900, drop: { len: 55, win: 'first residency booked', stuck: 'saying no to bad gigs', ask: 'how did you set your floor rate?' } },
  { id: 'nova', role: 'founder', co: 'ticketing for small rooms', k: 'y', grind: 'onboarding flow', gl: 1600, drop: { len: 60, win: '40 venues signed', stuck: 'artists ignore our emails', ask: 'intro to 3 artists who tour small rooms?' } },
  { id: 'sol', role: 'artist', co: 'producer · film', k: 'c', grind: null, drop: { len: 49, win: 'scored my first short film', stuck: 'too many unfinished ideas', ask: 'want to co-write one track this month?' } },
  { id: 'bea', role: 'tech', co: 'ai mastering', k: 'm', grind: 'mastering api', gl: 980, drop: { len: 38, win: 'mastering beta hit 1k tracks', stuck: 'need real artist feedback', ask: 'send me a track, i will master it free' } },
];
const CY = { id: 'c.y.', role: 'executive producer', co: 'music nerd', k: 'r' };
const YOU = { id: 'you', role: 'you', co: 'your channel', k: 'y' };
const PROMPTS = ['what are you grinding on?', 'what is the one blocker today?', 'trade one skill, right now', 'make something in 30 days?', 'who should the other meet?', 'ship it by friday?'];
const WIRE0 = ['sound of fractures · alone together on bbc radio', 'black dave · new yards episode', 'maya × theo · collab', 'week 43 drops are in', '8 founders grinding right now'];
const FILTERS = [['founders', 'founder'], ['artists', 'artist'], ['tech', 'tech'], ['anyone', null]];
const TIMES = [5, 10, 15, 25, 45, 60];
const ADLIBS = [['yeah', 'YEAH!'], ['let’s go', 'LET’S GO!'], ['horn', '📯 HORN'], ['rewind', '⏪ REWIND'], ['scratch', 'SCRATCH'], ['boom', 'BOOM']];

/* ---------------- state (in memory) ---------------- */
const S = { tapes: [{ who: 'jules', date: 'oct 21', min: 12 }, { who: 'ren', date: 'oct 20', min: 9 }, { who: 'kai', date: 'oct 18', min: 15 }, { who: 'c.y.', date: 'oct 16', min: 60, replay: true }],
  streak: 12, lastDay: '', saved: 3, dropped: false, weekStreak: 13, wire: [], hands: 7, collabs: 1, helped: [], grindMin: 0 };
const R = { on: false, mode: 'lounge', ch: 0, sel: 0, partner: null, modeT: null, auto: null, cam: null, rec: null, chunks: [], blob: null, recOn: false, recLeft: 60, chipsLit: {}, playStep: 0,
  cyLive: false, pocket: false, auxIdx: 0,
  air: false, airStart: 0, timerIdx: 3, timerLeft: 25 * 60, timerRun: false, vol: 6, adlib: 1, filter: 0, incoming: null, ringT: null };
const today = () => new Date().toISOString().slice(0, 10);
const pad = n => String(Math.max(0, Math.floor(n))).padStart(2, '0');
const fmt = n => n >= 60 ? '1:00' : '0:' + String(n).padStart(2, '0');
const mmss = s => `${pad(s / 60)}:${pad(s % 60)}`;
const all = () => [...M, YOU];
const grinding = () => M.filter(m => m.grind);
const droppedCount = () => M.filter(m => m.drop).length + (S.dropped ? 1 : 0);
function bumpStreak() { const t = today(); if (S.lastDay === t) return; S.lastDay = t; S.streak++; toast(`day ${S.streak} 🔥 streak alive`); }

/* ---------------- audio ---------------- */
const A = { ctx: null };
function audioInit() {
  if (A.ctx) { A.ctx.resume(); return; }
  const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
  const ctx = A.ctx = new C();
  A.master = ctx.createGain(); A.master.gain.value = volGain(); A.master.connect(ctx.destination);
  A.music = ctx.createGain(); A.music.gain.value = .5;
  A.an = ctx.createAnalyser(); A.an.fftSize = 64; A.music.connect(A.an); A.an.connect(A.master);
  A.fx = ctx.createGain(); A.fx.gain.value = .55; A.fx.connect(A.master);
  const len = ctx.sampleRate * 1.5, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; A.noise = b;
  startMusic();
}
const volGain = () => Math.pow(R.vol / 10, 1.6) * 1.1;
function nz(dur, f = 3000, q = 1, g = .3, t0 = 0, sweepTo) {
  if (!A.ctx) return; const c = A.ctx, t = c.currentTime + t0;
  const s = c.createBufferSource(); s.buffer = A.noise; const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.setValueAtTime(f, t); bp.Q.value = q;
  if (sweepTo) bp.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
  const gn = c.createGain(); gn.gain.setValueAtTime(g, t); gn.gain.exponentialRampToValueAtTime(.0001, t + dur);
  s.connect(bp); bp.connect(gn); gn.connect(A.fx); s.start(t, Math.random()); s.stop(t + dur + .02); return bp;
}
function tone(f, dur, g = .2, type = 'sine', t0 = 0, f2) {
  if (!A.ctx) return; const c = A.ctx, t = c.currentTime + t0;
  const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  const gn = c.createGain(); gn.gain.setValueAtTime(g, t); gn.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(gn); gn.connect(A.fx); o.start(t); o.stop(t + dur + .02); return o;
}
function buzz(p) { try { navigator.vibrate && navigator.vibrate(p); } catch {} }
const SFX = {
  key() { nz(.035, 4200, 2, .5); tone(140, .05, .35); buzz(8); },
  dark() { nz(.04, 2200, 2, .5); tone(95, .07, .4); buzz(10); },
  tick() { nz(.012, 6000, 4, .4); tone(2400, .01, .05, 'square'); buzz(4); },
  clunk() { nz(.06, 1400, 1.2, .55); tone(80, .14, .55); buzz([12, 30, 12]); },
  static(d = .5) { nz(d, 2500, .4, .22); nz(d, 7000, .6, .1); },
  power(on) { tone(on ? 60 : 50, .25, .5); nz(.08, 900, 1, .4); if (on) tone(9000, 1.2, .012); buzz(on ? [20, 40, 20] : 30); },
  win() { [523, 659, 784, 1046].forEach((f, i) => tone(f, .25, .12, 'triangle', i * .07)); buzz([15, 40, 15, 40, 30]); },
  ring() { [0, .18].forEach(t => { tone(1318, .14, .12, 'triangle', t); tone(1568, .14, .08, 'triangle', t); }); buzz([60, 80, 60]); },
  alarm() { [0, .25, .5, .75].forEach(t => tone(988, .16, .16, 'square', t)); buzz([100, 80, 100, 80, 200]); },
  onair(on) { on ? [392, 523, 659].forEach((f, i) => tone(f, .3, .12, 'triangle', i * .09)) : [659, 523, 392].forEach((f, i) => tone(f, .25, .1, 'triangle', i * .08)); },
};
function say(txt, pitch = .7, rate = 1.15) {
  try { const u = new SpeechSynthesisUtterance(txt); u.pitch = pitch; u.rate = rate; u.volume = Math.min(1, R.vol / 7); speechSynthesis.cancel(); speechSynthesis.speak(u); return true; } catch { return false; }
}
const ADLIB_FX = [
  () => { if (!say('yeah!', .6, 1)) ADLIB_FX[5](); tone(220, .3, .15, 'sawtooth', 0, 330); },
  () => { if (!say("let's go!", .75, 1.2)) ADLIB_FX[5](); nz(.5, 800, .8, .2, 0, 6000); },
  () => { [0, .22, .44].forEach(t => { [466, 554, 698].forEach(f => { const o = tone(f, .2, .07, 'sawtooth', t); }); nz(.2, 1200, 2, .08, t); }); },
  () => { tone(1400, .7, .2, 'sawtooth', 0, 60); nz(.7, 6000, 1, .3, 0, 200); if (A.music) { A.music.gain.setValueAtTime(.05, A.ctx.currentTime); A.music.gain.linearRampToValueAtTime(.5, A.ctx.currentTime + 1.1); } },
  () => { [0, .12, .24, .38].forEach((t, i) => nz(.11, i % 2 ? 900 : 2600, 3, .5, t, i % 2 ? 2600 : 700)); },
  () => { tone(110, 1.1, .8, 'sine', 0, 32); nz(.25, 300, .7, .6); buzz([40, 20, 120]); },
];
const PROG = [[[174.6, 220, 261.6, 329.6], 87.3], [[164.8, 196, 246.9, 293.7], 82.4], [[146.8, 174.6, 220, 261.6], 73.4], [[130.8, 164.8, 196, 246.9], 65.4]];
function startMusic() {
  const c = A.ctx, spb = 60 / 84; let next = c.currentTime + .1, step = 0;
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100; lp.Q.value = .7; lp.connect(A.music);
  const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = .07; lg.gain.value = 450; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
  const hit = (dest, f, q, g, d, t, type = 'bandpass') => { const s = c.createBufferSource(); s.buffer = A.noise; const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; const gn = c.createGain(); gn.gain.setValueAtTime(g, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); s.connect(fl); fl.connect(gn); gn.connect(dest); s.start(t, Math.random()); s.stop(t + d + .01); };
  setInterval(() => {
    while (next < c.currentTime + .25) {
      const bar = Math.floor(step / 8) % 4, s8 = step % 8, tr = R.auxIdx % 2 ? 1.122 : 1, [ch, bass] = PROG[bar];
      if (s8 === 0) ch.forEach(f => ['sawtooth', 'triangle'].forEach((ty, j) => { const o = c.createOscillator(), g = c.createGain(); o.type = ty; o.frequency.value = f * tr * (j ? 1.004 : .998); g.gain.setValueAtTime(0, next); g.gain.linearRampToValueAtTime(.045, next + .4); g.gain.linearRampToValueAtTime(.0001, next + spb * 4); o.connect(g); g.connect(lp); o.start(next); o.stop(next + spb * 4 + .05); }));
      if (s8 % 4 === 0) { const o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(110, next); o.frequency.exponentialRampToValueAtTime(42, next + .18); g.gain.setValueAtTime(.5, next); g.gain.exponentialRampToValueAtTime(.0001, next + .3); o.connect(g); g.connect(A.music); o.start(next); o.stop(next + .32); }
      if (s8 % 4 === 2) hit(A.music, 1800, 1, .12, .14, next);
      hit(A.music, 7000, .7, s8 % 2 ? .025 : .045, .05, next, 'highpass');
      if (s8 === 0 || s8 === 3 || s8 === 6) { const o = c.createOscillator(), g = c.createGain(); o.frequency.value = bass * tr; g.gain.setValueAtTime(.22, next); g.gain.exponentialRampToValueAtTime(.0001, next + spb * .9); o.connect(g); g.connect(A.music); o.start(next); o.stop(next + spb); }
      next += spb / 2; step++;
    }
  }, 30);
}

/* ---------------- dom helpers ---------------- */
const view = $('#view'), crt = $('#crt');
const sil = c => `<svg class="sil" viewBox="0 0 420 380" aria-hidden="true"><circle cx="210" cy="118" r="86" fill="${c}"/><path d="M28 380c0-112 82-172 182-172s182 60 182 172z" fill="${c}"/></svg>`;
function feed(m, { talk = false, cam = false, off = false } = {}) {
  if (off) return `<div class="feed noise"></div>`;
  const p = PAL[m.k || 'p'];
  const inner = cam && R.cam ? `<video autoplay muted playsinline></video>` : (m === YOU ? `<div class="avatar" style="background:${p[4]}">y</div>` : sil(p[3]));
  return `<div class="feed ${talk ? 'talk' : ''}" style="background:linear-gradient(160deg,${p[0]} 0%,${p[1]} 55%,${p[2]} 100%)"><div class="lightleak"></div>${inner}</div>`;
}
function attachCam() { if (R.cam) view.querySelectorAll('video:not([src])').forEach(v => { v.srcObject = R.cam; v.play().catch(() => {}); }); }
async function getCam() { if (R.cam) return R.cam; try { R.cam = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false }); } catch { R.cam = null; } return R.cam; }
function stopCam() { if (R.cam) { R.cam.getTracks().forEach(t => t.stop()); R.cam = null; } }
const st = (txt, cls = '', css = '', r = 0) => `<div class="sticker ${cls} pop" style="--r:${r}deg;${css}">${txt}</div>`;
let toastT;
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600); }
function staticBurst(ms = 380) { const o = $('#staticOv'); o.classList.add('on', 'noise'); SFX.static(ms / 1000); setTimeout(() => o.classList.remove('on'), ms); }
function react(e, n = 1) {
  const box = $('#reacts');
  for (let i = 0; i < n; i++) setTimeout(() => { const d = document.createElement('div'); d.className = 'fly'; d.textContent = e; d.style.left = (15 + Math.random() * 70) + '%'; d.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px'); d.style.setProperty('--rot', (Math.random() * 40 - 20) + 'deg'); box.appendChild(d); setTimeout(() => d.remove(), 2500); }, i * 140);
}
function flashText(t) { const d = document.createElement('div'); d.className = 'flash'; d.textContent = t; $('#reacts').appendChild(d); setTimeout(() => d.remove(), 950); crt.classList.remove('shake'); void crt.offsetWidth; crt.classList.add('shake'); }

/* ---------------- LCD: timer is always the clock ---------------- */
let lcdTemp = null, lcdTempT;
function lcdRender() {
  if (lcdTemp) { $('#lcdA').textContent = lcdTemp.a; $('#lcdB').textContent = lcdTemp.b; $('#lcdAl').textContent = lcdTemp.al; $('#lcdBl').textContent = lcdTemp.bl; $('#lcdMid').textContent = lcdTemp.mid; return; }
  const s = R.timerLeft;
  $('#lcdA').textContent = pad(s / 60); $('#lcdB').textContent = pad(s % 60);
  $('#lcdAl').textContent = R.timerRun ? 'min left' : 'min set'; $('#lcdBl').textContent = 'sec';
  $('#lcdMid').textContent = R.mode === 'call' && R.partner ? `W/ ${R.partner.id.toUpperCase()}` : R.air ? (R.timerRun ? 'ON AIR · GRINDING' : 'ON AIR · PAUSED') : R.timerRun ? 'TIMER RUNNING' : `${grinding().length} GRINDING`;
}
function lcdFlash(a, al, b, bl, mid) { lcdTemp = { a, al, b, bl, mid }; lcdRender(); clearTimeout(lcdTempT); lcdTempT = setTimeout(() => { lcdTemp = null; lcdRender(); }, 1300); }
setInterval(() => {
  M.forEach(m => { if (m.grind && m.gl > 0) m.gl--; });
  if (R.on && R.timerRun) {
    R.timerLeft--; if (R.air) S.grindMin += 1 / 60;
    if (R.timerLeft <= 0) timerDone();
  }
  if (R.on) { lcdRender(); const g = $('#grindClock'); if (g) g.textContent = 'GRIND ' + mmss(curChan().gl || 0); }
}, 1000);
function timerDone() {
  R.timerRun = false; R.timerLeft = TIMES[R.timerIdx] * 60; SFX.alarm(); flashText('TIME!');
  if (R.mode === 'call') go('after');
  if (R.air) setAir(false, true);
  toast(`session done · ${Math.max(1, Math.round(S.grindMin))} min grind logged`);
}

/* ---------------- keys ---------------- */
let KEYS = [];
function keys(arr, matchLabel = 'match') {
  KEYS = arr; $('.key[data-k="3"]').classList.add('dark');
  arr.forEach((k, i) => { $(`#k${i}i`).textContent = k.i; $(`#k${i}l`).textContent = k.l; const el = $(`.key[data-k="${i}"]`); el.classList.toggle('lit', !!k.lit); el.setAttribute('aria-label', k.l); });
  $('#kMatch .knob-lab').textContent = matchLabel;
}
function marquee() { const items = [...S.wire.slice(-4).reverse(), ...WIRE0]; const html = items.map(t => `<span>${t}</span>`).join(''); $('#marqRun').innerHTML = html + html; }
function strip() {
  const chans = [{ ...CY, n: '00' }, ...M.map((m, i) => ({ ...m, n: pad(i + 1) })), { ...YOU, n: pad(M.length + 1) }];
  $('#strip').innerHTML = chans.map((m, i) => {
    const live = m.id === 'c.y.' ? R.cyLive : m.id === 'you' ? R.air : !!m.grind;
    const p = PAL[m.k], on = (R.mode === 'cy' && i === 0) || (R.mode === 'lounge' && i === R.ch + 1);
    return `<button class="ch ${on ? 'on' : ''}" data-ch="${i}"><span class="sw ${live ? '' : 'off noise'}" style="${live ? `background:linear-gradient(160deg,${p[0]},${p[2]})` : ''}"></span><span class="n">${m.n}</span>${m.id}${live ? '<span class="live"></span>' : ''}</button>`;
  }).join('');
  const on = $('#strip .ch.on'); if (on) on.scrollIntoView({ block: 'nearest', inline: 'center' });
}
const curChan = () => all()[(R.ch + all().length) % all().length];

/* ---------------- modes ---------------- */
function clearModeTimers() { clearInterval(R.modeT); clearTimeout(R.modeT); R.modeT = null; clearInterval(R.auto); R.auto = null; }
function go(mode, opts = {}) { clearModeTimers(); R.mode = mode; $('#kMatch').classList.remove('ringing'); MODES[mode](opts); strip(); lcdRender(); }
const MODES = {
  lounge() {
    const m = curChan(), isYou = m === YOU, live = isYou ? true : !!m.grind;
    view.innerHTML = feed(m, { off: !live, cam: isYou }) +
      `<div class="osd" style="left:30px;top:26px;font-size:32px">CH ${pad(R.ch + 1)}</div>` +
      (live && !isYou ? `<div class="osd" id="grindClock" style="left:30px;top:76px;font-size:20px;color:var(--pink);text-shadow:0 0 10px rgba(255,117,216,.8)">GRIND ${mmss(m.gl)}</div>` : '') +
      (!live ? `<div class="bigname" style="left:30px;bottom:74px;font-size:96px;opacity:.85">${m.id}</div><div class="osd sans" style="left:34px;bottom:40px;color:#ff3b5c;text-shadow:0 0 10px rgba(255,59,92,.7)">off air · not grinding right now</div>`
        : `<div class="bigname" style="left:30px;bottom:74px;font-size:110px">${m.id}</div><div class="osd sans" style="left:34px;bottom:40px">${isYou ? (R.air ? 'you are on air · matchable' : 'turn on air to get matched') : `${m.co} · grinding`}</div>`) +
      st(`day ${S.streak} 🔥`, '', 'right:34px;top:30px', -6) + st(`${grinding().length + (R.air ? 1 : 0)} grinding`, 'm', 'right:56px;top:96px', 5) +
      (live && !isYou ? st('on: ' + m.grind, 'w', 'right:40px;top:162px', -2) : '');
    if (isYou) getCam().then(c => { if (c && R.mode === 'lounge' && curChan() === YOU) { view.querySelector('.feed').outerHTML = feed(YOU, { cam: true }); attachCam(); } });
    keys([{ i: '🔥', l: 'fire', fn: () => react('🔥', 3) }, { i: '💗', l: 'love', fn: () => react('💗', 3) }, { i: '📺', l: 'guide', fn: () => go('guide') }, { i: '📼', l: 'shelf', fn: () => go('shelf') }]);
    R.auto = setInterval(() => { if (live && Math.random() < .5) react(['🔥', '💗', '🎧', '😂'][Math.random() * 4 | 0]); }, 2600);
  },
  tuning({ who }) {
    const [label, role] = FILTERS[R.filter];
    let pool = grinding().filter(m => !role || m.role === role).filter(m => !R.partner || m.id !== R.partner.id || grinding().length < 2);
    if (!pool.length) { toast(`nobody in ${label} is grinding right now · turn match to anyone`); go('lounge'); return; }
    const p = who || pool[Math.random() * pool.length | 0];
    view.innerHTML = `<div class="feed noise"></div><div class="osd" style="left:50%;top:42%;transform:translateX(-50%);font-size:42px">MATCHING</div>` + st(`calling a ${label === 'anyone' ? 'member' : label.replace(/s$/, '')} who is grinding`, 'w', 'left:50%;top:57%;transform:translateX(-50%)');
    SFX.static(1.2); let k = 0; R.modeT = setInterval(() => { SFX.tick(); if (++k > 8) { clearInterval(R.modeT); R.partner = p; go('call'); } }, 130);
    keys([{ i: '🔥', l: 'fire', fn() {} }, { i: '💗', l: 'love', fn() {} }, { i: '🎧', l: 'pass aux', fn() {} }, { i: '✕', l: 'cancel', fn: () => go('lounge') }], 'end');
    getCam();
  },
  call() {
    const p = R.partner; bumpStreak(); staticBurst(260);
    if (!R.timerRun) { R.timerRun = true; toast(`timer started · ${TIMES[R.timerIdx]} min`); }
    R.callStart = Date.now();
    view.innerHTML = `<div class="split">${feed(p, { talk: true })}${feed(YOU, { cam: true })}</div>` +
      `<div class="bigname" style="left:26px;bottom:26px;font-size:64px">${p.id}</div><div class="bigname" style="left:calc(50% + 26px);bottom:26px;font-size:64px">you</div>` +
      `<div class="osd sans" style="left:30px;top:24px">${p.co}</div><div class="osd sans" style="left:30px;top:46px;color:var(--pink)">grinding on: ${p.grind}</div>` +
      st(PROMPTS[Math.random() * PROMPTS.length | 0], 'w', 'left:50%;top:84px;transform:translateX(-50%);font-size:26px;padding:12px 24px');
    attachCam();
    keys([{ i: '🔥', l: 'fire', fn: () => react('🔥', 3) }, { i: '💗', l: 'love', fn: () => react('💗', 3) }, { i: '🎧', l: 'pass aux', fn: passAux }, { i: '✕', l: 'end', fn: () => go('after') }], 'end');
    R.auto = setInterval(() => { const r = Math.random(); if (r < .45) react(['😂', '🔥', '💗', '🎧'][Math.random() * 4 | 0]); else if (r < .53) { const a = Math.random() * ADLIBS.length | 0; ADLIB_FX[a](); flashText(ADLIBS[a][1]); toast(`${p.id} hit an adlib`); } }, 2600);
  },
  after() {
    const p = R.partner || M[0]; const mins = Math.max(1, Math.round((Date.now() - (R.callStart || Date.now())) / 60000));
    S.tapes.unshift({ who: p.id, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase(), min: mins });
    view.innerHTML = `<div class="split" style="filter:brightness(.3) blur(3px)">${feed(p)}${feed(YOU)}</div>` +
      `<div class="tape bigtape spinning"><div class="lb" style="background:${PAL[p.k][4]}">${p.id} × you<small>tape ${pad(S.tapes.length)} · ${mins} min · ${S.tapes[0].date}</small></div><div class="reels"><div class="reel"></div><div class="reel"></div></div></div>` +
      st('new tape on your shelf', 'm', 'left:50%;bottom:34px;transform:translateX(-50%)', 2);
    SFX.win();
    keys([{ i: '🤝', l: 'collab', fn: collab }, { i: '👋', l: 'later', fn: () => go('lounge') }, { i: '📺', l: 'guide', fn: () => go('guide') }, { i: '📼', l: 'shelf', fn: () => go('shelf') }]);
    function collab() {
      if (KEYS[0].lit) return; KEYS[0].lit = true; $('.key[data-k="0"]').classList.add('lit'); toast(`collab sent to ${p.id}`);
      setTimeout(() => { S.wire.push(`${p.id} × you · collab`); S.collabs++; marquee(); SFX.win(); toast(`${p.id} tapped collab too · you're on the wire`); react('🤝', 4); }, 1700);
    }
  },
  guide() {
    const list = all(); R.sel = Math.min(R.sel, list.length - 1);
    view.innerHTML = `<div class="grid"><div class="hd"><div class="hd-t">this week on <i>mntv</i></div>${st("c.y.'s pick: kai", '', 'position:static;transform:rotate(-3deg);font-size:17px')}<div class="osd sans" style="position:static">wk 43 · ${droppedCount()} of ${list.length} dropped</div></div>` +
      list.map((m, i) => { const d = m === YOU ? S.dropped : !!m.drop;
        return `<div class="tile" data-i="${i}" style="${i === R.sel ? 'box-shadow:0 0 0 3px #fff' : ''}">${feed(m, { off: !d })}` +
          (d ? `<div class="len">${fmt(m === YOU ? (R.myDrop ? R.myDrop.len : 60) : m.drop.len)}</div><div class="tag" style="color:${m.id === 'kai' ? 'var(--pink)' : 'var(--mint)'}">${m.id === 'kai' ? 'PICK' : 'NEW'}</div>` : `<div class="tag" style="color:#ff3b5c">OFF AIR</div>`) +
          `<div class="co">${m.co}</div><div class="nm">${m.id}</div></div>`; }).join('') + `</div>`;
    view.querySelectorAll('.tile').forEach(t => t.addEventListener('click', () => { R.sel = +t.dataset.i; SFX.key(); go('play', {}); }));
    keys([{ i: '▶️', l: 'play all', fn: () => { R.sel = 0; go('play', { auto: true }); } }, { i: '🙋', l: 'asks', fn: asks }, { i: '⏺', l: 'record', fn: () => go('record'), lit: !S.dropped }, { i: '🏠', l: 'lounge', fn: () => go('lounge') }]);
  },
  play({ auto }) {
    const list = all(), m = list[R.sel], isYou = m === YOU;
    if ((isYou && !S.dropped) || (!isYou && !m.drop)) {
      view.innerHTML = feed(m, { off: true }) + `<div class="bigname" style="left:30px;bottom:74px;font-size:96px">${m.id}</div>` + st('no drop this week', 'r', 'right:34px;top:30px', -4) + `<div class="osd sans" style="left:34px;bottom:40px;color:#ff3b5c">off air · due friday</div>`;
      keys([{ i: '👋', l: 'nudge', fn: () => toast(isYou ? 'press record on the guide' : `nudged ${m.id} · due friday`) }, { i: '⏭', l: 'next', fn: () => nextDrop(auto) }, { i: '⏺', l: 'record', fn: () => go('record') }, { i: '⏹', l: 'back', fn: () => go('guide') }]);
      if (auto) R.modeT = setTimeout(() => nextDrop(true), 1800); return;
    }
    const d = isYou ? R.myDrop : m.drop, steps = [['win', d.win, 'var(--mint)'], ['stuck', d.stuck, 'var(--cyan)'], ['ask', d.ask, 'var(--pink)']];
    view.innerHTML = (isYou && R.blob ? `<div class="feed"><video autoplay playsinline loop src="${R.blob}" style="transform:scaleX(-1)"></video></div>` : feed(m, { talk: true })) +
      `<div class="osd" style="left:30px;top:26px;font-size:30px">DROP</div><div class="osd sans" style="left:34px;top:70px">${m.id} · ${m.co} · wk 43</div>` + (m.id === 'kai' ? st("c.y.'s pick", '', 'right:34px;top:30px', -5) : '') + `<div class="caption" id="cap"></div>`;
    let i = 0, el = 0;
    const show = () => { const [k, t, c] = steps[i]; $('#cap').innerHTML = `<b style="color:${c}">${k}</b>${t}`; R.playStep = i; $('.key[data-k="2"]').classList.toggle('lit', i === 2); };
    keys([{ i: '🔥', l: 'fire', fn: () => react('🔥', 3) }, { i: '💗', l: 'love', fn: () => react('💗', 3) }, { i: '🙋', l: 'i got you', fn: () => helpAsk(m) }, { i: '⏹', l: 'back', fn: () => go('guide') }], 'next');
    show(); R.modeT = setInterval(() => { el++; if (el % 4 === 0 && i < 2) { i++; show(); } if (auto && el >= 12) nextDrop(true); }, 1000);
  },
  record() {
    R.chipsLit = {}; R.recOn = false; R.recLeft = 60;
    const render = () => {
      view.innerHTML = feed(YOU, { cam: true }) + (R.recOn ? '<div class="recring"></div>' : '') +
        `<div class="osd" style="left:30px;top:26px;font-size:30px">${R.recOn ? 'REC 00:' + pad(R.recLeft) : 'CH ' + pad(M.length + 1)}</div>` +
        st('your weekly drop', 'w', 'left:30px;top:78px;font-size:30px', -3) + st('due fri 🔔', '', 'right:34px;top:30px', -6) + st(`wk ${S.weekStreak} in a row`, 'm', 'right:56px;top:96px', 5) +
        (R.recOn ? '' : st('press ⏺ to record 60 sec', 'c', 'left:50%;top:52%;transform:translateX(-50%)')) +
        `<div class="chips">${['win', 'stuck', 'ask'].map((c, i) => `<span class="chip ${R.chipsLit[c] ? 'lit' : ''}" style="background:${['var(--mint)', 'var(--cyan)', 'var(--pink)'][i]}">1 ${c}</span>`).join('')}</div>`;
      attachCam();
    };
    R.recRender = render; render(); getCam().then(() => { if (R.mode === 'record') render(); });
    const mark = c => { R.chipsLit[c] = true; view.querySelectorAll('.chip').forEach((el, i) => el.classList.toggle('lit', !!R.chipsLit[['win', 'stuck', 'ask'][i]])); };
    keys([{ i: '⏺', l: 'rec / send', fn: () => R.recOn ? sendDrop() : startRec(), lit: true }, { i: '🏆', l: 'win', fn: () => mark('win') }, { i: '🧱', l: 'stuck', fn: () => mark('stuck') }, { i: '🙋', l: 'ask', fn: () => mark('ask') }]);
    $('.key[data-k="3"]').classList.remove('dark');
  },
  shelf() {
    view.innerHTML = `<div class="grid shelf"><div class="hd"><div class="hd-t">your <i>shelf</i></div><div class="osd sans" style="position:static">${S.tapes.length} tapes · ${S.collabs} collabs · ${Math.round(S.grindMin)} min grinding</div></div>` +
      S.tapes.slice(0, 12).map(t => { const m = [...M, CY].find(x => x.id === t.who) || M[0]; return `<div class="tape"><div class="lb" style="background:${t.replay ? '#f4f2f5' : PAL[m.k][4]}">${t.replay ? 'c.y. live' : t.who + ' × you'}<small>${t.replay ? 'replay' : t.min + ' min'} · ${t.date}</small></div><div class="reels"><div class="reel"></div><div class="reel"></div></div></div>`; }).join('') + `</div>`;
    keys([{ i: '🏠', l: 'lounge', fn: () => go('lounge') }, { i: '📺', l: 'guide', fn: () => go('guide') }, { i: '🔥', l: 'fire', fn: () => react('🔥', 3) }, { i: '✕', l: 'back', fn: () => go('lounge') }]);
  },
  cy() {
    if (!R.cyLive) {
      view.innerHTML = `<div class="feed noise"></div><div class="bigname" style="left:30px;bottom:74px;font-size:96px">c.y.</div><div class="osd sans" style="left:34px;bottom:40px;color:#ff3b5c">off air · he drops in when he drops in</div>` + st('stay tuned', 'w', 'right:34px;top:30px', -4);
      keys([{ i: '✋', l: 'raise', fn: raise }, { i: '🔔', l: 'notify me', fn: () => toast("we'll ping you when c.y. goes live") }, { i: '📺', l: 'guide', fn: () => go('guide') }, { i: '🏠', l: 'leave', fn: () => go('lounge') }]); return;
    }
    view.innerHTML = feed(CY, { talk: true }) + `<div class="osd" style="left:30px;top:26px;font-size:32px">CH 00</div><div class="bigname" style="left:30px;bottom:74px;font-size:110px">c.y.</div><div class="osd sans" style="left:34px;bottom:40px">live · ${16 + S.hands} watching · recording to the shelf</div>` +
      st('SAFE or priced?', 'w', 'right:34px;top:30px;font-size:28px', -4) + st(`✋ ${S.hands + 2} asked this`, '', 'right:60px;top:100px', 4);
    keys([{ i: '✋', l: 'raise', fn: raise }, { i: '🔥', l: 'fire', fn: () => react('🔥', 3) }, { i: '💗', l: 'love', fn: () => react('💗', 3) }, { i: '🏠', l: 'leave', fn: () => go('lounge') }]);
    R.auto = setInterval(() => react(['💗', '🔥', '✋', '💗'][Math.random() * 4 | 0], 1 + (Math.random() * 2 | 0)), 1400);
  },
};
function passAux() { R.auxIdx++; toast(`aux passed to ${R.partner ? R.partner.id : 'them'} · new key`); SFX.static(.25); react('🎧', 2); }
function raise() { S.hands++; toast(`you're in c.y.'s queue · #${S.hands - 6}`); react('✋', 3); }
function helpAsk(m) {
  if (R.playStep !== 2) { toast('wait for the ask'); return; }
  if (S.helped.includes(m.id)) { toast(`you already pinged ${m.id}`); return; }
  S.helped.push(m.id); S.saved++; SFX.win(); react('🙋', 3); toast(`pinged ${m.id} · ${S.saved} calls c.y. didn't take`);
}
function asks() {
  const ex = view.querySelector('.asklist'); if (ex) { ex.remove(); return; }
  const list = M.filter(m => m.drop), box = document.createElement('div'); box.className = 'asklist';
  box.innerHTML = list.map(m => `<div class="ask"><div class="dot" style="background:${PAL[m.k][4]}">${m.id[0].toUpperCase()}</div><p>${m.drop.ask}<small>${m.id} · ${m.co}</small></p><button data-id="${m.id}" ${S.helped.includes(m.id) ? 'disabled' : ''}>${S.helped.includes(m.id) ? 'sent' : 'i got you'}</button></div>`).join('');
  view.appendChild(box);
  box.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { const id = b.dataset.id; if (S.helped.includes(id)) return; S.helped.push(id); S.saved++; SFX.win(); b.textContent = 'sent'; b.disabled = true; toast(`pinged ${id} · ${S.saved} calls c.y. didn't take`); }));
}
function nextDrop(auto) { R.sel = (R.sel + 1) % all().length; staticBurst(220); if (auto && R.sel === 0) { go('guide'); return; } go('play', { auto }); }
function startRec() {
  R.recOn = true; R.recLeft = 60; R.chunks = [];
  if (R.cam && window.MediaRecorder) { try { R.rec = new MediaRecorder(R.cam); R.rec.ondataavailable = e => e.data.size && R.chunks.push(e.data); R.rec.start(); } catch { R.rec = null; } }
  R.recRender(); SFX.clunk(); tone(880, .15, .15, 'square');
  R.modeT = setInterval(() => { R.recLeft--; const o = view.querySelector('.osd'); if (o) o.textContent = 'REC 00:' + pad(R.recLeft); if (R.recLeft <= 0) sendDrop(); }, 1000);
}
function sendDrop() {
  clearInterval(R.modeT); R.recOn = false;
  const finish = () => {
    S.dropped = true; S.weekStreak++; bumpStreak();
    R.myDrop = { len: Math.max(5, 60 - R.recLeft), win: R.chipsLit.win ? 'my win this week' : 'quick update', stuck: R.chipsLit.stuck ? "what i'm stuck on" : 'nothing stuck', ask: R.chipsLit.ask ? 'my ask for the room' : 'no ask this week' };
    S.wire.push('you · new weekly drop'); marquee(); SFX.win(); flashText('DROPPED'); toast(`your drop is on air · wk ${S.weekStreak} in a row`); go('guide');
  };
  if (R.rec && R.rec.state !== 'inactive') { R.rec.onstop = () => { try { R.blob = URL.createObjectURL(new Blob(R.chunks, { type: R.rec.mimeType || 'video/webm' })); } catch {} finish(); }; R.rec.stop(); } else finish();
}

/* ---------------- on air (you) + incoming matches ---------------- */
function setAir(on, quiet) {
  R.air = on; airKnob.set(on ? 1 : 0, true);
  $('#kAir').classList.toggle('live', on);
  $('#lamp').classList.toggle('on', on); $('#lamp').classList.toggle('blink', on);
  $('#statusEtch').textContent = on ? 'you are on air' : R.cyLive ? 'c.y. is live' : 'members only';
  SFX.onair(on);
  if (on) {
    R.airStart = Date.now(); if (!R.timerRun) R.timerRun = true; bumpStreak();
    flashText('ON AIR'); toast(`you're on air · ${TIMES[R.timerIdx]} min grind · matchable`);
    S.wire.push('you · on air, grinding'); marquee(); scheduleIncoming();
  } else {
    clearTimeout(R.ringT); R.incoming = null; $('#kMatch').classList.remove('ringing'); R.timerRun = false;
    if (!quiet) toast(`off air · ${Math.max(1, Math.round((Date.now() - R.airStart) / 60000))} min logged`);
  }
  strip(); lcdRender(); knobLabels();
  if (R.mode === 'lounge') go('lounge');
}
function scheduleIncoming() {
  clearTimeout(R.ringT);
  R.ringT = setTimeout(() => {
    if (!R.air || !R.on || ['call', 'tuning', 'record'].includes(R.mode)) { scheduleIncoming(); return; }
    const p = grinding()[Math.random() * grinding().length | 0]; R.incoming = p; SFX.ring();
    $('#kMatch').classList.add('ringing'); $('#kMatch .knob-lab').textContent = 'pick up';
    toast(`${p.id} matched with you · press match to pick up`);
    let n = 0; const rr = setInterval(() => { if (!R.incoming || ++n > 4) { clearInterval(rr); if (R.incoming) { R.incoming = null; $('#kMatch').classList.remove('ringing'); $('#kMatch .knob-lab').textContent = 'match'; toast(`missed ${p.id} · they'll ring again`); scheduleIncoming(); } return; } SFX.ring(); }, 1800);
  }, 14000 + Math.random() * 10000);
}

/* ---------------- knob engine ---------------- */
function scaleSVG(size, n, range, labels, active) {
  const c = size / 2, r1 = size / 2 - 16, r2 = size / 2 - 8, rl = size / 2 + 4; let s = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
  const minor = n > 1 ? (n - 1) * 3 : 0;
  for (let i = 0; i <= minor; i++) { const a = (-range / 2 + i * range / minor - 90) * Math.PI / 180, maj = i % 3 === 0; const ra = maj ? r1 - 2 : r1 + 2;
    s += `<line x1="${c + Math.cos(a) * ra}" y1="${c + Math.sin(a) * ra}" x2="${c + Math.cos(a) * r2}" y2="${c + Math.sin(a) * r2}" stroke-width="${maj ? 2.4 : 1.2}"/>`; }
  labels.forEach((t, i) => { if (!t) return; const a = (-range / 2 + i * range / Math.max(1, n - 1) - 90) * Math.PI / 180;
    s += `<text class="${i === active ? 'on' : ''}" x="${c + Math.cos(a) * (rl + 8)}" y="${c + Math.sin(a) * (rl + 8) + 3.5}" text-anchor="middle">${t}</text>`; });
  return s + '</svg>';
}
class Knob {
  constructor(root, o) {
    this.root = root; this.btn = $('.knob', root); this.ind = $('.ind', root); Object.assign(this, { n: o.n, range: o.range, idx: o.idx, labels: o.labels, onStep: o.onStep, onPress: o.onPress, size: o.size });
    this.drawScale(); this.set(this.idx, true);
    let d = null;
    const ctr = () => { const r = this.btn.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
    this.btn.addEventListener('pointerdown', e => { if (!R.on) return; this.btn.setPointerCapture(e.pointerId); const [x, y] = ctr(); d = { a: Math.atan2(e.clientY - y, e.clientX - x), acc: 0, mv: 0, t: Date.now() }; this.btn.classList.add('pressed'); });
    this.btn.addEventListener('pointermove', e => { if (!d) return; const [x, y] = ctr(); const a = Math.atan2(e.clientY - y, e.clientX - x); let dd = (a - d.a) * 180 / Math.PI; if (dd > 180) dd -= 360; if (dd < -180) dd += 360; d.a = a; d.acc += dd; d.mv += Math.abs(dd);
      const th = Math.min(this.step(), 28); while (Math.abs(d.acc) >= th) { const dir = Math.sign(d.acc); d.acc -= dir * th; this.turn(dir); } });
    const up = () => { if (!d) return; this.btn.classList.remove('pressed'); if (d.mv < 8 && Date.now() - d.t < 700) this.press(); d = null; };
    this.btn.addEventListener('pointerup', up); this.btn.addEventListener('pointercancel', up);
    this.btn.addEventListener('click', () => { if (!R.on) powerOn(); });
    this.btn.addEventListener('wheel', e => { if (!R.on) return; e.preventDefault(); this.turn(e.deltaY > 0 ? 1 : -1); }, { passive: false });
    this.btn.addEventListener('keydown', e => { if (!R.on) return; if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); this.turn(1); } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); this.turn(-1); } else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); this.press(); } });
  }
  step() { return this.range / Math.max(1, this.n - 1); }
  angle(i) { return -this.range / 2 + i * this.step(); }
  drawScale() { $('.scale', this.root).innerHTML = scaleSVG(this.size, this.n, this.range, this.labels, this.idx); }
  set(i, silent) { this.idx = Math.max(0, Math.min(this.n - 1, i)); this.ind.style.transform = `rotate(${this.angle(this.idx)}deg)`; this.drawScale(); }
  turn(dir) { const prev = this.idx; this.set(this.idx + dir); if (this.idx !== prev) setTimeout(knobLabels); if (this.idx === prev) { SFX.tick(); this.ind.animate([{ transform: `rotate(${this.angle(prev) + dir * 4}deg)` }, { transform: `rotate(${this.angle(prev)}deg)` }], { duration: 160 }); return; } SFX.tick(); this.onStep && this.onStep(this.idx, dir); }
  press() { SFX.clunk(); this.btn.classList.add('pressed'); setTimeout(() => this.btn.classList.remove('pressed'), 120); this.onPress && this.onPress(); }
}
const matchKnob = new Knob($('#kMatch'), { n: 4, range: 240, idx: 0, size: 250, labels: FILTERS.map(f => f[0]),
  onStep: i => { R.filter = i; const role = FILTERS[i][1]; const c = grinding().filter(m => !role || m.role === role).length; lcdFlash(pad(c), 'grinding', pad(i + 1), 'filter', `MATCH: ${FILTERS[i][0].toUpperCase()}`); },
  onPress: () => matchPress() });
const airKnob = new Knob($('#kAir'), { n: 2, range: 90, idx: 0, size: 96, labels: ['end', 'start'],
  onStep: i => setAir(i === 1), onPress: () => setAir(!R.air) });
const timerKnob = new Knob($('#kTimer'), { n: TIMES.length, range: 270, idx: R.timerIdx, size: 96, labels: [],
  onStep: i => { R.timerIdx = i; if (!R.timerRun) R.timerLeft = TIMES[i] * 60; else R.timerLeft = TIMES[i] * 60; lcdFlash(pad(TIMES[i]), 'min', '00', 'sec', R.timerRun ? 'RESET · RUNNING' : 'TIMER SET'); },
  onPress: () => { R.timerRun = !R.timerRun; if (R.timerLeft <= 0) R.timerLeft = TIMES[R.timerIdx] * 60; toast(R.timerRun ? `timer running · ${mmss(R.timerLeft)}` : 'timer paused'); lcdRender(); } });
const volKnob = new Knob($('#kVol'), { n: 11, range: 270, idx: R.vol, size: 96, labels: [],
  onStep: i => { R.vol = i; if (A.master) A.master.gain.setTargetAtTime(volGain(), A.ctx.currentTime, .04); lcdFlash(pad(i), 'vol', i === 10 ? '11' : '--', i === 10 ? 'lol' : '', i === 0 ? 'MUTED' : 'VOLUME'); },
  onPress: () => { R.vol = R.vol ? 0 : 6; volKnob.set(R.vol); knobLabels(); if (A.master) A.master.gain.setTargetAtTime(volGain(), A.ctx.currentTime, .04); lcdFlash(pad(R.vol), 'vol', '--', '', R.vol ? 'UNMUTED' : 'MUTED'); } });
const adlibKnob = new Knob($('#kAdlib'), { n: ADLIBS.length, range: 270, idx: R.adlib, size: 96, labels: [],
  onStep: i => { R.adlib = i; lcdFlash(pad(i + 1), 'adlib', pad(ADLIBS.length), 'of', ADLIBS[i][0].toUpperCase()); },
  onPress: () => fireAdlib() });
function knobLabels() {
  $('#kAir .kn-l').textContent = R.air ? 'live' : 'on air';
  $('#kTimer .kn-l').textContent = `timer ${TIMES[R.timerIdx]}m`;
  $('#kVol .kn-l').textContent = R.vol ? `vol ${R.vol}` : 'muted';
  $('#kAdlib .kn-l').textContent = `adlib: ${ADLIBS[R.adlib][0]}`;
}
function fireAdlib() { ADLIB_FX[R.adlib](); flashText(ADLIBS[R.adlib][1]); if (R.mode === 'call' && R.partner) setTimeout(() => react(['😂', '🔥', '🙌'][Math.random() * 3 | 0], 3), 400); }
function matchPress() {
  if (R.incoming) { const p = R.incoming; R.incoming = null; $('#kMatch').classList.remove('ringing'); R.partner = p; go('call'); scheduleIncoming(); return; }
  if (R.mode === 'call' || R.mode === 'tuning') { go('after'); return; }
  if (R.mode === 'play') { nextDrop(false); return; }
  if (R.mode === 'record') { toast('finish your drop first · press ⏺'); return; }
  go('tuning', {});
}

/* ---------------- keys input ---------------- */
document.querySelectorAll('.key').forEach(el => {
  const i = +el.dataset.k;
  el.addEventListener('pointerdown', () => { if (!R.on) return; el.classList.add('down'); el.classList.contains('dark') ? SFX.dark() : SFX.key(); });
  const up = () => el.classList.remove('down'); el.addEventListener('pointerup', up); el.addEventListener('pointerleave', up);
  el.addEventListener('click', () => { el.blur(); if (!R.on) { powerOn(); return; } KEYS[i] && KEYS[i].fn(); });
});
function surf(dir) { const n = all().length; R.ch = (R.ch + dir + n) % n; staticBurst(200); SFX.tick(); go('lounge'); }

/* ---------------- vu ---------------- */
const vu = $('#vu'); vu.innerHTML = '<span></span>'.repeat(24); const bars = [...vu.children], fbuf = new Uint8Array(32);
(function vuLoop() { if (A.an && R.on) { A.an.getByteFrequencyData(fbuf); bars.forEach((b, i) => b.style.height = Math.max(8, fbuf[1 + (i % 22)] / 255 * 100 * (R.vol / 7)) + '%'); } else bars.forEach(b => b.style.height = '8%'); requestAnimationFrame(vuLoop); })();

/* ---------------- power ---------------- */
const po = $('#powerOff'), pw = $('#power');
function powerOn() {
  if (R.on) return; R.on = true; audioInit(); SFX.power(true);
  pw.classList.add('on'); po.classList.add('hide'); crt.classList.remove('off-anim'); void crt.offsetWidth; crt.classList.add('on-anim'); setTimeout(() => crt.classList.remove('on-anim'), 800);
  go('lounge');
  if (!R.cyT) R.cyT = setTimeout(() => { R.cyLive = true; strip(); if (!R.air) $('#statusEtch').textContent = 'c.y. is live'; SFX.win(); toast('c.y. just went live · turn to ch 00'); S.wire.push('c.y. live now'); marquee(); }, 40000);
}
function powerOff() { R.on = false; SFX.power(false); clearModeTimers(); if (R.air) setAir(false, true); pw.classList.remove('on'); crt.classList.add('off-anim'); setTimeout(() => po.classList.remove('hide'), 420); if (A.ctx) A.ctx.suspend(); stopCam(); }
pw.addEventListener('click', () => R.on ? powerOff() : powerOn());
po.addEventListener('click', powerOn);
$('#strip').addEventListener('click', e => { const b = e.target.closest('.ch'); if (!b) return; if (!R.on) { powerOn(); return; } const i = +b.dataset.ch; SFX.key(); staticBurst(220); if (i === 0) go('cy'); else { R.ch = i - 1; go('lounge'); } });
/* swipe the screen to surf */
let sw = null;
$('#screen').addEventListener('pointerdown', e => { if (R.on && R.mode === 'lounge') sw = e.clientX; });
$('#screen').addEventListener('pointerup', e => { if (sw == null) return; const dx = e.clientX - sw; sw = null; if (Math.abs(dx) > 50) surf(dx < 0 ? 1 : -1); });

/* ---------------- keyboard ---------------- */
document.addEventListener('keydown', e => {
  if (e.repeat || e.metaKey || e.ctrlKey) return;
  if (!R.on) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); powerOn(); } return; }
  if (e.target.closest && e.target.closest('.knob')) return;
  const k = e.key.toLowerCase();
  if (k === 'arrowright') { if (R.mode === 'lounge') surf(1); else if (R.mode === 'play') nextDrop(false); }
  else if (k === 'arrowleft') { if (R.mode === 'lounge') surf(-1); }
  else if (k === ' ' || k === 'enter') { e.preventDefault(); matchKnob.press(); }
  else if (k === 'o') airKnob.press(); else if (k === 't') timerKnob.press(); else if (k === 'a') adlibKnob.press();
  else if (k === '=' || k === '+') volKnob.turn(1); else if (k === '-') volKnob.turn(-1);
  else if (k === '[') adlibKnob.turn(-1); else if (k === ']') adlibKnob.turn(1);
  else if (k === 'g') go('guide'); else if (k === 'r') go('record'); else if (k === 's') go('shelf'); else if (k === 'l') go('lounge'); else if (k === '0') go('cy');
  else if ('1234'.includes(k)) { const el = $(`.key[data-k="${+k - 1}"]`); el.classList.add('down'); el.classList.contains('dark') ? SFX.dark() : SFX.key(); setTimeout(() => el.classList.remove('down'), 110); KEYS[+k - 1]?.fn(); }
});

/* ---------------- layout + tilt ---------------- */
const dev = $('#device'), room = $('#room'), fs = $('#floorShadow'); let tilt = { x: 0, y: 0 };
function layout() {
  const vw = innerWidth, vh = innerHeight; R.pocket = vw < 760 || vw / vh < .78; document.body.classList.toggle('pocket', R.pocket);
  const w = R.pocket ? PW : W, h = R.pocket ? PH : H; R.scale = Math.min((vw - (R.pocket ? 16 : 60)) / w, (vh - (R.pocket ? 16 : 70)) / h); apply();
  fs.style.width = (w * R.scale * .92) + 'px'; fs.style.height = (60 * R.scale + 20) + 'px'; fs.style.transform = `translate(-50%, ${h * R.scale / 2 - 10}px)`;
  matchKnob.size = R.pocket ? 132 : 250; matchKnob.drawScale();
}
function apply() { dev.style.transform = `translate(-50%,-50%) scale(${R.scale}) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`; }
room.addEventListener('pointermove', e => {
  if (e.buttons) return; const mx = e.clientX / innerWidth, my = e.clientY / innerHeight;
  document.documentElement.style.setProperty('--mx', mx.toFixed(3)); document.documentElement.style.setProperty('--my', my.toFixed(3));
  if (!R.pocket && e.pointerType === 'mouse') { tilt = { x: (mx - .5) * 4, y: -(my - .5) * 3 }; apply(); }
});
addEventListener('resize', layout);
layout(); marquee(); strip(); knobLabels();
keys([{ i: '🔥', l: 'fire', fn() {} }, { i: '💗', l: 'love', fn() {} }, { i: '📺', l: 'guide', fn() {} }, { i: '📼', l: 'shelf', fn() {} }]);
lcdRender();
window.__mntv = { R, S, go, powerOn, setAir };
})();
