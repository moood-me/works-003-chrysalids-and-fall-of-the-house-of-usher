const S = e.state || {};
const sm = S.smoke ?? 0.5;
for (let i = 0; i < 5; i++) {
  const y = -0.3 - i * 0.7;
  const sp = 0.12 + e.rnd() * 0.15;
  const base = e.rnd() * 120;
  for (let k = 0; k < 2; k++) {
    const off = ((((e.t * sp * (i % 2 ? -1 : 1) + base + k * 60) % 120) + 120) % 120) - 60;
    const rw = 14 + e.rnd() * 14;
    const rg = g.createRadialGradient(off, y, 0, off, y, rw);
    rg.addColorStop(0, "rgba(176,158,166," + sm * (0.22 - i * 0.03) + ")");
    rg.addColorStop(1, "rgba(176,158,166,0)");
    g.save();
    g.translate(off, y);
    g.scale(1, 0.05);
    g.translate(-off, -y);
    g.fillStyle = rg;
    g.fillRect(off - rw, y - rw, rw * 2, rw * 2);
    g.restore();
  }
}
