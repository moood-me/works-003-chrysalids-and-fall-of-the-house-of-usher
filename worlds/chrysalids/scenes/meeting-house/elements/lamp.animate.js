// lit as `lamp` says, out at once as it is knocked down (`spill`): it tips and falls off the table's front (behind it);
// the flame wavering on its own, its glow with it
const A = e.anim, k = A.clamp(e.state.lamp ?? 1, 0, 1), sp = A.clamp(e.state.spill ?? 0, 0, 1);
const fall = A.ease.smooth(A.clamp(sp / 0.3, 0, 1)), lit = k * (1 - A.ease.smooth(A.clamp(sp / 0.15, 0, 1)));
for (const name of ['lamp', 'flame']) {
  const Ly = e.layer(name);
  Ly.x = -0.3 * fall;
  Ly.y = 0.85 * fall * fall;
}
e.layer('lamp').rotate = -1.7 * fall;
const F = e.layer('flame');
F.rotate = -1.7 * fall + 0.05 * A.noise(e.t * 1.7, 2);
F.alpha = lit;
F.scaleY = (0.6 + 0.4 * Math.sqrt(lit)) * (1 + 0.08 * A.noise(e.t * 2.3, 1));
e.glow('flame', lit * (0.92 + 0.08 * A.noise(e.t * 6, 3)));
