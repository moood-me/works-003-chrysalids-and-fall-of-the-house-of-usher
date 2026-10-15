let gr = g.createLinearGradient(0, -270, 0, 270);
gr.addColorStop(0, "#8a8e85");
gr.addColorStop(1, "#727869");
g.fillStyle = gr;
g.fillRect(-1500, -270, 3000, 540);
for (let i = 0; i < 80; i++) {
  const x = -600 + e.rnd() * 1200,
    y = -260 + e.rnd() * 520,
    w = 40 + e.rnd() * 160,
    h = 6 + e.rnd() * 18,
    r = (e.rnd() - 0.5) * 0.3;
  g.globalAlpha = 0.1 + e.rnd() * 0.12;
  g.fillStyle = e.rnd() < 0.5 ? "#9c9f92" : "#5f665a";
  g.beginPath();
  g.ellipse(x, y, w, h, r, 0, 7);
  g.fill();
}
for (let k = 0; k < 4; k++) {
  const y0 = -220 + k * 110 + e.rnd() * 30;
  for (let x = -700; x < 700; x += 5 + e.rnd() * 8) {
    const r = 2 + e.rnd() * 3;
    g.globalAlpha = 0.45;
    g.fillStyle = "#5f665b";
    g.beginPath();
    g.ellipse(x, y0 + 8 * Math.sin(x / 90 + k), r * 1.3, r, 0, 0, 7);
    g.fill();
  }
}
g.globalAlpha = 1;
