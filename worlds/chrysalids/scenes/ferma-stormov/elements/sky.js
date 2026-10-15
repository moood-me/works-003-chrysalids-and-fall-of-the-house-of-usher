// The evening sky over Waknuk: blue overhead, warm low down where the sun has gone; the night a layer of its own over it
// (sky.animate.js: as `dusk` grows), the stars another, the evening star low on the left (painted once)
const A = e.aspect;
const gr = g.createLinearGradient(0, -0.35, 0, 0.66);
gr.addColorStop(0, '#4c5a8c');
gr.addColorStop(0.4, '#7a82a8');
gr.addColorStop(0.7, '#c4a8a8');
gr.addColorStop(0.9, '#e6c4a0');
gr.addColorStop(1, '#eccfa8');
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.06);
g.fillStyle = '#eccfa8';
g.fillRect(-0.4, 0.65, A + 0.8, 0.65);
e.layer('night', { box: [-0.4, -0.4, A + 0.4, 1.3] }, q => {
  const n = q.createLinearGradient(0, -0.35, 0, 0.66);
  n.addColorStop(0, '#18204a');
  n.addColorStop(0.5, '#2c3664');
  n.addColorStop(0.85, '#4a4a78');
  n.addColorStop(1, '#5a5682');
  q.fillStyle = n;
  q.fillRect(-0.4, -0.4, A + 0.8, 1.06);
  q.fillStyle = '#5a5682';
  q.fillRect(-0.4, 0.65, A + 0.8, 0.65);
});
// (in three layers, forty stars each: sky.animate.js twinkles each layer in its own time)
for (let k = 0; k < 3; k++) e.layer(`stars${k}`, { box: [-0.3, -0.35, A + 0.3, 0.45] }, q => {
  q.fillStyle = '#e4e6f4';
  for (let i = 0; i < 120; i++) {
    const r = e.rnd(), x = -0.3 + e.rnd() * (A + 0.6), y = -0.32 + e.rnd() * 0.72;
    if (i % 3 !== k) continue;
    q.globalAlpha = 0.25 + 0.6 * r * r;
    q.fillRect(x, y, 0.0015 + r * 0.0013, 0.0015 + r * 0.0013);
  }
  q.globalAlpha = 1;
});
e.layer('star', { box: [A * 0.2 - 0.03, 0.3, A * 0.2 + 0.03, 0.36] }, q => {
  q.fillStyle = '#f6eedc';
  q.beginPath(); q.arc(A * 0.2, 0.33, 0.0034, 0, 7); q.fill();
  e.light(A * 0.2, 0.33, 0.025, '#f3e6cc', 0.5, 'star');
});
