// the ground of the Fringes beyond the fence (a plane seen from above): rough, patchy, odd growth in pale patches
g.fillStyle = '#4e5a48';
g.fillRect(-100, -38.2, 200, 76.4);
for (let i = 0; i < 160; i++) {
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(70,84,64,0.5)' : 'rgba(110,122,96,0.35)';
  g.beginPath();
  g.ellipse(-100 + e.rnd() * 200, -38 + e.rnd() * 76, 1 + e.rnd() * 4, 0.4 + e.rnd() * 1.4, e.rnd() * 3, 0, 7);
  g.fill();
}
