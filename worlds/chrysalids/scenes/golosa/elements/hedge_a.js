g.fillStyle = "#15182b";
var x = -50;
while (x < 120) {
  var L = 6 + e.rnd() * 18,
    gap = 3 + e.rnd() * 12;
  for (var u = 0; u < L; u += 0.35 + e.rnd() * 0.4) {
    var tap = Math.min(1, u / 1.2, (L - u) / 1.2);
    var r = (0.3 + 0.35 * e.rnd()) * Math.max(0.3, tap);
    g.beginPath();
    g.ellipse(x + u, -r * 0.6, r * 1.2, r, 0, 0, 7);
    g.fill();
  }
  g.fillRect(x, -0.15, L, 0.6);
  if (e.rnd() < 0.3) {
    var tx = x + e.rnd() * L,
      th = 3 + e.rnd() * 2.5;
    for (var k = 0; k < 5; k++) {
      g.beginPath();
      g.ellipse(
        tx + Math.sin(k * 2.1) * th * 0.18,
        -th * 0.68 - Math.cos(k * 1.7) * th * 0.13,
        th * 0.22,
        th * 0.2,
        0,
        0,
        7,
      );
      g.fill();
    }
    g.fillRect(tx - 0.1, -th * 0.45, 0.2, th * 0.45);
  }
  x += L + gap;
}
