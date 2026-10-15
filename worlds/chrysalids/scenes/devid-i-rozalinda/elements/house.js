function cl(v) {
  return Math.max(0, Math.min(1, v));
}
var t = 0,
  s = e.state || {},
  dk = 0;
var F = "#9d8491",
  S = "#fcceca";
g.fillStyle = S;
g.beginPath();
g.moveTo(4.5, 0);
g.lineTo(4.5, -6.2);
g.lineTo(7.5, -6.6);
g.lineTo(7.5, -0.3);
g.closePath();
g.fill();
g.fillStyle = "#867380";
g.beginPath();
g.moveTo(-4.8, -6.0);
g.lineTo(-2.2, -8.6);
g.lineTo(5.6, -8.8);
g.lineTo(7.9, -6.5);
g.lineTo(4.9, -6.0);
g.closePath();
g.fill();
g.fillStyle = "rgba(255,255,255,0.22)";
g.beginPath();
g.moveTo(5.6, -8.8);
g.lineTo(7.9, -6.5);
g.lineTo(7.5, -6.5);
g.lineTo(5.4, -8.6);
g.closePath();
g.fill();
g.fillStyle = F;
g.fillRect(-4.5, -6.2, 9, 6.2);
g.fillRect(3.4, -9.6, 0.7, 1.6);
g.strokeStyle = "rgba(81,65,77,0.16)";
g.lineWidth = 0.05;
for (var y = -0.3; y > -6; y -= 0.3) {
  g.beginPath();
  g.moveTo(-4.45, y);
  g.lineTo(4.45, y);
  g.stroke();
}
function w(x, y, lit) {
  g.fillStyle = "#675865";
  g.fillRect(x - 0.45, y - 0.7, 0.9, 1.3);
  g.fillStyle = "rgba(255,252,242,0.3)";
  g.fillRect(x - 0.37, y - 0.62, 0.74, 1.14);
  if (lit > 0.02) {
    g.fillStyle = "rgba(255,255,236," + lit + ")";
    g.fillRect(x - 0.37, y - 0.62, 0.74, 1.14);
    e.light(x, y, 1.4, "#ffffce", lit * 0.7);
  }
  g.fillStyle = "#675865";
  g.fillRect(x - 0.03, y - 0.62, 0.06, 1.14);
  g.fillRect(x - 0.37, y - 0.06, 0.74, 0.05);
}
var L = cl((dk - 0.25) * 1.6) * (0.85 + 0.1 * Math.sin(t * 0.5));
w(-2.6, -4.4, 0);
w(0, -4.4, 0);
w(2.6, -4.4, L * 0.6);
w(-2.6, -1.6, L);
w(2.6, -1.6, 0);
g.fillStyle = "#52454f";
g.fillRect(-0.5, -2.3, 1.0, 2.3);
g.fillStyle = "#867380";
g.beginPath();
g.moveTo(-4.9, -2.9);
g.lineTo(4.9, -2.9);
g.lineTo(5.2, -2.5);
g.lineTo(-5.2, -2.5);
g.closePath();
g.fill();
for (var i = 0; i < 5; i++) {
  g.fillRect(-4.6 + i * 2.3, -2.5, 0.15, 2.5);
}
g.fillRect(-5, -0.25, 10, 0.25);

// two of its windows lit at dusk (house.animate.js)
e.layer('lit', {}, q => { q.fillStyle = 'rgb(238,184,112)'; q.fillRect(2.6 - 0.37, -4.4 - 0.62, 0.74, 1.14); q.fillRect(-2.6 - 0.37, -1.6 - 0.62, 0.74, 1.14); });
e.light(2.6, -4.4, 1.4, '#e8a860', 0.7, 'w1');
e.light(-2.6, -1.6, 1.4, '#e8a860', 0.7, 'w2');
