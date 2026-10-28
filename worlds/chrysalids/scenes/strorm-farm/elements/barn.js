// The barn on the left (20 m): its gable end turned to the yard, weathered boards, the big double door with its braces
// (its point `door`), the hay-loft door above. Painted once in daylight colours.
g.fillStyle = '#7c5c48';
g.beginPath();
g.moveTo(-7, 0.05); g.lineTo(-7, -5); g.lineTo(-4.5, -8); g.lineTo(0, -9.2); g.lineTo(4.5, -8); g.lineTo(7, -5); g.lineTo(7, 0.05);
g.closePath();
g.fill();
g.save();
g.clip();
for (let x = -7; x < 7; x += 0.3) {
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(60,44,34,0.2)' : 'rgba(170,140,116,0.14)';
  g.fillRect(x, -9.3, 0.3, 9.4);
  g.fillStyle = 'rgba(50,38,30,0.4)';
  g.fillRect(x + 0.28, -9.3, 0.022, 9.4);
}
g.restore();
g.strokeStyle = '#4e4448';
g.lineWidth = 0.35;
g.lineJoin = 'round';
g.beginPath(); g.moveTo(-7.2, -4.85); g.lineTo(-4.5, -8.05); g.lineTo(0, -9.3); g.lineTo(4.5, -8.05); g.lineTo(7.2, -4.85); g.stroke();
g.fillStyle = '#5a4234';
g.fillRect(-2.2, -4.2, 4.4, 4.25);
g.strokeStyle = '#8e7258';
g.lineWidth = 0.14;
g.beginPath();
g.rect(-2.2, -4.2, 4.4, 4.2);
g.moveTo(0, -4.2); g.lineTo(0, 0);
g.moveTo(-2.2, -4.2); g.lineTo(0, 0); g.moveTo(0, -4.2); g.lineTo(-2.2, 0);
g.moveTo(0, -4.2); g.lineTo(2.2, 0); g.moveTo(2.2, -4.2); g.lineTo(0, 0);
g.stroke();
g.fillStyle = '#4a382e';
g.fillRect(-0.6, -7, 1.2, 1.05);
g.strokeStyle = '#8e7258';
g.lineWidth = 0.08;
g.strokeRect(-0.6, -7, 1.2, 1.05);
e.at(0, -2.1, 'door');
e.at(0, -2.1);
