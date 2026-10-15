const S = e.state || {};
const f = S.fire ?? 0.7;
for (let i = 0; i < 6; i++) {
  const sp = 0.02 + e.rnd() * 0.03;
  const ph = e.rnd() * 6.28;
  const x = -3 + e.rnd() * 6 + Math.sin(e.t * sp + ph) * 1.2;
  const y = -3.2 - e.rnd() * 2;
  const r = 1.2 + e.rnd() * 1.5;
  const gg = g.createRadialGradient(x, y, 0, x, y, r);
  gg.addColorStop(0, "rgba(120,80,60," + 0.06 * f + ")");
  gg.addColorStop(1, "rgba(120,80,60,0)");
  g.save();
  g.translate(x, y);
  g.scale(1, 0.4);
  g.translate(-x, -y);
  g.fillStyle = gg;
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
  g.restore();
}
for (let i = 0; i < 24; i++) {
  const bx = -4 + e.rnd() * 7,
    by = -0.5 - e.rnd() * 3,
    sp = 0.02 + e.rnd() * 0.04,
    ph = e.rnd() * 6.28;
  const x = bx + Math.sin(e.t * sp + ph) * 0.6,
    y = by + Math.sin(e.t * sp * 1.7 + ph) * 0.3;
  const a = 0.25 + 0.25 * Math.sin(e.t * 0.5 + ph);
  g.fillStyle = "rgba(230,160,100," + a * f + ")";
  g.beginPath();
  g.arc(x, y, 0.015, 0, 7);
  g.fill();
}
