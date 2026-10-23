/* Music Nerd Live prototype v2 · five-knob deck · demo data only */
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
  { id: 'otis', role: 'artist', co: 'crate digger · samples', k: 'p', grind: 'flipping a soul sample', gl: 1310, drop: { len: 44, win: 'beat tape hit 20k plays', stuck: 'clearing samples', ask: 'anyone cleared a sample cheaply?' } },
  { id: 'bea', role: 'tech', co: 'ai mastering', k: 'm', grind: 'mastering api', gl: 980, drop: { len: 38, win: 'mastering beta hit 1k tracks', stuck: 'need real artist feedback', ask: 'send me a track, i will master it free' } },
];
const SKILL_OF = {
  theo: { title: 'book a 20-date tour without an agent', tags: ['touring', 'booking'], steps: ['map 3 anchor cities where you already sell 100+ tickets', 'fill the gaps with 150-cap rooms that book locals on weeknights', 'email talent buyers in batches of 10 with one link: draw, dates, guarantee ask', 'confirm in writing, then route backwards from the anchors'] },
  jules: { title: 'build a laptop-only live rig', tags: ['live', 'gear'], steps: ['bounce stems into 4 groups: drums, bass, music, vox', 'one controller, one interface, nothing else on stage', 'map 8 scenes to pads so the set survives a crash', 'run the full set twice a week at show volume'] },
  maya: { title: 'price sync licenses under 10k', tags: ['sync', 'pricing'], steps: ['anchor on use: background, featured or theme', 'quote one-stop only if you own master and publishing', 'start at 2x your floor and leave room to give', 'put term, territory and media in the first reply'] },
  ren: { title: 'launch a paid fan club in a weekend', tags: ['fans', 'revenue'], steps: ['pick one perk fans already ask for', 'price at the cost of one drink a month', 'invite your top 100 by dm, not a post', 'ship the first perk inside 48 hours'] },
  kai: { title: 'land a pilot with free visuals', tags: ['partnerships', 'creative tech'], steps: ['pick an artist with a show in 3 weeks', 'send a 15-second mock built on their single', 'ask for logo placement and footage rights, not money', 'turn the show clips into your case study'] },
  ari: { title: 'sell out a 300-cap room in your city', tags: ['shows', 'local'], steps: ['announce 5 weeks out with a limited early tier', 'have 10 friends each sell 10 tickets', 'post the countdown every 3 days with a real number', 'add a local opener who brings 40 people'] },
  dev: { title: 'write an investor update people answer', tags: ['fundraising', 'investors'], steps: ['open with one number that moved', 'three bullets: wins, misses, what is next', 'one specific ask with a name in it', 'send the same weekday every month'] },
  lux: { title: 'set your floor rate and say no', tags: ['pricing', 'booking'], steps: ['add up travel, time and gear for one gig', 'double it and call that your floor', 'say no with a counter, never just no', 'track which nos turned into better yeses'] },
  nova: { title: 'get artists to answer cold emails', tags: ['outreach', 'sales'], steps: ['subject line is their last release name', 'one sentence on why them, one on what you give', 'no deck; offer a 10-minute call link', 'follow up once at day 4 with a new reason'] },
  sol: { title: 'finish ideas with the one-track rule', tags: ['creative process'], steps: ['pick one idea per month, archive the rest', 'set a public due date with one person', 'finish at 80 percent and ship', 'review in the next session, then start the next'] },
  bea: { title: 'get feedback from 50 artists in a week', tags: ['research', 'product'], steps: ['offer something free they want (a master)', 'ask 3 questions max after delivery', 'record the calls with permission', 'tag every answer into a shared sheet'] },
  otis: { title: 'clear a sample without a label', tags: ['samples', 'legal'], steps: ['find the publisher and master owner separately', 'ask early with the exact seconds used', 'offer a flat fee plus a small split', 'never release until both signatures are in'] },
};
const CY = { id: 'c.y.', role: 'executive producer', co: 'music nerd', k: 'r' };
const YOU = { id: 'you', role: 'you', co: 'your channel', k: 'y' };
const PROMPTS = ['what are you grinding on?', 'what is the one blocker today?', 'trade one skill, right now', 'make something in 30 days?', 'who should the other meet?', 'ship it by friday?'];
const WIRE0 = ['sound of fractures · alone together on bbc radio', 'black dave · new yards episode', 'maya × theo · collab', 'week 43 drops are in', 'founders grinding right now'];
const FILTERS = [['founders', 'founder'], ['artists', 'artist'], ['tech', 'tech'], ['anyone', null]];
const TIMES = [5, 10, 15, 25, 45, 60];
const ADLIBS = [['yeah', 'YEAH!'], ['let’s go', 'LET’S GO!'], ['horn', '📯 HORN'], ['rewind', '⏪ REWIND'], ['scratch', 'SCRATCH'], ['boom', 'BOOM']];

/* ---------------- state (in memory) ---------------- */
const NERD = { theo: [13, 4.8], jules: [9, 4.7], maya: [21, 4.9], ren: [4, 4.4], kai: [11, 4.6], ari: [16, 4.8], dev: [7, 4.5], lux: [12, 4.7], nova: [8, 4.6], sol: [6, 4.5], otis: [10, 4.7], bea: [5, 4.6] };
const S = { endorsements: [], myEndorse: 3, ratings: [5, 4, 5, 5], kept: [7, 8], skills: [['maya', 'tape 06 · oct 18', 31], ['dev', 'wk 43 drop', 22], ['nova', 'tape 04 · oct 15', 18], ['theo', 'tape 02 · oct 9', 27], ['otis', 'tape 05 · oct 17', 12], ['lux', 'wk 42 drop', 15], ['bea', 'tape 03 · oct 11', 9], ['kai', 'tape 07 · oct 18', 14]].map(([by, from, uses]) => ({ by, from, uses, ...SKILL_OF[by] })), installed: ['dev'], tapes: [{ who: 'jules', date: 'oct 21', min: 12 }, { who: 'ren', date: 'oct 20', min: 9 }, { who: 'kai', date: 'oct 18', min: 15 }, { who: 'c.y.', date: 'oct 16', min: 60, replay: true }],
  streak: 12, lastDay: '', saved: 3, dropped: false, weekStreak: 13, wire: [], hands: 7, collabs: 1, helped: [], grindMin: 0 };
const R = { on: false, mode: 'lounge', ch: 0, sel: 0, partner: null, modeT: null, auto: null, cam: null, rec: null, chunks: [], blob: null, recOn: false, recLeft: 60, chipsLit: {}, playStep: 0,
  cyLive: false, pocket: false, auxIdx: 0,
  skillsOn: true, air: false, airStart: 0, timerIdx: 3, timerLeft: 25 * 60, timerRun: false, vol: 6, adlib: 1, filter: 0, incoming: null, ringT: null };
const today = () => new Date().toISOString().slice(0, 10);
const pad = n => String(Math.max(0, Math.floor(n))).padStart(2, '0');
const fmt = n => n >= 60 ? '1:00' : '0:' + String(n).padStart(2, '0');
const mmss = s => `${pad(s / 60)}:${pad(s % 60)}`;
const all = () => [...M, YOU];
const grinding = () => M.filter(m => m.grind);
const droppedCount = () => M.filter(m => m.drop).length + (S.dropped ? 1 : 0);
function bumpStreak() { const t = today(); if (S.lastDay === t) return; S.lastDay = t; S.streak++; toast(`🔥 day ${S.streak}`); }

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
const photo = m => m && m.id !== 'you' && m.id !== 'c.y.' ? `assets/feeds/${m.id}.webp` : null;
function feed(m, { talk = false, cam = false, off = false } = {}) {
  if (off) return `<div class="feed noise"></div>`;
  const p = PAL[m.k || 'p'], ph = photo(m);
  const inner = cam && R.cam ? `<video autoplay muted playsinline></video>` :
    ph ? `<div class="kbw" style="--d:${14 + (m.id.length * 3) % 9}s"><img class="ph" src="${ph}" alt="${m.id}" draggable="false"></div>` :
    (m === YOU ? `<div class="avatar" style="background:${p[4]}">you</div>` : sil(p[3]));
  return `<div class="feed ${talk ? 'talk' : ''}" style="background:linear-gradient(160deg,${p[0]} 0%,${p[1]} 55%,${p[2]} 100%)">${inner}<div class="lightleak"></div></div>`;
}
const face = (m, sz = 40) => photo(m) ? `<span class="face" style="width:${sz}px;height:${sz}px;background-image:url(${photo(m)})"></span>` : `<span class="face" style="width:${sz}px;height:${sz}px;background:${PAL[(m && m.k) || 'r'][4]}"></span>`;
const l3 = (m, sub, clock, tag = 'LIVE') => `<div class="l3"><span class="live-tag">${tag}</span><b>${m.id}</b><span class="l3s">${sub}</span>${clock ? `<span class="l3t" id="grindClock">${clock}</span>` : ''}</div>`;
function chFlash(n) { const d = document.createElement('div'); d.className = 'chflash'; d.textContent = 'CH ' + n; $('#reacts').appendChild(d); setTimeout(() => d.remove(), 1100); crt.classList.remove('roll'); void crt.offsetWidth; crt.classList.add('roll'); }
function attachCam() { if (R.cam) view.querySelectorAll('video:not([src])').forEach(v => { v.srcObject = R.cam; v.play().catch(() => {}); }); }
async function getCam() { if (R.cam) return R.cam; try { R.cam = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false }); } catch { R.cam = null; } return R.cam; }
function stopCam() { if (R.cam) { R.cam.getTracks().forEach(t => t.stop()); R.cam = null; } }
const st = (txt, cls = '', css = '', r = 0) => `<div class="sticker ${cls} pop" style="--r:${r}deg;${css}">${txt}</div>`;
let toastT;
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600); }
function staticBurst(ms = 380) { const o = $('#staticOv'); o.classList.add('on', 'noise'); SFX.static(ms / 1000); setTimeout(() => o.classList.remove('on'), ms); }
function react(e, n = 1) {
  if (R.mode === 'call' && R.sess) R.sess.reacts += n;
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
  $('#lcdMid').textContent = R.mode === 'skills' || R.mode === 'skill' ? `${S.skills.length} playbooks` : R.mode === 'call' && R.partner ? `with ${R.partner.id}` : R.air ? (R.timerRun ? 'on air' : 'on air · paused') : R.timerRun ? 'timer running' : `${grinding().length} grinding now`;
}
function lcdFlash(a, al, b, bl, mid) { lcdTemp = { a, al, b, bl, mid }; lcdRender(); clearTimeout(lcdTempT); lcdTempT = setTimeout(() => { lcdTemp = null; lcdRender(); }, 1300); }
setInterval(() => {
  M.forEach(m => { if (m.grind && m.gl > 0) m.gl--; });
  if (R.on && R.timerRun) {
    R.timerLeft--; if (R.air) S.grindMin += 1 / 60;
    if (R.timerLeft <= 0) timerDone();
  }
  if (R.on) { lcdRender(); const g = $('#grindClock'); if (g) g.textContent = R.mode === 'lounge' && curChan() === YOU ? mmss(R.timerLeft) : mmss(curChan().gl || 0); }
}, 1000);
function timerDone() {
  R.timerRun = false; R.timerLeft = TIMES[R.timerIdx] * 60; SFX.alarm(); flashText('TIME!');
  if (R.mode === 'call') go('after');
  if (R.air) setAir(false, true);
  toast(`session done · ${Math.max(1, Math.round(S.grindMin))} min logged`);
}

/* ---------------- icons (engraved keycap legends) ---------------- */
const IC = {
  flame: '<path d="M12 2c.7 3.6 6 5.8 6 11.3A6 6 0 0 1 6 13.3c0-3 1.5-4.8 3-6 .1 2.4 1.1 3.8 2.6 4.1-.5-3.9-.6-6.6.4-9.4z"/><path d="M12 21a2.6 2.6 0 0 1-2.6-2.6c0-1.6 1.4-2.4 2.6-3.9 1.2 1.5 2.6 2.3 2.6 3.9A2.6 2.6 0 0 1 12 21z"/>',
  tv: '<rect x="2.5" y="7" width="19" height="13.5" rx="3"/><path d="M8 2.8l4 4 4-4"/>',
  tape: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><circle cx="8" cy="11.5" r="2.2"/><circle cx="16" cy="11.5" r="2.2"/><path d="M7 19l1.5-3h7L17 19"/>',
  spark: '<path d="M11 3l1.9 5.4L18.3 10l-5.4 1.9L11 17.3l-1.9-5.4L3.7 10l5.4-1.6z"/><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  phones: '<path d="M3.5 15v-3a8.5 8.5 0 0 1 17 0v3"/><rect x="3" y="14" width="4.5" height="7" rx="1.6"/><rect x="16.5" y="14" width="4.5" height="7" rx="1.6"/>',
  x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  collab: '<circle cx="9" cy="12" r="5.2"/><circle cx="15" cy="12" r="5.2"/>',
  hand: '<path d="M7.5 12V6.2a1.5 1.5 0 0 1 3 0V11m0-.8V4.6a1.5 1.5 0 0 1 3 0V11m0-4.8a1.5 1.5 0 0 1 3 0V12m0-2.6a1.5 1.5 0 0 1 3 0v4.4a7.2 7.2 0 0 1-7.2 7.2h-.6a7 7 0 0 1-5.9-3.2L4 15a1.6 1.6 0 0 1 2.6-1.8l.9 1.2"/>',
  seal: '<circle cx="12" cy="9" r="5.8"/><path d="M8.6 13.7L7.2 21.5l4.8-2.6 4.8 2.6-1.4-7.8"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 2.8v4M16 2.8v4"/><path d="M8.5 15l2.2 2.2 4.8-4.4"/>',
  home: '<path d="M3.5 11L12 4l8.5 7v8.5a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1z"/>',
  play: '<path d="M7.5 4.8l12 7.2-12 7.2z" class="fill"/>',
  rec: '<circle cx="12" cy="12" r="6.6" class="fill rec"/>',
  stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="2" class="fill"/>',
  next: '<path d="M5 5l9.5 7L5 19z" class="fill"/><path d="M18.5 5v14"/>',
  trophy: '<path d="M8 3.5h8v5.5a4 4 0 0 1-8 0zM8 5.5H4.5A3.2 3.2 0 0 0 8 9.6M16 5.5h3.5A3.2 3.2 0 0 1 16 9.6M12 13v4M8.5 21h7M10 17h4"/>',
  wall: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 12h18M9.5 5v7M14.5 12v7"/>',
  ask: '<circle cx="12" cy="12" r="9"/><path d="M9.4 9.3a2.7 2.7 0 1 1 3.8 2.5c-.7.3-1.2 1-1.2 1.8v.4M12 17.2h.01"/>',
  down: '<path d="M12 3.5v11.5M7 10.5l5 5 5-5M4.5 20h15"/>',
  pin: '<path d="M12 16.5V21.5M8.2 3h7.6l-1 6.2 3 2.8v2.2H6.2V12l3-2.8z"/>',
  check: '<path d="M5 12.5l4.6 4.6L19 7.5"/>',
  phone: '<path d="M5.2 3h3.9l1.9 4.8-2.4 1.5a10.6 10.6 0 0 0 6.1 6.1l1.5-2.4 4.8 1.9v3.9a2 2 0 0 1-2.2 2A16.4 16.4 0 0 1 3.2 5.2 2 2 0 0 1 5.2 3z"/>',
  stack: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12.5l9 5 9-5M3 17l9 5 9-5"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.8 1.8H4.2zM10 21h4"/>',
  back: '<path d="M10.5 5.5L4 12l6.5 6.5M4.5 12H20"/>',
  mark: '<path d="M6.5 3.5h11v17.5l-5.5-3.8-5.5 3.8z"/>',
};
const EMO = { '🔥': 'flame', '📺': 'tv', '📼': 'tape', '🧠': 'spark', '🎧': 'phones', '✕': 'x', '🤝': 'collab', '👋': 'hand', '🙋': 'hand', '✋': 'hand', '🏅': 'seal', '📅': 'cal', '🏠': 'home', '▶️': 'play', '🔴': 'rec', '⏹': 'stop', '⏭': 'next', '🏆': 'trophy', '🧱': 'wall', '❓': 'ask', '💾': 'down', '📌': 'pin', '✅': 'check', '📞': 'phone', '📥': 'stack', '🔔': 'bell', '↩': 'back', '🔖': 'mark' };
const icon = n => n && IC[EMO[n] || n] ? `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[EMO[n] || n]}</svg>` : '';
const BLANK = { i: '', l: '', fn: null };

/* ---------------- keys ---------------- */
let KEYS = [];
function keys(arr, matchLabel = 'match') {
  KEYS = arr; $('.key[data-k="3"]').classList.add('dark');
  arr.forEach((k, i) => { $(`#k${i}i`).innerHTML = icon(k.i); $(`#k${i}l`).textContent = k.l; const el = $(`.key[data-k="${i}"]`); el.classList.toggle('lit', !!k.lit); el.classList.toggle('blank', !k.fn); el.disabled = !k.fn; el.setAttribute('aria-label', k.l || 'unused'); });
  $('#kMatch .knob-lab').textContent = matchLabel;
}
function marquee() { const items = [...S.wire.slice(-4).reverse(), ...WIRE0]; const html = items.map(t => `<span>${t}</span>`).join(''); $('#marqRun').innerHTML = html + html; }
function strip() {
  const chans = [{ ...CY, n: '00' }, ...M.map((m, i) => ({ ...m, n: pad(i + 1) })), { ...YOU, n: pad(M.length + 1) }];
  $('#strip').innerHTML = `<button class="ch skch ${R.mode === 'skills' || R.mode === 'skill' ? 'on' : ''}" data-ch="sk"><span class="sw" style="display:grid;place-items:center;background:#1d1b20">🧠</span><span class="n">SK</span>skills<span class="cnt">${S.skills.length}</span></button>` + chans.map((m, i) => {
    const live = m.id === 'c.y.' ? R.cyLive : m.id === 'you' ? R.air : !!m.grind;
    const p = PAL[m.k], on = (R.mode === 'cy' && i === 0) || (R.mode === 'lounge' && i === R.ch + 1);
    return `<button class="ch ${on ? 'on' : ''}" data-ch="${i}"><span class="sw ${live ? '' : 'off noise'}" style="${live ? (photo(m) ? `background:url(${photo(m)}) center/cover` : `background:linear-gradient(160deg,${p[0]},${p[2]})`) : ''}"></span><span class="n">${m.n}</span>${m.id}${live ? '<span class="live"></span>' : ''}</button>`;
  }).join('');
  const on = $('#strip .ch.on'); if (on) on.scrollIntoView({ block: 'nearest', inline: 'center' });
  stripFade();
}
function stripFade() { const el = $('#strip'); el.classList.toggle('end', el.scrollLeft + el.clientWidth >= el.scrollWidth - 4); }
const curChan = () => all()[(R.ch + all().length) % all().length];

/* ---------------- modes ---------------- */
function clearModeTimers() { clearInterval(R.modeT); clearTimeout(R.modeT); R.modeT = null; clearInterval(R.auto); R.auto = null; }
function go(mode, opts = {}) { clearModeTimers(); R.mode = mode; $('#kMatch').classList.remove('ringing'); MODES[mode](opts); strip(); lcdRender(); }
const MODES = {
  lounge() {
    const m = curChan(), isYou = m === YOU, live = isYou ? true : !!m.grind;
    view.innerHTML = feed(m, { off: !live, cam: isYou }) +
      `<div class="osd" style="left:30px;top:26px;font-size:30px">CH ${pad(R.ch + 1)}</div>` +
      (live ? (isYou ? l3(YOU, R.air ? 'on air · matchable' : 'off air · turn on air to get matched', R.air ? mmss(R.timerLeft) : '', R.air ? 'LIVE' : 'YOU') : l3(m, `🏅 ${(NERD[m.id] || [0])[0]} · ${m.co} · ${m.grind}`, mmss(m.gl)))
        : `<div class="l3 off"><span class="live-tag off">OFF</span><b>${m.id}</b><span class="l3s">not grinding right now</span></div>`) +
      st(`🔥 ${S.streak} day streak`, '', 'right:30px;top:26px;font-size:20px', -5) +
      (live && !isYou && SKILL_OF[m.id] ? `<button class="skchip" data-sk="${m.id}">🧠 ${SKILL_OF[m.id].title}</button>` : '');
    const sc = view.querySelector('.skchip'); if (sc) sc.addEventListener('click', () => { SFX.key(); openSkill(sc.dataset.sk); });
    if (isYou) getCam().then(c => { if (c && R.mode === 'lounge' && curChan() === YOU) { view.querySelector('.feed').outerHTML = feed(YOU, { cam: true }); attachCam(); } });
    keys([{ i: '📺', l: 'guide', fn: () => go('guide') }, { i: '🧠', l: 'skills', fn: () => go('skills') }, { i: '📼', l: 'shelf', fn: () => go('shelf') }, BLANK]);
    R.auto = setInterval(() => { if (live && Math.random() < .5) react(['🔥', '💗', '🎧', '😂'][Math.random() * 4 | 0]); }, 2600);
  },
  tuning({ who }) {
    const [label, role] = FILTERS[R.filter];
    let pool = grinding().filter(m => !role || m.role === role).filter(m => !R.partner || m.id !== R.partner.id || grinding().length < 2);
    if (!pool.length && !who) { toast(`no ${label} grinding right now · turn match to anyone`); go('lounge'); return; }
    const p = who || pool[Math.random() * pool.length | 0];
    view.innerHTML = `<div class="feed noise"></div><div class="slotwin"><div class="slot" id="slot">${[...pool, ...pool, ...pool].slice(0, 12).map(m => face(m, 120)).join('')}</div></div><div class="osd sans" style="left:50%;bottom:40px;transform:translateX(-50%);font-size:18px;white-space:nowrap">matching · ${label}</div>`;
    SFX.static(1.2); let k = 0; const slot = $('#slot'); R.modeT = setInterval(() => { SFX.tick(); if (slot) slot.style.transform = `translateX(${-k * 136}px)`; if (++k > 8) { clearInterval(R.modeT); R.partner = p; if (slot) { slot.innerHTML = face(p, 120); slot.style.transition = 'none'; slot.style.transform = 'none'; slot.classList.add('hit'); } SFX.win(); R.modeT = setTimeout(() => go('call'), 700); } }, 140);
    keys([BLANK, BLANK, BLANK, { i: '✕', l: 'cancel', fn: () => go('lounge') }], 'end');
    getCam();
  },
  call() {
    const p = R.partner; bumpStreak(); staticBurst(260); hideRing();
    if (!R.timerRun) R.timerRun = true;
    R.callStart = Date.now(); R.sess = { reacts: 0, aux: 0, adYou: 0, adThem: 0, prompt: '' };
    view.innerHTML = feed(p, { talk: true }) + l3(p, `${p.co} · ${p.grind}`, '') +
      `<div class="pip">${feed(YOU, { cam: true })}<span class="pip-l">you</span></div>` +
      (R.skillsOn ? `<div class="skrec"><span class="dotk"></span>skills rec · both on</div>` : '') +
      st(PROMPTS[Math.random() * PROMPTS.length | 0], 'w', 'left:50%;top:28px;transform:translateX(-50%);font-size:26px;padding:12px 24px');
    attachCam(); getCam().then(() => { if (R.mode === 'call') { const pf = view.querySelector('.pip .feed'); if (pf && R.cam && !pf.querySelector('video')) { pf.outerHTML = feed(YOU, { cam: true }); attachCam(); } } });
    if (R.onboard === 1) setOnboard(2);
    keys([{ i: '🔥', l: 'react', fn: () => react('🔥', 3) }, { i: '🔖', l: 'mark it', fn: markMoment }, { i: '🎧', l: 'pass aux', fn: passAux }, { i: '✕', l: 'end', fn: () => go('after') }], 'end');
    R.auto = setInterval(() => { const r = Math.random(); if (r < .45) react(['😂', '🔥', '💗', '🎧'][Math.random() * 4 | 0]); else if (r < .52) { const a = Math.random() * ADLIBS.length | 0; ADLIB_FX[a](); flashText(ADLIBS[a][1]); R.sess.adThem++; } }, 2600);
  },
  after() {
    const p = R.partner || M[0], ss = R.sess || { reacts: 0, aux: 0, adYou: 0, adThem: 0 };
    const secs = Math.max(30, Math.round((Date.now() - (R.callStart || Date.now())) / 1000)), mins = Math.max(1, Math.round(secs / 60));
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase();
    S.tapes.unshift({ who: p.id, date, min: mins });
    const n = S.tapes.length, sk = SKILL_OF[p.id], topic = sk ? sk.tags[0] : 'craft';
    const you = 38 + ((p.id.charCodeAt(0) * 7 + n * 5) % 22), energy = Math.min(99, 40 + ss.reacts * 4 + (ss.adYou + ss.adThem) * 7 + ss.aux * 5);
    let skillRow = '<span class="muted">skills rec off · no playbook saved</span>';
    if (R.skillsOn && sk) { const r = saveSkill(p); skillRow = `<button class="rp-skill" data-by="${p.id}">🧠 ${sk.title}<small>${r.merged ? 'merged · v' + r.v : 'new playbook'}</small></button>`; }
    const [nerdN, nerdAvg] = NERD[p.id] || [3, 4.5];
    R.rate = 0; R.rateLocked = false; R.tags = new Set(); R.endorsed = false;
    R.items = [
      { who: 'you', t: p.drop ? `answer ${p.id}'s ask: ${p.drop.ask}` : `send ${p.id} one intro for ${p.grind}`, due: 'fri', done: false },
      { who: p.id, t: sk ? `send you their playbook: ${sk.title}` : `share notes on ${p.grind}`, due: 'thu', done: false },
      { who: 'both', t: 'rematch in 3 days to check progress', due: 'mon', done: false },
    ];
    if (ss.marks) R.items.splice(2, 0, { who: 'you', t: `review the ${ss.marks} moment${ss.marks > 1 ? 's' : ''} you marked`, due: 'today', done: false });
    view.innerHTML = `<div class="report">
      <section class="rp-card rp-sess">
        <div class="rp-hd">${face(p, 44)}<div><b>${p.id} × you</b><small>session ${pad(n)} · tape ${pad(n)} · ${date}</small></div></div>
        <div class="rp-stats">
          <div><span class="rp-n">${pad(mins)}</span><span class="rp-l">minutes</span></div>
          <div><span class="rp-n">${pad(energy)}</span><span class="rp-l">energy</span></div>
          <div><span class="rp-n">${pad(ss.reacts)}</span><span class="rp-l">reactions</span></div>
          <div><span class="rp-n">${pad(ss.adYou + ss.adThem)}</span><span class="rp-l">adlibs</span></div>
        </div>
        <div class="rp-bar"><span style="width:${you}%"></span><em>you ${you}%</em><em>${p.id} ${100 - you}%</em></div>
        <div class="rp-topics"><span>${topic}</span>${sk ? sk.tags.slice(1).map(t => `<span>${t}</span>`).join('') : ''}<span>${p.role}</span></div>
        ${skillRow}
      </section>
      <section class="rp-card rp-rate">
        <div class="rp-k">rate this session</div>
        <div class="stars" id="stars">${[1, 2, 3, 4, 5].map(i => `<button data-v="${i}" aria-label="${i} stars">★</button>`).join('')}</div>
        <div class="rp-hint" id="rateHint">turn match · press to lock</div>
        <div class="rp-tags">${['learned something', 'intro made', 'would rematch'].map(t => `<button data-t="${t}">${t}</button>`).join('')}</div>
        <div class="rp-data" id="rateData">${p.id}: ${nerdAvg.toFixed(1)} avg · ${nerdN} nerd endorsements in ${topic}</div>
      </section>
      <section class="rp-card rp-next">
        <div class="rp-k">next moves <small>drafted from the call</small></div>
        <div id="items">${R.items.map((it, i) => `<button class="item" data-i="${i}"><span class="box"></span><span class="it-t">${it.t}</span><span class="it-m">${it.who === 'you' ? face(YOU, 20) : it.who === 'both' ? '👥' : face(p, 20)} ${it.due}</span></button>`).join('')}</div>
        <div class="rp-kept">promises kept <b id="keptPct">${Math.round(S.kept[0] / S.kept[1] * 100)}%</b> · last 30 days</div>
      </section>
      <section class="rp-pon" id="pon"><div class="pon-l"><span class="pon-badge">PROOF OF NERD</span><span>vouch for ${p.id} in <b>${topic}</b>. you both sign, it lands on their channel and ranks them higher in matching.</span></div><span class="pon-key" id="ponBtn"><span class="kcap">${icon('seal')}</span>press endorse</span></section>
    </div>`;
    SFX.win(); flashText('SESSION SAVED');
    view.querySelectorAll('#stars button').forEach(b => { b.addEventListener('mouseenter', () => !R.rateLocked && paintStars(+b.dataset.v)); b.addEventListener('click', () => { R.rate = +b.dataset.v; lockRate(); }); });
    $('#stars').addEventListener('mouseleave', () => paintStars(R.rate));
    view.querySelectorAll('.rp-tags button').forEach(b => b.addEventListener('click', () => { SFX.key(); b.classList.toggle('on'); R.tags[b.classList.contains('on') ? 'add' : 'delete'](b.dataset.t); }));
    view.querySelectorAll('.item').forEach(b => b.addEventListener('click', () => toggleItem(+b.dataset.i)));
    const rs = view.querySelector('.rp-skill'); if (rs) rs.addEventListener('click', () => openSkill(rs.dataset.by));
    
    keys([{ i: '🏅', l: 'endorse', fn: () => endorse(p, topic) }, { i: '📅', l: 'rematch', fn: () => followUp(p) }, { i: '🤝', l: 'collab', fn: collab }, { i: '🏠', l: 'done', fn: () => go('lounge') }], 'rate');
    function collab() {
      if (KEYS[2].lit) return; KEYS[2].lit = true; $('.key[data-k="2"]').classList.add('lit'); toast(`collab sent to ${p.id}`);
      setTimeout(() => { S.wire.push(`${p.id} × you · collab`); S.collabs++; marquee(); SFX.win(); toast(`${p.id} tapped collab too · you're on the wire`); react('🤝', 4); }, 1700);
    }
  },
  guide() {
    const list = all(); R.sel = Math.min(R.sel, list.length - 1);
    view.innerHTML = `<div class="grid"><div class="hd"><div class="hd-t">this week on <i>music nerd live</i></div>${st("c.y.'s pick: kai", '', 'position:static;transform:rotate(-3deg);font-size:17px')}<div class="osd sans" style="position:static">wk 43 · ${droppedCount()} of ${list.length} dropped</div></div>` +
      list.map((m, i) => { const d = m === YOU ? S.dropped : !!m.drop;
        return `<div class="tile" data-i="${i}" style="${i === R.sel ? 'box-shadow:0 0 0 3px #fff' : ''}">${feed(m, { off: !d })}` +
          (d ? `<div class="len">${fmt(m === YOU ? (R.myDrop ? R.myDrop.len : 60) : m.drop.len)}</div><div class="tag" style="color:${m.id === 'kai' ? 'var(--pink)' : 'var(--mint)'}">${m.id === 'kai' ? 'PICK' : 'NEW'}</div>` : `<div class="tag" style="color:#ff3b5c">OFF AIR</div>`) +
          `<div class="co">${m.co}</div><div class="nm">${m.id}</div></div>`; }).join('') + `</div>`;
    view.querySelectorAll('.tile').forEach(t => t.addEventListener('click', () => { R.sel = +t.dataset.i; SFX.key(); go('play', {}); }));
    keys([{ i: '▶️', l: 'play all', fn: () => { R.sel = 0; go('play', { auto: true }); } }, { i: '🙋', l: 'open asks', fn: asks }, { i: '🔴', l: S.dropped ? 'redo drop' : 'your drop', fn: () => go('record'), lit: !S.dropped }, { i: '🏠', l: 'lounge', fn: () => go('lounge') }]);
  },
  play({ auto }) {
    const list = all(), m = list[R.sel], isYou = m === YOU;
    if ((isYou && !S.dropped) || (!isYou && !m.drop)) {
      view.innerHTML = feed(m, { off: true }) + `<div class="bigname" style="left:30px;bottom:74px;font-size:96px">${m.id}</div>` + st('no drop this week', 'r', 'right:34px;top:30px', -4) + `<div class="osd sans" style="left:34px;bottom:40px;color:#ff3b5c">off air · due friday</div>`;
      keys([isYou ? { i: '🔴', l: 'your drop', fn: () => go('record') } : { i: '🔔', l: 'nudge', fn: () => toast(`nudged ${m.id} · due friday`) }, { i: '⏭', l: 'next', fn: () => nextDrop(auto) }, BLANK, { i: '↩', l: 'guide', fn: () => go('guide') }]);
      if (auto) R.modeT = setTimeout(() => nextDrop(true), 1800); return;
    }
    const d = isYou ? R.myDrop : m.drop, steps = [['win', d.win, 'var(--mint)'], ['stuck', d.stuck, 'var(--cyan)'], ['ask', d.ask, 'var(--pink)']];
    view.innerHTML = (isYou && R.blob ? `<div class="feed"><video autoplay playsinline loop src="${R.blob}" style="transform:scaleX(-1)"></video></div>` : feed(m, { talk: true })) +
      `<div class="osd" style="left:30px;top:26px;font-size:30px">DROP</div><div class="osd sans" style="left:34px;top:70px">${m.id} · ${m.co} · wk 43</div>` + (m.id === 'kai' ? st("c.y.'s pick", '', 'right:34px;top:30px', -5) : '') + `<div class="caption" id="cap"></div>`;
    let i = 0, el = 0;
    const show = () => { const [k, t, c] = steps[i]; $('#cap').innerHTML = `<b style="color:${c}">${k}</b>${t}`; R.playStep = i; $('.key[data-k="2"]').classList.toggle('lit', i === 2); };
    keys([{ i: '🙋', l: 'i got you', fn: () => helpAsk(m) }, { i: '⏭', l: 'next', fn: () => nextDrop(auto) }, { i: '🔥', l: 'react', fn: () => react('🔥', 3) }, { i: '↩', l: 'guide', fn: () => go('guide') }], 'next');
    show(); R.modeT = setInterval(() => { el++; if (el % 4 === 0 && i < 2) { i++; show(); } if (auto && el >= 12) nextDrop(true); }, 1000);
  },
  record() {
    R.chipsLit = {}; R.recOn = false; R.recLeft = 60;
    const render = () => {
      view.innerHTML = feed(YOU, { cam: true }) + (R.recOn ? '<div class="recring"></div>' : '') +
        `<div class="osd" style="left:30px;top:26px;font-size:30px">${R.recOn ? 'REC 00:' + pad(R.recLeft) : 'CH ' + pad(M.length + 1)}</div>` +
        st('your weekly drop', 'w', 'left:30px;top:78px;font-size:30px', -3) + st('due fri 🔔', '', 'right:34px;top:30px', -6) + st(`wk ${S.weekStreak} in a row`, 'm', 'right:56px;top:96px', 5) +
        (R.recOn ? '' : st('press 🔴 to record 60 sec', 'c', 'left:50%;top:52%;transform:translateX(-50%)')) +
        `<div class="chips">${['win', 'stuck', 'ask'].map((c, i) => `<span class="chip ${R.chipsLit[c] ? 'lit' : ''}" style="background:${['var(--mint)', 'var(--cyan)', 'var(--pink)'][i]}">1 ${c}</span>`).join('')}</div>`;
      attachCam();
    };
    R.recRender = render; render(); getCam().then(() => { if (R.mode === 'record') render(); });
    const mark = c => { R.chipsLit[c] = true; view.querySelectorAll('.chip').forEach((el, i) => el.classList.toggle('lit', !!R.chipsLit[['win', 'stuck', 'ask'][i]])); };
    keys([{ i: R.recOn ? '⏹' : '🔴', l: R.recOn ? 'send' : 'record', fn: () => R.recOn ? sendDrop() : startRec(), lit: true }, { i: '🏆', l: 'win', fn: () => mark('win') }, { i: '🧱', l: 'stuck', fn: () => mark('stuck') }, { i: '❓', l: 'ask', fn: () => mark('ask') }]);
    $('.key[data-k="3"]').classList.remove('dark');
  },
  shelf() {
    view.innerHTML = `<div class="grid shelf"><div class="hd"><div class="hd-t">your <i>shelf</i></div><div class="osd sans" style="position:static">${S.tapes.length} tapes · ${S.collabs} collabs · ${Math.round(S.grindMin)} min grinding</div></div>` +
      S.tapes.slice(0, 12).map(t => { const m = [...M, CY].find(x => x.id === t.who) || M[0]; return `<div class="tape"><div class="lb" style="background:${t.replay ? '#f4f2f5' : PAL[m.k][4]}"><span class="lbf">${face(m, 34)}</span>${t.replay ? 'c.y. live' : t.who + ' × you'}<small>${t.replay ? 'replay' : t.min + ' min'} · ${t.date}</small></div><div class="reels"><div class="reel"></div><div class="reel"></div></div></div>`; }).join('') + `</div>`;
    keys([{ i: '🧠', l: 'skills', fn: () => go('skills') }, { i: '📺', l: 'guide', fn: () => go('guide') }, BLANK, { i: '🏠', l: 'lounge', fn: () => go('lounge') }]);
  },
  skills({ q = '' } = {}) {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const score = k => terms.reduce((a, t) => a + ((k.title + ' ' + k.tags.join(' ') + ' ' + k.steps.join(' ') + ' ' + k.by).toLowerCase().includes(t) ? 1 : 0), 0);
    const list = (terms.length ? S.skills.filter(k => score(k) > 0).sort((a, b) => score(b) - score(a)) : [...S.skills].sort((a, b) => b.uses - a.uses));
    R.skList = list; R.sel = Math.min(R.sel, Math.max(0, list.length - 1));
    view.innerHTML = `<div class="skwrap"><div class="skhd"><div class="hd-t">skills <i>channel</i></div><div class="osd sans" style="position:static">${S.skills.length} playbooks · built from ${S.tapes.length + 41} chats</div></div>
      <label class="skq"><span>🧠</span><input id="skq" placeholder="ask the network… (pricing, touring, investors)" value="${q.replace(/"/g, '')}" autocomplete="off"></label>
      <div class="skgrid">${list.length ? list.map((k, i) => cart(k, i)).join('') : `<div class="empty">no playbook yet · match someone and turn skills rec on</div>`}</div></div>`;
    const inp = $('#skq'); inp.addEventListener('input', () => { clearTimeout(R.qT); R.qT = setTimeout(() => { const v = inp.value; go('skills', { q: v }); const n = $('#skq'); n.focus(); n.setSelectionRange(v.length, v.length); }, 220); });
    view.querySelectorAll('.cart').forEach(c => c.addEventListener('click', () => { SFX.key(); openSkill(c.dataset.by); }));
    keys([{ i: '📥', l: 'my stack', fn: () => { const ins = S.skills.filter(k => S.installed.includes(k.by)); toast(ins.length ? `your stack · ${ins.map(k => k.title).join(' · ')}` : 'nothing installed yet'); } }, BLANK, BLANK, { i: '🏠', l: 'lounge', fn: () => go('lounge') }], 'open');
  },
  skill({ by }) {
    const k = S.skills.find(x => x.by === by) || { by, from: 'not captured yet', uses: 0, ...SKILL_OF[by] }, m = M.find(x => x.id === by), ins = S.installed.includes(by);
    R.skBy = by;
    view.innerHTML = `<div class="skdetail"><div class="skd-l"><div class="cart big" style="--c:${PAL[m.k][4]}"><div class="cart-lb">${face(m, 46)}<b>${k.title}</b></div><div class="cart-meta">${m.id} · ${k.from}</div><div class="cart-notch"></div></div>
      <div class="skd-by">${face(m, 34)}<span>taught by <b>${m.id}</b> · ${m.co}</span></div><div class="skd-tags">${k.tags.map(t => `<span>${t}</span>`).join('')}</div><div class="skd-uses">${k.uses} founders installed</div></div>
      <ol class="skd-steps">${k.steps.map(t => `<li>${t}</li>`).join('')}</ol></div>`;
    keys([{ i: '💾', l: 'export', fn: () => exportSkill(k, m) }, { i: ins ? '✅' : '📌', l: ins ? 'installed' : 'install', fn: () => { if (!S.installed.includes(by)) { S.installed.push(by); k.uses++; SFX.win(); flashText('INSTALLED'); toast(`${k.title} is in your stack`); go('skill', { by }); } }, lit: ins }, { i: '📞', l: 'learn live', fn: () => learnLive(m) }, { i: '↩', l: 'skills', fn: () => go('skills') }], 'call');
  },
  cy() {
    if (!R.cyLive) {
      view.innerHTML = `<div class="feed noise"></div><div class="bigname" style="left:30px;bottom:74px;font-size:96px">c.y.</div><div class="osd sans" style="left:34px;bottom:40px;color:#ff3b5c">off air · he drops in when he drops in</div>` + st('stay tuned', 'w', 'right:34px;top:30px', -4);
      keys([{ i: '🔔', l: 'notify me', fn: () => toast("you'll get a ping when c.y. goes live") }, BLANK, BLANK, { i: '🏠', l: 'lounge', fn: () => go('lounge') }]); return;
    }
    view.innerHTML = feed(CY, { talk: true }) + `<div class="osd" style="left:30px;top:26px;font-size:32px">CH 00</div><div class="bigname" style="left:30px;bottom:74px;font-size:110px">c.y.</div><div class="osd sans" style="left:34px;bottom:40px">live · ${16 + S.hands} watching · recording to the shelf</div>` +
      st('SAFE or priced?', 'w', 'right:34px;top:30px;font-size:28px', -4) + st(`✋ ${S.hands + 2} asked this`, '', 'right:60px;top:100px', 4);
    keys([{ i: '✋', l: 'raise hand', fn: raise }, { i: '🔥', l: 'react', fn: () => react('🔥', 3) }, BLANK, { i: '🏠', l: 'lounge', fn: () => go('lounge') }]);
    R.auto = setInterval(() => react(['💗', '🔥', '✋', '💗'][Math.random() * 4 | 0], 1 + (Math.random() * 2 | 0)), 1400);
  },
};
function paintStars(v) { view.querySelectorAll('#stars button').forEach(b => b.classList.toggle('on', +b.dataset.v <= v)); const h = $('#rateHint'); if (h && !R.rateLocked) h.textContent = v ? ['', 'meh', 'ok', 'good', 'great', 'legendary'][v] + ' · press to lock' : 'turn match · press to lock'; }
function rateTurn(dir) { if (R.rateLocked) return false; R.rate = Math.max(1, Math.min(5, (R.rate || 0) + dir)); paintStars(R.rate); matchKnob.ind.style.transform = `rotate(${-120 + (R.rate - 1) * 60}deg)`; lcdFlash(pad(R.rate), 'stars', '05', 'of', ['', 'meh', 'ok', 'good', 'great', 'legendary'][R.rate]); return true; }
function lockRate() {
  if (!R.rate) { toast('turn match to pick 1 to 5 stars first'); return; }
  R.rateLocked = true; S.ratings.push(R.rate); paintStars(R.rate); SFX.win(); buzz([20, 40, 20]);
  const avg = S.ratings.reduce((a, b) => a + b, 0) / S.ratings.length, p = R.partner, [, pa] = NERD[p.id] || [0, 4.5];
  $('#rateHint').textContent = `locked · ${R.rate} ★${R.tags.size ? ' · ' + [...R.tags].join(', ') : ''}`;
  $('#rateData').innerHTML = `you avg <b>${avg.toFixed(1)}★</b> · ${p.id} avg <b>${pa.toFixed(1)}★</b><br>${R.rate >= 4 ? `${p.id} moves to the top of your matches` : `next match will be someone new`}`;
  view.querySelector('.rp-rate').classList.add('locked'); $('#kMatch .knob-lab').textContent = 'match';
  if (R.rate >= 4 && !R.endorsed) $('#pon').classList.add('nudge');
}
function toggleItem(i) {
  const it = R.items[i]; it.done = !it.done; SFX.key();
  const b = view.querySelector(`.item[data-i="${i}"]`); b.classList.toggle('done', it.done);
  if (it.done) { S.kept[0]++; S.kept[1]++; react('✅', 2); } else { S.kept[0]--; S.kept[1]--; }
  $('#keptPct').textContent = Math.round(S.kept[0] / S.kept[1] * 100) + '%';
}
function followUp(p) {
  const d = new Date(Date.now() + 3 * 864e5); d.setHours(16, 0, 0, 0); const e = new Date(d.getTime() + 15 * 6e4);
  const f = x => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const notes = R.items.map(it => `- ${it.who}: ${it.t} (${it.due})`).join('\\n');
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Music Nerd Live//EN\r\nBEGIN:VEVENT\r\nUID:mntv-${Date.now()}@musicnerd\r\nDTSTAMP:${f(new Date())}\r\nDTSTART:${f(d)}\r\nDTEND:${f(e)}\r\nSUMMARY:Music Nerd Live rematch · ${p.id} × you\r\nDESCRIPTION:Next moves from session ${pad(S.tapes.length)}:\\n${notes}\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = `music-nerd-live-rematch-${p.id}.ics`; document.body.appendChild(a); a.click(); a.remove(); } catch {}
  SFX.win(); toast(`rematch · ${d.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase()} 4pm · invite saved`);
  $('.key[data-k="1"]').classList.add('lit');
}
function hash(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16).toUpperCase().padStart(8, '0'); }
function endorse(p, topic) {
  if (R.endorsed) { toast(`you already endorsed ${p.id} this session`); return; }
  R.endorsed = true; const n = (NERD[p.id] = NERD[p.id] || [0, 4.5]); n[0]++;
  const id = `PON-${pad(S.tapes.length)}-${p.id.toUpperCase()}-${hash(p.id + topic + Date.now()).slice(0, 4)}`;
  S.endorsements.push({ to: p.id, topic, id });
  const box = document.createElement('div'); box.className = 'pon-cert';
  box.innerHTML = `<div class="cert"><svg class="stamp" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="c" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"/></defs><circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" stroke-width="2.5"/><text font-size="17" font-weight="900" letter-spacing="5" fill="currentColor"><textPath href="#c">PROOF OF NERD · PROOF OF NERD ·</textPath></text><text x="100" y="112" text-anchor="middle" font-size="40" fill="currentColor">🤓</text></svg>
    <div class="cert-b"><div class="cert-k">nerd endorsement</div><div class="cert-t">you endorsed <b>${p.id}</b> for <b>${topic}</b></div>
    <div class="cert-sig"><span>${face(YOU, 28)} you <i class="ok">signed</i></span><span id="cosig">${face(p, 28)} ${p.id} <i class="wait">signing…</i></span></div>
    <div class="cert-m">receipt ${id} · session ${pad(S.tapes.length)} · ${R.rate ? R.rate + '★ · ' : ''}${Math.max(1, Math.round((Date.now() - R.callStart) / 60000))} min</div>
    <div class="cert-m">${p.id} now has <b>${n[0]}</b> nerd endorsements in ${topic}</div></div></div>`;
  view.appendChild(box); SFX.clunk(); setTimeout(() => SFX.win(), 260); buzz([30, 60, 30]);
  setTimeout(() => { const c = $('#cosig'); if (c) c.innerHTML = `${face(p, 28)} ${p.id} <i class="ok">signed</i>`; S.myEndorse++; toast(`${p.id} signed · and vouched for your follow-through`); S.wire.push(`🏅 you endorsed ${p.id} for ${topic}`); marquee(); react('🏅', 3); }, 1800);
  setTimeout(() => box.classList.add('tuck'), 4200); setTimeout(() => box.remove(), 4800);
  const pb = $('#ponBtn'); if (pb) { pb.innerHTML = `<span class="kcap ok">${icon('check')}</span>signed by both`; } $('#pon') && $('#pon').classList.remove('nudge');
  $('.key[data-k="0"]').classList.add('lit');
}
function saveSkill(p) {
  const ex = S.skills.find(k => k.by === p.id), t = SKILL_OF[p.id];
  if (ex) { ex.uses++; ex.v = (ex.v || 1) + 1; ex.from = `tape ${pad(S.tapes.length)} · v${ex.v}`; } else S.skills.unshift({ by: p.id, from: `tape ${pad(S.tapes.length)} · ${S.tapes[0].date}`, uses: 1, ...t });
  S.wire.push(`new skill · ${t.title}`); marquee(); strip(); return { merged: !!ex, v: ex ? ex.v : 1 };
}
function cart(k, i) { const m = M.find(x => x.id === k.by); return `<button class="cart" data-by="${k.by}" style="--c:${PAL[m.k][4]}"><div class="cart-lb">${face(m, 30)}<b>${k.title}</b></div><div class="cart-meta">${m.id} · 🏅 ${(NERD[k.by] || [0])[0]} · ${k.uses} installs${S.installed.includes(k.by) ? ' · ✅' : ''}</div><div class="cart-notch"></div></button>`; }
function openSkill(by) { go('skill', { by }); }
function learnLive(m) { if (!m.grind) { toast(`${m.id} isn't grinding right now · we'll ping you`); return; } R.partner = m; toast(`calling ${m.id} to learn it live`); go('tuning', { who: m }); }
function toggleSkills() { R.skillsOn = !R.skillsOn; $('#skillsSw').classList.toggle('on', R.skillsOn); SFX.clunk(); lcdFlash(R.skillsOn ? '01' : '00', 'skills rec', pad(S.skills.length), 'saved', R.skillsOn ? 'chats → playbooks' : 'off the record'); if (R.mode === 'skills') go('skills'); toast(R.skillsOn ? 'skills rec on · both of you see it' : 'skills rec off · this chat stays off the record'); }
function captureSkill(p, mins) {
  const ex = S.skills.find(k => k.by === p.id), t = SKILL_OF[p.id];
  if (ex) { ex.uses++; ex.from = `tape ${pad(S.tapes.length)} · v${(ex.v = (ex.v || 1) + 1)}`; } else S.skills.unshift({ by: p.id, from: `tape ${pad(S.tapes.length)} · ${S.tapes[0].date}`, uses: 1, ...t });
  view.insertAdjacentHTML('beforeend', `<div class="capture"><div class="cap-h"><span class="dotk"></span>skill captured from ${mins} min chat</div>${cart(S.skills.find(k => k.by === p.id), 0)}<div class="cap-s">${t.steps.length} steps · ${ex ? 'merged into v' + ex.v : 'new playbook'} · in the skills channel</div></div>`);
  view.querySelector('.capture .cart').addEventListener('click', () => openSkill(p.id)); const bt = view.querySelector('.bigtape'); if (bt) bt.classList.add('shift');
  SFX.win(); S.wire.push(`new skill · ${t.title}`); marquee(); strip();
  if (KEYS[2]) { KEYS[2] = { i: '🧠', l: 'open skill', fn: () => openSkill(p.id), lit: true }; $('#k2i').textContent = '🧠'; $('#k2l').textContent = 'open skill'; $('.key[data-k="2"]').classList.add('lit'); }
}
function exportSkill(k, m) {
  const slug = k.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
  const md = `---\nname: ${slug}\ndescription: ${k.title}. A founder playbook from the Music Nerd Live network, taught by ${m.id} (${m.co}).\n---\n\n# ${k.title}\n\nUse this when a founder or artist asks how to ${k.title}.\n\n## Steps\n\n${k.steps.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n## Source\n\n- Taught by: ${m.id}, ${m.co}\n- Captured from: ${k.from}\n- Tags: ${k.tags.join(', ')}\n- Network: MNTv Live (Music Nerd), demo data\n`;
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([md], { type: 'text/markdown' })); a.download = `${slug}.SKILL.md`; document.body.appendChild(a); a.click(); a.remove(); } catch {}
  SFX.win(); toast('SKILL.md saved · drop it into your AI assistant');
}
function markMoment() {
  if (!R.sess) return; R.sess.marks = (R.sess.marks || 0) + 1; SFX.pop ? SFX.pop() : SFX.key(); buzz(12);
  const d = document.createElement('div'); d.className = 'markfx'; d.innerHTML = `${icon('mark')}<span>marked · ${mmss(Math.round((Date.now() - R.callStart) / 1000))}</span>`; $('#reacts').appendChild(d); setTimeout(() => d.remove(), 1400);
}
function passAux() { if (R.sess) R.sess.aux++; R.auxIdx++; toast(`aux to ${R.partner ? R.partner.id : 'them'}`); SFX.static(.25); react('🎧', 2); }
function raise() { S.hands++; toast(`you're in c.y.'s queue · #${S.hands - 6}`); react('✋', 3); }
function helpAsk(m) {
  if (R.playStep !== 2) { toast('wait for the ask'); return; }
  if (S.helped.includes(m.id)) { toast(`you already pinged ${m.id}`); return; }
  S.helped.push(m.id); S.saved++; SFX.win(); react('🙋', 3); toast(`sent to ${m.id} · ${S.saved} calls off c.y.'s plate`);
}
function asks() {
  const ex = view.querySelector('.asklist'); if (ex) { ex.remove(); return; }
  const list = M.filter(m => m.drop), box = document.createElement('div'); box.className = 'asklist';
  box.innerHTML = list.map(m => `<div class="ask">${face(m, 44)}<p>${m.drop.ask}<small>${m.id} · ${m.co}</small></p><button data-id="${m.id}" ${S.helped.includes(m.id) ? 'disabled' : ''}>${S.helped.includes(m.id) ? 'sent' : 'i got you'}</button></div>`).join('');
  view.appendChild(box);
  box.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { const id = b.dataset.id; if (S.helped.includes(id)) return; S.helped.push(id); S.saved++; SFX.win(); b.textContent = 'sent'; b.disabled = true; toast(`sent to ${id} · ${S.saved} calls off c.y.'s plate`); }));
}
function nextDrop(auto) { R.sel = (R.sel + 1) % all().length; staticBurst(220); if (auto && R.sel === 0) { go('guide'); return; } go('play', { auto }); }
function startRec() {
  R.recOn = true; R.recLeft = 60; R.chunks = [];
  if (R.cam && window.MediaRecorder) { try { R.rec = new MediaRecorder(R.cam); R.rec.ondataavailable = e => e.data.size && R.chunks.push(e.data); R.rec.start(); } catch { R.rec = null; } }
  R.recRender(); SFX.clunk(); tone(880, .15, .15, 'square'); $('#k0i').innerHTML = icon('⏹'); $('#k0l').textContent = 'send';
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
function setOnboard(n) { R.onboard = n; ['#kAir', '#kMatch', '#kAdlib'].forEach((id, i) => $(id).classList.toggle('halo', i === n)); }
function setAir(on, quiet) {
  R.air = on; airKnob.set(on ? 1 : 0, true);
  $('#kAir').classList.toggle('live', on);
  $('#lamp').classList.toggle('on', on); $('#lamp').classList.toggle('blink', on);
  $('#statusEtch').textContent = on ? 'you are on air' : R.cyLive ? 'c.y. is live' : 'members only';
  SFX.onair(on);
  if (on) {
    R.airStart = Date.now(); if (!R.timerRun) R.timerRun = true; bumpStreak(); if (R.onboard === 0) setOnboard(1);
    flashText('ON AIR'); toast(`on air · ${TIMES[R.timerIdx]} min session · you're matchable`);
    S.wire.push('you · on air, grinding'); marquee(); scheduleIncoming();
  } else {
    clearTimeout(R.ringT); R.incoming = null; $('#kMatch').classList.remove('ringing'); R.timerRun = false;
    if (!quiet) toast(`off air · ${Math.max(1, Math.round((Date.now() - R.airStart) / 60000))} min logged`);
  }
  strip(); lcdRender(); knobLabels();
  if (R.mode === 'lounge') go('lounge');
}
function showRing(p) { hideRing(); const d = document.createElement('div'); d.className = 'ringov'; d.id = 'ringOv'; d.innerHTML = `<div class="ringcard"><div class="ripple">${face(p, 168)}</div><div class="rc-n">${p.id}</div><div class="rc-s">${p.grind} · wants to match</div><div class="rc-h"><span class="dotk"></span>press match</div></div>`; crt.appendChild(d); }
function hideRing() { const d = $('#ringOv'); if (d) d.remove(); }
function scheduleIncoming() {
  clearTimeout(R.ringT);
  R.ringT = setTimeout(() => {
    if (!R.air || !R.on || !['lounge', 'guide', 'shelf'].includes(R.mode)) { scheduleIncoming(); return; }
    const p = grinding()[Math.random() * grinding().length | 0]; R.incoming = p; SFX.ring(); showRing(p);
    $('#kMatch').classList.add('ringing'); $('#kMatch .knob-lab').textContent = 'pick up';
    toast(`${p.id} is calling`);
    let n = 0; const rr = setInterval(() => { if (!R.incoming || ++n > 4) { clearInterval(rr); if (R.incoming) { R.incoming = null; hideRing(); $('#kMatch').classList.remove('ringing'); $('#kMatch .knob-lab').textContent = 'match'; toast(`missed ${p.id}`); scheduleIncoming(); } return; } SFX.ring(); }, 1800);
  }, (R.rang ? 16000 : 6000) + Math.random() * 8000); R.rang = true;
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
    this.root = root; this.btn = $('.knob', root); this.ind = $('.ind', root); Object.assign(this, { n: o.n, range: o.range, idx: o.idx, labels: o.labels, onStep: o.onStep, onPress: o.onPress, onTurn: o.onTurn, size: o.size });
    this.drawScale(); this.set(this.idx, true);
    let d = null;
    const ctr = () => { const r = this.btn.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
    this.btn.addEventListener('pointerdown', e => { if (!R.on) return; this.btn.setPointerCapture(e.pointerId); const [x, y] = ctr(); d = { a: Math.atan2(e.clientY - y, e.clientX - x), acc: 0, mv: 0, t: Date.now() }; this.btn.classList.add('pressed'); });
    this.btn.addEventListener('pointermove', e => { if (!d) return; const [x, y] = ctr(); const a = Math.atan2(e.clientY - y, e.clientX - x); let dd = (a - d.a) * 180 / Math.PI; if (dd > 180) dd -= 360; if (dd < -180) dd += 360; d.a = a; d.acc += dd; d.mv += Math.abs(dd);
      const th = Math.min(this.step(), 28); while (Math.abs(d.acc) >= th) { const dir = Math.sign(d.acc); d.acc -= dir * th; this.turn(dir); } });
    const up = () => { if (!d) return; this.btn.classList.remove('pressed'); if (d.mv < 8 && Date.now() - d.t < 700) this.press(); d = null; };
    this.btn.addEventListener('pointerup', up); this.btn.addEventListener('pointercancel', up);
    this.btn.addEventListener('click', e => { if (e.detail) this.btn.blur(); if (!R.on) powerOn(); });
    this.btn.addEventListener('wheel', e => { if (!R.on) return; e.preventDefault(); this.turn(e.deltaY > 0 ? 1 : -1); }, { passive: false });
    this.btn.addEventListener('keydown', e => { if (!R.on) return; if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); this.turn(1); } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); this.turn(-1); } else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); this.press(); } });
  }
  step() { return this.range / Math.max(1, this.n - 1); }
  angle(i) { return -this.range / 2 + i * this.step(); }
  drawScale() { $('.scale', this.root).innerHTML = scaleSVG(this.size, this.n, this.range, this.labels, this.idx); }
  set(i, silent) { this.idx = Math.max(0, Math.min(this.n - 1, i)); this.ind.style.transform = `rotate(${this.angle(this.idx)}deg)`; this.drawScale(); }
  turn(dir) { if (this.onTurn && this.onTurn(dir)) { SFX.tick(); return; } const prev = this.idx; this.set(this.idx + dir); if (this.idx !== prev) setTimeout(knobLabels); if (this.idx === prev) { SFX.tick(); this.ind.animate([{ transform: `rotate(${this.angle(prev) + dir * 4}deg)` }, { transform: `rotate(${this.angle(prev)}deg)` }], { duration: 160 }); return; } SFX.tick(); this.onStep && this.onStep(this.idx, dir); }
  press() { SFX.clunk(); this.btn.classList.add('pressed'); setTimeout(() => this.btn.classList.remove('pressed'), 120); this.onPress && this.onPress(); }
}
const matchKnob = new Knob($('#kMatch'), { n: 4, range: 240, idx: 0, size: 250, labels: FILTERS.map(f => f[0]),
  onStep: i => { R.filter = i; const role = FILTERS[i][1]; const c = grinding().filter(m => !role || m.role === role).length; lcdFlash(pad(c), 'grinding', pad(i + 1), 'filter', `match · ${FILTERS[i][0]}`); },
  onTurn: dir => R.mode === 'after' && rateTurn(dir),
  onPress: () => matchPress() });
const airKnob = new Knob($('#kAir'), { n: 2, range: 90, idx: 0, size: 96, labels: ['end', 'start'],
  onStep: i => setAir(i === 1), onPress: () => setAir(!R.air) });
const timerKnob = new Knob($('#kTimer'), { n: TIMES.length, range: 270, idx: R.timerIdx, size: 96, labels: [],
  onStep: i => { R.timerIdx = i; if (!R.timerRun) R.timerLeft = TIMES[i] * 60; else R.timerLeft = TIMES[i] * 60; lcdFlash(pad(TIMES[i]), 'min', '00', 'sec', R.timerRun ? 'timer reset' : 'timer set'); },
  onPress: () => { R.timerRun = !R.timerRun; if (R.timerLeft <= 0) R.timerLeft = TIMES[R.timerIdx] * 60; toast(R.timerRun ? `timer · ${mmss(R.timerLeft)}` : 'timer paused'); lcdRender(); } });
const volKnob = new Knob($('#kVol'), { n: 11, range: 270, idx: R.vol, size: 96, labels: [],
  onStep: i => { R.vol = i; if (A.master) A.master.gain.setTargetAtTime(volGain(), A.ctx.currentTime, .04); lcdFlash(pad(i), 'vol', '10', 'max', i === 0 ? 'muted' : 'volume'); },
  onPress: () => { R.vol = R.vol ? 0 : 6; volKnob.set(R.vol); knobLabels(); if (A.master) A.master.gain.setTargetAtTime(volGain(), A.ctx.currentTime, .04); lcdFlash(pad(R.vol), 'vol', '--', '', R.vol ? 'unmuted' : 'muted'); } });
const adlibKnob = new Knob($('#kAdlib'), { n: ADLIBS.length, range: 270, idx: R.adlib, size: 96, labels: [],
  onStep: i => { R.adlib = i; lcdFlash(pad(i + 1), 'adlib', pad(ADLIBS.length), 'of', 'adlib · ' + ADLIBS[i][0]); },
  onPress: () => fireAdlib() });
function knobLabels() {
  $('#kAir .kn-l').textContent = R.air ? 'live' : 'on air';
  $('#kTimer .kn-l').textContent = `timer ${TIMES[R.timerIdx]}m`;
  $('#kVol .kn-l').textContent = R.vol ? `vol ${R.vol}` : 'muted';
  $('#kAdlib .kn-l').textContent = `adlib: ${ADLIBS[R.adlib][0]}`;
}
function fireAdlib() { if (R.mode === 'call' && R.sess) R.sess.adYou++; if (R.onboard === 2) setOnboard(3); ADLIB_FX[R.adlib](); flashText(ADLIBS[R.adlib][1]); if (R.mode === 'call' && R.partner) setTimeout(() => react(['😂', '🔥', '🙌'][Math.random() * 3 | 0], 3), 400); }
function matchPress() {
  if (R.mode === 'after' && !R.rateLocked) { lockRate(); return; }
  if (R.incoming) { const p = R.incoming; R.incoming = null; hideRing(); $('#kMatch').classList.remove('ringing'); R.partner = p; go('call'); scheduleIncoming(); return; }
  if (R.mode === 'call' || R.mode === 'tuning') { go('after'); return; }
  if (R.mode === 'play') { nextDrop(false); return; }
  if (R.mode === 'skill') { learnLive(M.find(x => x.id === R.skBy)); return; }
  if (R.mode === 'skills' && R.skList && R.skList[0]) { openSkill(R.skList[R.sel].by); return; }
  if (R.mode === 'record') { toast('finish your drop first · press 🔴'); return; }
  go('tuning', {});
}

/* ---------------- keys input ---------------- */
document.querySelectorAll('.key').forEach(el => {
  const i = +el.dataset.k;
  el.addEventListener('pointerdown', () => { if (!R.on) return; el.classList.add('down'); el.classList.contains('dark') ? SFX.dark() : SFX.key(); });
  const up = () => el.classList.remove('down'); el.addEventListener('pointerup', up); el.addEventListener('pointerleave', up);
  el.addEventListener('click', () => { el.blur(); if (!R.on) { powerOn(); return; } KEYS[i] && KEYS[i].fn(); });
});
function surf(dir) { const n = all().length; R.ch = (R.ch + dir + n) % n; staticBurst(200); SFX.tick(); go('lounge'); chFlash(pad(R.ch + 1)); }

/* ---------------- vu ---------------- */
const vu = $('#vu'); vu.innerHTML = '<span></span>'.repeat(24); const bars = [...vu.children], fbuf = new Uint8Array(32);
(function vuLoop() { if (A.an && R.on) { A.an.getByteFrequencyData(fbuf); bars.forEach((b, i) => b.style.height = Math.max(8, fbuf[1 + (i % 22)] / 255 * 100 * (R.vol / 7)) + '%'); } else bars.forEach(b => b.style.height = '8%'); requestAnimationFrame(vuLoop); })();

/* ---------------- power ---------------- */
const po = $('#powerOff'), pw = $('#power');
function powerOn() {
  if (R.on) return; R.on = true; audioInit(); SFX.power(true);
  pw.classList.add('on'); po.classList.add('hide'); crt.classList.remove('off-anim'); void crt.offsetWidth; crt.classList.add('on-anim'); setTimeout(() => crt.classList.remove('on-anim'), 800);
  go('lounge'); const sp = document.createElement('div'); sp.className = 'splash'; sp.innerHTML = '<img src="assets/specs.png" alt=""><b>music nerd <i>live</i></b><span>members only · week 43</span>'; crt.appendChild(sp); setTimeout(() => sp.remove(), 1600); setTimeout(() => { if (R.onboard == null) setOnboard(0); }, 1700);
  if (!R.cyT) R.cyT = setTimeout(() => { R.cyLive = true; strip(); if (!R.air) $('#statusEtch').textContent = 'c.y. is live'; SFX.win(); toast('c.y. just went live · turn to ch 00'); S.wire.push('c.y. live now'); marquee(); }, 40000);
}
function powerOff() { R.on = false; SFX.power(false); clearModeTimers(); if (R.air) setAir(false, true); pw.classList.remove('on'); crt.classList.add('off-anim'); setTimeout(() => po.classList.remove('hide'), 420); if (A.ctx) A.ctx.suspend(); stopCam(); }
pw.addEventListener('click', () => R.on ? powerOff() : powerOn());
$('#skillsSw').addEventListener('click', () => { if (!R.on) { powerOn(); return; } toggleSkills(); });
po.addEventListener('click', powerOn);
$('#strip').addEventListener('click', e => { const b = e.target.closest('.ch'); if (!b) return; if (!R.on) { powerOn(); return; } const i = +b.dataset.ch; SFX.key(); staticBurst(220); if (b.dataset.ch === 'sk') { go('skills'); return; } if (i === 0) { go('cy'); chFlash('00'); } else { R.ch = i - 1; go('lounge'); chFlash(pad(i)); } });
$('#strip').addEventListener('scroll', stripFade, { passive: true });
/* swipe the screen to surf */
let sw = null;
$('#screen').addEventListener('pointerdown', e => { if (R.on && R.mode === 'lounge') sw = e.clientX; });
$('#screen').addEventListener('pointerup', e => { if (sw == null) return; const dx = e.clientX - sw; sw = null; if (Math.abs(dx) > 50) surf(dx < 0 ? 1 : -1); });

/* ---------------- keyboard ---------------- */
document.addEventListener('keydown', e => {
  if (e.repeat || e.metaKey || e.ctrlKey) return;
  if (!R.on) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); powerOn(); } return; }
  if (e.target.closest && e.target.closest('.knob')) return;
  if (e.target.tagName === 'INPUT') { if (e.key === 'Escape') e.target.blur(); return; }
  const k = e.key.toLowerCase();
  if (k === 'arrowright') { if (R.mode === 'lounge') surf(1); else if (R.mode === 'play') nextDrop(false); }
  else if (k === 'arrowleft') { if (R.mode === 'lounge') surf(-1); }
  else if (k === ' ' || k === 'enter') { e.preventDefault(); matchKnob.press(); }
  else if (k === 'o') airKnob.press(); else if (k === 't') timerKnob.press(); else if (k === 'a') adlibKnob.press();
  else if (k === '=' || k === '+') volKnob.turn(1); else if (k === '-') volKnob.turn(-1);
  else if (k === '[') adlibKnob.turn(-1); else if (k === ']') adlibKnob.turn(1);
  else if (k === 'k') go('skills'); else if (k === 'g') go('guide'); else if (k === 'r') go('record'); else if (k === 's') go('shelf'); else if (k === 'l') go('lounge'); else if (k === '0') go('cy');
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
keys([{ i: '📺', l: 'guide', fn() {} }, { i: '🧠', l: 'skills', fn() {} }, { i: '📼', l: 'shelf', fn() {} }, BLANK]);
lcdRender();
window.__mntv = { R, S, go, powerOn, setAir };
})();
