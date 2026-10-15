var A = e.aspect,
  t = e.t,
  hz = 0.66;
g.globalCompositeOperation = "lighter";
for (var i = 0; i < 6; i++) {
  var y = hz + 0.012 + i * 0.022 + 0.003 * Math.sin(t * 0.07 + i);
  var cx = ((e.rnd() * A + t * 0.002 * (1 + i * 0.3)) % (A + 0.8)) - 0.2;
  var rx = 0.35 + e.rnd() * 0.4,
    a = 0.05 + 0.02 * Math.sin(t * 0.09 + i * 1.3);
  g.save();
  g.translate(cx, y);
  g.scale(1, 0.018 / rx);
  var mg = g.createRadialGradient(0, 0, 0, 0, 0, rx);
  mg.addColorStop(0, "rgba(70,74,104," + a + ")");
  mg.addColorStop(1, "rgba(70,74,104,0)");
  g.fillStyle = mg;
  g.beginPath();
  g.arc(0, 0, rx, 0, 7);
  g.fill();
  g.restore();
}
