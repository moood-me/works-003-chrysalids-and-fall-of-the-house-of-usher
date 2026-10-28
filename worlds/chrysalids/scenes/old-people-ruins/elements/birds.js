// five birds crossing under the overpass's arch, each a layer (birds.animate.js: across and back, beating their wings,
// flying up higher as the bell rings)
for (let i = 0; i < 5; i++) e.layer('b' + i, { pivot: [0, -4.6], box: [-0.4, -5, 0.4, -4.2] }, q => {
  const sz = 0.32;
  q.fillStyle = '#4c4e47';
  q.save();
  q.translate(0, -4.6);
  q.beginPath(); q.ellipse(0, 0, sz * 0.32, sz * 0.09, 0, 0, 7); q.fill();
  for (const d of [-1, 1]) {
    q.beginPath();
    q.moveTo(0.02, -0.02);
    q.quadraticCurveTo(d * sz * 0.18 - 0.02, -sz * 0.25 - 0.05, d * sz * 0.95, -sz * 0.55 + 0.02);
    q.quadraticCurveTo(d * sz * 0.4, -sz * 0.12 + 0.03, 0.06, 0.03);
    q.closePath();
    q.fill();
  }
  q.beginPath(); q.moveTo(-sz * 0.3, 0); q.lineTo(-sz * 0.55, -0.05); q.lineTo(-sz * 0.52, 0.06); q.closePath(); q.fill();
  q.restore();
});
