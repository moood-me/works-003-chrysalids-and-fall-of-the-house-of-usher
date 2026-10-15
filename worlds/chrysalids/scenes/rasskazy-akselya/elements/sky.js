// The night sky before the dawn: deep blue, the Milky Way's haze across it, stars — a layer (fading as the dawn comes);
// the dawn a layer of its own over it on the right (sky.animate.js: `dawn`)
const A = e.aspect;
const gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, '#0c1226');
gr.addColorStop(0.35, '#162040');
gr.addColorStop(0.47, '#26345a');
gr.addColorStop(0.55, '#3a4a70');
gr.addColorStop(0.62, '#202a44');
gr.addColorStop(1, '#141a2a');
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
g.save();
g.translate(A * 0.45, 0.12);
g.rotate(-0.35);
for (let i = 0; i < 46; i++) {
  const x = (e.rnd() - 0.5) * 2.8, y = (e.rnd() - 0.5) * 0.14, r = 0.06 + e.rnd() * 0.13;
  const rg = g.createRadialGradient(x, y, 0, x, y, r);
  rg.addColorStop(0, 'rgba(150,165,205,0.04)');
  rg.addColorStop(1, 'rgba(150,165,205,0)');
  g.fillStyle = rg;
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
}
g.restore();
e.layer('stars', { box: [-0.3, -0.35, A + 0.3, 0.55] }, q => {
  q.fillStyle = '#d4dcf0';
  for (let i = 0; i < 240; i++) {
    const x = -0.3 + e.rnd() * (A + 0.6), y = -0.35 + e.rnd() * 0.85, r = e.rnd();
    q.globalAlpha = Math.max(0, (0.15 + 0.6 * r * r * r) * (1 - Math.max(0, (y - 0.31) / 0.22)));
    q.beginPath(); q.arc(x, y, 0.0012 + r * r * 0.0022, 0, 7); q.fill();
  }
  q.globalAlpha = 1;
});
e.layer('dawn', { box: [-0.4, -0.4, A + 0.4, 0.6] }, q => {
  const dg = q.createLinearGradient(0, -0.35, 0, 0.57);
  dg.addColorStop(0, 'rgba(40,52,88,0.5)');
  dg.addColorStop(0.5, 'rgba(84,92,130,0.7)');
  dg.addColorStop(0.85, 'rgba(150,132,150,0.8)');
  dg.addColorStop(1, 'rgba(206,160,136,0.85)');
  q.fillStyle = dg;
  q.fillRect(-0.4, -0.4, A + 0.8, 0.97);
  const rg = q.createRadialGradient(A * 0.86, 0.55, 0, A * 0.86, 0.55, 0.8);
  rg.addColorStop(0, 'rgba(232,184,148,0.45)');
  rg.addColorStop(1, 'rgba(232,184,148,0)');
  q.fillStyle = rg;
  q.fillRect(-0.4, -0.2, A + 0.8, 0.77);
});
