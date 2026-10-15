// «Слушать» (III, the nights; «Буря и чтение», beat `night`): alone, the candle, quiet rain; the
// house's own sounds — and one from below. The player moves a finger (or the mouse) over the room:
// near the place it comes up through (the scene's element `ripple`) it gets clearer — the scene's
// `ripple` rings on the floor there, the narrator turns to it (`listen`). What is heard is the
// chapter's: opts.clarity 0…1 (lower sanity, clearer) — below 0.5 only a faint scratching, from 0.5
// her song hummed through the stone, the scratching under it. It ends once the player has stayed
// at the place for HOLD seconds. The house and the rain go on sounding after it (the chapter's).
//   → { heard: 'scratch' | 'melody', seconds: how long it took }
import { house, rain, scratch, melody } from '../sound.js';

const HOLD = 4; // seconds of listening at the place
const NEAR = 0.42; // screen heights from the place where it starts to be heard
const GUIDE = 14; // seconds: then the rings show faintly, whether near or not
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
let styled = null;

export default {
  title: 'Слушать', // (as the author's ☰ lists it)
  skipped: { heard: 'scratch', seconds: 0 },
  async run(g, b, opts, signal) {
    styled ||= b.css('minigames/slushat.css');
    await styled;
    if (signal.aborted) return this.skipped;
    const clarity = clamp(opts.clarity ?? 0.3), song = clarity >= 0.5;
    const veil = document.createElement('div'),
      ear = document.createElement('i'),
      word = document.createElement('p');
    veil.className = 'mg-slushat';
    word.textContent = 'Где этот звук?';
    veil.append(ear, word);
    b.layer.append(veil);

    house(0.75, 3);
    rain(0.4, 3);
    const scraping = scratch();
    // her song, over and over, as long as it is listened for
    let hum = null,
      done = false;
    const sing = () => {
      if (signal.aborted || done) return;
      hum = melody({ as: 'hum', muffled: true, tempo: 0.85, loud: 0.9 });
      hum.loud(0, 0);
      hum.done.then(sing);
    };
    if (song) sing();

    const sent = {};
    const tell = (key, v, over) => { if (Math.abs(v - (sent[key] ?? -1)) > 0.01) b.set(key, (sent[key] = v), over); };
    const t0 = performance.now();
    let at = null, // the finger (CSS px), or null
      near = 0,
      held = 0,
      raf = 0,
      last = t0;
    const move = e => {
      at = { x: e.clientX, y: e.clientY };
      ear.style.transform = `translate(${at.x.toFixed(1)}px, ${at.y.toFixed(1)}px)`;
      ear.classList.add('on');
    };
    const away = e => {
      if (e.pointerType !== 'mouse') {
        at = null;
        ear.classList.remove('on');
      }
    };
    veil.addEventListener('pointermove', move);
    veil.addEventListener('pointerdown', move);
    veil.addEventListener('pointerup', away);
    veil.addEventListener('pointercancel', away);

    await new Promise(finish => {
      const step = now => {
        const dt = Math.min(0.1, (now - last) / 1000),
          t = (now - t0) / 1000;
        last = now;
        const spot = b.where('ripple'),
          h = b.layer.clientHeight || innerHeight;
        const d = at && spot ? Math.hypot(at.x - spot.x, at.y - spot.y) / h : 9;
        near += (clamp(1 - d / NEAR) - near) * (1 - Math.exp(-dt / 0.35));
        const k = near * near;
        // the sound from below: the nearer, the louder; what it is — the clarity
        scraping.loud(k * (song ? 0.45 : 0.25 + 0.5 * clarity), 0.15);
        hum?.loud(k * (0.35 + 0.65 * clarity), 0.15);
        // (the scene's ripple, its shader's, and the narrator turning to listen: sent as they change)
        tell('ripple', Math.max(k * (0.35 + 0.65 * clarity), t > GUIDE ? 0.25 : 0), 0.2);
        tell('listen', k, 0.3);
        held = near > 0.75 ? held + dt : Math.max(0, held - dt * 0.5);
        if (near > 0.3) word.classList.add('gone');
        if (held >= HOLD) return finish();
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      signal.addEventListener('abort', finish);
    });
    done = true;
    cancelAnimationFrame(raf);
    const fade = signal.aborted ? 0.4 : 2.5;
    scraping.stop(fade);
    hum?.stop(fade);
    b.set('ripple', 0, fade);
    b.set('listen', 0, fade);
    veil.classList.add('gone');
    setTimeout(() => veil.remove(), signal.aborted ? 0 : 900);
    return signal.aborted ? this.skipped : { heard: song ? 'melody' : 'scratch', seconds: Math.round((performance.now() - t0) / 1000) };
  },
};
