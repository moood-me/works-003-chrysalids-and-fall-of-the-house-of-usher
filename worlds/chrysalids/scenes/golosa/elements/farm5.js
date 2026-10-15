var s = e.state || {},
  n = Math.round(s.count == null ? 4 : +s.count),
  t = e.t,
  K = 4,
  C = "#1a1d31";
g.fillStyle = C;
for (var i = 0; i < 5; i++) {
  g.beginPath();
  g.ellipse(-7 + Math.sin(i * 2.1) * 2, -6.5 - Math.cos(i * 1.7) * 1.8, 2.8, 2.3, 0, 0, 7);
  g.fill();
}
g.fillRect(-7.3, -4, 0.6, 4);
g.beginPath();
g.moveTo(-4, 0);
g.lineTo(-4, -2.3);
g.lineTo(-2.6, -3.4);
g.lineTo(3.2, -3.4);
g.lineTo(4, -2.3);
g.lineTo(4, 0);
g.fill();
var on = K < n,
  b = on ? 0.85 + 0.15 * Math.sin(t * 0.5 + K * 1.3) : 0.28;
g.fillStyle = "rgba(238,186,112," + b + ")";
g.fillRect(-0.5, -1.9, 1, 1.1);
e.light(0, -1.4, on ? 10 : 5, "#e8b06a", on ? 0.9 : 0.3);
