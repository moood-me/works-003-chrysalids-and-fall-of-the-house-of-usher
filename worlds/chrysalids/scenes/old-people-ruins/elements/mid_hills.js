const R = (x) =>
  4 +
  15 * Math.exp(-Math.pow((x + 150) / 80, 2)) +
  10 * Math.exp(-Math.pow((x - 140) / 70, 2)) +
  1.5 * Math.sin(x * 0.05) +
  0.8 * Math.sin(x * 0.13 + 1);
let gr = g.createLinearGradient(0, -20, 0, 12);
gr.addColorStop(0, "#9ca78e");
gr.addColorStop(1, "#8a967c");
g.fillStyle = gr;
g.beginPath();
g.moveTo(-320, 14);
for (let x = -320; x <= 320; x += 2) g.lineTo(x, -R(x));
g.lineTo(320, 14);
g.closePath();
g.fill();
for (let i = 0; i < 60; i++) {
  const x = -300 + e.rnd() * 600,
    y = -R(x) * e.rnd() + 2,
    r = 8 + e.rnd() * 20;
  const pg = g.createRadialGradient(x, y, 0, x, y, r);
  pg.addColorStop(0, e.rnd() < 0.5 ? "rgba(214,210,176,0.12)" : "rgba(96,110,84,0.12)");
  pg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = pg;
  g.save();
  g.translate(x, y);
  g.scale(2.2, 0.5);
  g.translate(-x, -y);
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
  g.restore();
}
const TC = ["#7f8d73", "#87957a", "#76846b", "#929f85"];
for (let x = -320; x < 320; x += 2 + e.rnd() * 7) {
  if (e.rnd() > 0.55) continue;
  const y = -R(x) + 0.8;
  const n = 6 + Math.floor(e.rnd() * 8);
  const w = 1.2 + e.rnd() * 3,
    hh = 0.9 + e.rnd() * 1.6;
  for (let k = 0; k < n; k++) {
    const u = e.rnd(),
      v = e.rnd();
    const cx = x + (u - 0.5) * w * 1.6,
      cy = y - hh * v * (1 - Math.abs(u - 0.5));
    const r = 0.35 + e.rnd() * 0.6;
    g.fillStyle = TC[v > 0.6 && u < 0.5 ? 3 : Math.floor(e.rnd() * 3)];
    g.beginPath();
    g.ellipse(cx, cy, r * 1.2, r * 0.9, 0, 0, 7);
    g.fill();
  }
}
