// smoke-stained clouds drifting high
const A = e.aspect, W = A + 0.8;
e.layer('c', { drift: [0.003, 0], box: [-0.4, -0.25, A + 0.4, 0.4] }, q => {
  for (let i = 0; i < 8; i++) {
    const cx = -0.4 + e.rnd() * W, cy = -0.2 + e.rnd() * 0.5, w = 0.2 + e.rnd() * 0.45, h = 0.015 + e.rnd() * 0.025;
    q.fillStyle = 'rgba(130,118,132,0.5)';
    for (const k of [-1, 0, 1]) { q.beginPath(); q.ellipse(cx + k * W, cy, w, h, 0, 0, 7); q.fill(); }
  }
});
