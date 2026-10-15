// «Бег» (IV, «Падение дома», after the beat `run`): the flight along the causeway, the house splitting behind and
// the causeway going down after it. Each tap (or key) is a step. He runs as fast as he runs (the scene: `run` says
// where along the causeway he makes for, and he runs there at his own pace, the cast's flee — the ones he leads with
// him); the player's steps keep him going: each one in its rhythm — an ink ring low on the screen beats it — sends him
// a stride further on (a hurried one, less); no steps, and he runs out what he was sent and stands. Hurried steps
// break the rhythm; broken, he (or the one he leads) stumbles (the beat `stumble`): he stops (`run` set where he is —
// the scene has him run out a stride and stand) and no step takes him on a while. Leading others by the hand, the rhythm
// is slower and stumbles come sooner. The house falls by its own clock (`fall`, moved by the scene: the crack sets how
// fast — down in 46 s at the least crack, 20 s at the most); the break catches him when fall ≥ 0.4 + 0.6·(where he is)
// (the scene's notes). Where he is — the scene's `run_at`, in `run`'s units: the game thinks in them (0 — where the run
// begins, 1 — off the causeway), never in the scene's metres. Low sanity: the rhythm wavers, its window narrows, the view
// swims (`swim`), the legs hardly obey (a shorter stride a step).
//   opts: { companions: ['madeline', 'roderick'] — whom he leads by the hand, speed: 0…1 — the crack (scale /
//   CRACK_FULL), sanity: 0…1 — the scale / its max }
//   → { escaped: true | false }
import { crash, step } from '../sound.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// (the way, in `run`: 1 — all of it, some 32 strides)
const STRIDE = 0.031, HURRIED = 0.012; // how much further on a step sends him: in its rhythm, hurried
const AHEAD = 0.048; // never sent further than this before him (about a second of his running)
const OFF = 0.004; // this short of the end, he is off the causeway
const FALL0 = 0.15; // where the house is when the run begins
const GRACE = 2.5; // s: the house waits this long for the first step
const DOWN = 1.2; // s: a stumble — no step takes him on meanwhile
let styled = null;

export default {
  title: 'Бег', // (as the author's ☰ lists it)
  skipped: { escaped: true },
  async run(g, b, opts, signal) {
    styled ||= b.css('minigames/beg.css');
    await styled;
    if (signal.aborted) return null;
    const n = (opts.companions || []).length,
      sane = clamp(opts.sanity ?? 1),
      crack = clamp(opts.speed ?? 0.3);
    const beat = 0.36 + 0.08 * n, // s between steps, in rhythm
      legs = 0.3 + 0.7 * clamp(sane / 0.4), // how far a step sends him, of a full stride
      breaks = 2.5 - 0.5 * n, // hurried steps (less those in rhythm) that break it: leading others, sooner
      fallRate = (1 - FALL0) / (46 - 26 * crack),
      lost = clamp((0.6 - sane) / 0.6), // the mind going: 0 … 1
      waver = 0.25 * lost, // how much the rhythm wanders
      early = 0.7 + 0.1 * lost, // a step in rhythm comes this much of the beat after the one before …
      late = 1.45 - 0.15 * lost; // … and no later than this

    const veil = document.createElement('div'),
      pulse = document.createElement('div'),
      word = document.createElement('p');
    veil.className = 'beg-veil';
    pulse.className = 'beg-pulse';
    word.className = 'beg-word';
    word.textContent = 'Беги! Касайся в такт шагам';
    veil.append(pulse, word);
    b.layer.append(veil);
    b.set('swim', lost);

    const at = () => clamp(+b.get('run_at') || 0); // where he is now (the scene keeps it)
    let aim = at(), // where he is sent
      fall = 0,
      last = 0, // the last step (s)
      miss = 0, // the rhythm breaking: up with hurried steps, down with steps in rhythm
      down = 0, // stumbling until then (s)
      good = 0,
      falling = false,
      crashed = false,
      phase = 0,
      raf = 0,
      prev = performance.now();
    const t0 = prev;
    const now = () => (performance.now() - t0) / 1000;
    // the beat now: steady, or wandering with the mind
    const rhythm = t => beat * (1 + waver * Math.sin(t * 1.7) * Math.sin(t * 0.61 + 1));
    // the house comes down by its own clock, from where it is to the end (the scene moves it)
    const fallFrom = () => {
      if (falling) return;
      falling = true;
      const f = Math.max(FALL0, +b.get('fall') || FALL0);
      b.set('fall', 1, (1 - f) / fallRate, 'linear');
    };
    const send = to => {
      aim = clamp(to);
      b.set('run', aim);
    };

    const tread = () => {
      const t = now();
      if (t < down) return;
      fallFrom();
      const ratio = last ? (t - last) / rhythm(t) : 1;
      last = t;
      const hurried = ratio < early,
        inStep = !hurried && ratio <= late;
      miss = hurried ? miss + 1 : Math.max(0, miss - 0.5);
      if (inStep) good++;
      step(n / 2, hurried);
      pulse.classList.remove('hit', 'off');
      void pulse.offsetWidth;
      pulse.classList.add(hurried ? 'off' : 'hit');
      if (miss >= breaks) {
        // the rhythm broken: a stumble (his, or the one's he leads) — he stops (sent where he is: the scene has him run out
        // a stride and stand), and no step sends him on meanwhile
        miss = 0;
        down = t + DOWN;
        send(at());
        g.beat('stumble', { wait: false });
        return;
      }
      const here = at();
      send(Math.min(here + AHEAD, Math.max(aim, here) + (hurried ? HURRIED : STRIDE) * legs));
    };
    const press = e => {
      if (e.button > 0) return;
      e.preventDefault();
      tread();
    };
    const key = e => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length !== 1 && !/^(Arrow|Enter$)/.test(e.key)) return;
      e.preventDefault();
      tread();
    };
    veil.addEventListener('pointerdown', press);
    addEventListener('keydown', key);

    function end() {
      cancelAnimationFrame(raf);
      veil.removeEventListener('pointerdown', press);
      removeEventListener('keydown', key);
      b.set('swim', 0);
      veil.classList.add('gone');
      setTimeout(() => veil.remove(), 900);
    }
    signal.addEventListener('abort', end);

    return new Promise(done => {
      const frame = ms => {
        const dt = Math.min(0.1, (ms - prev) / 1000),
          t = now();
        prev = ms;
        if (t > GRACE) fallFrom();
        fall = +b.get('fall') || 0;
        if (!crashed && fall > 0.45) {
          crashed = true;
          crash();
        }
        // the pulse, on the beat
        phase = (phase + dt / rhythm(t)) % 1;
        pulse.style.setProperty('--beat', (1 - phase).toFixed(3));
        if (good >= 6) word.classList.add('gone');
        const r = at(),
          escaped = r >= 1 - OFF,
          caught = !escaped && fall >= 0.4 + 0.6 * r;
        if (escaped || caught) {
          end();
          done({ escaped });
          return;
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      signal.addEventListener('abort', () => done(null));
    });
  },
};
