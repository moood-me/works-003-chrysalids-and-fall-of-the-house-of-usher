var F = "#a48a95",
  R = "#867380";
g.fillStyle = R;
g.beginPath();
g.moveTo(-6.4, -4.2);
g.lineTo(-3.5, -7.3);
g.lineTo(3.5, -7.3);
g.lineTo(6.4, -4.2);
g.closePath();
g.fill();
g.fillStyle = F;
g.fillRect(-6, -4.3, 12, 4.3);
g.strokeStyle = "rgba(81,65,77,0.2)";
g.lineWidth = 0.08;
for (var x = -5.6; x < 6; x += 0.45) {
  g.beginPath();
  g.moveTo(x, -4.2);
  g.lineTo(x, 0);
  g.stroke();
}
g.fillStyle = "#5a4b54";
g.fillRect(-1.6, -3.2, 3.2, 3.2);
g.fillStyle = "#867380";
g.fillRect(-2.4, -3.25, 0.8, 3.25);
g.fillStyle = "rgba(255,255,255,0.25)";
g.beginPath();
g.moveTo(3.5, -7.3);
g.lineTo(6.4, -4.2);
g.lineTo(6.1, -4.2);
g.lineTo(3.3, -7.1);
g.closePath();
g.fill();
