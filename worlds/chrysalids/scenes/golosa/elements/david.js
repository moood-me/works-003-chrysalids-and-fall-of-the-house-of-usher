var t = e.t,
  s = e.state || {},
  dp = s.david_present == null ? 1 : +s.david_present;
if (dp < 0.02) return;
var GA = Math.min(1, dp * 1.2);
g.globalAlpha = GA;
var br = Math.sin(t * 1.2) * 0.012 + Math.sin(t * 0.29) * 0.005;
var C = "#0b0e1c";
g.fillStyle = C;
g.strokeStyle = C;
g.lineJoin = "round";
g.lineCap = "round";
function limb(pts, w0, w1) {
  for (var i = 0; i < pts.length - 1; i++) {
    var a = pts[i],
      b = pts[i + 1];
    var wa = w0 + ((w1 - w0) * i) / (pts.length - 1),
      wb = w0 + ((w1 - w0) * (i + 1)) / (pts.length - 1);
    g.lineWidth = (wa + wb) / 2;
    g.beginPath();
    g.moveTo(a[0], a[1]);
    g.lineTo(b[0], b[1]);
    g.stroke();
  }
}
limb(
  [
    [-0.02, -0.08],
    [-0.45, -0.07],
    [-0.86, -0.05],
  ],
  0.15,
  0.09,
);
g.beginPath();
g.moveTo(-0.9, -0.02);
g.quadraticCurveTo(-0.95, -0.1, -0.93, -0.17);
g.quadraticCurveTo(-0.88, -0.17, -0.85, -0.08);
g.closePath();
g.fill();
var kx = -0.27 + 0.018 * Math.sin(t * 0.19) + 0.007 * Math.sin(t * 0.47),
  ky = -0.34 + 0.006 * Math.sin(t * 0.23);
g.lineWidth = 0.16;
g.beginPath();
g.moveTo(-0.02, -0.1);
g.quadraticCurveTo(-0.12, -0.27, kx, ky);
g.stroke();
g.lineWidth = 0.11;
g.beginPath();
g.moveTo(kx, ky);
g.quadraticCurveTo(kx - 0.14, ky + 0.1, -0.5, -0.04);
g.stroke();
g.beginPath();
g.moveTo(-0.57, 0.0);
g.quadraticCurveTo(-0.58, -0.06, -0.5, -0.08);
g.lineTo(-0.42, -0.02);
g.lineTo(-0.42, 0.0);
g.closePath();
g.fill();
g.beginPath();
g.moveTo(-0.16, 0.02);
g.quadraticCurveTo(-0.2, -0.18, -0.02, -0.21);
g.bezierCurveTo(0.14, -0.25 - br, 0.33, -0.28 - br, 0.47, -0.26 - br * 0.6);
g.quadraticCurveTo(0.57, -0.2, 0.57, -0.06);
g.lineTo(0.57, 0.02);
g.closePath();
g.fill();
var ex = 0.55 + 0.004 * Math.sin(t * 0.31),
  ey = -0.39;
g.lineWidth = 0.085;
g.beginPath();
g.moveTo(0.45, -0.18);
g.quadraticCurveTo(0.47, -0.33, ex, ey);
g.stroke();
g.lineWidth = 0.075;
g.beginPath();
g.moveTo(ex, ey);
g.quadraticCurveTo(0.68, -0.34, 0.76, -0.16);
g.stroke();
g.beginPath();
g.moveTo(0.54, -0.02);
g.quadraticCurveTo(0.53, -0.2, 0.64, -0.23);
g.quadraticCurveTo(0.8, -0.27, 0.84, -0.14);
g.quadraticCurveTo(0.86, -0.05, 0.8, 0.0);
g.lineTo(0.56, 0.01);
g.closePath();
g.fill();
g.fillStyle = "#10132a";
for (var i = 0; i < 60; i++) {
  var x = -1.05 + e.rnd() * 2.0,
    h = 0.04 + e.rnd() * 0.12,
    sw = h * (0.25 * Math.sin(t * 0.5 + x * 3 + i) + 0.1 * Math.sin(t * 1.1 + i)) + (e.rnd() - 0.5) * 0.03,
    w = 0.006 + e.rnd() * 0.006;
  g.beginPath();
  g.moveTo(x - w, 0.04);
  g.quadraticCurveTo(x + sw * 0.3, 0.04 - h * 0.5, x + sw, 0.04 - h);
  g.quadraticCurveTo(x + sw * 0.3, 0.04 - h * 0.5, x + w, 0.04);
  g.fill();
}
e.at(0.69, -0.3);
