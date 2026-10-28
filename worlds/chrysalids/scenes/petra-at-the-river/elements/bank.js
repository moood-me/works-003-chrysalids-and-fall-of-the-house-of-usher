// The near clay bank (9 m off; its own metres — x along the river, y down; lib.ys its top, lib.wl where it goes into the
// pool), painted side-on: the wet clay, its streaks, the grass along its top and the reeds at its foot (layers bending in
// the wind), the tall rushes in the left foreground. A picture of the land: the people walk on relief.js under it.
const { ys, wl } = e.lib;
const edge = x => (x > 2 ? wl(x) : ys(x) + 0.015 * Math.sin(x * 9));
g.beginPath();
g.moveTo(-14, 4.5);
for (let x = -14; x <= 7.5; x += 0.08) g.lineTo(x, Math.min(4.5, edge(x)));
g.lineTo(7.5, 4.5);
g.closePath();
const gr = g.createLinearGradient(0, -1.8, 0, 4.5);
gr.addColorStop(0, '#8a826a');
gr.addColorStop(0.2, '#7e7460');
gr.addColorStop(0.6, '#6a6252');
gr.addColorStop(1, '#565046');
g.fillStyle = gr;
g.fill();
g.save();
g.clip();
for (let i = 0; i < 160; i++) {
  const x = -13 + e.rnd() * 20, y = ys(Math.min(x, 2)) + 0.1 + e.rnd() * 4.2, w = 0.3 + e.rnd() * 1.4, h = 0.05 + e.rnd() * 0.18;
  g.globalAlpha = 0.1 + e.rnd() * 0.1;
  g.fillStyle = e.rnd() < 0.5 ? '#4e463a' : '#a49a84';
  g.beginPath();
  g.ellipse(x, y, w, h, 0.18 + e.rnd() * 0.2, 0, 7);
  g.fill();
}
g.restore();
g.globalAlpha = 1;
// the wet sheen where the clay goes into the water
g.fillStyle = 'rgba(190,196,186,0.35)';
g.beginPath();
for (let x = 1.2; x <= 7.5; x += 0.08) g.lineTo(x, edge(x));
for (let x = 7.5; x >= 1.2; x -= 0.08) g.lineTo(x - 0.25, edge(x) - 0.12);
g.closePath();
g.fill();
const tuft = (name, x0, x1, n, tall, colA, colB, foot) => e.layer(name, { pivot: [(x0 + x1) / 2, foot ?? edge((x0 + x1) / 2) + 0.2], wind: { strength: 0.35, gust: 0.6 }, box: [x0 - 0.6, -4.8, x1 + 0.6, 4.7] }, q => {
  q.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const x = x0 + e.rnd() * (x1 - x0), y = foot ?? edge(x) + 0.03, h = tall(e.rnd());
    q.strokeStyle = e.rnd() < 0.5 ? colA : colB;
    q.lineWidth = foot != null ? 0.03 + e.rnd() * 0.03 : 0.018 + e.rnd() * 0.012;
    const s = (e.rnd() - 0.4) * 0.3 * h;
    q.beginPath();
    q.moveTo(x, y);
    q.quadraticCurveTo(x + s * 0.2, y - h * 0.6, x + s, y - h);
    q.stroke();
  }
});
for (let k = 0; k < 7; k++) tuft(`grass${k}`, -14 + k * 2, -12 + k * 2, 70, r => (0.08 + r * 0.32) * (k < 4 ? 1 : 0.7), '#6e7a58', '#7e8a64');
for (let k = 0; k < 5; k++) tuft(`reeds${k}`, 1.3 + k * 1.2, 2.1 + k * 1.2, 16, r => 0.35 + r * (k < 3 ? 1 : 0.6), '#5a6448', '#68724e');
tuft('rushes', -13.5, -8.5, 55, r => 1.4 + r * 2.4, '#4e5642', '#5a624a', 4.6);
