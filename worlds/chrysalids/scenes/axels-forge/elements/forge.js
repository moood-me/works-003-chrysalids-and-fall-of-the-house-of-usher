// The forge (against the far wall, 6.5 m off): the brick hearth, the hood and its chimney up into the roof, the coal bed
// glowing (a layer of its own that glows — forge.animate.js breathes it with `fire`), the slack tub beside it. Its fire is
// the scene's: the particles fire, sparks and smoke, the light `fire`.
g.fillStyle = '#5a4a40';
g.beginPath();
g.moveTo(-0.3, -7); g.lineTo(-0.28, -3.0);
g.bezierCurveTo(-0.5, -2.5, -0.85, -2.0, -0.98, -1.8);
g.lineTo(0.98, -1.8);
g.bezierCurveTo(0.85, -2.0, 0.5, -2.5, 0.28, -3.0);
g.lineTo(0.3, -7);
g.closePath();
g.fill();
g.fillStyle = '#8a5a44';
g.beginPath();
g.moveTo(-0.9, 0.05); g.lineTo(-0.86, -0.92); g.quadraticCurveTo(0, -0.98, 0.86, -0.93); g.lineTo(0.9, 0.05);
g.closePath();
g.fill();
g.strokeStyle = 'rgba(60,34,24,0.6)';
g.lineWidth = 0.012;
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 5; c++) {
    const x = -0.86 + c * 0.36 + (r % 2) * 0.18, y = -0.02 - r * 0.23;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 0.22); g.stroke();
  }
  g.beginPath(); g.moveTo(-0.88, -0.22 * (r + 1)); g.lineTo(0.88, -0.22 * (r + 1)); g.stroke();
}
// the slack tub
g.fillStyle = '#5e4836';
g.beginPath();
g.moveTo(0.98, 0.04); g.lineTo(0.96, -0.5); g.quadraticCurveTo(1.3, -0.53, 1.62, -0.5); g.lineTo(1.6, 0.04);
g.closePath();
g.fill();
// the coal bed: dark coals, red-gold between them
e.layer('coals', { blend: 'add', box: [-0.75, -1.15, 0.75, -0.85] }, q => {
  for (let i = 0; i < 22; i++) {
    const x = -0.62 + e.rnd() * 1.24, y = -0.95 - e.rnd() * 0.06;
    q.fillStyle = e.rnd() < 0.5 ? '#ff8a3a' : '#e05a20';
    q.beginPath();
    q.ellipse(x, y, 0.05 + e.rnd() * 0.05, 0.022 + e.rnd() * 0.015, 0, 0, 7);
    q.fill();
  }
});
g.fillStyle = '#2e2622';
for (let i = 0; i < 16; i++) {
  g.beginPath();
  g.ellipse(-0.62 + e.rnd() * 1.24, -0.93 - e.rnd() * 0.05, 0.04 + e.rnd() * 0.04, 0.02, 0, 0, 7);
  g.fill();
}
e.at(0, -1.0, 'fire');
