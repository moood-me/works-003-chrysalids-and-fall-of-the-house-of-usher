// The fire at the clearing's middle: a ring of stones, logs laid in a star, charred; its flames, embers and smoke are the
// scene's particles, its light the scene's `fire` (how high it burns: `fire`). Its point — where the game offers “Wait
// here”
g.fillStyle = '#6e6a62';
for (let i = 0; i < 12; i++) {
  const a = (i / 12) * Math.PI * 2;
  g.beginPath();
  g.ellipse(Math.cos(a) * 0.75, 0.05 + Math.sin(a) * 0.12, 0.16, 0.1, 0, 0, 7);
  g.fill();
}
g.strokeStyle = '#4a3c30';
g.lineCap = 'round';
g.lineWidth = 0.12;
for (const [x0, y0, x1, y1] of [[-0.6, 0.05, 0.1, -0.25], [0.6, 0.06, -0.05, -0.28], [-0.2, 0.12, 0.05, -0.3], [0.3, 0.1, -0.1, -0.22]]) {
  g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
}
e.at(0, -0.9);
