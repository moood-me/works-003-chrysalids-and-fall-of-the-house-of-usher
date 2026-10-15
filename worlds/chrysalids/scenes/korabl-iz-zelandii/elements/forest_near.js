// the crooked wood round the clearing (45 m): its crowns a layer swaying a little
e.layer('w', { pivot: [0, 0], wind: { strength: 0.05, gust: 0.4 }, box: [-90, -28, 90, 2] }, q => {
  for (let i = 0; i < 70; i++) {
    const x = -88 + e.rnd() * 176, h = 10 + e.rnd() * 12, lean = (e.rnd() - 0.5) * 3;
    q.fillStyle = '#5a5246';
    q.fillRect(x - 0.25, -h, 0.5, h + 1);
    q.fillStyle = e.rnd() < 0.5 ? '#4c584a' : '#5a6654';
    q.beginPath();
    q.ellipse(x + lean, -h, 2 + e.rnd() * 3, 1.5 + e.rnd() * 2, lean * 0.1, 0, 7);
    q.fill();
  }
});
