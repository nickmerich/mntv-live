/* MNTv Live prototype · demo data only */
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
  { id: 'theo', role: 'founder', co: 'roadie · touring app', k: 'c', live: true, drop: { len: 58, win: 'first 500 artists on the roadie beta', stuck: 'venue data is a mess', ask: 'know a booking agent who would test it?' } },
  { id: 'jules', role: 'artist', co: 'singer · songwriter', k: 'm', live: true, drop: { len: 60, win: 'new single crossed 100k streams', stuck: 'my live set still feels thin', ask: 'who has run a laptop-only live rig?' } },
  { id: 'maya', role: 'producer', co: 'beats · sync', k: 'p', live: true, drop: { len: 52, win: 'placed a beat with a sync house', stuck: 'pricing my stems', ask: 'how do you price sync under 10k?' } },
  { id: 'ren', role: 'founder', co: 'fanclub · fan app', k: 'r', live: false, drop: null },
  { id: 'kai', role: 'creative technologist', co: 'live visuals', k: 'c', live: true, drop: { len: 41, win: 'shipped visuals for a 2k-cap show', stuck: 'need an artist to pilot v2', ask: 'any artist want custom visuals, free?' } },
  { id: 'ari', role: 'artist', co: 'rapper · pittsburgh', k: 'm', live: true, drop: { len: 47, win: 'sold out a 300-cap room', stuck: 'merch cash flow', ask: 'who prints merch on consignment?' } },
  { id: 'dev', role: 'founder', co: 'stems marketplace', k: 'p', live: false, drop: null },
  { id: 'lux', role: 'artist', co: 'dj · producer', k: 'r', live: true, drop: { len: 55, win: 'first residency booked', stuck: 'saying no to bad gigs', ask: 'how did you set your floor rate?' } },
  { id: 'nova', role: 'founder', co: 'ticketing for small rooms', k: 'y', live: false, drop: { len: 60, win: '40 venues signed', stuck: 'artists ignore our emails', ask: 'intro to 3 artists who tour small rooms?' } },
  { id: 'sol', role: 'artist', co: 'producer · film', k: 'c', live: true, drop: { len: 49, win: 'scored my first short film', stuck: 'too many unfinished ideas', ask: 'want to co-write one track this month?' } },
  { id: 'bea', role: 'creative technologist', co: 'ai mastering', k: 'm', live: false, drop: { len: 38, win: 'mastering beta hit 1k tracks', stuck: 'need real artist feedback', ask: 'send me a track, i will master it free' } },
];
const CY = { id: 'c.y.', role: 'executive producer', co: 'music nerd', k: 'r' };
const YOU = { id: 'you', role: 'you', co: 'your channel', k: 'y', live: true };
const PROMPTS = ['make something in 30 days?', 'what are you stuck on?', 'best show you saw this year?', 'trade one skill, right now', 'who should the other meet?', 'what would you build together?'];
const WIRE0 = ['sound of fractures · alone together on bbc radio', 'black dave · new yards episode', 'maya × theo · collab', 'c.y. on air · this week', 'week 43 drops are in'];

/* ---------------- state ---------------- */
const store = {
  get() { try { return JSON.parse(localStorage.getItem('mntv-live') || '{}'); } catch { return {}; } },
  set(v) { try { localStorage.setItem('mntv-live', JSON.stringify(v)); } catch {} },
};
const saved = store.get();
const S = Object.assign({
  tapes: [{ who: 'jules', date: 'oct 21', min: 12 }, { who: 'ren', date: 'oct 20', min: 9 }, { who: 'kai', date: 'oct 18', min: 12 }, { who: 'c.y.', date: 'oct 16', min: 60, replay: true }],
  streak: 12, lastDay: '', saved: 3, dropped: false, weekStreak: 13, wire: [], hands: 7, collabs: 1, helped: [],
}, saved);
const R = { on: false, mode: 'lounge', ch: 2, sel: 0, partner: null, timer: null, t: 0, cam: null, rec: null, chunks: [], blob: null, recOn: false, recLeft: 60, chipsLit: {}, playIdx: 0, playStep: 0, onAir: false, angle: 0, pocket: false, auxIdx: 0, aux: .6 };
const persist = () => store.set({ tapes: S.tapes, streak: S.streak, lastDay: S.lastDay, saved: S.saved, dropped: S.dropped, weekStreak: S.weekStreak, wire: S.wire, hands: S.hands, collabs: S.collabs, helped: S.helped });
const today = () => new Date().toISOString().slice(0, 10);
function bumpStreak() {
  const t = today(); if (S.lastDay === t) return;
  const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  S.streak = (S.lastDay === y || !S.lastDay) ? S.streak + 1 : 1; S.lastDay = t; persist();
  toast(`day ${S.streak} 🔥 streak alive`);
}
const fmt = n => n >= 60 ? '1:00' : '0:' + String(n).padStart(2, '0');
const pad = n => String(Math.max(0, n | 0)).padStart(2, '0');
const all = () => [...M, YOU];
const liveCount = () => M.filter(m => m.live).length + 1;
const droppedCount = () => M.filter(m => m.drop).length + (S.dropped ? 1 : 0);

/* ---------------- audio ---------------- */
const A = { ctx: null };
function audioInit() {
  if (A.ctx) { A.ctx.resume(); return; }
  const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
  const ctx = A.ctx = new C();
  A.master = ctx.createGain(); A.master.gain.value = .9; A.master.connect(ctx.destination);
  A.music = ctx.createGain(); A.music.gain.value = R.aux * .55;
  A.an = ctx.createAnalyser(); A.an.fftSize = 64; A.music.connect(A.an); A.an.connect(A.master);
  A.fx = ctx.createGain(); A.fx.gain.value = .5; A.fx.connect(A.master);
  const len = ctx.sampleRate * 1.5, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; A.noise = b;
  startMusic();
}
function nz(dur, f = 3000, q = 1, g = .3, t0 = 0) {
  if (!A.ctx) return; const c = A.ctx, t = c.currentTime + t0;
  const s = c.createBufferSource(); s.buffer = A.noise; const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = q;
  const gn = c.createGain(); gn.gain.setValueAtTime(g, t); gn.gain.exponentialRampToValueAtTime(.0001, t + dur);
  s.connect(bp); bp.connect(gn); gn.connect(A.fx); s.start(t, Math.random()); s.stop(t + dur + .02);
}
function tone(f, dur, g = .2, type = 'sine', t0 = 0, dest) {
  if (!A.ctx) return; const c = A.ctx, t = c.currentTime + t0;
  const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t);
  const gn = c.createGain(); gn.gain.setValueAtTime(g, t); gn.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(gn); gn.connect(dest || A.fx); o.start(t); o.stop(t + dur + .02); return o;
}
const SFX = {
  key() { nz(.035, 4200, 2, .5); tone(140, .05, .35); buzz(8); },
  dark() { nz(.04, 2200, 2, .5); tone(95, .07, .4); buzz(10); },
  tick() { nz(.012, 6000, 4, .35); buzz(4); },
  knob() { nz(.05, 1800, 1.5, .45); tone(70, .12, .5); buzz([10, 30, 10]); },
  static(d = .5) { nz(d, 2500, .4, .22); nz(d, 7000, .6, .1); },
  power(on) { tone(on ? 60 : 50, .25, .5); nz(.08, 900, 1, .4); if (on) { const o = tone(9000, 1.2, .015); } buzz(on ? [20, 40, 20] : 30); },
  pop() { tone(880, .08, .15, 'triangle'); tone(1320, .1, .1, 'triangle', .05); },
  win() { [523, 659, 784, 1046].forEach((f, i) => tone(f, .25, .12, 'triangle', i * .07)); buzz([15, 40, 15, 40, 30]); },
};
function buzz(p) { try { navigator.vibrate && navigator.vibrate(p); } catch {} }
const PROG = [[[174.6, 220, 261.6, 329.6], 87.3], [[164.8, 196, 246.9, 293.7], 82.4], [[146.8, 174.6, 220, 261.6], 73.4], [[130.8, 164.8, 196, 246.9], 65.4]];
function startMusic() {
  const c = A.ctx, bpm = 84, spb = 60 / bpm; let next = c.currentTime + .1, step = 0;
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100; lp.Q.value = .7; lp.connect(A.music);
  const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = .07; lg.gain.value = 450; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
  A.lp = lp;
  setInterval(() => {
    while (next < c.currentTime + .25) {
      const bar = Math.floor(step / 8) % 4, s8 = step % 8, tr = R.auxIdx % 2 ? 1.122 : 1;
      const [ch, bass] = PROG[bar];
      if (s8 === 0) ch.forEach(f => ['sawtooth', 'triangle'].forEach((ty, j) => { const o = c.createOscillator(), g = c.createGain(); o.type = ty; o.frequency.value = f * tr * (j ? 1.004 : .998); g.gain.setValueAtTime(0, next); g.gain.linearRampToValueAtTime(.045, next + .4); g.gain.linearRampToValueAtTime(.0001, next + spb * 4); o.connect(g); g.connect(lp); o.start(next); o.stop(next + spb * 4 + .05); }));
      if (s8 % 2 === 0) { const o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(110, next); o.frequency.exponentialRampToValueAtTime(42, next + .18); g.gain.setValueAtTime(s8 % 4 === 0 ? .5 : .0001, next); g.gain.exponentialRampToValueAtTime(.0001, next + .3); o.connect(g); g.connect(A.music); o.start(next); o.stop(next + .32); }
      if (s8 % 4 === 2) { const s = c.createBufferSource(); s.buffer = A.noise; const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; const g = c.createGain(); g.gain.setValueAtTime(.12, next); g.gain.exponentialRampToValueAtTime(.0001, next + .14); s.connect(f); f.connect(g); g.connect(A.music); s.start(next, Math.random()); s.stop(next + .15); }
      { const s = c.createBufferSource(); s.buffer = A.noise; const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000; const g = c.createGain(); g.gain.setValueAtTime(s8 % 2 ? .025 : .045, next + spb / 2 * 0); g.gain.exponentialRampToValueAtTime(.0001, next + .05); s.connect(f); f.connect(g); g.connect(A.music); s.start(next, Math.random()); s.stop(next + .06); }
      if (s8 === 0 || s8 === 3 || s8 === 6) { const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = bass * tr; g.gain.setValueAtTime(.22, next); g.gain.exponentialRampToValueAtTime(.0001, next + spb * .9); o.connect(g); g.connect(A.music); o.start(next); o.stop(next + spb); }
      next += spb / 2; step++;
    }
  }, 30);
}

/* ---------------- dom helpers ---------------- */
const view = $('#view');
const sil = (c) => `<svg class="sil" viewBox="0 0 420 380" aria-hidden="true"><circle cx="210" cy="118" r="86" fill="${c}"/><path d="M28 380c0-112 82-172 182-172s182 60 182 172z" fill="${c}"/></svg>`;
function feed(m, { talk = false, cam = false, off = false } = {}) {
  if (off) return `<div class="feed noise"></div>`;
  const p = PAL[m.k || 'p'];
  const inner = cam && R.cam ? `<video autoplay muted playsinline></video>` :
    (m === YOU ? `<div class="avatar" style="background:${p[4]}">${'y'}</div>` : sil(p[3]));
  return `<div class="feed ${talk ? 'talk' : ''}" style="background:linear-gradient(160deg,${p[0]} 0%,${p[1]} 55%,${p[2]} 100%)"><div class="lightleak"></div>${inner}</div>`;
}
function attachCam() { if (!R.cam) return; view.querySelectorAll('video').forEach(v => { v.srcObject = R.cam; v.play().catch(() => {}); }); }
async function getCam() {
  if (R.cam) return R.cam;
  try { R.cam = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false }); } catch { R.cam = null; }
  return R.cam;
}
function stopCam() { if (R.cam) { R.cam.getTracks().forEach(t => t.stop()); R.cam = null; } }
function st(txt, cls = '', css = '', r = 0) { return `<div class="sticker ${cls} pop" style="--r:${r}deg;${css}">${txt}</div>`; }
let toastT;
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600); }
function staticBurst(ms = 380) { const o = $('#staticOv'); o.classList.add('on', 'noise'); SFX.static(ms / 1000); setTimeout(() => o.classList.remove('on'), ms); }
function react(e, n = 1) {
  const box = $('#reacts');
  for (let i = 0; i < n; i++) setTimeout(() => {
    const d = document.createElement('div'); d.className = 'fly'; d.textContent = e;
    d.style.left = (15 + Math.random() * 70) + '%'; d.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px'); d.style.setProperty('--rot', (Math.random() * 40 - 20) + 'deg');
    box.appendChild(d); setTimeout(() => d.remove(), 2500);
  }, i * 140);
}

/* ---------------- lcd / keys / marquee ---------------- */
function lcd(a, al, b, bl, mid = '') { $('#lcdA').textContent = a; $('#lcdAl').textContent = al; $('#lcdB').textContent = b; $('#lcdBl').textContent = bl; $('#lcdMid').textContent = mid; }
let KEYS = [];
function keys(arr, knobLabel) {
  KEYS = arr;
  arr.forEach((k, i) => { $(`#k${i}i`).textContent = k.i; $(`#k${i}l`).textContent = k.l; const el = $(`.key[data-k="${i}"]`); el.classList.toggle('lit', !!k.lit); el.setAttribute('aria-label', k.l); });
  $('#knobLab').textContent = knobLabel;
}
function marquee() {
  const items = [...S.wire.slice(-4).reverse(), ...WIRE0];
  const html = items.map(t => `<span>${t}</span>`).join('');
  $('#marqRun').innerHTML = html + html;
}
function strip() {
  const chans = [{ ...CY, n: '00' }, ...M.map((m, i) => ({ ...m, n: pad(i + 1) })), { ...YOU, n: pad(M.length + 1) }];
  $('#strip').innerHTML = chans.map((m, i) => {
    const off = m.id === 'c.y.' ? !R.onAir : (m === YOU || m.id === 'you') ? false : !m.live;
    const p = PAL[m.k];
    return `<button class="ch ${isOnChan(i) ? 'on' : ''}" data-ch="${i}"><span class="sw ${off ? 'off noise' : ''}" style="${off ? '' : `background:linear-gradient(160deg,${p[0]},${p[2]})`}"></span><span class="n">${m.n}</span>${m.id}${off ? '' : '<span class="live"></span>'}</button>`;
  }).join('');
  const on = $('#strip .ch.on'); if (on) on.scrollIntoView({ block: 'nearest', inline: 'center' });
}
function isOnChan(i) { if (R.mode === 'onair') return i === 0; if (R.mode === 'lounge') return i === R.ch + 1; return false; }

/* ---------------- modes ---------------- */
function clearTimers() { clearInterval(R.timer); R.timer = null; clearInterval(R.auto); R.auto = null; }
function go(mode, opts = {}) {
  clearTimers(); R.mode = mode; $('#lamp').className = 'lamp' + (R.onAir ? ' on' : '');
  $('#lampTxt').textContent = 'on air'; $('#statusEtch').textContent = R.onAir ? 'c.y. is live' : 'members only';
  (MODES[mode])(opts); strip();
}
const MODES = {
  lounge() {
    const list = all(), m = list[(R.ch + list.length) % list.length];
    const off = m !== YOU && !m.live;
    const nm = m.id;
    view.innerHTML = feed(m, { off, cam: m === YOU }) +
      `<div class="osd" style="left:30px;top:26px;font-size:32px">CH ${pad(R.ch + 1)}</div>` +
      (off ? `<div class="bigname" style="left:30px;bottom:74px;font-size:96px;opacity:.85">${nm}</div><div class="osd sans" style="left:34px;bottom:40px;color:#ff3b5c;text-shadow:0 0 10px rgba(255,59,92,.7)">off air · not in the lounge</div>`
        : `<div class="bigname" style="left:30px;bottom:74px;font-size:110px">${nm}</div><div class="osd sans" style="left:34px;bottom:40px">${m.role} · ${m.co}${m === YOU ? '' : ' · live'}</div>`) +
      st(`day ${S.streak} 🔥`, '', 'right:34px;top:30px', -6) +
      st(`${liveCount()} live`, 'm', 'right:56px;top:96px', 5) +
      (m.drop && m !== YOU ? st('drop: ' + m.drop.win, 'w', 'right:40px;top:162px;max-width:52%;overflow:hidden;text-overflow:ellipsis', -2) : '');
    if (m === YOU) getCam().then(c => { if (c && R.mode === 'lounge') { view.querySelector('.feed').outerHTML = feed(YOU, { cam: true }); attachCam(); } });
    lcd(pad(liveCount()), 'live now', pad(S.streak), 'day streak', `SAVED ${pad(S.saved)}`);
    keys([{ i: '🔥', l: 'fire', fn: () => react('🔥', 3) }, { i: '💗', l: 'love', fn: () => react('💗', 3) }, { i: '📺', l: 'guide', fn: () => go('guide') }, { i: '📼', l: 'shelf', fn: () => go('shelf') }], 'spin');
    R.auto = setInterval(() => { if (!off && Math.random() < .5) react(['🔥', '💗', '🎧', '😂'][Math.random() * 4 | 0]); }, 2600);
  },
  spin() {
    bumpStreak();
    const pool = M.filter(m => m.live && m.id !== (R.partner && R.partner.id));
    const p = R.partner = pool[Math.random() * pool.length | 0];
    view.innerHTML = `<div class="feed noise"></div><div class="osd" style="left:50%;top:44%;transform:translateX(-50%);font-size:42px">TUNING</div>` + st('finding someone you have not met', 'w', 'left:50%;top:58%;transform:translateX(-50%)');
    SFX.static(1.3); let k = 0; R.timer = setInterval(() => { SFX.tick(); if (++k > 9) { clearInterval(R.timer); call(); } }, 130);
    lcd('--', 'tuning', '--', '');
    keys([{ i: '🔥', l: 'fire', fn: () => react('🔥', 3) }, { i: '💗', l: 'love', fn: () => react('💗', 3) }, { i: '🎧', l: 'pass aux', fn: passAux }, { i: '✕', l: 'leave', fn: () => go('after') }], 'next');
    getCam();
    function call() {
      if (R.mode !== 'spin') return;
      staticBurst(260);
      const prompt = PROMPTS[Math.random() * PROMPTS.length | 0];
      view.innerHTML = `<div class="split">${feed(p, { talk: true })}${feed(YOU, { cam: true })}</div>` +
        `<div class="bigname" style="left:26px;bottom:26px;font-size:64px">${p.id}</div>` +
        `<div class="bigname" style="left:calc(50% + 26px);bottom:26px;font-size:64px">you</div>` +
        `<div class="osd sans" style="left:30px;top:24px">${p.role} · ${p.co}</div>` +
        `<div class="osd" style="right:26px;top:22px;font-size:20px">SPIN ${pad(S.tapes.length + 1)}</div>` +
        st(prompt, 'w', 'left:50%;top:64px;transform:translateX(-50%);font-size:28px;padding:12px 24px');
      attachCam(); SFX.pop();
      R.t = 12 * 60; tickLcd();
      R.timer = setInterval(() => { R.t--; tickLcd(); if (R.t <= 0) go('after'); }, 1000);
      R.auto = setInterval(() => { if (Math.random() < .55) react(['😂', '🔥', '💗', '🎧'][Math.random() * 4 | 0]); }, 2200);
    }
    function tickLcd() { lcd(pad(R.t / 60), 'min left', pad(R.t % 60), 'sec', `W/ ${p.id.toUpperCase()}`); }
  },
  after() {
    const p = R.partner || M[2];
    const mins = Math.max(1, Math.round((12 * 60 - (R.t || 0)) / 60)) || 1;
    S.tapes.unshift({ who: p.id, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase(), min: Math.min(12, mins) }); persist();
    const pc = PAL[p.k];
    view.innerHTML = `<div class="split" style="filter:brightness(.3) blur(3px)">${feed(p)}${feed(YOU)}</div>` +
      `<div class="tape bigtape spinning"><div class="lb" style="background:${pc[4]}">${p.id} × you<small>tape ${pad(S.tapes.length)} · ${S.tapes[0].min} min · ${S.tapes[0].date}</small></div><div class="reels"><div class="reel"></div><div class="reel"></div></div></div>` +
      st('new tape on your shelf', 'm', 'left:50%;bottom:34px;transform:translateX(-50%)', 2);
    SFX.win();
    lcd(pad(S.tapes.length), 'tapes', pad(S.streak), 'day streak', `AGAIN W/ ${p.id.toUpperCase()}?`);
    keys([{ i: '🤝', l: 'collab', fn: collab }, { i: '👋', l: 'later', fn: () => go('lounge') }, { i: '🔁', l: 'again', fn: () => go('spin') }, { i: '📼', l: 'shelf', fn: () => go('shelf') }], 'spin');
    function collab() {
      if (KEYS[0].lit) return; KEYS[0].lit = true; $('.key[data-k="0"]').classList.add('lit');
      toast(`collab sent to ${p.id}`);
      setTimeout(() => { S.wire.push(`${p.id} × you · collab`); S.collabs++; persist(); marquee(); SFX.win(); toast(`${p.id} tapped collab too · you're on the wire`); react('🤝', 4); }, 1700);
    }
  },
  guide() {
    const list = all();
    R.sel = Math.min(R.sel, list.length - 1);
    view.innerHTML = `<div class="grid"><div class="hd"><div class="hd-t">this week on <i>mntv</i></div>${st("c.y.'s pick: kai", '', 'position:static;transform:rotate(-3deg);font-size:17px')}<div class="osd sans" style="position:static">wk 43 · ${droppedCount()} of ${list.length} dropped</div></div>` +
      list.map((m, i) => {
        const d = m === YOU ? S.dropped : !!m.drop;
        return `<div class="tile" data-i="${i}" style="${i === R.sel ? 'box-shadow:0 0 0 3px #fff' : ''}">${feed(m, { off: !d })}` +
          (d ? `<div class="len">${fmt(m === YOU ? (R.myDrop ? R.myDrop.len : 60) : m.drop.len)}</div><div class="tag" style="color:${m.id === 'kai' ? 'var(--pink)' : 'var(--mint)'}">${m.id === 'kai' ? 'PICK' : 'NEW'}</div>`
             : `<div class="tag" style="color:#ff3b5c">OFF AIR</div>`) +
          `<div class="co">${m.co}</div><div class="nm">${m.id}</div></div>`;
      }).join('') + `</div>`;
    view.querySelectorAll('.tile').forEach(t => t.addEventListener('click', () => { R.sel = +t.dataset.i; SFX.key(); playSel(); }));
    lcd(pad(droppedCount()), 'dropped', pad(list.length - droppedCount()), 'off air', S.dropped ? 'YOU DROPPED' : 'YOURS DUE FRI');
    keys([{ i: '▶️', l: 'play all', fn: () => { R.sel = 0; playSel(true); } }, { i: '🙋', l: 'asks', fn: asks }, { i: '⏺', l: 'record', fn: () => go('record'), lit: !S.dropped }, { i: '🏠', l: 'lounge', fn: () => go('lounge') }], 'play');
  },
  play({ auto }) {
    const list = all(), m = list[R.sel];
    const isYou = m === YOU;
    if ((isYou && !S.dropped) || (!isYou && !m.drop)) {
      view.innerHTML = feed(m, { off: true }) + `<div class="bigname" style="left:30px;bottom:74px;font-size:96px">${m.id}</div>` + st('no drop this week', 'r', 'right:34px;top:30px', -4) +
        `<div class="osd sans" style="left:34px;bottom:40px;color:#ff3b5c">off air · due friday</div>`;
      lcd('00', 'sec', '00', '', 'OFF AIR');
      keys([{ i: '👋', l: 'nudge', fn: () => toast(isYou ? 'press record on the guide' : `nudged ${m.id} · due friday`) }, { i: '⏭', l: 'next', fn: () => nextDrop(auto) }, { i: '⏺', l: 'record', fn: () => go('record') }, { i: '⏹', l: 'back', fn: () => go('guide') }], 'next');
      if (auto) R.timer = setTimeout(() => nextDrop(true), 1800);
      return;
    }
    const d = isYou ? (R.myDrop || { len: 60 - R.recLeft, win: 'my weekly win', stuck: 'my stuck', ask: 'my ask' }) : m.drop;
    const steps = [['win', d.win, 'var(--mint)'], ['stuck', d.stuck, 'var(--cyan)'], ['ask', d.ask, 'var(--pink)']];
    view.innerHTML = (isYou && R.blob ? `<div class="feed"><video autoplay playsinline loop src="${R.blob}" style="transform:scaleX(-1)"></video></div>` : feed(m, { talk: true })) +
      `<div class="osd" style="left:30px;top:26px;font-size:30px">DROP</div><div class="osd sans" style="left:34px;top:70px">${m.id} · ${m.co} · wk 43</div>` +
      (m.id === 'kai' ? st("c.y.'s pick", '', 'right:34px;top:30px', -5) : '') +
      `<div class="caption" id="cap"></div>`;
    let i = 0, left = d.len;
    const show = () => { const [k, t, c] = steps[i]; $('#cap').innerHTML = `<b style="color:${c}">${k}</b>${t}`; R.playStep = i; KEYS[2] && $('.key[data-k="2"]').classList.toggle('lit', i === 2); };
    lcd(pad(R.sel + 1), 'drop', pad(left), 'sec left', m.id.toUpperCase());
    keys([{ i: '🔥', l: 'fire', fn: () => react('🔥', 3) }, { i: '💗', l: 'love', fn: () => react('💗', 3) }, { i: '🙋', l: 'i got you', fn: () => helpAsk(m) }, { i: '⏹', l: 'back', fn: () => go('guide') }], 'next');
    show();
    R.timer = setInterval(() => { left = Math.max(0, left - 1); $('#lcdB').textContent = pad(left); if ((d.len - left) % 4 === 0 && i < 2) { i++; show(); } if (auto && left <= d.len - 12) nextDrop(true); }, 1000);
  },
  record() {
    R.chipsLit = {}; R.recOn = false; R.recLeft = 60;
    const render = () => {
      view.innerHTML = feed(YOU, { cam: true }) + (R.recOn ? '<div class="recring"></div>' : '') +
        `<div class="osd" style="left:30px;top:26px;font-size:30px">CH ${pad(M.length + 1)}</div>` +
        st('your weekly drop', 'w', 'left:30px;top:78px;font-size:30px', -3) +
        st('due fri 🔔', '', 'right:34px;top:30px', -6) + st(`wk ${S.weekStreak} in a row`, 'm', 'right:56px;top:96px', 5) +
        (R.recOn ? '' : st('press the knob to record', 'c', 'left:50%;top:52%;transform:translateX(-50%)', 0)) +
        `<div class="chips">${['win', 'stuck', 'ask'].map((c, i) => `<span class="chip ${R.chipsLit[c] ? 'lit' : ''}" style="background:${['var(--mint)', 'var(--cyan)', 'var(--pink)'][i]}">1 ${c}</span>`).join('')}</div>`;
      attachCam();
    };
    render();
    getCam().then(() => { if (R.mode === 'record') render(); });
    lcd('01', 'min', '00', 'sec left', 'WIN · STUCK · ASK');
    const mark = c => { R.chipsLit[c] = true; view.querySelectorAll('.chip').forEach((el, i) => el.classList.toggle('lit', !!R.chipsLit[['win', 'stuck', 'ask'][i]])); };
    keys([{ i: '🏆', l: 'win', fn: () => mark('win') }, { i: '🧱', l: 'stuck', fn: () => mark('stuck') }, { i: '🙋', l: 'ask', fn: () => mark('ask') }, { i: '⏹', l: 'send', fn: send }], 'rec');
    R.recRender = render;
  },
  shelf() {
    view.innerHTML = `<div class="grid shelf"><div class="hd"><div class="hd-t">your <i>shelf</i></div><div class="osd sans" style="position:static">${S.tapes.length} tapes · ${S.collabs} collabs</div></div>` +
      S.tapes.slice(0, 12).map(t => { const m = [...M, CY].find(x => x.id === t.who) || M[0]; return `<div class="tape"><div class="lb" style="background:${t.replay ? '#f4f2f5' : PAL[m.k][4]}">${t.replay ? 'c.y. live' : t.who + ' × you'}<small>${t.replay ? 'replay' : t.min + ' min'} · ${t.date}</small></div><div class="reels"><div class="reel"></div><div class="reel"></div></div></div>`; }).join('') + `</div>`;
    lcd(pad(S.tapes.length), 'tapes', pad(S.collabs), 'collabs', 'COLLECT THEM ALL');
    keys([{ i: '🏠', l: 'lounge', fn: () => go('lounge') }, { i: '📺', l: 'guide', fn: () => go('guide') }, { i: '🔁', l: 'spin', fn: () => go('spin') }, { i: '✕', l: 'back', fn: () => go('lounge') }], 'spin');
  },
  onair() {
    if (!R.onAir) {
      view.innerHTML = `<div class="feed noise"></div><div class="bigname" style="left:30px;bottom:74px;font-size:96px">c.y.</div><div class="osd sans" style="left:34px;bottom:40px;color:#ff3b5c">off air · he drops in when he drops in</div>` + st('stay tuned', 'w', 'right:34px;top:30px', -4);
      lcd('00', 'watching', pad(S.hands), 'hands up', 'OFF AIR');
      keys([{ i: '✋', l: 'raise', fn: raise }, { i: '🔔', l: 'notify me', fn: () => toast("we'll ping you when c.y. goes live") }, { i: '📺', l: 'guide', fn: () => go('guide') }, { i: '🏠', l: 'leave', fn: () => go('lounge') }], 'ask');
      return;
    }
    $('#lamp').classList.add('on', 'blink');
    view.innerHTML = feed(CY, { talk: true }) + `<div class="osd" style="left:30px;top:26px;font-size:32px">CH 00</div>` +
      `<div class="bigname" style="left:30px;bottom:74px;font-size:110px">c.y.</div><div class="osd sans" style="left:34px;bottom:40px">live · ${23 + (S.hands - 7)} watching · recording to the shelf</div>` +
      st('SAFE or priced?', 'w', 'right:34px;top:30px;font-size:28px', -4) + st(`✋ ${S.hands + 2} asked this`, '', 'right:60px;top:100px', 4);
    lcd(pad(23 + (S.hands - 7)), 'watching', pad(S.hands), 'hands up', 'ON AIR');
    keys([{ i: '✋', l: 'raise', fn: raise }, { i: '🔥', l: 'fire', fn: () => react('🔥', 3) }, { i: '💗', l: 'love', fn: () => react('💗', 3) }, { i: '🏠', l: 'leave', fn: () => go('lounge') }], 'ask');
    R.auto = setInterval(() => react(['💗', '🔥', '✋', '💗'][Math.random() * 4 | 0], 1 + (Math.random() * 2 | 0)), 1400);
  },
};
function passAux() { R.auxIdx++; toast(`aux passed to ${R.partner ? R.partner.id : 'them'} · new track`); SFX.static(.25); react('🎧', 2); }
function raise() { S.hands++; persist(); $('#lcdB').textContent = pad(S.hands); toast(`you're in the queue · #${S.hands - 6}`); react('✋', 3); }
function helpAsk(m) {
  if (R.playStep !== 2) { toast('wait for the ask'); return; }
  if (S.helped.includes(m.id)) { toast(`you already pinged ${m.id}`); return; }
  S.helped.push(m.id); S.saved++; persist(); SFX.win(); react('🙋', 3); toast(`pinged ${m.id} · that's ${S.saved} calls c.y. didn't take`);
}
function asks() {
  const ex = view.querySelector('.asklist'); if (ex) { ex.remove(); go('guide'); return; }
  const list = M.filter(m => m.drop);
  const box = document.createElement('div'); box.className = 'asklist';
  box.innerHTML = list.map(m => `<div class="ask"><div class="dot" style="background:${PAL[m.k][4]}">${m.id[0].toUpperCase()}</div><p>${m.drop.ask}<small>${m.id} · ${m.co}</small></p><button data-id="${m.id}" ${S.helped.includes(m.id) ? 'disabled' : ''}>${S.helped.includes(m.id) ? 'sent' : 'i got you'}</button></div>`).join('');
  view.appendChild(box);
  box.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.id; if (S.helped.includes(id)) return; S.helped.push(id); S.saved++; persist(); SFX.win();
    b.textContent = 'sent'; b.disabled = true; toast(`pinged ${id} · ${S.saved} calls c.y. didn't take`); $('#lcdMid').textContent = `SAVED ${pad(S.saved)}`;
  }));
  lcd(pad(list.length - S.helped.length), 'open asks', pad(S.saved), 'calls saved', 'NETWORK > CALENDAR');
}
function playSel(auto) { go('play', { auto }); }
function nextDrop(auto) { const list = all(); R.sel = (R.sel + 1) % list.length; staticBurst(220); if (auto && R.sel === 0) { go('guide'); return; } go('play', { auto }); }
function startRec() {
  if (R.recOn) return;
  R.recOn = true; R.recLeft = 60; $('#lamp').classList.add('on', 'blink'); $('#lampTxt').textContent = 'rec';
  R.chunks = [];
  if (R.cam && window.MediaRecorder) { try { R.rec = new MediaRecorder(R.cam); R.rec.ondataavailable = e => e.data.size && R.chunks.push(e.data); R.rec.start(); } catch { R.rec = null; } }
  R.recRender(); SFX.knob(); tone(880, .15, .15, 'square');
  R.timer = setInterval(() => { R.recLeft--; $('#lcdA').textContent = '00'; $('#lcdB').textContent = pad(R.recLeft); if (R.recLeft <= 0) send(); }, 1000);
}
function send() {
  if (!R.recOn) { toast('press the knob to start recording'); return; }
  clearInterval(R.timer); R.recOn = false;
  const finish = () => {
    S.dropped = true; S.weekStreak++; persist(); bumpStreak();
    R.myDrop = { len: Math.max(5, 60 - R.recLeft), win: R.chipsLit.win ? 'my win this week' : 'quick update', stuck: R.chipsLit.stuck ? "what i'm stuck on" : 'nothing stuck', ask: R.chipsLit.ask ? 'my ask for the room' : 'no ask this week' };
    S.wire.push('you · new weekly drop'); persist(); marquee(); SFX.win();
    toast(`your drop is on air · wk ${S.weekStreak} in a row`); go('guide');
  };
  if (R.rec && R.rec.state !== 'inactive') { R.rec.onstop = () => { try { R.blob = URL.createObjectURL(new Blob(R.chunks, { type: R.rec.mimeType || 'video/webm' })); } catch {} finish(); }; R.rec.stop(); }
  else finish();
}

/* ---------------- input: keys ---------------- */
document.querySelectorAll('.key').forEach(el => {
  const i = +el.dataset.k;
  el.addEventListener('pointerdown', () => { if (!R.on) return; el.classList.add('down'); el.classList.contains('dark') ? SFX.dark() : SFX.key(); });
  const up = () => el.classList.remove('down');
  el.addEventListener('pointerup', up); el.addEventListener('pointerleave', up);
  el.addEventListener('click', () => { el.blur(); if (!R.on) { powerOn(); return; } KEYS[i] && KEYS[i].fn(); });
});

/* ---------------- input: knob ---------------- */
const knob = $('#knob'), ind = $('#knobInd');
let kd = null;
function setInd() { ind.style.transform = `rotate(${R.angle}deg)`; }
function knobCenter() { const r = knob.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
knob.addEventListener('pointerdown', e => {
  if (!R.on) return; knob.setPointerCapture(e.pointerId);
  const [cx, cy] = knobCenter(); kd = { a: Math.atan2(e.clientY - cy, e.clientX - cx), acc: 0, moved: 0, t: Date.now() };
  knob.classList.add('pressed');
});
knob.addEventListener('pointermove', e => {
  if (!kd) return; const [cx, cy] = knobCenter(); const a = Math.atan2(e.clientY - cy, e.clientX - cx);
  let d = (a - kd.a) * 180 / Math.PI; if (d > 180) d -= 360; if (d < -180) d += 360; kd.a = a;
  kd.acc += d; kd.moved += Math.abs(d); R.angle += d; setInd();
  while (Math.abs(kd.acc) >= 30) { const dir = Math.sign(kd.acc); kd.acc -= dir * 30; turn(dir); }
});
const kUp = () => {
  if (!kd) return; knob.classList.remove('pressed');
  if (kd.moved < 8 && Date.now() - kd.t < 700) press();
  R.angle = Math.round(R.angle / 30) * 30; setInd(); kd = null;
};
knob.addEventListener('pointerup', kUp); knob.addEventListener('pointercancel', kUp);
knob.addEventListener('click', e => { if (!R.on) powerOn(); });
knob.addEventListener('wheel', e => { if (!R.on) return; e.preventDefault(); const dir = e.deltaY > 0 ? 1 : -1; R.angle += dir * 30; setInd(); turn(dir); }, { passive: false });
function turn(dir) {
  SFX.tick();
  if (R.mode === 'lounge') { const n = all().length; R.ch = (R.ch + dir + n) % n; staticBurst(200); go('lounge'); }
  else if (R.mode === 'guide') { const n = all().length; R.sel = (R.sel + dir + n) % n; view.querySelectorAll('.tile').forEach((t, i) => t.style.boxShadow = i === R.sel ? '0 0 0 3px #fff' : ''); }
  else if (R.mode === 'shelf' || R.mode === 'after') { /* detent only */ }
  else if (R.mode === 'play') { R.sel = (R.sel + dir + all().length) % all().length; staticBurst(200); go('play', {}); }
}
function press() {
  SFX.knob(); knob.classList.add('pressed'); setTimeout(() => knob.classList.remove('pressed'), 120);
  ({
    lounge: () => go('spin'), after: () => go('spin'), shelf: () => go('spin'),
    spin: () => go('after'), guide: () => playSel(false), play: () => nextDrop(false),
    record: () => R.recOn ? send() : startRec(), onair: raise,
  })[R.mode]?.();
}

/* ---------------- input: fader ---------------- */
const fader = $('#fader');
function setAux(v) { R.aux = Math.min(1, Math.max(0, v)); const w = fader.clientWidth - 36; $('#faderFill').style.width = (R.aux * w) + 'px'; $('#faderCap').style.left = (18 + R.aux * w) + 'px'; if (A.music) A.music.gain.setTargetAtTime(R.aux * .55, A.ctx.currentTime, .05); }
let fd = false;
fader.addEventListener('pointerdown', e => { fd = true; fader.setPointerCapture(e.pointerId); move(e); SFX.tick(); });
fader.addEventListener('pointermove', e => fd && move(e));
fader.addEventListener('pointerup', () => fd = false);
function move(e) { const r = fader.getBoundingClientRect(), s = r.width / fader.clientWidth; setAux((e.clientX - r.left - 18 * s) / (r.width - 36 * s)); }

/* ---------------- vu ---------------- */
const vu = $('#vu'); vu.innerHTML = '<span></span>'.repeat(10); const bars = [...vu.children];
const fbuf = new Uint8Array(32);
(function vuLoop() {
  if (A.an && R.on) { A.an.getByteFrequencyData(fbuf); bars.forEach((b, i) => b.style.height = Math.max(6, fbuf[i + 1] / 255 * 100 * (0.6 + R.aux * .5)) + '%'); }
  else bars.forEach(b => b.style.height = '6%');
  requestAnimationFrame(vuLoop);
})();

/* ---------------- power ---------------- */
const crt = $('#crt'), po = $('#powerOff'), pw = $('#power');
function powerOn() {
  if (R.on) return; R.on = true; audioInit(); SFX.power(true);
  pw.classList.add('on'); po.classList.add('hide'); crt.classList.remove('off-anim'); void crt.offsetWidth; crt.classList.add('on-anim');
  setTimeout(() => crt.classList.remove('on-anim'), 800);
  go('lounge'); setAux(R.aux);
  if (!R.cyT) R.cyT = setTimeout(() => { R.onAir = true; strip(); $('#lamp').classList.add('on', 'blink'); $('#statusEtch').textContent = 'c.y. is live'; SFX.win(); toast('c.y. just went on air · turn to ch 00'); S.wire.push('c.y. on air now'); marquee(); }, 30000);
}
function powerOff() {
  R.on = false; SFX.power(false); clearTimers(); pw.classList.remove('on'); crt.classList.add('off-anim');
  setTimeout(() => { po.classList.remove('hide'); }, 420); if (A.ctx) A.ctx.suspend(); stopCam();
}
pw.addEventListener('click', () => R.on ? powerOff() : powerOn());
po.addEventListener('click', powerOn);
$('#strip').addEventListener('click', e => {
  const b = e.target.closest('.ch'); if (!b) return; if (!R.on) { powerOn(); return; }
  const i = +b.dataset.ch; SFX.key(); staticBurst(220);
  if (i === 0) go('onair'); else { R.ch = i - 1; go('lounge'); }
});

/* ---------------- keyboard ---------------- */
document.addEventListener('keydown', e => {
  if (e.repeat) return;
  if (!R.on) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); powerOn(); } return; }
  const k = e.key.toLowerCase();
  if (k === 'arrowright' || k === 'arrowdown') { R.angle += 30; setInd(); turn(1); }
  else if (k === 'arrowleft' || k === 'arrowup') { R.angle -= 30; setInd(); turn(-1); }
  else if (k === ' ' || k === 'enter') { e.preventDefault(); press(); }
  else if (k === 'g') go('guide'); else if (k === 'r') go('record'); else if (k === 's') go('shelf'); else if (k === 'l') go('lounge'); else if (k === '0') go('onair');
  else if ('1234'.includes(k)) { const el = $(`.key[data-k="${+k - 1}"]`); el.classList.add('down'); el.classList.contains('dark') ? SFX.dark() : SFX.key(); setTimeout(() => el.classList.remove('down'), 110); KEYS[+k - 1]?.fn(); }
});

/* ---------------- layout + tilt ---------------- */
const dev = $('#device'), room = $('#room'), fs = $('#floorShadow');
let tilt = { x: 0, y: 0 };
function layout() {
  const vw = innerWidth, vh = innerHeight;
  R.pocket = vw < 760 || vw / vh < .78;
  document.body.classList.toggle('pocket', R.pocket);
  const w = R.pocket ? PW : W, h = R.pocket ? PH : H;
  const s = Math.min((vw - (R.pocket ? 16 : 60)) / w, (vh - (R.pocket ? 16 : 70)) / h);
  R.scale = s; apply();
  fs.style.width = (w * s * .92) + 'px'; fs.style.height = (60 * s + 20) + 'px'; fs.style.transform = `translate(-50%, ${h * s / 2 - 10}px)`;
  setAux(R.aux);
}
function apply() { dev.style.transform = `translate(-50%,-50%) scale(${R.scale}) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`; }
room.addEventListener('pointermove', e => {
  if (kd || fd) return;
  const mx = e.clientX / innerWidth, my = e.clientY / innerHeight;
  document.documentElement.style.setProperty('--mx', mx.toFixed(3)); document.documentElement.style.setProperty('--my', my.toFixed(3));
  if (!R.pocket && e.pointerType === 'mouse') { tilt = { x: (mx - .5) * 4, y: -(my - .5) * 3 }; apply(); }
});
addEventListener('resize', layout);
layout(); marquee(); strip();
keys([{ i: '🔥', l: 'fire', fn() {} }, { i: '💗', l: 'love', fn() {} }, { i: '📺', l: 'guide', fn() {} }, { i: '📼', l: 'shelf', fn() {} }], 'spin');
lcd('--', 'live now', '--', 'day streak');
window.__mntv = { R, S, go, powerOn };
})();
