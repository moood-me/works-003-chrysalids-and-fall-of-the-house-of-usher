// the open fields below the ridge (a plane seen from above), running away to the wood and the far ridge
g.fillStyle = '#5a6650';
g.fillRect(-120, -38, 240, 76);
for (let y = -38; y < 38; y += 3) {
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(80,92,70,0.35)' : 'rgba(110,118,90,0.25)';
  g.fillRect(-120, y, 240, 1.5 + e.rnd());
}
