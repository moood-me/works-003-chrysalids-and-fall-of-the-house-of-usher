// the waking: each group of towers settles as far as its own and pales, the mist thickens, the sparks rise and fade;
// the mist drifting, the city's glow breathing
const A = e.anim, w = A.clamp(e.state.waking ?? 0, 0, 1);
for (let grp = 0; grp < 4; grp++) {
  const T = e.layer('t' + grp);
  T.scaleY = 1 - 0.6 * w * ((grp + 0.5) / 4);
  T.alpha = 1 - 0.9 * w;
}
e.layer('waves').alpha = 1 - 0.5 * w;
const M = e.layer('mist');
M.x = 0.05 * Math.sin(e.t * 0.02);
M.alpha = Math.min(1, 1 + 0.6 * w);
const Sp = e.layer('sparks');
Sp.alpha = w * (1 - w * 0.6) * (0.6 + 0.4 * Math.sin(e.t * 0.8));
Sp.y = -0.03 * ((e.t * 0.05) % 1);
e.glow('glow', (1 - 0.85 * w) * (0.9 + 0.1 * A.noise(e.t * 0.4, 2)));
