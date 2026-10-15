// A smoky dawn over the Fringes' clearing: grey-violet overhead, warm low on the left where the sun will come; the night's
// last stars a layer (sky.animate.js thins it with `dawn`)
const A = e.aspect;
const gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, '#4a4a5e');
gr.addColorStop(0.3, '#6e6778');
gr.addColorStop(0.5, '#a0909a');
gr.addColorStop(0.6, '#cdaeaa');
gr.addColorStop(0.75, '#7a6e78');
gr.addColorStop(1, '#5a5262');
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
g.save();
g.translate(A * 0.16, 0.6);
g.scale(1, 0.32);
const sg = g.createRadialGradient(0, 0, 0, 0, 0, 0.9);
sg.addColorStop(0, 'rgba(236,190,176,0.6)');
sg.addColorStop(1, 'rgba(200,160,160,0)');
g.fillStyle = sg;
g.beginPath();
g.arc(0, 0, 0.9, 0, 7);
g.fill();
g.restore();
e.layer('stars', { box: [-0.3, -0.35, A + 0.3, 0.2] }, q => {
  q.fillStyle = '#d8dcea';
  for (let i = 0; i < 40; i++) q.fillRect(-0.3 + e.rnd() * (A + 0.6), -0.3 + e.rnd() * 0.45, 0.0018, 0.0018);
});
