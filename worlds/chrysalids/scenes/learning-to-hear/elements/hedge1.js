var t = 0;
var x = -250;
while (x < 250) {
  var L = 6 + e.rnd() * 26,
    gap = 8 + e.rnd() * 30;
  g.fillStyle = "#7a7955";
  for (var u = 0; u < L; u += 0.6 + e.rnd() * 0.6) {
    var tap = Math.min(1, u / 2.5, (L - u) / 2.5);
    var r = (0.5 + 0.5 * e.rnd()) * Math.max(0.25, tap);
    g.beginPath();
    g.ellipse(x + u, -r * 0.75, r * 1.5, r, 0, 0, 7);
    g.fill();
  }
  if (e.rnd() < 0.5) {
    var tx = x + e.rnd() * L,
      th = 6 + e.rnd() * 5,
      sw = 0.12 * Math.sin(t * 0.3 + tx);
    g.fillStyle = "#6a6a4b";
    g.fillRect(tx - 0.12, -th * 0.4, 0.24, th * 0.4);
    for (var k = 0; k < 9; k++) {
      var a = k * 2.4 + tx,
        rr = 0.4 + 0.6 * ((k * 0.618) % 1);
      g.beginPath();
      g.ellipse(
        tx + Math.cos(a) * th * 0.25 * rr + sw,
        -th * 0.6 + Math.sin(a) * th * 0.18 * rr,
        th * 0.17,
        th * 0.14,
        0,
        0,
        7,
      );
      g.fill();
    }
    g.fillStyle = "rgba(205,192,130,0.35)";
    for (var k = 0; k < 3; k++) {
      g.beginPath();
      g.ellipse(
        tx + th * 0.12 + Math.cos(k * 2) * th * 0.08 + sw,
        -th * 0.72 + Math.sin(k * 2) * th * 0.08,
        th * 0.1,
        th * 0.08,
        0,
        0,
        7,
      );
      g.fill();
    }
  }
  x += L + gap;
}
