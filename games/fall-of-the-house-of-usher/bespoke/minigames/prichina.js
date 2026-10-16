// «Cause» (I, «The approach to the house», after the beat `look`): what is it in the house that chills the heart?
//   1. what he does — looks at the house for the cause of his gloom: the windows, the trees, the water, then the crack,
//   which he follows down with his eyes; 2. wants — to find a cause, a sober one; 3. dread without a cause, reasoning
//   with it; 4. the player — looking round, touch by touch, then following the crack carefully from the roof to the water.
// The language's press, three marks at once (windows, trees, tarn — where each is pressed): a touch is a look — the
// chapter's sober line (opts.onLook, the scene turning meanwhile: the marks hidden) and the scene's `gloom` a step up
// (darker, mistier, the lit window dimmer). Then a mark on the crack's top (crack#k0): a touch, and the camera comes
// nearer (the beat `trace`); then the language's trace along the crack's points (crack#k0 … k16), from the roof down to
// the water: the scene's `crack_trace` pales it as far as the finger has gone.
//   opts: { onLook(which: 'windows' | 'trees' | 'tarn', n: how many looks so far) → a promise (the next look waits for
//   it): the chapter's sober line — and its sound falling quieter }
//   → { looked: [which…], traced }
import { until, once, keys } from '../hands.js';

const LOOKS = ['windows', 'trees', 'tarn'];
// where each is pressed (the trees: a point the scene names on the nearer one)
const AT = { windows: 'windows@', trees: 'trees#trunk', tarn: 'tarn@' };
const LINE = Array.from({ length: 17 }, (_, i) => `crack#k${i}`);

export default {
  title: 'Cause', // (as the author's ☰ lists it)
  about: 40,
  skipped: { looked: ['windows', 'trees', 'tarn'], traced: true },
  async run(g, b, { onLook } = {}, signal) {
    const mg = g.minigame({ phrase: tr('Nothing in the house accounted for the gloom it cast upon me') });
    const send = keys(g);
    mg.plate.set({ notches: [1 / 4, 2 / 4, 3 / 4] });
    const looked = [];
    // the three looks, in any order: each a touch — the line, the gloom a step deeper
    const marks = LOOKS.map(which => {
      const mark = mg.mark({ at: AT[which], kind: 'ring' });
      return { which, mark, press: mg.press({ on: mark }) };
    });
    b.minigame.tricks.teach(mg, marks.map(m => m.press), { id: 'press' });
    while (looked.length < LOOKS.length) {
      const left = marks.filter(m => !looked.includes(m.which));
      const touched = await Promise.race(left.map(m => once(mg, m.press, 'press').then(x => x && m)));
      if (!touched) { g.set('gloom', 1); g.set('crack_trace', 1); return this.skipped; }
      looked.push(touched.which);
      mg.snap({ at: touched.mark });
      touched.mark.remove();
      g.set('gloom', looked.length / LOOKS.length, 3);
      mg.plate.set({ fill: looked.length / 4 });
      mg.sceneTurn(true);
      await onLook?.(touched.which, looked.length);
      if (signal.aborted) return this.skipped;
      mg.sceneTurn(false);
    }
    // the crack: its top touched — the eye comes nearer — then traced down to the water
    mg.plate.set({ phrase: tr('From the very roof down the wall ran a barely perceptible fissure') });
    const top = mg.mark({ at: LINE[0], kind: 'ring' });
    const touch = mg.press({ on: top });
    if (!(await once(mg, touch, 'press'))) { g.set('crack_trace', 1); return this.skipped; }
    top.remove();
    mg.sceneTurn(true);
    await g.beat('trace');
    if (signal.aborted) { g.set('crack_trace', 1); return this.skipped; }
    mg.sceneTurn(false);
    const start = mg.mark({ at: LINE[0], kind: 'dash' });
    const trace = mg.trace({ on: start, line: LINE });
    b.minigame.tricks.teach(mg, [trace], { id: 'trace' });
    trace.on('off', () => mg.error('off', { at: trace, chip: false }));
    const done = await until(mg, () => {
      const u = trace.state.u;
      send('crack_trace', u);
      mg.plate.set({ fill: 3 / 4 + u / 4, glow: trace.state.tracing ? 'good' : 'idle' });
      return u >= 0.99;
    });
    if (!done) {
      g.set('gloom', 1);
      g.set('crack_trace', 1);
      return this.skipped;
    }
    g.set('crack_trace', 1, 0.4);
    mg.snap({ at: start });
    await mg.end({ as: 'clean' });
    return { looked, traced: true };
  },
};
