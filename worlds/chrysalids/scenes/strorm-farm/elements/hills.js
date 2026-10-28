// the far hills (900 m)
g.fillStyle = '#8a8ca0';
g.beginPath();
g.moveTo(-3000, 5);
for (let x = -3000; x <= 3000; x += 50) g.lineTo(x, -16 - 12 * Math.sin(x * 0.0021) - 7 * Math.sin(x * 0.0057 + 1) - 4 * Math.sin(x * 0.013));
g.lineTo(3000, 5);
g.closePath();
g.fill();
