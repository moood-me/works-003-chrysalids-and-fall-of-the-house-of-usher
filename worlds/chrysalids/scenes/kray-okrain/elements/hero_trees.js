function T(x, h, k, s, col, sw) {
  const n = 18,
    w = h * 0.03;
  const cx = (t) => s * h * 0.1 * t * t + Math.sin(t * 3.1 * (1 + k * 0.3) + s * 4) * h * 0.03 * t + sw * t * t;
  const P = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    let hw = w * (1.3 - 1.05 * t);
    if (k == 1) hw += w * 2.6 * Math.exp(-Math.pow((t - 0.42) / 0.12, 2));
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
function G(x, h, col, sw) {
  const n = 26,
    L = [],
    R = [],
    top = 0.58;
  const cxf = (t) => x + Math.sin(t * 3.6 + 0.4) * h * 0.03 * t + h * 0.06 * t * t + sw * t * t * 0.6;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const y = -t * h * top;
    const c = cxf(t);
    let w =
      h * 0.06 * (1 - 0.5 * t) +
      h * 0.075 * Math.exp(-t * 10) +
      h * 0.024 * Math.exp(-Math.pow((t - 0.38) / 0.06, 2)) +
      h * 0.016 * Math.exp(-Math.pow((t - 0.72) / 0.05, 2));
    const wob = h * 0.005 * Math.sin(t * 29 + 1);
    L.push([c - w + wob, y]);
    R.push([c + w + wob * 0.6, y]);
  }
  g.fillStyle = col;
  g.beginPath();
  g.moveTo(L[0][0] - h * 0.09, 0.15);
  g.quadraticCurveTo(L[0][0] - h * 0.02, -h * 0.01, L[1][0], L[1][1]);
  for (let i = 2; i <= n; i++) g.lineTo(L[i][0], L[i][1]);
  for (let i = n; i >= 1; i--) g.lineTo(R[i][0], R[i][1]);
  g.quadraticCurveTo(R[0][0] + h * 0.02, -h * 0.01, R[0][0] + h * 0.1, 0.15);
  g.closePath();
  g.fill();
  g.strokeStyle = col;
  g.lineCap = "round";
  for (const r of [
    [-1, 0.12, 0.05],
    [1, 0.14, 0.04],
    [-1, 0.2, 0.025],
    [1, 0.06, 0.03],
  ]) {
    g.lineWidth = h * r[2] * 0.5;
    g.beginPath();
    g.moveTo(x, -h * 0.03);
    g.quadraticCurveTo(x + r[0] * h * r[1] * 0.5, -h * 0.02, x + r[0] * h * r[1], 0.1);
    g.stroke();
  }
  g.fillStyle = col;
  g.beginPath();
  g.ellipse(cxf(0.55) + h * 0.05, -h * top * 0.55, h * 0.045, h * 0.06, 0.3, 0, 7);
  g.fill();
  const tips = [];
  function limb(x0, y0, a, len, w, d) {
    const bend = (e.rnd() - 0.5) * 0.9;
    const hh = Math.max(0, -y0 / h);
    const sx = sw * hh * hh * 0.6;
    const x1 = x0 + Math.cos(a + bend) * len + sx * 0.3,
      y1 = y0 + Math.sin(a + bend) * len;
    const kx = x0 + Math.cos(a + bend * 0.3) * len * 0.5 + (e.rnd() - 0.5) * len * 0.15,
      ky = y0 + Math.sin(a + bend * 0.3) * len * 0.5;
    g.strokeStyle = col;
    g.lineWidth = w;
    g.beginPath();
    g.moveTo(x0, y0);
    g.quadraticCurveTo(kx, ky, x1, y1);
    g.stroke();
    if (d > 0) {
      const s = 0.32 + e.rnd() * 0.38;
      limb(x1, y1, a + bend * 0.5 - s, len * 0.7, w * 0.62, d - 1);
      limb(x1, y1, a + bend * 0.5 + s * 0.85, len * 0.64, w * 0.6, d - 1);
      if (d >= 2 && e.rnd() < 0.5) limb(x1, y1, a + bend * 0.5 + (e.rnd() - 0.5) * 0.4, len * 0.5, w * 0.5, d - 2);
    } else tips.push([x1, y1, a + bend]);
  }
  const tx = cxf(1),
    ty = -h * top;
  limb(tx, ty, -Math.PI / 2 - 0.75, h * 0.17, h * 0.048, 4);
  limb(tx, ty, -Math.PI / 2 - 0.15, h * 0.16, h * 0.045, 4);
  limb(tx, ty, -Math.PI / 2 + 0.5, h * 0.15, h * 0.04, 4);
  limb(cxf(0.8), -h * top * 0.8, -Math.PI + 0.35, h * 0.16, h * 0.03, 3);
  limb(cxf(0.88), -h * top * 0.88, -0.25, h * 0.15, h * 0.028, 3);
  g.strokeStyle = col;
  g.lineWidth = h * 0.0025;
  for (let i = 0; i < tips.length; i++) {
    const q = tips[i];
    for (let j = 0; j < 2; j++) {
      const an = q[2] + (j ? 0.5 : -0.45) + (e.rnd() - 0.5) * 0.3;
      const L2 = h * (0.012 + e.rnd() * 0.02);
      g.beginPath();
      g.moveTo(q[0], q[1]);
      g.lineTo(q[0] + Math.cos(an) * L2, q[1] + Math.sin(an) * L2);
      g.stroke();
    }
  }
  for (let i = 0; i < tips.length; i += 5) {
    const q = tips[i];
    const L2 = h * (0.05 + e.rnd() * 0.08);
    const s2 = 0.25 * Math.sin(e.t * 0.4 + i) + sw * 0.3;
    g.lineWidth = h * 0.003;
    g.beginPath();
    g.moveTo(q[0], q[1]);
    g.quadraticCurveTo(q[0] + s2 * 0.5, q[1] + L2 * 0.6, q[0] + s2, q[1] + L2);
    g.stroke();
    g.fillStyle = col;
    g.beginPath();
    g.ellipse(q[0] + s2, q[1] + L2 + h * 0.008, h * 0.006, h * 0.01, 0, 0, 7);
    g.fill();
  }
  g.strokeStyle = "rgba(110,126,160,0.32)";
  g.lineWidth = h * 0.004;
  g.beginPath();
  for (let i = 1; i <= n; i++) {
    i == 1 ? g.moveTo(L[i][0] + h * 0.004, L[i][1]) : g.lineTo(L[i][0] + h * 0.004, L[i][1]);
  }
  g.stroke();
}
const t = e.t;
T(-2.2, 11, 1, -0.35, "#0f1625", 0.12 * Math.sin(t * 0.13) + 0.08 * Math.sin(t * 0.31));
T(8.5, 8, 3, 0.45, "#0f1625", 0.1 * Math.sin(t * 0.11 + 1) + 0.05 * Math.sin(t * 0.27));
G(-7.5, 12.5, "#0e1523", 0.15 * Math.sin(t * 0.09 + 2) + 0.08 * Math.sin(t * 0.23));
