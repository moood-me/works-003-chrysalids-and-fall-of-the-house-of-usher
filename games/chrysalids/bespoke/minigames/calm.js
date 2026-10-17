// «Успокоить» (IV.1, «Петра у реки»): David runs down to the river and breathes with Petra in his mind.
//   1. what he does — breathes with her as he runs; 2. wants — to quiet her cry before everyone hears it; 3. haste and
//   care; 4. the player — a slow even breath while the scene rushes on.
// The language's rhythm held in the beat, anywhere: the second ring grows — hold, falls — let go; the beat's sign on
// whoever is in the frame (petra at the pool, david as he runs: the point always in the window). They go at their own
// pace, the camera moving. In time her cry (the scene's `cry`) quiets, out of it it grows. While the beats `edge` and
// `run` go on (opts.until).
//   opts: { until: the running over (a promise) }
//   → { cry: how loud she is at the end, 0…1 }
import { until } from '../hands.js';

const BPM = 24;

export default {
  title: 'Успокоить', // (as the author's ☰ lists it)
  about: 22,
  skipped: { cry: 0.2 },
  async run(g, b, { until: running } = {}, signal) {
    let over = false;
    running?.then(() => { over = true; });
    const edge = g.told('beat:edge');
    const mg = g.minigame({ phrase: 'Петра кричала, и крик её слышали только мы' });
    const sign = mg.mark({ at: 'petra', kind: 'light' });
    edge.then(ok => { if (ok) sign.set({ at: 'david' }); });
    const rh = mg.rhythm({ on: null, show: [sign], bpm: BPM, breath: true });
    b.minigame.tricks.teach(mg, [rh], { id: 'breath' });
    let cry = 1, told = 1;
    const done = await until(mg, ({ dt }) => {
      const s = rh.state, inTime = (s.breath === 'in') === !!s.held;
      cry = Math.max(0, Math.min(1, cry + dt * (inTime ? -0.07 : 0.05)));
      if (Math.abs(cry - told) > 0.02) { told = cry; g.set('cry', cry, 0.3); }
      mg.plate.set({ fill: 1 - cry, glow: inTime ? 'good' : 'bad' });
      return over;
    });
    if (!done) return this.skipped;
    await mg.end({ as: cry <= 0.3 ? 'clean' : 'flawed' });
    return { cry };
  },
};
