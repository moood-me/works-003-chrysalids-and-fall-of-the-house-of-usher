const S = e.state || {};
const m = S.mist ?? 0.65,
  d = S.dawn ?? 0.3;
if (m <= 0.01) return;
let gr = g.createLinearGradient(0, -5, 0, 0.5);
gr.addColorStop(0, "rgba(90,106,136,0)");
gr.addColorStop(0.7, "rgba(96,112,142," + 0.3 * m + ")");
gr.addColorStop(1, "rgba(104,120,148," + 0.45 * m + ")");
g.fillStyle = gr;
g.fillRect(-160, -5, 320, 5.5);
for (let i = 0; i < 9; i++) {
  const y = -0.3 - e.rnd() * 3.2;
  const sp = 0.1 + e.rnd() * 0.15;
  const base = e.rnd() * 320;
  const off = ((((e.t * sp * (i % 2 ? 1 : -1) + base) % 320) + 320) % 320) - 160;
  const rw = 25 + e.rnd() * 35;
  const warm = Math.max(0, 1 - Math.abs(off - 20) / 80) * d;
  const lg = g.createRadialGradient(off, y, 0, off, y, rw);
  lg.addColorStop(
    0,
    "rgba(" +
      Math.round(130 + 50 * warm) +
      "," +
      Math.round(144 + 36 * warm) +
      "," +
      Math.round(172 - 4 * warm) +
      "," +
      0.22 * m +
      ")",
  );
  lg.addColorStop(1, "rgba(130,144,172,0)");
  g.save();
  g.translate(off, y);
  g.scale(1, 0.06);
  g.translate(-off, -y);
  g.fillStyle = lg;
  g.fillRect(off - rw, y - rw, rw * 2, rw * 2);
  g.restore();
}
