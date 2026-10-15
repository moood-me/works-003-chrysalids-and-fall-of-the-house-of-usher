const A = e.aspect,
  S = e.state || {};
const d = S.dawn ?? 0.6,
  sm = S.smoke ?? 0.5;
for (let c = 0; c < 9; c++) {
  const cy = 0.05 + e.rnd() * 0.42;
  const cx0 = e.rnd() * (A + 1.2) - 0.6;
  const len = 0.3 + e.rnd() * 0.6;
  const dr = e.t * 0.002 * (0.5 + e.rnd());
  const n = 7 + Math.floor(e.rnd() * 5);
  const al = (0.04 + e.rnd() * 0.04) * (0.5 + sm);
  for (let k = 0; k < n; k++) {
    const u = k / (n - 1) - 0.5;
    let x = cx0 + u * len + (e.rnd() - 0.5) * 0.07 + dr;
    x = ((((x + 0.7) % (A + 1.4)) + (A + 1.4)) % (A + 1.4)) - 0.7;
    const y = cy + (e.rnd() - 0.5) * 0.02 + u * u * 0.025;
    const rx = 0.06 + e.rnd() * 0.1,
      ry = 0.01 + e.rnd() * 0.014;
    const a = al * (1 - Math.abs(u) * 1.3) * (0.75 + 0.25 * Math.sin(e.t * 0.05 + k + c));
    if (a <= 0) continue;
    const lit = cy > 0.35 ? 1 : 0.6;
    const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    const col = d > 0.3 ? "190,160,168" : "120,120,140";
    rg.addColorStop(0, "rgba(" + col + "," + a * lit + ")");
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
