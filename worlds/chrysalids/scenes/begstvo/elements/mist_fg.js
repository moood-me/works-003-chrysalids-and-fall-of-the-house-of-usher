const S = e.state || {};
const m = S.mist ?? 0.65;
if (m <= 0.01) return;
for (let i = 0; i < 8; i++) {
  const y = 0.2 - e.rnd() * 0.9;
  const sp = 0.04 + e.rnd() * 0.06;
  const base = e.rnd() * 80;
  const off = ((((e.t * sp * (i % 2 ? -1 : 1) + base) % 80) + 80) % 80) - 40;
  const rw = 4 + e.rnd() * 7;
  const gr = g.createRadialGradient(off, y, 0, off, y, rw);
  gr.addColorStop(0, "rgba(120,136,168," + 0.16 * m + ")");
  gr.addColorStop(1, "rgba(120,136,168,0)");
  g.save();
  g.translate(off, y);
  g.scale(1, 0.06);
  g.translate(-off, -y);
  g.fillStyle = gr;
  g.fillRect(off - rw, y - rw, rw * 2, rw * 2);
  g.restore();
}
