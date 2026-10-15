var t = e.t;
for (var i = 0; i < 12; i++) {
  var x = -2600 + e.rnd() * 5600,
    a = 0.5 + 0.25 * Math.sin(t * (0.2 + e.rnd() * 0.3) + i * 2.1);
  if (e.rnd() < 0.3) continue;
  g.fillStyle = "rgba(230,180,110," + a + ")";
  g.fillRect(x - 0.6, -2.2, 1.2, 1.2);
  e.light(x, -1.6, 9, "#e0a868", a * 0.45);
}
