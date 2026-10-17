// The oil lamp on the table: its foot, its brass font, its glass chimney; the flame a layer of its own (its animate:
// as bright as `lamp`, wavering) — and the lamp's light, the scene's `lamp` (of its point `flame`), lights the room
g.fillStyle = '#5a4a3a';
g.beginPath();
g.ellipse(0, -0.012, 0.075, 0.018, 0, 0, 7);
g.fill();
g.fillRect(-0.014, -0.1, 0.028, 0.09);
g.fillStyle = '#a07a44';
g.beginPath();
g.ellipse(0, -0.13, 0.068, 0.045, 0, 0, 7);
g.fill();
g.fillStyle = '#5a4a3a';
g.fillRect(-0.03, -0.19, 0.06, 0.028);
g.fillStyle = 'rgba(232,226,210,0.55)';
g.beginPath();
g.moveTo(-0.024, -0.19);
g.bezierCurveTo(-0.05, -0.23, -0.05, -0.29, -0.02, -0.33);
g.lineTo(-0.02, -0.42);
g.lineTo(0.02, -0.42);
g.lineTo(0.02, -0.33);
g.bezierCurveTo(0.05, -0.29, 0.05, -0.23, 0.024, -0.19);
g.closePath();
g.fill();
e.layer('flame', { pivot: [0, -0.215], blend: 'add', box: [-0.04, -0.33, 0.04, -0.2] }, q => {
  const fg = q.createRadialGradient(0, -0.25, 0, 0, -0.25, 0.06);
  fg.addColorStop(0, '#fff6e0');
  fg.addColorStop(0.5, '#ffcf7a');
  fg.addColorStop(1, 'rgba(255,150,60,0)');
  q.fillStyle = fg;
  q.beginPath();
  q.moveTo(0, -0.31);
  q.quadraticCurveTo(0.024, -0.235, 0, -0.212);
  q.quadraticCurveTo(-0.024, -0.235, 0, -0.31);
  q.fill();
});
e.light(0, -0.25, 0.5, '#ffc27a', 1, 'flame');
