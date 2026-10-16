// «Listen» (III, the nights; «The storm and the reading», after the beat `night`): alone, the candle, quiet rain; the house's own
// sounds — and one from below.
//   1. what he does — listens for where the sound comes up through the floor; 2. wants — to know what it is; 3. dread,
//   sleeplessness, the house breathing; 4. the player — searching, ear to the stone, and staying where it is clearest.
// The language's seek: a spot over the room's floor (floor#mid), the place the sound comes up through (ripple@ — the
// scene's ripple plane); the nearer the lens, the clearer it is (the game's sound: a faint scratching, and — the lower
// his sanity, opts.clarity — her song hummed through the stone), the scene's `ripple` rings on the floor there and the
// narrator turns to it (`listen`); held there long enough — found.
//   opts: { clarity: 0…1 (lower sanity, clearer): from 0.5 her song, under it the scratching }
//   → { heard: 'scratch' | 'melody', seconds: how long it took }
import { house, rain, scratch, melody } from '../sound.js';
import { until, keys } from '../hands.js';

const HOLD = 2.5; // s of listening at the place
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

export default {
  title: tr('Listen'), // (as the author's ☰ lists it)
  about: 30,
  // (skipped: what a clean play gives — her song if he hears it clearly enough)
  skipped: ({ clarity = 0.3 } = {}) => ({ heard: clarity >= 0.5 ? 'melody' : 'scratch', seconds: 0 }),
  async run(g, b, { clarity = 0.3 } = {}, signal) {
    const c = clamp(clarity), song = c >= 0.5;
    const mg = g.minigame({ phrase: tr('From below, through the stone, there came some sound') });
    const send = keys(g), t0 = mg.t;
    house(0.75, 3);
    rain(0.4, 3);
    const scraping = scratch();
    // her song, over and over, as long as it is listened for
    let hum = null, over = false;
    const sing = () => {
      if (signal.aborted || over) return;
      hum = melody({ as: 'hum', muffled: true, tempo: 0.85, loud: 0.9 });
      hum.loud(0, 0);
      hum.done.then(sing);
    };
    if (song) sing();
    const spot = mg.mark({ at: 'floor#mid', kind: 'spot' });
    const seek = mg.seek({ on: spot, places: ['ripple@'], radius: Math.round(0.45 * b.frame().h), near: 60, hold: HOLD });
    b.minigame.tricks.teach(mg, [seek], { id: 'seek' });
    const done = await until(mg, () => {
      const s = seek.state, k = s.at ? s.warm * s.warm : 0;
      // the sound from below: the nearer, the louder; what it is — the clarity
      scraping.loud(k * (song ? 0.45 : 0.25 + 0.5 * c), 0.15);
      hum?.loud(k * (0.35 + 0.65 * c), 0.15);
      send('ripple', k * (0.35 + 0.65 * c));
      send('listen', k);
      mg.plate.set({ fill: s.fill, glow: s.fill > 0 ? 'good' : 'idle' });
      return s.fill >= 1;
    });
    over = true;
    const fade = done ? 2.5 : 0.4;
    scraping.stop(fade);
    hum?.stop(fade);
    g.set('ripple', 0, fade);
    g.set('listen', 0, fade);
    if (!done) return this.skipped({ clarity });
    mg.snap({ at: spot });
    await mg.end({ as: 'clean' });
    return { heard: song ? 'melody' : 'scratch', seconds: Math.round(mg.t - t0) };
  },
};
