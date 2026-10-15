g.fillStyle = "#6e6474";
g.beginPath();
g.moveTo(-1800, 5);
for (let x = -1800; x <= 1800; x += 30) {
  g.lineTo(x, -14 - 10 * Math.sin(x * 0.004 + 2) - 6 * Math.sin(x * 0.011) - 4 * e.rnd());
}
g.lineTo(1800, 5);
g.closePath();
g.fill();
