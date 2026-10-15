// four poplars far off on the right (130 m), each a layer swaying in the wind about its foot
const P = [[-6, 15], [-2.2, 17.5], [2.5, 13], [7.5, 16]];
P.forEach(([x, h], i) => e.layer('t' + i, { pivot: [x, 0], wind: { strength: 0.25, gust: 0.3 }, box: [x - 1.8, -h - 0.5, x + 1.8, 0.5] }, q => {
  q.fillStyle = '#4e5a38';
  q.beginPath();
  q.moveTo(x - 0.15, 0); q.lineTo(x - 0.15, -1.5);
  q.bezierCurveTo(x - 1.5, -h * 0.35, x - 0.9, -h * 0.85, x, -h);
  q.bezierCurveTo(x + 0.9, -h * 0.85, x + 1.5, -h * 0.35, x + 0.15, -1.5);
  q.lineTo(x + 0.15, 0);
  q.closePath();
  q.fill();
}));
