const S = e.state || {},
  c = S.cart ?? 0.5,
  s = S.season ?? 0,
  t = e.t;
const dx = (1 - c) * 27;
const w = (dx / 1.5) * Math.PI * 2;
function seg(x1, y1, w1, x2, y2, w2) {
  const a = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2,
    cc = Math.cos(a),
    ss = Math.sin(a);
  g.beginPath();
  g.moveTo(x1 + (cc * w1) / 2, y1 + (ss * w1) / 2);
  g.lineTo(x2 + (cc * w2) / 2, y2 + (ss * w2) / 2);
  g.arc(x2, y2, w2 / 2, a, a + Math.PI, true);
  g.lineTo(x1 - (cc * w1) / 2, y1 - (ss * w1) / 2);
  g.arc(x1, y1, w1 / 2, a + Math.PI, a + 2 * Math.PI, true);
  g.closePath();
  g.fill();
}
const D = "#4a4038",
  G = s < 0.5 ? "#b39457" : "#7d6c58";
g.save();
g.translate(dx, 0);
g.fillStyle = G;
const ld = 1 - 0.75 * s;
g.beginPath();
g.moveTo(0.5, -0.95);
g.bezierCurveTo(0.4, -0.95 - 1.2 * ld, 1.2, -0.95 - 1.5 * ld, 2.0, -0.95 - 1.5 * ld);
g.bezierCurveTo(2.9, -0.95 - 1.45 * ld, 3.5, -0.95 - 1.1 * ld, 3.4, -0.95);
g.closePath();
g.fill();
g.fillStyle = D;
g.fillRect(0.4, -1.0, 3.1, 0.18);
seg(0.4, -0.9, 0.08, -0.9, -1.05, 0.06);
g.save();
g.translate(2.0, -0.62);
g.rotate(-w * 0.5);
g.strokeStyle = D;
g.lineWidth = 0.09;
g.beginPath();
g.arc(0, 0, 0.58, 0, 7);
g.stroke();
g.lineWidth = 0.05;
for (let k = 0; k < 6; k++) {
  const a = (k / 6) * Math.PI * 2;
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(Math.cos(a) * 0.56, Math.sin(a) * 0.56);
  g.stroke();
}
g.restore();
g.fillStyle = D;
g.save();
g.translate(0.85, -1.25);
g.rotate(0.15 + 0.03 * Math.sin(t * 0.9));
g.beginPath();
g.moveTo(-0.15, 0.15);
g.bezierCurveTo(-0.2, -0.2, -0.12, -0.48, 0.0, -0.52);
g.bezierCurveTo(0.12, -0.48, 0.16, -0.2, 0.14, 0.15);
g.closePath();
g.fill();
g.beginPath();
g.arc(-0.02, -0.62, 0.09, 0, 7);
g.fill();
g.beginPath();
g.ellipse(-0.02, -0.68, 0.17, 0.03, 0, 0, 7);
g.fill();
g.restore();
seg(0.7, -1.12, 0.09, 0.45, -0.85, 0.08);
g.save();
g.translate(-1.6, 0);
const n = 0.05 + 0.02 * Math.sin(w * 2);
g.fillStyle = D;
const legs = [
  [-0.55, 0],
  [0.55, 0.5],
  [-0.45, 0.5],
  [0.62, 0],
];
for (const L of legs) {
  const a = 0.3 * Math.sin(w + L[1] * Math.PI * 2);
  seg(L[0] * -1, -1.0, 0.2, L[0] * -1 + 0.5 * Math.sin(a), -0.5, 0.11);
  seg(L[0] * -1 + 0.5 * Math.sin(a), -0.5, 0.11, L[0] * -1 + 0.95 * Math.sin(a), -0.02, 0.08);
}
g.beginPath();
g.moveTo(-0.7, -0.86);
g.bezierCurveTo(-0.3, -0.76, 0.25, -0.78, 0.5, -0.88);
g.bezierCurveTo(0.76, -1.0, 0.9, -1.32, 0.86, -1.46);
g.bezierCurveTo(0.76, -1.58, 0.6, -1.6, 0.44, -1.55);
g.bezierCurveTo(0.2, -1.49, -0.1, -1.48, -0.3, -1.53);
g.bezierCurveTo(-0.5, -1.62, -0.7, -1.6, -0.85, -1.52);
g.bezierCurveTo(-1.05, -1.4, -1.2, -1.2, -1.38, -1.0 + n);
g.bezierCurveTo(-1.44, -0.9 + n, -1.36, -0.84 + n, -1.28, -0.88 + n);
g.bezierCurveTo(-1.15, -0.96, -1.0, -1.0, -0.9, -1.0);
g.closePath();
g.fill();
g.beginPath();
g.moveTo(0.82, -1.5);
g.quadraticCurveTo(1.0, -1.3, 0.98 + 0.04 * Math.sin(t * 0.8), -0.85);
g.lineTo(0.9, -1.25);
g.closePath();
g.fill();
g.restore();
g.restore();
