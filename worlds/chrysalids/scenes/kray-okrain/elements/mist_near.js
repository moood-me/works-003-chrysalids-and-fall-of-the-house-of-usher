const S = e.state || {};
const m = S.mist ?? 0.6;
if (m <= 0.01) return;
for (let i = 0; i < 4; i++) {
  const y = -0.1 - i * 0.3;
  const sp = 0.08 + e.rnd() * 0.1;
  const base = e.rnd() * 120;
  for (let k = 0; k < 3; k++) {
    const off = ((((e.t * sp * (i % 2 ? -1 : 1) + base + k * 40) % 120) + 120) % 120) - 60;
    const rw = 12 + e.rnd() * 12;
    const gr = g.createRadialGradient(off, y, 0, off, y, rw);
    const a = m * (0.12 - i * 0.025);
    gr.addColorStop(0, "rgba(145,160,190," + a + ")");
    gr.addColorStop(1, "rgba(145,160,190,0)");
    g.save();
    g.translate(off, y);
    g.scale(1, 0.03);
    g.translate(-off, -y);
    g.fillStyle = gr;
    g.fillRect(off - rw, y - rw, rw * 2, rw * 2);
    g.restore();
  }
}
