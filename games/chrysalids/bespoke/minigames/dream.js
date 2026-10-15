// «Удержать сон» (IV.4, «Сон о городе»): in his dream David follows a shining fish over the city with his eyes.
//   1. what he does — follows the fish with his eyes; 2. wants — to see the city and not wake; 3. quiet, careful; 4. the
//   player — following smoothly, no jerks.
// The language's lead after a moving thing, smoothly: the zone — the fish's place on its way (the scene's `lead` 0…1,
// moved by the game over TIME s; the zone at 2·lead − 1), the arrow — David's eyes (the scene's `gaze`: his head and a
// soft light on the sky); without the finger his eyes stay. A jerk breaks the dream a little (an error «сорвал», the
// scene's waking); broken through — he wakes.
//   → { held: the share of the time near it, broke }
import { until, keys } from '../hands.js';

const TIME = 40, WIDTH = 0.35, JERK = 2.2;

export default {
  title: 'Удержать сон', // (as the author's ☰ lists it)
  about: 40,
  skipped: { held: 1, broke: false },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Над городом плыла рыба, и сон держался едва-едва' });
    const send = keys(g), t0 = mg.t;
    const eyes = mg.lead({ zone: { at: -1, width: WIDTH }, steer: 'follow', release: 'stay' });
    mg.glow('craft');
    b.minigame.tricks.teach(mg, [eyes], { id: 'lead' });
    let near = 0, waking = 0, jerked = -1;
    const done = await until(mg, ({ t, dt }) => {
      const u = Math.min(1, (t - t0) / TIME), at = 2 * u - 1, s = eyes.state;
      g.set('lead', u);
      eyes.set({ zone: { at, width: WIDTH } });
      send('gaze', s.arrow);
      if (s.in) near += dt;
      if (s.jerk > JERK && t - jerked > 1) {
        jerked = t;
        waking = Math.min(1, waking + 0.25);
        g.set('waking', waking, 0.6);
        mg.error('jerk', { chip: true });
      }
      mg.plate.set({ fill: u, glow: s.in ? 'good' : 'bad' });
      return u >= 1 || waking >= 1;
    });
    if (!done) return this.skipped;
    const held = Math.min(1, near / TIME), broke = waking >= 1;
    await mg.end({ as: broke ? 'loss' : held >= 0.5 ? 'clean' : 'flawed' });
    return { held, broke };
  },
};
