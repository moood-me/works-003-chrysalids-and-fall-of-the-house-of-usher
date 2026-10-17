// thin clouds drifting high, lit at their edges by the moon (painted once in their own pale grey)
const A = e.aspect, W = A + 0.8;
e.layer('c', { drift: [0.003, 0], box: [-0.4, -0.3, A + 0.4, 0.3] }, q => {
  for (let i = 0; i < 8; i++) {
    const cx = -0.4 + e.rnd() * W, cy = -0.25 + e.rnd() * 0.45, w = 0.2 + e.rnd() * 0.4, h = 0.01 + e.rnd() * 0.02;
    q.fillStyle = 'rgba(120,136,170,0.45)';
    for (const k of [-1, 0, 1]) { q.beginPath(); q.ellipse(cx + k * W, cy, w, h, 0, 0, 7); q.fill(); }
  }
});
