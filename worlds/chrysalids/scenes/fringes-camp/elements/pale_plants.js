// pale growths at the clearing's edge (19 m): stalks with glowing tips (a layer that glows, breathing)
e.layer('stalks', { pivot: [0, 0.3], wind: { strength: 0.2, gust: 0.5 }, box: [-26, -4, 26, 0.3] }, q => {
  q.strokeStyle = '#6a7a62';
  q.lineWidth = 0.04;
  q.lineCap = 'round';
  for (let i = 0; i < 40; i++) {
    const x = -24 + e.rnd() * 48, h = 0.5 + e.rnd() * e.rnd() * 2.4;
    if (Math.abs(x + 1) < 4) continue;
    q.beginPath(); q.moveTo(x, 0.2); q.quadraticCurveTo(x + 0.2, -h * 0.5, x + 0.1, -h); q.stroke();
  }
});
e.layer('tips', { blend: 'add', box: [-26, -4, 26, 0.3] }, q => {
  for (let i = 0; i < 40; i++) {
    const x = -24 + e.rnd() * 48 + 0.1, h = 0.5 + e.rnd() * e.rnd() * 2.4;
    if (Math.abs(x + 1) < 4) continue;
    const tg = q.createRadialGradient(x, -h, 0, x, -h, 0.2);
    tg.addColorStop(0, 'rgba(208,230,182,0.8)');
    tg.addColorStop(1, 'rgba(200,224,178,0)');
    q.fillStyle = tg;
    q.beginPath(); q.arc(x, -h, 0.2, 0, 7); q.fill();
  }
});
