const S = e.state || {};
const sm = S.smoke ?? 0.5;
if (sm < 0.01) return;
const cols = [
  [-60, 0.2],
  [35, 0.35],
  [95, 0.18],
];
for (let c = 0; c < cols.length; c++) {
  const bx = cols[c][0];
  for (let k = 0; k < 9; k++) {
    const f = (k / 9 + e.t * 0.008 * (1 + c * 0.3)) % 1;
    const x = bx + f * f * 30 + 6 * Math.sin(e.t * 0.1 + k + c);
    const y = -2 - f * 34;
    const r = 4 + f * 14;
    const a = sm * cols[c][1] * Math.sin(f * 3.14) * 0.5;
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, "rgba(150,138,150," + a + ")");
    rg.addColorStop(1, "rgba(150,138,150,0)");
    g.fillStyle = rg;
    g.beginPath();
    g.arc(x, y, r, 0, 7);
    g.fill();
  }
}
for (let i = 0; i < 5; i++) {
  const y = -1 - i * 1.6;
  const off = ((((e.t * 0.4 * (i % 2 ? 1 : -1) + i * 90) % 400) + 400) % 400) - 200;
  const rg = g.createRadialGradient(off, y, 0, off, y, 80);
  rg.addColorStop(0, "rgba(170,152,162," + 0.25 * sm + ")");
  rg.addColorStop(1, "rgba(170,152,162,0)");
  g.save();
  g.translate(off, y);
  g.scale(1, 0.06);
  g.translate(-off, -y);
  g.fillStyle = rg;
  g.fillRect(off - 80, y - 80, 160, 160);
  g.restore();
}
