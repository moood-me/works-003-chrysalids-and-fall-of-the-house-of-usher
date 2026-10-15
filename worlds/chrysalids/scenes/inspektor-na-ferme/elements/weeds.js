const S = e.state || {},
  s = S.season ?? 0,
  t = e.t;
const M = (a, b, k) => "rgb(" + a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",") + ")";
const cols = [M([66, 60, 42], [70, 64, 56], s), M([78, 70, 48], [82, 74, 64], s), M([58, 52, 38], [60, 56, 50], s)];
for (let i = 0; i < 46; i++) {
  const side = e.rnd() < 0.55 ? -1 : 1;
  const cx = side * (2.4 + Math.pow(e.rnd(), 0.7) * 3.2);
  const cy = 0.1 + e.rnd() * 0.2;
  const n = 6 + Math.floor(e.rnd() * 10);
  const H = (0.15 + e.rnd() * 0.55) * (0.5 + 0.5 * Math.min(1, (Math.abs(cx) - 2.2) / 1.5)) * (1 - 0.3 * s);
  const ph = e.rnd() * 6.28;
  g.fillStyle = cols[Math.floor(e.rnd() * 3)];
  for (let k = 0; k < n; k++) {
    const x = cx + (e.rnd() - 0.5) * 0.5;
    const h = H * (0.4 + 0.6 * e.rnd());
    const l =
      (x - cx) * 0.9 +
      (e.rnd() - 0.5) * 0.3 +
      0.07 * Math.sin(t * 0.42 + ph + k * 0.3) +
      0.03 * Math.sin(t * 1.13 + ph);
    g.beginPath();
    g.moveTo(x - 0.012, cy + 0.05);
    g.quadraticCurveTo(x + l * h * 0.4, cy - h * 0.6, x + l * h, cy - h);
    g.quadraticCurveTo(x + l * h * 0.4 + 0.006, cy - h * 0.5, x + 0.012, cy + 0.05);
    g.fill();
    if (e.rnd() < 0.08) {
      g.beginPath();
      g.ellipse(x + l * h, cy - h - 0.03, 0.014, 0.05, l, 0, 7);
      g.fill();
    }
  }
}
