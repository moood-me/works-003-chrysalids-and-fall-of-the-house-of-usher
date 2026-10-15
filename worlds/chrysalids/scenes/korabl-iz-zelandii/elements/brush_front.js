const S = e.state || {};
const w = S.web ?? 0.6;
const C = "#1f1b24";
g.fillStyle = C;
g.beginPath();
g.moveTo(-4, 1.5);
g.quadraticCurveTo(-2.5, 0.2, -0.5, -0.2);
g.quadraticCurveTo(1.5, -0.6, 3, -0.4);
g.quadraticCurveTo(4.5, -0.3, 6, -0.5);
g.lineTo(6, 1.5);
g.closePath();
g.fill();
g.strokeStyle = C;
g.lineCap = "round";
const tips = [];
for (let i = 0; i < 30; i++) {
  const x = -2 + e.rnd() * 8;
  const base = -0.3;
  const h = 0.4 + e.rnd() * e.rnd() * 2.4;
  const l = (e.rnd() - 0.5) * 1.2;
  const sw = 0.04 * Math.sin(e.t * 0.35 + i) + 0.02 * Math.sin(e.t * 0.83 + i * 1.7);
  g.lineWidth = 0.02 + e.rnd() * 0.035;
  g.beginPath();
  g.moveTo(x, base + 0.3);
  g.quadraticCurveTo(x + l * h * 0.2, base - h * 0.6, x + (l + sw) * h, base - h);
  g.stroke();
  tips.push([x + (l + sw) * h, base - h]);
}
g.fillStyle = C;
for (let i = 0; i < 6; i++) {
  const p = tips[(i * 5) % tips.length];
  g.beginPath();
  g.ellipse(p[0], p[1], 0.06, 0.14, 0.4, 0, 7);
  g.fill();
}
if (w > 0.01) {
  g.lineWidth = 0.006;
  for (let i = 0; i < tips.length; i += 2) {
    const a = tips[i],
      b = tips[(i + 3) % tips.length];
    g.strokeStyle = "rgba(236,226,230," + 0.14 * w + ")";
    g.beginPath();
    g.moveTo(a[0], a[1]);
    g.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.25 + 0.05 * Math.sin(e.t * 0.3 + i), b[0], b[1]);
    g.stroke();
  }
  for (let i = 0; i < 14; i++) {
    const p = tips[i];
    const tw = Math.max(0, Math.sin(e.t * (0.5 + e.rnd() * 0.6) + i * 2.1));
    g.fillStyle = "rgba(250,240,230," + 0.7 * tw * w + ")";
    g.beginPath();
    g.arc(p[0] + 0.1, p[1] + 0.2, 0.015, 0, 7);
    g.fill();
  }
}
