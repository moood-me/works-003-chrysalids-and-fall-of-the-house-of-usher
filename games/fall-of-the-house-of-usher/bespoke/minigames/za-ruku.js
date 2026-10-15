// «За руку» (II, «Подъезд к дому», a grey day, in the beat `walk`): the narrator leads Roderick out along the causeway
// by the hand.
//   1. what he does — leads him out by the hand, against his resisting; 2. wants — to get him out of the house into the
//   air; 3. patience, pity, firmness; 4. the player — drawing someone reluctant along, step by step.
// The language's pull with resistance: a dashed mark on Roderick's hand in the narrator's (roderick#hand_l), its way to
// the point a little before them on the causeway (lead@: the scene keeps it there as they go); heavy — it comes only while
// the finger draws it on, the tension seen; let go, it springs back. Drawn far enough, they take a step on (the scene's
// `walk`: they walk there at their own pace, the camera with them) and the hand is back in theirs for the next; he
// resists (the scene's `resist`: he balks) — more the farther from the house, and now and then he jerks back (the hand
// slips back along the way); let go, he draws them both back toward the house a step. Up to the middle of the
// causeway (MIDDLE), where the chapter takes over.
//   → { seconds (from the first pull to the middle), letGo (how many times the hand was let go) }
import { until, keys } from '../hands.js';

// the causeway in `walk`'s units (0 — the door, 1 — the near shore): where they are is the scene's `walk_at`
const MIDDLE = 0.5, STEP = 0.02, BACK = 0.01, NEAR = 0.0015;
const ON = 0.75; // the hand drawn this far along its way: a step on
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  title: 'За руку', // (as the author's ☰ lists it)
  about: 35,
  skipped: { seconds: 0, letGo: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Он не выходил из дома много лет и упирался на каждом шаге' });
    const send = keys(g);
    const at = () => clamp(+g.get('walk_at') || 0);
    const w0 = Math.min(at(), MIDDLE);
    const hand = mg.mark({ at: 'roderick#hand_l', kind: 'dash' });
    const pull = mg.pull({ on: hand, to: 'lead@', heavy: true, release: 'spring' });
    b.minigame.tricks.teach(mg, [pull], { id: 'pull-heavy' });
    let aim = w0, resist = g.get('resist') ?? 0.3, letGo = 0, started = null, jerk = 0, nextJerk = 0, wasHeld = false;
    // where they go: the scene walks them there (only a change is sent)
    const go = w => {
      w = clamp(w, 0.05, MIDDLE);
      if (Math.abs(w - aim) < NEAR) return;
      aim = w;
      g.set('walk', aim);
    };
    const done = await until(mg, ({ t, dt }) => {
      const s = pull.state, w = at();
      if (s.held && started == null) { started = t; nextJerk = t + 2.5; }
      if (wasHeld && !s.held && started != null) letGo++;
      wasHeld = s.held;
      // his will: more the farther from the house; now and then a jerk back, then it eases
      if (started != null && t > nextJerk) {
        jerk = 0.55 + 0.25 * Math.random();
        nextJerk = t + 2.8 + 2 * Math.random();
        if (s.held) pull.set({ u: Math.max(0, s.u - 0.35) });
      }
      jerk *= Math.exp(-dt / 0.6);
      resist += (clamp(0.2 + (0.35 * (w - w0)) / (MIDDLE - w0 || 1) + jerk) - resist) * (1 - Math.exp(-dt / 0.2));
      send('resist', resist);
      if (started != null) {
        // drawn on far enough: a step on, the hand back in theirs; let go: he draws them back a step, and another once
        // they have stepped it
        if (s.held && s.u >= ON) { go(Math.max(aim, w) + STEP); pull.set({ u: 0 }); mg.sound('tap'); }
        else if (!s.held && aim >= w - NEAR) go(w - BACK);
      }
      mg.plate.set({ fill: clamp((w - w0) / (MIDDLE - w0 || 1)), glow: s.held ? (s.u > 0.2 ? 'good' : 'idle') : 'bad' });
      return w >= MIDDLE - 2 * NEAR;
    });
    if (!done) return this.skipped;
    await mg.end({ as: letGo ? 'flawed' : 'clean' });
    return { seconds: Math.round(mg.t - (started ?? mg.t)), letGo };
  },
};
