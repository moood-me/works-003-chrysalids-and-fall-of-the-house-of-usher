const S = e.state || {};
const f = S.fire ?? 0.8;
const st = S.story ?? 0.7;
const t = e.t;
for (let i = 0; i < 44; i++) {
  const r1 = e.rnd(),
    r2 = e.rnd(),
    r3 = e.rnd();
  const life = 40 + r1 * 30;
  const p = (t / life + r2) % 1;
  const y = -0.6 - p * 3.2 - p * p * 3.5 + (r3 - 0.5) * p * 1.2;
  const x =
    0.12 * Math.sin(t * 0.3 + i) +
    p * 1.5 +
    p * p * 11 +
    (r3 - 0.5) * p * 1.5 +
    0.4 * Math.sin(t * 0.05 + i + p * 3) * p;
  const r = 0.2 + p * 2;
  const a = (p < 0.08 ? p / 0.08 : 1) * (1 - p) * 0.1 * (0.3 + 0.7 * f) * (0.7 + 0.5 * st);
  const warm = Math.max(0, 1 - p * 6);
  const gg = g.createRadialGradient(x, y, 0, x, y, r);
  gg.addColorStop(
    0,
    "rgba(" +
      Math.round(150 + 60 * warm) +
      "," +
      Math.round(160 - 20 * warm) +
      "," +
      Math.round(188 - 80 * warm) +
      "," +
      a +
      ")",
  );
  gg.addColorStop(1, "rgba(150,160,188,0)");
  g.fillStyle = gg;
  g.save();
  g.translate(x, y);
  g.scale(1, 0.55);
  g.translate(-x, -y);
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
  g.restore();
}
