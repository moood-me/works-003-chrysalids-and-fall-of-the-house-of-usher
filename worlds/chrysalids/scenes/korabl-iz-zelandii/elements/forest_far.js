function T(x, h, k, s, sw) {
  const n = 14,
    w = h * 0.03;
  const cx = (t) => s * h * 0.1 * t * t + Math.sin(t * 3.1 * (1 + k * 0.3) + s * 4) * h * 0.03 * t + sw * t * t;
  g.beginPath();
  g.moveTo(x - w * 2.2, 0.2);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    g.lineTo(x + cx(t) - w * (1.3 - 1.05 * t), -t * h);
  }
  for (let i = n; i >= 0; i--) {
    const t = i / n;
    g.lineTo(x + cx(t) + w * (1.3 - 1.05 * t), -t * h);
  }
  g.lineTo(x + w * 2.2, 0.2);
  g.fill();
  g.lineCap = "round";
  for (let b2 = 0; b2 < 5; b2++) {
    const t = 0.5 + (0.45 * b2) / 5;
    const bx = x + cx(t),
      by = -t * h,
      dd = b2 % 2 ? 1 : -1,
      L = h * (0.1 + 0.07 * Math.sin(b2 * 7 + s * 3));
    g.lineWidth = Math.max(w * (0.6 - 0.4 * t), 0.08);
    g.beginPath();
    g.moveTo(bx, by);
    if (k == 2) g.quadraticCurveTo(bx + dd * L, by - L * 0.4, bx + dd * L * 1.2, by + L);
    else g.quadraticCurveTo(bx + dd * L * 0.9, by, bx + dd * L * 0.6, by - L * 0.8);
    g.stroke();
  }
  if (k == 3) {
    g.beginPath();
    g.ellipse(x + cx(1), -h, h * 0.2, h * 0.05, s * 0.2, 0, 7);
    g.fill();
  }
}
g.fillStyle = "#5a5262";
g.strokeStyle = "#5a5262";
g.beginPath();
g.moveTo(-200, 2);
for (let x = -200; x <= 200; x += 4) g.lineTo(x, -2 - 2.5 * e.rnd());
g.lineTo(200, 2);
g.fill();
let i = 0;
for (let x = -200; x < 200; x += 3 + e.rnd() * 6) {
  i++;
  let h = 7 + e.rnd() * 9;
  if (e.rnd() < 0.1) h *= 1.7;
  const k = Math.floor(e.rnd() * 4),
    s = e.rnd() * 2 - 1;
  const sw = h * 0.005 * Math.sin(e.t * 0.15 + i);
  T(x, h, k, s, sw);
}
