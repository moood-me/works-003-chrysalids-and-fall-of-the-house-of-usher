// a few birds going home across the evening sky, far off: each a layer (birds.animate.js carries it and beats its wings)
for (let i = 0; i < 5; i++) {
  const y = 0.16 + e.rnd() * 0.14, s = 0.0055 + 0.002 * e.rnd();
  e.layer('b' + i, { pivot: [0, y], box: [-0.02, y - 0.02, 0.02, y + 0.02] }, q => {
    q.strokeStyle = '#3a3448';
    q.lineWidth = 0.0018;
    q.lineCap = 'round';
    q.beginPath();
    q.moveTo(-s, y - s * 0.3); q.quadraticCurveTo(-s * 0.4, y - s * 0.6, 0, y);
    q.quadraticCurveTo(s * 0.4, y - s * 0.6, s, y - s * 0.3);
    q.stroke();
  });
}
