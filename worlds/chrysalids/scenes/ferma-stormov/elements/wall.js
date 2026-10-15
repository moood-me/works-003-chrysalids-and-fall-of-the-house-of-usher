g.fillStyle = e.color;
g.beginPath();
g.moveTo(14, 0.2);
for (var x = 14; x <= 128; x += 0.7) {
  g.lineTo(x, -0.55 - 0.1 * Math.sin(x * 2.7) - 0.06 * Math.sin(x * 7.1));
}
g.lineTo(128, 0.2);
g.closePath();
g.fill();
g.strokeStyle = "rgba(150,125,130,0.25)";
g.lineWidth = 0.06;
g.beginPath();
for (var x = 14; x <= 128; x += 0.7) {
  g.moveTo(x, -0.6 - 0.1 * Math.sin(x * 2.7));
  g.lineTo(x + 0.5, -0.6 - 0.1 * Math.sin((x + 0.5) * 2.7));
}
g.stroke();
