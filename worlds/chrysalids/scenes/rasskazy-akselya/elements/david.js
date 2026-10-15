const S = e.state || {};
const f = S.fire ?? 0.8;
const t = e.t;
const F = f * (0.85 + 0.1 * Math.sin(t * 2.3) + 0.06 * Math.sin(t * 5.3 + 1));
const dk = "#0c0e17";
const rim = "rgba(232,140,74," + 0.9 * F + ")";
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
g.scale(1.12, 1.12);
function stump(col, ox) {
  g.fillStyle = col;
  g.beginPath();
  g.moveTo(-0.17 + ox, 0.0);
  g.lineTo(-0.16 + ox, -0.34);
  g.quadraticCurveTo(0 + ox, -0.38, 0.16 + ox, -0.34);
  g.lineTo(0.18 + ox, 0);
  g.closePath();
  g.fill();
}
stump("rgba(222,128,66," + 0.4 * F + ")", 0.02);
stump("#100e14", 0);
if (S.david_present === false) return;
const b = 0.008 * Math.sin(t * 1.25) + 0.004 * Math.sin(t * 0.51);
const lk = 0.05 * Math.sin(t * 0.17) + 0.03 * Math.sin(t * 0.41);
function boy(col, ox) {
  g.save();
  g.translate(ox, 0);
  g.fillStyle = col;
  L(0.0, -0.41, 0.27, -0.66, 0.14, 0.11);
  L(0.27, -0.66, 0.29, -0.06, 0.1, 0.085);
  g.beginPath();
  g.ellipse(0.33, -0.04, 0.085, 0.04, 0, 0, 7);
  g.fill();
  L(0.03, -0.42, 0.31, -0.63, 0.13, 0.1);
  L(0.31, -0.63, 0.34, -0.07, 0.095, 0.08);
  g.beginPath();
  g.ellipse(0.38, -0.04, 0.08, 0.04, 0, 0, 7);
  g.fill();
  g.beginPath();
  g.moveTo(-0.13, -0.37);
  g.bezierCurveTo(-0.2, -0.58, -0.13, -0.8 + b, 0.0, -0.87 + b);
  g.bezierCurveTo(0.08, -0.91 + b, 0.17, -0.86 + b, 0.18, -0.76 + b);
  g.bezierCurveTo(0.18, -0.62, 0.14, -0.5, 0.12, -0.4);
  g.closePath();
  g.fill();
  L(0.08, -0.8 + b, 0.25, -0.56, 0.085, 0.075);
  L(0.25, -0.56, 0.36, -0.5, 0.07, 0.065);
  g.beginPath();
  g.arc(0.37, -0.5, 0.04, 0, 7);
  g.fill();
  const hx = 0.1,
    hy = -0.97 + b;
  g.save();
  g.translate(hx, hy);
  g.rotate(-0.35 + lk);
  g.beginPath();
  g.moveTo(-0.04, 0.1);
  g.lineTo(0.05, 0.1);
  g.lineTo(0.03, 0.02);
  g.lineTo(-0.05, 0.02);
  g.fill();
  g.beginPath();
  g.ellipse(0, 0, 0.088, 0.098, 0, 0, 7);
  g.fill();
  g.beginPath();
  g.ellipse(-0.01, -0.045, 0.095, 0.07, 0, Math.PI * 0.9, Math.PI * 2.1);
  g.fill();
  g.beginPath();
  g.moveTo(-0.07, -0.06);
  g.lineTo(-0.12, -0.03);
  g.lineTo(-0.08, -0.01);
  g.fill();
  g.beginPath();
  g.moveTo(0.08, -0.01);
  g.lineTo(0.115, 0.02);
  g.lineTo(0.08, 0.035);
  g.closePath();
  g.fill();
  g.restore();
  g.restore();
}
boy(rim, 0.035);
boy(dk, 0);
e.light(0.32, -0.6, 0.5, "#d8783c", 0.18 * F);
e.at(0.11, -1.25);
