for (var y = -13; y < 13; y += 0.45) {
  var z = 14 - y,
    c = 1 + 0.27 * z + 1.6;
  for (var x = c + e.rnd() * 0.6; x < 30; x += 0.7) {
    g.fillStyle = e.rnd() < 0.55 ? "rgba(88,74,80,0.5)" : "rgba(24,20,28,0.45)";
    g.fillRect(x + (e.rnd() - 0.5) * 0.2, y, 0.07, 0.3);
  }
}
