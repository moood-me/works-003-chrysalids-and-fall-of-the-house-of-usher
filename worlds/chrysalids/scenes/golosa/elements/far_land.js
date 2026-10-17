// the far hills (3 km)
g.fillStyle = '#4a4e5e';
g.beginPath();
g.moveTo(-8000, 80);
for (let x = -8000; x <= 8000; x += 100) g.lineTo(x, -16 - 12 * Math.sin(x / 900) - 8 * Math.sin(x / 370 + 1) - 5 * Math.sin(x / 160 + 2));
g.lineTo(8000, 80);
g.closePath();
g.fill();
