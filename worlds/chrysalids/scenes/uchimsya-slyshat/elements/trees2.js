var t = 0;
function tr(x, h, k) {
  var sw = 0.12 * Math.sin(t * 0.3 + k) + 0.06 * Math.sin(t * 0.71 + k * 2);
  g.fillStyle = "#55513d";
  g.fillRect(x - 0.2, -h * 0.4, 0.4, h * 0.4);
  var rx = h * 0.42,
    ry = h * 0.3,
    cy = -h * 0.62;
  g.fillStyle = "#636346";
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
  [-300, 14],
  [-288, 11],
  [-160, 13],
  [-148, 10],
  [-136, 12],
  [150, 13],
  [200, 11],
  [214, 15],
  [330, 12],
  [-420, 13],
];
for (var i = 0; i < T.length; i++) tr(T[i][0], T[i][1], i);
