// the hills of the Badlands far beyond (700 m): broken, odd-shaped, in their own dull colours
g.fillStyle = '#5a5a6a';
g.beginPath();
g.moveTo(-1800, 5);
for (let x = -1800; x <= 1800; x += 12) g.lineTo(x, -(30 + 22 * Math.sin(x / 160) * Math.sin(x / 61 + 1) + 14 * Math.abs(Math.sin(x / 37))));
g.lineTo(1800, 5);
g.closePath();
g.fill();
