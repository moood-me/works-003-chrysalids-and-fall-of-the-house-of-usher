const X = (d) => (d < 12 ? -0.6 + 2.0 * (d / 12) : 1.4 + 1.2 * Math.sin((d - 12) / 12));
g.fillStyle = "#1b2436";
g.fillRect(-40, -6.2, 80, 12.4);
const vx = 1.4;
const toFar = (x0, v) => x0 + (vx - x0) * 0.22 * v;
for (let x0 = -40; x0 < 40; x0 += 0.8) {
  if (Math.abs(x0 + 0.6) < 0.5) continue;
  const tone = e.rnd();
  const w = 0.22 + e.rnd() * 0.14;
  const pts = [];
  for (let s = 0; s <= 12; s++) {
    const v = s / 12;
    const y = 6.2 - v * 12.4;
    const xc = toFar(x0, v) + 0.05 * Math.sin(v * 7 + x0) + 0.03 * Math.sin(v * 17 + x0 * 3);
    pts.push([xc, y]);
  }
  const ww = w * (1 - 0.18);
  g.fillStyle = tone < 0.5 ? "rgba(40,52,76," + (0.35 + tone * 0.4) + ")" : "rgba(34,44,66," + (0.3 + tone * 0.3) + ")";
  g.beginPath();
  pts.forEach((p, i) => {
    const ww2 = ww * (1 - (0.25 * i) / 12);
    i ? g.lineTo(p[0] - ww2, p[1]) : g.moveTo(p[0] - ww2, p[1]);
  });
  for (let i = pts.length - 1; i >= 0; i--) {
    const ww2 = ww * (1 - (0.25 * i) / 12);
    g.lineTo(pts[i][0] + ww2, pts[i][1]);
  }
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(96,112,146," + (0.05 + 0.07 * tone) + ")";
  g.lineWidth = 0.06;
  g.beginPath();
  pts.forEach((p, i) => {
    const ww2 = ww * (1 - (0.25 * i) / 12);
    i ? g.lineTo(p[0] - ww2, p[1]) : g.moveTo(p[0] - ww2, p[1]);
  });
  g.stroke();
  g.fillStyle = "rgba(14,20,32," + (0.12 + 0.12 * e.rnd()) + ")";
  g.beginPath();
  pts.forEach((p, i) => {
    const o = ww * (1 - (0.25 * i) / 12) + 0.22;
    i ? g.lineTo(p[0] + o, p[1]) : g.moveTo(p[0] + o, p[1]);
  });
  for (let i = pts.length - 1; i >= 0; i--) {
    const o = ww * (1 - (0.25 * i) / 12) + 0.06;
    g.lineTo(pts[i][0] + o, pts[i][1]);
  }
  g.closePath();
  g.fill();
}
for (let i = 0; i < 10; i++) {
  const cx = -30 + e.rnd() * 60,
    cy = -6 + e.rnd() * 12,
    r = 3 + e.rnd() * 6;
  const pg = g.createRadialGradient(cx, cy, 0, cx, cy, r);
  const dk = e.rnd() < 0.5;
  pg.addColorStop(0, dk ? "rgba(12,18,30,0.22)" : "rgba(70,84,116,0.08)");
  pg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = pg;
  g.fillRect(cx - r, cy - r, r * 2, r * 2);
}
const hg = g.createLinearGradient(0, -6.2, 0, -4.5);
hg.addColorStop(0, "rgba(22,30,46,0.9)");
hg.addColorStop(1, "rgba(22,30,46,0)");
g.fillStyle = hg;
g.fillRect(-40, -6.2, 80, 1.7);
const L = [],
  R = [],
  C = [];
for (let d = 0; d <= 12.4; d += 0.3) {
  const w = 0.4 + 0.06 * Math.sin(d * 1.7) + 0.04 * Math.sin(d * 4.3);
  L.push([X(d) - w, 6 - d]);
  R.push([X(d) + w, 6 - d]);
  C.push([X(d) + 0.05 * Math.sin(d * 2.3), 6 - d]);
}
const pg = g.createLinearGradient(0, 6, 0, -6);
pg.addColorStop(0, "#48546c");
pg.addColorStop(1, "#3c4862");
g.fillStyle = pg;
g.beginPath();
g.moveTo(L[0][0], L[0][1]);
for (const q of L) g.lineTo(q[0], q[1]);
for (let i = R.length - 1; i >= 0; i--) g.lineTo(R[i][0], R[i][1]);
g.closePath();
g.fill();
g.strokeStyle = "rgba(130,144,174,0.2)";
g.lineWidth = 0.32;
g.lineCap = "round";
g.beginPath();
C.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])));
g.stroke();
for (let i = 0; i < 14; i++) {
  const d = e.rnd() * 12;
  const q = X(d) + (e.rnd() - 0.5) * 0.6;
  g.fillStyle = "rgba(30,38,56,0.6)";
  g.beginPath();
  g.ellipse(q, 6 - d, 0.05 + e.rnd() * 0.06, 0.03, 0, 0, 7);
  g.fill();
}
