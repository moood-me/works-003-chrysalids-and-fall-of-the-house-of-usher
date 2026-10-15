// weeds at our feet (4.6 m), swaying
e.layer('w', { pivot: [0, 0.3], wind: { strength: 0.35, gust: 0.6 }, box: [-5.5, -1, 5.5, 0.3] }, q => {
  for (let i = 0; i < 60; i++) {
    const x = -5.5 + e.rnd() * 11, h = 0.2 + e.rnd() * 0.7, l = (e.rnd() - 0.4) * 0.4;
    q.fillStyle = e.rnd() < 0.5 ? '#7a7c58' : '#8a8a62';
    q.beginPath(); q.moveTo(x - 0.02, 0.3); q.quadraticCurveTo(x + l * h * 0.4, 0.3 - h * 0.6, x + l * h, 0.3 - h); q.quadraticCurveTo(x + l * h * 0.4 + 0.008, 0.3 - h * 0.5, x + 0.02, 0.3); q.fill();
  }
});
