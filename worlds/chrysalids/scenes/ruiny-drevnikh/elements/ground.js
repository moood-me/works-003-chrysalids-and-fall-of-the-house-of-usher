let gr = g.createLinearGradient(0, -20, 0, 20);
gr.addColorStop(0, "#808b69");
gr.addColorStop(0.4, "#76815f");
gr.addColorStop(1, "#646f4e");
g.fillStyle = gr;
g.fillRect(-120, -20, 240, 40);
for (let i = 0; i < 160; i++) {
  const x = -50 + e.rnd() * 100,
    y = -20 + e.rnd() * 40,
    r = 0.6 + e.rnd() * 2.5;
  const pg = g.createRadialGradient(x, y, 0, x, y, r);
  const c = e.rnd();
  pg.addColorStop(0, c < 0.4 ? "rgba(64,74,50,0.22)" : c < 0.75 ? "rgba(176,170,124,0.14)" : "rgba(150,160,112,0.16)");
  pg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = pg;
  g.save();
  g.translate(x, y);
  g.scale(1.8, 1);
  g.translate(-x, -y);
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
  g.restore();
}
g.strokeStyle = "rgba(178,170,128,0.2)";
g.lineCap = "round";
g.lineWidth = 0.6;
g.beginPath();
g.moveTo(-0.5, 22);
g.bezierCurveTo(-2.5, 16, -1, 10, 1.2, 7);
g.bezierCurveTo(2.2, 6, 2.6, 5, 2.8, 4.6);
g.stroke();
g.lineWidth = 0.3;
g.strokeStyle = "rgba(186,178,136,0.16)";
g.beginPath();
g.moveTo(-0.6, 13);
g.bezierCurveTo(-2, 10, -3, 7, -3.3, 5.8);
g.stroke();
