g.fillStyle = "#121a29";
for (let i = 0; i < 260; i++) {
  const x = -34 + e.rnd() * 68;
  const h = 0.2 + Math.pow(e.rnd(), 2) * 1.6,
    ph = e.rnd() * 6.28,
    ln = e.rnd();
  if (Math.abs(x - 1.5) < 0.8) continue;
  const lean = (ln - 0.5) * 0.6 + 0.06 * Math.sin(e.t * 0.4 + ph) + 0.03 * Math.sin(e.t * 0.93 + ph);
  g.beginPath();
  g.moveTo(x - 0.05, 0);
  g.quadraticCurveTo(x + lean * h * 0.4, -h * 0.6, x + lean * h, -h);
  g.quadraticCurveTo(x + lean * h * 0.4 + 0.02, -h * 0.5, x + 0.05, 0);
  g.fill();
}
