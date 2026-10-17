// “Tuning” (III.3, “Learning to hear”, twice): David looks over the valley for the one who calls him without words.
//   1. what he does — searches the valley for the one who calls; 2. wants — to know his own; 3. joy of finding, fear of
//   the grown-ups noticing; 4. the player — searching closely and keeping still when watched.
// The language's seek: a spot over the valley, its places the heads of its people (washer, shepherd, cart, far_girl);
// who calls is said by a thought before (Anne — at the washing line, Michael — the sheep), the sign seen in the scene.
// The lens held on the right one fills. With watch: the ploughman turns (adults_near) — the danger arc on the spot: the
// lens moved while he looks — he has seen. Not found in SEARCH s — she found me by herself.
//   opts: { find: whose head, watch: the ploughman turns }
//   → { caught: found by me, seen }
import { until } from '../hands.js';

const PLACES = ['washer', 'shepherd', 'cart', 'far_girl'];
const SEARCH = 40, TURN = 9, LOOKS = 6; // s: the search; the ploughman turns after; looks so long

export default {
  title: 'Tuning', // (as the author's map lists it)
  about: 20,
  skipped: { caught: true, seen: false },
  async run(g, b, { find = 'washer', watch = false } = {}, signal) {
    const mg = g.minigame({ phrase: tr('Someone in the valley was calling me — without words') });
    const t0 = mg.t, target = PLACES.indexOf(find);
    const spot = mg.mark({ at: 'cart', kind: 'spot', ...(watch ? { danger: 0 } : {}) });
    const seek = mg.seek({ on: spot, places: PLACES, radius: Math.round(0.42 * b.frame().h), hold: 1.4 }); // (the search's reach: by the frame's height)
    b.minigame.tricks.teach(mg, [seek], { id: 'seek' });
    let turned = false, back = false, danger = 0, seen = false, last = null;
    const done = await until(mg, ({ t, dt }) => {
      const s = seek.state;
      if (watch && !turned && t - t0 >= TURN) {
        turned = true;
        g.set('adults_near', 1, 1.5);
        mg.plate.set({ phrase: tr('The ploughman was looking our way') });
      }
      if (turned && !back && t - t0 >= TURN + LOOKS) { back = true; g.set('adults_near', 0, 3); }
      if (turned && !back && s.at && last) {
        const moved = Math.hypot(s.at.x - last.x, s.at.y - last.y);
        danger = Math.min(1, danger + (moved > 2 ? 0.9 * dt : 0));
        spot.set({ danger });
        if (danger >= 1 && !seen) { seen = true; mg.error('danger', { at: spot, chip: true }); }
      }
      last = s.at ? { ...s.at } : null;
      mg.plate.set({ fill: s.place === target ? s.fill : 0, glow: s.place === target && s.fill > 0 ? 'good' : 'idle' });
      return (s.place === target && s.fill >= 1) || t - t0 >= SEARCH;
    });
    if (!done) return this.skipped;
    if (turned && !back) g.set('adults_near', 0, 3);
    const caught = seek.state.place === target && seek.state.fill >= 1;
    if (caught) mg.snap({ at: spot });
    await mg.end({ as: caught ? (seen ? 'flawed' : 'clean') : 'neutral' });
    return { caught, seen };
  },
};
