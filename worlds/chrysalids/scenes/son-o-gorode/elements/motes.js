const A = e.aspect,
  S = e.state || {};
const d = S.dream ?? 0.7,
  w = S.waking ?? 0;
for (let i = 0; i < 24; i++) {
  const x0 = e.rnd() * A,
    sp = 0.004 + e.rnd() * 0.006,
    ph = e.rnd(),
    sd = e.rnd() * 6.28;
  const f = (ph + e.t * sp) % 1;
  const x = x0 + 0.03 * Math.sin(e.t * 0.1 + sd) + 0.01 * Math.sin(e.t * 0.27 + sd * 2);
  const y = 0.95 - f * 0.7;
  const a = 0.3 * Math.sin(f * 3.14) * (0.5 + 0.5 * Math.sin(e.t * 0.6 + sd)) * (0.5 + 0.5 * d) * (1 - 0.7 * w);
  const r = 0.0012 + 0.0008 * Math.sin(sd);
  const rg = g.createRadialGradient(x, y, 0, x, y, r * 2.5);
  rg.addColorStop(0, "rgba(246,230,200," + a + ")");
  rg.addColorStop(1, "rgba(246,230,200,0)");
  g.fillStyle = rg;
  g.beginPath();
  g.arc(x, y, r * 2.5, 0, 7);
  g.fill();
}
