// undergrowth at the wood's foot (36 m), swaying
e.layer('u', { pivot: [0, 0.5], wind: { strength: 0.15, gust: 0.5 }, box: [-70, -4, 70, 0.5] }, q => {
  for (let i = 0; i < 120; i++) {
    const x = -70 + e.rnd() * 140, h = 0.6 + e.rnd() * 2.6;
    q.fillStyle = e.rnd() < 0.5 ? '#56604c' : '#62705a';
    q.beginPath(); q.ellipse(x, -h / 2, 0.6 + e.rnd(), h / 2, 0, 0, 7); q.fill();
  }
});
