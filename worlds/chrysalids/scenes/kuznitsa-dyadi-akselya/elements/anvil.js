// The anvil on its block, the iron on it (a layer that glows — anvil.animate.js keeps it hot as the fire is); the
// hammer and the tongs lying on it while they are not in Axel's hands (layers: anvil.animate.js, by axel_with). Its
// point `iron` — where the hammer falls (the sparks fly from there).
g.fillStyle = '#6a5040';
g.beginPath();
g.moveTo(-0.26, 0.03); g.lineTo(-0.24, -0.46); g.quadraticCurveTo(0, -0.5, 0.24, -0.46); g.lineTo(0.27, 0.03);
g.closePath();
g.fill();
g.fillStyle = '#4a4a4c';
g.beginPath();
g.moveTo(-0.22, -0.46); g.lineTo(-0.16, -0.6); g.lineTo(-0.1, -0.66);
g.quadraticCurveTo(-0.3, -0.68, -0.42, -0.76); g.quadraticCurveTo(-0.6, -0.8, -0.66, -0.82);
g.lineTo(-0.36, -0.86); g.lineTo(0.34, -0.86); g.lineTo(0.36, -0.74); g.lineTo(0.2, -0.7); g.lineTo(0.12, -0.66);
g.lineTo(0.18, -0.6); g.lineTo(0.24, -0.46);
g.closePath();
g.fill();
g.fillStyle = '#6a6a6c';
g.fillRect(-0.36, -0.865, 0.7, 0.025);
e.layer('iron', { blend: 'add', box: [-0.1, -0.93, 0.2, -0.84] }, q => {
  q.strokeStyle = '#ff7a30';
  q.lineWidth = 0.025;
  q.beginPath();
  q.ellipse(0.05, -0.875, 0.09, 0.03, 0, Math.PI * 0.2, Math.PI * 1.8, false);
  q.stroke();
});
e.layer('hammer_on', { box: [-0.2, -1.0, 0.35, -0.85] }, q => {
  q.strokeStyle = '#6a5038';
  q.lineWidth = 0.03;
  q.beginPath(); q.moveTo(-0.05, -0.885); q.lineTo(0.3, -0.9); q.stroke();
  q.fillStyle = '#3a3a3c';
  q.fillRect(-0.13, -0.96, 0.08, 0.08);
});
e.layer('tongs_on', { box: [0, -1.0, 0.5, -0.85] }, q => {
  q.strokeStyle = '#3a3a3c';
  q.lineWidth = 0.02;
  q.beginPath();
  q.moveTo(0.02, -0.87); q.lineTo(0.45, -0.95);
  q.moveTo(0.02, -0.875); q.lineTo(0.46, -0.92);
  q.stroke();
});
e.at(0.06, -0.9, 'iron');
e.light(0.05, -0.88, 0.25, '#ff7a30', 1, 'iron');
