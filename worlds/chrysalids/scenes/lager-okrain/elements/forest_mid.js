function T(x, h, k, s, col, sw) {
  const n = 18,
    w = h * 0.032;
  const cx = (t) => s * h * 0.1 * t * t + Math.sin(t * 3.1 * (1 + k * 0.3) + s * 4) * h * 0.03 * t + sw * t * t;
  const P = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    let hw = w * (1.3 - 1.05 * t);
    if (k == 1) hw += w * 2.8 * Math.exp(-Math.pow((t - 0.42) / 0.12, 2));
    P.push([cx(t), -t * h, hw]);
  }
  g.fillStyle = col;
  g.strokeStyle = col;
  g.beginPath();
  g.moveTo(x + P[0][0] - P[0][2] * 1.8, 0.1);
  for (const p of P) g.lineTo(x + p[0] - p[2], p[1]);
  for (let i = n; i >= 0; i--) {
    const p = P[i];
    g.lineTo(x + p[0] + p[2], p[1]);
  }
  g.lineTo(x + P[0][0] + P[0][2] * 1.8, 0.1);
  g.closePath();
  g.fill();
  g.lineCap = "round";
  const tx = x + cx(1),
    ty = -h;
  const nb = k == 0 ? 6 : k == 2 ? 8 : 3;
  for (let b = 0; b < nb; b++) {
    const t = 0.5 + 0.48 * (b / nb);
    const bx = x + cx(t),
      by = -t * h;
    const d = b % 2 ? 1 : -1;
    const L = h * (0.1 + 0.08 * Math.sin(b * 7.3 + s * 3));
    g.lineWidth = Math.max(w * (0.7 - 0.45 * t), 0.05);
    g.beginPath();
    g.moveTo(bx, by);
    if (k == 2) {
      g.quadraticCurveTo(bx + d * L, by - L * 0.4, bx + d * L * 1.2 + sw * 0.5, by + L * 1.1);
    } else {
      g.quadraticCurveTo(bx + d * L * 0.9, by - L * 0.05, bx + d * L * 0.55 + sw * 0.6, by - L * 0.85);
    }
    g.stroke();
  }
  if (k == 3) {
    g.beginPath();
    g.ellipse(tx + sw * 0.3, ty, h * 0.2, h * 0.05, s * 0.15, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.ellipse(tx + sw * 0.3 - h * 0.04, ty + h * 0.035, h * 0.11, h * 0.035, 0, 0, Math.PI * 2);
    g.fill();
  } else if (k != 2) {
    for (let c = 0; c < 4; c++) {
      g.beginPath();
      g.ellipse(
        tx + Math.sin(c * 2.1 + s) * h * 0.06 + sw * 0.5,
        ty + c * h * 0.045 - h * 0.02,
        h * (0.04 + 0.025 * ((c * 5 + k) % 3)),
        h * 0.03,
        Math.sin(c + s) * 0.4,
        0,
        Math.PI * 2,
      );
      g.fill();
    }
  }
}
const C = "#0e131e";
g.fillStyle = C;
for (let x = -70; x < 70; x += 2.2) {
  if (x > -9 && x < 6) continue;
  const r = 0.8 + e.rnd() * 1.6;
  g.beginPath();
  g.ellipse(x, -0.2, r * 1.5, r, 0, 0, 7);
  g.fill();
}
const L = [
  [-30, 13, 0, 0.3],
  [-24, 11, 1, -0.4],
  [-17, 14, 2, 0.5],
  [-12.5, 10, 1, -0.2],
  [-9, 12, 3, 0.6],
  [7, 11, 3, -0.5],
  [10.5, 13, 1, 0.3],
  [15, 10, 0, -0.6],
  [20, 14, 2, 0.2],
  [27, 12, 1, -0.3],
  [33, 11, 0, 0.4],
];
L.forEach((q, i) => {
  const sw = q[1] * 0.007 * (Math.sin(e.t * 0.15 + i * 1.7) + 0.6 * Math.sin(e.t * 0.27 + i * 2.3));
  T(q[0], q[1], q[2], q[3], C, sw);
});
