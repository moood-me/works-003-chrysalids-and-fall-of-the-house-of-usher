// The low grey autumn sky over the farm, paler toward the fields; ragged cloud drifting (painted once)
const A = e.aspect;
const gr = g.createLinearGradient(0, -0.35, 0, 0.6);
gr.addColorStop(0, '#9ea4a6');
gr.addColorStop(0.6, '#c4c2b4');
gr.addColorStop(1, '#ddd2b4');
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
e.layer('c', { drift: [0.004, 0], box: [-0.4, -0.3, A + 0.4, 0.45] }, q => {
  const W = A + 0.8;
  for (let i = 0; i < 9; i++) {
    const cx = -0.4 + e.rnd() * W, cy = -0.25 + e.rnd() * 0.6, w = 0.25 + e.rnd() * 0.45, h = 0.02 + e.rnd() * 0.04;
    q.fillStyle = 'rgba(150,152,150,0.4)';
    for (const k of [-1, 0, 1]) { q.beginPath(); q.ellipse(cx + k * W, cy, w, h, 0, 0, 7); q.fill(); }
  }
});
