var s = e.state || {},
  n = Math.round(s.count == null ? 4 : +s.count),
  t = e.t,
  K = 3,
  C = "#1a1d31";
g.fillStyle = C;
g.beginPath();
g.moveTo(-2.6, 0);
g.lineTo(-2.6, -2.6);
g.lineTo(0, -4);
g.lineTo(2.6, -2.6);
g.lineTo(2.6, 0);
g.fill();
g.fillRect(3.6, -6.5, 2.4, 6.5);
g.beginPath();
g.arc(4.8, -6.5, 1.2, Math.PI, 0);
g.fill();
var on = K < n,
  b = on ? 0.85 + 0.15 * Math.sin(t * 0.5 + K * 1.3) : 0.28;
g.fillStyle = "rgba(238,186,112," + b + ")";
g.fillRect(-0.5, -2, 1, 1.1);
e.light(0, -1.5, on ? 9 : 4.5, "#e8b06a", on ? 0.9 : 0.3);
