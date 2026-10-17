// The ledge's front and the stone the children hide behind (7.3 m): the rock face down to the clearing, the stone, tufts
// on the ledge's lip (a layer swaying); the way down it on the right (relief.js: where the children go down and up)
const LH = 1.0, top = x => LH + 0.12 * Math.sin(x * 1.7) + 0.06 * Math.sin(x * 4.1);
g.fillStyle = '#6e6674';
g.beginPath();
g.moveTo(-16, 5);
for (let x = -16; x <= -1.0; x += 0.2) { const h = x < -1.6 ? top(x) : top(-1.6) * (1 - (x + 1.6) / 0.6); g.lineTo(x, -h); }
g.lineTo(-0.5, 0.4);
g.lineTo(-0.1, 1.4);
g.lineTo(0, 5);
g.closePath();
g.fill();
g.fillStyle = '#7e7684';
g.beginPath(); g.ellipse(-1.9, -1.0, 0.95, 0.55, -0.15, 0, 7); g.fill();
g.beginPath(); g.ellipse(-2.8, -1.05, 0.6, 0.35, 0.1, 0, 7); g.fill();
e.layer('tufts', { pivot: [-8, -1.0], wind: { strength: 0.3, gust: 0.5 }, box: [-16, -1.6, -1.5, -0.8] }, q => {
  q.fillStyle = '#6a7458';
  for (let i = 0; i < 70; i++) {
    const x = -15.5 + e.anim.hash(i, 1) * 14, y = -top(x), h = 0.1 + e.anim.hash(i, 2) * 0.35, l = (e.anim.hash(i, 3) - 0.5) * 0.6;
    q.beginPath(); q.moveTo(x - 0.02, y + 0.02); q.quadraticCurveTo(x + l * h * 0.4, y - h * 0.6, x + l * h, y - h); q.quadraticCurveTo(x + l * h * 0.4 + 0.01, y - h * 0.5, x + 0.02, y + 0.02); q.fill();
  }
});
