const S = e.state || {};
const b = S.bell ?? 0;
for (let i = 0; i < 5; i++) {
  const per = 17 + i * 3.7;
  const p = (e.t / per + i * 0.31) % 1;
  const x = -16 + 32 * p;
  const y =
    -4.6 +
    0.7 * Math.sin(p * Math.PI * 2 + i) +
    0.25 * Math.sin(e.t * 0.7 + i * 2) -
    i * 0.25 -
    b * 1.5 * Math.sin(p * Math.PI);
  const a = Math.min(1, (1 - Math.abs(2 * p - 1)) * 5);
  if (a <= 0) continue;
  const f = Math.sin(e.t * (5.5 + i * 0.6) + i * 2);
  const glide = Math.sin(e.t * 0.4 + i) > 0.3;
  const w = glide ? 0.15 : f;
  const sz = 0.32;
  g.globalAlpha = 0.85 * a;
  g.fillStyle = "#4c4e47";
  g.save();
  g.translate(x, y);
  g.beginPath();
  g.ellipse(0, 0, sz * 0.32, sz * 0.09, 0, 0, 7);
  g.fill();
  for (const d of [-1, 1]) {
    g.beginPath();
    g.moveTo(0.02, -0.02);
    g.quadraticCurveTo(d * sz * 0.18 - 0.02, -sz * 0.25 * w - 0.05, d * sz * 0.95, -sz * 0.55 * w + 0.02);
    g.quadraticCurveTo(d * sz * 0.4, -sz * 0.12 * w + 0.03, 0.06, 0.03);
    g.closePath();
    g.fill();
  }
  g.beginPath();
  g.moveTo(-sz * 0.3, 0);
  g.lineTo(-sz * 0.55, -0.05);
  g.lineTo(-sz * 0.52, 0.06);
  g.closePath();
  g.fill();
  g.restore();
}
g.globalAlpha = 1;
