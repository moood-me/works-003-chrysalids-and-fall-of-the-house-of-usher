// a swollen tree on the left near us (5.6 m): its trunk bulging, its branches thick and short, its leaves a layer swaying
g.fillStyle = '#5a4e40';
g.beginPath();
g.moveTo(-0.6, 0.5);
g.bezierCurveTo(-1.6, -2, -0.2, -4, -0.6, -6.5);
g.lineTo(0.6, -6.8);
g.bezierCurveTo(1.2, -4, 2.0, -2, 0.7, 0.5);
g.closePath();
g.fill();
g.strokeStyle = '#5a4e40';
g.lineCap = 'round';
for (const [x, y, ex, ey, w] of [[0, -5, 3.5, -7, 0.25], [0.2, -6.2, 5.5, -8, 0.2], [-0.2, -5.6, -2.4, -7.4, 0.18]]) {
  g.lineWidth = w;
  g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo((x + ex) / 2, y - 1.6, ex, ey); g.stroke();
}
e.layer('leaves', { pivot: [0.5, -6], wind: { strength: 0.12, gust: 0.5 }, box: [-3, -9, 9, -5] }, q => {
  for (let i = 0; i < 160; i++) {
    const x = -2.5 + e.rnd() * 10.5, y = -8.5 + e.rnd() * 2.5;
    q.fillStyle = e.rnd() < 0.5 ? '#56664c' : '#64745a';
    q.beginPath(); q.ellipse(x, y, 0.2 + e.rnd() * 0.3, 0.12, e.rnd() * 3, 0, 7); q.fill();
  }
});
