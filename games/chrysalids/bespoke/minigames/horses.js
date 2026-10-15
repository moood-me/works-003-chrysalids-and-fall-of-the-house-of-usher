// «Тише, кони» (V, «Бегство»): over the ridge's shoulder, in the fog of the hollow, the horses stand —
// only their heads and our shoulders above the crest line; on the crest the search, two riders, the
// first one holding his lantern out over the fog, its light going from place to place. The horses
// fret: a head comes up, tosses, and at the end of it a horse snorts or neighs. A hand on its neck,
// held still, quiets it (one at a time — the others fret meanwhile); a hand that moves fast frightens
// it more. Fretting in the light, a head is glimpsed; every snort turns the lantern our way. Too much,
// and the first rider sees us. The riders' patience is the game's length.
//   opts: { start: the pursuit's strength (0.1…0.45: how wary the riders are already), sheba: Sheba is
//   with us (the most restless of all, and nearest the crest), petra: Petra cannot keep still (she
//   comes up to look, as a horse tosses), horse: the hooves (sound.js) }
//   → { seen: true | false }
// Where things are: the scene's hollow as the beat 'hollow' leaves it (the great-horse at gx 11.3, the
// pack horse 4.7 behind it, Sheba on her rope 3.2 behind that, highest up the bank; the hill's anchor at across 0 — its
// screen place and a metre in px from b.where('hill')); the heads in metres from that anchor, y up −.
import { veil, playing, clamp } from './veil.js';

let styled = null;
const T = 30; // s: how long they look
const CALM = 0.34, SPOOK = 0.3, FAST = 1.1; // a still hand quiets so much a second; a hand faster than FAST m/s frightens
const LAMP = [3.8, 13.6]; // where the lantern's light goes over the fog (m)
const ALL = {
  great: { at: [13.4, -1.5], key: 'great_toss', rate: 0.03 },
  pack: { at: [8.8, -1.7], key: 'pack_toss', rate: 0.04 },
  sheba: { at: [4.7, -1.75], key: 'sheba_toss', rate: 0.075 },
  petra: { at: [11.1, -1.35], key: 'petra_peek', rate: 0.045, child: true },
};

export default {
  title: 'Тише, кони', // (as the author's ☰ lists it)
  skipped: { seen: false },
  run: (g, b, { start = 0.25, sheba = false, petra = false, horse } = {}, signal) => playing(signal, { seen: false }, done => {
    styled ||= b.css('minigames/horses.css').catch(e => b.trouble(e.message));
    const v = veil(b, signal);
    // the hill's anchor on the screen and a metre there in px: metres → the screen
    const view = () => {
      const o = b.where('hill'), o1 = b.where('hill', 1);
      const m = o && o1 ? o.y - o1.y : innerHeight / 11;
      return { at: ([x, y]) => ({ x: (o?.x ?? 0) + x * m, y: (o?.y ?? innerHeight * 0.75) + y * m }), m };
    };
    const ids = ['great', 'pack', ...(sheba ? ['sheba'] : []), ...(petra ? ['petra'] : [])];
    const H = ids.map(id => ({ id, ...ALL[id], r: 0.05 + 0.15 * Math.random(), burst: 0, el: v.light('horses-fret') }));
    const hand = v.light('horses-hand'), word = v.light('veil-word');
    word.textContent = 'ладонь на шею тому, кто бьётся, — и не двигай рукой';
    const breath = v.noise('bandpass', 420, 0.9); // the horses' breathing: louder as they fret
    let V = view(), t0 = 0, sent = 0, down = false, px = 0, py = 0, speed = 0, held = null, over = false;
    let alert = clamp((start - 0.1) * 0.9), nextFret = 3, nextLook = 0, lampX = 7, light = 0.6;
    const nearest = (x, y) => {
      let best = null, bd = 1.5 * V.m;
      for (const h of H) { const p = V.at(h.at), d = Math.hypot((x - p.x) * 0.8, (y - p.y) * 1.3); if (d < bd) { bd = d; best = h; } }
      return best;
    };
    v.on('pointerdown', e => { if (e.button > 0) return; v.el.setPointerCapture(e.pointerId); down = true; px = e.clientX; py = e.clientY; speed = 0; held = nearest(px, py); });
    let moved = 0;
    v.on('pointermove', e => {
      const dtm = Math.max(0.008, (e.timeStamp - moved) / 1000);
      moved = e.timeStamp;
      if (down) speed = Math.max(speed, Math.hypot(e.clientX - px, e.clientY - py) / V.m / dtm); // m/s
      px = e.clientX; py = e.clientY;
      if (down && !held) held = nearest(px, py);
    });
    const up = () => { down = false; held = null; };
    v.on('pointerup', up);
    v.on('pointercancel', up);
    // a horse snorts, or neighs (a fretting one, at the end of its toss); Petra whimpers
    const voice = (h, loud) => {
      const a = v.audio, t = a.currentTime, o = a.createOscillator(), f = a.createBiquadFilter(), gn = a.createGain();
      if (h.child) { v.tone(660, 0, 0.5, 0.05); return; }
      o.type = 'sawtooth';
      const f0 = h.id === 'sheba' ? 520 : 380;
      o.frequency.setValueAtTime(f0, t);
      if (loud) { o.frequency.linearRampToValueAtTime(f0 * 1.9, t + 0.25); o.frequency.linearRampToValueAtTime(f0 * 1.1, t + 0.9); o.frequency.linearRampToValueAtTime(f0 * 0.7, t + 1.3); }
      else o.frequency.linearRampToValueAtTime(f0 * 0.6, t + 0.35);
      f.type = 'bandpass'; f.frequency.value = loud ? 1300 : 700; f.Q.value = 1.4;
      gn.gain.setValueAtTime(0, t);
      gn.gain.linearRampToValueAtTime(loud ? 0.07 : 0.035, t + 0.04);
      gn.gain.exponentialRampToValueAtTime(0.0005, t + (loud ? 1.4 : 0.4));
      o.connect(f).connect(gn).connect(v.sink);
      o.start(t); o.stop(t + 1.5);
      v.to(breath, 0.09, 0.03); setTimeout(() => v.alive && v.to(breath, 0, 0.3), 300);
    };
    v.loop((dt, t) => {
      t0 ||= t;
      const time = t - t0;
      V = view();
      speed *= Math.exp(-dt * 6); // the hand's speed (m/s), dying away
      // the lantern goes over the fog: now here, now there — toward a fretting head, more often than not
      if (time > nextLook) {
        const worst = H.reduce((a, h) => (h.r > a.r ? h : a));
        lampX = worst.r > 0.5 && Math.random() < 0.55 ? worst.at[0] + (Math.random() - 0.5) * 2 : LAMP[0] + Math.random() * (LAMP[1] - LAMP[0]);
        g.set('lamp_x', lampX, 1.8);
        nextLook = time + 2.6 + Math.random() * 2;
      }
      // the horses: fretting by themselves, more in the light; a still hand quiets the one it is on
      if (time > nextFret) {
        const free = H.filter(h => h !== held);
        if (free.length) free[Math.floor(Math.random() * free.length)].r += 0.1 + 0.12 * Math.random();
        nextFret = time + 1.4 + Math.random() * 1.8;
      }
      const lamped = h => Math.abs(g.get('lamp_x') - h.at[0]) < 1.4;
      for (const h of H) {
        if (h === held) h.r -= (speed > FAST ? -SPOOK * (speed - FAST) : CALM) * dt;
        else h.r += h.rate * (lamped(h) ? 2.4 : 1) * dt;
        h.r = Math.max(0, h.r);
        if (h.burst > 0) h.burst -= dt;
        if (!over && lamped(h) && h.r > 0.6) alert += 0.09 * dt; // a head moving in the light
        if (!over && h.r >= 1) {
          // it breaks out: tosses, snorts or neighs; the lantern swings to it
          const loud = !h.child && Math.random() < 0.6;
          voice(h, loud);
          h.burst = 0.8; h.r = 0.35;
          alert += (loud ? 0.34 : 0.22) + (lamped(h) ? 0.2 : 0);
          lampX = h.at[0]; g.set('lamp_x', lampX, 0.7); nextLook = time + 2.4;
        }
      }
      alert = Math.max(0, alert - 0.012 * dt);
      // what the scene shows: heads tossing, Petra coming up, the lantern brighter as he grows sure
      if (t - sent > 0.15) {
        sent = t;
        for (const h of H) {
          const fret = h.burst > 0 ? 1 : h.child ? 0.5 + 0.5 * clamp(h.r) : clamp((h.r - 0.45) / 0.55) * (0.3 + 0.2 * Math.sin(time * 5 + h.at[0]));
          g.set(h.key, fret, h.burst > 0 ? 0.15 : 0.3);
        }
        light = 0.55 + 0.45 * clamp(alert);
        g.set('lamp', light, 0.3);
        g.set('search_point', clamp((alert - 0.45) * 1.2) * 0.6, 0.4);
      }
      const all = H.reduce((s, h) => s + clamp(h.r), 0) / H.length;
      v.to(breath, 0.008 + 0.03 * all, 0.2);
      horse?.loud(0.02, 0.4);
      // what the player sees: a mark over each head, warming as it frets; the hand where it rests
      for (const h of H) {
        const p = V.at(h.at), f = clamp(h.r);
        h.el.classList.toggle('hot', f > 0.7);
        v.put(h.el, p.x, p.y - 0.35 * V.m, (0.55 + 0.6 * f) * V.m / 70, over ? 0 : 0.2 + 0.8 * f);
      }
      const hp = held ? V.at(held.at) : { x: px, y: py };
      hand.classList.toggle('rough', down && speed > FAST);
      v.put(hand, hp.x, hp.y, V.m / 70, down && !over ? 0.9 : 0);
      v.put(word, innerWidth / 2, innerHeight * 0.18, 1, time < 9 ? 0.85 * clamp(time / 1.2) * clamp((9 - time) / 1.5) : 0);
      // seen — or they have looked long enough
      if (!over && (alert >= 1 || time >= T)) {
        over = true;
        const seen = alert >= 1;
        for (const h of H) g.set(h.key, h.child ? 0.5 : 0, 0.8);
        setTimeout(() => { if (!v.alive) return; v.end(); done({ seen }); }, seen ? 300 : 900);
      }
    });
  }),
};
