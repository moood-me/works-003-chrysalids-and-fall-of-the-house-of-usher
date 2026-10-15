// «За руку» (II, «Подъезд к дому», a grey day): the narrator leads Roderick out along the causeway by the hand;
// he has not been outside for years. Held and pulled towards you (press and draw down; or hold Space), they walk on —
// the scene's `walk` says where to along the causeway, and they go there at their own pace, hand in hand (the camera
// with them) — up to MIDDLE, the middle of the causeway, where the chapter takes over. Roderick resists (the scene's
// `resist`: he balks), more the farther from the house, and now and then he jerks back; pull weaker than he resists
// and they stand; let go, and he draws you both back towards the house, a step at a time (they step back).
//   → { seconds (from the first pull to the middle), letGo (how many times the hand was let go) }
let styled = null;
// the causeway in `walk`'s units (0 — the door, 1 — the near shore): where they are now is the scene's `walk_at`; the
// game thinks in these units, never in the scene's metres
const MIDDLE = 0.5;
const LEAD = 0.02, BACK = 0.01, NEAR = 0.0015; // sent on before them while they are pulled (two steps); a step back; close enough
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  title: 'За руку', // (as the author's ☰ lists it)
  skipped: { seconds: 0, letGo: 0 },
  run: (g, b, opts, signal) => new Promise(done => {
    styled ||= b.css('minigames/za-ruku.css').catch(e => b.trouble(e.message));
    const veil = document.createElement('div'), hands = document.createElement('div'), cord = document.createElement('div'), word = document.createElement('p');
    veil.className = 'za-ruku-veil';
    hands.className = 'za-ruku-hands';
    cord.className = 'za-ruku-cord';
    word.className = 'za-ruku-word';
    word.textContent = 'Держи и тяни к себе';
    veil.append(cord, hands, word);
    b.layer.append(veil);
    const at = () => clamp(+b.get('walk_at') || 0); // where they are (the scene keeps it)
    const w0 = Math.min(at(), MIDDLE);
    let aim = w0, resist = b.get('resist') ?? 0.3, said = resist;
    let finger = null, from = null, drag = 0, keyed = false, letGo = 0, started = 0, jerk = 0, nextJerk = 0, raf = 0;
    const held = () => finger !== null || keyed;
    // where they go: the scene walks them there (only a change is sent)
    const send = w => {
      w = clamp(w, 0.05, MIDDLE);
      if (Math.abs(w - aim) < NEAR) return;
      aim = w;
      b.set('walk', aim);
    };
    const down = e => {
      if (e.button > 0) return;
      finger = e.pointerId;
      from = { x: e.clientX, y: e.clientY };
      drag = 0;
      veil.setPointerCapture(e.pointerId);
    };
    const move = e => {
      if (e.pointerId !== finger) return;
      drag = clamp((e.clientY - from.y) / (innerHeight * 0.14));
      cord.style.height = `${Math.max(0, e.clientY - from.y).toFixed(0)}px`;
      cord.style.transform = `translate(${from.x.toFixed(1)}px, ${from.y.toFixed(1)}px)`;
    };
    const up = e => {
      if (e.pointerId !== finger) return;
      finger = null;
      cord.style.height = '0px';
      if (started) letGo++;
    };
    const key = on => e => {
      if (e.code !== 'Space' && e.code !== 'ArrowDown') return;
      e.preventDefault();
      if (keyed && !on && started) letGo++;
      keyed = on;
    };
    const keydown = key(true), keyup = key(false);
    veil.addEventListener('pointerdown', down);
    veil.addEventListener('pointermove', move);
    veil.addEventListener('pointerup', up);
    veil.addEventListener('pointercancel', up);
    addEventListener('keydown', keydown);
    addEventListener('keyup', keyup);
    let last = performance.now();
    const step = now => {
      const dt = Math.min(0.1, (now - last) / 1000), t = now / 1000, w = at();
      last = now;
      if (held() && !started) { started = now; nextJerk = t + 2.5; }
      // his will: more the farther from the house; now and then a jerk back, then it eases
      if (started && t > nextJerk) { jerk = 0.55 + 0.25 * Math.random(); nextJerk = t + 2.8 + 2 * Math.random(); }
      jerk *= Math.exp(-dt / 0.6);
      resist += (clamp(0.2 + 0.35 * (w - w0) / (MIDDLE - w0) + jerk) - resist) * (1 - Math.exp(-dt / 0.2));
      if (Math.abs(resist - said) > 0.01) b.set('resist', (said = resist));
      // the pull: a held hand pulls a little, drawn down towards you more — stronger than he resists, they go on;
      // weaker, they stand; let go, he draws them back a step, and another once they have stepped it
      const pull = held() ? (keyed ? 0.85 : 0.4 + 0.6 * drag) : 0;
      if (started) {
        if (held() && pull > resist) { if (aim - w < LEAD / 2) send(Math.max(aim, w) + LEAD); }
        else if (held()) send(w);
        else if (aim >= w - NEAR) send(w - BACK);
      }
      // the hold, between their hands: brighter the harder you pull, tugged towards him when he jerks
      const n = b.where('narrator#hand_r'), r = b.where('roderick#hand_l');
      if (n && r) {
        const k = 0.5 + 0.3 * jerk;
        hands.style.transform = `translate(${(n.x + (r.x - n.x) * k).toFixed(1)}px, ${(n.y + (r.y - n.y) * k).toFixed(1)}px) translate(-50%, -50%) scale(${(0.7 + 0.5 * pull).toFixed(3)})`;
        hands.style.opacity = (0.3 + 0.6 * pull).toFixed(3);
      }
      word.style.opacity = String(started && w - w0 > LEAD ? 0 : 0.85);
      if (w >= MIDDLE - 2 * NEAR) {
        end();
        done({ seconds: Math.round((now - started) / 1000), letGo });
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    function end() {
      if (veil.classList.contains('gone')) return;
      cancelAnimationFrame(raf);
      removeEventListener('keydown', keydown);
      removeEventListener('keyup', keyup);
      veil.classList.add('gone');
      setTimeout(() => veil.remove(), 900);
    }
    signal.addEventListener('abort', end);
  }),
};
