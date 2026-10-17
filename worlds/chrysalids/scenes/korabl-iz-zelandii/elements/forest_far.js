// the far wood of the Fringes (120 m)
g.fillStyle = '#5a5e5a';
g.beginPath();
g.moveTo(-200, 2);
for (let x = -200; x <= 200; x += 1) g.lineTo(x, -(18 + 7 * Math.sin(x * 0.06) + 4 * Math.abs(Math.sin(x * 0.27)) + 2 * e.rnd()));
g.lineTo(200, 2);
g.closePath();
g.fill();
