// «Run» (IV, «The fall of the house», after the beat `run`): the flight along the causeway, the house splitting behind and the
// causeway going down after it.
//   1. what he does — runs, leading whoever he took by the hand; 2. wants — to get off the causeway before it goes;
//   3. terror, breath, the roar behind; 4. the player — keeping the stride in rhythm, not hurrying into a stumble.
// The language's rhythm anywhere: the beat of his stride on the runner (narrator — the sign of the beat, no mark); each
// touch a step: in its rhythm it sends him a stride further on (the scene's `run`: he runs there at his own pace, the
// cast's flee, and the ones he leads with him; `run_at` — where he is, in its units), a hurried one less; no steps, and
// he runs out what he was sent and stands. Hurried steps break the rhythm; broken, he (or the one he leads) stumbles
// (the beat `stumble`): he stops (`run` set where he is) and no step takes him on a while. Leading others, the rhythm is
// slower and stumbles come sooner. The house falls by its own clock (`fall`: the crack sets how fast — down in 46 s at the
// least crack, 20 s at the most); the break catches him when fall ≥ 0.4 + 0.6·(where he is). Low sanity: the rhythm
// wavers and its window narrows, the view swims (`swim`), the legs hardly obey (a shorter stride a step). Caught — the
// end as a loss.
//   opts: { companions: ['madeline', 'roderick'] — whom he leads by the hand, speed: 0…1 — the crack (scale /
//   CRACK_FULL), sanity: 0…1 — the scale / its max }
//   → { escaped }
import { crash, step } from '../sound.js';
import { until } from '../hands.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// (the way, in `run`: 1 — all of it, some 32 strides)
const STRIDE = 0.031, HURRIED = 0.012; // how much further on a step sends him: in its rhythm, hurried
const AHEAD = 0.048; // never sent further than this before him (about a second of his running)
const OFF = 0.004; // this short of the end, he is off the causeway
const FALL0 = 0.15; // where the house is when the run begins
const GRACE = 2.5; // s: the house waits this long for the first step
const DOWN = 1.2; // s: a stumble — no step takes him on meanwhile

export default {
  title: 'Run', // (as the author's map lists it)
  about: 30,
  skipped: { escaped: true },
  async run(g, b, opts, signal) {
    const n = (opts.companions || []).length, sane = clamp(opts.sanity ?? 1), crack = clamp(opts.speed ?? 0.3);
    const beat = 0.36 + 0.08 * n, // s between steps, in rhythm
      legs = 0.3 + 0.7 * clamp(sane / 0.4), // how far a step sends him, of a full stride
      breaks = 2.5 - 0.5 * n, // hurried steps (less those in rhythm) that break it: leading others, sooner
      fallRate = (1 - FALL0) / (46 - 26 * crack),
      lost = clamp((0.6 - sane) / 0.6), // the mind going: 0 … 1
      window = 0.15 * (1 - 0.4 * lost);
    const mg = g.minigame({ phrase: tr('The causeway crumbled behind me, and the house sank beneath the water') });
    const runner = mg.mark({ at: 'narrator', kind: 'light' });
    const rh = mg.rhythm({ on: null, show: [runner], bpm: 60 / beat, window });
    b.minigame.tricks.teach(mg, [rh], { id: 'rhythm-anywhere' });
    g.set('swim', lost);
    const at = () => clamp(+g.get('run_at') || 0); // where he is now (the scene keeps it)
    let aim = at(), miss = 0, down = 0, falling = false, crashed = false, steps = 0;
    const send = to => { aim = clamp(to); g.set('run', aim); };
    // the house comes down by its own clock, from where it is to the end (the scene moves it)
    const fallFrom = () => {
      if (falling) return;
      falling = true;
      const f = Math.max(FALL0, +g.get('fall') || FALL0);
      b.set('fall', 1, (1 - f) / fallRate, 'linear');
    };
    rh.on('tap', ({ hit, off }) => {
      if (mg.t < down) return;
      fallFrom();
      const hurried = !hit && off < 0;
      miss = hurried ? miss + 1 : Math.max(0, miss - 0.5);
      steps++;
      step(n / 2, hurried);
      if (miss >= breaks) {
        // the rhythm broken: a stumble (his, or the one's he leads) — he stops, and no step sends him on meanwhile
        miss = 0;
        down = mg.t + DOWN;
        send(at());
        mg.error('timing', { at: runner, chip: true });
        g.beat('stumble', { wait: false });
        return;
      }
      const here = at();
      send(Math.min(here + AHEAD, Math.max(aim, here) + (hurried ? HURRIED : STRIDE) * legs));
    });
    const t0 = mg.t;
    let escaped = false;
    const done = await until(mg, ({ t }) => {
      if (t - t0 > GRACE) fallFrom();
      // (the rhythm wavers with the mind going)
      if (lost) rh.set({ bpm: 60 / (beat * (1 + 0.25 * lost * Math.sin(t * 1.7) * Math.sin(t * 0.61 + 1))) });
      const fall = +g.get('fall') || 0;
      if (!crashed && fall > 0.45) { crashed = true; crash(); }
      const r = at();
      escaped = r >= 1 - OFF;
      mg.plate.set({ fill: r, shade: clamp(fall), glow: mg.t < down ? 'bad' : 'good' });
      return escaped || fall >= 0.4 + 0.6 * r;
    });
    g.set('swim', 0);
    if (!done) return this.skipped;
    await mg.end({ as: escaped ? (steps && miss === 0 ? 'clean' : 'flawed') : 'loss' });
    return { escaped };
  },
};
