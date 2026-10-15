function T(x, h, k, s, sw) {
  const n = 16,
    w = h * 0.03;
  const cx = (t) => s * h * 0.1 * t * t + Math.sin(t * 3.1 * (1 + k * 0.3) + s * 4) * h * 0.03 * t + sw * t * t;
  g.beginPath();
  g.moveTo(x - w * 2.2, 0.2);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    let hw = w * (1.3 - 1.05 * t);
    if (k == 1) hw += w * 2.4 * Math.exp(-Math.pow((t - 0.42) / 0.12, 2));
    g.lineTo(x + cx(t) - hw, -t * h);
  }
  for (let i = n; i >= 0; i--) {
    const t = i / n;
    let hw = w * (1.3 - 1.05 * t);
    if (k == 1) hw += w * 2.4 * Math.exp(-Math.pow((t - 0.42) / 0.12, 2));
    g.lineTo(x + cx(t) + hw, -t * h);
  }
  g.lineTo(x + w * 2.2, 0.2);
  g.fill();
  g.lineCap = "round";
  for (let b2 = 0; b2 < 6; b2++) {
    const t = 0.5 + (0.46 * b2) / 6;
    const bx = x + cx(t),
      by = -t * h,
      dd = b2 % 2 ? 1 : -1,
      L = h * (0.1 + 0.08 * Math.sin(b2 * 7 + s * 3));
    g.lineWidth = Math.max(w * (0.65 - 0.45 * t), 0.05);
    g.beginPath();
    g.moveTo(bx, by);
    if (k == 2) g.quadraticCurveTo(bx + dd * L, by - L * 0.4, bx + dd * L * 1.2 + sw, by + L * 1.1);
    else g.quadraticCurveTo(bx + dd * L * 0.9, by, bx + dd * L * 0.55 + sw, by - L * 0.85);
    g.stroke();
  }
  if (k == 3) {
    g.beginPath();
    g.ellipse(x + cx(1), -h, h * 0.2, h * 0.05, s * 0.2, 0, 7);
    g.fill();
  } else if (k == 0) {
    for (let c = 0; c < 3; c++) {
      g.beginPath();
      g.ellipse(x + cx(1) + Math.sin(c * 2 + s) * h * 0.06, -h + c * h * 0.05, h * 0.05, h * 0.03, 0, 0, 7);
      g.fill();
    }
  }
}
g.fillStyle = "#3e3746";
g.strokeStyle = "#3e3746";
for (let x = -90; x < 90; x += 2.2) {
  const r = 0.8 + e.rnd() * 1.4;
  g.beginPath();
  g.ellipse(x, -0.1, r * 1.4, r, 0, 0, 7);
  g.fill();
}
let i = 0;
for (let x = -90; x < 90; x += 4 + e.rnd() * 8) {
  i++;
  let h = 6 + e.rnd() * 7;
  if (e.rnd() < 0.15) h *= 1.6;
  const k = Math.floor(e.rnd() * 4),
    s = e.rnd() * 2 - 1;
  if (x > -22 && x < -6) continue;
  const sw = h * 0.006 * (Math.sin(e.t * 0.14 + i * 1.7) + 0.6 * Math.sin(e.t * 0.27 + i * 2.3));
  T(x, h, k, s, sw);
}
