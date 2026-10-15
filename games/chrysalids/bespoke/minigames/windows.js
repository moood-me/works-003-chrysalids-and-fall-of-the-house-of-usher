// «Соединить окна» (III and IV, «Голоса»): on the hill at night David calls the others one by one — he
// draws a thread from himself to the next window (held, the thread's end follows the pointer, slower
// than the hand; let go, it rolls back). Reached, the window is linked (count) and the voices grow
// (voices) — and so does the risk: the louder we are, the more Petra's window stirs (petra), and the
// harder it pulls a thread that passes near it. Pulled in, the thread catches her signal — too strong,
// a flash in every head; once.
//   opts: { targets: the windows in the order they are called (farm1…), petra: how bright her window
//   is to begin with, voices: the same of the voices, hint: show what to do, onLink(n) → (a promise:
//   the next window waits for it), onPetra() → (the same) }
//   → { links, caught: her signal was caught }
import { veil, playing, clamp, sky } from './veil.js';

let styled = null;
// where the scene draws the windows and David (its sky: notes «W — x окон ферм», AX/AY), in stage heights
const A = 16 / 9, HZ = 0.66 - 0.008;
const W = [0.52, 0.8, 0.905, 0.6, 0.44, 0.665, 0.97, 0.815];
const window_ = id => (id === 'home' ? sky(0.735 * A, 0.66 - 0.012) : sky(W[Number(id.slice(4)) - 1] * A, HZ));
const SPEED = 0.6, BACK = 1.4, IDLE = 30; // the thread's end: stage heights a second, out and back; a window calls by itself after
const NOTES = [523, 587, 659, 784, 880, 988, 1047, 1175];

export default {
  title: 'Соединить окна', // (as the author's ☰ lists it)
  skipped: { links: 0, caught: false },
  run: (g, b, { targets = [], petra = 0, voices = 0.4, hint = false, onLink, onPetra } = {}, signal) => playing(signal, { links: targets.length, caught: false }, done => {
    styled ||= b.css('minigames/windows.css').catch(e => b.trouble(e.message));
    const v = veil(b, signal), hum = v.noise('lowpass', 260, 0.4);
    const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'win-threads');
    const glow = document.createElementNS(NS, 'path'), line = document.createElementNS(NS, 'path');
    glow.setAttribute('class', 'win-glow'); line.setAttribute('class', 'win-line');
    svg.append(glow, line);
    v.el.append(svg);
    const ring = v.light('win-next'), word = hint ? v.light('veil-word') : null;
    if (word) word.textContent = 'держи и веди нить к окну';
    let links = 0, caught = false, flash = 0, waiting = false, down = false, px = 0, py = 0, tx = null, ty = 0, t0 = 0, since = 0, sent = 0, warm = 0, over = false;
    const me = () => sky(0.52, 0.548);
    v.on('pointerdown', e => { v.el.setPointerCapture(e.pointerId); down = true; px = e.clientX; py = e.clientY; });
    v.on('pointermove', e => { px = e.clientX; py = e.clientY; });
    v.on('pointerup', () => { down = false; });
    v.on('pointercancel', () => { down = false; });
    // a beat of the page's own, then the next window (or the end)
    const after = async (fn, then) => {
      waiting = true;
      try { await fn?.(); } catch (e) { b.trouble(e.message); }
      if (!v.alive) return;
      waiting = false;
      then?.();
    };
    const link = () => {
      links++;
      tx = null; warm = 0;
      g.set('count', links, 1);
      g.set('voices', clamp(voices + 0.06 * links), 2);
      v.tone(NOTES[(links - 1) % NOTES.length], 0, 1.8, 0.07);
      v.tone(NOTES[(links - 1) % NOTES.length] / 2, 0.05, 2.2, 0.04);
      if (links >= targets.length) { over = true; after(() => onLink?.(links), () => { v.end(); done({ links, caught }); }); }
      else after(() => onLink?.(links), () => { since = 0; });
    };
    v.loop((dt, t) => {
      t0 ||= t;
      const time = t - t0, H = sky(0, 0).H, M = me(), next = targets[links], N = next ? window_(next) : null, P = window_('home');
      if (!waiting && !over) since += dt;
      // the thread's end: out toward the hand while held, back home when let go
      if (tx === null) { tx = M.x; ty = M.y; }
      const busy = waiting || over;
      if (down && !busy) {
        const dx = px - tx, dy = py - ty, d = Math.hypot(dx, dy), s = Math.min(d, SPEED * H * dt);
        if (d > 0.5) { tx += dx / d * s; ty += dy / d * s; }
        // her window pulls the thread, the harder the more of us are linked (and the brighter she is)
        if (!caught) {
          const pe = clamp(petra + 0.05 * links), R = H * (0.035 + 0.015 * links) * (0.7 + 0.6 * pe), dp = Math.hypot(P.x - tx, P.y - ty);
          if (dp < R && dp > 0.5) { // as fast as a hand, near her (and more than that, when she is bright and we are many)
            const pull = Math.sqrt(1 - dp / R) * (0.45 + 0.08 * links) * (0.6 + 0.6 * pe), s = Math.min(dp, pull * SPEED * H * dt);
            tx += (P.x - tx) / dp * s; ty += (P.y - ty) / dp * s;
            warm = Math.max(warm, 1 - dp / R);
          }
          if (dp < Math.max(10, 0.02 * H)) { // her signal: too strong — a flash in every head
            caught = true; flash = time;
            g.set('petra', 1, 0.4); g.set('voices', 1, 0.4);
            [659, 831, 988, 1319].forEach((f, i) => v.tone(f, i * 0.04, 2.6, 0.09));
            after(() => onPetra?.(), () => { since = 0; });
          }
        }
      } else {
        const dx = M.x - tx, dy = M.y - ty, d = Math.hypot(dx, dy), s = Math.min(d, BACK * H * dt);
        if (d > 0.5) { tx += dx / d * s; ty += dy / d * s; }
        warm = Math.max(0, warm - dt);
      }
      if (caught && time - flash > 1.6 && time - flash < 2) { tx = M.x; ty = M.y; }
      // the window reached: linked; or, left too long, it calls by itself
      if (N && !busy && (Math.hypot(N.x - tx, N.y - ty) < Math.max(14, 0.03 * H) || since > IDLE)) link();
      if (tx === null) { tx = M.x; ty = M.y; } // (linked just now: the thread starts again from me)
      // how it looks: the thread from me to its end, arched; the next window's ring
      const ext = Math.hypot(tx - M.x, ty - M.y);
      if (ext > 2) {
        const cx = (M.x + tx) / 2, cy = Math.min(M.y, ty) - 0.06 * H - 0.12 * ext;
        const d = `M${M.x.toFixed(1)},${M.y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)}`;
        line.setAttribute('d', d); glow.setAttribute('d', d);
      } else { line.setAttribute('d', ''); glow.setAttribute('d', ''); }
      svg.classList.toggle('warm', warm > 0.3 || (caught && time - flash < 1.6));
      if (N) v.put(ring, N.x, N.y, (H / 700) * (0.9 + 0.12 * Math.sin(time * 2.2)), busy ? 0 : 0.75);
      else v.put(ring, 0, 0, 1, 0);
      if (word) { v.put(word, M.x, M.y - 0.14 * H, 1, links === 0 && time < 14 ? 0.8 * clamp(time / 1.2) : 0); }
      v.to(hum, 0.012 + 0.006 * links + (down ? 0.012 : 0));
      // she stirs, the louder we are; after her flash, back to it
      if (t - sent > 0.3) {
        sent = t;
        if (!caught || time - flash > 1.6) g.set('petra', clamp(petra + 0.05 * links + 0.25 * warm + (caught ? 0.1 : 0)), 0.6);
        if (caught && time - flash > 1.6 && time - flash < 2) g.set('voices', clamp(voices + 0.06 * links), 2);
      }
    });
  }),
};
