// the far edge of the woods (450 m)
g.fillStyle = '#6e7860';
g.beginPath();
g.moveTo(-1600, 4);
for (let x = -1600; x <= 1600; x += 10) g.lineTo(x, -(18 + 8 * Math.sin(x / 90) + 5 * Math.sin(x / 31 + 1) + 3 * e.rnd()));
g.lineTo(1600, 4);
g.closePath();
g.fill();
