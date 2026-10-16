// The washing line by the girl at the farm (its posts, the rope sagging, the linen on it — each piece a layer in the
// wind); its pegs, where her hands go as she hangs the washing (`peg_l`, `peg_r`)
g.fillStyle = '#6a5a46';
g.fillRect(-2.6, -2.1, 0.09, 2.15);
g.fillRect(2.5, -2.1, 0.09, 2.15);
g.strokeStyle = '#8a8070';
g.lineWidth = 0.025;
g.beginPath(); g.moveTo(-2.55, -2.0); g.quadraticCurveTo(0, -1.75, 2.55, -2.0); g.stroke();
const sag = x => -2.0 + 0.25 * (1 - (x / 2.55) * (x / 2.55));
const LIN = [[-2.0, 0.55, 0.7, '#ecebe2'], [-1.25, 0.45, 0.95, '#d8dce4'], [-0.55, 0.6, 0.55, '#f0eadc'], [0.35, 0.5, 0.8, '#e2d6c4'], [1.1, 0.55, 0.65, '#ecebe2'], [1.85, 0.4, 0.9, '#cfd6e0']];
LIN.forEach(([x, w, h, c], i) => e.layer('c' + i, { pivot: [x + w / 2, sag(x + w / 2)], wind: { strength: 0.6, gust: 0.6 }, box: [x - 0.2, sag(x) - 0.1, x + w + 0.2, sag(x) + h + 0.2] }, q => {
  q.fillStyle = c;
  q.beginPath(); q.moveTo(x, sag(x)); q.lineTo(x + w, sag(x + w)); q.lineTo(x + w + 0.03, sag(x + w) + h); q.lineTo(x - 0.02, sag(x) + h * 0.96); q.closePath(); q.fill();
}));
e.at(-0.2, sag(-0.2), 'peg_l');
e.at(0.25, sag(0.25), 'peg_r');
