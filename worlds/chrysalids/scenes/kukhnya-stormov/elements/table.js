// The heavy table seen from the side we sit at: its legs, the apron under the top (the top itself: tabletop)
g.fillStyle = '#5c4230';
for (const x of [-1.24, 1.14]) {
  g.beginPath();
  g.moveTo(x, -0.66);
  g.lineTo(x + 0.1, -0.66);
  g.lineTo(x + 0.088, 0);
  g.lineTo(x + 0.012, 0);
  g.closePath();
  g.fill();
}
g.fillStyle = '#6e5038';
g.beginPath();
g.moveTo(-1.3, -0.785);
g.lineTo(1.3, -0.785);
g.lineTo(1.29, -0.65);
g.quadraticCurveTo(0, -0.656, -1.29, -0.65);
g.closePath();
g.fill();
g.fillStyle = 'rgba(255,230,190,0.18)';
g.fillRect(-1.3, -0.79, 2.6, 0.012);
