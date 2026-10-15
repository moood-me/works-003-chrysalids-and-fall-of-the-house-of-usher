var t = e.t,
  s = e.state || {},
  dk = s.dusk == null ? 0.2 : +s.dusk;
g.save();
g.globalCompositeOperation = "lighter";
for (var i = 0; i < 4; i++) {
  var x = 2 + i * 2.2;
  g.save();
  g.translate(x, -6);
  g.rotate(0.42);
  var sg = g.createLinearGradient(-0.8, 0, 0.8, 0);
  var a = (0.05 + 0.02 * Math.sin(t * 0.07 + i * 1.9)) * (1 - dk * 0.8);
  sg.addColorStop(0, "rgba(240,200,150,0)");
  sg.addColorStop(0.5, "rgba(240,200,150," + a + ")");
  sg.addColorStop(1, "rgba(240,200,150,0)");
  g.fillStyle = sg;
  g.fillRect(-0.8, 0, 1.6, 9);
  g.restore();
}
for (var i = 0; i < 110; i++) {
  var bx = -9 + e.rnd() * 18,
    by = -0.3 - Math.pow(e.rnd(), 1.5) * 2.6,
    sp = 0.02 + e.rnd() * 0.05,
    ph = e.rnd() * 6.28,
    sz = 0.006 + Math.pow(e.rnd(), 4) * 0.018;
  var x = bx + Math.sin(t * sp * 2 + ph) * 0.6 + t * sp * 0.4;
  x = ((((x + 9) % 18) + 18) % 18) - 9;
  var y = by + Math.sin(t * sp * 3.1 + ph * 2) * 0.25 - 0.08 * Math.sin(t * 0.05 + ph);
  var tw = 0.5 + 0.5 * Math.sin(t * (0.5 + e.rnd()) + ph);
  var near = Math.max(0, 1 - Math.abs(x - 3.5) / 5);
  var a = (0.08 + 0.55 * near) * tw * (1 - dk * 0.6);
  g.fillStyle = "rgba(250,222,175," + a + ")";
  g.beginPath();
  g.arc(x, y, sz, 0, 7);
  g.fill();
}
g.restore();
