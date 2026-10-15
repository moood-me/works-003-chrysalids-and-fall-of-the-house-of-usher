const S = e.state || {},
  s = S.season ?? 0,
  r = S.rain ?? 0,
  t = e.t;
const P = [-1.7, 0.1, 1.9, 3.7, 5.1, 6.4];
const col = r > 0.3 ? "#463e36" : "#51473e";
const lt = "rgba(196,182,150,0.28)";
const rail = (x1, x2, y, th, tilt, sag) => {
  const n = 6,
    pts = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    pts.push([x1 + (x2 - x1) * u, y + tilt * (u - 0.5) + sag * Math.sin(Math.PI * u) + (e.rnd() - 0.5) * 0.01]);
  }
  g.fillStyle = col;
  g.beginPath();
  pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1] - th / 2) : g.moveTo(p[0], p[1] - th / 2)));
  for (let i = n; i >= 0; i--) g.lineTo(pts[i][0], pts[i][1] + th / 2);
  g.closePath();
  g.fill();
  g.strokeStyle = lt;
  g.lineWidth = 0.014;
  g.beginPath();
  pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1] - th / 2 + 0.008) : g.moveTo(p[0], p[1] - th / 2 + 0.008)));
  g.stroke();
};
for (let i = 0; i < P.length - 1; i++) {
  const a = P[i] - 0.05,
    b = P[i + 1] + 0.05;
  for (const y of [-0.42, -0.82, -1.17]) {
    const th = 0.08 + e.rnd() * 0.03,
      tl = (e.rnd() - 0.5) * 0.07,
      sg = 0.015 + e.rnd() * 0.03;
    if (i === 1 && y === -0.82) {
      g.save();
      g.translate(a, y);
      g.rotate(0.42);
      rail(0, 1.5, 0, th, 0, 0.01);
      g.restore();
      continue;
    }
    if (i === 4 && y !== -1.17) continue;
    rail(a, b, y, th, tl, sg);
  }
}
P.forEach((x, i) => {
  const h = (i === P.length - 1 ? 1.42 : 1.28) + e.rnd() * 0.08,
    w = 0.12 + e.rnd() * 0.04,
    l = (e.rnd() - 0.5) * 0.05;
  g.fillStyle = col;
  g.beginPath();
  g.moveTo(x - w / 2, 0.04);
  g.lineTo(x - w / 2 + l, -h);
  g.lineTo(x + w / 2 + l, -h - 0.05);
  g.lineTo(x + w / 2, 0.04);
  g.closePath();
  g.fill();
  g.fillStyle = lt;
  g.beginPath();
  g.moveTo(x - w / 2 + l, -h);
  g.lineTo(x + w / 2 + l, -h - 0.05);
  g.lineTo(x + w / 2 + l, -h - 0.02);
  g.lineTo(x - w / 2 + l, -h + 0.025);
  g.closePath();
  g.fill();
});
const gc = s < 0.5 ? "#5a5638" : "#5a5244";
g.fillStyle = gc;
for (let i = 0; i < 150; i++) {
  const x = -2 + e.rnd() * 8.6,
    h = 0.08 + Math.pow(e.rnd(), 2) * 0.45 * (1 - 0.4 * s),
    ph = e.rnd() * 6.28;
  const l = (e.rnd() - 0.5) * 0.5 + 0.06 * Math.sin(t * 0.45 + ph) + 0.03 * Math.sin(t * 1.1 + ph);
  g.beginPath();
  g.moveTo(x - 0.012, 0.03);
  g.quadraticCurveTo(x + l * h * 0.4, -h * 0.6, x + l * h, -h);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.006, -h * 0.5, x + 0.012, 0.03);
  g.fill();
}
