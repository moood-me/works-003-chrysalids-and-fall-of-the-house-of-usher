// the far copses on the skyline (400 m)
g.fillStyle = '#3e4a40';
g.beginPath();
g.moveTo(-900, 2);
for (let x = -900; x <= 900; x += 8) g.lineTo(x, -0.8 - 0.6 * Math.sin(x * 0.011 + 1) - e.rnd() * 0.4);
g.lineTo(900, 2);
g.closePath();
g.fill();
for (let i = 0; i < 70; i++) {
  const x = -900 + e.rnd() * 1800;
  if (e.rnd() < 0.35) continue;
  const w = 3 + e.rnd() * e.rnd() * 22, h = 1.2 + e.rnd() * e.rnd() * 4.5;
  g.beginPath();
  g.moveTo(x - w, 0);
  for (let k = 0; k <= 8; k++) { const u = k / 8; g.lineTo(x - w + 2 * w * u, -1 - h * Math.sqrt(Math.sin(Math.PI * u)) * (0.8 + 0.3 * e.rnd())); }
  g.lineTo(x + w, 0);
  g.closePath();
  g.fill();
}
