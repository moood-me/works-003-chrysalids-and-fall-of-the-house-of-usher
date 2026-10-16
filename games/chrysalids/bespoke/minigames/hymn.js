// «Петь со всеми» (II.4, «Сожжение поля», while the beat `hymn` holds): the community's hymn over the burning field.
//   1. what he does — sings with the crowd; 2. wants — not to stand out, or not to sing «Проклят, кто не по образу Его»;
//   3. Sophie's and Rosalind's voices in his head, fear; 4. the player — singing along with the crowd, or falling silent.
// A choice, both ways seen from the start: the language's rhythm on David (dv) — the beats are the syllables (uneven:
// their moments are the hymn's), the sign of the beat on his father (jo: he leads); a touch in the beat — David's voice
// joins the crowd's; the ghost shows both ways — the beat, and hands off. The hymn's words go along the speech band (the
// game's own line, unvoiced), the choir is the game's sound. Neutral: a touch out of the beat is not shown as an error;
// the plate's ways show it — sang / his own / silent. The people in front turn round (the scene's `turned`) the more he
// is silent or out of the beat.
//   → { hymn: loud | lips | silent, turned }
import { until } from '../hands.js';

const BEAT = 0.75, LEAD = 2, D3 = 146.83;

export default {
  title: 'Петь со всеми', // (as the author's ☰ lists it)
  about: 32,
  skipped: { hymn: 'lips', turned: 0 }, // (neutral: the path not moved)
  async run(g, b, opts, signal) {
    // the hymn in the play's language (bespoke/lang/<lang>/hymn.json): its lines, each its syllables (a space after — the
    // word ends) and their notes, semitones above D
    const { lines } = await b.data('hymn');
    // the syllables on the rhythm's own clock (from LEAD s on)
    const syl = [];
    let t = LEAD;
    lines.forEach(({ syllables, notes }, line) => {
      syllables.forEach((w, i) => {
        const beats = i === syllables.length - 1 ? 2 : 1;
        syl.push({ w, line, at: t, dur: beats * BEAT, f: D3 * 2 ** (notes[i] / 12), as: null });
        t += beats * BEAT;
      });
      t += BEAT;
    });
    const end = t + 0.5;
    const mg = g.minigame({ phrase: 'Гимн шёл над полем, и громче всех пел отец' });
    const choir = g.sound.choir();
    const sign = mg.mark({ at: 'jo', kind: 'light' });
    const me = mg.mark({ at: 'dv', kind: 'ring' });
    const rh = mg.rhythm({ on: me, show: [sign], times: syl.map(s => s.at) });
    // the ghost: both ways — in the beat, and hands off
    (async () => { await mg.show({ gestures: [rh] }).finished; mg.show({ handsOff: true }); })();
    // the words along the speech band (the game's own line, unvoiced)
    const words = document.createElement('div');
    Object.assign(words.style, { position: 'absolute', left: '50%', bottom: '12%', transform: 'translateX(-50%)', whiteSpace: 'nowrap',
      pointerEvents: 'none', font: 'italic clamp(18px, 2.8vw, 30px)/1.4 Georgia, "Times New Roman", serif', color: '#efe6d2',
      textShadow: '0 1px 8px rgba(0, 0, 0, 0.75)', transition: 'opacity 1.2s ease' });
    b.layer.append(words);
    signal.addEventListener('abort', () => words.remove());
    let shown = -1, attention = 0, told = 0, presses = 0, sung = 0, queued = 0;
    const a0 = choir.now() - rh.state.t; // (the choir's clock at the rhythm's 0)
    const turn = d => {
      attention = Math.max(0, Math.min(1, attention + d));
      if (Math.abs(attention - told) > 0.03) { told = attention; g.set('turned', attention, 0.8); }
    };
    rh.on('tap', ({ k, hit }) => {
      presses++;
      const s = syl[k];
      if (hit && s && !s.as) {
        s.as = 'theirs';
        sung++;
        choir.voice(s.f * 2, a0 + Math.max(rh.state.t, s.at), s.dur, 0.05, 'david');
        turn(-0.06);
      } else {
        if (s && !s.as) s.as = 'own';
        choir.voice(D3 * 2 * 2 ** (1 / 12), choir.now(), 0.3, 0.025, 'david');
        turn(0.12);
      }
    });
    const ways = () => {
      const out = [];
      syl.forEach((s, i) => { if (s.as) out.push({ from: i / syl.length, to: (i + 1) / syl.length, as: s.as }); });
      return out;
    };
    const done = await until(mg, () => {
      const now = rh.state.t;
      while (queued < syl.length && syl[queued].at < now + 0.4) { const s = syl[queued++]; choir.voice(s.f, a0 + s.at, s.dur, 0.035, 'crowd'); }
      for (const s of syl) if (!s.as && now > s.at + 0.35) { s.as = 'none'; turn(0.04); }
      const next = syl.find(s => now < s.at + s.dur);
      if (next && next.line !== shown && now > next.at - BEAT * 1.5) {
        shown = next.line;
        words.textContent = syl.filter(s => s.line === shown).map(s => s.w).join('');
      }
      mg.plate.set({ fill: Math.min(1, now / end), ways: ways(), glow: null });
      return now > end;
    });
    choir.stop();
    words.style.opacity = '0';
    setTimeout(() => words.remove(), 1300);
    if (!done) { g.set('turned', 0, 2); return this.skipped; }
    const share = sung / syl.length;
    await mg.end({ as: 'neutral' });
    return { hymn: presses <= 3 ? 'silent' : share >= 0.6 && attention < 0.5 ? 'loud' : 'lips', turned: attention };
  },
};
