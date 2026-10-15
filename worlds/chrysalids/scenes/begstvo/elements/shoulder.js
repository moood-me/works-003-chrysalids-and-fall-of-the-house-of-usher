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
// ── the near shoulder of the ridge right of x 2: painted a step nearer than the riders (scaled to lie exactly on the hill), so whoever takes the track down the far side sinks behind it
const k = 8.85 / 9;
g.translate(0, (k - 1) * 1.7);
g.scale(k, k);
const X0 = 2;
const gr = g.createLinearGradient(0, -1.4, 0, 0.3);
gr.addColorStop(0, "#24324c");
gr.addColorStop(0.25, "#1b273d");
gr.addColorStop(1, "#131b2d");
const prof = () => {
  g.beginPath();
  g.moveTo(X0, 0.4);
  for (let x = X0; x <= 80; x += 0.2) g.lineTo(x, -cr(x));
  g.lineTo(80, 0.4);
  g.closePath();
};
g.fillStyle = gr;
for (let j = 0; j < 24; j++) {
  g.save();
  g.beginPath();
  g.rect(X0 + j * 0.125, -4, j < 23 ? 0.125 : 80, 5);
  g.clip();
  g.globalAlpha = (j + 1) / 24;
  prof();
  g.fill();
  g.restore();
}
for (let i = 0; i < 40; i++) {
  const x = X0 + 1 + e.rnd() * 40,
    y = -cr(x) + 0.3 + e.rnd() * 0.8;
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
g.fillStyle = "#131c2f";
for (let i = 0; i < 420; i++) {
  const x = X0 + e.rnd() * 50;
  const h = 0.05 + Math.pow(e.rnd(), 2.6) * 0.45;
  const ph = e.rnd() * 6.28;
  const l = (e.rnd() - 0.5) * 0.6 + 0.08 * Math.sin(e.t * 0.4 + ph + x * 0.1) + 0.04 * Math.sin(e.t * 0.97 + ph);
  const y0 = -cr(x) + 0.04 + e.rnd() * 0.08;
  g.beginPath();
  g.moveTo(x - 0.018, y0);
  g.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.008, y0 - h * 0.5, x + 0.018, y0);
  g.fill();
}
