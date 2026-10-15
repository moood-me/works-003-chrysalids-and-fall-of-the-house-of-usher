// «Успокоить» (IV, «Петра у реки»): while David runs down to the pool and swims after her (the film's
// beats `edge`, `run` — they end it: opts.until), he breathes for both — a ring breathes slowly (in,
// out) over Petra (over him while she is not in sight, and once he has her); pressing is breathing
// in, letting go — out. In time with it her silent cry (the scene's `cry`) quiets; out of time, or
// left alone, it stays — the louder it is at the end, the more of ours it knocks off their feet.
//   → { scream: how loud she is at the end, 0…1 }
import { veil, playing, clamp } from './veil.js';

const IN = 2, OUT = 2; // seconds: a breath in, out — a runner's breath, slowed

export default {
  title: 'Успокоить', // (as the author's ☰ lists it)
  skipped: { scream: 0.2 },
  run: (g, b, opts, signal) => playing(signal, { scream: 0.2 }, done => {
    const v = veil(b, signal);
    const ring = v.light('veil-ring'), mine = v.light('veil-breath'), word = v.light('veil-word');
    const breath = v.noise('lowpass', 520, 0.4);
    let pressed = false, fill = 0, scream = g.get('cry') ?? 0.65, t0 = 0, sent = 0, over = false, at = null;
    const press = on => e => { if (e.button > 0) return; pressed = on; if (on && e.pointerId != null) v.el.setPointerCapture(e.pointerId); };
    v.on('pointerdown', press(true));
    v.on('pointerup', press(false));
    v.on('pointercancel', press(false));
    const key = on => e => { if (e.code === 'Space') { e.preventDefault(); pressed = on; } };
    v.on('keydown', key(true), window);
    v.on('keyup', key(false), window);
    opts.until.then(() => { over = true; });
    // where the breath is: on Petra while she is in sight and still alone in the water, else on David
    const seen = p => p && p.x > 40 && p.x < innerWidth - 40 && p.y > 40 && p.y < innerHeight - 40;
    const target = () => {
      const p = g.get('pt_held') > 0.5 ? null : b.where('petra');
      return seen(p) ? p : b.where('david') || { x: innerWidth / 2, y: innerHeight / 2 };
    };
    v.loop((dt, t) => {
      t0 ||= t;
      const time = t - t0, ph = time % (IN + OUT), inhale = ph < IN;
      // her breath: the ring grows and shrinks; mine follows the press
      const r = inhale ? (1 - Math.cos(Math.PI * ph / IN)) / 2 : (1 + Math.cos(Math.PI * (ph - IN) / OUT)) / 2;
      const before = fill;
      fill = clamp(fill + (pressed ? 1 / IN : -1 / OUT) * dt);
      if (dt > 0) v.to(breath, 0.06 * Math.abs(fill - before) / dt * IN);
      const p = target();
      at = at ? { x: at.x + (p.x - at.x) * clamp(dt * 3), y: at.y + (p.y - at.y) * clamp(dt * 3) } : p; // it glides
      v.put(ring, at.x, at.y, 0.55 + 0.6 * r, 0.75);
      v.put(mine, at.x, at.y, 0.55 + 0.6 * fill, 0.25 + 0.75 * fill);
      // the first breaths are named; then she just breathes
      const name = time < 2 * (IN + OUT) ? (inhale ? 'вдох' : 'выдох') : '';
      if (name && word.textContent !== name) word.textContent = name;
      v.put(word, at.x, at.y + 100, 1, name ? 0.8 : 0);
      // in time (with a little slack where the breath turns) she quiets; out of time she cries out again
      const slack = Math.min(ph, IN + OUT - ph, Math.abs(ph - IN)) < 0.3;
      scream = clamp(scream + (pressed === inhale || slack ? -0.075 : 0.08) * dt);
      if (t - sent > 0.3) { sent = t; g.set('cry', scream, 0.3); }
      if (over) { v.end(); done({ scream }); }
    });
  }),
};
