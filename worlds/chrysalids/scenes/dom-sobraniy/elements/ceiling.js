// the ceiling seen from below as from above: boards and heavy beams across the hall
g.fillStyle = '#6a5240';
g.fillRect(-10, -2.5, 20, 5);
for (let x = -10; x < 10; x += 0.22) { g.fillStyle = 'rgba(44,32,24,0.35)'; g.fillRect(x, -2.5, 0.012, 5); }
g.fillStyle = '#4e3a2c';
for (const y of [-2.2, -0.9, 0.4, 1.7]) g.fillRect(-10, y - 0.13, 20, 0.26);
