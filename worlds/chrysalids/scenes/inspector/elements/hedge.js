// the hedgerow along the fields (170 m) and an elm in it
g.fillStyle = '#5e6a4c';
g.beginPath();
g.moveTo(-700, 2);
for (let x = -700; x <= 700; x += 4) g.lineTo(x, -(4 + 1.5 * Math.sin(x / 13) + e.rnd()));
g.lineTo(700, 2);
g.closePath();
g.fill();
g.fillStyle = '#5a5040';
g.fillRect(118, -14, 1.2, 12);
g.fillStyle = '#56644a';
g.beginPath();
g.ellipse(119, -16, 7, 6, 0, 0, 7);
g.fill();
