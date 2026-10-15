// «Руки» (IV, the end; «Буря и чтение», beat `hands`: the close-up of the hands). Roderick's hand
// and Madeline's reach — to the narrator (opts.roderick / opts.madeline) or else to each other (the
// scene's rod_reach, rod_to_mad, mad_reach, mad_to_rod). The player's own hand follows the finger
// (the scene's grab, grab_x, grab_y: the close-up's units — the frame's height 1, from its middle, y down — the wrist,
// the palm 0.2 above it); brought to a hand that reaches to him (its palm: the insert's point closeup#rod_hand,
// closeup#mad_hand), it takes it (held_rod, held_mad) — then the other, if it reaches too, both may be taken and there is time; a hand reaching to the other
// one is not his to take. The house shakes harder as the time runs out (quake, thunder, the wood
// giving); time out — whatever is held is taken (nothing held: nobody). To stay: press and hold his own
// place, low in the middle («Остаться»), for STAY seconds — its ring fills; let go, and it empties.
// The hint shows once the hands are in. It leaves the house trembling (quake 0.4).
//   opts: { roderick: bool, madeline: bool — each reaches to the narrator; both: bool — both may be taken (else
//   the first one taken is all); time: seconds (from the crack) }
//   → { took: 'none' | 'madeline' | 'roderick' | 'both', stayed: bool }
import { thunder, splinter } from '../sound.js';

const STAY = 2; // seconds held on his own place: he stays
const HINT = 1.6; // seconds: the hands are in, the hint shows
const REACH = 0.11; // frame heights from a hand's palm: it is in reach
const HOLDING = 1.4; // seconds the close-up holds the hands taken
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
let styled = null;

export default {
  title: 'Руки', // (as the author's ☰ lists it)
  skipped: { took: 'none', stayed: false },
  async run(g, b, opts, signal) {
    styled ||= b.css('minigames/ruki.css');
    await styled;
    if (signal.aborted) return this.skipped;
    const toMe = { rod: !!opts.roderick, mad: !!opts.madeline },
      time = Math.max(3, opts.time ?? 12),
      both = opts.both ?? true;
    b.set('rod_reach', toMe.rod ? 1 : 0, 1.4);
    b.set('rod_to_mad', toMe.rod ? 0 : 1, 1.4);
    b.set('mad_reach', toMe.mad ? 1 : 0, 1.6);
    b.set('mad_to_rod', toMe.mad ? 0 : 1, 1.6);
    const veil = document.createElement('div'),
      place = document.createElement('button'),
      word = document.createElement('p');
    veil.className = 'mg-ruki';
    place.type = 'button';
    place.innerHTML = '<i></i><span>Остаться</span>';
    word.textContent = 'Возьми руку';
    veil.append(place, word);
    b.layer.append(veil);
    thunder(0.9);

    const held = { rod: false, mad: false };
    let finger = null, // {x, y, id}
      staying = null, // the pointer held on his place, and for how long: {id, s}
      stayed = false,
      taken = 0, // when the last of them was taken (s)
      raf = 0,
      shake = 0;
    const t0 = performance.now();
    let last = t0;
    // the finger in the close-up's units (the insert fills the frame: its middle the frame's, a unit its height); the
    // wrist under it, so that the palm is where the finger is
    const hand = e => {
      const f = b.frame();
      b.set('grab_x', (e.clientX - (f.x + f.w / 2)) / f.h, 0.08, 'linear');
      b.set('grab_y', (e.clientY - f.y) / f.h - 0.5 + 0.2, 0.08, 'linear');
    };
    const down = e => {
      if (e.button > 0) return;
      finger = { id: e.pointerId, x: e.clientX, y: e.clientY };
      veil.setPointerCapture(e.pointerId);
      hand(e);
      b.set('grab', 1, 0.35, 'out');
      word.classList.add('gone');
    };
    const move = e => {
      if (!finger || e.pointerId !== finger.id) return;
      finger.x = e.clientX;
      finger.y = e.clientY;
      hand(e);
    };
    const up = e => {
      if (!finger || e.pointerId !== finger.id) return;
      finger = null;
      b.set('grab', 0, 0.5);
    };
    // his own place: held, he stays; let go, it empties
    const hold = e => {
      if (e.button > 0) return;
      e.stopPropagation();
      staying = { id: e.pointerId, s: 0 };
      place.setPointerCapture(e.pointerId);
      word.classList.add('gone');
    };
    const release = e => {
      if (staying?.id !== e.pointerId) return;
      staying = null;
      place.style.setProperty('--u', '0');
    };
    place.addEventListener('pointerdown', hold);
    place.addEventListener('pointerup', release);
    place.addEventListener('pointercancel', release);
    veil.addEventListener('pointerdown', down);
    veil.addEventListener('pointermove', move);
    veil.addEventListener('pointerup', up);
    veil.addEventListener('pointercancel', up);

    // the house: harder as the time runs out (the scene moves it)
    b.set('quake', 0.25);
    b.set('quake', 1, time, 'linear');
    await new Promise(finish => {
      const step = now => {
        const dt = Math.min(0.1, (now - last) / 1000),
          t = (now - t0) / 1000;
        last = now;
        // a jolt and the wood giving now and then, more often as the time runs out
        if ((shake -= dt) <= 0) {
          shake = 2.2 + 2.5 * Math.random() * (1 - t / time);
          b.set('shudder', 0.8);
          b.set('shudder', 0, 1.2);
          splinter();
        }
        if (finger && !taken) {
          const h = b.frame().h;
          for (const who of ['rod', 'mad']) {
            if (held[who]) continue;
            const p = b.where(`closeup#${who}_hand`);
            if (!p || Math.hypot(finger.x - p.x, finger.y - p.y) / h > REACH) continue;
            if (!toMe[who]) continue; // it reaches to the other, not to him
            held[who] = true;
            b.set(who === 'rod' ? 'held_rod' : 'held_mad', 1, 0.3, 'out');
            b.set('grab', 0, 0.3);
            finger = null;
            break;
          }
        }
        if (t > HINT) veil.classList.add('on');
        if (staying) {
          staying.s += dt;
          place.style.setProperty('--u', clamp(staying.s / STAY).toFixed(3));
          if (staying.s >= STAY) {
            stayed = true;
            return finish();
          }
        }
        // all that reach to him taken: a moment holding them, then on
        if (!taken && (held.rod || held.mad) && (!both || ['rod', 'mad'].every(w => held[w] || !toMe[w]))) taken = t;
        if (t >= time || (taken && t - taken > HOLDING)) return finish();
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      signal.addEventListener('abort', finish);
    });
    cancelAnimationFrame(raf);
    veil.remove();
    b.set('grab', 0, 0.4);
    b.set('quake', signal.aborted ? 0 : 0.4, 1);
    if (signal.aborted) {
      b.set('held_rod', 0, 0.3);
      b.set('held_mad', 0, 0.3);
      return this.skipped;
    }
    const took = held.rod && held.mad ? 'both' : held.rod ? 'roderick' : held.mad ? 'madeline' : 'none';
    return { took, stayed };
  },
};
