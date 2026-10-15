const t = e.t;
g.fillStyle = "#07090f";
for (let i = 0; i < 70; i++) {
  const side = e.rnd() < 0.55 ? -1 : 1;
  const x = side < 0 ? -5 + e.rnd() * 2.6 : 1.8 + e.rnd() * 3.4;
  const h = 0.15 + e.rnd() * 0.5;
  const l = (e.rnd() - 0.4) * 0.5 + 0.05 * Math.sin(t * 0.4 + i * 0.9) + 0.025 * Math.sin(t * 1.07 + i);
  g.beginPath();
  g.moveTo(x - 0.015, 0.4);
  g.quadraticCurveTo(x + l * h * 0.4, -h * 0.5 + 0.2, x + l * h, -h + 0.2);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.008, -h * 0.4 + 0.2, x + 0.015, 0.4);
  g.fill();
}
g.fillRect(-6, 0.38, 12, 1);
