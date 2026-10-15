const S = e.state || {};
const s = S.sparks ?? 0.5;
const n = Math.round(26 * s);
g.globalCompositeOperation = "lighter";
for (let i = 0; i < 26; i++) {
  const r1 = e.rnd(),
    r2 = e.rnd(),
    r3 = e.rnd();
  if (i >= n) continue;
  const life = 5 + r1 * 5;
  const p = (e.t / life + r2) % 1;
  const x = (r3 - 0.5) * 0.7 + Math.sin(e.t * 0.4 + i) * 0.25 * p + 0.6 * p * p * (r1 - 0.3);
  const y = -1.1 - p * (2.6 + r2 * 1.6);
  const a = (1 - p) * (p < 0.06 ? p / 0.06 : 1) * (0.6 + 0.4 * Math.sin(e.t * 7 + i * 3));
  const rr = 0.03 + 0.02 * r3;
  const gg = g.createRadialGradient(x, y, 0, x, y, rr * 3);
  gg.addColorStop(0, "rgba(255,200,120," + a + ")");
  gg.addColorStop(0.3, "rgba(240,130,60," + a * 0.5 + ")");
  gg.addColorStop(1, "rgba(200,80,30,0)");
  g.fillStyle = gg;
  g.beginPath();
  g.arc(x, y, rr * 3, 0, 7);
  g.fill();
}
