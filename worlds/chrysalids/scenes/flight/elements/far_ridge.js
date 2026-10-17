// the far ridge behind, toward Waknuk (1.2 km), its long line against the sky, a rise on the left where the pursuit comes
g.fillStyle = '#4e5a6e';
g.beginPath();
g.moveTo(-3200, 300);
for (let x = -3200; x <= 3200; x += 20) {
  let r = 12 + 70 * Math.exp(-Math.pow((x + 820) / 380, 2)) + 30 * Math.exp(-Math.pow((x + 1500) / 300, 2)) + 6 * Math.sin(x * 0.0045) + 4 * Math.sin(x * 0.013);
  if (x > -200) r *= Math.max(0.25, 1 - (x + 200) / 1200);
  g.lineTo(x, -r);
}
g.lineTo(3200, 300);
g.closePath();
g.fill();
