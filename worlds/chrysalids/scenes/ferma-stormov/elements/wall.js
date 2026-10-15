// the stone wall between the fields on the right (40 m)
g.fillStyle = '#8c8476';
g.beginPath();
g.moveTo(0, 0.2);
for (let x = 0; x <= 90; x += 0.7) g.lineTo(x, -0.55 - 0.1 * Math.sin(x * 2.7) - 0.06 * Math.sin(x * 7.1));
g.lineTo(90, 0.2);
g.closePath();
g.fill();
g.strokeStyle = 'rgba(80,74,66,0.45)';
g.lineWidth = 0.05;
g.beginPath();
for (let x = 0; x <= 90; x += 0.7) { g.moveTo(x, -0.3 - 0.05 * Math.sin(x * 5)); g.lineTo(x + 0.45, -0.3 - 0.05 * Math.sin(x * 5 + 2)); }
g.stroke();
