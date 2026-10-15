const S = e.state || {};
const w = typeof S.fall === "number" ? S.fall : 0;
if (w < 0.01) return;
for (let i = 0; i < 40; i++) {
  const x0 = -13 + e.rnd() * 26,
    sp = 0.04 + e.rnd() * 0.05,
    ph = e.rnd(),
    len = 0.5 + e.rnd() * 1.2;
  const f = (ph + e.t * sp * 0.5) % 1;
  const y = -8 + f * 9;
  const x = x0 + 0.6 * Math.sin(e.t * 0.15 + i) - f * 1.6;
  const a = w * 0.4 * Math.sin(f * 3.14);
  g.strokeStyle = "rgba(242,234,230," + a * 0.5 + ")";
  g.lineWidth = 0.008;
  g.beginPath();
  g.moveTo(x, y - len);
  g.quadraticCurveTo(x + 0.15 * Math.sin(e.t * 0.4 + i), y - len * 0.5, x, y);
  g.stroke();
  const tw = Math.max(0, Math.sin(e.t * 1.2 + i * 2.3));
  g.fillStyle = "rgba(252,244,234," + a * tw + ")";
  g.beginPath();
  g.arc(x, y, 0.02, 0, 7);
  g.fill();
}
