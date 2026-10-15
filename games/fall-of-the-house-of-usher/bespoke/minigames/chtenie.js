// «Чтение» (IV; «Буря и чтение», beat `read`): the narrator reads «Безумный Тристан» aloud to
// Roderick. The player reads by tapping: each tap, the next line — said in the narrator's voice
// (g.say). After each passage the house answers from below, as the book says: the scene's `sound`
// 1…3 (the candle shudders, dust falls, the crack breathes, Roderick flinches and rocks harder) and
// its sound (wood splintering; a shriek; a brazen clang). Between passages, on the book: «Читать
// громче» — read on, louder, over it (Roderick rocks harder); «Замолчать и слушать» — the narrator lowers the book and
// listens (`listen`): the house, and under it something faint.
//   → { louder: how many times read on louder, listened: how many times stopped to listen }
//   opts: {}
import { splinter, shriek, clang, scratch } from '../sound.js';

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
const LISTEN = 5; // seconds of silence, listening
let styled = null;

export default {
  title: 'Чтение', // (as the author's ☰ lists it)
  skipped: { louder: 0, listened: 0 },
  async run(g, b, opts, signal) {
    styled ||= b.css('minigames/chtenie.css');
    await styled;
    if (signal.aborted) return this.skipped;
    const page = document.createElement('div'),
      word = document.createElement('p');
    page.className = 'mg-chtenie';
    word.textContent = 'Читай';
    page.append(word);
    let louder = 0,
      listened = 0,
      tapped = null;
    // the next tap (a press anywhere, or a key)
    const tap = () =>
      new Promise(ok => {
        tapped = ok;
        page.classList.add('on');
      });
    const press = e => {
      if (!tapped || (e.type === 'keydown' && (e.repeat || (e.key !== ' ' && e.key !== 'Enter')))) return;
      e.preventDefault();
      const ok = tapped;
      tapped = null;
      page.classList.remove('on');
      ok();
    };
    page.addEventListener('pointerdown', press);
    addEventListener('keydown', press);
    const aborted = new Promise(ok => signal.addEventListener('abort', ok));
    const until = p => Promise.race([p, aborted]);
    b.layer.append(page);

    for (let i = 0; i < PASSAGES.length && !signal.aborted; i++) {
      for (const [j, line] of PASSAGES[i].entries()) {
        await until(tap());
        if (signal.aborted) break;
        if (i === 0 && j === 0) word.classList.add('gone');
        await until(g.say('narrator', line));
      }
      if (signal.aborted) break;
      // the answer from below
      b.set('sound', i + 1);
      await until(g.wait(ANSWERS[i]() * 700));
      if (i === PASSAGES.length - 1 || signal.aborted) break;
      page.remove();
      const how = await until(
        g.choose(null, 'book', [
          { id: 'louder', label: 'Читать громче' },
          { id: 'listen', label: 'Замолчать и слушать' },
        ]),
      );
      if (signal.aborted) break;
      b.layer.append(page);
      if (how === 'louder') {
        louder++;
        b.set('rock', Math.min(1, (+b.get('rock') || 0) + 0.2), 1.5); // he rocks with the louder voice
      } else {
        listened++;
        b.set('listen', 1, 1.2);
        const far = scratch();
        far.loud(0.25, 2);
        await until(g.wait(LISTEN * 1000));
        far.stop(1.5);
        b.set('listen', 0, 1.2);
        await until(g.wait(1000));
      }
    }
    page.removeEventListener('pointerdown', press);
    removeEventListener('keydown', press);
    page.remove();
    g.withdraw();
    b.set('sound', 0);
    b.set('listen', 0, 0.8);
    return signal.aborted ? this.skipped : { louder, listened };
  },
};
