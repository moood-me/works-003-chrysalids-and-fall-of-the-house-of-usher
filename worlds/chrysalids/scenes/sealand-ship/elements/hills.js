// far hills (700 m)
g.fillStyle = '#6e6a76';
g.beginPath();
g.moveTo(-1800, 5);
for (let x = -1800; x <= 1800; x += 15) g.lineTo(x, -(30 + 18 * Math.sin(x / 210) + 10 * Math.sin(x / 73 + 1)));
g.lineTo(1800, 5);
g.closePath();
g.fill();
