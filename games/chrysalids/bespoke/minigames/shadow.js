// «По тени» (V.5, «Край Окраин»): the fugitives cross the last field to the wood under the father's lantern.
//   1. what they do — go across the field to the trees; 2. want — to get there without coming into his light; 3.
//   forbidden freedom, fear, the father; 4. the player — going and freezing.
// The language's hold anywhere = going: held, they walk the path (the scene's `walkers`, its walk_u grows); let go, they
// stand. The danger — the arc on the mark at David (a hold anywhere shows its fill and arc on the thing's mark): it grows
// in the beam out of the shadows (walking — fast, standing — slowly), not in the shadows. The shadows and the beam are
// the scene's (walk_shade, walk_lit). Seen — the father shouts, they run for the trees.
//   opts: { hard: the lantern finds us sooner (the rider let live), onSeen(where: 'field' | 'fence') }
//   → { seen }
import { until, keys } from '../hands.js';

export default {
  title: 'По тени', // (as the author's ☰ lists it)
  about: 45,
  skipped: { seen: false },
  async run(g, b, { hard = false, onSeen } = {}, signal) {
    const mg = g.minigame({ phrase: 'Свет фонаря ходил по полю от изгороди к лесу' });
    const send = keys(g), k = hard ? 1.3 : 1;
    const me = mg.mark({ at: 'david', kind: 'ring', danger: 0 });
    const go = mg.hold({ on: null, show: me, seconds: 1, drain: 0 });
    b.minigame.tricks.teach(mg, [go], { id: 'hold-anywhere' });
    let danger = 0, seen = false, ran = false;
    const done = await until(mg, ({ dt }) => {
      const s = go.state, u = g.get('walk_u') ?? 0, lit = g.get('walk_lit') ?? 0, shade = g.get('walk_shade') ?? 0;
      send('walkers', seen || s.held ? 1 : 0);
      if (!seen) {
        const open = shade < 0.5 ? lit : 0;
        danger = Math.max(0, Math.min(1, danger + dt * k * (open > 0.2 ? (s.held ? 0.9 : 0.25) * open : -0.05)));
        me.set({ danger });
        if (danger >= 1) {
          seen = true;
          mg.error('danger', { at: me });
          onSeen?.(u > 0.8 ? 'fence' : 'field');
        }
      } else if (!ran) { ran = true; mg.plate.set({ glow: 'bad' }); }
      mg.plate.set({ fill: u, glow: seen || inBeam(lit, shade) ? 'bad' : 'good' });
      return u >= 0.98;
    });
    if (!done) return this.skipped;
    await mg.end({ as: seen ? 'flawed' : 'clean' });
    return { seen };
  },
};
const inBeam = (lit, shade) => shade < 0.5 && lit > 0.2;
