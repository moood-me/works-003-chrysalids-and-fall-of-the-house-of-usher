// ears of wheat at the dune's edge near us on the left, dark against the dream, stirring (each a layer in the wind)
for (let i = 0; i < 30; i++) {
  const x = -4 + Math.pow(e.rnd(), 1.3) * 5.6, h = 0.5 + e.rnd() * 0.8 * (1 - (x + 4) / 7), lean = (e.rnd() - 0.35) * 0.35, y0 = 0.35;
  const col = e.rnd() < 0.5 ? '#4a4a3a' : '#565444';
  e.layer('w' + i, { pivot: [x, y0], wind: { strength: 0.35, gust: 0.4 }, box: [x - 0.5, y0 - h - 0.3, x + 0.6, y0 + 0.05] }, q => {
    const mx = x + lean * h * 0.2, my = y0 - h * 0.6, tx = x + lean * h, ty = y0 - h;
    q.strokeStyle = col; q.lineWidth = 0.016;
    q.beginPath(); q.moveTo(x, y0); q.quadraticCurveTo(mx, my, tx, ty); q.stroke();
    q.save(); q.translate(tx, ty); q.rotate(Math.atan2(ty - my, tx - mx));
    q.fillStyle = col; q.beginPath(); q.ellipse(0.07, 0, 0.085, 0.024, 0, 0, 7); q.fill();
    q.lineWidth = 0.005;
    for (let a = -1; a <= 1; a++) { q.beginPath(); q.moveTo(0.13, a * 0.01); q.lineTo(0.27, a * 0.04); q.stroke(); }
    q.restore();
  });
}
