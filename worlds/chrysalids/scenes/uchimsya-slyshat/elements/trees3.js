var t = e.t;
function tr(x, h, k) {
  var rx = h * 0.42,
    ry = h * 0.3,
    cy = -h * 0.62;
  g.fillStyle = "#6a6a4c";
  g.fillRect(x - 0.3, -h * 0.4, 0.6, h * 0.4);
  for (var i = 0; i < 9; i++) {
    var a = i * 2.4 + k,
      rr = 0.4 + 0.6 * ((i * 0.618 + k * 0.3) % 1);
    var cx = x + Math.cos(a) * rx * 0.62 * rr,
      yy = cy + Math.sin(a) * ry * 0.6 * rr;
    var r = h * (0.16 + 0.05 * Math.sin(i * 1.7 + k));
    g.beginPath();
    g.ellipse(cx, yy, r * 1.15, r, 0, 0, 7);
    g.fill();
  }
}
for (var i = 0; i < 40; i++) {
  var x = -1250 + e.rnd() * 2500,
    h = 9 + e.rnd() * 7;
  tr(x, h, i);
  if (e.rnd() < 0.6) tr(x + h * (0.4 + e.rnd() * 0.5), h * (0.7 + e.rnd() * 0.3), i + 40);
}
