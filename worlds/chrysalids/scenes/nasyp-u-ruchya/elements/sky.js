// the sky of a late summer afternoon, the sun low over the meadow, ahead (its light: the scene's "sun"); thin clouds
// drifting; the evening is the scene's light (its look `evening`), the sun sinking with it (sky.animate.js). The night's
// sky — deep blue, the moon over the meadow (its light: "moon") — is a layer over it all, there as far as `night` is in
// (sky.animate.js; the stars — the element stars)
const A = e.aspect;
const gr = g.createLinearGradient(0, -0.35, 0, 0.62);
gr.addColorStop(0, '#8fa2ab');
gr.addColorStop(0.42, '#c4c9bd');
gr.addColorStop(0.8, '#ecdfb8');
gr.addColorStop(1, '#f3e5bd');
g.fillStyle = gr;
g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
// the sun: its glow and its disc (sky.animate.js lowers it as the evening comes, marks it: "sky#sun")
const sx = A * 0.5 - 0.08, sy = 0.27;
e.layer('sun', { box: [sx - 0.85, sy - 0.85, sx + 0.85, sy + 0.85] }, q => {
  const gl = q.createRadialGradient(sx, sy, 0, sx, sy, 0.85);
  gl.addColorStop(0, 'rgba(255,240,200,0.75)');
  gl.addColorStop(0.18, 'rgba(252,232,186,0.38)');
  gl.addColorStop(0.5, 'rgba(248,226,180,0.12)');
  gl.addColorStop(1, 'rgba(248,226,180,0)');
  q.fillStyle = gl;
  q.fillRect(sx - 0.85, sy - 0.85, 1.7, 1.7);
  const d = q.createRadialGradient(sx, sy, 0, sx, sy, 0.06);
  d.addColorStop(0, 'rgba(255,252,236,1)');
  d.addColorStop(0.5, 'rgba(255,248,224,0.95)');
  d.addColorStop(1, 'rgba(255,244,214,0)');
  q.fillStyle = d;
  q.beginPath();
  q.arc(sx, sy, 0.06, 0, 7);
  q.fill();
});
// thin clouds in two drifts (the farther slower), lit near the sun; each drift's ends meet round its box
const W = A + 0.8;
for (const [name, speed] of [['clouds_far', 0.0009], ['clouds_near', 0.0016]]) {
  e.layer(name, { drift: [speed, 0], box: [-0.4, 0, A + 0.4, 0.3] }, q => {
    for (let i = 0; i < 4; i++) {
      const cx = -0.4 + e.rnd() * W, cy = 0.03 + e.rnd() * 0.22, w = 0.2 + e.rnd() * 0.35, h = 0.005 + e.rnd() * 0.01;
      const near = Math.max(0, 1 - Math.abs(cx - sx) / 0.6);
      q.globalAlpha = 0.22 + e.rnd() * 0.15;
      q.fillStyle = near > 0.3 ? '#fff1cf' : '#e3ddc8';
      for (const k of [-1, 0, 1]) {
        q.beginPath();
        q.ellipse(cx + k * W, cy, w, h, 0, 0, 7);
        q.fill();
      }
    }
    q.globalAlpha = 1;
  });
}
// the darker sky overhead
e.layer('top', { box: [-0.3, -0.35, A + 0.3, 0.36] }, q => {
  const tp = q.createLinearGradient(0, -0.35, 0, 0.36);
  tp.addColorStop(0, 'rgba(48,60,70,0.8)');
  tp.addColorStop(0.55, 'rgba(62,76,86,0.42)');
  tp.addColorStop(1, 'rgba(80,92,98,0)');
  q.fillStyle = tp;
  q.fillRect(-0.3, -0.35, A + 0.6, 0.71);
});
// the night over it all (painted whole: sky.animate.js brings it in), the moon over the meadow ("sky#moon": the
// night's light)
e.layer('night', { box: [-0.3, -0.35, A + 0.3, 1.25] }, q => {
  const ng = q.createLinearGradient(0, -0.35, 0, 0.62);
  ng.addColorStop(0, '#070d1a');
  ng.addColorStop(0.6, '#15203a');
  ng.addColorStop(1, '#2a3550');
  q.fillStyle = ng;
  q.fillRect(-0.3, -0.35, A + 0.6, 1.6);
  const mx = A * 0.56, my = 0.15;
  const mg = q.createRadialGradient(mx, my, 0, mx, my, 0.22);
  mg.addColorStop(0, 'rgba(200,214,240,0.35)');
  mg.addColorStop(1, 'rgba(200,214,240,0)');
  q.fillStyle = mg;
  q.fillRect(mx - 0.22, my - 0.22, 0.44, 0.44);
  q.fillStyle = '#eef2fa';
  q.beginPath();
  q.arc(mx, my, 0.022, 0, 7);
  q.fill();
  e.at(mx, my, 'moon');
});
