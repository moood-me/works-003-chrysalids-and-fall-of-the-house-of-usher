// Не шелохнуться (Кухня Стормов, tableau `night`): while the father reads, David must not stir. The player holds a
// press (anywhere — a finger, the mouse button; or a key): that is David's hands on the table's edge (the scene's
// david_grip). Let go, and he is a boy who fidgets — sways, looks about; hold and move, and a shiver goes through
// him (david_stir) — and either way, stirred too much, the father lowers the Book and looks at him (father_look),
// then reads on. Not holding at all is fidgeting slowly, and the first look it brings is only a warning (it doesn't
// count): the one who never presses learns from it; only fidgeting on through the reading counts.
// → { stirred: how many times the father looked up — the warning not counted }
//   opts: { while: a promise — the reading; the game lasts until it is over }
const GRACE = 3000, FIDGET = 0.1; // fidgeting: a look per 10 s not held (stirring when held: per move)

export default {
  title: 'Не шелохнуться', // (as the author's ☰ lists it)
  skipped: { stirred: 0 },
  async run(g, b, opts, signal) {
    if (signal.aborted) return;
    const catcher = document.createElement('div');
    Object.assign(catcher.style, { position: 'absolute', inset: '0', touchAction: 'none', cursor: 'pointer' });
    b.layer.prepend(catcher);
    let held = false, at = null, restless = 0, stirred = 0, warned = false, looking = false, calm = performance.now() + GRACE;
    const grip = h => { if (h !== held) b.set('david_grip', h ? 1 : 0, h ? 0.25 : 0.5); held = h; };
    b.set('david_grip', 0, 0.8);
    const hold = e => { grip(true); at = e.clientX != null ? [e.clientX, e.clientY] : null; if (e.pointerId != null) catcher.setPointerCapture?.(e.pointerId); };
    const free = () => { grip(false); at = null; };
    const move = e => {
      if (!held || !at) return;
      const d = Math.hypot(e.clientX - at[0], e.clientY - at[1]);
      if (d > 2) { restless += d * 0.012; at = [e.clientX, e.clientY]; }
    };
    const key = e => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || (e.key !== 'Enter' && e.key.length !== 1)) return;
      e.preventDefault();
      if (e.type === 'keydown') { grip(true); at = null; } else free();
    };
    const on = [[catcher, 'pointerdown', hold], [catcher, 'pointermove', move], [catcher, 'pointerup', free], [catcher, 'pointercancel', free],
      [window, 'keydown', key], [window, 'keyup', key], [window, 'blur', free]];
    for (const [t, ev, fn] of on) t.addEventListener(ev, fn);
    // the father looks up from the Book at him, and after a while reads on
    const look = () => {
      looking = true;
      if (held || warned) stirred++;
      warned = true; // fidgeting brings a warning first; after it every look counts
      b.set('father_look', 1, 0.8);
      setTimeout(() => { if (!signal.aborted) b.set('father_look', 0, 1.0); }, 2600);
      setTimeout(() => { looking = false; calm = performance.now() + 1500; }, 3600);
    };
    let last = performance.now(), raf = 0, shown = 0;
    await new Promise(ok => {
      opts.while?.then(ok, ok);
      signal.addEventListener('abort', ok);
      const frame = now => {
        const dt = Math.min(0.5, (now - last) / 1000); // slow frames still count
        last = now;
        if (now > calm && !looking) restless += held ? -0.08 * dt : FIDGET * dt;
        restless = Math.max(0, restless);
        if (restless >= 1 && !looking) { restless = 0; look(); }
        // the shiver in him: how restless he is, while he holds on
        const stir = Math.round(Math.min(1, restless) * 10) / 10;
        if (stir !== shown) { shown = stir; b.set('david_stir', stir, 0.3); }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    });
    cancelAnimationFrame(raf);
    for (const [t, ev, fn] of on) t.removeEventListener(ev, fn);
    catcher.remove();
    b.set('father_look', 0, 0.8);
    b.set('david_stir', 0, 1);
    b.set('david_grip', 1, 0.6);
    return { stirred };
  },
};
