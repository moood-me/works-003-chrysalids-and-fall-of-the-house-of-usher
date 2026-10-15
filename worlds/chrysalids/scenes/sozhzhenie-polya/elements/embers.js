const { X0 } = e.lib;
const { T, IGN, FL } = e.lib.now(e);
// sparks rising from the fire (painted at 14 m)
const n = Math.floor(70 * FL);
if (n <= 0) return;
const R1 = Math.min(IGN * 45, 30),
  lo = Math.max(-2.5, X0 - R1),
  hi = X0 + R1;
for (let i = 0; i < 70; i++) {
  const r0 = e.rnd(),
    r1 = e.rnd(),
    r2 = e.rnd();
  if (i >= n) continue;
  const sp = 0.5 + r1;
  const p = (T * sp * 0.06 + r0) % 1;
  const y = -0.5 - p * 14;
  const x = (lo + (hi - lo) * r2) * 1.3 + Math.sin(T * 0.8 + i) * 0.6 - p * p * 8;
  g.globalAlpha = (1 - p) * (0.45 + 0.55 * Math.pow(Math.sin(T * 2.7 + i * 2.1), 2));
  g.fillStyle = p < 0.35 ? "#ffc070" : "#c8643a";
  g.beginPath();
  g.arc(x, y, 0.035 + r1 * 0.03, 0, 7);
  g.fill();
}
g.globalAlpha = 1;
