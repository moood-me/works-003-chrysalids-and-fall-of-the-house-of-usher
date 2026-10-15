const S = e.state || {};
const f = S.fire ?? 0.8;
const t = e.t;
const F = f * (0.85 + 0.1 * Math.sin(t * 2.3) + 0.06 * Math.sin(t * 5.3 + 1));
const dk = "#0b0d16";
const rim = "rgba(222,128,66," + 0.8 * F + ")";
function L(x1, y1, x2, y2, w1, w2) {
  const dx = x2 - x1,
    dy = y2 - y1,
    l = Math.hypot(dx, dy) || 1,
    nx = -dy / l,
    ny = dx / l;
  g.beginPath();
  g.moveTo(x1 + (nx * w1) / 2, y1 + (ny * w1) / 2);
  g.lineTo(x2 + (nx * w2) / 2, y2 + (ny * w2) / 2);
  g.lineTo(x2 - (nx * w2) / 2, y2 - (ny * w2) / 2);
  g.lineTo(x1 - (nx * w1) / 2, y1 - (ny * w1) / 2);
  g.closePath();
  g.fill();
  g.beginPath();
  g.arc(x1, y1, w1 / 2, 0, 7);
  g.fill();
  g.beginPath();
  g.arc(x2, y2, w2 / 2, 0, 7);
  g.fill();
}
const b = 0.01 * Math.sin(t * 1.05) + 0.005 * Math.sin(t * 0.43);
const ga = 0.16 * Math.sin(t * 0.29) + 0.07 * Math.sin(t * 0.71 + 1);
function log(col, ox) {
  g.fillStyle = col;
  g.beginPath();
  g.moveTo(-0.55 + ox, -0.02);
  g.lineTo(-0.55 + ox, -0.36);
  g.quadraticCurveTo(-0.5 + ox, -0.42, -0.1 + ox, -0.42);
  g.lineTo(0.36 + ox, -0.42);
  g.quadraticCurveTo(0.44 + ox, -0.21, 0.36 + ox, 0);
  g.closePath();
  g.fill();
}
log(rim, 0.03);
log("#100e14", 0);
g.strokeStyle = "rgba(30,28,36,0.8)";
g.lineWidth = 0.012;
for (const y of [-0.3, -0.18, -0.1]) {
  g.beginPath();
  g.moveTo(-0.5, y);
  g.quadraticCurveTo(-0.1, y + 0.02, 0.3, y - 0.01);
  g.stroke();
}
function arm() {
  const sx = 0.22,
    sy = -1.1 + b;
  const a1 = -0.18 + ga * 0.35,
    a2 = -0.72 + ga * 0.8;
  const ex = sx + Math.cos(a1) * 0.3,
    ey = sy + Math.sin(a1) * 0.3;
  const wx = ex + Math.cos(a2) * 0.27,
    wy = ey + Math.sin(a2) * 0.27;
  g.beginPath();
  g.moveTo(sx - 0.04, sy - 0.08);
  g.quadraticCurveTo(sx + 0.12, sy - 0.1, ex + 0.02, ey - 0.06);
  g.quadraticCurveTo(ex + 0.075, ey - 0.02, ex + 0.03, ey + 0.055);
  g.quadraticCurveTo(sx + 0.1, sy + 0.07, sx - 0.02, sy + 0.08);
  g.closePath();
  g.fill();
  L(ex, ey, wx, wy, 0.11, 0.075);
  const a3 = a2 + 0.18 + 0.06 * Math.sin(t * 0.5);
  g.save();
  g.translate(wx, wy);
  g.rotate(a3);
  g.beginPath();
  g.moveTo(-0.01, -0.035);
  g.quadraticCurveTo(0.05, -0.045, 0.085, -0.03);
  g.lineTo(0.09, 0.03);
  g.quadraticCurveTo(0.04, 0.04, -0.01, 0.035);
  g.closePath();
  g.fill();
  g.lineCap = "round";
  const sp = 0.04 * Math.sin(t * 0.37);
  const fs = [
    [-0.022, -0.32 - sp, 0.06],
    [-0.007, -0.12, 0.075],
    [0.008, 0.06 + sp, 0.072],
    [0.022, 0.24 + sp * 1.5, 0.058],
  ];
  for (const q of fs) {
    g.lineWidth = 0.019;
    g.beginPath();
    g.moveTo(0.08, q[0]);
    g.quadraticCurveTo(
      0.08 + Math.cos(q[1]) * q[2] * 0.6,
      q[0] + Math.sin(q[1]) * q[2] * 0.6 - 0.004,
      0.08 + Math.cos(q[1]) * q[2],
      q[0] + Math.sin(q[1]) * q[2],
    );
    g.stroke();
  }
  g.lineWidth = 0.022;
  g.beginPath();
  g.moveTo(0.03, -0.03);
  g.quadraticCurveTo(0.05, -0.07, 0.08, -0.085);
  g.stroke();
  g.restore();
}
function fig(col, ox) {
  g.save();
  g.translate(ox, 0);
  g.fillStyle = col;
  g.strokeStyle = col;
  arm();
  L(0.08, -0.42, 0.94, -0.08, 0.2, 0.115);
  g.beginPath();
  g.moveTo(0.88, -0.02);
  g.lineTo(0.9, -0.14);
  g.quadraticCurveTo(0.98, -0.22, 1.04, -0.18);
  g.lineTo(1.08, -0.06);
  g.quadraticCurveTo(1.04, 0.0, 0.9, 0.0);
  g.closePath();
  g.fill();
  L(0.06, -0.47, 0.48, -0.52, 0.21, 0.15);
  L(0.48, -0.52, 0.5, -0.06, 0.14, 0.11);
  g.beginPath();
  g.ellipse(0.56, -0.045, 0.13, 0.05, 0, 0, 7);
  g.fill();
  g.beginPath();
  g.moveTo(-0.18, -0.4);
  g.bezierCurveTo(-0.23, -0.62, -0.19, -0.9 + b, -0.06, -1.08 + b);
  g.bezierCurveTo(0.04, -1.19 + b, 0.25, -1.21 + b, 0.35, -1.09 + b);
  g.bezierCurveTo(0.42, -0.95, 0.39, -0.7, 0.33, -0.55);
  g.lineTo(0.26, -0.42);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(-0.18, -0.42);
  g.quadraticCurveTo(-0.27, -0.3, -0.28, -0.18);
  g.lineTo(-0.16, -0.24);
  g.lineTo(-0.08, -0.3);
  g.lineTo(0.0, -0.4);
  g.fill();
  const hx2 = 0.37,
    hy2 = -1.27 + b + 0.01 * Math.sin(t * 0.6);
  g.beginPath();
  g.moveTo(0.18, -1.12 + b);
  g.lineTo(0.3, -1.24 + b);
  g.lineTo(0.38, -1.16 + b);
  g.closePath();
  g.fill();
  g.beginPath();
  g.ellipse(hx2, hy2, 0.1, 0.115, 0.3, 0, 7);
  g.fill();
  g.beginPath();
  g.ellipse(hx2 - 0.02, hy2 - 0.055, 0.1, 0.075, 0.25, Math.PI * 0.9, Math.PI * 2.0);
  g.fill();
  g.beginPath();
  g.moveTo(hx2 + 0.085, hy2 - 0.03);
  g.lineTo(hx2 + 0.13, hy2 + 0.015);
  g.lineTo(hx2 + 0.09, hy2 + 0.04);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(hx2 + 0.09, hy2 + 0.04);
  g.quadraticCurveTo(hx2 + 0.13, hy2 + 0.14, hx2 + 0.07, hy2 + 0.19);
  g.quadraticCurveTo(hx2 - 0.02, hy2 + 0.19, hx2 - 0.09, hy2 + 0.09);
  g.lineTo(hx2 - 0.04, hy2);
  g.closePath();
  g.fill();
  const s2x = 0.1,
    s2y = -1.04 + b;
  L(s2x, s2y, 0.42, -0.6, 0.15, 0.115);
  L(0.42, -0.6, 0.66, -0.62, 0.105, 0.085);
  g.beginPath();
  g.ellipse(0.7, -0.6, 0.055, 0.045, 0.4, 0, 7);
  g.fill();
  g.restore();
}
fig(rim, 0.03);
fig(dk, 0);
e.at(0.37, -1.45);
