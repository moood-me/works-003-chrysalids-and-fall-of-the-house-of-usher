var s = e.state || {},
  n = Math.round(s.count == null ? 4 : +s.count),
  t = e.t,
  K = 6,
  C = "#1a1d31";
g.fillStyle = C;
g.strokeStyle = C;
g.beginPath();
g.moveTo(-2.3, 0);
g.lineTo(-2.3, -2.6);
g.lineTo(0, -4);
g.lineTo(2.3, -2.6);
g.lineTo(2.3, 0);
g.fill();
g.beginPath();
g.moveTo(-6.4, 0);
g.lineTo(-4.2, 0);
g.lineTo(-5.15, -8);
g.lineTo(-5.45, -8);
g.closePath();
g.fill();
var a0 = -t * 0.17;
g.lineWidth = 0.25;
for (var i = 0; i < 10; i++) {
  var a = a0 + (i * Math.PI) / 5;
  g.beginPath();
  g.moveTo(-5.3, -8.4);
  g.lineTo(-5.3 + Math.cos(a) * 1.8, -8.4 + Math.sin(a) * 1.8);
  g.stroke();
}
var on = K < n,
  b = on ? 0.85 + 0.15 * Math.sin(t * 0.5 + K * 1.3) : 0.28;
g.fillStyle = "rgba(238,186,112," + b + ")";
g.fillRect(-0.5, -1.9, 1, 1.1);
e.light(0, -1.4, on ? 10 : 5, "#e8b06a", on ? 0.9 : 0.3);
