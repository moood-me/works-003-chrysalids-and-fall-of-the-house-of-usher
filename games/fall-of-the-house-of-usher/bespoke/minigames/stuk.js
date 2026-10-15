// «Стук» (III, the nights; «Склеп», after the beat `at_door`): alone at the shut iron door, by one candle.
//   1. what he does — knocks on the door of the vault, and listens; 2. wants — to know whether she is alive; 3. horror,
//   and the hope he dares not have; 4. the player — knocking, and waiting in the silence for an answer.
// The language's press on the door (outside#door, the insert's point): each touch a knock — the scene's `knock` pulse
// (the door trembles, dust falls) and the knock heard on the iron. When the knocking stops, silence — the scene's turn,
// the marks hidden — and then from the other side as many knocks back (`answer`, muffled). The player may knock again; it
// answers again. After the first answer, a quiet mark on the way up (outside#away) with its word, «Уйти»; or nothing more
// for a long while — he has stood there long enough.
//   → { knocks: how many times the player knocked, answered: true }
import { knock as heard } from '../sound.js';
import { until, once } from '../hands.js';

const PULSE = 1.5; // s: a knock's tremor running down
const WAIT = 3.2; // s of silence after the last knock before the answer
const APART = 0.75; // s between the answer's knocks
const IDLE = 14; // s after an answer with no knock: he has stood long enough

export default {
  title: 'Стук', // (as the author's ☰ lists it)
  about: 25,
  skipped: { knocks: 1, answered: true },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Железная дверь была заперта, и за ней было тихо' });
    const door = mg.mark({ at: 'outside#door', kind: 'ring' });
    const press = mg.press({ on: door });
    b.minigame.tricks.teach(mg, [press], { id: 'press' });
    const pulse = key => { g.set(key, 1); g.set(key, 0, PULSE); };
    // (seconds by the mini-game's clock: it stands with the play's pause)
    const after = s => { const t1 = mg.t + s; return until(mg, () => mg.t >= t1); };
    let knocks = 0, owed = 0, last = null, answered = null, leave = null, gone = false;
    press.on('press', () => {
      knocks++; owed++;
      last = mg.t;
      pulse('knock');
      heard('here', 1);
    });
    // the answer, once the knocking has stopped: as many knocks as were knocked (three at most), a while apart
    const answer = async () => {
      mg.sceneTurn(true);
      const n = Math.min(3, owed);
      owed = 0;
      for (let i = 0; i < n; i++) {
        pulse('answer');
        heard('there', 1);
        if (!(await after(APART))) return;
      }
      mg.sceneTurn(false);
      answered = mg.t;
      mg.plate.set({ fill: 1, phrase: 'Оттуда, из-за двери, ответили' });
      if (!leave) {
        const away = mg.mark({ at: 'outside#away', kind: 'ring', quiet: true });
        leave = mg.press({ on: away, petals: [{ id: 'go', label: 'Уйти' }] });
        once(mg, leave, 'choose').then(x => { if (x) gone = true; });
      }
    };
    let answering = null;
    const done = await until(mg, () => {
      if (!answering && owed && mg.t - last >= WAIT) answering = answer().then(() => { answering = null; });
      if (!answered) mg.plate.set({ fill: knocks ? 0.5 : 0 });
      return gone || (answered != null && !answering && mg.t - Math.max(answered, last ?? 0) >= IDLE);
    });
    if (!done) return this.skipped;
    await mg.end({ as: 'neutral' });
    return { knocks, answered: true };
  },
};
