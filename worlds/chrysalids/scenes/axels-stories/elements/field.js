// the fields running off in the dark (a plane seen from above)
g.fillStyle = '#6a6a50';
g.fillRect(-450, -200, 900, 400);
for (let i = 0; i < 40; i++) {
  const x = -450 + e.rnd() * 900, y = -200 + e.rnd() * 400, r = 10 + e.rnd() * 40;
  const rg = g.createRadialGradient(x, y, 0, x, y, r);
  rg.addColorStop(0, e.rnd() < 0.5 ? 'rgba(60,62,44,0.3)' : 'rgba(140,138,104,0.2)');
  rg.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = rg;
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
}
for (let y = -200; y < 200; y += 2.2) { g.fillStyle = `rgba(150,146,110,${0.05 + e.rnd() * 0.06})`; g.fillRect(-450, y, 900, 0.5); }
