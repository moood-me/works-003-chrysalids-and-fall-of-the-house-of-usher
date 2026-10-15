var C = "#e1b9ce";
g.fillStyle = C;
g.beginPath();
g.moveTo(-4000, 40);
for (var x = -4000; x <= 4000; x += 40) {
  var h = 10 + 6 * Math.sin(x / 700) + 4 * Math.sin(x / 230 + 1);
  var tr = Math.max(0, Math.sin(x / 97) + Math.sin(x / 41 + 2) * 0.6) * 7;
  g.lineTo(x, -h - tr);
}
g.lineTo(4000, 40);
g.closePath();
g.fill();
