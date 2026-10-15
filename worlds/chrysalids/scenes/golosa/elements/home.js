var s = e.state || {},
  pe = s.petra == null ? 0 : +s.petra,
  t = e.t,
  C = "#171a2c";
g.fillStyle = C;
for (var i = 0; i < 6; i++) {
  g.beginPath();
  g.ellipse(-8 + Math.sin(i * 2.1) * 2, -7.5 - Math.cos(i * 1.7) * 2.2, 2.6, 2.2, 0, 0, 7);
  g.fill();
}
g.fillRect(-8.3, -4.5, 0.6, 4.5);
function pop(x, h) {
  var sw = 0.2 * Math.sin(t * 0.35 + x) + 0.08 * Math.sin(t * 0.83 + x);
  g.beginPath();
  g.moveTo(x - 0.3, 0);
  g.quadraticCurveTo(x - h * 0.13, -h * 0.5, x + sw, -h);
  g.quadraticCurveTo(x + h * 0.13, -h * 0.5, x + 0.3, 0);
  g.fill();
}
pop(5.6, 10);
pop(7.2, 8.5);
g.beginPath();
g.moveTo(-3.2, 0);
g.lineTo(-3.2, -3.4);
g.lineTo(-3.6, -3.4);
g.lineTo(0, -6);
g.lineTo(3.6, -3.4);
g.lineTo(3.2, -3.4);
g.lineTo(3.2, 0);
g.closePath();
g.fill();
g.fillRect(1.4, -6.3, 0.55, 1.8);
var b = Math.min(1, 0.78 + 0.1 * Math.sin(t * 0.4) + pe * (0.2 + 0.15 * Math.sin(t * 0.9)));
g.fillStyle = "rgba(240,192,122," + b + ")";
g.fillRect(-0.4, -2.4, 0.8, 1);
e.light(0, -1.9, 4 + pe * 6, "#f0c080", 0.6 + pe * 0.6);
