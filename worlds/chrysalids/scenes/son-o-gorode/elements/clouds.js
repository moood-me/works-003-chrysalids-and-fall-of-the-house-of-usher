const A = e.aspect,
  S = e.state || {};
const li = S.lights ?? 0.7,
  w = S.waking ?? 0;
const cx = A * 0.665;
for (let c = 0; c < 7; c++) {
  const cy = 0.2 + e.rnd() * 0.34;
  const x0 = e.rnd() * (A + 1) - 0.5;
  const len = 0.4 + e.rnd() * 0.7;
  const n = 8;
  const sp = 0.0015 * (0.5 + e.rnd());
  for (let j = 0; j < n; j++) {
    const u = j / (n - 1) - 0.5;
    let x = x0 + u * len + (e.rnd() - 0.5) * 0.06 + e.t * sp;
    x = ((((x + 0.6) % (A + 1.2)) + (A + 1.2)) % (A + 1.2)) - 0.6;
    const y = cy + (e.rnd() - 0.5) * 0.015 + u * u * 0.02;
    const rx = 0.07 + e.rnd() * 0.12,
      ry = 0.008 + e.rnd() * 0.01;
    const prox = Math.max(0, 1 - Math.abs(x - cx) / 0.7) * Math.max(0, (y - 0.15) / 0.45);
    const a =
      (0.05 + 0.1 * prox * li) * (1 - Math.abs(u) * 1.4) * (0.8 + 0.2 * Math.sin(e.t * 0.04 + j + c)) * (1 - 0.6 * w);
    if (a <= 0) continue;
    const col = prox > 0.3 ? "226,196,180" : "150,146,190";
    const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    rg.addColorStop(0, "rgba(" + col + "," + a + ")");
    rg.addColorStop(1, "rgba(" + col + ",0)");
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
