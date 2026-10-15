const S = e.state || {};
const f = S.fire ?? 0.8;
const t = e.t;
const sw = 0.06 * Math.sin(t * 0.11) + 0.04 * Math.sin(t * 0.27);
const w = f * 0.22 * (0.85 + 0.1 * Math.sin(t * 6.1));
const gr = g.createLinearGradient(1.5, 0, 0.2, 0);
gr.addColorStop(
  0,
  "rgb(" + (11 + Math.round(50 * w)) + "," + (13 + Math.round(22 * w)) + "," + (20 + Math.round(6 * w)) + ")",
);
gr.addColorStop(1, "#0a0e15");
g.fillStyle = gr;
const n = 26,
  L = [],
  R = [];
for (let i = 0; i <= n; i++) {
  const u = i / n;
  const y = -u * 5.4;
  const c = Math.sin(u * 2.4) * 0.35 + u * u * 0.7;
  const wd =
    0.45 * (1 - 0.45 * u) +
    0.75 * Math.exp(-Math.pow((u - 0.42) / 0.13, 2)) +
    0.55 * Math.exp(-u * 9) +
    0.03 * Math.sin(u * 31);
  L.push([c - wd, y]);
  R.push([c + wd * 0.9, y]);
}
g.beginPath();
g.moveTo(L[0][0] - 0.6, 0.3);
g.quadraticCurveTo(L[0][0] - 0.1, 0.1, L[1][0], L[1][1]);
for (let i = 2; i <= n; i++) g.lineTo(L[i][0], L[i][1]);
for (let i = n; i >= 1; i--) g.lineTo(R[i][0], R[i][1]);
g.quadraticCurveTo(R[0][0] + 0.1, 0.1, R[0][0] + 0.7, 0.3);
g.closePath();
g.fill();
g.fillStyle = "#0a0e15";
g.strokeStyle = "#0a0e15";
g.lineCap = "round";
function limb(x0, y0, a, len, wd, dep) {
  const x1 = x0 + Math.cos(a) * len + sw * -y0 * 0.06,
    y1 = y0 + Math.sin(a) * len;
  const kx = (x0 + x1) / 2 + Math.cos(a + 1.57) * len * 0.13,
    ky = (y0 + y1) / 2 + Math.sin(a + 1.57) * len * 0.13;
  g.lineWidth = wd;
  g.beginPath();
  g.moveTo(x0, y0);
  g.quadraticCurveTo(kx, ky, x1, y1);
  g.stroke();
  if (dep > 0) {
    const s = 0.35 + e.rnd() * 0.3;
    limb(x1, y1, a - s, len * 0.68, wd * 0.62, dep - 1);
    limb(x1, y1, a + s * 0.9, len * 0.62, wd * 0.6, dep - 1);
  } else if (e.rnd() < 0.45) {
    const hl = 0.3 + e.rnd() * 0.9;
    g.lineWidth = 0.02;
    g.beginPath();
    g.moveTo(x1, y1);
    g.quadraticCurveTo(x1 + sw, y1 + hl * 0.6, x1 + sw * 2 + 0.05, y1 + hl);
    g.stroke();
  }
}
const tx = (L[n][0] + R[n][0]) / 2,
  ty = -5.4;
limb(tx, ty, -0.3, 2.8, 0.34, 4);
limb(tx, ty, -1.5, 1.8, 0.28, 3);
limb(tx - 0.2, ty + 0.8, -2.7, 1.5, 0.22, 3);
