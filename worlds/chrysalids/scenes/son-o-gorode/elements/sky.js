// The dream's night: deep blue, warm low over the city on the right (as bright as its `lights` and the `dream` are —
// keys the game sets seldom); stars a layer, the waking's dark a layer over it all (sky.animate.js: `waking`)
const A = e.aspect, S = e.state || {}, L = e.lib;
const d = S.dream ?? 0.7, li = S.lights ?? 0.7, H = L.H, cx = L.cityX(A);
const gr = g.createLinearGradient(0, -0.35, 0, H + 0.03);
gr.addColorStop(0, '#0b0e22'); gr.addColorStop(0.35, '#151a38'); gr.addColorStop(0.62, '#2a2d58'); gr.addColorStop(0.85, '#4c4876'); gr.addColorStop(1, '#8a7f9e');
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, H + 0.45);
const gl = (0.35 + 0.65 * li) * (0.55 + 0.45 * d);
g.save(); g.translate(cx, H); g.scale(1, 0.42);
let rg = g.createRadialGradient(0, 0, 0, 0, 0, 0.75);
rg.addColorStop(0, `rgba(240,214,170,${0.5 * gl})`); rg.addColorStop(0.3, `rgba(206,176,172,${0.2 * gl})`); rg.addColorStop(1, 'rgba(180,160,200,0)');
g.fillStyle = rg; g.beginPath(); g.arc(0, 0, 0.75, 0, 7); g.fill();
g.restore();
g.save(); g.translate(cx, H); g.scale(1, 0.6);
rg = g.createRadialGradient(0, 0, 0, 0, 0, 1.3);
rg.addColorStop(0, `rgba(150,140,200,${0.16 * gl})`); rg.addColorStop(1, 'rgba(150,140,200,0)');
g.fillStyle = rg; g.beginPath(); g.arc(0, 0, 1.3, 0, 7); g.fill();
g.restore();
e.layer('stars', { box: [-0.3, -0.35, A + 0.3, H] }, q => {
  for (let i = 0; i < 110; i++) {
    const x = -0.3 + e.rnd() * (A + 0.6), y = -0.3 + Math.pow(e.rnd(), 1.4) * 0.8, r = e.rnd();
    const dx = (x - cx) / 0.6, dy = (y - H) / 0.3, near = Math.min(1, Math.sqrt(dx * dx + dy * dy));
    q.fillStyle = `rgba(226,226,244,${(0.15 + 0.6 * r * r) * near * Math.max(0, 1 - (y / H) * 0.6) * 0.85})`;
    q.beginPath(); q.arc(x, y, 0.001 + r * 0.0014, 0, 7); q.fill();
  }
});
e.layer('dark', { box: [-0.4, -0.4, A + 0.4, 1.3] }, q => { q.fillStyle = '#06070d'; q.fillRect(-0.4, -0.4, A + 0.8, 1.7); });
