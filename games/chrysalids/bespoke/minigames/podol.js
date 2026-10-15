// «Подол» (I.2, «Насыпь у ручья», inside the beat `ridge` from its moment ridge:hem): David draws Sophie's hem over her
// bare foot before the rider on the meadow comes to where the stones are seen.
//   1. what he does — pulls her hem down over the foot; 2. wants — the six toes unseen; 3. hurried, afraid for her,
//   gentle; 4. the player — haste and tenderness, the hooves coming on.
// The language's pull along a way: a dashed mark on the hem (closeup#hem), its way to the foot (closeup#foot); the scene
// draws the hem where the hand has it (its key `hem`); let go half way, it slides back, seen (a spring). The time — the
// arc on the mark: the rider coming (r_near). Done: the hem on the foot before he has come (ridge:seen) — hid; else late.
//   → { hid }
import { until, keys } from '../hands.js';

export default {
  title: 'Подол', // (as the author's ☰ lists it)
  about: 9,
  skipped: { hid: true },
  async run(g, b, opts, signal) {
    const seen = g.told('ridge:seen');
    let late = false;
    seen.then(ok => { if (ok) late = true; });
    const mg = g.minigame({ phrase: 'Всадник был всё ближе, а нога у неё была босая' });
    const send = keys(g);
    const hem = mg.mark({ at: 'closeup#hem', kind: 'dash', time: 1 });
    const pull = mg.pull({ on: hem, to: 'closeup#foot', release: 'spring' });
    b.minigame.tricks.teach(mg, [pull], { id: 'pull' });
    const done = await until(mg, () => {
      const s = pull.state, u = s.shown ?? s.u;
      send('hem', u);
      hem.set({ time: Math.max(0, 1 - (g.get('r_near') ?? 0)) });
      mg.plate.set({ fill: s.u, glow: s.held ? 'good' : 'idle' });
      return s.u >= 0.99 || late;
    });
    if (!done) return this.skipped;
    if (late) {
      await mg.end({ as: 'loss' });
      return { hid: false };
    }
    g.set('hem', 1);
    mg.snap({ at: hem });
    await mg.end({ as: 'clean' });
    return { hid: true };
  },
};
