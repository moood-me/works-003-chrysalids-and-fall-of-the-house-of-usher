// «Стук» (III, the nights): alone at the shut iron door, by one candle (the scene «Склеп», beat
// `at_door`). The player knocks — a tap on the door is a knock (`knock` pulse, heard on the iron);
// when the knocking stops, silence — and then from the other side as many knocks back (`answer`
// pulses, muffled). The player may knock again; it answers again. Leaving is the player's: after
// the first answer, «Уйти»; or nothing more for a long while.
//   → { knocks: how many times the player knocked, answered: true }
import { knock as heard } from '../sound.js';

const PULSE = 1.5; // s: a knock's tremor running down (the scene's dust falls along it)
const WAIT = 3200; // ms of silence after the last knock before the answer
const APART = 750; // ms between the answer's knocks
const IDLE = 14000; // ms after an answer with no knock: the player has stood long enough

let styled = null;

export default {
  title: 'Стук', // (as the author's ☰ lists it)
  skipped: { knocks: 0, answered: true },
  async run(g, b, opts, signal) {
    styled ||= b.css('minigames/stuk.css');
    await styled;
    if (signal.aborted) return this.skipped;
    let knocks = 0, owed = 0, timers = [], finish;
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const quiet = () => { timers.forEach(clearTimeout); timers = []; };
    const pulse = key => { b.set(key, 1); b.set(key, 0, PULSE); };

    const box = document.createElement('div');
    box.className = 'mg-stuk';
    box.innerHTML = '<p>Постучи.</p><button type="button">Уйти</button>';
    b.layer.append(box);
    const hint = box.querySelector('p'), leave = box.querySelector('button');

    // the answer: as many knocks as were knocked (three at most), each a while apart; then the
    // player may go, or stand there until IDLE has passed
    const answer = () => {
      const n = Math.min(3, owed);
      owed = 0;
      for (let i = 0; i < n; i++) later(() => { pulse('answer'); heard('there', 1); }, i * APART);
      later(() => {
        leave.classList.add('on');
        later(finish, IDLE);
      }, n * APART);
    };
    // a knock cuts short whatever was coming: the answer waits for the knocking to stop
    const tap = e => {
      if (e.button > 0 || e.target === leave) return;
      e.preventDefault();
      knocks++; owed++;
      pulse('knock');
      heard('here', 1);
      hint.classList.add('gone');
      quiet();
      later(answer, WAIT);
    };
    box.addEventListener('pointerdown', tap);
    leave.addEventListener('click', () => finish());

    await new Promise(ok => {
      finish = ok;
      signal.addEventListener('abort', ok);
    });
    quiet();
    box.remove();
    return signal.aborted ? this.skipped : { knocks, answered: true };
  },
};
