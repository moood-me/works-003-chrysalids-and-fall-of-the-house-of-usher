// «Собрать видение из дыма» (III, «Рассказы Акселя»): while Axel tells what he saw, puffs of the fire's
// smoke drift up to where the vision hangs faint in the sky (the scene's vision, its story low); David
// takes them (press on one, or sweep over it pressed) and brings them to the places of its shape,
// which shimmer faintly — each puff in its place makes the vision clearer (story). Smoke left alone
// drifts away and thins. Over when every place is filled — or the smoke is gone up.
// The vision is left as clear as it was gathered; the chapter holds it the longer, the more exact.
//   opts: { vision: 1 ship | 2 city | 3 coast, hint: show what to do (the first time) }
//   → { exact: how much of the shape was gathered, 0…1 }
import { veil, playing, clamp, sky } from './veil.js';

let styled = null;
// the places of each shape: from where the scene draws the vision that is the one (its centre
// A·0.7, 0.5 of the sky, scale 1), in stage heights — the ship's hull, sails, jib; the city's towers;
// the coast's trees
const PLACES = {
  1: [[-0.1, -0.01], [0.1, -0.02], [-0.07, -0.13], [0, -0.17], [0.07, -0.12], [0.15, -0.09]],
  2: [[-0.22, -0.06], [-0.145, -0.15], [-0.025, -0.19], [0.04, -0.09], [0.11, -0.17], [0.2, -0.03]],
  3: [[-0.27, -0.17], [-0.19, -0.24], [-0.12, -0.15], [-0.035, -0.2], [0.05, -0.12], [0.14, -0.14]],
};
const CX = 16 / 9 * 0.7, CY = 0.5;
const GATHER = 30, EVERY = 1.3, LIFE = 13, MOST = 9; // seconds: to gather; a new puff; a puff's life; puffs at once
const NOTES = [392, 440, 523, 587, 659, 784];

export default {
  title: 'Видение из дыма', // (as the author's ☰ lists it)
  skipped: { exact: 0.6 },
  run: (g, b, { vision = 1, hint = false } = {}, signal) => playing(signal, { exact: 0.6 }, done => {
    styled ||= b.css('minigames/smoke.css').catch(e => b.trouble(e.message));
    const v = veil(b, signal), wind = v.noise('lowpass', 420, 0.4);
    const places = (PLACES[vision] || PLACES[1]).map(([x, y]) => ({ x, y, glow: v.light('smoke-place'), puff: null }));
    const word = hint ? v.light('veil-word') : null;
    if (word) word.textContent = 'сведи дым в то, о чём он говорит';
    const puffs = [];
    let px = 0, py = 0, down = false, held = null, t0 = 0, now = 0, next = 0.6, sent = 0, filled = 0, ending = 0;
    const at = p => sky(CX + p.x, CY + p.y);
    const near = (list, x, y, r) => list.reduce((best, q) => { const d = Math.hypot(q.sx - x, q.sy - y); return d < r && (!best || d < best.d) ? { q, d } : best; }, null)?.q;
    const grab = () => {
      if (held) return;
      const H = sky(0, 0).H, q = near(puffs.filter(p => !p.place && !p.gone), px, py, Math.max(44, 0.075 * H));
      if (!q) return;
      held = q;
      q.el.classList.add('held');
      v.tone(196, 0, 0.7, 0.035);
    };
    const drop = () => {
      if (!held) return;
      const q = held, H = sky(0, 0).H;
      held = null;
      q.el.classList.remove('held');
      for (const p of places) { const s = at(p); p.sx = s.x; p.sy = s.y; }
      const p = near(places.filter(p => !p.puff), q.sx, q.sy, Math.max(36, 0.07 * H));
      if (p) { // in its place: it stays, and the vision clears
        p.puff = q; q.place = p;
        v.tone(NOTES[filled % NOTES.length], 0, 1.6, 0.06);
        filled++;
      } else { q.born = now - (LIFE - 6); q.tx = q.sx; q.ty = q.sy; } // let go: it drifts off from there, a while yet
    };
    v.on('pointerdown', e => { v.el.setPointerCapture(e.pointerId); down = true; px = e.clientX; py = e.clientY; grab(); });
    v.on('pointermove', e => { px = e.clientX; py = e.clientY; if (down) grab(); });
    v.on('pointerup', () => { down = false; drop(); });
    v.on('pointercancel', () => { down = false; drop(); });
    v.to(wind, 0.03, 1);
    v.loop((dt, t) => {
      t0 ||= t;
      const time = t - t0, H = sky(0, 0).H, k = H / 700;
      now = time;
      for (const p of places) { const s = at(p); p.sx = s.x; p.sy = s.y; }
      // a new puff from the fire, drifting up to somewhere near a place of the shape
      if (!ending && time > next && puffs.filter(q => !q.place && !q.gone).length < MOST) {
        next = time + EVERY * (0.8 + 0.4 * Math.random());
        const f = b.where('fire', 0.5) || { x: innerWidth * 0.42, y: innerHeight * 0.62 };
        const p = places[Math.floor(Math.random() * places.length)];
        puffs.push({ el: v.light('smoke-puff'), sx: f.x, sy: f.y, tx: p.sx + (Math.random() - 0.5) * 0.26 * H, ty: p.sy + (Math.random() - 0.4) * 0.22 * H,
          born: time, age: 0, seed: Math.random() * 9, place: null, gone: false });
      }
      for (const q of puffs) {
        if (q.gone) continue;
        q.age = time - q.born;
        let o;
        if (q === held) { q.sx += (px - q.sx) * Math.min(1, dt * 14); q.sy += (py - q.sy) * Math.min(1, dt * 14); o = 0.95; }
        else if (q.place) { // in its place, breathing a little
          q.sx += (q.place.sx - q.sx) * Math.min(1, dt * 6); q.sy += (q.place.sy - q.sy) * Math.min(1, dt * 6);
          o = ending ? clamp(1 - (time - ending) / 1.5) * 0.8 : 0.8;
        } else { // up toward its spot, then the wind takes it
          const e = Math.min(1, dt * 0.55);
          q.tx += 0.014 * H * dt; q.ty -= 0.006 * H * dt;
          q.sx += (q.tx - q.sx) * e + 0.01 * H * Math.sin(time * 0.7 + q.seed) * dt;
          q.sy += (q.ty - q.sy) * e;
          o = clamp(q.age / 1.2) * clamp((LIFE - q.age) / 3) * (ending ? clamp(1 - (time - ending) / 1.5) : 1) * 0.75;
          if (q.age > LIFE) { q.gone = true; q.el.remove(); continue; }
        }
        v.put(q.el, q.sx, q.sy, k * (0.75 + 0.12 * Math.sin(time * 0.9 + q.seed) + (q.place ? 0.1 : 0)), o);
      }
      // the places shimmer, the nearer the puff in hand the more
      places.forEach((p, i) => {
        const h = held ? clamp(1 - Math.hypot(held.sx - p.sx, held.sy - p.sy) / (0.2 * H)) : 0;
        v.put(p.glow, p.sx, p.sy, k * (0.8 + 0.3 * h), p.puff || ending ? 0 : 0.1 + 0.05 * Math.sin(time * 1.3 + i * 1.7) + 0.4 * h);
      });
      if (word) { const w = at({ x: 0, y: 0.1 }); v.put(word, w.x, w.y, 1, time < 8 && !ending ? 0.8 * clamp(time / 1.2) : 0); }
      // the vision clears with every place filled
      if (t - sent > 0.3) { sent = t; g.set('story', 0.25 + 0.65 * filled / places.length, 0.8); }
      if (!ending && (filled === places.length || time > GATHER)) {
        ending = time;
        if (held) drop();
        if (filled === places.length) [523, 659, 784].forEach((f, i) => v.tone(f, i * 0.12, 2.4, 0.05));
      }
      if (ending && time > ending + 1.6) { v.end(); done({ exact: filled / places.length }); }
    });
  }),
};
