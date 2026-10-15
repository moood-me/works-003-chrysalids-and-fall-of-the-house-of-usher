// weeds in the near right (8 m), swaying
e.layer('b', { pivot: [0, 1.5], wind: { strength: 0.3, gust: 0.5 }, box: [-5, -3, 6, 1.5] }, q => {
  for (let i = 0; i < 60; i++) {
    const x = -5 + e.rnd() * 11, h = 0.3 + e.rnd() * 2.2, l = (e.rnd() - 0.4) * 0.5;
    q.fillStyle = e.rnd() < 0.5 ? '#5e5a46' : '#6a6450';
    q.beginPath(); q.moveTo(x - 0.03, 1.5); q.quadraticCurveTo(x + l * h * 0.4, 1.5 - h * 0.6, x + l * h, 1.5 - h); q.quadraticCurveTo(x + l * h * 0.4 + 0.01, 1.5 - h * 0.5, x + 0.03, 1.5); q.fill();
  }
});
