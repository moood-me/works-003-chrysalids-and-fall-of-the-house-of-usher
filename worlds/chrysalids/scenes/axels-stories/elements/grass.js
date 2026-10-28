// tufts at the foot of the rise near us, either side, stirring in the wind (each clump a layer)
for (let i = 0; i < 14; i++) {
  const side = i % 2 ? -1 : 1, x0 = side < 0 ? -4.5 + e.rnd() * 2.6 : 1.6 + e.rnd() * 3.2;
  e.layer('t' + i, { pivot: [x0, 0.4], wind: { strength: 0.35, gust: 0.4 }, box: [x0 - 0.6, -0.6, x0 + 0.6, 0.5] }, q => {
    q.fillStyle = e.rnd() < 0.5 ? '#4e5a3c' : '#5c6846';
    for (let j = 0; j < 6; j++) {
      const x = x0 + (e.rnd() - 0.5) * 0.4, h = 0.15 + e.rnd() * 0.5, l = (e.rnd() - 0.4) * 0.5;
      q.beginPath();
      q.moveTo(x - 0.015, 0.4); q.quadraticCurveTo(x + l * h * 0.4, -h * 0.5 + 0.2, x + l * h, -h + 0.2);
      q.quadraticCurveTo(x + l * h * 0.4 + 0.008, -h * 0.4 + 0.2, x + 0.015, 0.4);
      q.fill();
    }
  });
}
