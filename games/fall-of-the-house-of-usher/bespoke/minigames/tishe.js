// «Quieter or brighter» (I, «Roderick's room», after the beat `room`): the friend goes round Roderick's room.
//   1. what he does — sets the room right: the candles, the window, the clock; 2. wants — to ease his friend, or to let
//   some life into the room; 3. pity and unease in the sick man's room; 4. the player — choosing, thing by thing, his way
//   or one's own, and seeing what it does to him.
// A choice, both ways seen at once: the language's press with petals on each thing (the candles, the window's glass, the
// clock's dial), its two words — his way (dim them, draw the curtain, stop the clock) or one's own (light more, open
// the window, wind the clock), in any order. Each act changes the room at once (the scene's keys) and Roderick answers —
// the beat `ease` or `flinch` and the chapter's line (opts.onAct), the scene turning meanwhile. The plate's ways show
// each act in the colour of its way. Last the portrait (portrait#face): a touch, and the minigame ends — the chapter
// plays the beat `portrait`.
//   opts: { onAct(kind, which) — the chapter's answer to each act (a scale, a line); awaited }
//   → { his: n, mine: n, order: [[which, kind], …] } — which: candles | window | clock; kind: his | mine
import { once } from '../hands.js';

// what can be done with each thing: [the petal's words, the scene's key, to what, over seconds]; where it is pressed
const ROOM = {
  candles: { at: 'candles@', his: [tr('Dim them'), 'candles', 0.3, 1.4], mine: [tr('Light more'), 'candles', 1.6, 1.8] },
  window: { at: 'window#glass', his: [tr('Draw the curtain'), 'curtain', 1, 2.4], mine: [tr('Open the window'), 'window_open', 1, 1.6] },
  clock: { at: 'clock#dial', his: [tr('Stop the clock'), 'clock', 0, 2.6], mine: [tr('Wind the clock'), 'clock', 1, 1.8] },
};
const WAY = { his: 'theirs', mine: 'own' }; // (the plate's colour of each way)

export default {
  title: 'Quieter or brighter', // (as the author's ☰ lists it)
  about: 45,
  skipped: { his: 2, mine: 1, order: [['candles', 'his'], ['window', 'his'], ['clock', 'mine']] },
  async run(g, b, { onAct } = {}, signal) {
    const mg = g.minigame({ phrase: tr('Every ray and every sound gave him pain') });
    const order = [];
    const things = Object.entries(ROOM).map(([which, o]) => {
      const mark = mg.mark({ at: o.at, kind: 'ring' });
      const press = mg.press({ on: mark, petals: ['his', 'mine'].map(kind => ({ id: kind, label: o[kind][0] })) });
      return { which, mark, press };
    });
    b.minigame.tricks.teach(mg, things.map(t => t.press), { id: 'petals' });
    const ways = () => order.map(([, kind], i) => ({ from: i / 3, to: (i + 1) / 3, as: WAY[kind] }));
    while (order.length < things.length) {
      const left = things.filter(t => !order.some(([w]) => w === t.which));
      const act = await Promise.race(left.map(t => once(mg, t.press, 'choose').then(x => x && { t, kind: x.id })));
      if (!act) return this.skipped;
      const { t, kind } = act;
      order.push([t.which, kind]);
      mg.snap({ at: t.mark });
      t.mark.remove();
      const [, key, value, over] = ROOM[t.which][kind];
      g.set(key, value, over);
      mg.plate.set({ ways: ways() });
      // (Roderick answers: the scene's turn)
      mg.sceneTurn(true);
      await g.beat(kind === 'his' ? 'ease' : 'flinch');
      await onAct?.(kind, t.which);
      if (signal.aborted) return this.skipped;
      mg.sceneTurn(false);
    }
    // the portrait: a touch, and he goes to her
    const face = mg.mark({ at: 'portrait#face', kind: 'ring' });
    mg.glow('portrait');
    if (!(await once(mg, mg.press({ on: face }), 'press'))) return this.skipped;
    mg.snap({ at: face });
    await mg.end({ as: 'neutral' });
    const his = order.filter(([, kind]) => kind === 'his').length;
    return { his, mine: order.length - his, order };
  },
};
