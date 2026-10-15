// the grass of the rise (a plane draped over the land, seen from above): worn round the fire, tussocks
g.fillStyle = '#6c6c4a';
g.fillRect(-20, -15, 40, 30);
for (let i = 0; i < 160; i++) {
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(80,84,56,0.35)' : 'rgba(150,144,104,0.25)';
  g.beginPath(); g.ellipse(-18 + e.rnd() * 36, -14 + e.rnd() * 28, 0.2 + e.rnd() * 0.8, 0.1 + e.rnd() * 0.4, e.rnd() * 3, 0, 7); g.fill();
}
// the ground worn round the fire: soft at its edge
{
  const x = -0.3, y = 15 - 4.3, rg = g.createRadialGradient(x, y, 0, x, y, 1.6);
  rg.addColorStop(0, 'rgba(120,104,82,0.45)'); rg.addColorStop(1, 'rgba(120,104,82,0)');
  g.save(); g.translate(x, y); g.scale(1, 0.75); g.translate(-x, -y);
  g.fillStyle = rg; g.beginPath(); g.arc(x, y, 1.6, 0, 7); g.fill(); g.restore();
}
