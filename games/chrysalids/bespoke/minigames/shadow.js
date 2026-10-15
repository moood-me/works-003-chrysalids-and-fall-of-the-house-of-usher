// «По тени» (V, «Край Окраин»): the last field, the gap in the fence, the trees of the Fringes beyond;
// the father's lantern in the field, its light going from place to place. The moon is behind the
// forest: the trees' shadows lie across the field — dark pools on the path. Held, we walk (slowly; at
// the fence slower still); let go, we freeze. In the light we are seen — at once if moving, in a
// breath if standing in the open; in a shadow never. Seen, we run for the trees: no stopping it.
//   opts: { hard: he looks our way more often (the rider let live), onSeen(where: 'field' | 'fence')
//   → (a promise: the end waits for it) }
//   → { seen }
import { veil, playing, clamp } from './veil.js';

let styled = null;
const PATH = d => (d < 12 ? -0.6 + 2 * d / 12 : 1.4 + 1.2 * Math.sin((d - 12) / 12)); // the path across the field (the scene's field: X(d))
const END = 21, FENCE = [11.5, 12.5], WALK = 0.55, CLIMB = 0.5, RUN = 1.7; // metres; a second
const POOLS = [[6, 7], [9, 10], [12.7, 13.8], [15.6, 16.6], [18.4, 22]]; // where the trees' shadows cross the path
const LANTERN = { d: 10, a: -6.2 + 0.32, up: 0.95 };

export default {
  title: 'По тени', // (as the author's ☰ lists it)
  skipped: { seen: false },
  run: (g, b, { hard = false, onSeen } = {}, signal) => playing(signal, { seen: false }, done => {
    styled ||= b.css('minigames/shadow.css').catch(e => b.trouble(e.message));
    const v = veil(b, signal), steps = v.noise('bandpass', 1600, 0.6);
    const pools = POOLS.map(([d0, d1]) => ({ d0, d1, el: v.light('shadow-pool') }));
    const beam = v.light('shadow-beam'), us = v.light('shadow-us'), word = v.light('veil-word');
    word.textContent = 'держи — идём, отпусти — замираем';
    // the field as the camera sees it, from two things standing on it straight ahead: the fence (12 m)
    // and the trees (21 m) — the horizon, the middle line, metres in px at any distance
    const view = () => {
      const f = b.where('fence'), f1 = b.where('fence', 1), t = b.where('hero_trees');
      const h = innerHeight, w = innerWidth;
      const yf = f?.y ?? 0.7 * h, yt = t?.y ?? 0.64 * h, xf = f?.x ?? w / 2, xt = t?.x ?? w / 2;
      const c = (yf - yt) / (1 / 12 - 1 / 21), yh = yf - c / 12, cx = (xf - xt) / (1 / 12 - 1 / 21), xh = xf - cx / 12;
      const m = f && f1 ? Math.abs(f.y - f1.y) * 12 : 0.07 * h * 12; // px of a metre, times the distance
      return { at: (d, a) => ({ x: xh + (cx + a * m) / d, y: yh + c / d }), m: d => m / d };
    };
    let V = view(), d = 0, down = false, t0 = 0, sent = 0, beat = 0, exposure = 0, seen = false, said = null, over = false;
    // where we begin: the nearest bit of the path still well on the screen
    for (d = 3; d < 8 && V.at(d, PATH(d)).y > innerHeight * 0.88; d += 0.25);
    const press = on => e => { if (e.button > 0) return; down = on; if (on && e.pointerId != null) v.el.setPointerCapture(e.pointerId); };
    v.on('pointerdown', press(true));
    v.on('pointerup', press(false));
    v.on('pointercancel', press(false));
    const key = on => e => { if (e.code === 'Space') { e.preventDefault(); down = on; } };
    v.on('keydown', key(true), window);
    v.on('keyup', key(false), window);
    // his looks: away over the field — or along the path, near where we are
    let aim = null, from = 0, to = 0, turnAt = 0, until = 0;
    const look = (time, here) => {
      const ours = !here ? false : Math.random() < (hard ? 0.55 : 0.4);
      const at = ours ? here + (Math.random() - 0.4) * 5 : 4 + Math.random() * 6, a = ours ? PATH(at) : -14 + Math.random() * 9;
      const O = V.at(LANTERN.d, LANTERN.a), T = V.at(Math.max(3, at), a);
      to = Math.atan2(T.y - O.y + LANTERN.up * V.m(LANTERN.d), T.x - O.x);
      from = aim ?? to; // the first look: he is looking there already
      if (Math.abs(to - from) > Math.PI) to += to > from ? -2 * Math.PI : 2 * Math.PI;
      turnAt = time;
      until = time + 1.3 + (ours ? (hard ? 2.4 : 1.8) : (hard ? 1.6 : 2.6)) + Math.random() * 1.2;
    };
    v.loop((dt, t) => {
      t0 ||= t;
      const time = t - t0, h = innerHeight;
      V = view();
      // walking, frozen — or running, once seen
      const shade = POOLS.some(([a, z]) => d >= a && d <= z), fence = d >= FENCE[0] && d <= FENCE[1];
      const moving = seen || (down && !over);
      if (moving && d < END) d = Math.min(END, d + (seen ? RUN : WALK * (fence ? CLIMB : 1)) * dt);
      v.to(steps, moving && d < END ? (seen ? 0.05 : 0.018) : 0, 0.12);
      // his lantern: turning from look to look
      if (!seen && time >= until) look(time, time > 3 ? d : 0);
      if (seen) { const O = V.at(LANTERN.d, LANTERN.a), U = V.at(d, PATH(d)); to = Math.atan2(U.y - O.y + LANTERN.up * V.m(LANTERN.d), U.x - O.x); from = aim; turnAt = time - 1; }
      const k = clamp((time - turnAt) / 1.3);
      aim = from + (to - from) * (k * k * (3 - 2 * k));
      const O = V.at(LANTERN.d, LANTERN.a), ox = O.x, oy = O.y - LANTERN.up * V.m(LANTERN.d);
      const L = Math.max(innerWidth, h) * 0.75;
      beam.style.width = `${L.toFixed(0)}px`;
      beam.style.height = `${(L * 0.55).toFixed(0)}px`;
      beam.style.transform = `translate(${ox.toFixed(1)}px, ${oy.toFixed(1)}px) translate(0, -50%) rotate(${aim.toFixed(4)}rad)`;
      beam.style.opacity = '1';
      // are we in his light
      const U = V.at(d, PATH(d)), ux = U.x - ox, uy = U.y - oy, off = Math.abs(Math.atan2(Math.sin(Math.atan2(uy, ux) - aim), Math.cos(Math.atan2(uy, ux) - aim)));
      const lit = !shade && off < 0.22 && Math.hypot(ux, uy) < L * 0.95;
      exposure = clamp(exposure + (lit ? (moving ? 3 : 0.6) : -0.8) * dt);
      if (!seen && exposure >= 1) {
        seen = true;
        v.tone(98, 0, 2.2, 0.08);
        said = Promise.resolve(onSeen?.(d < FENCE[0] ? 'field' : 'fence')).catch(e => b.trouble(e.message));
      }
      // the heart, quicker the nearer the light
      if (time > beat) { beat = time + (seen ? 0.42 : 1 - 0.5 * exposure); v.tone(60, 0, 0.16, 0.03 + 0.07 * exposure); }
      // how it looks: the shadows on the path, us, the hint
      for (const p of pools) {
        const near = V.at(p.d0, PATH(p.d0)), far = V.at(Math.min(p.d1, 30), PATH(Math.min(p.d1, 30))), mid = (p.d0 + Math.min(p.d1, 30)) / 2;
        p.el.style.width = `${(2.6 * V.m(mid)).toFixed(0)}px`;
        p.el.style.height = `${Math.max(8, near.y - far.y).toFixed(0)}px`;
        v.put(p.el, (near.x + far.x) / 2, (near.y + far.y) / 2, 1, 0.9);
      }
      us.classList.toggle('lit', exposure > 0.3 || seen);
      v.put(us, U.x, U.y - 0.5 * V.m(d), clamp(V.m(d) / 120, 0.25, 1.4), shade && !seen ? 0.45 : 0.85);
      v.put(word, innerWidth / 2, h * 0.9, 1, time < 9 && !seen ? 0.8 * clamp(time / 1.2) : 0);
      if (t - sent > 0.3) { sent = t; g.set('lantern_in_field', 1, 0.6); }
      // in under the trees: over (once his shout, if any, is out)
      if (d >= END && !over) {
        over = true;
        Promise.resolve(said).then(() => { if (!v.alive) return; v.end(); done({ seen }); });
      }
    });
  }),
};
