// the flame as bright as the lamp is up (`lamp`), wavering on its own; its glow with it
const k = e.anim.clamp(e.state.lamp ?? 1, 0, 1), n = e.anim.noise, F = e.layer('flame');
F.alpha = k;
F.scaleY = (0.6 + 0.4 * Math.sqrt(k)) * (1 + 0.08 * n(e.t * 2.3, 1));
F.rotate = 0.05 * n(e.t * 1.7, 2);
e.glow('flame', k * (0.92 + 0.08 * n(e.t * 6, 3)));
