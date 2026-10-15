var t = e.t;
function tr(x, h, k) {
  var sw = 0.12 * Math.sin(t * 0.3 + k) + 0.06 * Math.sin(t * 0.71 + k * 2);
  g.fillStyle = "#4e4a37";
  g.beginPath();
  g.moveTo(x - 0.3, 0);
  g.lineTo(x - 0.12, -h * 0.4);
  g.lineTo(x + 0.12, -h * 0.4);
  g.lineTo(x + 0.3, 0);
  g.fill();
  var rx = h * 0.42,
    ry = h * 0.3,
    cy = -h * 0.62;
  g.fillStyle = "#5c5c41";
  for (var i = 0; i < 11; i++) {
    var a = i * 2.4 + k,
      rr = 0.4 + 0.6 * ((i * 0.618 + k * 0.3) % 1);
    var cx = x + Math.cos(a) * rx * 0.62 * rr + sw * (0.4 + rr * 0.6),
      yy = cy + Math.sin(a) * ry * 0.6 * rr;
    var r = h * (0.15 + 0.05 * Math.sin(i * 1.7 + k));
    g.beginPath();
    g.ellipse(cx, yy, r * 1.15, r, 0, 0, 7);
    g.fill();
  }
  g.fillStyle = "rgba(190,180,120,0.3)";
  for (var i = 0; i < 5; i++) {
    var a = -0.9 + i * 0.45,
      cx = x + Math.cos(a) * rx * 0.5 + sw,
      yy = cy + Math.sin(a) * ry * 0.6;
    g.beginPath();
    g.ellipse(cx, yy, h * 0.1, h * 0.08, 0, 0, 7);
    g.fill();
  }
}
var T = [
  [-178, 10],
  [-168, 13],
  [-150, 9],
  [-104, 12],
  [-94, 8],
  [94, 11],
  [108, 14],
  [150, 10],
  [205, 13],
  [218, 9],
];
for (var i = 0; i < T.length; i++) tr(T[i][0], T[i][1], i);
