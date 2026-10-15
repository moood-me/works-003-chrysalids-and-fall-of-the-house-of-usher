let bg = g.createLinearGradient(0, 32, 0, -32);
bg.addColorStop(0, "#1a2236");
bg.addColorStop(0.6, "#26304a");
bg.addColorStop(1, "#2a3552");
g.fillStyle = bg;
g.fillRect(-80, -32, 160, 64);
for (let i = 0; i < 24; i++) {
  const x = -80 + e.rnd() * 160,
    y = -32 + e.rnd() * 64,
    r = 3 + e.rnd() * 8;
  const dk = e.rnd() < 0.6;
  const rg = g.createRadialGradient(x, y, 0, x, y, r);
  rg.addColorStop(0, dk ? "rgba(14,18,30,0.35)" : "rgba(60,74,104,0.2)");
  rg.addColorStop(1, "rgba(0,0,0,0)");
  g.save();
  g.translate(x, y);
  g.scale(1, 0.4);
  g.translate(-x, -y);
  g.fillStyle = rg;
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
  g.restore();
}
const L = [],
  R = [];
for (let y = 32; y >= -32; y -= 1) {
  const d = 32 - y;
  const c = 1.6 + d * 0.35 + 1.5 * Math.sin(d * 0.08);
  const w = 1.4 * (1 - d / 90);
  L.push([c - w, y]);
  R.push([c + w, y]);
}
const pg = g.createLinearGradient(0, 32, 0, -32);
pg.addColorStop(0, "rgba(70,84,116,0.5)");
pg.addColorStop(1, "rgba(60,74,104,0.2)");
g.fillStyle = pg;
g.beginPath();
g.moveTo(L[0][0], L[0][1]);
for (const q of L) g.lineTo(q[0], q[1]);
for (let i = R.length - 1; i >= 0; i--) g.lineTo(R[i][0], R[i][1]);
g.closePath();
g.fill();
