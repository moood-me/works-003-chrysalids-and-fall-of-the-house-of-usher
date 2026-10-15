const gr = g.createLinearGradient(0, -39, 0, 39);
gr.addColorStop(0, "#4a4250");
gr.addColorStop(0.25, "#3c3543");
gr.addColorStop(1, "#231f2a");
g.fillStyle = gr;
g.fillRect(-150, -39.5, 300, 79);
for (let i = 0; i < 220; i++) {
  const x = -150 + e.rnd() * 300,
    y = -39 + e.rnd() * 78,
    r = 1 + e.rnd() * 5;
  const rg = g.createRadialGradient(x, y, 0, x, y, r);
  const dk = e.rnd() < 0.6;
  rg.addColorStop(0, dk ? "rgba(30,26,36,0.35)" : "rgba(120,104,118,0.1)");
  rg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = rg;
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
}
g.strokeStyle = "rgba(30,26,36,0.25)";
g.lineWidth = 0.08;
for (let i = 0; i < 60; i++) {
  const x = -60 + e.rnd() * 120,
    y = -30 + e.rnd() * 65;
  const L = 0.5 + e.rnd() * 2.5,
    an = e.rnd() * 3;
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + Math.cos(an) * L, y + Math.sin(an) * L);
  g.stroke();
}
