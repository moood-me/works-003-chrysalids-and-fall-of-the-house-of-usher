// The thread of thought between David and Rosalind (a card before them, DT m ahead: their heads seen on it — lib.pt):
// a soft warm arc over the square, two strands, a glow at each end; painted once — thread.animate.js: as strong as
// `thread`, a little brighter as `glance` grows, a light going along it
const L = e.lib, [x0, y0] = L.pt(L.DAVID), [x1, y1] = L.pt(L.ROS);
const c1 = [x0 + 1.0, y0 - 1.1], c2 = [x1 - 1.7, y1 - 1.0];
const box = [Math.min(x0, x1) - 0.5, Math.min(y0, y1) - 1.6, Math.max(x0, x1) + 0.5, Math.max(y0, y1) + 0.5];
for (const k of [0, 1]) e.layer('s' + k, { box }, q => {
  const G = q.createLinearGradient(x0, y0, x1, y1);
  for (let j = 0; j <= 16; j++) { const u = j / 16, en = Math.pow(Math.sin(Math.PI * u), 0.35); G.addColorStop(u, `rgba(250,212,150,${Math.min(1, en * (k ? 0.4 : 1) * 0.9)})`); }
  q.strokeStyle = G; q.lineCap = 'round';
  q.beginPath(); q.moveTo(x0, y0); q.bezierCurveTo(c1[0], c1[1] - k * 0.05, c2[0], c2[1] - k * 0.05, x1, y1);
  q.lineWidth = 0.1; q.globalAlpha = 0.2; q.stroke();
  q.lineWidth = 0.035; q.globalAlpha = 0.35; q.stroke();
  q.lineWidth = 0.012; q.globalAlpha = 1; q.stroke();
});
for (const [n, x, y, r] of [['a0', x0, y0 + 0.06, 0.3], ['a1', x1, y1 + 0.04, 0.18]]) e.layer(n, { blend: 'add', box: [x - r, y - r, x + r, y + r] }, q => {
  const ag = q.createRadialGradient(x, y, 0, x, y, r);
  ag.addColorStop(0, 'rgba(250,215,160,0.5)'); ag.addColorStop(1, 'rgba(250,215,160,0)');
  q.fillStyle = ag; q.beginPath(); q.arc(x, y, r, 0, 7); q.fill();
});
e.layer('p', { blend: 'add', box: [-0.12, -0.12, 0.12, 0.12] }, q => {
  const rg = q.createRadialGradient(0, 0, 0, 0, 0, 0.1);
  rg.addColorStop(0, 'rgba(255,236,200,0.9)'); rg.addColorStop(1, 'rgba(255,236,200,0)');
  q.fillStyle = rg; q.fillRect(-0.1, -0.1, 0.2, 0.2);
});
