for (var i = 0; i < 700; i++) {
  var y = -20 + e.rnd() * 40,
    d = 20 - y;
  var fx = -2.5 + 0.348 * (d - 5) - 4,
    px = -0.1 + 0.278 * d - 4;
  var x = fx + 0.15 + e.rnd() * (px - fx - 0.3);
  if (px - fx < 0.4) {
    e.rnd();
    continue;
  }
  var r = e.rnd();
  g.fillStyle = r < 0.5 ? "rgba(26,21,30,0.3)" : "rgba(80,68,74,0.18)";
  g.fillRect(x, y, 0.04 + r * 0.04, 0.15 + r * 0.25);
}
