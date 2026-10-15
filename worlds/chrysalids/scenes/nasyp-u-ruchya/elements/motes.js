for (let i = 0; i < 45; i++) {
  const x0 = -4 + e.rnd() * 8,
    y0 = -3 + e.rnd() * 3.3,
    ph = e.rnd() * 6.28,
    sp = 0.05 + e.rnd() * 0.1;
  const x = x0 + 0.4 * Math.sin(e.t * sp + ph),
    y = y0 + 0.25 * Math.sin(e.t * sp * 1.7 + ph * 2) - ((e.t * 0.02 * (0.5 + e.rnd())) % 1) * 0.3;
  g.globalAlpha = 0.3 + 0.4 * (0.5 + 0.5 * Math.sin(e.t * 0.8 + ph));
  g.fillStyle = "#fff3d0";
  g.beginPath();
  g.arc(x, y, 0.01 + e.rnd() * 0.01, 0, 7);
  g.fill();
}
g.globalAlpha = 1;
