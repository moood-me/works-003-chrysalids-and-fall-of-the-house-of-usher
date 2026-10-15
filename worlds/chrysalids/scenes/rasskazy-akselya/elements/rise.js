// the grass of the rise (a plane draped over the land, seen from above): worn round the fire, tussocks
g.fillStyle = '#6c6c4a';
g.fillRect(-20, -15, 40, 30);
for (let i = 0; i < 160; i++) {
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(80,84,56,0.35)' : 'rgba(150,144,104,0.25)';
  g.beginPath(); g.ellipse(-18 + e.rnd() * 36, -14 + e.rnd() * 28, 0.2 + e.rnd() * 0.8, 0.1 + e.rnd() * 0.4, e.rnd() * 3, 0, 7); g.fill();
}
g.fillStyle = 'rgba(96,82,64,0.6)';
g.beginPath(); g.ellipse(-0.3, 15 - 4.3, 1.6, 1.2, 0, 0, 7); g.fill();
