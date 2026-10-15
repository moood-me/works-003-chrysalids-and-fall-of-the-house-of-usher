g.fillStyle = "#181b2f";
var x = -250;
while (x < 320) {
  var L = 15 + e.rnd() * 50,
    gap = 8 + e.rnd() * 35;
  for (var u = 0; u < L; u += 0.8 + e.rnd() * 0.8) {
    var tap = Math.min(1, u / 3, (L - u) / 3);
    var r = (0.6 + 0.6 * e.rnd()) * Math.max(0.3, tap);
    g.beginPath();
    g.ellipse(x + u, -r * 0.6, r * 1.3, r, 0, 0, 7);
    g.fill();
  }
  g.fillRect(x, -0.3, L, 0.8);
  if (e.rnd() < 0.4) {
    var tx = x + e.rnd() * L,
      th = 5 + e.rnd() * 4;
    for (var k = 0; k < 4; k++) {
      g.beginPath();
      g.ellipse(
        tx + Math.sin(k * 2.1) * th * 0.15,
        -th * 0.65 - Math.cos(k * 1.7) * th * 0.12,
        th * 0.24,
        th * 0.22,
        0,
        0,
        7,
      );
      g.fill();
    }
  }
  x += L + gap;
}
