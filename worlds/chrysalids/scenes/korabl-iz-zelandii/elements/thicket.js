// tangled branches on the right of the clearing (27 m), a layer swaying
e.layer('t', { pivot: [0, 0], wind: { strength: 0.1, gust: 0.5 }, box: [-16, -6, 16, 1] }, q => {
  q.strokeStyle = '#5a5044';
  q.lineCap = 'round';
  for (let i = 0; i < 40; i++) {
    const x = -15 + e.rnd() * 30, h = 2 + e.rnd() * 3.5;
    q.lineWidth = 0.05 + e.rnd() * 0.08;
    q.beginPath(); q.moveTo(x, 0.5); q.bezierCurveTo(x + (e.rnd() - 0.5) * 3, -h * 0.4, x + (e.rnd() - 0.5) * 4, -h * 0.8, x + (e.rnd() - 0.5) * 3, -h); q.stroke();
  }
});
