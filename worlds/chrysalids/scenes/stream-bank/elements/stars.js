// the stars: faint points over the sky, painted as the full night has them (stars.wgsl: seen as far as the night is in,
// each twinkling in its own time)
g.fillStyle = '#e8eefc';
for (let i = 0; i < 90; i++) {
  const x = e.anim.hash(i, 21) * e.aspect, y = -0.3 + e.anim.hash(i, 23) * 0.62, r = 0.0006 + 0.0014 * e.anim.hash(i, 25);
  g.globalAlpha = 0.35 + 0.5 * e.anim.hash(i, 27);
  g.beginPath();
  g.arc(x, y, r, 0, 7);
  g.fill();
}
g.globalAlpha = 1;
