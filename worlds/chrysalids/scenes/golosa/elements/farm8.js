var s = e.state || {},
  n = Math.round(s.count == null ? 4 : +s.count),
  t = e.t,
  K = 7,
  C = "#1c1f33";
g.fillStyle = C;
g.beginPath();
g.moveTo(-3.6, 0);
g.quadraticCurveTo(-4.8, -5, -4 + 0.2 * Math.sin(t * 0.4), -10);
g.quadraticCurveTo(-3, -5, -2.9, 0);
g.fill();
g.beginPath();
g.moveTo(-2.2, 0);
g.lineTo(-2.2, -2.4);
g.lineTo(0, -3.7);
g.lineTo(2.2, -2.4);
g.lineTo(2.2, 0);
g.fill();
var on = K < n,
  b = on ? 0.85 + 0.15 * Math.sin(t * 0.5 + K * 1.3) : 0.25;
g.fillStyle = "rgba(238,186,112," + b + ")";
g.fillRect(-0.6, -1.8, 1.2, 1.2);
e.light(0, -1.3, on ? 12 : 5, "#e8b06a", on ? 0.9 : 0.28);
