g.fillStyle = "#1e1a24";
for (let i = 0; i < 160; i++) {
  const x = -6 + e.rnd() * 12;
  if (x > -1.5 && x < 2.5 && e.rnd() < 0.7) continue;
  const h = 0.15 + Math.pow(e.rnd(), 2) * 0.9;
  const ph = e.rnd() * 6.28;
  const l = (e.rnd() - 0.5) * 0.5 + 0.05 * Math.sin(e.t * 0.42 + ph) + 0.025 * Math.sin(e.t * 1.03 + ph);
  g.beginPath();
  g.moveTo(x - 0.02, 0.4);
  g.quadraticCurveTo(x + l * h * 0.4, -h * 0.6, x + l * h, -h);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.008, -h * 0.5, x + 0.02, 0.4);
  g.fill();
}
