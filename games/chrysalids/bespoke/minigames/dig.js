// «Раскопки до колокола» (I.4, «Руины Древних»): David rakes the earth off the glint with his hands.
//   1. what he does — uncovers what the Old People left; 2. wants — to see it; 3. forbidden curiosity, haste; 4. the
//   player — uncovering bit by bit, the bell to come.
// The language's rub on a spot over the find (glint#plate): what is rubbed off is the scene's `dig` (the earth goes, then
// the grass; David on his knees digging). The time — the arc on the spot: the village bell at BELL seconds — it rings
// (the scene's `bell`, the game's toll) and the digging is over.
//   → { cleared: 0…1, bell: the bell ended it }
import { until, keys } from '../hands.js';

const BELL = 45;

export default {
  title: 'Раскопки до колокола', // (as the author's ☰ lists it)
  about: 30,
  skipped: { cleared: 1, bell: false },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Под дёрном блестело что-то гладкое, сделанное не нами' });
    const send = keys(g), t0 = mg.t;
    const spot = mg.mark({ at: 'glint#plate', kind: 'spot', time: 1 });
    const rub = mg.rub({ on: spot, full: 0.85 });
    mg.glow('glint');
    b.minigame.tricks.teach(mg, [rub], { id: 'rub' });
    let bell = false;
    const done = await until(mg, ({ t }) => {
      const u = Math.min(1, rub.state.u);
      send('dig', u);
      spot.set({ time: Math.max(0, 1 - (t - t0) / BELL) });
      mg.plate.set({ fill: u, glow: 'idle' });
      if (t - t0 >= BELL) bell = true;
      return u >= 1 || bell;
    });
    if (!done) return this.skipped;
    const cleared = Math.min(1, rub.state.u);
    if (bell) {
      g.set('bell', 1, 3);
      g.sound.toll();
      mg.plate.set({ phrase: 'Над долиной ударил колокол' });
      await mg.end({ as: cleared >= 0.6 ? 'flawed' : 'loss' });
      return { cleared, bell: true };
    }
    g.set('dig', 1);
    mg.snap({ at: spot });
    await mg.end({ as: 'clean' });
    return { cleared: 1, bell: false };
  },
};
