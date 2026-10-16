// “The hem” (I.2, “The bank by the stream”, inside the beat `ridge` from its moment ridge:hem): David draws Sophie's hem over her
// bare foot before the rider on the meadow comes to where the stones are seen.
//   1. what he does — pulls her hem down over the foot; 2. wants — the six toes unseen; 3. hurried, afraid for her,
//   gentle; 4. the player — haste and tenderness, the hooves coming on.
// The language's pull along a way: a dashed mark on the hem (closeup#hem), its way to the foot (closeup#foot); the scene
// draws the hem where the hand has it (its key `hem`); let go half way, it slides back, seen (a spring). The time — the
// arc on the mark: the rider coming (r_near). Done: the hem on the foot before he has come (ridge:seen) — hid; else late.
// The ghost shows the pull once, at the start, while the scene holds the rider at the meadow's edge (its key r_wait, which
// the chapter sets): the showing is not the player's time — he rides on once it is over or a finger is down.
//   opts: { onRide() — said as he rides on }
//   → { hid }
import { until, keys } from '../hands.js';

export default {
  title: 'The hem', // (as the author's ☰ lists it)
  about: 9,
  skipped: { hid: true },
  async run(g, b, { onRide } = {}, signal) {
    const seen = g.told('ridge:seen');
    let late = false;
    seen.then(ok => { if (ok) late = true; });
    const mg = g.minigame({ phrase: tr('The rider came closer and closer, and her foot was bare') });
    const send = keys(g);
    const hem = mg.mark({ at: 'closeup#hem', kind: 'dash', time: 1 });
    const pull = mg.pull({ on: hem, to: 'closeup#foot', release: 'spring' });
    let held = true;
    const ride = () => { if (held) { held = false; g.set('r_wait', false); onRide?.(); } };
    mg.show({ gestures: [pull] }).finished.then(ride);
    const off = mg.on('down', ride);
    const done = await until(mg, () => {
      const s = pull.state, u = s.shown ?? s.u;
      send('hem', u);
      hem.set({ time: Math.max(0, 1 - (g.get('r_near') ?? 0)) });
      mg.plate.set({ fill: s.u, glow: s.held ? 'good' : 'idle' });
      return s.u >= 0.99 || late;
    });
    off();
    ride();
    if (!done) {
      g.set('hem', 1);
      return this.skipped;
    }
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
