// «Ритм мехов» (III.1 and V.2, «Кузница дяди Акселя»): David works the bellows in time with his uncle's hammer under the
// eyes of the man with the lantern at the gate.
//   1. what he does — pumps the bellows to the hammer; 2. wants — to keep the forge going and give nothing away (in V —
//   while the key is made); 3. watched from the gate; 4. the player — a steady working rhythm under watch.
// The language's rhythm: the beat's sign on the hammer (axel#hand_l), the player's ring on the bellows' lever
// (pump#handle). The game drives the hammer (the scene's ax_blow — a blow from the lift, IMPACT s before the beat) and
// the lever (pump); BEATS beats (in V fewer), the first two a soft try. A beat missed — the fire sinks, the lantern comes
// up and onto the boy (st_lamp above 1: the scene turns it on him), and down again a while after. The bar — the beats
// hit.
//   opts: { watched: the man has his eye on him already — fewer slips pass; night: V — the key, the stranger at the gate }
//   → { broke: more slips than pass }
import { until } from '../hands.js';

const IMPACT = 1.17, FREE = 2, GLARE = 2.5;

export default {
  title: 'Ритм мехов', // (as the author's map lists it)
  about: 26,
  skipped: { broke: false },
  async run(g, b, { watched = false, night = false } = {}, signal) {
    const beat = night ? 1.6 : 2.0, n = night ? 8 : 12, pass = watched ? 1 : 3;
    const times = Array.from({ length: n }, (_, i) => IMPACT + 1 + i * beat);
    const mg = g.minigame({ phrase: night ? 'В воротах стоял человек с фонарём и смотрел' : 'Молот падал мерно, и горну нужен был воздух' });
    g.set('ax_work', 0);
    g.set('pump_work', 0);
    const hammer = mg.mark({ at: 'axel#hand_l', kind: 'light' });
    const lever = mg.mark({ at: 'pump#handle', kind: 'ring' });
    const rh = mg.rhythm({ on: lever, show: [hammer], times });
    b.minigame.tricks.teach(mg, [rh], { id: 'rhythm' });
    const hit = new Set();
    let slips = 0, blows = 0, fire = g.get('fire') ?? 0.75, pump = 0, glare = null;
    const slip = k => {
      if (k < FREE) return;
      slips++;
      fire = Math.max(0.35, fire - 0.12);
      g.set('fire', fire, 0.6);
      g.set('st_lamp', 1.3, 0.5);
      glare = mg.t + GLARE;
      mg.plate.set({ shade: Math.min(1, slips / (pass + 1)) });
    };
    rh.on('tap', ({ k, hit: on }) => {
      g.set('pump', ++pump);
      if (on && !hit.has(k)) { hit.add(k); fire = Math.min(0.95, fire + 0.05); g.set('fire', fire, 0.4); }
    });
    const judged = new Set();
    const done = await until(mg, () => {
      const t = rh.state.t;
      // the hammer: each blow from its lift, so that it lands on the beat
      while (blows < n && t >= times[blows] - IMPACT) { g.set('ax_blow', blows + 1); blows++; }
      for (let k = 0; k < n; k++) if (!judged.has(k) && t > times[k] + 0.3) { judged.add(k); if (!hit.has(k)) slip(k); }
      if (glare != null && mg.t >= glare) { glare = null; g.set('st_lamp', 1, 1.5); }
      mg.plate.set({ fill: hit.size / n, glow: slips ? 'bad' : 'good' });
      return judged.size >= n;
    });
    if (!done) return this.skipped;
    const broke = slips > pass;
    await mg.end({ as: broke ? 'loss' : slips ? 'flawed' : 'clean' });
    return { broke };
  },
};
