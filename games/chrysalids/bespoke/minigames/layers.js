// «Два слоя» (III.4, «Дэвид и Розалинда»): on the square David talks with Rosalind mind to mind and keeps his eyes off
// her.
//   1. what he does — talks without words, his eyes kept away; 2. wants — not to give them away before everyone; 3. drawn
//   to her, and not allowed; 4. the player — holding the gaze aside while it goes there by itself.
// The language's lead, keeping away: the arrow — David's gaze (the scene's `glance`: 0 the church, 1 on her; his head
// turns, the thread brightens the nearer), the zone — Rosalind, away. Steered by rate: without the finger the gaze drifts
// to her (the push the warmer the talk). The old woman at the well looks now and then (someone_watching). Looked: his
// eyes on her long, or under the old woman's look.
//   opts: { watched: she watches from the start, warm() → 0…1 how warm the talk is, until: the talk over (a promise) }
//   → { looked }
import { until, keys } from '../hands.js';

const LONG = 2.0, CAUGHT = 0.5; // s: on her so long — looked; under her look so long — looked

export default {
  title: 'Два слоя', // (as the author's ☰ lists it)
  about: 30,
  skipped: { looked: false },
  async run(g, b, { watched = false, warm = () => 0, until: talk } = {}, signal) {
    let over = false;
    talk?.then(() => { over = true; });
    const mg = g.minigame({ phrase: 'Она стояла через площадь, и на нас смотрели' });
    const send = keys(g);
    const gaze = mg.lead({ zone: { at: 0.8, width: 0.4 }, away: true, steer: 'rate', release: 'stay' });
    b.minigame.tricks.teach(mg, [gaze], { id: 'lead' });
    let on = 0, under = 0, looked = false, watching = watched, next = mg.t + (watched ? 3 : 6);
    const done = await until(mg, ({ t, dt }) => {
      gaze.set({ push: 0.15 + 0.5 * warm() });
      const s = gaze.state, u = (s.arrow + 1) / 2;
      send('glance', u);
      // (the old woman: her eyes on him a while, then on the men again)
      if (t >= next) { watching = !watching; next = t + (watching ? 3.5 : watched ? 4 : 7); g.set('someone_watching', watching ? 1 : 0, 0.8); }
      const there = !s.in;
      on = there ? on + dt : 0;
      under = there && watching ? under + dt : 0;
      if (!looked && (on >= LONG || under >= CAUGHT)) { looked = true; mg.error('off', { chip: true }); }
      mg.plate.set({ fill: warm(), glow: there ? 'bad' : 'good' });
      return over || looked;
    });
    if (!done) return this.skipped;
    await mg.end({ as: looked ? 'loss' : 'clean' });
    return { looked };
  },
};
