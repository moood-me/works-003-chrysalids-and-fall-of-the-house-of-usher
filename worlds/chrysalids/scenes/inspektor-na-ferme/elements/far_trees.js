const S = e.state || {},
  s = S.season ?? 0;
const M = (a, b, t) => "rgb(" + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",") + ")";
const R = (x) =>
  (13 + 5 * Math.sin(x * 0.011 + 1) + 3 * Math.sin(x * 0.037) + 2 * Math.sin(x * 0.09 + 2)) * (1 - 0.2 * s);
g.fillStyle = M([176, 166, 130], [158, 156, 150], s);
g.beginPath();
g.moveTo(-1600, 4);
for (let x = -1600; x <= 1600; x += 8) g.lineTo(x, -R(x) * 0.6);
g.lineTo(1600, 4);
g.closePath();
g.fill();
for (let x = -1600; x < 1600; x += 5 + e.rnd() * 11) {
  const w = (4 + e.rnd() * 7) * (1 - 0.35 * s);
  const k = e.rnd();
  const cy = -R(x) * 0.6 - w * 0.2 * (0.4 + k);
  g.beginPath();
  g.ellipse(x, cy, w, w * 0.7, 0, 0, 7);
  g.fill();
}
