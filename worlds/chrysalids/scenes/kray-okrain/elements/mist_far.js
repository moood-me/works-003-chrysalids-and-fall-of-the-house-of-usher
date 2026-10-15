const S = e.state || {};
const m = S.mist ?? 0.6;
if (m <= 0.01) return;
for (let i = 0; i < 7; i++) {
  const y = -0.3 - i * 0.7 - e.rnd() * 0.4;
  const sp = 0.15 + e.rnd() * 0.2;
  const base = e.rnd() * 320;
  for (let k = 0; k < 3; k++) {
    const off = ((((e.t * sp * (i % 2 ? 1 : -1) + base + k * 110) % 330) + 330) % 330) - 165;
    const rw = 40 + e.rnd() * 45;
    const gr = g.createRadialGradient(off, y, 0, off, y, rw);
    const a = m * (0.24 - i * 0.026);
    gr.addColorStop(0, "rgba(140,155,185," + a + ")");
    gr.addColorStop(1, "rgba(140,155,185,0)");
    g.save();
    g.translate(off, y);
    g.scale(1, 0.035 + i * 0.004);
    g.translate(-off, -y);
    g.fillStyle = gr;
    g.fillRect(off - rw, y - rw, rw * 2, rw * 2);
    g.restore();
  }
}
