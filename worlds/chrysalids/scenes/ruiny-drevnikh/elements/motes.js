const S = e.state || {};
const s = S.sun ?? 0.2;
for (let i = 0; i < 46; i++) {
  const bx = -10 + e.rnd() * 20,
    by = -0.3 - e.rnd() * 4.2;
  const ph = e.rnd() * 6.28;
  const x = bx + 0.5 * Math.sin(e.t * 0.05 + ph) + 0.15 * Math.sin(e.t * 0.17 + ph * 2);
  const y = by + 0.3 * Math.sin(e.t * 0.08 + ph * 1.3) + 0.08 * Math.sin(e.t * 0.3 + ph);
  const r = 0.015 + 0.025 * e.rnd();
  const a = (0.25 + 0.25 * Math.sin(e.t * 0.7 + ph)) * (0.6 + 0.7 * s);
  const rg = g.createRadialGradient(x, y, 0, x, y, r * 2.5);
  rg.addColorStop(0, "rgba(255,244,214," + a + ")");
  rg.addColorStop(1, "rgba(255,244,214,0)");
  g.fillStyle = rg;
  g.fillRect(x - r * 2.5, y - r * 2.5, r * 5, r * 5);
}
