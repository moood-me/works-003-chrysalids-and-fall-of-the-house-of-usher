// The night over Waknuk, seen through the open gate: deep blue to the hills, paler low down; the stars a layer of their
// own (sky.wgsl: each twinkling in its own time). The moon is the scene's far light (lights: moon), high behind us.
const A = e.aspect;
const gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, '#0e1630');
gr.addColorStop(0.35, '#1d2a4a');
gr.addColorStop(0.55, '#34466e');
gr.addColorStop(1, '#1c2640');
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
e.layer('stars', { box: [-0.3, -0.35, A + 0.3, 0.55] }, q => {
  q.fillStyle = '#dfe6f6';
  for (let i = 0; i < 140; i++) {
    const x = -0.3 + e.rnd() * (A + 0.6), y = -0.35 + e.rnd() * 0.85, r = e.rnd();
    q.globalAlpha = Math.max(0, (0.25 + 0.6 * r * r) * (1 - Math.max(0, (y - 0.32) / 0.18)));
    const s = 0.0016 + r * 0.0018;
    q.fillRect(x, y, s, s);
  }
  q.globalAlpha = 1;
});
