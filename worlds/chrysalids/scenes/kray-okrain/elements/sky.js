// The night over the Fringes: deep blue overhead, paler low down; the moon's glow low on the left beyond the frame's edge
// (the moon itself is behind the wood: its light — the scene's `moon` — comes from there), stars a layer of their own
const A = e.aspect;
const gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, '#16224a');
gr.addColorStop(0.4, '#26365e');
gr.addColorStop(0.55, '#3e4e74');
gr.addColorStop(1, '#2a3656');
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
const mg = g.createRadialGradient(-0.25, 0.42, 0, -0.25, 0.42, 1.1);
mg.addColorStop(0, 'rgba(200,214,236,0.55)');
mg.addColorStop(0.3, 'rgba(150,170,206,0.22)');
mg.addColorStop(1, 'rgba(120,140,190,0)');
g.fillStyle = mg;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
e.layer('stars', { box: [-0.3, -0.35, A + 0.3, 0.5] }, q => {
  q.fillStyle = '#dce4f4';
  for (let i = 0; i < 160; i++) {
    const r = e.rnd(), x = -0.3 + e.rnd() * (A + 0.6), y = -0.35 + e.rnd() * 0.8;
    q.globalAlpha = (0.2 + 0.6 * r * r) * Math.max(0, 1 - (x < 0.6 ? (0.6 - x) * 1.2 : 0));
    q.fillRect(x, y, 0.0014 + r * 0.0016, 0.0014 + r * 0.0016);
  }
  q.globalAlpha = 1;
});
