// “Not a stir” (II.5, “The Strorms’ kitchen”, the night): David holds the table's edge while his father reads the
// Definitions.
//   1. what he does — holds the table's edge and does not stir; 2. wants — not to give away that he knows of the raid;
//   3. restraint to trembling; 4. the player — holding and not moving.
// The language's hold with danger on a groove at his hand (david#hand_r): held, he grips (david_grip); the finger moved —
// a shiver goes through him (david_stir), let go — he fidgets; either way the danger arc grows, held still it ebbs. Full —
// his father lifts his eyes from the Book (father_look) and reads on; the first time is only a warning.
//   opts: { while: the reading (a promise): it lasts as long }
//   → { stirred: how many times the father looked up, the warning not counted }
import { until, keys } from '../hands.js';

const MOVED = 14; // px the finger may stray
const RISE = 0.35, FIDGET = 0.12, EBB = 0.25; // a second: moved, let go, held still

export default {
  title: 'Not a stir', // (as the author's ☰ lists it)
  about: 25,
  skipped: { stirred: 0 },
  async run(g, b, { while: reading } = {}, signal) {
    let over = false;
    reading?.then(() => { over = true; });
    const mg = g.minigame({ phrase: tr('My father was reading the Definitions, and no one in the kitchen moved') });
    const send = keys(g);
    const hand = mg.mark({ at: 'david#hand_r', kind: 'groove', danger: 0 });
    const hold = mg.hold({ on: hand, seconds: 1.2, drain: 0 });
    b.minigame.tricks.teach(mg, [hold], { id: 'hold' });
    let danger = 0, looks = 0, lookedAt = -Infinity, away = null;
    const done = await until(mg, ({ t, dt }) => {
      const s = hold.state;
      // (the father's look on him a while, by the mini-game's clock — it stands with the pause)
      if (away != null && t >= away) { away = null; g.set('father_look', 0); }
      const moved = s.held && s.moved > MOVED;
      send('david_grip', s.held ? 1 : 0);
      send('david_stir', moved ? 1 : 0);
      danger = Math.max(0, Math.min(1, danger + dt * (moved ? RISE : !s.held ? FIDGET : -EBB)));
      hand.set({ danger });
      if (danger >= 1 && t - lookedAt > 4) {
        looks++;
        lookedAt = t;
        danger = 0.4;
        g.set('father_look', 1);
        away = t + 2.2;
        mg.error('danger', { at: hand, chip: looks > 1 });
      }
      mg.plate.set({ fill: s.held ? s.fill : 0, glow: s.held && !moved ? 'good' : 'bad' });
      return over;
    });
    if (!done) return this.skipped;
    g.set('father_look', 0);
    const stirred = Math.max(0, looks - 1);
    await mg.end({ as: stirred ? 'flawed' : 'clean' });
    return { stirred };
  },
};
