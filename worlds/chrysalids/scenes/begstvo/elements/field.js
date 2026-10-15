let gr = g.createLinearGradient(0, -38, 0, 38);
gr.addColorStop(0, "#2a3753");
gr.addColorStop(0.3, "#1f2a42");
gr.addColorStop(0.6, "#151d30");
gr.addColorStop(1, "#0b111e");
g.fillStyle = gr;
g.fillRect(-120, -38, 240, 76);
for (let i = 0; i < 120; i++) {
  const x = -100 + e.rnd() * 200,
    y = -38 + e.rnd() * 76,
    r = 1.5 + e.rnd() * 6;
  const pg = g.createRadialGradient(x, y, 0, x, y, r);
  pg.addColorStop(0, e.rnd() < 0.55 ? "rgba(6,10,18,0.25)" : "rgba(64,80,110,0.07)");
  pg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = pg;
  g.save();
  g.translate(x, y);
  g.scale(2, 0.6);
  g.translate(-x, -y);
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
  g.restore();
}
g.fillStyle = "rgba(10,15,26,0.6)";
for (let i = 0; i < 700; i++) {
  const x = -50 + e.rnd() * 100,
    y = 20 + e.rnd() * 18;
  g.beginPath();
  g.ellipse(x, y, 0.04 + e.rnd() * 0.12, 0.02 + e.rnd() * 0.04, 0, 0, 7);
  g.fill();
}
