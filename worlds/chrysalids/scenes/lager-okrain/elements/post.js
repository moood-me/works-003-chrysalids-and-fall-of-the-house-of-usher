// the post the captives are tied to (left of the fire): a rough stake, a coil of rope at its foot; its point `rope`
g.fillStyle = '#5a4a3a';
g.beginPath();
g.moveTo(-0.11, 0.05);
g.lineTo(-0.08, -2.2);
g.lineTo(0.0, -2.35);
g.lineTo(0.08, -2.2);
g.lineTo(0.11, 0.05);
g.closePath();
g.fill();
g.strokeStyle = '#a49470';
g.lineWidth = 0.03;
for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(0.05, -0.05 + i * 0.02, 0.22, 0.06, 0, 0, 7); g.stroke(); }
e.at(0, -1.2, 'rope');
