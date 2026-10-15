// «Два слоя» (III, the square): talking with Rosalind mind to mind, David must not look at her. Where
// his eyes are is a soft light the pointer leads; it is drawn to her the more, the warmer the talk —
// and his head turns with it (glance). The old woman glances at him now and then (someone_watching):
// turned toward Rosalind just then — or right round at any time — and he has looked.
//   opts: { watched: she watches from the start, warm() → 0…1 how warm the talk is now, until: the
//   talk is over (a promise) } → { looked }
import { veil, playing, clamp } from './veil.js';

export default {
  title: 'Два слоя', // (as the author's ☰ lists it)
  skipped: { looked: false },
  run: (g, b, { watched = false, warm = () => 0, until }, signal) => playing(signal, { looked: false }, done => {
    const v = veil(b, signal), eyes = v.light('veil-eyes');
    const D = b.where('david') || { x: innerWidth * 0.25, y: innerHeight * 0.55 };
    let gx = D.x + 30, gy = D.y + 90, px = gx, py = gy, t0 = 0, sent = 0, beat = 0, eye = watched ? 1 : 0, next = 3, over = false;
    v.on('pointermove', e => { px = e.clientX; py = e.clientY; });
    v.on('pointerdown', e => { v.el.setPointerCapture(e.pointerId); px = e.clientX; py = e.clientY; });
    until?.then(() => { over = true; });
    v.loop((dt, t) => {
      t0 ||= t;
      const time = t - t0, R = b.where('rosalind') || { x: innerWidth * 0.7, y: innerHeight * 0.5 }, w = clamp(warm());
      // the eyes go where they are led — and to her, harder the warmer it is
      const k = Math.min(1, dt * 3), pull = Math.min(1, dt * (0.2 + 1.8 * w));
      gx += (px - gx) * k + (R.x - gx) * pull;
      gy += (py - gy) * k + (R.y - gy) * pull;
      const look = clamp(1 - Math.hypot(R.x - gx, R.y - gy) / Math.max(1, Math.hypot(R.x - D.x, R.y - D.y)));
      const glance = clamp((look - 0.5) / 0.4);
      v.put(eyes, gx, gy, 1 + 0.4 * look, 0.45 + 0.5 * look);
      // the heart, louder and quicker the nearer she is
      if (time > beat) { beat = time + 1.1 - 0.45 * look; v.tone(62, 0, 0.18, 0.05 + 0.12 * look); v.tone(55, 0.17, 0.2, 0.04 + 0.08 * look); }
      // the old woman glances over now and then (watching from the start: looks away only a little)
      if (time > next) {
        eye = eye ? 0 : 1;
        next = time + (eye ? (watched ? 4 : 2.5) : (watched ? 1.5 : 4 + 4 * Math.random()));
        g.set('someone_watching', eye, eye ? 1.2 : 1.6);
      }
      if (t - sent > 0.25) { sent = t; g.set('glance', glance, 0.25); }
      const seen = glance >= 0.9 || (glance >= 0.35 && (g.get('someone_watching') || 0) > 0.6);
      if (seen || over) { v.end(); done({ looked: seen }); }
    });
  }),
};
