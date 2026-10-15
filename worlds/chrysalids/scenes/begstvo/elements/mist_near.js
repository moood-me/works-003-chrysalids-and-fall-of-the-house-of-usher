const S = e.state || {};
const m = S.mist ?? 0.65;
if (m <= 0.01) return;
let bg = g.createLinearGradient(0, -1.2, 0, 0.3);
bg.addColorStop(0, "rgba(110,126,158,0)");
bg.addColorStop(0.75, "rgba(116,132,162," + 0.14 * m + ")");
bg.addColorStop(1, "rgba(116,132,162," + 0.05 * m + ")");
g.fillStyle = bg;
g.fillRect(-60, -1.2, 120, 1.5);
for (let i = 0; i < 11; i++) {
  const y = -0.05 - e.rnd() * 0.9;
  const sp = 0.05 + e.rnd() * 0.08;
  const base = e.rnd() * 120;
  for (let k = 0; k < 2; k++) {
    const off = ((((e.t * sp * (i % 2 ? -1 : 1) + base + k * 60) % 120) + 120) % 120) - 60;
    const rw = 6 + e.rnd() * 12;
    const gr = g.createRadialGradient(off, y, 0, off, y, rw);
    gr.addColorStop(0, "rgba(140,156,186," + 0.26 * m + ")");
    gr.addColorStop(1, "rgba(140,156,186,0)");
    g.save();
    g.translate(off, y);
    g.scale(1, 0.045);
    g.translate(-off, -y);
    g.fillStyle = gr;
    g.fillRect(off - rw, y - rw, rw * 2, rw * 2);
    g.restore();
  }
}
