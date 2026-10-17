// the coal bed breathing with the fire (`fire`), flickering
const f = e.anim.clamp(e.state.fire ?? 0.7, 0, 1), L = e.layer('coals');
L.alpha = 0.35 + 0.65 * f;
L.brightness = 0.85 + 0.15 * e.anim.noise(e.t * 1.7, 1);
