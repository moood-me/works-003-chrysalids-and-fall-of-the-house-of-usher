// «Тише, кони» (V.4, «Бегство», the beat `watch`): in the fog of the hollow David keeps the horses still while the riders
// on the crest shine their lanterns into it.
//   1. what he does — a hand on the neck of the one that frets, and not a move; 2. wants — the riders to go by; 3. hidden
//   fear; 4. the player — the hand on the restless one, keeping still.
// The language's hold on several marks at once (great#head, pack#head, sheba#head if she was taken, petra if she cannot
// keep still), each its own danger arc; one finger — one horse held, the others fret meanwhile; held still the arc ebbs,
// a moved finger frightens it. The scene: their heads toss (great_toss…), Petra peeks (petra_peek); the lantern goes to
// the most restless (lamp_x, lamp), the rider points (search_point). TIME s.
//   opts: { start: how wary the riders are already, sheba: she is with us, petra: Petra cannot keep still, horse: the
//     riders' hooves (the game's sound) }
//   → { seen }
import { until, keys } from '../hands.js';

const TIME = 30, MOVED = 16;

export default {
  title: 'Тише, кони', // (as the author's ☰ lists it)
  about: 30,
  skipped: { seen: false },
  async run(g, b, { start = 0.25, sheba = false, petra = false, horse } = {}, signal) {
    const mg = g.minigame({ phrase: 'Фонари светили в туман, а кони не стояли смирно' });
    const send = keys(g), t0 = mg.t;
    const who = [
      { at: 'great#head', key: 'great_toss', across: 'great_a', rate: 0.035 },
      { at: 'pack#head', key: 'pack_toss', across: 'pack_a', rate: 0.03 },
      ...(sheba ? [{ at: 'sheba#head', key: 'sheba_toss', across: 'sheba_a', rate: 0.055 }] : []),
      ...(petra ? [{ at: 'petra', key: 'petra_peek', across: 'great_a', rate: 0.045 }] : []),
    ];
    for (const w of who) {
      w.danger = 0.1;
      w.mark = mg.mark({ at: w.at, kind: 'groove', danger: w.danger });
      w.hold = mg.hold({ on: w.mark, seconds: 1.5, drain: 0.6 });
    }
    b.minigame.tricks.teach(mg, [who[0].hold], { id: 'hold' });
    const wary = 1 + start;
    let seen = false;
    const done = await until(mg, ({ t, dt }) => {
      let most = who[0];
      for (const w of who) {
        const s = w.hold.state, moved = s.held && s.moved > MOVED;
        w.danger = Math.max(0, Math.min(1, w.danger + dt * (moved ? 0.4 : s.held ? -0.3 : w.rate * wary)));
        w.mark.set({ danger: w.danger });
        send(w.key, w.danger * w.danger);
        if (w.danger > most.danger) most = w;
        if (w.danger >= 1) seen = true;
      }
      send('lamp_x', Math.max(2, Math.min(12, g.get(most.across) ?? 6)));
      send('lamp', 0.6 + 0.4 * most.danger);
      send('search_point', most.danger > 0.75 ? 1 : 0);
      horse?.loud(0.04 + 0.25 * most.danger, 0.5);
      mg.plate.set({ fill: Math.min(1, (t - t0) / TIME), glow: most.danger > 0.6 ? 'bad' : 'good' });
      return seen || t - t0 >= TIME;
    });
    if (!done) return this.skipped;
    send('search_point', seen ? 1 : 0);
    if (seen) mg.error('danger', { at: who.reduce((a, w) => (w.danger > a.danger ? w : a)).mark });
    await mg.end({ as: seen ? 'loss' : 'clean' });
    return { seen };
  },
};
