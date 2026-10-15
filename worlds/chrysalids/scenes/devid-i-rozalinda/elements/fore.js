var t = 0,
  C = "#2a2028";
var vg = g.createLinearGradient(0, -0.6, 0, 0);
vg.addColorStop(0, "rgba(42,32,40,0)");
vg.addColorStop(1, "rgba(42,32,40,0.5)");
g.fillStyle = vg;
g.fillRect(-8, -0.6, 16, 0.7);
g.fillStyle = "#3a2e35";
for (var i = 0; i < 30; i++) {
  var x = -5 + e.rnd() * 10,
    y = -0.02 - e.rnd() * 0.25,
    r = 0.015 + e.rnd() * 0.04;
  g.beginPath();
  g.ellipse(x, y, r, r * 0.55, 0, 0, 7);
  g.fill();
}
g.fillStyle = C;
for (var i = 0; i < 200; i++) {
  var side = e.rnd() < 0.6 ? -1 : 1;
  var x = side * (1.9 + Math.pow(e.rnd(), 0.9) * 2.8);
  var b = 0.02 - e.rnd() * 0.12;
  var h = 0.04 + Math.pow(e.rnd(), 1.7) * 0.32 * (Math.abs(x) > 2.6 ? 1 : 0.5);
  var ph = e.rnd() * 6,
    lean = (e.rnd() - 0.5) * 0.6;
  var sw = h * (0.08 * Math.sin(t * 0.4 + ph + x) + 0.03 * Math.sin(t * 1.03 + x * 3 + ph)) + lean * h;
  var w = 0.004 + e.rnd() * 0.005;
  g.beginPath();
  g.moveTo(x - w, b);
  g.quadraticCurveTo(x + sw * 0.3, b - h * 0.55, x + sw, b - h);
  g.quadraticCurveTo(x + sw * 0.3 + w * 0.3, b - h * 0.5, x + w, b);
  g.fill();
}
g.save();
g.globalCompositeOperation = "lighter";
g.strokeStyle = "rgba(230,180,130,0.16)";
g.lineWidth = 0.003;
for (var i = 0; i < 40; i++) {
  var x = 2.0 + e.rnd() * 2.6,
    h = 0.08 + e.rnd() * 0.25,
    sw = h * 0.08 * Math.sin(t * 0.4 + i);
  g.beginPath();
  g.moveTo(x + 0.004, 0.0);
  g.quadraticCurveTo(x + sw * 0.3 + 0.004, -h * 0.55, x + sw + 0.003, -h);
  g.stroke();
}
g.restore();
