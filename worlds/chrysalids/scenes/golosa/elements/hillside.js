// the hill's grass (a plane draped over the land near us, seen from above)
g.fillStyle = '#566048';
g.fillRect(-20, -8, 40, 16);
for (let i = 0; i < 120; i++) {
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(60,70,50,0.35)' : 'rgba(120,128,96,0.2)';
  g.beginPath(); g.ellipse(-19 + e.rnd() * 38, -7.5 + e.rnd() * 15, 0.3 + e.rnd() * 1.2, 0.1 + e.rnd() * 0.4, e.rnd() * 3, 0, 7); g.fill();
}
