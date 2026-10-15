var s = e.state || {},
  n = Math.round(s.count == null ? 4 : +s.count),
  t = e.t,
  K = 0,
  C = "#191c30";
g.fillStyle = C;
g.beginPath();
g.moveTo(-2.5, 0);
g.lineTo(-2.5, -3);
g.lineTo(0, -4.6);
g.lineTo(2.5, -3);
g.lineTo(2.5, 0);
g.fill();
g.beginPath();
g.moveTo(-14, 0);
g.lineTo(-14, -4);
g.lineTo(-12.6, -6.4);
g.lineTo(-9.5, -7.6);
g.lineTo(-6.4, -6.4);
g.lineTo(-5, -4);
g.lineTo(-5, 0);
g.fill();
var on = K < n,
  b = on ? 0.85 + 0.15 * Math.sin(t * 0.5 + K * 1.3) : 0.28;
g.fillStyle = "rgba(238,186,112," + b + ")";
g.fillRect(-0.45, -2.1, 0.9, 1);
e.light(0, -1.6, on ? 7 : 3.5, "#e8b06a", on ? 0.9 : 0.3);
