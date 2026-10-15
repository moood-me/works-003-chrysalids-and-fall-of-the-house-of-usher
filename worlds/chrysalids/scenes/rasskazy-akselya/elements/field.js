g.fillStyle = "#131a2b";
g.fillRect(-450, -200, 900, 400);
const lg = g.createLinearGradient(0, -200, 0, 60);
lg.addColorStop(0, "rgba(48,60,92,0.55)");
lg.addColorStop(1, "rgba(48,60,92,0)");
g.fillStyle = lg;
g.fillRect(-450, -200, 900, 400);
for (let i = 0; i < 40; i++) {
  const x = -450 + e.rnd() * 900,
    y = -200 + e.rnd() * 400,
    r = 10 + e.rnd() * 40;
  const rg = g.createRadialGradient(x, y, 0, x, y, r);
  rg.addColorStop(0, e.rnd() < 0.5 ? "rgba(8,11,20,0.35)" : "rgba(40,50,74,0.25)");
  rg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = rg;
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
}
for (let y = -200; y < 200; y += 2.2) {
  g.fillStyle = "rgba(50,62,92," + (0.05 + e.rnd() * 0.06) + ")";
  g.fillRect(-450, y, 900, 0.5);
}
