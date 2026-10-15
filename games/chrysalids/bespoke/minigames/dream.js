// «Удержать сон» (IV, «Сон о городе»): a shining fish-ship floats slowly over the city (the scene's
// lead ship, lead_x / lead_y); David follows it with his eyes — the pointer. Near it the dream is
// clear (dream); far from it the dream thins; a sharp move and it breaks — the bedroom window shows
// through (waking). Over when the ship has crossed the sky — or the dream broke.
//   → { held: how near he kept, 0…1, broke }
import { veil, playing, clamp } from './veil.js';

const TIME = 40, CRAFT = 0.45;
// where the lead ship is now, in the sky's units (stage heights from the frame's top left; the
// scene's craft element: x = A·0.665 − 0.07 + lead_x, y = 0.37 − 0.07·craft + lead_y)
const path = u => ({ x: 0.25 - 0.7 * u, y: -0.03 - 0.06 * Math.sin(Math.PI * 5 * u) });

export default {
  title: 'Удержать сон', // (as the author's ☰ lists it)
  skipped: { held: 0.6, broke: false },
  run: (g, b, opts, signal) => playing(signal, { held: 0.6, broke: false }, done => {
    const v = veil(b, signal), gaze = v.light('veil-sight'), hum = v.noise('lowpass', 300, 0.3);
    const scene = document.getElementById('scene');
    const at = u => { // the ship on the screen: the sky as the engine lays it (engine.js view(): the frame, its 16:9 stage centred)
      const cw = scene.clientWidth, ch = scene.clientHeight, a = clamp(cw / ch, 4 / 3, 21 / 9), w = Math.min(cw, ch * a), H = w / a;
      const p = path(u), x0 = (cw - w) / 2 + (w - 16 / 9 * H) / 2;
      return { x: x0 + (16 / 9 * 0.665 - 0.07 + p.x) * H, y: (ch - H) / 2 + (0.37 - 0.07 * CRAFT + p.y) * H, H };
    };
    g.set('craft', CRAFT, 2);
    g.set('lead_x', path(0).x);
    g.set('lead_y', path(0).y);
    let px = -1, py = -1, pt = 0, speed = 0, near = 0, sum = 0, t0 = 0, sent = 0, dream = g.get('dream') ?? 0.75, waking = 0, broke = false;
    v.on('pointermove', e => {
      if (px >= 0) speed = Math.max(speed, Math.hypot(e.clientX - px, e.clientY - py) / Math.max(0.008, (e.timeStamp - pt) / 1000));
      pt = e.timeStamp; px = e.clientX; py = e.clientY;
    });
    v.on('pointerdown', e => { v.el.setPointerCapture(e.pointerId); px = e.clientX; py = e.clientY; });
    v.loop((dt, t) => {
      t0 ||= t;
      const time = t - t0, u = clamp(time / TIME), s = at(u);
      const d = px < 0 ? Infinity : Math.hypot(px - s.x, py - s.y), close = clamp(1.4 - d / (0.1 * s.H));
      near += (close - near) * Math.min(1, dt * 3);
      if (time > 2) sum += near * dt;
      // a sharp move while holding it — the dream breaks a little; held, it clears; let go, it thins
      if (speed > 1.3 * s.H && near > 0.3) { waking = clamp(waking + 0.3); dream = clamp(dream - 0.2, 0.2); near = 0; v.tone(147, 0, 1.4, 0.05); }
      speed *= Math.exp(-dt * 12);
      waking = clamp(waking + (near > 0.5 ? -0.05 : time > 3 ? 0.015 : 0) * dt);
      dream = clamp(dream + (0.35 + 0.6 * near - dream) * dt * 0.5, 0.2);
      v.to(hum, 0.03 * near);
      v.put(gaze, px, py, 0.8 + 0.4 * near, px < 0 ? 0 : 0.5 + 0.5 * near);
      if (t - sent > 0.25) {
        sent = t;
        const p = path(clamp((time + 0.25) / TIME));
        g.set('lead_x', p.x, 0.25); g.set('lead_y', p.y, 0.25);
        g.set('dream', dream, 0.25); g.set('waking', waking, 0.25);
      }
      broke = waking >= 0.85;
      if (broke || time >= TIME) { v.end(); done({ held: clamp(sum / (time - 2 || 1)), broke }); }
    });
  }),
};
