const L = e.state.lamp === true ? 1 : Math.max(0, Math.min(1, +e.state.lamp || 0));
if (L < 0.02) return;
const t = e.t;
for (let i = 0; i < 45; i++) {
  const a = e.rnd(),
    b = e.rnd(),
    c = e.rnd(),
    ph = e.rnd() * 6.28;
  const x = (a - 0.5) * 3.0 + 0.12 * Math.sin(t * 0.13 * (0.5 + c) + ph);
  const y = -0.9 - ((b + t * 0.01 * (0.5 + c)) % 1) * 2.2;
  const d = Math.hypot(x, y + 1.05);
  const al = L * 0.5 * Math.max(0, 1 - d / 1.6) * (0.6 + 0.4 * Math.sin(t * 0.7 + ph));
  if (al <= 0) continue;
  g.fillStyle = "rgba(255,215,165," + al + ")";
  g.beginPath();
  g.arc(x, y, 0.005 + c * 0.006, 0, 7);
  g.fill();
}
