// «Винты» (III, the vault): the lid is on, and the player drives its four screws home — turning the
// screwdriver round and round the screw, clockwise (a finger or the mouse, pressed). A screw may be
// left loose: the player goes on to the next one (or taps it) before it is home. The scene «Склеп»
// shows it all (beat `screws`: the close-up of the lid, an insert): screw1…screw4 — how far each is in,
// screw_at — which the hand is on (moving there between); where each screw's head is — the insert's points
// closeup#screw1…4 (risen with it).
//   opts: { promised: she was promised (II, «Обещаю») — then, once, while a screw is turning, her
//     line comes back to the player: «Не дай им меня закрыть.» (g.think, her voice in the head) }
//   → { loose: the screws (1…4) left under SEAT, seconds: how long it took }
import { screw as squeak } from '../sound.js';

const SEAT = 0.8;
const TURN = Math.PI * 2 * 3; // a screw from loose to home: three turns of the finger
const NEAR = 48; // px: a press this near another screw goes to it
const HINT = 'Крути отвёрткой по кругу.';
const LOOSE = 'Можно оставить слабо. Он может не заметить.';
const HERS = 'Не дай им меня закрыть.';

let styled = null;

export default {
  title: 'Винты', // (as the author's ☰ lists it)
  skipped: { loose: [], seconds: 0 },
  async run(g, b, { promised = false } = {}, signal) {
    styled ||= b.css('minigames/vinty.css');
    await styled;
    if (signal.aborted) return this.skipped;
    const v = [0, 1, 2, 3, 4].map(i => (i ? b.get(`screw${i}`) ?? 0 : 0));
    const t0 = performance.now();
    let at = 1, last = null, turned = 0, said = !promised, frame = 0, finish;

    const box = document.createElement('div');
    box.className = 'mg-vinty';
    box.innerHTML = `<svg class="ring" viewBox="-60 -60 120 120"><path d="M 0 -46 A 46 46 0 1 1 -32.5 -32.5"/><path class="head" d="M -40 -38 L -32.5 -32.5 L -38 -24"/></svg>
      <div class="words"><p class="how">${HINT}</p><p>${LOOSE}</p><button type="button" class="next"></button></div>`;
    b.layer.append(box);
    const ring = box.querySelector('.ring'), words = box.querySelector('.words'), how = box.querySelector('.how'), next = box.querySelector('.next');

    const where = i => b.where(`closeup#screw${i}`);
    const label = () => {
      next.textContent = at < 4 ? 'Следующий винт' : 'Готово';
      next.classList.toggle('on', v[at] >= 0.15 && v[at] < 1);
    };
    // the hand goes to screw i
    const go = i => {
      at = i; last = null;
      b.set('screw_at', i, 0.5);
      ring.classList.remove('turning');
      label();
    };
    // on from this screw: to the next one not yet home, else the end
    const onward = () => {
      const i = [1, 2, 3, 4].find(k => k > at && v[k] < 1);
      if (i) go(i); else finish();
    };
    const angle = (e, c) => Math.atan2(e.clientY - c.y, e.clientX - c.x);
    const down = e => {
      if (e.button > 0) return;
      e.preventDefault();
      box.setPointerCapture?.(e.pointerId);
      const other = [1, 2, 3, 4].find(i => {
        const p = i !== at && where(i);
        return p && Math.hypot(e.clientX - p.x, e.clientY - p.y) < NEAR;
      });
      if (other) { go(other); return; }
      const c = where(at);
      last = c && angle(e, c);
    };
    const move = e => {
      if (last == null || v[at] >= 1) return;
      const c = where(at);
      if (!c) return;
      const a = angle(e, c);
      let d = a - last;
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      last = a;
      if (d <= 0) return; // only clockwise drives it in
      const before = v[at];
      v[at] = Math.min(1, v[at] + d / TURN);
      b.set(`screw${at}`, v[at]);
      ring.classList.add('turning');
      how.classList.add('gone');
      label();
      turned += d;
      if (Math.floor((before * TURN) / (Math.PI / 2)) !== Math.floor((v[at] * TURN) / (Math.PI / 2))) squeak(v[at]);
      if (!said && turned > TURN * 1.3) {
        said = true;
        words.classList.add('hushed');
        g.think('madeline', HERS).then(() => words.classList.remove('hushed'));
      }
      if (v[at] >= 1) { last = null; setTimeout(() => signal.aborted || onward(), 450); }
    };
    const up = () => { last = null; ring.classList.remove('turning'); };
    box.addEventListener('pointerdown', down);
    box.addEventListener('pointermove', move);
    box.addEventListener('pointerup', up);
    box.addEventListener('pointercancel', up);
    next.addEventListener('pointerdown', e => e.stopPropagation());
    next.addEventListener('click', onward);
    // the ring keeps round the screw the hand is on
    const place = () => {
      const c = where(at);
      if (c) { ring.style.left = `${c.x}px`; ring.style.top = `${c.y}px`; }
      frame = requestAnimationFrame(place);
    };
    place();
    label();

    await new Promise(ok => {
      finish = ok;
      signal.addEventListener('abort', ok);
    });
    cancelAnimationFrame(frame);
    box.remove();
    if (signal.aborted) return this.skipped;
    return { loose: [1, 2, 3, 4].filter(i => v[i] < SEAT), seconds: Math.round((performance.now() - t0) / 1000) };
  },
};
