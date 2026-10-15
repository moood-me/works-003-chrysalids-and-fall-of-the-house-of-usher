// The rock with the cave's mouth behind the ledge (10.5 m): grey-violet stone, its cracks, the deep dark mouth a little
// above the ledge
const top = x => 2.7 + 0.5 * Math.sin(x * 0.9) + 0.3 * Math.sin(x * 2.3) - Math.max(0, x + 3.2) * 1.05;
g.fillStyle = '#7a7280';
g.beginPath();
g.moveTo(-16, 0.05);
for (let x = -16; x <= 0.2; x += 0.25) g.lineTo(x, -Math.max(0, top(x)));
g.lineTo(0.2, 0.05);
g.closePath();
g.fill();
g.strokeStyle = 'rgba(60,54,66,0.45)';
g.lineWidth = 0.03;
for (let i = 0; i < 30; i++) {
  const x = -15 + e.anim.hash(i, 1) * 14, h = 0.4 + e.anim.hash(i, 2) * 2.6;
  if (h > top(x) - 0.2) continue;
  g.beginPath(); g.moveTo(x, -h); g.lineTo(x + (e.anim.hash(i, 3) - 0.5) * 0.6, -h + e.anim.hash(i, 4) * 0.4); g.stroke();
}
g.fillStyle = '#2a2430';
g.beginPath();
g.ellipse(-6.6, -1.3, 1.7, 0.85, 0, Math.PI, 0);
g.lineTo(-4.9, -0.55);
g.lineTo(-8.3, -0.55);
g.closePath();
g.fill();
