// stubble fields running away (a plane seen from above)
g.fillStyle = '#b8a46e';
g.fillRect(-600, -200, 1200, 400);
for (let y = -200; y < 200; y += 6) { g.fillStyle = e.rnd() < 0.5 ? 'rgba(150,130,84,0.35)' : 'rgba(210,190,140,0.25)'; g.fillRect(-600, y, 1200, 2 + e.rnd() * 2); }
