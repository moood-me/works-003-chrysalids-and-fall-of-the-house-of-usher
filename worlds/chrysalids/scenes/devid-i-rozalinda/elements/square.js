var s = e.state || {},
  dk = s.dusk == null ? 0.2 : +s.dusk;
var gr = g.createLinearGradient(0, -60, 0, 40);
gr.addColorStop(0, "#8a7068");
gr.addColorStop(0.45, "#7a6260");
gr.addColorStop(1, "#4c3d42");
g.fillStyle = gr;
g.fillRect(-150, -60, 300, 100);
for (var i = 0; i < 160; i++) {
  var x = -120 + e.rnd() * 240,
    y = -58 + e.rnd() * 96,
    rx = 2 + e.rnd() * 9,
    ry = 1 + e.rnd() * 4,
    lt = e.rnd() < 0.5;
  g.save();
  g.translate(x, y);
  g.scale(1, ry / rx);
  var pg = g.createRadialGradient(0, 0, 0, 0, 0, rx);
  pg.addColorStop(0, lt ? "rgba(160,128,110,0.2)" : "rgba(50,38,44,0.16)");
  pg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = pg;
  g.beginPath();
  g.arc(0, 0, rx, 0, 7);
  g.fill();
  g.restore();
}
g.save();
g.lineCap = "round";
g.strokeStyle = "rgba(175,140,115,0.14)";
g.lineWidth = 2.6;
g.beginPath();
g.moveTo(-1.6, 33);
g.bezierCurveTo(-2.2, 18, -5.4, 4, -8, -9);
g.stroke();
g.lineWidth = 1.2;
g.strokeStyle = "rgba(190,152,124,0.12)";
g.stroke();
g.restore();
for (var r = 0; r < 2; r++) {
  var o = r * 1.5;
  g.strokeStyle = "rgba(48,36,42,0.4)";
  g.lineWidth = 0.14;
  g.beginPath();
  g.moveTo(-2.6 + o, 33);
  g.bezierCurveTo(-3.0 + o, 18, -6.2 + o * 0.6, 4, -8.6 + o * 0.4, -9);
  g.stroke();
  g.strokeStyle = "rgba(195,155,125,0.22)";
  g.lineWidth = 0.07;
  g.beginPath();
  g.moveTo(-2.45 + o, 33);
  g.bezierCurveTo(-2.85 + o, 18, -6.05 + o * 0.6, 4, -8.48 + o * 0.4, -9);
  g.stroke();
}
g.strokeStyle = "rgba(50,38,42,0.26)";
g.lineWidth = 0.1;
for (var r = 0; r < 2; r++) {
  var x0 = 3 + r * 1.4;
  g.beginPath();
  g.moveTo(x0, 33);
  g.bezierCurveTo(x0 + 1, 20, x0 + 4, 8, x0 + 9, -6);
  g.stroke();
}
g.fillStyle = "rgba(45,34,40,0.35)";
for (var i = 0; i < 500; i++) {
  var x = -60 + e.rnd() * 120,
    y = -50 + e.rnd() * 88,
    r = 0.04 + e.rnd() * 0.12;
  g.beginPath();
  g.ellipse(x, y, r, r * 0.7, 0, 0, 7);
  g.fill();
}
for (var i = 0; i < 9; i++) {
  var x = -26 + i * 7 + e.rnd() * 5,
    y = -20 + e.rnd() * 48;
  g.save();
  g.translate(x, y);
  g.rotate(-0.75);
  g.scale(1, 0.18);
  var sg = g.createRadialGradient(0, 0, 0, 0, 0, 18);
  sg.addColorStop(0, "rgba(45,32,42," + 0.3 * (1 - dk * 0.6) + ")");
  sg.addColorStop(1, "rgba(45,32,42,0)");
  g.fillStyle = sg;
  g.beginPath();
  g.arc(0, 0, 18, 0, 7);
  g.fill();
  g.restore();
}
for (var i = 0; i < 6; i++) {
  var x = -10 + i * 7 + e.rnd() * 4,
    y = 0 + e.rnd() * 25;
  g.save();
  g.translate(x, y);
  g.rotate(-0.75);
  g.scale(1, 0.12);
  var lp = g.createRadialGradient(0, 0, 0, 0, 0, 9);
  lp.addColorStop(0, "rgba(205,165,128," + 0.2 * (1 - dk) + ")");
  lp.addColorStop(1, "rgba(205,165,128,0)");
  g.fillStyle = lp;
  g.beginPath();
  g.arc(0, 0, 9, 0, 7);
  g.fill();
  g.restore();
}
g.strokeStyle = "rgba(60,44,50,0.3)";
g.lineWidth = 0.05;
for (var i = 0; i < 220; i++) {
  var x = -25 + e.rnd() * 50,
    y = -10 + e.rnd() * 45;
  g.beginPath();
  g.arc(x, y, 0.07, 0, Math.PI);
  g.stroke();
}
g.fillStyle = "rgba(150,120,98,0.35)";
for (var i = 0; i < 90; i++) {
  var x = -20 + e.rnd() * 40,
    y = 0 + e.rnd() * 34;
  g.save();
  g.translate(x, y);
  g.rotate(e.rnd() * 3);
  g.fillRect(-0.12, -0.008, 0.24, 0.016);
  g.restore();
}
g.fillStyle = "rgba(52,40,46,0.5)";
for (var i = 0; i < 60; i++) {
  var side = e.rnd() < 0.5 ? -1 : 1,
    x = side * (34 + e.rnd() * 40),
    y = -55 + e.rnd() * 90,
    r = 0.5 + e.rnd() * 2;
  g.beginPath();
  g.ellipse(x, y, r, r * 0.6, 0, 0, 7);
  g.fill();
}
