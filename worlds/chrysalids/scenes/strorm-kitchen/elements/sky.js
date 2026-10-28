// What is seen of the sky through the window: the evening, pale low over the fields — and the night over it (a layer
// its animate brings in as `dusk` grows), a few stars
const A = e.aspect;
const gr = g.createLinearGradient(0, -0.35, 0, 0.6);
gr.addColorStop(0, '#4a5a7a');
gr.addColorStop(0.6, '#7c8aa6');
gr.addColorStop(1, '#c4b8b0');
g.fillStyle = gr;
g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
e.layer('night', { box: [-0.3, -0.35, A + 0.3, 1.25] }, q => {
  const ng = q.createLinearGradient(0, -0.35, 0, 0.6);
  ng.addColorStop(0, '#0e1528');
  ng.addColorStop(0.6, '#1c2742');
  ng.addColorStop(1, '#2e3a56');
  q.fillStyle = ng;
  q.fillRect(-0.3, -0.35, A + 0.6, 1.6);
  q.fillStyle = '#dfe5f2';
  for (let i = 0; i < 24; i++) {
    q.beginPath();
    q.arc(e.rnd() * (A + 0.6) - 0.3, -0.3 + e.rnd() * 0.6, 0.0015 + e.rnd() * 0.0012, 0, 7);
    q.fill();
  }
});
