// the clearing (a plane seen from above: its middle 50 m off): trodden earth round the fire, ash, odd pale moss further out
g.fillStyle = '#5e5848';
g.fillRect(-70, -50, 140, 100);
const tr = g.createRadialGradient(-1.2, 40, 0, -1.2, 40, 9);
tr.addColorStop(0, 'rgba(110,96,80,0.8)');
tr.addColorStop(1, 'rgba(110,96,80,0)');
g.fillStyle = tr;
g.fillRect(-12, 30, 22, 20);
for (let i = 0; i < 120; i++) {
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(80,88,64,0.4)' : 'rgba(120,128,104,0.3)';
  g.beginPath();
  g.ellipse(-70 + e.rnd() * 140, -50 + e.rnd() * 80, 1 + e.rnd() * 3, 0.4 + e.rnd() * 1, e.rnd() * 3, 0, 7);
  g.fill();
}
// the burnt ground under the fire (lib.FIRE: 6.2 m off — the plane's middle at 50), soft at its edge
{
  const [fa, fd] = e.lib.FIRE, y = 50 - fd;
  const rg = g.createRadialGradient(fa, y, 0, fa, y, 1.1);
  rg.addColorStop(0, 'rgba(62,58,52,0.9)'); rg.addColorStop(0.6, 'rgba(62,58,52,0.6)'); rg.addColorStop(1, 'rgba(62,58,52,0)');
  g.save(); g.translate(fa, y); g.scale(1, 0.75); g.translate(-fa, -y);
  g.fillStyle = rg; g.beginPath(); g.arc(fa, y, 1.1, 0, 7); g.fill(); g.restore();
}
