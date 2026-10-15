// tufts of grass in the yard (6.2 m), swaying
e.layer('t', { pivot: [0, 0.3], wind: { strength: 0.3, gust: 0.5 }, box: [-7, -0.6, 7, 0.3] }, q => {
  for (let i = 0; i < 40; i++) {
    const x = -7 + e.rnd() * 14, h = 0.1 + e.rnd() * 0.35;
    q.fillStyle = e.rnd() < 0.5 ? '#7a7c58' : '#8e8c64';
    q.beginPath(); q.moveTo(x - 0.03, 0.25); q.lineTo(x, 0.25 - h); q.lineTo(x + 0.03, 0.25); q.fill();
  }
});
