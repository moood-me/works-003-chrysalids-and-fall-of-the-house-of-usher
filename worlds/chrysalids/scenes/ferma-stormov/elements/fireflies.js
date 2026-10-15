for (var i = 0; i < 8; i++) {
  var bx = -9 + e.rnd() * 18,
    by = -0.4 - e.rnd() * 1.4,
    p = e.rnd() * 6;
  var x = bx + 0.6 * Math.sin(e.t * 0.13 + p) + 0.3 * Math.sin(e.t * 0.31 + p * 2),
    y = by + 0.25 * Math.sin(e.t * 0.21 + p * 3);
  var a = Math.max(0, Math.sin(e.t * 0.45 + p * 1.7)) * 0.8;
  if (a < 0.05) continue;
  e.light(x, y, 0.35, "#e9cf86", a * 0.45);
  g.fillStyle = "rgba(245,225,160," + a + ")";
  g.beginPath();
  g.arc(x, y, 0.022, 0, 7);
  g.fill();
}
