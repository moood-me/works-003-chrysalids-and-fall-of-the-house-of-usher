const R = e.state.rain ?? 0.5;
for (let i = 0; i < 12; i++) {
  const W = 400;
  const cx = ((e.rnd() * W + e.t * 0.25 * (0.5 + e.rnd())) % W) - 200,
    cy = -0.3 - e.rnd() * 3.5,
    w = 20 + e.rnd() * 50,
    h = 0.5 + e.rnd() * 1.2;
  const a = (0.12 + R * 0.18) * (0.6 + e.rnd() * 0.4);
  g.save();
  g.translate(cx, cy);
  g.scale(1, h / w);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, w);
  rg.addColorStop(0, "rgba(196,200,194," + a + ")");
  rg.addColorStop(1, "rgba(196,200,194,0)");
  g.fillStyle = rg;
  g.fillRect(-w, -w, 2 * w, 2 * w);
  g.restore();
}
