// Струна (Комната Родерика): Roderick plays, and his playing runs away with him — by itself it
// quickens toward frenzy (the scene's `tempo`, `wild`: hair flying, the candles shaking). Each stroke
// of his is seen in the scene (`strum`, his strokes counted: his hand strikes, the flames jump) and as
// an ink pulse low on the screen. The player taps (anywhere; or a key). On his strokes — going with him — he plays
// wilder, more beautiful, more frightening. A steady beat of their own, slower than his, pulls him
// back; once he has come down to it he keeps it with them (his strokes fall on their taps) and calms,
// until they let go. ~45 s; it may end sooner, once he has calmed or reached his peak.
// → { follow: 0…1 — how much the player went with him (0.5: they never kept a beat), wild: 0…1 at the end }
//   opts: {}
// The guitar is heard (sound.js): each stroke strums a chord of her song, a bar of three strokes each.
import { guitar, SONG } from '../sound.js';

const LENGTH = 46, SHORTEST = 26; // seconds: it ends at the first stroke after LENGTH, or after SHORTEST once settled
let styled = null;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const interval = tempo => 60 / (56 + 140 * tempo ** 1.3); // seconds between his strokes
const tempoOf = gap => clamp(((60 / gap - 56) / 140) ** (1 / 1.3) || 0, 0.05, 1); // and back

export default {
  title: 'Струна', // (as the author's ☰ lists it)
  skipped: { follow: 0.5, wild: 0.6 },
  async run(g, b, opts, signal) {
    styled ||= b.css('minigames/struna.css');
    await styled;
    if (signal.aborted) return;
    const catcher = document.createElement('div'),
      pulse = document.createElement('div'),
      hint = document.createElement('p');
    catcher.className = 'mg-struna-catch';
    pulse.className = 'mg-struna';
    hint.className = 'mg-struna-hint';
    hint.textContent = 'Стучи в такт с ним — или держи свой ритм';
    b.layer.append(catcher, pulse, hint);

    const strings = guitar();
    const t0 = performance.now();
    const now = () => (performance.now() - t0) / 1000;
    let tempo = clamp(b.get('tempo') || 0.12, 0.05, 1),
      wild = clamp(b.get('wild') || 0);
    let withHim = 0,
      own = 0,
      held = false, // he keeps the player's beat
      n = 0, // his strokes (the scene's `strum`: the n-th crosses the strings at n + 0.25)
      beat = 0, // the player's beat: seconds between their taps, once steady
      calmFor = 0,
      peakFor = 0,
      timer = 0;
    const taps = [],
      strokes = [];

    // a stroke of his (it crosses the strings now); → when the next one comes (seconds from now), or
    // null: the playing is over
    const stroke = () => {
      const t = now(),
        gap = interval(tempo),
        last = taps.at(-1);
      strokes.push(t);
      if (strokes.length > 4) strokes.shift();
      const bar = SONG[Math.floor(n / 3) % SONG.length];
      strings.strum([...bar.chord, bar.notes[0][0]], { loud: 0.3 + 0.45 * wild + (n % 3 ? 0 : 0.08), up: n % 2 === 1, spread: 0.035 - 0.022 * wild });
      if (held && t - last > 1.7 * beat) held = false; // they let go: he runs on
      // by himself he quickens, and wildness follows the tempo, slowly; held, he calms
      if (!held) tempo = clamp(tempo + gap * 0.02 * (1 + wild * 0.6), 0.05, 1);
      wild = clamp(wild + gap * (held ? -0.12 : 0.18 * (clamp((tempo - 0.35) / 0.55) - wild)));
      b.set('tempo', tempo, gap);
      b.set('wild', wild, gap * 1.5);
      pulse.animate([{ transform: 'scale(1.35)', opacity: 0.9 }, { transform: 'scale(1)', opacity: 0.35 }], { duration: Math.min(500, gap * 900), easing: 'ease-out' });
      calmFor = tempo < 0.35 && wild < 0.1 ? calmFor + gap : 0;
      peakFor = tempo > 0.97 ? peakFor + gap : 0;
      if (t >= LENGTH || (t >= SHORTEST && (calmFor > 4 || peakFor > 5))) return null;
      let next = interval(tempo);
      if (held) {
        next = last + beat - t; // on their next tap
        while (next < 0.4 * beat) next += beat;
      }
      // his hand: round to the next stroke by then
      b.set('strum', ++n + 0.25, next, 'linear');
      return next;
    };

    const tap = e => {
      if (e.type === 'keydown' && (e.repeat || e.ctrlKey || e.metaKey || e.altKey || (e.key !== 'Enter' && e.key.length !== 1))) return;
      e.preventDefault();
      if (!strokes.length) return;
      const t = now(),
        gap = interval(tempo);
      taps.push(t);
      if (taps.length > 5) taps.shift();
      // steady: this interval near the ones before it
      const gaps = taps.slice(1).map((x, i) => x - taps[i]);
      const before = gaps.slice(0, -1);
      const mean = before.length ? before.reduce((s, x) => s + x, 0) / before.length : 0;
      const steady = mean > 0.4 && Math.abs(gaps.at(-1) - mean) < 0.2 * mean;
      // on his beat: a stroke just now, or one about to come
      const off = Math.min(...strokes.map(s => Math.abs(t - s)), Math.abs(strokes.at(-1) + gap - t));
      const onHis = off < Math.min(0.12, gap * 0.3);
      let kind = '';
      if (held && steady) kind = 'own';
      else if (onHis) kind = 'with';
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
        if (theirs < tempo) {
          tempo += 0.35 * (theirs - tempo);
          wild = clamp(wild - 0.07);
        }
        if (Math.abs(tempo - theirs) < 0.05) held = true;
      }
      const dot = Object.assign(document.createElement('i'), { className: kind });
      pulse.append(dot);
      dot.animate([{ opacity: 0.9, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(2.2)' }], { duration: 700, easing: 'ease-out' }).onfinish = () => dot.remove();
      if (withHim + own === 4) hint.classList.add('gone');
    };
    const on = [[catcher, 'pointerdown', tap], [window, 'keydown', tap]];
    for (const [t, ev, fn] of on) t.addEventListener(ev, fn);
    const hintGone = setTimeout(() => hint.classList.add('gone'), 7000);

    await new Promise(ok => {
      signal.addEventListener('abort', ok, { once: true });
      const go = () => {
        if (signal.aborted) return;
        const next = stroke();
        if (next == null) ok();
        else timer = setTimeout(go, next * 1000);
      };
      // his hand goes on from where it is to the next stroke, at the pace it had
      const at = b.get('strum') || 0;
      n = Math.floor(at - 0.25) + 1;
      const lead = (n + 0.25 - at) * interval(tempo);
      b.set('strum', n + 0.25, lead, 'linear');
      timer = setTimeout(go, lead * 1000);
    });
    clearTimeout(timer);
    clearTimeout(hintGone);
    strings.stop(signal.aborted ? 0.3 : 2.5);
    for (const [t, ev, fn] of on) t.removeEventListener(ev, fn);
    catcher.remove();
    hint.remove();
    pulse.classList.add('gone');
    setTimeout(() => pulse.remove(), signal.aborted ? 0 : 1200);
    return { follow: withHim + own ? withHim / (withHim + own) : 0.5, wild };
  },
};
