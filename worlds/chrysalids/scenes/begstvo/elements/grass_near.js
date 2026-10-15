// dry grass on the near slope (4.5 m), tufts swaying
for (let k = 0; k < 7; k++) {
  e.layer(`t${k}`, { pivot: [-14 + k * 4 + 2, 0.4], wind: { strength: 0.45, gust: 0.6 }, box: [-14.5 + k * 4, -1.3, -9.5 + k * 4, 0.6] }, q => {
    for (let i = 0; i < 40; i++) {
      const x = -14 + k * 4 + e.rnd() * 4, h = 0.15 + Math.pow(e.rnd(), 1.6) * 0.7, l = (e.rnd() - 0.4) * 0.4;
      q.fillStyle = e.rnd() < 0.5 ? '#7a7656' : '#8a8460';
      q.beginPath();
      q.moveTo(x - 0.015, 0.4);
      q.quadraticCurveTo(x + l * h * 0.4, 0.4 - h * 0.6, x + l * h, 0.4 - h);
      q.quadraticCurveTo(x + l * h * 0.4 + 0.006, 0.4 - h * 0.5, x + 0.015, 0.4);
      q.fill();
    }
  });
}
