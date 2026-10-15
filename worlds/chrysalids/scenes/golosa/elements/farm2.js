var s = e.state || {},
  n = Math.round(s.count == null ? 4 : +s.count),
  t = e.t,
  K = 1,
  C = "#191c30";
g.fillStyle = C;
g.strokeStyle = C;
g.beginPath();
g.moveTo(-2.4, 0);
g.lineTo(-2.4, -2.8);
g.lineTo(0, -4.3);
g.lineTo(2.4, -2.8);
g.lineTo(2.4, 0);
g.fill();
g.beginPath();
g.moveTo(4.8, 0);
g.lineTo(7.2, 0);
g.lineTo(6.15, -8.6);
g.lineTo(5.85, -8.6);
g.closePath();
g.fill();
var a0 = t * 0.22 + 0.4 * Math.sin(t * 0.07);
g.lineWidth = 0.22;
g.lineCap = "round";
for (var i = 0; i < 12; i++) {
  var a = a0 + (i * Math.PI) / 6;
  g.beginPath();
  g.moveTo(6 + Math.cos(a) * 0.3, -9 + Math.sin(a) * 0.3);
  g.lineTo(6 + Math.cos(a) * 1.9, -9 + Math.sin(a) * 1.9);
  g.stroke();
}
g.beginPath();
g.moveTo(6, -9);
g.lineTo(8.6, -9.2);
g.lineTo(8.6, -8.4);
g.closePath();
g.fill();
var on = K < n,
  b = on ? 0.85 + 0.15 * Math.sin(t * 0.5 + K * 1.3) : 0.28;
g.fillStyle = "rgba(238,186,112," + b + ")";
g.fillRect(-0.45, -2, 0.9, 1);
e.light(0, -1.5, on ? 7 : 3.5, "#e8b06a", on ? 0.9 : 0.3);
