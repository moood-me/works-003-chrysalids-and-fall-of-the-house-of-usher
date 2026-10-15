g.fillStyle = e.color;
g.beginPath();
g.moveTo(-800, 2);
for (var x = -800; x <= 800; x += 6) {
  var on = Math.sin(x * 0.004) + 0.6 * Math.sin(x * 0.011 + 2);
  var h = on > -0.3 ? 7 + 3 * Math.sin(x * 0.9) + 2 * Math.sin(x * 2.3) : 1.2;
  g.lineTo(x, -h);
}
g.lineTo(800, 2);
g.closePath();
g.fill();
