// Dawn over the clearing in the Fringes: grey-blue above, a cold pale band low behind the trees, a warm streak in it
const A = e.aspect;
const gr = g.createLinearGradient(0, -0.35, 0, 0.7);
gr.addColorStop(0, '#3c4a6a');
gr.addColorStop(0.5, '#6c7a96');
gr.addColorStop(0.85, '#a8aab4');
gr.addColorStop(1, '#c8b8a8');
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
const wg = g.createRadialGradient(A * 0.7, 0.62, 0, A * 0.7, 0.62, 0.9);
wg.addColorStop(0, 'rgba(232,200,168,0.55)');
wg.addColorStop(1, 'rgba(232,200,168,0)');
g.fillStyle = wg;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
e.layer('clouds', { drift: [0.003, 0], box: [-0.4, -0.2, A + 0.4, 0.45] }, q => {
  const W = A + 0.8;
  for (let i = 0; i < 7; i++) {
    const cx = -0.4 + e.rnd() * W, cy = -0.1 + e.rnd() * 0.45, w = 0.2 + e.rnd() * 0.4, h = 0.012 + e.rnd() * 0.02;
    q.fillStyle = 'rgba(120,128,150,0.5)';
    for (const k of [-1, 0, 1]) { q.beginPath(); q.ellipse(cx + k * W, cy, w, h, 0, 0, 7); q.fill(); }
  }
});
