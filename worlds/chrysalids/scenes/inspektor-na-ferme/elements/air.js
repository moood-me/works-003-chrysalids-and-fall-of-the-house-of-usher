const S = e.state || {},
  s = S.season ?? 0,
  r = S.rain ?? 0,
  t = e.t;
const nm = Math.round(36 * (1 - s) * (1 - r));
for (let i = 0; i < 36; i++) {
  const bx = e.rnd() * 13,
    by = -0.3 - e.rnd() * 3,
    ph = e.rnd() * 6.28,
    sp = 0.04 + e.rnd() * 0.07;
  if (i >= nm) continue;
  const x = ((((bx + t * sp) % 13) + 13) % 13) - 6.5 + 0.1 * Math.sin(t * 0.3 + ph);
  const y = by + 0.08 * Math.sin(t * 0.21 + ph);
  const a = 0.22 + 0.18 * Math.sin(t * 0.7 + ph);
  g.fillStyle = "rgba(238,222,172," + a + ")";
  g.beginPath();
  g.arc(x, y, 0.007, 0, 7);
  g.fill();
}
const nl = Math.round(9 * Math.sin(Math.PI * Math.min(1, s * 1.1)));
for (let i = 0; i < 9; i++) {
  const bx = e.rnd() * 13,
    by = e.rnd() * 3.4,
    ph = e.rnd() * 6.28,
    sp = 0.12 + e.rnd() * 0.12;
  if (i >= nl) continue;
  const u = (t * sp * 0.25 + by / 3.4) % 1;
  const x = ((((bx + t * sp) % 13) + 13) % 13) - 6.5 + 0.25 * Math.sin(t * 0.8 + ph);
  const y = -3.4 + u * 3.5;
  g.save();
  g.translate(x, y);
  g.rotate(Math.sin(t * 1.3 + ph) * 1.2);
  g.scale(1, 0.45 + 0.4 * Math.sin(t * 1.7 + ph));
  g.fillStyle = "rgba(120,92,60,0.75)";
  g.beginPath();
  g.ellipse(0, 0, 0.035, 0.018, 0, 0, 7);
  g.fill();
  g.restore();
}
