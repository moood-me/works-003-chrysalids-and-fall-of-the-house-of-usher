var s = e.state || {},
  n = Math.round(s.count == null ? 4 : +s.count),
  t = e.t,
  K = 2,
  C = "#191c30";
g.fillStyle = C;
function pop(x, h) {
  var sw = 0.25 * Math.sin(t * 0.37 + x) + 0.1 * Math.sin(t * 0.91 + x * 2);
  g.beginPath();
  g.moveTo(x - 0.35, 0);
  g.quadraticCurveTo(x - h * 0.14, -h * 0.5, x + sw, -h);
  g.quadraticCurveTo(x + h * 0.14, -h * 0.5, x + 0.35, 0);
  g.fill();
}
pop(-4.2, 11);
pop(-6.2, 13.5);
pop(-8.3, 10);
g.beginPath();
g.moveTo(-2.2, 0);
g.lineTo(-2.2, -2.8);
g.lineTo(0, -4.2);
g.lineTo(2.2, -2.8);
g.lineTo(2.2, 0);
g.fill();
var on = K < n,
  b = on ? 0.85 + 0.15 * Math.sin(t * 0.5 + K * 1.3) : 0.28;
g.fillStyle = "rgba(238,186,112," + b + ")";
g.fillRect(-0.45, -2, 0.9, 1);
e.light(0, -1.5, on ? 8 : 4, "#e8b06a", on ? 0.9 : 0.3);
