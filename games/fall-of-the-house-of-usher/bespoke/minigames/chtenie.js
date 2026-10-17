// «Чтение» (IV; «Буря и чтение», after the beat `read`): the narrator reads «Безумный Тристан» aloud to Roderick.
//   1. what he does — reads aloud, line by line, to calm him; 2. wants — to drown the house's sounds in the old story;
//   3. the dread growing with each passage; 4. the player — reading on, and the choice to read louder or to stop and
//   listen.
// The language's press on the book (book@: in the narrator's hands): each touch the next line, said in his voice (the
// reading is the action itself — its lines are said inside it). After each passage the house answers from below, as the
// book says — the scene's `sound` 1…3 (the candle shudders, dust falls, the crack breathes, Roderick flinches and rocks
// harder) and its sound (wood splintering; a shriek; a brazen clang), the scene's turn meanwhile. Between passages the
// book's petals: «Читать громче» — read on, louder, over it (he rocks harder: `rock`); «Слушать» — the book lowered, he
// listens (`listen`): the house, and under it something faint. Neutral: the plate's ways show each choice.
//   → { louder: how many times read on louder, listened: how many times stopped to listen }
import { splinter, shriek, clang, scratch } from '../sound.js';
import { until, once } from '../hands.js';

const PASSAGES = [
  [
    'И Этельред, муж отважного сердца, подъял палицу и ударил в доски двери отшельника,',
    'и треск сухого, раздираемого дерева гулко разнёсся по всему лесу.',
  ],
  [
    'Но нашёл он там не отшельника, а дракона огнеязыкого, и поразил его;',
    'и дракон пал, испустив вопль столь страшный, что Этельред зажал уши руками.',
  ],
  [
    'И пошёл Этельред по серебряному полу к медному щиту, но щит не дождался его —',
    'он пал к ногам его на серебряный пол с великим и страшным звоном.',
  ],
];
const ANSWERS = [splinter, shriek, clang];
const LISTEN = 5; // s of silence, listening
const LINES = PASSAGES.flat().length;

export default {
  title: 'Чтение', // (as the author's map lists it)
  about: 70,
  skipped: { louder: 0, listened: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Я читал ему вслух старый роман о рыцаре Этельреде' });
    const book = mg.mark({ at: 'book@', kind: 'ring' });
    // (seconds by the mini-game's clock: it stands with the play's pause)
    const after = s => { const t1 = mg.t + s; return until(mg, () => mg.t >= t1); };
    let louder = 0, listened = 0, read = 0;
    const ways = [];
    for (let i = 0; i < PASSAGES.length; i++) {
      for (const line of PASSAGES[i]) {
        const press = mg.press({ on: book });
        if (!read) b.minigame.tricks.teach(mg, [press], { id: 'press' });
        if (!(await once(mg, press, 'press'))) return this.skipped;
        press.remove();
        mg.sceneTurn(true);
        await g.say('narrator', line);
        if (signal.aborted) return this.skipped;
        mg.sceneTurn(false);
        mg.plate.set({ fill: ++read / LINES, ways });
      }
      // the answer from below
      mg.sceneTurn(true);
      g.set('sound', i + 1);
      if (!(await after(ANSWERS[i]() * 0.7))) return this.skipped;
      mg.sceneTurn(false);
      if (i === PASSAGES.length - 1) break;
      const choice = mg.press({ on: book, petals: [{ id: 'louder', label: 'Читать громче' }, { id: 'listen', label: 'Слушать' }] });
      const how = await once(mg, choice, 'choose');
      if (!how) return this.skipped;
      choice.remove();
      ways.push({ from: (i + 0.5) / PASSAGES.length, to: (i + 1) / PASSAGES.length, as: how.id === 'louder' ? 'theirs' : 'own' });
      mg.plate.set({ ways });
      if (how.id === 'louder') {
        louder++;
        g.set('rock', Math.min(1, (+g.get('rock') || 0) + 0.2), 1.5); // he rocks with the louder voice
      } else {
        listened++;
        mg.sceneTurn(true);
        g.set('listen', 1, 1.2);
        const far = scratch();
        far.loud(0.25, 2);
        const ok = await after(LISTEN);
        far.stop(1.5);
        g.set('listen', 0, 1.2);
        if (!ok) return this.skipped;
        mg.sceneTurn(false);
      }
    }
    g.set('sound', 0);
    g.set('listen', 0, 0.8);
    await mg.end({ as: 'neutral' });
    return { louder, listened };
  },
};
