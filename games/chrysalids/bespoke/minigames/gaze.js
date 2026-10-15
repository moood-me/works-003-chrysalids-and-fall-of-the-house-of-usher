// Найди раньше него (Инспектор на ферме): the yard goes dim; clear is only where the player looks (the
// pointer, a finger) — and where the inspector looks: his gaze goes slowly from thing to thing, the
// wheat, the horse, the fence, the farmhand, and comes to the calf. Held on a part of the calf, the
// player's gaze narrows and sees it: as it should be — or not quite.
// → { found: true, left: ms before he would have looked at the calf } | { found: false }
let styled = null;

// where to look (metres from where the scene puts an element — its feet, or its head if it says so: x
// across, lift up; r — how near counts) and what is seen
const SPOTS = [
  { at: 'calf', x: -0.65, lift: 0.75, r: 0.3, note: 'голова — как положено' },
  { at: 'calf', x: 0.05, lift: 1.0, r: 0.3, note: 'спина — как положено' },
  { at: 'calf', x: 0.58, lift: 0.7, r: 0.25, note: 'хвост — как положено' },
  { at: 'calf', x: 0.05, lift: 0.3, r: 0.45, note: 'ноги… длинноваты', wrong: true },
  { at: 'stooks_mid', x: 0, lift: 0.7, r: 3, note: 'колосья — ровные' },
];
// his way: where his gaze rests, and how long
const HIS = [
  { at: 'inspector', x: -0.1, lift: -0.86, ms: 5000 },
  { at: 'stooks_mid', x: 0, lift: 0.7, ms: 6000 },
  { at: 'horse', x: 0.3, lift: 1.3, ms: 5000 },
  { at: 'farmhand', x: 0, lift: -0.6, ms: 5000 },
  { at: 'calf', x: -0.1, lift: 0.7, ms: 0 },
];
const MOVE = 2600, DWELL = 900;

export default {
  title: 'Найди раньше него', // (as the author's ☰ lists it)
  skipped: { found: true, left: 15000 },
  async run(g, b, opts, signal) {
    styled ||= b.css('minigames/gaze.css');
    await styled;
    if (signal.aborted) return;
    const veil = document.createElement('canvas'), notes = document.createElement('div');
    veil.className = 'mg-gaze';
    notes.className = 'mg-gaze-notes';
    b.layer.prepend(veil, notes); // under the eye, the words and the author's tools
    const c = veil.getContext('2d');
    const size = () => { veil.width = innerWidth; veil.height = innerHeight; };
    size();
    // a point of the scene on the screen: an element's anchor, then metres from it at its depth
    const point = ({ at, x, lift }) => {
      const p0 = b.where(at), p1 = b.where(at, 1);
      if (!p0 || !p1) return { x: innerWidth / 2, y: innerHeight / 2, m: 60 };
      const m = p0.y - p1.y;
      return { x: p0.x + x * m, y: p0.y - lift * m, m };
    };
    const me = { ...(b.where('david') || { x: innerWidth * 0.3, y: innerHeight * 0.6 }) };
    const move = e => { me.x = e.clientX; me.y = e.clientY; };
    veil.addEventListener('pointermove', move);
    veil.addEventListener('pointerdown', move);
    addEventListener('resize', size);
    const seen = new Set();
    const note = (s, p) => {
      const n = document.createElement('p');
      n.textContent = s.note;
      if (s.wrong) n.className = 'wrong';
      n.style.left = `${p.x}px`; n.style.top = `${p.y - s.r * p.m - 14}px`;
      notes.append(n);
    };
    const t0 = performance.now(), arrives = HIS.slice(0, -1).reduce((t, h) => t + h.ms + MOVE, 0);
    // where his gaze is at t ms
    const his = t => {
      for (let i = 0, at = 0; i < HIS.length - 1; i++) {
        const a = point(HIS[i]);
        if (t < at + HIS[i].ms) return a;
        at += HIS[i].ms;
        if (t < at + MOVE) { const b2 = point(HIS[i + 1]), k = (1 - Math.cos(Math.PI * (t - at) / MOVE)) / 2; return { x: a.x + (b2.x - a.x) * k, y: a.y + (b2.y - a.y) * k }; }
        at += MOVE;
      }
      return point(HIS.at(-1));
    };
    let on = null, since = 0, r = 110, raf = 0;
    const result = await new Promise(ok => {
      const frame = now => {
        if (signal.aborted) return ok(undefined);
        const t = now - t0, h = his(t);
        // the player's gaze: on a spot long enough — it is seen
        const spot = SPOTS.find(s => { const p = point(s); return Math.hypot(me.x - p.x, me.y - p.y) < Math.max(18, s.r * p.m); });
        if (spot !== on) { on = spot; since = now; }
        const dwell = on && !seen.has(on) ? Math.min(1, (now - since) / DWELL) : 0;
        r += ((on ? 110 - 50 * dwell : 110) - r) * 0.15;
        if (dwell >= 1) {
          seen.add(on);
          note(on, point(on));
          if (on.wrong) return setTimeout(() => ok({ found: true, left: Math.max(0, arrives - t) }), 1600);
        }
        if (t >= arrives) return setTimeout(() => ok({ found: false }), 1200);
        c.clearRect(0, 0, veil.width, veil.height);
        c.globalCompositeOperation = 'source-over';
        c.fillStyle = 'rgba(12,11,10,0.58)';
        c.fillRect(0, 0, veil.width, veil.height);
        c.globalCompositeOperation = 'destination-out';
        for (const [p, rad] of [[me, r], [h, 85]]) {
          const gr = c.createRadialGradient(p.x, p.y, rad * 0.35, p.x, p.y, rad);
          gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
          c.fillStyle = gr; c.fillRect(p.x - rad, p.y - rad, rad * 2, rad * 2);
        }
        c.globalCompositeOperation = 'source-over';
        c.lineWidth = 1.2;
        c.strokeStyle = 'rgba(176,196,214,0.28)'; c.beginPath(); c.arc(h.x, h.y, 70, 0, 7); c.stroke();
        c.strokeStyle = `rgba(255,217,160,${0.2 + 0.4 * dwell})`; c.beginPath(); c.arc(me.x, me.y, r * 0.8, 0, 7); c.stroke();
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      signal.addEventListener('abort', () => ok(undefined));
    });
    cancelAnimationFrame(raf);
    removeEventListener('resize', size);
    veil.classList.add('gone'); notes.classList.add('gone');
    setTimeout(() => { veil.remove(); notes.remove(); }, signal.aborted ? 0 : 1500);
    return result;
  },
};
