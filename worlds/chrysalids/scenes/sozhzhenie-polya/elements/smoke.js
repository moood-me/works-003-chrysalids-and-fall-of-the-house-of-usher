const { rgba, X0 } = e.lib;
const { st, T, DAWN, IGN, FL } = e.lib.now(e);
// smoke over the burning field, drifting left on the morning wind (painted at 35 m)
const SM = st("smoke", 0);
if (SM <= 0.005) return;
const R1 = Math.min(IGN * 45, 40),
  lo = Math.max(-3, X0 - R1),
  hi = X0 + R1;
for (let i = 0; i < 120; i++) {
  const r0 = e.rnd(),
    r1 = e.rnd(),
    r2 = e.rnd(),
    r3 = e.rnd();
  const p = (r0 + T * 0.004 * (0.7 + r3 * 0.6)) % 1;
  const src = (lo + (hi - lo) * r1) * 2.4;
  const y = -1.5 - p * 95;
  const x = src - p * p * 80 - p * 14 + Math.sin(T * 0.09 + i * 0.7) * 2.5 * p;
  const rad = 2.5 + p * 22 + r2 * 5;
  const fade = Math.min(1, p * 5) * Math.pow(1 - p, 1.2);
  const a = SM * 0.5 * fade * (0.5 + 0.5 * r2);
  const lit = Math.max(0, 1 - p * 1.6) * FL;
  const R = (52 + 150 * lit + 70 * DAWN) | 0,
    G = (46 + 70 * lit + 66 * DAWN) | 0,
    B = (52 + 24 * lit + 66 * DAWN) | 0;
  const rg = g.createRadialGradient(x, y, 0, x, y, rad);
  rg.addColorStop(0, "rgba(" + R + "," + G + "," + B + "," + a + ")");
  rg.addColorStop(0.6, "rgba(" + R + "," + G + "," + B + "," + a * 0.5 + ")");
  rg.addColorStop(1, "rgba(" + R + "," + G + "," + B + ",0)");
  g.fillStyle = rg;
  g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
}
