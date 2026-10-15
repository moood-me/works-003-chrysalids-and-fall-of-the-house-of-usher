// the far wood round the clearing (42 m): a ragged wall of odd crowns
g.fillStyle = '#4a5a4c';
g.beginPath();
g.moveTo(-120, 1);
for (let x = -120; x <= 120; x += 0.8) g.lineTo(x, -(18 + 8 * Math.sin(x * 0.07) + 5 * Math.abs(Math.sin(x * 0.29)) + 3 * e.rnd()));
g.lineTo(120, 1);
g.closePath();
g.fill();
