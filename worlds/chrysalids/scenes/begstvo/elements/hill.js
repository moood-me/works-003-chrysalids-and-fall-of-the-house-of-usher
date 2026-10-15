const cr = (x) => {
  let c = 1.2 + 0.12 * Math.sin(x * 0.31 + 0.6) + 0.06 * Math.sin(x * 0.77);
  if (x < -3) {
    const k = Math.min(1, (-3 - x) / 12);
    const s = k * k * (3 - 2 * k);
    c = c * (1 - s) + (0.25 + 0.1 * Math.sin(x * 0.2)) * s;
  }
  if (x > 3.5) {
    const k = Math.min(1, (x - 3.5) / 9);
    const s = k * k * (3 - 2 * k);
    c = c * (1 - s) + 0.2 * s;
  }
  return c;
};
const gr = g.createLinearGradient(0, -1.4, 0, 0.3);
gr.addColorStop(0, "#24324c");
gr.addColorStop(0.25, "#1b273d");
gr.addColorStop(1, "#131b2d");
g.fillStyle = gr;
g.beginPath();
g.moveTo(-80, 0.4);
for (let x = -80; x <= 80; x += 0.4) g.lineTo(x, -cr(x));
g.lineTo(80, 0.4);
g.closePath();
g.fill();
for (let i = 0; i < 90; i++) {
  const x = -40 + e.rnd() * 110,
    y = -cr(x) + 0.3 + e.rnd() * 1.3;
  const r = 0.4 + e.rnd() * 1.2;
  const pg = g.createRadialGradient(x, y, 0, x, y, r);
  pg.addColorStop(0, e.rnd() < 0.6 ? "rgba(8,12,22,0.22)" : "rgba(60,74,102,0.08)");
  pg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = pg;
  g.save();
  g.translate(x, y);
  g.scale(2, 0.5);
  g.translate(-x, -y);
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
  g.restore();
}
for (const rut of [0.06, 0.16]) {
  for (let x = -14; x <= 80; x += 0.5) {
    const y = -cr(x) + rut + 0.015 * Math.sin(x * 1.3 + rut * 9);
    const a = (0.12 + 0.12 * Math.sin(x * 0.7 + rut * 20) * Math.sin(x * 0.23)) * Math.min(1, (x + 14) / 8);
    if (a <= 0.02) continue;
    const rg = g.createRadialGradient(x, y, 0, x, y, 0.4);
    rg.addColorStop(0, "rgba(104,120,150," + a + ")");
    rg.addColorStop(1, "rgba(104,120,150,0)");
    g.fillStyle = rg;
    g.save();
    g.translate(x, y);
    g.scale(1, 0.08);
    g.translate(-x, -y);
    g.fillRect(x - 0.4, y - 0.4, 0.8, 0.8);
    g.restore();
  }
}
g.fillStyle = "#131c2f";
for (let i = 0; i < 900; i++) {
  const x = -60 + e.rnd() * 140;
  const h = 0.05 + Math.pow(e.rnd(), 2.6) * 0.4;
  const ph = e.rnd() * 6.28;
  const l = (e.rnd() - 0.5) * 0.6 + 0.08 * Math.sin(e.t * 0.4 + ph + x * 0.1) + 0.04 * Math.sin(e.t * 0.97 + ph);
  const y0 = -cr(x) + 0.04 + e.rnd() * 0.08;
  g.beginPath();
  g.moveTo(x - 0.018, y0);
  g.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.008, y0 - h * 0.5, x + 0.018, y0);
  g.fill();
}
