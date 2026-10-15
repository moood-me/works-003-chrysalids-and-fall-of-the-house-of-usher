// crooked trees round the clearing (26 m): trunks too long, crowns not a tree's — layers swaying a little
for (let n = 0; n < 5; n++) {
  e.layer(`t${n}`, { pivot: [-70 + n * 28 + 14, 0], wind: { strength: 0.06, gust: 0.4 }, box: [-74 + n * 28, -32, -38 + n * 28, 1] }, q => {
    for (let i = 0; i < 6; i++) {
      const x = -70 + n * 28 + e.rnd() * 28;
      if (Math.abs(x + 1) < 9) continue;
      const h = 12 + e.rnd() * 14, lean = (e.rnd() - 0.5) * 3, k = e.rnd();
      q.fillStyle = '#5a5042';
      q.beginPath();
      q.moveTo(x - 0.4, 0.5);
      q.quadraticCurveTo(x + lean * 0.5, -h * 0.5, x + lean - 0.15, -h);
      q.lineTo(x + lean + 0.15, -h);
      q.quadraticCurveTo(x + lean * 0.5 + 0.3, -h * 0.5, x + 0.4, 0.5);
      q.closePath();
      q.fill();
      q.fillStyle = k < 0.5 ? '#4e6048' : '#5c6c50';
      q.beginPath();
      q.ellipse(x + lean, -h, 2 + k * 3, 1.2 + k * 1.5, lean * 0.1, 0, 7);
      q.fill();
    }
  });
}
