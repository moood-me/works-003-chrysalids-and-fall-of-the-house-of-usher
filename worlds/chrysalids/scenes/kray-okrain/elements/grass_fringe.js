// rough grass along the fence on the Fringes' side (13.2 m), tufts swaying
for (let k = 0; k < 8; k++) {
  e.layer(`g${k}`, { pivot: [-34 + k * 8.5 + 4, 0.3], wind: { strength: 0.35, gust: 0.6 }, box: [-35 + k * 8.5, -3, -24.5 + k * 8.5, 0.3] }, q => {
    for (let i = 0; i < 50; i++) {
      const x = -34 + k * 8.5 + e.rnd() * 8.5, h = 0.3 + e.rnd() * e.rnd() * 2.2, l = (e.rnd() - 0.5) * 0.5;
      q.fillStyle = e.rnd() < 0.5 ? '#5a6a50' : '#687a5c';
      q.beginPath();
      q.moveTo(x - 0.03, 0.25);
      q.quadraticCurveTo(x + l * h * 0.4, 0.25 - h * 0.6, x + l * h, 0.25 - h);
      q.quadraticCurveTo(x + l * h * 0.4 + 0.01, 0.25 - h * 0.5, x + 0.03, 0.25);
      q.fill();
    }
  });
}
