var C = e.color,
  RIM = "rgba(205,160,140,0.15)",
  LW = 0.07;
function s(x, h) {
  var r = 0.55;
  g.fillStyle = C;
  g.beginPath();
  g.moveTo(x - r, 0);
  g.bezierCurveTo(x - r * 1.02, -h * 0.55, x - r * 0.75, -h * 0.92, x - r * 0.1, -h);
  g.quadraticCurveTo(x + r * 0.15, -h * 1.02, x + r * 0.3, -h * 0.95);
  g.bezierCurveTo(x + r * 0.8, -h * 0.85, x + r * 1.02, -h * 0.5, x + r, 0);
  g.closePath();
  g.fill();
  g.strokeStyle = RIM;
  g.lineWidth = LW;
  g.beginPath();
  g.moveTo(x - r * 0.98, -h * 0.35);
  g.bezierCurveTo(x - r * 0.95, -h * 0.7, x - r * 0.7, -h * 0.93, x - r * 0.1, -h);
  g.stroke();
  g.strokeStyle = "rgba(15,12,20,0.35)";
  g.lineWidth = LW * 1.1;
  g.beginPath();
  g.moveTo(x - r * 0.9, -h * 0.6);
  g.quadraticCurveTo(x, -h * 0.52, x + r * 0.9, -h * 0.6);
  g.stroke();
}
for (var a = 22; a < 100; a += 4.2) {
  s(a + (e.rnd() - 0.5) * 1.4, 0.85 + e.rnd() * 0.2);
}
