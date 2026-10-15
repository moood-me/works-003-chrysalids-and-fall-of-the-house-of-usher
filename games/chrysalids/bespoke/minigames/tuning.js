// «Настройка» (III, «Учимся слышать»): David sweeps the valley like the dial of a receiver — wind in
// the barley, and near each of the children their own short tune; the one whose tune was heard
// first is caught by staying on it. With watch: an adult down there turns (adults_near) — whoever
// moves then is seen.
//   opts: { find: the element whose voice is sought, watch: an adult turns, onTurn() }
//   → { caught (false: the voice found me by itself, in time), seen }
import { veil, playing, clamp } from './veil.js';

const TUNES = { washer: [880, 740, 587], shepherd: [587, 740, 880, 988], cart: [659, 659, 880], far_girl: [988, 880, 988, 740] };
const LOCK = 1.4, SEARCH = 40;

export default {
  title: 'Настройка', // (as the author's ☰ lists it)
  skipped: { caught: true, seen: false },
  run: (g, b, { find, watch = false, onTurn } = {}, signal) => playing(signal, { caught: true, seen: false }, done => {
    const v = veil(b, signal), A = v.audio;
    const ear = v.light('veil-ear'), lock = v.light('veil-lock');
    const voices = Object.keys(TUNES).map((id, i) => ({ id, glow: v.light('veil-voice'), c: 0, quiet: 0, next: A.currentTime + 3.2 + i * 0.65 }));
    const wind = v.noise('bandpass', 900, 0.5);
    const tune = (id, at, vol) => TUNES[id].forEach((f, k) => v.tone(f, at + k * 0.3, 0.7, vol));
    tune(find, 0.3, 0.12);
    tune(find, 1.7, 0.1);
    const home = b.where('david') || { x: innerWidth * 0.3, y: innerHeight * 0.6 };
    const turnAt = 6 + 3 * Math.random(), target = voices.find(vo => vo.id === find);
    let px = home.x, py = home.y, moved = 0, held = 0, on = null, t0 = 0, turned = 0, back = false, seen = false, caught = null, late = false, ending = 0;
    v.on('pointermove', e => { moved += Math.hypot(e.clientX - px, e.clientY - py); px = e.clientX; py = e.clientY; });
    v.on('pointerdown', e => { v.el.setPointerCapture(e.pointerId); px = e.clientX; py = e.clientY; });
    const R = Math.max(70, innerWidth * 0.06);
    v.loop((dt, t) => {
      t0 ||= t;
      const time = t - t0, watched = (g.get('adults_near') || 0) > 0.3;
      // the adult turns, a while into the search — or as soon as the voice is caught
      if (watch && !turned && (time > turnAt || caught)) { turned = time; g.set('adults_near', 1, 3); onTurn?.(); }
      if (turned && !back && time > turned + 9 + (seen ? 3 : 0)) { back = true; g.set('adults_near', 0, 4); }
      if (watched && moved > 50 && !seen) { seen = true; ear.classList.add('cold'); }
      if (!watched) moved = 0;
      let best = null;
      for (const vo of voices) {
        const p = b.where(vo.id);
        vo.c = !p || time < 3 || vo.quiet > time ? 0 : clamp(1 - Math.hypot(p.x - px, p.y - py) / R);
        if (vo === caught) vo.c = 1;
        if (watched) vo.c *= 0.15;
        if (p) v.put(vo.glow, p.x, p.y - 4, 0.6 + 0.5 * vo.c, vo.c * vo.c);
        if (A.currentTime > vo.next - 0.1) { if (vo.c > 0.05) tune(vo.id, Math.max(0, vo.next - A.currentTime), 0.11 * vo.c * vo.c); vo.next += 2.6; }
        if (!best || vo.c > best.c) best = vo;
      }
      v.to(wind, 0.045 * (1 - best.c) + (watched ? 0.03 : 0));
      v.put(ear, px, py, 1, caught ? 0.3 : 0.9);
      // staying on a voice catches it: hers — or, if it is someone else's, that one falls silent a while
      if (!caught && best.c > 0.7 && !watched) { if (on !== best) held = 0; on = best; held += dt; } else held = Math.max(0, held - 2 * dt);
      if (on) { const p = b.where(on.id); if (p) v.put(lock, p.x, p.y - 4, 1.8 - 0.8 * clamp(held / LOCK), clamp(held / LOCK)); }
      if (!caught && held >= LOCK) {
        held = 0;
        if (on === target) { caught = on; tune(find, 0, 0.14); } else { on.quiet = time + 4; v.tone(196, 0, 1.2, 0.06); }
      }
      if (!caught && time > SEARCH) { caught = target; late = true; tune(find, 0, 0.12); }
      // done when the voice is caught and the adult (if any) has turned back
      if (caught && (!watch || (back && g.get('adults_near') < 0.2))) {
        ending ||= time;
        if (time > ending + 1.4) { v.end(); done({ caught: !late, seen }); }
      }
    });
  }),
};
