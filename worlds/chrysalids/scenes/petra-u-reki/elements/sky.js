// The low overcast over the river in the rain: grey, paler where the light comes through low on the left; two drifts of
// ragged cloud (the farther slower) — painted once, moved by their drift
const A = e.aspect;
const gr = g.createLinearGradient(0, -0.35, 0, 0.5);
gr.addColorStop(0, '#8e948e');
gr.addColorStop(0.6, '#b2b6ae');
gr.addColorStop(1, '#c8cac0');
g.fillStyle = gr;
g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
const lg = g.createRadialGradient(A * 0.2, 0.4, 0, A * 0.2, 0.4, 0.8);
lg.addColorStop(0, 'rgba(232,232,220,0.5)');
lg.addColorStop(1, 'rgba(232,232,220,0)');
g.fillStyle = lg;
g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
const W = A + 0.8;
for (const [name, speed, col] of [['far', 0.004, '#9a9e98'], ['near', 0.008, '#8a8e88']]) {
  e.layer(name, { drift: [speed, 0], box: [-0.4, -0.35, A + 0.4, 0.45] }, q => {
    for (let i = 0; i < 9; i++) {
      const cx = -0.4 + e.rnd() * W, cy = -0.3 + e.rnd() * 0.6, w = 0.25 + e.rnd() * 0.5, h = 0.03 + e.rnd() * 0.05;
      q.globalAlpha = 0.25 + e.rnd() * 0.2;
      q.fillStyle = col;
      for (const k of [-1, 0, 1]) { q.beginPath(); q.ellipse(cx + k * W, cy, w, h, 0, 0, 7); q.fill(); }
    }
    q.globalAlpha = 1;
  });
}
