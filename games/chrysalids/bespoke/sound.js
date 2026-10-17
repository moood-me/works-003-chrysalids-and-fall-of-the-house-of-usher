// Sounds of the game's own, made in the page (Web Audio): nothing to load. A step plays them as g.sound (story.js).
let ctx = null, held = false;
// (the site's "sounds" slider: MooodVolume.output — what this page makes goes to the speakers through it)
let sink = null;
const audio = () => {
  if (!ctx) { ctx = new AudioContext(); sink = MooodVolume.output(ctx); sink.connect(ctx.destination); }
  if (!held && ctx.state === 'suspended') ctx.resume();
  return ctx;
};
// the play paused (ui.js ⏸): the game's own sounds stand with it — their audio's clock is not the page's
export function pause(on) {
  held = !!on;
  if (!ctx) return;
  if (held) ctx.suspend();
  else ctx.resume();
}

// a horse somewhere, galloping (dull thuds in threes) or at a walk (four slow falls): loud(v, seconds) — nearer or
// farther; gait('walk' | 'gallop') — it changes its pace; halt(seconds) — reined in: a few slower steps, then still
// (it stays: loud again it is there, standing, till a gait is given again); stop(seconds) — it goes
export function hooves({ gait = 'gallop' } = {}) {
  const a = audio(), out = a.createGain();
  out.gain.value = 0;
  out.connect(sink);
  const noise = a.createBuffer(1, a.sampleRate * 0.2, a.sampleRate), d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (a.sampleRate * 0.03));
  const thud = (t, v) => {
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = noise; f.type = 'lowpass'; f.frequency.value = 220 + Math.random() * 60;
    g.gain.value = v;
    s.connect(f).connect(g).connect(out);
    s.start(t);
  };
  // a stride of each gait: its falls (seconds into it, how hard) and its length
  const GAITS = {
    gallop: { stride: 0.58, falls: [[0, 0.9], [0.11, 0.7], [0.2, 1]] },
    walk: { stride: 1.15, falls: [[0, 0.55], [0.29, 0.45], [0.57, 0.55], [0.86, 0.45]] },
  };
  let now = GAITS[gait] ?? GAITS.gallop, slowing = 0, still = false;
  let next = a.currentTime + 0.05;
  const timer = setInterval(() => {
    while (!still && next < a.currentTime + 0.3) {
      const k = 1 + slowing * 0.35;
      for (const [at, v] of now.falls) thud(next + at * k, v * (1 - slowing * 0.25));
      next += now.stride * k * (0.96 + Math.random() * 0.08);
      if (slowing) { slowing++; if (slowing > 3) still = true; }
    }
  }, 100);
  return {
    loud(v, seconds = 0) {
      const t = a.currentTime;
      out.gain.cancelScheduledValues(t);
      out.gain.setValueAtTime(out.gain.value, t);
      out.gain.linearRampToValueAtTime(v, t + Math.max(0.01, seconds));
    },
    gait(name) { now = GAITS[name] ?? now; slowing = 0; if (still) { still = false; next = a.currentTime + 0.05; } },
    halt() { if (!still) slowing = 1; },
    stop(seconds = 2) {
      this.loud(0, seconds);
      setTimeout(() => { clearInterval(timer); out.disconnect(); }, seconds * 1000 + 100);
    },
  };
}

// the bell of Waknuk, far away: rung `times` times
export function toll(times = 3) {
  const a = audio(), out = a.createBiquadFilter(), g = a.createGain();
  out.type = 'lowpass'; out.frequency.value = 900;
  g.gain.value = 0.22;
  out.connect(g).connect(sink);
  for (let i = 0; i < times; i++) {
    const t = a.currentTime + 0.1 + i * 2.2;
    for (const [f, v, d] of [[98, 0.5, 6], [196, 0.7, 4.5], [233, 0.35, 3], [294, 0.3, 2.6], [392, 0.2, 2], [523, 0.1, 1.4]]) {
      const o = a.createOscillator(), e = a.createGain();
      o.frequency.value = f * (1 + (Math.random() - 0.5) * 0.004);
      e.gain.setValueAtTime(0, t);
      e.gain.linearRampToValueAtTime(v, t + 0.01);
      e.gain.exponentialRampToValueAtTime(0.001, t + d);
      o.connect(e).connect(out);
      o.start(t); o.stop(t + d);
    }
  }
}

// the community's hymn (Сожжение поля, «Петь со всеми»): low voices a little apart — the crowd; David an octave up
//   now() — its clock (s); voice(f, at, dur, vol, 'crowd' | 'david') — a syllable sung; stop() — it fades
export function choir() {
  const a = audio(), out = a.createGain(), lp = a.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = 850;
  out.gain.value = 0.9;
  lp.connect(out).connect(sink);
  return {
    now: () => a.currentTime,
    voice(f, at, dur, vol, kind) {
      const e = a.createGain();
      e.gain.setValueAtTime(0, at);
      e.gain.linearRampToValueAtTime(vol, at + 0.12);
      e.gain.setValueAtTime(vol * 0.8, at + dur * 0.85);
      e.gain.linearRampToValueAtTime(0, at + dur + 0.1);
      e.connect(kind === 'crowd' ? lp : out);
      for (const [k, cents] of kind === 'crowd' ? [[1, -7], [1, 6], [0.5, 0]] : [[1, 0]]) {
        const o = a.createOscillator();
        o.type = kind === 'crowd' ? 'sawtooth' : 'triangle';
        o.frequency.value = f * k; o.detune.value = cents;
        o.connect(e); o.start(at); o.stop(at + dur + 0.15);
      }
    },
    stop() {
      out.gain.setTargetAtTime(0, a.currentTime, 0.3);
      setTimeout(() => out.disconnect(), 1500);
    },
  };
}

// the sounds of a step played unseen (a jump: jump.js): nothing heard meanwhile — the bell not rung; a horse still
// there when it is seen, heard from then as near as it was left, at the gait it was left at
export function unheard() {
  const horses = [];
  return {
    sounds: {
      toll() {},
      choir() { return { now: () => performance.now() / 1000, voice() {}, stop() {} }; },
      hooves(opts) {
        let level = 0, real = null, stopped = false, gait = opts?.gait, halted = false;
        const h = {
          loud(v) { if (real) real.loud(...arguments); else level = v; },
          gait(name) { if (real) real.gait(name); else { gait = name; halted = false; } },
          halt() { if (real) real.halt(); else halted = true; },
          stop(seconds) { if (real) real.stop(seconds); else stopped = true; },
          wake() { if (!stopped && !halted && level > 0) { real = hooves({ gait }); real.loud(level, 1); } },
        };
        horses.push(h);
        return h;
      },
    },
    wake() { for (const h of horses) h.wake(); },
  };
}
