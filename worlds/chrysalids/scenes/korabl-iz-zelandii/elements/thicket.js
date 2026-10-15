const S = e.state || {};
const w = S.web ?? 0.6;
const C = "#2f2935";
g.strokeStyle = C;
g.lineCap = "round";
const tips = [];
for (let i = 0; i < 46; i++) {
  const x = -15 + e.rnd() * 30;
  const h = 0.6 + e.rnd() * e.rnd() * 3.6;
  const l = (e.rnd() - 0.5) * 1.5;
  const sw = 0.05 * Math.sin(e.t * 0.3 + i) + 0.025 * Math.sin(e.t * 0.71 + i * 2);
  const ex = x + (l + sw) * h,
    ey = -h;
  g.lineWidth = 0.03 + e.rnd() * 0.05;
  g.beginPath();
  g.moveTo(x, 0.2);
  g.quadraticCurveTo(x + l * h * 0.15 + e.rnd() * 0.5 - 0.25, -h * 0.6, ex, ey);
  g.stroke();
  if (e.rnd() < 0.6) {
    const bx = x + (l + sw) * h * 0.55,
      by = -h * 0.55;
    const d = e.rnd() < 0.5 ? 1 : -1;
    g.lineWidth = 0.022;
    g.beginPath();
    g.moveTo(bx, by);
    g.quadraticCurveTo(bx + d * 0.5, by - 0.25, bx + d * 0.7, by + 0.2);
    g.stroke();
  }
  tips.push([ex, ey]);
}
g.fillStyle = C;
for (let x = -16; x < 16; x += 0.8) {
  const r = 0.25 + e.rnd() * 0.45;
  g.beginPath();
  g.ellipse(x, 0.05, r * 1.8, r * 0.7, 0, Math.PI, 0);
  g.fill();
}
if (w > 0.01) {
  g.lineWidth = 0.009;
  for (let i = 0; i < tips.length; i++) {
    if (e.rnd() < 0.35) continue;
    const a = tips[i],
      b = tips[(i + 5) % tips.length];
    if (Math.abs(a[0] - b[0]) > 5) continue;
    g.strokeStyle = "rgba(236,226,230," + 0.16 * w + ")";
    g.beginPath();
    g.moveTo(a[0], a[1]);
    g.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.5 + 0.08 * Math.sin(e.t * 0.25 + i), b[0], b[1]);
    g.stroke();
  }
  for (let i = 0; i < 50; i++) {
    const p = tips[i % tips.length];
    const x = p[0] + (e.rnd() - 0.5) * 1.4,
      y = p[1] + e.rnd() * 1.8;
    const tw = Math.max(0, Math.sin(e.t * (0.5 + e.rnd() * 0.7) + i * 1.9));
    g.fillStyle = "rgba(250,240,230," + 0.65 * tw * w + ")";
    g.beginPath();
    g.arc(x, y, 0.028, 0, 7);
    g.fill();
  }
}
