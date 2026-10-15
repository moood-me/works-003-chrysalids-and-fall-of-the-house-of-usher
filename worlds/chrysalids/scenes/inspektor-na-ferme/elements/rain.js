const r = (e.state || {}).rain ?? 0;
if (r < 0.02) return;
const t = e.t;
g.strokeStyle = "rgba(206,208,212," + 0.18 * r + ")";
g.lineWidth = 0.006;
g.beginPath();
const N = Math.round(280 * r);
for (let i = 0; i < 280; i++) {
  const x0 = e.rnd() * 12 - 6,
    y0 = e.rnd() * 4.5,
    sp = 5.5 + e.rnd() * 2.5;
  if (i >= N) continue;
  const y = ((y0 + t * sp) % 4.5) - 4.2;
  const x = x0 - y * 0.1;
  g.moveTo(x, y);
  g.lineTo(x - 0.025, y + 0.22);
}
g.stroke();
