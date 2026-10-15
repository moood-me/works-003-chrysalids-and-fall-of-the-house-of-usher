const S = e.state || {};
const p = S.pursuers ?? 0.25;
const R = (x) => {
  let r =
    12 +
    70 * Math.exp(-Math.pow((x + 820) / 380, 2)) +
    30 * Math.exp(-Math.pow((x + 1500) / 300, 2)) +
    6 * Math.sin(x * 0.0045) +
    4 * Math.sin(x * 0.013);
  if (x > -200) r *= Math.max(0.25, 1 - (x + 200) / 1200);
  return r;
};
const N = Math.round(3 + 11 * p);
for (let j = 0; j < N; j++) {
  const u = N > 1 ? j / (N - 1) : 0.5;
  const jit = (e.rnd() - 0.5) * 40;
  let x = -1100 + u * (180 + 520 * p) + p * 380 + jit + 10 * Math.sin(e.t * 0.04 + j * 1.3);
  const y = -R(x) - 3.5 + 1.2 * Math.sin(e.t * 1.3 + j * 1.7);
  const f = 0.75 + 0.25 * Math.sin(e.t * 2.1 + j * 2.1) * Math.sin(e.t * 0.9 + j);
  const r = (10 + 12 * p) * f;
  const gg = g.createRadialGradient(x, y, 0, x, y, r);
  gg.addColorStop(0, "rgba(220,170,100," + 0.7 * f + ")");
  gg.addColorStop(0.3, "rgba(196,146,88," + 0.22 * f + ")");
  gg.addColorStop(1, "rgba(196,146,88,0)");
  g.fillStyle = gg;
  g.beginPath();
  g.arc(x, y, r, 0, 7);
  g.fill();
  g.fillStyle = "rgba(236,204,148," + 0.9 * f + ")";
  g.beginPath();
  g.arc(x, y, 1.8 + 1.2 * p, 0, 7);
  g.fill();
}
