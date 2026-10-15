for (let i = 0; i < 20; i++) {
  const bx = -11 + e.rnd() * 22,
    by = -0.3 - e.rnd() * 3.2,
    sp = 0.03 + e.rnd() * 0.05,
    ph = e.rnd() * 6.28,
    r = 0.09 + e.rnd() * 0.04;
  const x = bx + Math.sin(e.t * sp + ph) * 0.9 + Math.sin(e.t * sp * 2.7 + ph * 1.3) * 0.25;
  const y = by + Math.sin(e.t * sp * 1.9 + ph * 2) * 0.35;
  const a = 0.4 + 0.55 * (0.5 + 0.5 * Math.sin(e.t * (0.3 + sp * 3) + ph));
  const sg = g.createRadialGradient(x, y, 0, x, y, r);
  sg.addColorStop(0, "rgba(220,232,204," + a + ")");
  sg.addColorStop(0.25, "rgba(204,220,190," + a * 0.45 + ")");
  sg.addColorStop(1, "rgba(200,218,190,0)");
  g.fillStyle = sg;
  g.beginPath();
  g.arc(x, y, r, 0, 7);
  g.fill();
}
