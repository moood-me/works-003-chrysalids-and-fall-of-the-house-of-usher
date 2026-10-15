const X = (d) => (d < 12 ? -0.6 + 2.0 * (d / 12) : 1.4 + 1.2 * Math.sin((d - 12) / 12));
g.fillStyle = "#161e2e";
g.fillRect(-100, -38.2, 200, 76.4);
for (let i = 0; i < 90; i++) {
  const x = -100 + e.rnd() * 200,
    y = -38 + e.rnd() * 76;
  g.fillStyle = e.rnd() < 0.5 ? "#1a2335" : "#111829";
  g.beginPath();
  g.ellipse(x, y, 1 + e.rnd() * 4, 0.6 + e.rnd() * 2, e.rnd() * 3, 0, 7);
  g.fill();
}
const L = [],
  R = [];
for (let d = 11.8; d <= 60; d += 0.4) {
  const w = 0.38 + 0.08 * Math.sin(d * 1.7) + 0.05 * Math.sin(d * 4.3);
  L.push([X(d) - w, 50 - d]);
  R.push([X(d) + w, 50 - d]);
}
const pg = g.createLinearGradient(0, 38, 0, 0);
pg.addColorStop(0, "#3a4660");
pg.addColorStop(1, "#161e2e");
g.fillStyle = pg;
g.beginPath();
g.moveTo(L[0][0], L[0][1]);
for (const q of L) g.lineTo(q[0], q[1]);
for (let i = R.length - 1; i >= 0; i--) g.lineTo(R[i][0], R[i][1]);
g.closePath();
g.fill();
