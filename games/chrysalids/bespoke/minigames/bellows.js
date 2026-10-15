// «Ритм мехов» (the forge, III and V): a man with a lantern looks in at the gate, and David works the bellows in time
// with his uncle's hammer, as if nothing were the matter. The hammer gives the beat — this game drives it (the
// scene's ax_blow: one blow, ax_pace seconds from the lift to the iron); each press is David's pull on the lever
// (pump), seen in the film. With the blow, the fire breathes up; off it, or a blow let go by, the bellows wheeze,
// the fire stumbles — and the lantern comes up and turns to the boy, and stays on him a while.
// The scene's own keeping-at-it (ax_work, pump_work) is stopped while it plays; the beat after it starts it again.
//   opts: { watched } — the man has his eye on the boy already: fewer slips pass
//   → { broke: more slips than pass }
import { veil, playing } from './veil.js';

const BEAT = 1.6, BLOWS = 12, SLACK = 0.28, FREE = 2; // the first FREE blows: getting into it, slips not counted

export default {
  title: 'Ритм мехов', // (as the author's ☰ lists it)
  skipped: { broke: false },
  run: (g, b, opts, signal) => playing(signal, { broke: false }, done => {
    const v = veil(b, signal), ring = v.light('veil-beat'), word = v.light('veil-word'), blow = v.noise('lowpass', 380, 0.5);
    word.textContent = 'тяни мехи в такт молоту';
    const pass = opts.watched ? 1 : 3, base = b.get('fire') ?? 0.7, eyeOn = [b.get('st_lx'), b.get('st_lz')];
    g.set('ax_work', 0);
    g.set('pump_work', 0);
    g.set('ax_pace', BEAT);
    let t0 = 0, started = -1, slips = 0, eye = 0, release = 0;
    const pulled = new Set(), judged = new Set();
    const now = () => performance.now() / 1000;
    // blow n starts at t0 + n·BEAT and lands one BEAT later
    const lands = n => t0 + (n + 1) * BEAT;
    const slip = t => {
      slips++;
      g.set('fire', base * 0.6, 0.3);
      v.tone(98, 0, 0.5, 0.05);
      // the lantern up, on the boy
      g.set('st_lamp', 1.3, 0.6);
      g.set('st_lx', b.get('dv_a'));
      g.set('st_lz', b.get('dv_d'));
      eye = t + 2.6;
    };
    const pull = () => {
      if (!t0) return;
      const t = now(), n = Math.round((t - t0) / BEAT) - 1;
      g.set('pump', 1, 0.15);
      release = t + 0.2;
      if (n >= 0 && n < BLOWS && Math.abs(t - lands(n)) < SLACK && !pulled.has(n)) { // with the blow: the fire breathes
        pulled.add(n);
        judged.add(n);
        g.set('fire', Math.min(1, base + 0.3), 0.15);
        g.set('sparks', 0.9, 0.15);
        blow.gain.cancelScheduledValues(v.audio.currentTime);
        blow.gain.setValueAtTime(0.09, v.audio.currentTime);
        blow.gain.setTargetAtTime(0, v.audio.currentTime + 0.12, 0.15);
      } else if (n >= FREE) slip(t); // a wheeze between the blows
    };
    v.on('pointerdown', e => { if (e.button === 0) pull(); });
    v.on('keydown', e => { if (e.code === 'Space' && !e.repeat) { e.preventDefault(); pull(); } }, window);
    v.loop((dt, t) => {
      t0 ||= t;
      const time = t - t0, n = Math.floor(time / BEAT);
      // the next blow begins: the hammer comes up
      if (n > started && n < BLOWS) { started = n; g.set('ax_blow', (b.get('ax_blow') || 0) + 1); }
      // a blow gone by without a pull
      for (let m = 0; m < BLOWS; m++) if (!judged.has(m) && t > lands(m) + SLACK) {
        judged.add(m);
        g.set('fire', base, 1);
        g.set('sparks', 0.5, 1);
        if (m >= FREE) slip(t);
      }
      if (release && t > release) { release = 0; g.set('pump', 0, 0.6); }
      if (eye && t > eye) { eye = 0; g.set('st_lamp', 1, 0.9); g.set('st_lx', eyeOn[0]); g.set('st_lz', eyeOn[1]); }
      // the ring closes on David's hands as the hammer comes down
      const p = b.where('david', 1.5) || { x: innerWidth * 0.12, y: innerHeight * 0.55 }, ph = time / BEAT - n;
      v.put(ring, p.x, p.y, 0.35 + 1.1 * (1 - ph), Math.min(1, ph * 1.6) * 0.8);
      v.put(word, p.x + 60, p.y - 90, 1, time < BEAT * 4 ? 0.9 : 0);
      if (time > (BLOWS + 1) * BEAT + 0.6) {
        v.end();
        if (eye) { g.set('st_lamp', 1, 0.9); g.set('st_lx', eyeOn[0]); g.set('st_lz', eyeOn[1]); }
        done({ broke: slips > pass });
      }
    });
  }),
};
