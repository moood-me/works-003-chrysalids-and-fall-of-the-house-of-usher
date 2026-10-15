// Sounds of the game's own, made in the page (Web Audio): nothing to load. A step plays them as g.sound (story.js).
let ctx = null;
// (the site's "sounds" slider: MooodVolume.output — what this page makes goes to the speakers through it)
let sink = null;
const audio = () => { if (!ctx) { ctx = new AudioContext(); sink = MooodVolume.output(ctx); sink.connect(ctx.destination); } if (ctx.state === 'suspended') ctx.resume(); return ctx; };

// a horse galloping somewhere: dull thuds in threes; loud(v, seconds) — nearer or farther; stop()
export function hooves() {
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
  let next = a.currentTime + 0.05;
  const STRIDE = 0.58;
  const timer = setInterval(() => {
    while (next < a.currentTime + 0.3) {
      thud(next, 0.9); thud(next + 0.11, 0.7); thud(next + 0.2, 1);
      next += STRIDE * (0.96 + Math.random() * 0.08);
    }
  }, 100);
  return {
    loud(v, seconds = 0) {
      const t = a.currentTime;
      out.gain.cancelScheduledValues(t);
      out.gain.setValueAtTime(out.gain.value, t);
      out.gain.linearRampToValueAtTime(v, t + Math.max(0.01, seconds));
    },
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

// the sounds of a step played unseen (a jump: jump.js): nothing heard meanwhile — the bell not rung; a horse still
// galloping when it is seen, heard from then as near as it was left
export function unheard() {
  const horses = [];
  return {
    sounds: {
      toll() {},
      hooves() {
        let level = 0, real = null, stopped = false;
        const h = {
          loud(v) { if (real) real.loud(...arguments); else level = v; },
          stop(seconds) { if (real) real.stop(seconds); else stopped = true; },
          wake() { if (!stopped && level > 0) { real = hooves(); real.loud(level, 1); } },
        };
        horses.push(h);
        return h;
      },
    },
    wake() { for (const h of horses) h.wake(); },
  };
}
