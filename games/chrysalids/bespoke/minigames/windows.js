// “Join the windows” (III.5 and IV.3, “Voices”): on the hill at night David calls his own one by one.
//   1. what he does — calls the others, one after another; 2. wants — to join everyone; 3. not alone — and afraid how
//   far it is heard; 4. the player — reaching out to each light.
// The language's pull to a target, one mark at a time: a dashed mark on David (david#head), its way to the next window
// (farmN#window); reached, the window is linked (the scene's count; the voices grow). Petra's window (home#window) takes
// a thread that passes near it as she stirs: a hidden mark there, its place (h.pos) against where the thread is — caught
// once, a flash in every head.
//   opts: { targets: the windows in the order called (farm1…), petra: how awake her window is to begin with, voices,
//     onLink(n) — said as the n-th is linked (the next waits for it), onPetra() — said as her signal is caught }
//   → { links, caught }
import { until } from '../hands.js';

const NEAR = 70; // px: a thread this near her window is taken

export default {
  title: 'Join the windows', // (as the author's map lists it)
  about: 40,
  skipped: { links: 7, caught: false },
  async run(g, b, { targets = [], petra = 0, voices = 0.4, onLink, onPetra } = {}, signal) {
    const mg = g.minigame({ phrase: petra > 0 ? tr('The farm lights burned far off again, and Petra was listening') : tr('At night the farm lights burned far apart') });
    const home = mg.mark({ at: 'home#window', hidden: true });
    let links = 0, caught = false, stir = petra, settle = null;
    for (const id of targets) {
      const me = mg.mark({ at: 'david#head', kind: 'dash' });
      const goal = mg.mark({ at: `${id}#window`, hidden: true });
      const pull = mg.pull({ on: me, to: `${id}#window`, release: 'spring' });
      if (!links) b.minigame.tricks.teach(mg, [pull], { id: 'pull' });
      const done = await until(mg, () => {
        const s = pull.state, u = s.shown ?? s.u;
        if (settle != null && mg.t >= settle) { settle = null; g.set('petra', stir, 2.5); }
        // (the thread's end along its way; near her window as she stirs, it is hers)
        if (!caught && s.held && me.pos && goal.pos && home.pos && stir > 0.3) {
          const x = me.pos.x + (goal.pos.x - me.pos.x) * u, y = me.pos.y + (goal.pos.y - me.pos.y) * u;
          if (Math.hypot(x - home.pos.x, y - home.pos.y) < NEAR) {
            caught = true;
            g.set('petra', 1, 0.4);
            settle = mg.t + 0.9;
            mg.snap({ at: home }); // (she has caught it: not a fault — something has happened)
            onPetra?.();
          }
        }
        mg.plate.set({ fill: (links + s.u) / targets.length, glow: s.held ? 'good' : 'idle' });
        return s.u >= 0.99;
      });
      if (!done) return { ...this.skipped, links: targets.length };
      links++;
      mg.snap({ at: me });
      me.remove();
      goal.remove();
      g.set('count', links);
      g.set('voices', Math.min(0.9, voices + 0.06 * links), 2);
      stir = Math.min(0.9, stir + 0.08);
      g.set('petra', stir, 2);
      await onLink?.(links);
    }
    if (settle != null) g.set('petra', stir, 2.5);
    await mg.end({ as: 'clean' });
    return { links, caught };
  },
};
