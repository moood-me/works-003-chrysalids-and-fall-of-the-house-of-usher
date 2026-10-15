const yb = (x) =>
  -0.35 -
  0.25 * Math.exp(-Math.pow((x + 3.2) / 2.2, 2)) -
  0.12 * Math.sin(x * 0.6 + 1) * Math.exp(-Math.pow((x + 2) / 4, 2));
const gr = g.createLinearGradient(0, -0.8, 0, 0.4);
gr.addColorStop(0, "#0f1626");
gr.addColorStop(1, "#090e19");
g.fillStyle = gr;
g.beginPath();
g.moveTo(-9, 0.5);
for (let x = -9; x <= 1.5; x += 0.1) {
  const k = Math.min(1, Math.max(0, (1.5 - x) / 2.5));
  g.lineTo(x, yb(x) * k + 0.2 * (1 - k));
}
g.lineTo(1.5, 0.5);
g.closePath();
g.fill();
g.fillStyle = "#090e19";
for (let i = 0; i < 260; i++) {
  const x = -8.5 + e.rnd() * 9.5;
  const k = Math.min(1, Math.max(0, (1.5 - x) / 2.5));
  const y0 = yb(x) * k + 0.2 * (1 - k) + 0.03;
  const h = (0.12 + Math.pow(e.rnd(), 1.8) * 0.6) * (0.3 + 0.7 * k);
  const ph = e.rnd() * 6.28;
  const l = (e.rnd() - 0.35) * 0.5 + 0.08 * Math.sin(e.t * 0.38 + ph + x * 0.3) + 0.035 * Math.sin(e.t * 1.07 + ph);
  g.beginPath();
  g.moveTo(x - 0.012, y0);
  g.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.006, y0 - h * 0.5, x + 0.012, y0);
  g.fill();
  if (e.rnd() < 0.06) {
    g.beginPath();
    g.ellipse(x + l * h, y0 - h - 0.03, 0.013, 0.045, l, 0, 7);
    g.fill();
  }
}
g.strokeStyle = "rgba(120,136,168,0.14)";
g.lineWidth = 0.006;
for (let i = 0; i < 30; i++) {
  const x = -8 + e.rnd() * 8.5;
  const k = Math.min(1, Math.max(0, (1.5 - x) / 2.5));
  const y0 = yb(x) * k + 0.2 * (1 - k);
  const h = 0.2 + e.rnd() * 0.5 * k;
  const l = 0.15 + 0.07 * Math.sin(e.t * 0.38 + i);
  g.beginPath();
  g.moveTo(x, y0);
  g.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
  g.stroke();
}
