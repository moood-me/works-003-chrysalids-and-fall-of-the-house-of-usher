// the bell: rings spreading from the belfry and fading, the birds rising off it and wheeling (only while it rings)
const b = e.anim.clamp(e.state.bell ?? 0, 0, 1);
for (let i = 0; i < 2; i++) {
  const a = (e.t * 0.22 + i / 2) % 1, R = e.layer('ring' + i);
  R.scale = (6 + a * 60) / 66;
  R.alpha = b * (1 - a) * Math.min(1, a * 6);
}
for (let i = 0; i < 7; i++) {
  const B = e.layer('bird' + i), ang = e.t * 0.25 + i * 0.9, rad = 14 + 6 * Math.sin(i * 1.7);
  B.x = Math.cos(ang) * rad * (1 + i * 0.1);
  B.y = -b * 18 - Math.sin(ang) * rad * 0.35 - i * 1.5;
  B.scaleY = 0.4 + 0.6 * Math.abs(Math.sin(e.t * 6 + i * 2));
  B.alpha = Math.min(1, b * 1.5);
}
