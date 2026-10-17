// The oil lamp on the elders' table — the one light of the hall (the scene's `lamp`, of its point `flame`): its foot,
// its brass font, its glass chimney, the flame a layer within; the whole lamp a layer that tips off the table when it
// is knocked down (lamp.animate.js: `spill`)
e.layer('lamp', { pivot: [0, 0], box: [-0.1, -0.46, 0.1, 0.02] }, q => {
  q.fillStyle = '#5a4a3a';
  q.beginPath(); q.ellipse(0, -0.012, 0.075, 0.018, 0, 0, 7); q.fill();
  q.fillRect(-0.014, -0.1, 0.028, 0.09);
  q.fillStyle = '#a07a44';
  q.beginPath(); q.ellipse(0, -0.13, 0.068, 0.045, 0, 0, 7); q.fill();
  q.fillStyle = '#5a4a3a';
  q.fillRect(-0.03, -0.19, 0.06, 0.028);
  q.fillStyle = 'rgba(232,226,210,0.55)';
  q.beginPath();
  q.moveTo(-0.024, -0.19);
  q.bezierCurveTo(-0.05, -0.23, -0.05, -0.29, -0.02, -0.33);
  q.lineTo(-0.02, -0.42); q.lineTo(0.02, -0.42); q.lineTo(0.02, -0.33);
  q.bezierCurveTo(0.05, -0.29, 0.05, -0.23, 0.024, -0.19);
  q.closePath();
  q.fill();
  e.light(0, -0.25, 0.5, '#ffc27a', 1, 'flame');
});
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
e.at(0, -0.25, 'flame');
e.at(0, -0.5);
