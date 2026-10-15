// «Струна» (II, «Комната Родерика», after the beat `guitar`): Roderick plays, and his playing runs away with him.
//   1. what he does — keeps time with his friend's playing, slapping his palm on his thigh: with him, or a slower beat of
//   his own; 2. wants — to be with him in it, or to hold him back from the frenzy; 3. fascinated and afraid; 4. the
//   player — keeping pace with someone, or keeping one's own.
// A choice, both ways seen from the start: the language's rhythm — the sign of the beat without a mark on Roderick's
// hand (his strokes: by themselves they quicken toward frenzy, the scene's `tempo` and `wild` — hair flying, the
// candles shaking; each stroke the scene's `strum` and a chord of her song), the player's ring on the narrator's hand:
// each touch his palm slaps his thigh (narrator_do keep_time). Touched on his strokes — going with him — he plays
// wilder; a steady beat of one's own, slower than his, pulls him back, and once he has come down to it he keeps it with
// his friend and calms, until it is let go. Neutral: the plate's ways show each touch as with him or one's own; ~45 s,
// sooner once he has calmed or reached his peak. Both ways are seen from the start: his beat's sign on his hand, a slower
// beat's sign on the narrator's (till a few touches are made); the ghost shows both.
//   → { follow: 0…1 — how much the player went with him (0.5: they never kept a beat), wild: 0…1 at the end }
import { guitar, SONG } from '../sound.js';
import { until } from '../hands.js';

const LENGTH = 46, SHORTEST = 26; // s: it ends at the first stroke after LENGTH, or after SHORTEST once settled
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const bpmOf = tempo => 56 + 140 * tempo ** 1.3; // his strokes a minute
const tempoOf = gap => clamp(((60 / gap - 56) / 140) ** (1 / 1.3) || 0, 0.05, 1); // and back, from seconds between

export default {
  title: 'Струна', // (as the author's ☰ lists it)
  about: 45,
  skipped: { follow: 0.5, wild: 0.6 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Он играл всё быстрее, и музыка уносила его' });
    let tempo = clamp(g.get('tempo') || 0.12, 0.05, 1), wild = clamp(g.get('wild') || 0);
    const sign = mg.mark({ at: 'roderick#hand_r', kind: 'light' });
    const me = mg.mark({ at: 'narrator#hand_r', kind: 'ring' });
    const rh = mg.rhythm({ on: me, show: [sign], bpm: bpmOf(tempo) });
    // the ghost: both ways — in his beat, then a slower beat of one's own on the same ring (shown by a rhythm of that pace,
    // gone once shown or touched)
    const slow = mg.rhythm({ on: me, show: [], bpm: bpmOf(tempo) / 2 });
    (async () => { await mg.show({ gestures: [rh] }).finished; await mg.show({ gestures: [slow] }).finished; slow.remove(); })();
    mg.on('down', () => slow.remove());
    // and the second way seen from the start: a slower beat's sign of its own on his hand (no mark: it only shows),
    // there till the player has kept a beat a while
    const ownSign = mg.mark({ at: 'narrator#hand_r', kind: 'light' });
    mg.rhythm({ on: ownSign, bpm: bpmOf(tempo) / 2 });
    const strings = guitar();
    signal.addEventListener('abort', () => strings.stop(0.3));
    let n = Math.floor((g.get('strum') || 0) - 0.25) + 1; // his strokes (the scene's strum: the n-th crosses at n + 0.25)
    let withHim = 0, own = 0, held = false, beat = 0, calmFor = 0, peakFor = 0, slap = false, over = false;
    const taps = [], ways = [];
    // a stroke of his (the rhythm's beat): heard, seen (his hand crosses the strings), his pace and wildness on from it
    rh.on('beat', ({ k }) => {
      const gap = 60 / bpmOf(tempo), t = rh.state.t;
      const bar = SONG[Math.floor(n / 3) % SONG.length];
      strings.strum([...bar.chord, bar.notes[0][0]], { loud: 0.3 + 0.45 * wild + (n % 3 ? 0 : 0.08), up: n % 2 === 1, spread: 0.035 - 0.022 * wild });
      if (held && t - (taps.at(-1) ?? 0) > 1.7 * beat) held = false; // let go: he runs on
      // by himself he quickens, and wildness follows the tempo, slowly; held, he calms
      if (!held) tempo = clamp(tempo + gap * 0.02 * (1 + wild * 0.6), 0.05, 1);
      wild = clamp(wild + gap * (held ? -0.12 : 0.18 * (clamp((tempo - 0.35) / 0.55) - wild)));
      g.set('tempo', tempo, gap);
      g.set('wild', wild, gap * 1.5);
      const next = held && beat ? beat : 60 / bpmOf(tempo);
      rh.set({ bpm: 60 / next });
      // his hand on to the next stroke by then
      b.set('strum', ++n + 0.25, next, 'linear');
      calmFor = tempo < 0.35 && wild < 0.1 ? calmFor + gap : 0;
      peakFor = tempo > 0.97 ? peakFor + gap : 0;
      if (t >= LENGTH || (t >= SHORTEST && (calmFor > 4 || peakFor > 5))) over = true;
    });
    // a touch: the palm on the thigh — with his stroke, or a steady beat of one's own
    rh.on('tap', ({ hit }) => {
      const t = rh.state.t;
      slap = !slap;
      g.set('narrator_do', { motion: 'keep_time', from: slap ? 0 : 0.01 });
      taps.push(t);
      if (taps.length > 5) taps.shift();
      const gaps = taps.slice(1).map((x, i) => x - taps[i]), before = gaps.slice(0, -1);
      const mean = before.length ? before.reduce((s, x) => s + x, 0) / before.length : 0;
      const steady = mean > 0.4 && Math.abs(gaps.at(-1) - mean) < 0.2 * mean;
      let kind = '';
      if (held && steady) kind = 'own';
      else if (hit) kind = 'with';
      else if (steady) kind = 'own';
      if (!steady) held = false;
      if (kind === 'with') {
        withHim++;
        held = false;
        tempo = clamp(tempo + 0.012, 0.05, 1);
        wild = clamp(wild + 0.04);
      } else if (kind === 'own') {
        own++;
        beat = (mean + gaps.at(-1)) / 2;
        const theirs = tempoOf(beat);
        if (theirs < tempo) { tempo += 0.35 * (theirs - tempo); wild = clamp(wild - 0.07); }
        if (Math.abs(tempo - theirs) < 0.05) held = true;
      }
      if (kind) ways.push(kind === 'with' ? 'theirs' : 'own');
      if (ways.length >= 4) ownSign.remove();
    });
    const done = await until(mg, ({ t }) => {
      const k = ways.length;
      mg.plate.set({ fill: Math.min(1, t / LENGTH), ways: ways.map((as, i) => ({ from: i / Math.max(k, 1) * Math.min(1, t / LENGTH), to: (i + 1) / Math.max(k, 1) * Math.min(1, t / LENGTH), as })), glow: null });
      return over;
    });
    strings.stop(done ? 2.5 : 0.3);
    g.set('narrator_do', 'stand');
    if (!done) return this.skipped;
    await mg.end({ as: 'neutral' });
    return { follow: withHim + own ? withHim / (withHim + own) : 0.5, wild };
  },
};
