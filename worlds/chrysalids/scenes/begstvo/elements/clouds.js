const A = e.aspect,
  S = e.state || {},
  d = S.dawn ?? 0.3,
  DX = A * 0.74;
for (let c = 0; c < 8; c++) {
  const y = 0.3 + e.rnd() * 0.26;
  const x0 = e.rnd() * (A + 1) - 0.5;
  const len = 0.3 + e.rnd() * 0.4;
  let x = x0 + e.t * 0.0016 * (0.6 + e.rnd());
  x = ((((x + 0.8) % (A + 1.6)) + (A + 1.6)) % (A + 1.6)) - 0.8;
  const near = Math.max(0, 1 - Math.abs(x - DX) / 0.9);
  const n = 7 + Math.floor(e.rnd() * 5);
  for (let k = 0; k < n; k++) {
    const u = k / (n - 1) - 0.5;
    if (e.rnd() < 0.2) continue;
    const cx = x + u * len + (e.rnd() - 0.5) * 0.05,
      cy = y + (e.rnd() - 0.5) * 0.016 + u * u * 0.02;
    const rx = 0.04 + e.rnd() * 0.07,
      ry = 0.012 + e.rnd() * 0.014;
    const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    const a = (0.16 + 0.1 * e.rnd()) * (1 - Math.abs(u) * 1.1) * (0.8 + 0.2 * Math.sin(e.t * 0.05 + k + c));
    if (a <= 0) continue;
    rg.addColorStop(0, "rgba(22,32,56," + a + ")");
    rg.addColorStop(0.6, "rgba(22,32,56," + a * 0.5 + ")");
    rg.addColorStop(1, "rgba(22,32,56,0)");
    g.save();
    g.translate(cx, cy);
    g.scale(rx, ry);
    g.fillStyle = rg;
    g.beginPath();
    g.arc(0, 0, 1, 0, 7);
    g.fill();
    g.restore();
    if (near > 0) {
      const lg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
      const la = near * (0.04 + 0.28 * d) * (1 - Math.abs(u));
      lg.addColorStop(0, "rgba(200,192,176," + la + ")");
      lg.addColorStop(1, "rgba(200,192,176,0)");
      g.save();
      g.translate(cx + 0.006, cy + ry * 0.55);
      g.scale(rx * 0.8, ry * 0.4);
      g.fillStyle = lg;
      g.beginPath();
      g.arc(0, 0, 1, 0, 7);
      g.fill();
      g.restore();
    }
  }
}
