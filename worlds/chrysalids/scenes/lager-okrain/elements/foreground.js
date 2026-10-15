// grasses at our feet (4.2 m), tufts swaying
for (let k = 0; k < 7; k++) {
  e.layer(`g${k}`, { pivot: [-14 + k * 4 + 2, 0.35], wind: { strength: 0.35, gust: 0.5 }, box: [-14.5 + k * 4, -2, -9.5 + k * 4, 0.4] }, q => {
    for (let i = 0; i < 36; i++) {
      const x = -14 + k * 4 + e.rnd() * 4, h = 0.2 + Math.pow(e.rnd(), 1.6) * 1.0, l = (e.rnd() - 0.4) * 0.4;
      q.fillStyle = e.rnd() < 0.5 ? '#6a7656' : '#76825e';
      q.beginPath();
      q.moveTo(x - 0.02, 0.35);
      q.quadraticCurveTo(x + l * h * 0.4, 0.35 - h * 0.6, x + l * h, 0.35 - h);
      q.quadraticCurveTo(x + l * h * 0.4 + 0.008, 0.35 - h * 0.5, x + 0.02, 0.35);
      q.fill();
    }
  });
}
