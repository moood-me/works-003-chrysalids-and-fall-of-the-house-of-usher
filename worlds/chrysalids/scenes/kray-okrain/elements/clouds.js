const A = e.aspect;
for (let c = 0; c < 7; c++) {
  const cy = 0.06 + e.rnd() * 0.3;
  const cx0 = e.rnd() * (A + 1.2) - 0.6;
  const len = 0.25 + e.rnd() * 0.5;
  const drift = e.t * 0.0025 * (0.6 + e.rnd() * 0.8);
  const n = 6 + Math.floor(e.rnd() * 6);
  const al = 0.035 + e.rnd() * 0.035;
  for (let k = 0; k < n; k++) {
    const u = k / (n - 1) - 0.5;
    if (e.rnd() < 0.25) continue;
    let x = cx0 + u * len + (e.rnd() - 0.5) * 0.06 + drift;
    x = ((((x + 0.7) % (A + 1.4)) + (A + 1.4)) % (A + 1.4)) - 0.7;
    const y = cy + (e.rnd() - 0.5) * 0.018 + u * u * 0.02;
    const rx = 0.05 + e.rnd() * 0.09,
      ry = 0.008 + e.rnd() * 0.012;
    const a = al * (1 - Math.abs(u) * 1.2) * (0.7 + 0.3 * Math.sin(e.t * 0.05 + k + c));
    if (a <= 0) continue;
    const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    rg.addColorStop(0, "rgba(92,108,142," + a + ")");
    rg.addColorStop(0.6, "rgba(80,96,130," + a * 0.4 + ")");
    rg.addColorStop(1, "rgba(70,86,120,0)");
    g.save();
    g.translate(x, y);
    g.scale(rx, ry);
    g.fillStyle = rg;
    g.beginPath();
    g.arc(0, 0, 1, 0, 7);
    g.fill();
    g.restore();
  }
}
