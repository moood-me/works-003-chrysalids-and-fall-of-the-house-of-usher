// The far bank (20 m off; its own metres: the water at y 0, the field's edge at top(x) ≈ 2.4 m up): the slope of wet
// grass and clay down to the water, rushes at the foot, alders along it (their crowns layers swaying in the wind), the
// field's edge along the top where the rakers work. Painted once in its daylight colours.
const top = e.lib.farTop;
g.beginPath();
g.moveTo(-70, 0.4);
for (let x = -70; x <= 70; x += 0.5) g.lineTo(x, top(x));
g.lineTo(70, 0.4);
g.closePath();
const gr = g.createLinearGradient(0, -2.6, 0, 0.4);
gr.addColorStop(0, '#8a8a6e');
gr.addColorStop(0.5, '#7a7860');
gr.addColorStop(1, '#5e5c4e');
g.fillStyle = gr;
g.fill();
g.lineCap = 'round';
for (let i = 0; i < 500; i++) {
  const x = -68 + e.rnd() * 136, by = top(x) + 0.05, h = 0.12 + e.rnd() * 0.35;
  g.strokeStyle = e.rnd() < 0.5 ? '#7a7e60' : '#8e8e6c';
  g.lineWidth = 0.025;
  g.beginPath();
  g.moveTo(x, by);
  g.lineTo(x + 0.05, by - h);
  g.stroke();
}
for (let k = 0; k < 8; k++) {
  e.layer(`rushes${k}`, { pivot: [-60 + k * 15 + 7.5, 0.05], wind: { strength: 0.35, gust: 0.6 }, box: [-62 + k * 15, -1.4, -43 + k * 15, 0.2] }, q => {
    q.lineCap = 'round';
    for (let i = 0; i < 40; i++) {
      const x = -60 + k * 15 + e.rnd() * 15;
      if (x > -4 && x < 10 && e.rnd() < 0.75) continue;
      const h = 0.3 + e.rnd() * 0.9;
      q.strokeStyle = e.rnd() < 0.5 ? '#5e664c' : '#6e7458';
      q.lineWidth = 0.03;
      q.beginPath();
      q.moveTo(x, 0.02);
      q.quadraticCurveTo(x + 0.04, -h * 0.5, x + 0.06, -h);
      q.stroke();
    }
  });
}
function alder(name, ax, h, lean, cA, cB) {
  const by = top(ax) + 0.1, tx = ax + lean * h * 0.4, ty = by - h * 0.52;
  g.fillStyle = '#5a5248';
  g.beginPath();
  g.moveTo(ax - 0.22, by);
  g.quadraticCurveTo(ax - 0.1 + lean * h * 0.2, by - h * 0.3, tx - 0.08, ty);
  g.lineTo(tx + 0.08, ty);
  g.quadraticCurveTo(ax + 0.12 + lean * h * 0.2, by - h * 0.3, ax + 0.22, by);
  g.closePath();
  g.fill();
  e.layer(name, { pivot: [tx, ty + h * 0.2], wind: { strength: 0.12, gust: 0.5 }, box: [tx - h * 0.6, ty - h * 0.5, tx + h * 0.6, ty + h * 0.35] }, q => {
    for (let k = 0; k < 170; k++) {
      const a = e.rnd() * 6.28, rr = Math.pow(e.rnd(), 0.6);
      const cx = tx + Math.cos(a) * rr * h * 0.4, cy = ty - h * 0.06 + Math.sin(a) * rr * h * 0.3 + rr * rr * h * 0.05, r = h * (0.03 + e.rnd() * 0.045);
      q.fillStyle = e.rnd() < 0.55 ? cA : cB;
      q.beginPath();
      q.ellipse(cx, cy, r * 1.4, r, e.rnd(), 0, 7);
      q.fill();
    }
  });
}
alder('alder0', -25, 6.5, -0.1, '#5e6a58', '#6c7864');
alder('alder1', -18, 7.5, 0.12, '#58644f', '#66725c');
alder('alder2', -12.5, 5.5, 0.2, '#62705c', '#707e68');
alder('alder3', 13.5, 6.5, -0.18, '#5a6654', '#687462');
alder('alder4', 19, 8, 0.06, '#56624e', '#64705c');
alder('alder5', 25, 6, 0, '#606c58', '#6e7a66');
