// Sounds of the game's own, made in the page (Web Audio): nothing to load. As loud as the site's "sounds" slider says
// (MooodVolume.output); the page runs the audio: it sounds once the browser lets it (the first touch), and waits with
// the play as the scene's music does — paused, its scene standing or being made ready —, fading out and back in.
//   house(level, seconds) — the house's air: wind round an old house (a recording, sounds/); one for the page, as loud as `level` (0 — silence), getting there over `seconds`
//   rain(level, seconds) — rain on stone and water (a recording); likewise. hush(seconds) — both fall silent
//   unheard() → {sounds, wake()} — the same, unheard, for a step played unseen (jump.js); a step plays them as g.sound
//   guitar({muffled}) → {note(pitch, {at, loud, bright}), strum(pitches, {at, loud, up, spread}),
//     loud(v, seconds), stop(seconds)} — plucked strings (Karplus–Strong); pitch 'D4', 'F#3' or a MIDI number; at —
//     seconds from now; muffled — heard through stone
//   melody({as, tempo, loud, muffled}) → {done, loud(v, seconds), stop(seconds)} — Madeline's song
//     (SONG): as 'guitar' (Roderick plays it, with its chords) or 'hum' (her voice, wavering); tempo —
//     1 as she sang it, 0.6 slower, 1.6 faster; muffled — through stone; done — once it has been
//     played; loud — as loud as v (0…1) of `loud`, getting there over `seconds`
//   knock(side, times) — on iron: 'here' — knuckles on the door; 'there' — the answer from behind
//     it, muffled; → its seconds
//   screw(tight) — a quarter turn of a screw into the coffin's wood: the squeak, higher and harder
//     as it tightens (tight 0…1)
//   ironDoor(close) — heavy hinges groaning; closing (true), the clang and the latch after
//   thunder(near) — a roll of thunder; near (0…1) — sooner, louder, with the crack overhead
//   crash() — the house going down: stone breaking, a long roar, the noise of a thousand waters; → its seconds
//   paper() — a sheet of paper unfolded or folded
//   scratch() → {loud(v, seconds), stop(seconds)} — nails scraping at wood and stone somewhere below,
//     through the stone: now a few strokes, now none; as loud as v (0…1; it starts silent)
//   splinter() · shriek() · clang() — the answers from below to «The Mad Trist», far down and
//     through the house: wood cracking and tearing; a long grating scream; a great brass shield falling
//     on stone, ringing; each → its seconds
//   step(heavy, miss) — a running footfall on the wet boards of the causeway; heavy (0…1) — dragging
//     others by the hand: duller, louder; miss — a foot that slips (a scrape)

// SONG — her song: eight bars in 3/4, F♯ minor (the world's key: A major and F♯ minor — the scenes' music and the
// language's sounds are on it), a lullaby; each bar its notes [pitch, beats] and the chord under it (lowest first)
export const SONG = [
  { notes: [['C#5', 2], ['F#5', 1]], chord: ['F#3', 'C#4', 'A4'] },
  { notes: [['E5', 1], ['D5', 1], ['C#5', 1]], chord: ['B2', 'F#3', 'D4'] },
  { notes: [['B4', 1.5], ['C#5', 0.5], ['A4', 1]], chord: ['F#3', 'C#4', 'A4'] },
  { notes: [['G#4', 3]], chord: ['C#3', 'G#3', 'F4'] },
  { notes: [['A4', 2], ['C#5', 1]], chord: ['A2', 'E3', 'C#4'] },
  { notes: [['B4', 1], ['A4', 1], ['G#4', 1]], chord: ['E3', 'B3', 'G#4'] },
  { notes: [['F#4', 1.5], ['G#4', 0.5], ['F4', 1]], chord: ['C#3', 'G#3', 'C#4'] },
  { notes: [['F#4', 3]], chord: ['F#3', 'C#4', 'F#4'] },
];
const BEAT = 0.78; // seconds a beat, as she sang it

let ctx = null, master = null, room = null;
function audio() {
  if (!ctx) {
    ctx = new AudioContext();
    const limit = ctx.createDynamicsCompressor();
    limit.threshold.value = -12;
    limit.ratio.value = 4;
    master = ctx.createGain();
    master.gain.value = 0.85;
    // (the site's "sounds" slider: MooodVolume.output — the sounds go to the speakers through it)
    master.connect(limit).connect(MooodVolume.output(ctx)).connect(ctx.destination);
    // the house: stone halls, a long dark tail
    room = ctx.createConvolver();
    const n = ctx.sampleRate * 3.4, ir = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0, lp = 0; i < n; i++) { lp += ((Math.random() * 2 - 1) - lp) * 0.35; d[i] = lp * Math.pow(1 - i / n, 3.2); }
    }
    room.buffer = ir;
    room.connect(master);
  }
  return ctx;
}

// where a sound goes: its loudness, and how much of it the stone halls carry
function bus(level = 1, wet = 0.3) {
  const a = audio(), out = a.createGain();
  out.gain.value = level;
  out.connect(master);
  if (wet) {
    const send = a.createGain();
    send.gain.value = wet;
    out.connect(send).connect(room);
  }
  return out;
}
function setup(f, { type, frequency, Q = 1, gain = 0 }) {
  f.type = type;
  f.frequency.value = frequency;
  f.Q.value = Q;
  f.gain.value = gain;
  return f;
}
// a value moved to v over `seconds` from where it is
function to(param, v, seconds) {
  const t = audio().currentTime;
  param.cancelScheduledValues(t);
  param.setValueAtTime(param.value, t);
  param.linearRampToValueAtTime(v, t + Math.max(0.02, seconds));
}
// an envelope: [[seconds from t, value], …], each reached in a straight line from the one before
function shape(param, t, points) {
  param.setValueAtTime(0, t);
  for (const [s, v] of points) param.linearRampToValueAtTime(v, t + s);
}
const noises = {};
function noise(kind) {
  if (noises[kind]) return noises[kind];
  const a = audio(), n = a.sampleRate * 4, buf = a.createBuffer(1, n, a.sampleRate), d = buf.getChannelData(0);
  let last = 0, b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < n; i++) {
    const w = Math.random() * 2 - 1;
    if (kind === 'brown') d[i] = (last = (last + 0.02 * w) / 1.02) * 3.5;
    else if (kind === 'pink') {
      b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0527;
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2;
    } else d[i] = w;
  }
  return (noises[kind] = buf);
}
// noise playing from t (for `seconds`, or for good)
function hiss(kind, t, seconds) {
  const s = audio().createBufferSource();
  s.buffer = noise(kind);
  s.loop = true;
  s.start(t, Math.random() * 3);
  if (seconds) s.stop(t + seconds);
  return s;
}
// a slow wandering of a value: a very slow oscillator added to it
function drift(param, rate, depth) {
  const a = audio(), o = a.createOscillator(), g = a.createGain();
  o.frequency.value = rate;
  g.gain.value = depth;
  o.connect(g).connect(param);
  o.start();
}
const midi = p => {
  if (typeof p === 'number') return p;
  const [, n, acc, oct] = /^([A-G])(#|b)?(-?\d)$/.exec(p);
  return 12 * (Number(oct) + 1) + { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[n] + (acc === '#' ? 1 : acc === 'b' ? -1 : 0);
};
const hz = m => 440 * 2 ** ((m - 69) / 12);

// friction: a train of clicks at a wandering rate through resonances — wood creaking, a hinge, a screw
function creak(t, dest, { rate, rise = 1.6, len, bands, loud }) {
  const a = audio(), o = a.createOscillator(), env = a.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(rate * (0.85 + Math.random() * 0.3), t);
  o.frequency.linearRampToValueAtTime(rate * rise * (0.9 + Math.random() * 0.3), t + len * 0.55);
  o.frequency.linearRampToValueAtTime(rate * (0.9 + Math.random() * 0.4), t + len);
  for (const [f, q] of bands) o.connect(setup(a.createBiquadFilter(), { type: 'bandpass', frequency: f, Q: q })).connect(env);
  shape(env.gain, t, [[len * 0.12, loud], [len * 0.5, loud * (0.6 + Math.random() * 0.5)], [len * 0.85, loud * 0.8], [len, 0]]);
  env.connect(dest);
  o.start(t);
  o.stop(t + len + 0.05);
}
// struck metal: its partials ringing down, [hz, seconds, loudness]
function ring(t, dest, partials) {
  const a = audio();
  for (const [f, d, v] of partials) {
    const o = a.createOscillator(), e = a.createGain();
    o.frequency.value = f * (1 + (Math.random() - 0.5) * 0.006);
    e.gain.setValueAtTime(0, t);
    e.gain.linearRampToValueAtTime(v, t + 0.004);
    e.gain.exponentialRampToValueAtTime(0.0005, t + d);
    o.connect(e).connect(dest);
    o.start(t);
    o.stop(t + d + 0.05);
  }
}
// a short burst of noise through a band: a click, a thud, a crumb of stone
function burst(t, dest, { kind = 'white', f, Q = 1, len, loud }) {
  const a = audio(), e = a.createGain();
  hiss(kind, t, len + 0.05).connect(setup(a.createBiquadFilter(), { type: 'bandpass', frequency: f, Q })).connect(e);
  e.gain.setValueAtTime(0, t);
  e.gain.linearRampToValueAtTime(loud, t + Math.min(0.006, len / 4));
  e.gain.exponentialRampToValueAtTime(0.0005, t + len);
  e.connect(dest);
}

// recordings (sounds/ — CC0, from Freesound: sounds/README.md): fetched and decoded once each, played round and round from a
// random point into a loop's bus, `gain` bringing it to as loud as the loop it took the place of
const recordings = {};
function recording(file) {
  return (recordings[file] ??= fetch(new URL(`sounds/${file}`, import.meta.url)).then(r => r.arrayBuffer()).then(b => audio().decodeAudioData(b)));
}
function recorded(file, gain) {
  return out => {
    const a = audio(), s = a.createBufferSource(), g = a.createGain();
    g.gain.value = gain;
    s.loop = true;
    s.connect(g).connect(out);
    recording(file).then(buf => { s.buffer = buf; s.start(a.currentTime, Math.random() * buf.duration); });
  };
}

// the loops: one of each for the page
const loops = {};
function loop(name, make, level, seconds) {
  if (!loops[name]) {
    if (!level) return;
    loops[name] = bus(0, 0.35);
    make(loops[name]);
  }
  to(loops[name].gain, level, seconds);
}
// wind in an old house: a recording
export function house(level = 1, seconds = 3) { loop('house', recorded('house-797666.mp3', 1.33), level, seconds); }
// rain: a recording
export function rain(level = 1, seconds = 3) { loop('rain', recorded('rain-water-859807.mp3', 2.88), level, seconds); }
export function hush(seconds = 2) {
  if (!ctx) return;
  for (const out of Object.values(loops)) to(out.gain, 0, seconds);
}

// a plucked string, `seconds` long: Karplus–Strong — a burst of noise going round a delay one period
// long, averaged each time round (the averaging adds half a sample: the delay is that much shorter)
function string(m, bright, seconds) {
  const a = audio(), sr = a.sampleRate, f = hz(m), D = sr / f - 0.5, N = Math.floor(D), frac = D - N;
  const t60 = Math.max(1.2, 3.2 - (m - 40) * 0.05);
  const rho = Math.pow(0.001, 1 / (f * t60));
  const len = Math.floor(sr * Math.min(seconds, t60 + 0.3)), buf = a.createBuffer(1, len, sr), y = buf.getChannelData(0);
  for (let i = 0, lp = 0; i < N + 2 && i < len; i++) y[i] = lp += ((Math.random() * 2 - 1) - lp) * (0.2 + 0.7 * bright);
  for (let n = N + 2; n < len; n++) {
    const x0 = y[n - N] * (1 - frac) + y[n - N - 1] * frac;
    const x1 = y[n - N - 1] * (1 - frac) + y[n - N - 2] * frac;
    y[n] = rho * 0.5 * (x0 + x1);
  }
  for (let i = 0, k = Math.min(len, sr * 0.05); i < k; i++) y[len - 1 - i] *= i / k;
  return buf;
}
export function guitar({ muffled = false } = {}) {
  const a = audio(), base = muffled ? 0.55 : 0.8, out = bus(base, muffled ? 0.7 : 0.3);
  // the body: its warm hollow, its brightness — or the stone between
  const body = setup(a.createBiquadFilter(), { type: 'peaking', frequency: 190, Q: 1.1, gain: 5 });
  body.connect(setup(a.createBiquadFilter(), { type: 'lowpass', frequency: muffled ? 340 : 4800, Q: 0.6 })).connect(out);
  const sounding = new Set();
  return {
    note(pitch, { at = 0, loud = 0.7, bright = 0.5 } = {}) {
      const s = a.createBufferSource(), e = a.createGain();
      s.buffer = string(midi(pitch), bright, 4);
      e.gain.value = loud;
      s.connect(e).connect(body);
      s.start(a.currentTime + at);
      sounding.add(s);
      s.onended = () => sounding.delete(s);
    },
    strum(pitches, { at = 0, loud = 0.5, up = false, spread = 0.03 } = {}) {
      (up ? [...pitches].reverse() : pitches).forEach((p, i) => this.note(p, { at: at + i * spread, loud: loud * (0.8 + Math.random() * 0.35), bright: 0.35 }));
    },
    loud(v, seconds = 0.3) {
      to(out.gain, base * v, seconds);
    },
    stop(seconds = 0.6) {
      to(out.gain, 0, seconds);
      setTimeout(() => { for (const s of sounding) s.stop(); out.disconnect(); }, seconds * 1000 + 60);
    },
  };
}

// her voice humming, mouth closed: a soft buzz through the throat's low formant, a slow vibrato, a
// pitch that does not quite hold; gliding from note to note
function hummer(dest, muffled) {
  const a = audio(), t = a.currentTime;
  const tone = a.createOscillator(), buzz = a.createOscillator(), mix = a.createGain(), env = a.createGain();
  tone.type = 'triangle';
  buzz.type = 'sawtooth';
  const buzzAmp = a.createGain();
  buzzAmp.gain.value = 0.18;
  tone.connect(mix);
  buzz.connect(buzzAmp).connect(mix);
  const vib = a.createOscillator(), vibAmp = a.createGain();
  vib.frequency.value = 5.1;
  vibAmp.gain.value = 0;
  vib.connect(vibAmp);
  vibAmp.connect(tone.detune);
  vibAmp.connect(buzz.detune);
  const waver = a.createOscillator(), waverAmp = a.createGain();
  waver.frequency.value = 0.23;
  waverAmp.gain.value = muffled ? 30 : 14;
  waver.connect(waverAmp);
  waverAmp.connect(tone.detune);
  waverAmp.connect(buzz.detune);
  mix.connect(setup(a.createBiquadFilter(), { type: 'peaking', frequency: 280, Q: 1.4, gain: 5 }))
    .connect(setup(a.createBiquadFilter(), { type: 'lowpass', frequency: muffled ? 300 : 1500, Q: 0.7 })).connect(env).connect(dest);
  // breath
  const breath = a.createGain();
  breath.gain.value = 0;
  const air = hiss('white', t);
  air.connect(setup(a.createBiquadFilter(), { type: 'bandpass', frequency: 1600, Q: 0.8 })).connect(breath).connect(dest);
  env.gain.value = 0;
  for (const o of [tone, buzz, vib, waver]) o.start(t);
  return {
    // a note from `at` for `len` seconds, at loudness v; `join` — glides from the one before
    sing(m, at, len, v, join) {
      const f = hz(m);
      for (const o of [tone, buzz]) {
        if (join) o.frequency.setTargetAtTime(f, at, 0.035);
        else o.frequency.setValueAtTime(f, at);
      }
      if (!join) {
        env.gain.setTargetAtTime(v, at, 0.06);
        breath.gain.setTargetAtTime(0.012, at - 0.12, 0.05);
        breath.gain.setTargetAtTime(0.003, at + 0.1, 0.1);
      } else env.gain.setTargetAtTime(v, at, 0.1);
      vibAmp.gain.setTargetAtTime(0, at, 0.02);
      vibAmp.gain.setTargetAtTime(16, at + Math.min(0.35, len * 0.4), 0.25);
    },
    rest(at) { env.gain.setTargetAtTime(0, at, 0.12); },
    end(at) {
      env.gain.setTargetAtTime(0, at, 0.15);
      for (const o of [tone, buzz, vib, waver, air]) o.stop(at + 1.2);
    },
  };
}

export function melody({ as = 'guitar', tempo = 1, loud = 0.8, muffled = false } = {}) {
  const a = audio(), beat = BEAT / tempo, t0 = a.currentTime + 0.15;
  let stopped = false, finish;
  const done = new Promise(ok => { finish = ok; });
  const total = SONG.reduce((s, bar) => s + bar.notes.reduce((n, [, b]) => n + b, 0), 0) * beat;
  let player, out;
  if (as === 'guitar') {
    player = guitar({ muffled });
    let at = 0;
    for (const bar of SONG) {
      // the bass on the one, the chord rocking on two and three; the tune over them
      player.note(bar.chord[0], { at: at + 0.15, loud: 0.45 * loud, bright: 0.25 });
      player.strum(bar.chord.slice(1), { at: at + 0.15 + beat, loud: 0.2 * loud, spread: 0.04 });
      player.strum(bar.chord.slice(1), { at: at + 0.15 + 2 * beat, loud: 0.17 * loud, spread: 0.04, up: true });
      let n = at;
      for (const [p, b] of bar.notes) {
        player.note(p, { at: n + 0.15 + 0.012, loud: 0.75 * loud, bright: 0.6 });
        n += b * beat;
      }
      at = n;
    }
  } else {
    out = bus(loud * (muffled ? 0.5 : 0.7), muffled ? 0.8 : 0.35);
    out.base = out.gain.value;
    player = hummer(out, muffled);
    let at = t0;
    SONG.forEach((bar, i) => {
      bar.notes.forEach(([p, b], j) => {
        const first = j === 0, phrase = i === 0 || i === 4; // she breathes before each half
        player.sing(midi(p), at, b * beat, (first ? 0.2 : 0.17) * (0.9 + Math.random() * 0.2), !(first && phrase));
        at += b * beat;
      });
      if (i === 3) player.rest(at - 0.22);
    });
    player.end(at);
  }
  const timer = setTimeout(() => finish(), (total + 1.5) * 1000);
  return {
    done,
    loud(v, seconds = 0.3) {
      if (stopped) return;
      if (as === 'guitar') player.loud(v, seconds);
      else to(out.gain, out.base * v, seconds);
    },
    stop(seconds = 1) {
      if (stopped) return;
      stopped = true;
      clearTimeout(timer);
      if (as === 'guitar') player.stop(seconds);
      else to(out.gain, 0, seconds);
      setTimeout(finish, seconds * 1000);
    },
  };
}

export function knock(side = 'here', times = 3) {
  const a = audio(), there = side === 'there';
  const out = bus(there ? 0.5 : 0.75, there ? 0.7 : 0.35);
  const dest = there ? setup(a.createBiquadFilter(), { type: 'lowpass', frequency: 260, Q: 0.7 }) : out;
  if (there) dest.connect(out);
  let t = a.currentTime + 0.05;
  for (let i = 0; i < times; i++) {
    const k = there ? 0.6 + Math.random() * 0.4 : 0.85 + Math.random() * 0.15; // from there, weaker, uneven
    burst(t, dest, { f: there ? 300 : 1400, Q: 0.9, len: 0.03, loud: 0.5 * k });
    ring(t, dest, there ? [[74, 0.7, 0.3 * k], [151, 0.45, 0.18 * k], [233, 0.3, 0.08 * k]]
      : [[118, 0.9, 0.22 * k], [263, 0.6, 0.15 * k], [412, 0.45, 0.1 * k], [690, 0.3, 0.06 * k], [1033, 0.2, 0.04 * k]]);
    t += (there ? 0.6 + Math.random() * 0.35 : 0.5) + (i === times - 2 ? 0.1 : 0);
  }
  return t - a.currentTime + 0.6;
}

export function screw(tight = 0) {
  const a = audio(), t = a.currentTime + 0.02, out = bus(0.6, 0.3);
  creak(t, out, { rate: 140 + 320 * tight, rise: 1.25, len: 0.32 + 0.12 * tight, loud: 0.25 + 0.2 * tight, bands: [[1900 + 900 * tight, 7], [3300, 5]] });
  burst(t + 0.04, out, { f: 900, Q: 1.2, len: 0.2, loud: 0.07 + 0.08 * tight }); // the wood's fibres
  ring(t + 0.36 + 0.12 * tight, out, [[3100 + 400 * tight, 0.05, 0.03 + 0.05 * tight]]); // the head settling
}

export function ironDoor(close = true) {
  const a = audio(), t = a.currentTime + 0.05, out = bus(0.8, 0.55);
  creak(t, out, { rate: 22, rise: 2, len: 2.4, loud: 0.5, bands: [[280, 5], [650, 6], [1300, 4]] });
  if (!close) return;
  const shut = t + 2.35;
  burst(shut, out, { kind: 'brown', f: 120, Q: 0.7, len: 0.6, loud: 1.2 });
  ring(shut, out, [[52, 2.6, 0.35], [87, 2.1, 0.28], [131, 1.6, 0.2], [197, 1.2, 0.14], [263, 0.9, 0.1], [371, 0.6, 0.06]]);
  burst(shut + 0.45, out, { f: 2600, Q: 2, len: 0.04, loud: 0.25 }); // the latch
  ring(shut + 0.45, out, [[1800, 0.09, 0.05]]);
}

export function thunder(near = 0.5) {
  const a = audio(), out = bus(0.5 + 0.5 * near, 0.4);
  const t = a.currentTime + 0.05 + (1 - near) * 2.4;
  if (near > 0.5) {
    const crack = a.createGain();
    hiss('white', t, 0.6).connect(setup(a.createBiquadFilter(), { type: 'highpass', frequency: 700 })).connect(crack).connect(out);
    shape(crack.gain, t, [[0.01, 0.6 * near], [0.08, 0.3 * near], [0.5, 0]]);
  }
  const len = 5 + 3.5 * (1 - near), roll = a.createGain(), mid = a.createGain();
  hiss('brown', t, len + 0.2).connect(setup(a.createBiquadFilter(), { type: 'lowpass', frequency: 170 + 120 * near })).connect(roll).connect(out);
  hiss('pink', t, len + 0.2).connect(setup(a.createBiquadFilter(), { type: 'bandpass', frequency: 380, Q: 0.7 })).connect(mid).connect(out);
  // it rolls: a few swells, each weaker
  const swells = [[0.25, 1]];
  for (let s = 0.9, v = 0.8; s < len - 1; s += 0.6 + Math.random() * 1.1, v *= 0.82) swells.push([s, v * (0.6 + Math.random() * 0.5)]);
  swells.push([len, 0]);
  shape(roll.gain, t, swells.map(([s, v]) => [s, v * 1.2]));
  shape(mid.gain, t, swells.map(([s, v]) => [s, v * 0.25 * near]));
}

export function crash() {
  const a = audio(), t = a.currentTime + 0.05, out = bus(1, 0.45), LEN = 16;
  // the first crack: the wall giving way
  const crack = a.createGain();
  hiss('white', t, 0.8).connect(setup(a.createBiquadFilter(), { type: 'highpass', frequency: 500 })).connect(crack).connect(out);
  shape(crack.gain, t, [[0.01, 0.7], [0.12, 0.35], [0.7, 0]]);
  // the long roar of it under everything
  const roar = a.createGain();
  hiss('brown', t, LEN).connect(setup(a.createBiquadFilter(), { type: 'lowpass', frequency: 110 })).connect(roar).connect(out);
  shape(roar.gain, t, [[3, 1.1], [9, 1], [LEN, 0]]);
  // stone breaking, here and there
  for (let s = 0.4; s < 9.5; s += 0.15 + Math.random() * 0.5)
    burst(t + s, out, { f: 500 + Math.random() * 2200, Q: 1.4, len: 0.05 + Math.random() * 0.3, loud: 0.15 + Math.random() * 0.45 });
  // and the water closing over it: «like the voice of a thousand waters»
  const waters = a.createGain(), spray = a.createGain();
  hiss('pink', t, LEN).connect(setup(a.createBiquadFilter(), { type: 'bandpass', frequency: 700, Q: 0.5 }))
    .connect(setup(a.createBiquadFilter(), { type: 'lowpass', frequency: 3000 })).connect(waters).connect(out);
  shape(waters.gain, t, [[3, 0], [8, 0.8], [11, 0.75], [LEN, 0]]);
  hiss('white', t, LEN).connect(setup(a.createBiquadFilter(), { type: 'highpass', frequency: 2500 })).connect(spray).connect(out);
  shape(spray.gain, t, [[4, 0], [8, 0.08], [12, 0.05], [LEN, 0]]);
  return LEN;
}

export function paper() {
  const a = audio(), t = a.currentTime + 0.01, out = bus(0.35, 0.1), e = a.createGain(), len = 0.4 + Math.random() * 0.2;
  hiss('white', t, len + 0.1).connect(setup(a.createBiquadFilter(), { type: 'bandpass', frequency: 3200, Q: 0.7 }))
    .connect(setup(a.createBiquadFilter(), { type: 'highpass', frequency: 1300 })).connect(e).connect(out);
  // crinkles: short catches in a soft slide
  e.gain.setValueAtTime(0, t);
  for (let s = 0; s < len; s += 0.03 + Math.random() * 0.06) {
    e.gain.linearRampToValueAtTime(0.25 + Math.random() * 0.6, t + s + 0.008);
    e.gain.linearRampToValueAtTime(0.12, t + s + 0.025);
  }
  e.gain.linearRampToValueAtTime(0, t + len);
}

export function step(heavy = 0, miss = false) {
  const a = audio(), t = a.currentTime + 0.01, out = bus(0.55 + 0.25 * heavy, 0.2);
  burst(t, out, { kind: 'brown', f: 110 - 30 * heavy, Q: 0.8, len: 0.14 + 0.06 * heavy, loud: 1.1 + 0.5 * heavy }); // the weight landing
  burst(t + 0.005, out, { f: 520 + Math.random() * 160, Q: 2.2, len: 0.05, loud: 0.22 }); // the board
  burst(t + 0.02, out, { f: 2600 + Math.random() * 900, Q: 0.8, len: 0.09, loud: 0.05 + 0.04 * Math.random() }); // the wet
  if (miss) creak(t + 0.03, out, { rate: 60, rise: 0.7, len: 0.22, loud: 0.12, bands: [[900, 3], [2100, 4]] });
}

export function scratch() {
  const a = audio(), out = bus(0, 0.75), stone = setup(a.createBiquadFilter(), { type: 'lowpass', frequency: 650, Q: 0.7 });
  stone.connect(out);
  // a stroke: the nails dragged a hand's length, catching; strokes come in twos and threes, then a rest
  let next = a.currentTime + 0.3;
  const timer = setInterval(() => {
    for (; next < a.currentTime + 0.4; ) {
      const strokes = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < strokes; i++) {
        const len = 0.25 + Math.random() * 0.35;
        creak(next, stone, { rate: 70 + Math.random() * 60, rise: 1.3, len, loud: 0.5 + Math.random() * 0.3, bands: [[420 + Math.random() * 200, 3], [900, 4]] });
        burst(next, stone, { f: 500 + Math.random() * 300, Q: 1.5, len, loud: 0.25 });
        next += len + 0.08 + Math.random() * 0.2;
      }
      next += 0.8 + Math.random() * 2.4;
    }
  }, 200);
  return {
    loud(v, seconds = 0.3) {
      to(out.gain, 0.7 * v, seconds);
    },
    stop(seconds = 1) {
      to(out.gain, 0, seconds);
      setTimeout(() => { clearInterval(timer); out.disconnect(); }, seconds * 1000 + 60);
    },
  };
}

// far below, through the house: low-passed, the halls ringing with it
const below = (level, f = 1800) => {
  const a = audio(), out = bus(level, 0.8), far = setup(a.createBiquadFilter(), { type: 'lowpass', frequency: f, Q: 0.6 });
  far.connect(out);
  return { a, t: a.currentTime + 0.05, far };
};
export function splinter() {
  const { t, far } = below(0.9);
  burst(t, far, { kind: 'brown', f: 90, Q: 0.7, len: 0.5, loud: 1.2 }); // the blow
  // the wood giving: a crackle of fibres tearing, quickening, then the long rip
  for (let s = 0.04, k = 1; s < 1.3; s += 0.03 + Math.random() * 0.12 * k, k *= 0.93)
    burst(t + s, far, { f: 700 + Math.random() * 1600, Q: 2, len: 0.02 + Math.random() * 0.05, loud: 0.3 + Math.random() * 0.5 });
  creak(t + 0.5, far, { rate: 35, rise: 2.2, len: 1.1, loud: 0.45, bands: [[380, 4], [900, 5], [1500, 3]] });
  burst(t + 1.55, far, { kind: 'brown', f: 140, Q: 0.8, len: 0.4, loud: 0.7 }); // a board falling
  return 2.4;
}
export function shriek() {
  const { a, t, far } = below(0.7, 2600), o = a.createOscillator(), o2 = a.createOscillator(), env = a.createGain(), LEN = 3.2;
  // a voice that is not quite a voice: a high grating cry, its pitch sliding and catching
  o.type = 'sawtooth';
  o2.type = 'square';
  o.frequency.setValueAtTime(620, t);
  o.frequency.linearRampToValueAtTime(940, t + 0.5);
  o.frequency.linearRampToValueAtTime(860, t + 1.6);
  o.frequency.linearRampToValueAtTime(1010, t + 2.2);
  o.frequency.exponentialRampToValueAtTime(420, t + LEN);
  o2.frequency.value = 37; // the grating: the voice chopped
  const chop = a.createGain();
  chop.gain.value = 0.5;
  const depth = a.createGain();
  depth.gain.value = 0.5;
  o2.connect(depth).connect(chop.gain);
  drift(o.frequency, 6.5, 18);
  o.connect(chop);
  for (const [f, q, v] of [[900, 6, 1], [1700, 8, 0.6], [2600, 9, 0.35]]) {
    const g = a.createGain();
    g.gain.value = v;
    chop.connect(setup(a.createBiquadFilter(), { type: 'bandpass', frequency: f, Q: q })).connect(g).connect(env);
  }
  env.connect(far);
  shape(env.gain, t, [[0.25, 0.5], [1.2, 0.42], [2.2, 0.55], [LEN, 0]]);
  o.start(t);
  o2.start(t);
  o.stop(t + LEN + 0.1);
  o2.stop(t + LEN + 0.1);
  hiss('pink', t, LEN).connect(setup(a.createBiquadFilter(), { type: 'bandpass', frequency: 1200, Q: 1.2 })).connect(env);
  return LEN + 1;
}
export function clang() {
  const { t, far } = below(0.9, 3200);
  burst(t, far, { kind: 'brown', f: 160, Q: 0.7, len: 0.35, loud: 1 }); // the fall
  // brass: inharmonic partials ringing down, beating against each other
  ring(t, far, [[211, 4.5, 0.3], [214, 4.2, 0.22], [347, 3.6, 0.22], [588, 3, 0.18], [593, 2.8, 0.12], [861, 2.2, 0.12], [1209, 1.6, 0.08], [1622, 1.1, 0.05]]);
  ring(t + 0.42, far, [[211, 2.5, 0.12], [588, 1.6, 0.07], [1209, 0.8, 0.03]]); // a bounce
  return 5;
}

// the sounds of a step played unseen (a jump: jump.js): nothing heard meanwhile — what lasts (the house, the rain)
// heard from then on as loud as it was left; a song begun meanwhile not heard (it is over by then, or it was stopped)
export function unheard() {
  const levels = {}, none = () => {};
  return {
    sounds: {
      house(level = 1) { levels.house = level; },
      rain(level = 1) { levels.rain = level; },
      melody: () => ({ done: Promise.resolve(), loud: none, stop: none }),
      guitar: () => ({ note: none, strum: none, loud: none, stop: none }),
      hush() { for (const k in levels) levels[k] = 0; },
      knock: none, screw: none, ironDoor: none, thunder: none, crash: none, paper: none, step: none, scratch: none,
      splinter: none, shriek: none, clang: none,
    },
    wake() { for (const [k, level] of Object.entries(levels)) ({ house, rain })[k](level, 1); },
  };
}
