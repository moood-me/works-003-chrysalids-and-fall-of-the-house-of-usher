var t = e.t,
  s = e.state || {},
  dk = +(s.dusk || 0);
g.fillStyle = "rgba(70,56,38,0.16)";
g.beginPath();
g.ellipse(-8, 0.05, 10, 0.3, 0, 0, 7);
g.fill();
g.fillStyle = "#5d5541";
g.beginPath();
g.moveTo(4.4, -3.7);
g.lineTo(9, -7);
g.lineTo(13.6, -3.7);
g.closePath();
g.fill();
g.fillStyle = "#776d55";
g.fillRect(5, -3.75, 8, 3.75);
g.fillStyle = "#4a4234";
g.fillRect(7.8, -2.6, 2.4, 2.6);
g.fillStyle = "#ada386";
g.fillRect(-4.5, -3.3, 9, 3.3);
g.fillStyle = "#6b604b";
g.beginPath();
g.moveTo(-5, -3.2);
g.lineTo(-4, -5.6);
g.lineTo(4, -5.6);
g.lineTo(5, -3.2);
g.closePath();
g.fill();
g.fillRect(2.4, -6.6, 0.6, 1.3);
g.strokeStyle = "rgba(252,230,180,0.5)";
g.lineWidth = 0.12;
g.beginPath();
g.moveTo(-4, -5.6);
g.lineTo(4, -5.6);
g.lineTo(5, -3.2);
g.stroke();
g.beginPath();
g.moveTo(9, -7);
g.lineTo(13.6, -3.7);
g.stroke();
g.fillStyle = "#463f33";
g.fillRect(-2.1, -2.2, 1, 2.2);
var wl = Math.min(1, dk * 1.5);
g.fillStyle = "#575044";
g.fillRect(1.2, -2.4, 1, 0.9);
g.fillRect(-3.8, -2.4, 1, 0.9);
if (wl > 0.01) {
  g.fillStyle = "rgba(242,192,120," + wl + ")";
  g.fillRect(1.2, -2.4, 1, 0.9);
  g.fillRect(-3.8, -2.4, 1, 0.9);
  e.light(1.7, -1.95, 2.5, "#f0b870", wl * 0.8);
  e.light(-3.3, -1.95, 2.5, "#f0b870", wl * 0.8);
}
for (var i = 0; i < 7; i++) {
  var u = (t * 0.025 + i / 7) % 1;
  var x = 2.7 - u * 7,
    y = -6.9 - u * 4.5,
    r = 0.3 + u * 1.3,
    a = 0.16 * (1 - u) * Math.min(1, u * 6);
  var sg = g.createRadialGradient(x, y, 0, x, y, r);
  sg.addColorStop(0, "rgba(228,222,206," + a + ")");
  sg.addColorStop(1, "rgba(228,222,206,0)");
  g.fillStyle = sg;
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
}
