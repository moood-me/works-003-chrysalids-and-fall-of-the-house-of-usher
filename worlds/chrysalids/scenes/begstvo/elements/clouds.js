// ragged clouds high over the ridge, in two drifts (painted once in their own grey, the dawn lights their undersides)
const A = e.aspect, W = A + 0.8;
for (const [name, speed, y0] of [['high', 0.002, -0.2], ['low', 0.004, 0.15]]) {
  e.layer(name, { drift: [speed, 0], box: [-0.4, y0 - 0.15, A + 0.4, y0 + 0.2] }, q => {
    for (let i = 0; i < 7; i++) {
      const cx = -0.4 + e.rnd() * W, cy = y0 + e.rnd() * 0.12, w = 0.18 + e.rnd() * 0.35, h = 0.012 + e.rnd() * 0.02;
      q.fillStyle = 'rgba(70,82,110,0.55)';
      for (const k of [-1, 0, 1]) { q.beginPath(); q.ellipse(cx + k * W, cy, w, h, 0, 0, 7); q.fill(); }
    }
  });
}
