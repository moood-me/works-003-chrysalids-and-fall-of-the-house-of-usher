// Петь со всеми (Сожжение поля): the crowd's hymn, heard (made in the page) — its words come up over the
// smoke a syllable at a time, a small light hopping to each as it is sung. The player sings with them:
// a press (anywhere; or a key) on each syllable as it comes, and David's voice joins the crowd's. Out
// of time, or silent, the people in front turn to look (the scene's `turned`, 0..1); in time, they
// turn back to the fire. → { sung: 0..1 of the syllables in time, presses, turned, hymn: loud | lips | silent }
let styled = null, ctx = null;
// (the site's "sounds" slider: MooodVolume.output — what this page makes goes to the speakers through it)
let sink = null;
const audio = () => { if (!ctx) { ctx = new AudioContext(); sink = MooodVolume.output(ctx); sink.connect(ctx.destination); } if (ctx.state === 'suspended') ctx.resume(); return ctx; };

// the lines: syllables (a space after — the word ends) and their notes, semitones above D
const A = ['Да ', 'бу', 'дет ', 'чист ', 'об', 'раз ', 'Е', 'го'], B = ['Про', 'клят, ', 'кто ', 'не ', 'по ', 'об', 'ра', 'зу ', 'Е', 'го'];
const LINES = [[A, [0, 0, 3, 5, 7, 5, 3, 2]], [A, [0, 0, 3, 5, 7, 5, 3, 0]], [B, [7, 7, 5, 7, 10, 7, 5, 3, 2, 0]], [A, [0, 0, 3, 5, 7, 5, 3, 0]]];
const BEAT = 0.75, WINDOW = 0.28, D3 = 146.83;

export default {
  title: 'Петь со всеми', // (as the author's ☰ lists it)
  skipped: { sung: 0.5, presses: 10, turned: 0, hymn: 'lips' },
  async run(g, b, opts, signal) {
    styled ||= b.css('minigames/hymn.css');
    await styled;
    if (signal.aborted) return;
    const a = audio(), out = a.createGain(), lp = a.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 850;
    out.gain.value = 0.9;
    lp.connect(out).connect(sink);
    // the syllables on the clock of the sound
    const start = a.currentTime + 2;
    const syl = [];
    let t = start;
    LINES.forEach(([words, notes], line) => {
      words.forEach((w, i) => {
        const beats = i === words.length - 1 ? 2 : 1;
        syl.push({ w, line, at: t, dur: beats * BEAT, f: D3 * 2 ** (notes[i] / 12), judged: false });
        t += beats * BEAT;
      });
      t += BEAT;
    });
    const end = t;
    // the crowd: low voices, a little apart; David — an octave up, when he sings
    const voice = (f, at, dur, vol, type, to = lp) => {
      const e = a.createGain();
      e.gain.setValueAtTime(0, at);
      e.gain.linearRampToValueAtTime(vol, at + 0.12);
      e.gain.setValueAtTime(vol * 0.8, at + dur * 0.85);
      e.gain.linearRampToValueAtTime(0, at + dur + 0.1);
      e.connect(to);
      for (const [k, cents] of type === 'crowd' ? [[1, -7], [1, 6], [0.5, 0]] : [[1, 0]]) {
        const o = a.createOscillator();
        o.type = type === 'crowd' ? 'sawtooth' : 'triangle';
        o.frequency.value = f * k; o.detune.value = cents;
        o.connect(e); o.start(at); o.stop(at + dur + 0.15);
      }
    };
    let queued = 0;
    const timer = setInterval(() => { while (queued < syl.length && syl[queued].at < a.currentTime + 0.4) { const s = syl[queued++]; voice(s.f, s.at, s.dur, 0.035, 'crowd'); } }, 100);

    const words = document.createElement('div'), dot = document.createElement('i'), catcher = document.createElement('div');
    words.className = 'mg-hymn'; catcher.className = 'mg-hymn-catch';
    b.layer.prepend(catcher, words);
    let shown = -1;
    const show = line => {
      shown = line;
      words.replaceChildren(...syl.filter(s => s.line === line).map(s => { s.el = Object.assign(document.createElement('span'), { textContent: s.w }); return s.el; }), dot);
    };
    let attention = 0, sung = 0, presses = 0, told = 0;
    const turn = d => {
      attention = Math.max(0, Math.min(1, attention + d));
      if (Math.abs(attention - told) > 0.03) { told = attention; b.set('turned', attention, 0.8); }
    };
    const press = e => {
      if (e.type === 'keydown' && (e.repeat || e.ctrlKey || e.metaKey || e.altKey || (e.key !== 'Enter' && e.key.length !== 1))) return;
      e.preventDefault();
      const now = a.currentTime;
      presses++;
      const s = syl.find(s => !s.judged && Math.abs(now - s.at) <= WINDOW);
      if (s) {
        s.judged = true; sung++;
        s.el?.classList.add('sung');
        voice(s.f * 2, Math.max(now, s.at), s.dur - Math.max(0, now - s.at), 0.05, 'david', out);
        turn(-0.06);
      } else if (now > start - BEAT) {
        voice(D3 * 2 * 2 ** (1 / 12) * (1 + Math.random() * 0.03), now, 0.3, 0.025, 'david', out);
        turn(0.12);
      }
    };
    catcher.addEventListener('pointerdown', press);
    addEventListener('keydown', press);
    let raf = 0;
    await new Promise(ok => {
      const frame = () => {
        if (signal.aborted) return ok();
        const now = a.currentTime;
        if (now > end + 0.5) return ok();
        const cur = syl.findIndex(s => now < s.at + s.dur);
        const next = syl[cur];
        if (next && next.line !== shown && now > next.at - BEAT * 1.5) show(next.line);
        for (const s of syl) if (!s.judged && now > s.at + WINDOW) { s.judged = true; s.el?.classList.add('missed'); turn(0.04); }
        for (const s of syl) if (s.el) s.el.classList.toggle('now', now >= s.at - 0.05 && now < s.at + s.dur);
        // the light: hops from the syllable before to the one coming, landing on it as it is sung
        const to = syl.find(s => s.at > now - 0.05 && s.line === shown), from = to && syl[syl.indexOf(to) - 1];
        if (to?.el) {
          const r1 = to.el.getBoundingClientRect(), box = words.getBoundingClientRect();
          const r0 = from?.el && from.line === to.line ? from.el.getBoundingClientRect() : { left: r1.left - 30, width: 0 };
          const span = from && from.line === to.line ? to.at - from.at : BEAT, k = Math.max(0, Math.min(1, 1 - (to.at - now) / span));
          const x0 = r0.left + r0.width / 2 - box.left, x1 = r1.left + r1.width / 2 - box.left;
          dot.style.transform = `translate(${x0 + (x1 - x0) * k}px, ${-Math.sin(Math.PI * k) * 16}px)`;
          dot.style.opacity = 1;
        } else dot.style.opacity = 0;
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      signal.addEventListener('abort', () => ok());
    });
    cancelAnimationFrame(raf);
    clearInterval(timer);
    removeEventListener('keydown', press);
    out.gain.setTargetAtTime(0, a.currentTime, 0.3);
    setTimeout(() => out.disconnect(), 1500);
    words.classList.add('gone'); catcher.remove();
    setTimeout(() => words.remove(), signal.aborted ? 0 : 1500);
    if (signal.aborted) { b.set('turned', 0, 2); return; }
    const share = sung / syl.length;
    return { sung: share, presses, turned: attention, hymn: presses <= 3 ? 'silent' : share >= 0.6 && attention < 0.5 ? 'loud' : 'lips' };
  },
};
