var t = e.t,
  C = "#07090f";
g.fillStyle = C;
g.strokeStyle = C;
g.lineCap = "round";
for (var i = 0; i < 320; i++) {
  var x = -8.8 + e.rnd() * 17.6,
    h = 0.15 + Math.pow(e.rnd(), 1.6) * 0.95,
    ph = e.rnd() * 6,
    lean = (e.rnd() - 0.5) * 0.35;
  if (x > -3 && x < 2.5 && e.rnd() < 0.7) h *= 0.45;
  var sw = h * (0.06 * Math.sin(t * 0.4 + ph + x * 0.25) + 0.025 * Math.sin(t * 0.97 + x * 1.3 + ph)) + lean * h;
  var w = 0.008 + e.rnd() * 0.01;
  var b = 0.45;
  g.beginPath();
  g.moveTo(x - w, b);
  g.quadraticCurveTo(x + sw * 0.3, b - h * 0.55, x + sw, b - h);
  g.quadraticCurveTo(x + sw * 0.3 + w * 0.3, b - h * 0.5, x + w, b);
  g.fill();
  var r = e.rnd();
  if (r < 0.14 && h > 0.4) {
    var hx = x + sw,
      hy = b - h;
    g.lineWidth = 0.004;
    for (var k = 0; k < 7; k++) {
      var dx = (k - 3) * 0.012 + sw * 0.15,
        dy = 0.05 + (k % 3) * 0.02;
      g.beginPath();
      g.moveTo(hx, hy);
      g.quadraticCurveTo(hx + dx * 1.5, hy - 0.02, hx + dx * 2.4 + sw * 0.1, hy + dy);
      g.stroke();
      g.beginPath();
      g.ellipse(hx + dx * 2.4 + sw * 0.1, hy + dy + 0.012, 0.005, 0.014, 0, 0, 7);
      g.fill();
    }
  } else if (r < 0.28 && h > 0.3) {
    g.save();
    g.translate(x + sw, b - h);
    g.rotate(sw * 1.5 + lean * 0.5);
    for (var k = 0; k < 7; k++) {
      g.beginPath();
      g.ellipse((k % 2 ? 1 : -1) * 0.009, -0.015 - k * 0.017, 0.006, 0.016, k % 2 ? 0.4 : -0.4, 0, 7);
      g.fill();
    }
    g.restore();
  }
}
