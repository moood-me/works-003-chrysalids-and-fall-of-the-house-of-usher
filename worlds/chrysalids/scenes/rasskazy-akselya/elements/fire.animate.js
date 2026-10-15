const f = e.anim.clamp(e.state.fire ?? 0.8, 0, 1), n = e.anim.noise;
const k = f * (0.85 + 0.15 * n(e.t * 2.3, 1));
e.layer('embers').alpha = k;
e.glow('flame', k);
