// Тише или светлее (Комната Родерика): the player goes round Roderick's room — the candles, the window,
// the clock — and does with each as he would have it (по-его: dim them, draw the curtain, stop the
// clock) or as they think right (по-своему: light more, open the window, wind the clock), in any order.
// Each act changes the room at once (the scene's keys) and Roderick answers it — the beat `ease` or
// `flinch`, waited for — and then the chapter does (opts.onAct). Last the portrait is offered; looking
// at it ends the game (the chapter plays the beat `portrait`). Each thing still to be done is pressed at the
// point the scene marks on it (the page's ring there: AT).
// → { his: n, mine: n, order: [[which, kind], …] } — which: candles | window | clock; kind: his | mine
//   opts: { onAct(kind, which) — the chapter's answer to each act (a scale, a line); awaited }
// what can be done with each thing: [the action's label, the scene's key, to what, over seconds]
const ROOM = {
  candles: { his: ['Притушить', 'candles', 0.3, 1.4], mine: ['Зажечь ещё', 'candles', 1.6, 1.8] },
  window: { his: ['Задёрнуть', 'curtain', 1, 2.4], mine: ['Открыть окно', 'window_open', 1, 1.6] },
  clock: { his: ['Остановить часы', 'clock', 0, 2.6], mine: ['Завести часы', 'clock', 1, 1.8] },
};
const AT = { candles: 'candles', window: 'window#glass', clock: 'clock#dial', portrait: 'portrait#face' }; // where it is pressed: the point the scene marks

export default {
  title: 'Тише или светлее', // (as the author's ☰ lists it)
  skipped: { his: 2, mine: 1, order: [['candles', 'his'], ['window', 'his'], ['clock', 'mine']] },
  async run(g, b, opts, signal) {
    const order = [];
    const left = new Set(Object.keys(ROOM));
    // what the player picks (an action's id: which:kind), or null once the game is skipped
    const aborted = new Promise(ok => signal.addEventListener('abort', () => ok(null), { once: true }));
    const pick = offers => Promise.race([g.choose(null, offers), aborted]);
    while (left.size && !signal.aborted) {
      const offers = Object.fromEntries([...left].map(which => [AT[which], ['his', 'mine'].map(kind => ({ id: `${which}:${kind}`, label: ROOM[which][kind][0] }))]));
      const act = await pick(offers);
      if (!act) break;
      const [which, kind] = act.split(':');
      left.delete(which);
      order.push([which, kind]);
      const [, key, value, over] = ROOM[which][kind];
      b.set(key, value, over);
      await g.beat(kind === 'his' ? 'ease' : 'flinch');
      await opts.onAct?.(kind, which);
    }
    if (!signal.aborted) await pick({ [AT.portrait]: [{ id: 'look', label: 'Посмотреть на портрет' }] });
    if (signal.aborted) g.withdraw();
    const his = order.filter(([, kind]) => kind === 'his').length;
    return { his, mine: order.length - his, order };
  },
};
