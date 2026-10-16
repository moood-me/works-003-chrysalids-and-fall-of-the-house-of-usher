// tufts of grass by the road at our feet (4.6 m), stirring in the wind
for (let i = 0; i < 7; i++) {
  const x = -1.6 + e.rnd() * 3.4, h = 0.18 + e.rnd() * 0.22;
  e.layer('g' + i, { pivot: [x, 0], wind: { strength: 0.5, gust: 0.5 }, box: [x - 0.3, -h - 0.1, x + 0.3, 0.05] }, q => {
    q.strokeStyle = i % 2 ? '#6c7444' : '#7c8450';
    q.lineWidth = 0.018;
    q.lineCap = 'round';
    q.beginPath();
    for (let j = 0; j < 5; j++) {
      const a = (j - 2) * 0.18;
      q.moveTo(x + (j - 2) * 0.02, 0.02);
      q.quadraticCurveTo(x + a * h * 0.3, -h * 0.5, x + a * h * 0.8, -h * (0.75 + 0.25 * Math.cos(j)));
    }
    q.stroke();
  });
}
