var t = e.t,
  s = e.state || {},
  v = s.thread == null ? 0.35 : +s.thread,
  gl = s.glance == null ? 0 : +s.glance;
if (v < 0.005) return;
var dt = 9.4;
function pt(a, h, d) {
  return [(a * dt) / d, -(1.7 + ((h - 1.7) * dt) / d)];
}
var P0 = pt(-4.2, 1.95, 10),
  P1 = pt(9.0, 1.9, 19);
var x0 = P0[0],
  y0 = P0[1],
  x1 = P1[0],
  y1 = P1[1];
var c1x = x0 + 1.4,
  c1y = y0 - 1.3 - 0.4 * v,
  c2x = x1 - 2.4,
  c2y = y1 - 1.2 - 0.3 * v;
g.save();
g.globalCompositeOperation = "lighter";
g.lineCap = "round";
function aura(x, y, r, a) {
  var ag = g.createRadialGradient(x, y, 0, x, y, r);
  ag.addColorStop(0, "rgba(250,215,160," + a + ")");
  ag.addColorStop(1, "rgba(250,215,160,0)");
  g.fillStyle = ag;
  g.beginPath();
  g.arc(x, y, r, 0, 7);
  g.fill();
}
aura(x0, y0 + 0.08, 0.4, 0.1 * v);
aura(x1, y1 + 0.05, 0.25, 0.1 * v);
for (var L = 0; L < 2; L++) {
  var seed = L * 1.7;
  var N = 90,
    Pp = [];
  for (var k = 0; k <= N; k++) {
    var u = k / N,
      iu = 1 - u;
    var bx = iu * iu * iu * x0 + 3 * iu * iu * u * c1x + 3 * iu * u * u * c2x + u * u * u * x1,
      by = iu * iu * iu * y0 + 3 * iu * iu * u * c1y + 3 * iu * u * u * c2y + u * u * u * y1;
    var w =
      0.05 *
      Math.sin(u * Math.PI) *
      (Math.sin(u * Math.PI * 3.1 - t * 0.17 + seed) + 0.5 * Math.sin(u * 7.3 + t * 0.23 + seed * 2));
    Pp.push([bx, by + w + L * 0.035 * Math.sin(u * Math.PI)]);
  }
  var G = g.createLinearGradient(x0, y0, x1, y1);
  var p = ((t * 0.03 + L * 0.5) % 1.4) - 0.2;
  for (var k = 0; k <= 24; k++) {
    var u = k / 24;
    var en = Math.pow(Math.sin(Math.PI * u), 0.35);
    var br = 0.6 + 0.4 * Math.sin(u * 6.3 - t * 0.07 + seed) * Math.sin(u * 2.9 + t * 0.05);
    var d = (u - p) / 0.08;
    var I = 0.6 * Math.max(0.15, br) + 0.9 * Math.exp(-d * d) + 0.3 * gl;
    var a = Math.max(0, v * en * I * (L ? 0.4 : 1));
    G.addColorStop(u, "rgba(250,212,150," + Math.min(1, a * 1.5) + ")");
  }
  g.strokeStyle = G;
  g.beginPath();
  g.moveTo(Pp[0][0], Pp[0][1]);
  for (var k = 1; k <= N; k++) g.lineTo(Pp[k][0], Pp[k][1]);
  g.lineWidth = 0.14;
  g.globalAlpha = 0.2;
  g.stroke();
  g.lineWidth = 0.05;
  g.globalAlpha = 0.35;
  g.stroke();
  g.lineWidth = 0.016;
  g.globalAlpha = 1;
  g.stroke();
}
g.restore();
