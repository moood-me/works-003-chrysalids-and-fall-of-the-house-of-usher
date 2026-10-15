// the far wood of the Fringes (80 m): a ragged mass of odd crowns
g.fillStyle = '#3e4e48';
g.beginPath();
g.moveTo(-140, 1);
for (let x = -140; x <= 140; x += 0.8) g.lineTo(x, -(14 + 8 * Math.sin(x * 0.09) + 5 * Math.abs(Math.sin(x * 0.31)) + 3 * e.rnd()));
g.lineTo(140, 1);
g.closePath();
g.fill();
