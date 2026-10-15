// «Винты» (III, «Склеп», after the beat `screws`: the lid close, the driver in the narrator's hand on the first screw):
// the lid is on, and he drives its four screws home.
//   1. what he does — turns the screwdriver, screw after screw, closing her in; 2. wants — to do what Roderick asks —
//   or to leave one loose, in case; 3. dread, the weight of it, her words in his head; 4. the player — tightening by
//   degrees, and the choice to stop short.
// The language's turn, one mark at a time on the screw the driver is on (closeup#screw1…4: the insert's points): three
// turns the arrow's way drive it home (the scene's screwN; screw_at — where the driver is); against the arrow it does
// not go; each quarter its squeak into the wood (the game's sound). Beside it, a quiet mark (closeup#leave) with its one
// word, «Оставить так»: the screw left as it is, the driver on to the next. Neutral: a screw left loose is a choice, not a fault. Promised (opts.promised), her line comes back once
// while a screw is turning: «Не дай им меня закрыть.» (in his head, her voice).
//   opts: { promised: she was promised (I, «Обещаю») }
//   → { loose: the screws (1…4) left under SEAT, seconds: how long it took }
import { until, once, keys } from '../hands.js';

const SEAT = 0.8, TURNS = 3;
const HERS = 'Не дай им меня закрыть.';

export default {
  title: 'Винты', // (as the author's ☰ lists it)
  about: 40,
  skipped: { loose: [], seconds: 0 },
  async run(g, b, { promised = false } = {}, signal) {
    const mg = g.minigame({ phrase: 'Крышку держали четыре винта, и каждый надо было довернуть до конца' });
    const send = keys(g), t0 = mg.t;
    mg.plate.set({ notches: [1 / 4, 2 / 4, 3 / 4] });
    const v = [0, 1, 2, 3, 4].map(i => (i ? g.get(`screw${i}`) ?? 0 : 0));
    let said = !promised;
    for (let i = 1; i <= 4; i++) {
      if (v[i] >= 1) continue;
      g.set('screw_at', i, 0.5);
      const mark = mg.mark({ at: `closeup#screw${i}`, kind: 'dash' });
      const turn = mg.turn({ on: mark, dir: 1 });
      if (i === 1) b.minigame.tricks.teach(mg, [turn], { id: 'turn' });
      // (the screw's own squeak into the wood at each quarter, higher as it tightens)
      turn.on('quarter', () => g.sound.screw(v[i]));
      const quiet = mg.mark({ at: 'closeup#leave', kind: 'ring', quiet: true });
      const leave = mg.press({ on: quiet, petals: [{ id: 'leave', label: 'Оставить так' }] });
      const from = v[i];
      let left = false;
      once(mg, leave, 'choose').then(x => { if (x) left = true; });
      const ok = await until(mg, () => {
        v[i] = Math.min(1, from + Math.max(0, turn.state.most) / TURNS);
        send(`screw${i}`, v[i]);
        if (!said && turn.state.most > 1.3) { said = true; g.think('madeline', HERS); }
        mg.plate.set({ fill: (i - 1 + v[i]) / 4 });
        return v[i] >= 1 || left;
      });
      if (!ok) return this.skipped;
      if (v[i] >= 1) mg.snap({ at: mark });
      mark.remove();
      quiet.remove();
    }
    g.set('screw_at', 4);
    const loose = [1, 2, 3, 4].filter(i => v[i] < SEAT);
    await mg.end({ as: loose.length ? 'neutral' : 'clean' });
    return { loose, seconds: Math.round(mg.t - t0) };
  },
};
