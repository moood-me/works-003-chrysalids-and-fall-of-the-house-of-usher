const S = e.state || {},
  s = S.season ?? 0,
  t = e.t;
const M = (a, b, k) => "rgba(" + a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",") + ",0.75)";
const cols = [M([110, 102, 70], [100, 92, 80], s), M([124, 114, 80], [110, 102, 90], s)];
for (let i = 0; i < 18; i++) {
  const cx = -6.8 + e.rnd() * 13.6,
    cy = -0.05 + e.rnd() * 0.35,
    n = 5 + Math.floor(e.rnd() * 9),
    H = 0.1 + e.rnd() * 0.22,
    ph = e.rnd() * 6.28;
  g.fillStyle = cols[i % 2];
  for (let k = 0; k < n; k++) {
    const x = cx + (e.rnd() - 0.5) * 0.4,
      h = H * (0.4 + 0.6 * e.rnd());
    const l =
      (x - cx) * 1.3 + (e.rnd() - 0.5) * 0.3 + 0.07 * Math.sin(t * 0.45 + ph + k * 0.4) + 0.03 * Math.sin(t * 1.2 + ph);
    g.beginPath();
    g.moveTo(x - 0.007, cy + 0.02);
    g.quadraticCurveTo(x + l * h * 0.4, cy - h * 0.6, x + l * h, cy - h);
    g.quadraticCurveTo(x + l * h * 0.4 + 0.003, cy - h * 0.5, x + 0.007, cy + 0.02);
    g.fill();
  }
}
