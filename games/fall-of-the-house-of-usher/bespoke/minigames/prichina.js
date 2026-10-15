// «Причина» (I, «Подъезд к дому»): what is it in the house that chills the heart? The player looks — at the
// windows, the trees, the water: each look the chapter answers with a sober line, and the scene's `gloom` rises a
// step (darker, mistier, the lit window dimmer). Then the crack can be picked: the camera comes nearer (the
// scene's beat `trace`) and the player traces it with a finger from the roof down to the water (the scene's
// `crack_trace`: that much of it pales). Forgiving: anywhere near the crack below where the trace has got to; the
// finger may lift and go on.
//   opts: { onLook(which: 'windows' | 'trees' | 'tarn', n: how many looks so far) → a promise (the next look waits
//   for it): the chapter's sober line — and its sound falling quieter, if it likes }
//   → { looked: [which…], traced }
let styled = null;
const LOOKS = ['windows', 'trees', 'tarn'];
const TOP = 23; // the crack runs from 23 m up (the roof's edge) down to the water: b.where('crack', h)
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  title: 'Причина', // (as the author's ☰ lists it)
  skipped: { looked: [], traced: false },
  async run(g, b, { onLook } = {}, signal) {
    styled ||= b.css('minigames/prichina.css').catch(e => b.trouble(e.message));
    signal.addEventListener('abort', () => g.withdraw());
    const looked = [];
    while (looked.length < LOOKS.length) {
      const which = await g.choose(null, Object.fromEntries(LOOKS.filter(w => !looked.includes(w)).map(w => [w, [{ id: w, label: 'Всмотреться' }]])));
      if (signal.aborted) return this.skipped;
      looked.push(which);
      b.set('gloom', looked.length / LOOKS.length, 3);
      await onLook?.(which, looked.length);
      if (signal.aborted) return this.skipped;
    }
    await g.choose(null, 'crack', [{ id: 'crack', label: 'Провести по трещине' }]);
    if (signal.aborted) return this.skipped;
    await g.beat('trace');
    if (signal.aborted) return this.skipped;
    await trace(b, signal);
    return { looked, traced: !signal.aborted };
  },
};

// the finger along the crack, from the roof to the water → when it is there (or the game is skipped)
function trace(b, signal) {
  return new Promise(done => {
    const veil = document.createElement('div'), tip = document.createElement('div'), word = document.createElement('p');
    veil.className = 'prichina-veil';
    tip.className = 'prichina-tip';
    word.className = 'prichina-word';
    word.textContent = 'Веди по трещине — от крыши до воды';
    veil.append(tip, word);
    b.layer.append(veil);
    let p = 0, finger = null, raf = 0, over = false;
    // the crack on the screen now, as N points from the roof down (the same ones every frame: where follows a point
    // from the first time it is asked, a frame later — one asked anew each time would be nowhere yet); point u of the
    // way down: the nearest of them
    const N = 40, lifts = Array.from({ length: N + 1 }, (_, k) => TOP * (1 - k / N));
    let pts = [];
    const look = () => { pts = lifts.map(h => b.where('crack', h)); };
    const at = u => pts[Math.round(clamp(u) * N)] || null;
    const near = () => Math.max(40, innerHeight * 0.08); // how far from the crack the finger may stray, px
    const follow = e => {
      const a = at(0), z = at(1);
      if (!a || !z || over) return;
      const u = clamp((e.clientY - a.y) / (z.y - a.y)), here = at(u);
      // near the crack, below the trace — but not leaping far ahead of it
      if (!here || Math.abs(e.clientX - here.x) > near() || u <= p || (u - p) * Math.abs(z.y - a.y) > near() * 1.6) return;
      p = u;
      b.set('crack_trace', p);
      if (p > 0.98) finish();
    };
    const down = e => {
      if (e.button > 0) return;
      finger = e.pointerId;
      veil.setPointerCapture(e.pointerId);
      follow(e);
    };
    const move = e => { if (e.pointerId === finger) follow(e); };
    const up = e => { if (e.pointerId === finger) finger = null; };
    veil.addEventListener('pointerdown', down);
    veil.addEventListener('pointermove', move);
    veil.addEventListener('pointerup', up);
    veil.addEventListener('pointercancel', up);
    const t0 = performance.now();
    const step = now => {
      look();
      const here = at(p);
      if (here) tip.style.transform = `translate(${here.x.toFixed(1)}px, ${here.y.toFixed(1)}px) translate(-50%, -50%)`;
      word.style.opacity = String(p > 0.25 ? 0 : clamp((now - t0) / 1200) * 0.85);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    function end() {
      if (veil.classList.contains('gone')) return;
      cancelAnimationFrame(raf);
      veil.classList.add('gone');
      setTimeout(() => veil.remove(), 900);
      done();
    }
    function finish() {
      over = true;
      p = 1;
      b.set('crack_trace', 1, 0.4);
      tip.classList.add('done');
      setTimeout(() => { if (!signal.aborted) end(); }, 900);
    }
    signal.addEventListener('abort', end);
  });
}
