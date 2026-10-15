// What the small games of chapters III–IV share: a veil over the scene (in b.layer, under the
// game's own corner tools) that takes the pointer; soft lights on it, moved every frame; a few quiet
// sounds of the page's own (Web Audio). All of it goes when the game ends or is skipped (signal).
//   const v = veil(b, signal) — v.light(cls) → an element, v.put(el, x, y, scale, opacity);
//   v.on(type, fn, target) — a listener, taken off at the end; v.loop(fn(dt, t)) — every frame;
//   v.tone(freq, at, dur, vol) — a soft note; v.noise(filter, freq, q) → a gain node (a hiss),
//   v.to(gain, value) — faded there; v.audio — the AudioContext; v.end() — all gone (by itself on abort)
//   playing(signal, skipped, start(done)) — a minigame's run as a promise
let styled = null;
let ctx = null;
// (the site's "sounds" slider: MooodVolume.output — what this page makes goes to the speakers through it)
let sink = null;
const audio = () => { if (!ctx) { ctx = new AudioContext(); sink = MooodVolume.output(ctx); sink.connect(ctx.destination); } if (ctx.state === 'suspended') ctx.resume(); return ctx; };

export function veil(b, signal) {
  styled ||= b.css('minigames/veil.css').catch(e => b.trouble(e.message));
  const el = document.createElement('div');
  el.className = 'veil';
  b.layer.prepend(el);
  const a = audio(), out = a.createGain();
  out.gain.value = 1;
  out.connect(sink);
  const offs = [];
  let raf = 0, alive = true;
  const v = {
    el, audio: a, sink,
    get alive() { return alive && !signal.aborted; },
    light(cls = '') {
      const d = document.createElement('div');
      d.className = `veil-light ${cls}`;
      el.append(d);
      return d;
    },
    put(d, x, y, s = 1, o = 1) {
      d.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) scale(${s.toFixed(3)})`;
      d.style.opacity = o.toFixed(3);
    },
    on(type, fn, target = el) { target.addEventListener(type, fn); offs.push(() => target.removeEventListener(type, fn)); },
    loop(fn) {
      let last = performance.now();
      const step = now => {
        if (!v.alive) return;
        fn(Math.min(0.5, Math.max(0, now - last) / 1000), now / 1000);
        last = now;
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    },
    tone(freq, at = 0, dur = 0.8, vol = 0.12) {
      const t = a.currentTime + at, o = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain();
      o.type = 'sine'; o2.type = 'triangle';
      o.frequency.value = freq; o2.frequency.value = freq * 2;
      const g2 = a.createGain(); g2.gain.value = 0.15;
      o.connect(g); o2.connect(g2).connect(g); g.connect(out);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
      o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
    },
    noise(type = 'bandpass', freq = 700, q = 0.7) {
      const buf = a.createBuffer(1, a.sampleRate * 2, a.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
      s.buffer = buf; s.loop = true;
      f.type = type; f.frequency.value = freq; f.Q.value = q;
      g.gain.value = 0;
      s.connect(f).connect(g).connect(out);
      s.start();
      offs.push(() => setTimeout(() => s.stop(), 900));
      return g;
    },
    to(gain, value, k = 0.08) { gain.gain.setTargetAtTime(value, a.currentTime, k); },
    end() {
      if (!alive) return;
      alive = false;
      cancelAnimationFrame(raf);
      for (const off of offs) off();
      out.gain.setTargetAtTime(0, a.currentTime, 0.25);
      setTimeout(() => out.disconnect(), 1500);
      el.classList.add('gone');
      setTimeout(() => el.remove(), 1200);
    },
  };
  signal.addEventListener('abort', () => v.end(), { once: true });
  return v;
}

// a minigame's run as a promise: done(result) ends it; on abort it ends with `skipped`
export const playing = (signal, skipped, start) => new Promise(ok => {
  signal.addEventListener('abort', () => ok(skipped), { once: true });
  start(ok);
});
export const clamp = (x, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));
// where a point of a scene's sky is on the screen: x, y in stage heights from the 16:9 stage's top
// left, as the engine lays the sky in its frame (engine.js frameBox, view) — the picture camera; H:
// the stage's height in px
export function sky(x, y) {
  const c = document.getElementById('scene'), r = c?.getBoundingClientRect() || { left: 0, top: 0 };
  const cw = c?.clientWidth || innerWidth, ch = c?.clientHeight || innerHeight, a = clamp(cw / ch, 4 / 3, 21 / 9), w = Math.min(cw, ch * a), H = w / a;
  return { x: r.left + (cw - w) / 2 + (w - 16 / 9 * H) / 2 + x * H, y: r.top + (ch - H) / 2 + y * H, H };
}
