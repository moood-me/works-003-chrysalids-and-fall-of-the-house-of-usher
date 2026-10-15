// The night beyond the windows: deep blue, stars a layer; the barn's fire glowing up into it a layer of its own
// (sky.animate.js: `fire_outside`)
const A = e.aspect;
const gr = g.createLinearGradient(0, -0.35, 0, 0.6);
gr.addColorStop(0, '#10162a');
gr.addColorStop(0.7, '#1e2a48');
gr.addColorStop(1, '#2e3a5a');
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
e.layer('stars', { box: [-0.3, -0.35, A + 0.3, 0.3] }, q => {
  q.fillStyle = '#dce2f2';
  for (let i = 0; i < 50; i++) {
    const r = e.rnd();
    q.globalAlpha = 0.25 + 0.5 * r;
    q.fillRect(-0.3 + e.rnd() * (A + 0.6), -0.32 + e.rnd() * 0.6, 0.0016 + r * 0.0012, 0.0016 + r * 0.0012);
  }
  q.globalAlpha = 1;
});
e.layer('glow', { box: [-0.4, -0.4, A + 0.4, 1.3] }, q => {
  const cx = A * 0.62, gl = q.createRadialGradient(cx, 0.48, 0.02, cx, 0.48, 0.75);
  gl.addColorStop(0, 'rgba(255,140,60,0.75)');
  gl.addColorStop(0.4, 'rgba(200,80,40,0.35)');
  gl.addColorStop(1, 'rgba(120,40,30,0)');
  q.fillStyle = gl;
  q.fillRect(-0.4, -0.4, A + 0.8, 1.7);
});
