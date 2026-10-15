const A = e.aspect,
  S = e.state || {};
const w = typeof S.fall === "number" ? S.fall : 0;
if (w < 0.01) return;
for (let i = 0; i < 40; i++) {
  const x0 = A * (0.3 + e.rnd() * 0.6),
    sp = 0.01 + e.rnd() * 0.01,
    ph = e.rnd(),
    sd = e.rnd() * 6.28,
    len = 0.03 + e.rnd() * 0.07;
  const f = (ph + e.t * sp) % 1;
  const y = 0.2 + f * 0.5;
  const x = x0 + 0.03 * Math.sin(e.t * 0.12 + sd) + 0.012 * Math.sin(e.t * 0.31 + sd * 2) - f * 0.08;
  const a = w * 0.32 * Math.sin(f * 3.14);
  g.strokeStyle = "rgba(240,232,236," + a * 0.6 + ")";
  g.lineWidth = e.px * 0.8;
  g.beginPath();
  g.moveTo(x, y - len);
  g.bezierCurveTo(x + 0.01 * Math.sin(e.t * 0.4 + i), y - len * 0.6, x - 0.008, y - len * 0.3, x, y);
  g.stroke();
  const tw = Math.max(0, Math.sin(e.t * 1.0 + i * 2.3));
  g.fillStyle = "rgba(252,244,232," + a * 1.6 * tw + ")";
  g.beginPath();
  g.arc(x, y, e.px * 1.4, 0, 7);
  g.fill();
}
