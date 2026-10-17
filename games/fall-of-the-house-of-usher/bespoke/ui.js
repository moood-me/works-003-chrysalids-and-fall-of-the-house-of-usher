// What the game shows over the scene (bespoke.layer), in ink and paper:
//   view.gauges({scales, shown}) — each scale once the player has met it: the crack down the left
//     edge (longer, deeper, glowing red as the crack grows); the candle in the corner (sanity:
//     steady → trembling → guttering → out); Roderick's trust has none — only words.
//     view.gauges(null) — none (the wall between the chapters)
//   view.toast(text, kind) — a slip of paper, the words soaking into it: 'scale' (a scale moved),
//     'rule' (what a scale means, the first time), 'her' (Madeline heard it), 'mark'
//   view.letter({text, highlight, sign}, {signal}) — a folded letter on the dark: the player unfolds
//     it, reads it, folds it again; → then. text: its lines ('\n'); highlight: words of it underlined
//   view.title(text, {signal}) — words over the scene, as a film's title; → once they have gone
//   view.replaying(on) — the slip «Replay» in the corner while a replay goes on (game.js)
//   view.quiet() — what a chapter left showing taken away (the map comes)
//   view.notice(text) — a line low in the middle, till it is taken away (→ what takes it away): what a choice on the
//     map would do
//   view.author({chapters, at() → {chapter, step}, plays(chapter, step) → [titles of its minigames], go(chapter, step,
//     minigame)}) — the author's map, opened by his sign on «Crack» (author() → what opens or closes it): the
//     chapters, their steps and the steps' minigames, to go to any (a minigame: its index among the step's)
// The ⏸, ⏭ and ☰ are the page's.
// Whatever is shown is taken away when `signal` aborts (the step was left).
import { CRACK_FULL, SCALES } from './story.js';
import { paper } from './sound.js';

const NS = 'http://www.w3.org/2000/svg';
const el = (tag, cls, parent) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  parent?.append(e);
  return e;
};
const svg = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  parent?.append(e);
  return e;
};
// a steady random 0…1 sequence for a seed: the same crack, the same handwriting every time
const seeded = seed => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

export function ui(layer) {
  const crack = crackGauge(layer);
  const flame = candle(layer);
  const toasts = el('div', 'toasts', layer);
  const replay = el('div', 'replay', layer);
  replay.textContent = tr('Replay');
  replay.hidden = true;
  return {
    gauges(kept) {
      crack.show(!!kept?.shown.crack, kept ? 0.06 + 0.94 * Math.min(1, kept.scales.crack / CRACK_FULL) : 0);
      flame.show(!!kept?.shown.sanity, kept ? kept.scales.sanity / SCALES.sanity.max : 1);
    },
    toast(text, kind = 'scale') {
      const r = seeded(text.length * 7919 + toasts.childElementCount + 1);
      // three at most: the oldest goes for a new one
      while (toasts.childElementCount > 2) toasts.firstElementChild.remove();
      const slip = el('div', `slip ${kind}`, toasts);
      slip.style.rotate = `${(r() - 0.5) * 3}deg`;
      const p = el('p', '', slip);
      // a torn edge
      const edge = [];
      for (let x = 0; x <= 100; x += 10) edge.push(`${x}% ${(r() * 7).toFixed(1)}%`);
      for (let x = 100; x >= 0; x -= 10) edge.push(`${x}% ${(100 - r() * 7).toFixed(1)}%`);
      p.style.clipPath = `polygon(${edge.join(', ')})`;
      // the arrows are the serif's: the hand has none
      for (const part of text.split(/([↑↓])/)) if (part) el('span', /[↑↓]/.test(part) ? 'arrow' : '', p).textContent = part;
      const stay = kind === 'rule' ? 7500 : 4200;
      setTimeout(() => slip.classList.add('gone'), stay);
      setTimeout(() => slip.remove(), stay + 1600);
    },
    letter: (letter, { signal } = {}) => unfold(layer, letter, signal),
    title(text, { signal } = {}) {
      const t = el('div', 'title', layer);
      el('span', '', t).textContent = text;
      return new Promise(ok => {
        const timers = [setTimeout(() => t.classList.add('on'), 60), setTimeout(() => t.classList.remove('on'), 6600),
          setTimeout(() => { t.remove(); ok(); }, 9000)];
        signal?.addEventListener('abort', () => { timers.forEach(clearTimeout); t.remove(); });
      });
    },
    replaying(on) { replay.hidden = !on; },
    // what a chapter left showing (its strips) taken away: the map comes
    quiet() {
      toasts.replaceChildren();
    },
    notice(text) {
      const n = el('p', 'notice', layer);
      n.textContent = text;
      return () => n.remove();
    },
    author({ chapters, at, plays, go }) {
      const button = (text, title, onclick) => Object.assign(el('button'), { type: 'button', textContent: text, title, onclick });
      // the map: every chapter a column of its steps (and their minigames) in a window over the scene; a click outside,
      // ✕ or Esc closes it
      const map = el('div', 'author-map', layer);
      map.hidden = true;
      const close = () => { map.hidden = true; };
      map.onclick = e => { if (e.target === map) close(); };
      addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
      const open = () => {
        const here = at(), panel = el('div', 'author-panel');
        panel.append(button('✕', 'close (Esc)', close), ...chapters.map((c, ci) => {
          const col = el('section');
          el('h3', '', col).textContent = c.number ? `${c.number}. ${c.title}` : c.title;
          for (const [si] of c.steps.entries()) {
            const step = button(c.titles?.[si] || `step ${si + 1}`, '', () => { close(); go(ci, si); });
            if (ci === here.chapter && si === here.step) step.className = 'here';
            // (its minigames under it, once they are known: straight to one)
            const games = el('div', 'minigames');
            plays(ci, si).then(list => games.append(...list.map((name, k) =>
              Object.assign(button(`◆ ${name}`, 'straight to the mini-game', () => { close(); go(ci, si, k); }), { className: 'minigame' }))));
            col.append(step, games);
          }
          return col;
        }));
        map.replaceChildren(panel);
        map.hidden = false;
      };
      const toggle = () => (map.hidden ? open() : close());
      return toggle;
    },
  };
}

// the crack down the left edge of the screen: drawn once, shown as far down as `level` (0…1) says
function crackGauge(layer) {
  const r = seeded(1847);
  const box = svg('svg', { class: 'crack', viewBox: '0 0 40 1000', preserveAspectRatio: 'none', 'aria-hidden': 'true' }, layer);
  const pts = [];
  for (let y = -10, x = 15; y < 1020; y += 8 + r() * 16) {
    x = Math.min(30, Math.max(5, x + (r() - 0.5) * 10));
    pts.push([x, y]);
  }
  const d = p => `M${p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}`;
  let lines = d(pts);
  // the stone broken off it, here and there
  for (let i = 5; i < pts.length - 2; i += 4 + Math.floor(r() * 6)) {
    let [x, y] = pts[i];
    const side = x < 17 ? 1 : x > 24 ? -1 : r() < 0.5 ? -1 : 1;
    const twig = [[x, y]];
    for (let k = 0, n = 2 + Math.floor(r() * 3); k < n; k++) twig.push([(x += side * (2 + r() * 5)), (y += 5 + r() * 12)]);
    lines += d(twig);
  }
  const glow = svg('path', { class: 'glow', d: lines }, box);
  svg('path', { class: 'lip', d: lines }, box);
  svg('path', { class: 'core', d: lines }, box);
  return {
    show(on, level) {
      box.classList.toggle('on', on);
      box.style.setProperty('--level', on ? level : 0);
      glow.style.opacity = on ? Math.max(0, (level - 0.5) / 0.5) * 0.85 : 0;
    },
  };
}

// the candle in the corner: its flame as high and as steady as the mind is (`level` 0…1); out at 0
function candle(layer) {
  const W = 56, H = 104, BX = 28, BY = 60; // the canvas, the flame's foot (css px)
  const c = el('canvas', 'candle', layer);
  c.setAttribute('aria-hidden', 'true');
  const g = c.getContext('2d');
  let target = 1, now = 1, out = 0, raf = 0, last = 0; // out: seconds since it went out
  const wave = (t, s) => (Math.sin(t * 1.7 + s) + 0.6 * Math.sin(t * 2.9 + s * 2.1) + 0.3 * Math.sin(t * 5.3 + s * 0.7)) / 1.9;
  function draw(ms) {
    const dpr = devicePixelRatio || 1;
    if (c.width !== Math.round(W * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    const t = ms / 1000, dt = Math.min(0.1, t - last);
    last = t;
    now += (target - now) * Math.min(1, dt * 0.7);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    const lit = now > 0.04;
    out = lit ? 0 : out + dt;
    const tremble = Math.min(1, Math.max(0, (0.85 - now) / 0.35));
    const gutter = Math.min(1, Math.max(0, (0.45 - now) / 0.25));
    let h = 0;
    if (lit) {
      h = 8 + 14 * Math.min(1, now / 0.9);
      h *= 1 + wave(t * (2 + 5 * tremble), 1) * (0.05 + 0.14 * tremble + 0.2 * gutter);
      if (gutter) h *= 1 - 0.55 * gutter * Math.max(0, wave(t * 1.3, 4) - 0.3); // it sputters
    }
    // its light on the wall
    if (lit) {
      const halo = g.createRadialGradient(BX, BY - h * 0.4, 0, BX, BY - h * 0.4, 30);
      halo.addColorStop(0, `rgba(255, 176, 90, ${0.22 * Math.min(1, h / 18)})`);
      halo.addColorStop(1, 'rgba(255, 176, 90, 0)');
      g.fillStyle = halo;
      g.fillRect(0, 0, W, H);
    }
    // the candle: a stub of wax, run down one side, in a dish
    const wax = g.createLinearGradient(BX - 6, 0, BX + 6, 0);
    wax.addColorStop(0, '#8d8270');
    wax.addColorStop(0.35, lit ? '#e9dcc0' : '#bdb19a');
    wax.addColorStop(1, '#7c715f');
    g.fillStyle = wax;
    g.beginPath();
    g.moveTo(BX - 6, BY + 6);
    g.quadraticCurveTo(BX - 3, BY + 3, BX, BY + 4.5);
    g.quadraticCurveTo(BX + 4, BY + 3, BX + 6, BY + 5);
    g.lineTo(BX + 6, BY + 34);
    g.lineTo(BX - 6, BY + 34);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(BX + 6, BY + 5);
    g.quadraticCurveTo(BX + 8.5, BY + 12, BX + 7.5, BY + 18);
    g.arc(BX + 6.3, BY + 18, 1.3, 0, Math.PI);
    g.lineTo(BX + 5, BY + 9);
    g.fill();
    g.fillStyle = '#26211d';
    g.beginPath();
    g.ellipse(BX, BY + 35, 17, 3.6, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = 'rgba(200, 170, 120, 0.22)';
    g.beginPath();
    g.ellipse(BX, BY + 34.2, 15, 2, 0, Math.PI, Math.PI * 2);
    g.fill();
    // the wick
    g.strokeStyle = '#1b1612';
    g.lineWidth = 1.2;
    g.beginPath();
    g.moveTo(BX, BY + 4.5);
    g.quadraticCurveTo(BX + 0.3, BY + 2, BX + 1, BY);
    g.stroke();
    if (lit) {
      const sway = wave(t * 0.8, 2) * (0.6 + 2.6 * tremble + 1.5 * gutter);
      const w = 3.2 + 1.2 * Math.min(1, h / 18);
      const tipX = BX + sway, tipY = BY - h;
      const body = g.createRadialGradient(BX, BY - h * 0.25, 0.5, BX, BY - h * 0.35, h * 0.8);
      body.addColorStop(0, 'rgba(255, 250, 225, 1)');
      body.addColorStop(0.35, 'rgba(255, 214, 120, 0.95)');
      body.addColorStop(0.75, 'rgba(255, 140, 50, 0.6)');
      body.addColorStop(1, 'rgba(220, 80, 30, 0)');
      g.fillStyle = body;
      g.beginPath();
      g.moveTo(BX, BY + 2);
      g.bezierCurveTo(BX - w * 1.6, BY, tipX - w * 0.5, tipY + h * 0.45, tipX, tipY);
      g.bezierCurveTo(tipX + w * 0.5, tipY + h * 0.45, BX + w * 1.6, BY, BX, BY + 2);
      g.fill();
      // the blue at its foot, more as it gutters
      g.fillStyle = `rgba(110, 150, 255, ${0.25 + 0.45 * gutter})`;
      g.beginPath();
      g.ellipse(BX, BY - 0.5, w * 0.75, 2.2, 0, 0, Math.PI * 2);
      g.fill();
    } else if (out < 9) {
      // a thread of smoke going up from the wick, thinning
      const a = 0.45 * (1 - out / 9);
      g.strokeStyle = `rgba(200, 196, 190, ${a})`;
      g.lineWidth = 1.4;
      g.beginPath();
      for (let k = 0; k <= 24; k++) {
        const y = BY - k * 2.4, x = BX + 1 + Math.sin(k * 0.45 - t * 1.6) * k * 0.22 + wave(t + k * 0.1, 5) * k * 0.08;
        if (k) g.lineTo(x, y); else g.moveTo(x, y);
      }
      g.stroke();
    }
    raf = requestAnimationFrame(draw);
  }
  return {
    show(on, level) {
      c.classList.toggle('on', on);
      target = Math.max(0, Math.min(1, level));
      if (on && !raf) raf = requestAnimationFrame(draw);
      if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
    },
  };
}

// the letter: folded in three on the dark; tapped, it opens — the top third, then the bottom — and
// can be read; tapped again, it folds and goes
function unfold(layer, { text, highlight = '', sign = '' }, signal) {
  const r = seeded([...text].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 2147483647, 7) || 1);
  const veil = el('div', 'letter-veil', layer);
  veil.tabIndex = 0;
  const letter = el('div', 'letter', veil);
  const hint = el('p', 'letter-hint', veil);
  // the written sheet: its lines uneven, as a hand that shakes writes them
  const sheet = el('div', 'sheet');
  for (const line of text.split('\n')) {
    const p = el('p', '', sheet);
    p.style.cssText = `rotate: ${((r() - 0.5) * 2.2).toFixed(2)}deg; margin-left: ${(r() * 0.8).toFixed(2)}em; font-size: ${(0.94 + r() * 0.12).toFixed(2)}em`;
    const at = highlight ? line.indexOf(highlight) : -1;
    if (at < 0) { p.textContent = line; continue; }
    p.append(line.slice(0, at));
    el('mark', '', p).textContent = highlight;
    p.append(line.slice(at + highlight.length));
  }
  if (sign) el('p', 'sign', sheet).textContent = sign;
  for (const part of ['top', 'mid', 'bottom']) {
    const panel = el('div', `panel ${part}`, letter);
    el('div', 'face front', panel).append(part === 'top' ? sheet : sheet.cloneNode(true));
    const back = el('div', 'face back', panel);
    if (part === 'top') el('div', 'seal', back).textContent = tr.c('the seal: Usher’s initial', 'U');
  }
  let stage = 'folded';
  const wait = ms => new Promise(ok => setTimeout(ok, ms));
  return new Promise(done => {
    const leave = () => veil.remove();
    signal?.addEventListener('abort', leave);
    const press = async () => {
      if (stage === 'folded') {
        stage = 'opening';
        hint.classList.remove('on');
        paper();
        letter.classList.add('open-top');
        await wait(650);
        paper();
        letter.classList.add('open-bottom');
        await wait(1400);
        letter.classList.add('read');
        await wait(2600);
        hint.textContent = tr('fold');
        hint.classList.add('on');
        stage = 'open';
      } else if (stage === 'open') {
        stage = 'closing';
        hint.classList.remove('on');
        paper();
        letter.classList.remove('open-bottom', 'read');
        await wait(650);
        paper();
        letter.classList.remove('open-top');
        await wait(1100);
        veil.classList.remove('on');
        await wait(1300);
        signal?.removeEventListener('abort', leave);
        leave();
        done();
      }
    };
    veil.addEventListener('click', press);
    veil.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); press(); } });
    document.fonts.load('1em "Usher Hand"').finally(async () => {
      veil.classList.add('on');
      veil.focus({ preventScroll: true });
      await wait(1600);
      hint.textContent = tr('unfold');
      if (stage === 'folded') hint.classList.add('on');
    });
  });
}
