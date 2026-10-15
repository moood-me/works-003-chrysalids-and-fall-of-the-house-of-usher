// the far edge of the woods across the fields (900 m), soft in the rain's haze
g.fillStyle = '#6a7466';
g.beginPath();
g.moveTo(-3000, 5);
for (let x = -3000; x <= 3000; x += 15) g.lineTo(x, -(14 + 8 * Math.sin(x / 140 + 1) + 5 * Math.sin(x / 47) + 3 * e.rnd()));
g.lineTo(3000, 5);
g.closePath();
g.fill();
