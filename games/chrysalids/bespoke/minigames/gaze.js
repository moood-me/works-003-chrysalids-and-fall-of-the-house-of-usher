// «Найди раньше него» (II.3, «Инспектор на ферме»): from behind the barn David looks the calf over before the inspector
// does.
//   1. what he does — looks the calf over; 2. wants — to see what is wrong with it before the inspector; 3. fear for the
//   calf, shame; 4. the player — searching hard under someone else's eyes.
// The language's seek over the calf: places — its head, back, tail, legs (calf#…); what is «not right» — the legs, seen
// by the eye (they are too long). The time — the arc on the spot: the inspector's look going over the yard to the calf,
// in his order (his key inspector_look set to each thing in turn); when it comes to the calf's legs he has seen it.
//   → { found, left: seconds he still had to go }
import { until } from '../hands.js';

const LOOK = ['inspector#hand_l', 'barn#corner', 'fence#pen', 'horse', 'calf#head', 'calf#back', 'calf#tail', 'calf#legs'];
const STEP = 4; // s: his look on each thing
const PLACES = ['calf#head', 'calf#back', 'calf#tail', 'calf#legs'], LEGS = 3;

export default {
  title: 'Найди раньше него', // (as the author's ☰ lists it)
  about: 25,
  skipped: { found: true, left: 8 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Инспектор не спеша обходил двор и вот-вот должен был дойти до телёнка' });
    const t0 = mg.t, all = STEP * (LOOK.length - 1);
    const spot = mg.mark({ at: 'calf', kind: 'spot', time: 1 });
    const seek = mg.seek({ on: spot, places: PLACES, hold: 1.0 });
    b.minigame.tricks.teach(mg, [seek], { id: 'seek' });
    let step = -1, found = false, snapped = new Set();
    const done = await until(mg, ({ t }) => {
      const k = Math.min(LOOK.length - 1, Math.floor((t - t0) / STEP));
      if (k !== step) { step = k; g.set('inspector_look', LOOK[k]); }
      spot.set({ time: Math.max(0, 1 - (t - t0) / all) });
      const s = seek.state;
      // (a part held long enough is seen: the legs — what is wrong; another — as it should be, a quiet snap)
      if (s.fill >= 1 && !snapped.has(s.place)) {
        snapped.add(s.place);
        if (s.place === LEGS) found = true;
        else mg.sound('found');
      }
      mg.plate.set({ fill: s.place === LEGS ? s.fill : 0, glow: s.fill > 0 ? 'good' : 'idle' }); // (the bar: what is wrong, seen)
      return found || (t - t0) >= all;
    });
    if (!done) return this.skipped;
    if (!found) {
      await mg.end({ as: 'loss' });
      return { found: false, left: 0 };
    }
    const left = Math.max(0, Math.round(all - (mg.t - t0)));
    mg.snap({ at: spot });
    await mg.end({ as: 'clean' });
    return { found: true, left };
  },
};
