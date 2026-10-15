const t = e.t;
function top(x) {
  const b = -0.7 + 0.05 * Math.sin(x * 0.6) + 0.03 * Math.sin(x * 1.9 + 1) + 0.015 * Math.sin(x * 4.3);
  if (x < 1.6) return b;
  if (x < 5.5) {
    const k = (x - 1.6) / 3.9;
    return b * (0.5 + 0.5 * Math.cos(Math.PI * k));
  }
  return 0.04;
}
const gr = g.createLinearGradient(0, -0.8, 0, 2.6);
gr.addColorStop(0, "#111521");
gr.addColorStop(0.4, "#0b0e17");
gr.addColorStop(1, "#07090f");
g.fillStyle = gr;
g.beginPath();
g.moveTo(-20, 2.6);
for (let x = -20; x <= 20; x += 0.15) g.lineTo(x, top(x));
g.lineTo(20, 2.6);
g.closePath();
g.fill();
g.fillStyle = "#0d111b";
for (let i = 0; i < 200; i++) {
  const x = -11 + e.rnd() * 17;
  const y = top(x) + 0.03;
  const h = 0.05 + e.rnd() * e.rnd() * 0.3;
  const l = (e.rnd() - 0.3) * 0.5 + 0.06 * Math.sin(t * 0.45 + i * 0.7) + 0.03 * Math.sin(t * 1.1 + i);
  g.beginPath();
  g.moveTo(x - 0.012, y);
  g.quadraticCurveTo(x + l * h * 0.4, y - h * 0.6, x + l * h, y - h);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.006, y - h * 0.5, x + 0.012, y);
  g.fill();
}
for (let i = 0; i < 14; i++) {
  const x = -10 + e.rnd() * 16,
    y = top(x) + 0.3 + e.rnd() * 1.5,
    r = 0.5 + e.rnd() * 1.2;
  const rg = g.createRadialGradient(x, y, 0, x, y, r);
  rg.addColorStop(0, "rgba(30,36,52,0.25)");
  rg.addColorStop(1, "rgba(0,0,0,0)");
  g.save();
  g.translate(x, y);
  g.scale(1, 0.3);
  g.translate(-x, -y);
  g.fillStyle = rg;
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
  g.restore();
}
