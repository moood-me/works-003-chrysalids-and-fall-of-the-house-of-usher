const S = e.state || {},
  b = S.bell ?? 0;
const R1 = (x) =>
  55 + 35 * Math.exp(-Math.pow((x + 500) / 350, 2)) + 18 * Math.sin(x * 0.0035 + 1) + 8 * Math.sin(x * 0.011);
const R2 = (x) =>
  22 + 20 * Math.exp(-Math.pow((x - 420) / 300, 2)) + 9 * Math.sin(x * 0.006 + 2) + 4 * Math.sin(x * 0.017);
g.fillStyle = "#bfc3b6";
g.beginPath();
g.moveTo(-1700, 40);
for (let x = -1700; x <= 1700; x += 20) g.lineTo(x, -R1(x));
g.lineTo(1700, 40);
g.closePath();
g.fill();
g.fillStyle = "#b5baab";
for (let x = -1600; x < 1600; x += 10 + e.rnd() * 26) {
  const y = -R1(x) + 1.5;
  g.beginPath();
  g.ellipse(x, y, 5 + e.rnd() * 9, 3 + e.rnd() * 4, 0, Math.PI, 0);
  g.fill();
}
const CX = -140,
  CY = -R1(CX) + 3;
g.fillStyle = "#a9aea0";
g.fillRect(CX + 2, CY - 9, 22, 9);
g.beginPath();
g.moveTo(CX + 1, CY - 9);
g.lineTo(CX + 13, CY - 15);
g.lineTo(CX + 25, CY - 9);
g.closePath();
g.fill();
g.fillRect(CX - 6, CY - 24, 8, 24);
g.beginPath();
g.moveTo(CX - 6.5, CY - 24);
g.lineTo(CX - 2, CY - 38);
g.lineTo(CX + 2.5, CY - 24);
g.closePath();
g.fill();
for (let i = 0; i < 7; i++) {
  const hx = CX + 30 + i * 16 + e.rnd() * 8,
    hw = 7 + e.rnd() * 6,
    hh = 5 + e.rnd() * 3;
  const hy = -R1(hx) + 3;
  g.fillRect(hx, hy - hh, hw, hh);
  g.beginPath();
  g.moveTo(hx - 1, hy - hh);
  g.lineTo(hx + hw / 2, hy - hh - 4);
  g.lineTo(hx + hw + 1, hy - hh);
  g.closePath();
  g.fill();
}
for (let i = 0; i < 9; i++) {
  const tx = CX - 60 + e.rnd() * 220;
  const ty = -R1(tx) + 3;
  g.fillStyle = "#a6ac9c";
  g.beginPath();
  g.ellipse(tx, ty - 6, 5 + e.rnd() * 4, 7 + e.rnd() * 4, 0, 0, 7);
  g.fill();
}
if (b > 0.01) {
  const bx = CX - 2,
    by = CY - 30;
  for (let i = 0; i < 2; i++) {
    const a = (e.t * 0.22 + i / 2) % 1;
    const r = 6 + a * 60;
    const al = b * 0.22 * (1 - a) * Math.min(1, a * 6);
    const rg = g.createRadialGradient(bx, by, r * 0.7, bx, by, r);
    rg.addColorStop(0, "rgba(250,240,220,0)");
    rg.addColorStop(0.75, "rgba(250,240,220," + al + ")");
    rg.addColorStop(1, "rgba(250,240,220,0)");
    g.fillStyle = rg;
    g.beginPath();
    g.arc(bx, by, r, 0, 7);
    g.fill();
  }
  g.fillStyle = "rgba(120,124,112," + Math.min(1, b * 1.5) * 0.9 + ")";
  for (let i = 0; i < 7; i++) {
    const ph = i * 0.9;
    const ang = e.t * 0.25 + ph;
    const rad = 14 + 6 * Math.sin(i * 1.7);
    const x = bx + Math.cos(ang) * rad * (1 + i * 0.1),
      y = by - 12 - b * 18 - Math.sin(ang) * rad * 0.35 - i * 1.5;
    const w = Math.sin(e.t * 6 + i * 2);
    g.beginPath();
    g.moveTo(x - 3, y - 1.6 * w);
    g.quadraticCurveTo(x - 1.2, y - 0.5, x, y + 0.6);
    g.quadraticCurveTo(x + 1.2, y - 0.5, x + 3, y - 1.6 * w);
    g.quadraticCurveTo(x + 1.2, y + 0.4, x, y + 1.2);
    g.quadraticCurveTo(x - 1.2, y + 0.4, x - 3, y - 1.6 * w);
    g.fill();
  }
}
g.fillStyle = "#b0b6a7";
g.beginPath();
g.moveTo(-1700, 40);
for (let x = -1700; x <= 1700; x += 20) g.lineTo(x, -R2(x));
g.lineTo(1700, 40);
g.closePath();
g.fill();
