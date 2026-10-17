// the log Axel sits on, left of the fire
g.fillStyle = '#6a5038';
g.beginPath(); g.ellipse(0, -0.22, 0.75, 0.22, 0, 0, 7); g.fill();
g.fillStyle = '#9a7c58';
g.beginPath(); g.ellipse(0.72, -0.22, 0.08, 0.2, 0, 0, 7); g.fill();
g.strokeStyle = 'rgba(60,44,30,0.6)';
g.lineWidth = 0.02;
for (const y of [-0.32, -0.2, -0.1]) { g.beginPath(); g.moveTo(-0.7, y); g.lineTo(0.66, y + 0.01); g.stroke(); }
