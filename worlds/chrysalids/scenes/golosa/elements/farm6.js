var s = e.state || {},
  n = Math.round(s.count == null ? 4 : +s.count),
  t = e.t,
  K = 5,
  C = "#1b1e32";
g.fillStyle = C;
var sw = 0.25 * Math.sin(t * 0.33 + 2);
g.beginPath();
g.moveTo(4.6, 0);
g.quadraticCurveTo(3.6, -5.5, 5 + sw, -11);
g.quadraticCurveTo(6.4, -5.5, 5.4, 0);
g.fill();
g.beginPath();
g.moveTo(-2.3, 0);
g.lineTo(-2.3, -2.6);
g.lineTo(0, -3.9);
g.lineTo(2.3, -2.6);
g.lineTo(2.3, 0);
g.fill();
var on = K < n,
  b = on ? 0.85 + 0.15 * Math.sin(t * 0.5 + K * 1.3) : 0.28;
g.fillStyle = "rgba(238,186,112," + b + ")";
g.fillRect(-0.55, -1.9, 1.1, 1.2);
e.light(0, -1.4, on ? 11 : 5, "#e8b06a", on ? 0.9 : 0.3);
