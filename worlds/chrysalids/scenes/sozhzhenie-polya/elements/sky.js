// The sky over the fields, painted once: the grey-blue of first light, paler low in the east (left); over it, layers its
// animate weighs by the state — the night (deep blue, the stars), the fire's glow on the smoke's undersides, the grey
// morning — and long low clouds drifting
const W = e.aspect, HZ = 0.55;
const gr = g.createLinearGradient(0, -0.35, 0, HZ + 0.05);
gr.addColorStop(0, '#4d5462');
gr.addColorStop(0.45, '#7a7c86');
gr.addColorStop(0.8, '#a49c92');
gr.addColorStop(1, '#c4b49c');
g.fillStyle = gr;
g.fillRect(-0.3, -0.35, W + 0.6, 1.6);
const rg = g.createRadialGradient(W * 0.12, HZ + 0.02, 0, W * 0.12, HZ, 0.9);
rg.addColorStop(0, 'rgba(232,206,170,0.7)');
rg.addColorStop(0.35, 'rgba(180,160,150,0.3)');
rg.addColorStop(1, 'rgba(150,140,150,0)');
g.fillStyle = rg;
g.fillRect(-0.3, -0.35, W + 0.6, 1.6);
e.layer('night', { box: [-0.3, -0.35, W + 0.3, 1.25] }, q => {
  const ng = q.createLinearGradient(0, -0.35, 0, HZ + 0.05);
  ng.addColorStop(0, '#0c1020');
  ng.addColorStop(0.45, '#1c2036');
  ng.addColorStop(0.8, '#34364c');
  ng.addColorStop(1, '#4a4658');
  q.fillStyle = ng;
  q.fillRect(-0.3, -0.35, W + 0.6, 1.6);
  const eg = q.createRadialGradient(W * 0.12, HZ + 0.02, 0, W * 0.12, HZ, 0.8);
  eg.addColorStop(0, 'rgba(150,140,160,0.45)');
  eg.addColorStop(1, 'rgba(100,100,130,0)');
  q.fillStyle = eg;
  q.fillRect(-0.3, -0.35, W + 0.6, 1.6);
});
e.layer('stars', { box: [-0.3, -0.35, W + 0.3, 0.25] }, q => {
  q.fillStyle = '#dcdae2';
  for (let i = 0; i < 140; i++) {
    const r = e.rnd();
    q.globalAlpha = 0.15 + 0.5 * r;
    q.fillRect(e.rnd() * (W + 0.6) - 0.3, e.rnd() * 0.55 - 0.33, 0.0012 + r * 0.0014, 0.0012 + r * 0.0014);
  }
  q.globalAlpha = 1;
});
e.layer('glow', { blend: 'add', box: [-0.3, -0.35, W + 0.3, 1.25] }, q => {
  const gx = W * 0.5 + 0.35, fg = q.createRadialGradient(gx, HZ, 0, gx, HZ * 0.85, 0.95);
  fg.addColorStop(0, 'rgba(226,120,58,0.55)');
  fg.addColorStop(0.35, 'rgba(160,70,44,0.3)');
  fg.addColorStop(1, 'rgba(70,30,30,0)');
  q.fillStyle = fg;
  q.fillRect(-0.3, -0.35, W + 0.6, 1.6);
});
e.layer('grey', { box: [-0.3, -0.35, W + 0.3, 1.25] }, q => {
  const mg = q.createLinearGradient(0, -0.35, 0, HZ + 0.05);
  mg.addColorStop(0, '#8a8a8e');
  mg.addColorStop(1, '#bcb6ac');
  q.fillStyle = mg;
  q.fillRect(-0.3, -0.35, W + 0.6, 1.6);
});
e.layer('clouds', { drift: [0.002, 0], box: [-0.4, 0, W + 0.4, 0.5] }, q => {
  const span = W + 0.8;
  for (let i = 0; i < 6; i++) {
    const y = 0.08 + i * 0.065 + e.rnd() * 0.04, x = -0.4 + e.rnd() * span, w = 0.25 + e.rnd() * 0.4, k = 0.03 + e.rnd() * 0.02;
    for (const s of [-1, 0, 1]) {
      q.save();
      q.translate(x + s * span, y);
      q.scale(1, k);
      const cg = q.createRadialGradient(0, 0, 0, 0, 0, w);
      cg.addColorStop(0, 'rgba(154,138,128,0.5)');
      cg.addColorStop(1, 'rgba(154,138,128,0)');
      q.fillStyle = cg;
      q.fillRect(-w, -w, 2 * w, 2 * w);
      q.restore();
    }
  }
});
