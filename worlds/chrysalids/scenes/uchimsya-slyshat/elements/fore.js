var t = e.t;
g.fillStyle = "#3c3829";
g.strokeStyle = "#3c3829";
g.lineCap = "round";
for (var i = 0; i < 300; i++) {
  var r1 = e.rnd(),
    r2 = e.rnd(),
    r3 = e.rnd(),
    r4 = e.rnd(),
    r5 = e.rnd(),
    r6 = e.rnd();
  var x = -9.5 + r1 * 19,
    ed = Math.min(1, Math.pow(Math.abs(x) / 7, 1.5));
  var h = (0.06 + Math.pow(r2, 1.5) * 0.75) * (0.25 + 0.75 * ed);
  var lean = (r4 - 0.5) * 0.3;
  var sw = h * (0.07 * Math.sin(t * 0.45 + r3 * 6 + x * 0.2) + 0.03 * Math.sin(t * 1.03 + x + r3 * 6)) + lean * h;
  var wd = 0.006 + r5 * 0.008,
    b = 0.45;
  g.beginPath();
  g.moveTo(x - wd, b);
  g.quadraticCurveTo(x + sw * 0.3, b - h * 0.55, x + sw, b - h);
  g.quadraticCurveTo(x + sw * 0.3, b - h * 0.5, x + wd, b);
  g.fill();
  if (r6 < 0.16 && h > 0.35) {
    g.save();
    g.translate(x + sw, b - h);
    g.rotate(sw * 1.5 + lean * 0.5);
    for (var k = 0; k < 6; k++) {
      g.beginPath();
      g.ellipse((k % 2 ? 1 : -1) * 0.008, -0.013 - k * 0.015, 0.005, 0.014, k % 2 ? 0.4 : -0.4, 0, 7);
      g.fill();
    }
    g.restore();
  }
}
