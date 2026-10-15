var t = e.t;
var C = "#5a5040";
g.fillStyle = C;
g.strokeStyle = C;
g.lineCap = "round";
var P = [];
for (var i = 0; i < 12; i++) {
  P.push([-14.6 + i * 2.55 + (i == 5 ? 0 : (e.rnd() - 0.5) * 0.4), (e.rnd() - 0.5) * 0.16, 0.95 + e.rnd() * 0.25]);
}
for (var i = 0; i < P.length; i++) {
  var p = P[i];
  g.beginPath();
  g.moveTo(p[0] - 0.06, 0);
  g.lineTo(p[0] - 0.05 + p[1], -p[2]);
  g.lineTo(p[0] + 0.06 + p[1], -p[2] + 0.03);
  g.lineTo(p[0] + 0.06, 0);
  g.fill();
}
g.lineWidth = 0.07;
for (var r = 0; r < 2; r++) {
  var ry = r ? -0.55 : -0.98;
  for (var i = 0; i < P.length - 1; i++) {
    if ((r == 1 && (i == 2 || i == 8)) || (r == 0 && i == 9)) continue;
    var a = P[i],
      b = P[i + 1];
    g.beginPath();
    g.moveTo(a[0], ry + 0.02 * Math.sin(i * 3 + r));
    g.quadraticCurveTo((a[0] + b[0]) / 2, ry + 0.05 + 0.02 * Math.sin(i), b[0], ry + 0.02 * Math.sin(i * 3 + r + 3));
    g.stroke();
  }
}
for (var i = 0; i < 200; i++) {
  var x = -16 + e.rnd() * 32,
    h = 0.1 + e.rnd() * 0.45,
    ph = e.rnd() * 6,
    lt = e.rnd() < 0.4,
    sw = h * 0.15 * Math.sin(t * 0.5 + ph);
  g.fillStyle = lt ? "#9a9466" : "#6b6646";
  g.beginPath();
  g.moveTo(x - 0.03, 0.02);
  g.quadraticCurveTo(x, -h * 0.5, x + sw, -h);
  g.quadraticCurveTo(x + 0.01, -h * 0.5, x + 0.03, 0.02);
  g.fill();
}
