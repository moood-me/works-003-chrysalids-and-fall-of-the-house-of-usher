// grass at the clearing's near edge, below us, swaying
e.layer('g', { pivot: [0, 0.5], wind: { strength: 0.3, gust: 0.5 }, box: [-6, -1.2, 6, 0.5] }, q => {
  for (let i = 0; i < 60; i++) {
    const x = -6 + e.rnd() * 12, h = 0.2 + e.rnd() * 0.8, l = (e.rnd() - 0.4) * 0.4;
    q.fillStyle = e.rnd() < 0.5 ? '#6a7656' : '#76825e';
    q.beginPath(); q.moveTo(x - 0.02, 0.5); q.quadraticCurveTo(x + l * h * 0.4, 0.5 - h * 0.6, x + l * h, 0.5 - h); q.quadraticCurveTo(x + l * h * 0.4 + 0.008, 0.5 - h * 0.5, x + 0.02, 0.5); q.fill();
  }
});
