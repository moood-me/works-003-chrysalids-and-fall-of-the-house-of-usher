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
g.fillStyle = "#b0b6a7";
g.beginPath();
g.moveTo(-1700, 40);
for (let x = -1700; x <= 1700; x += 20) g.lineTo(x, -R2(x));
g.lineTo(1700, 40);
g.closePath();
g.fill();
// the bell (far_hills.animate.js: `bell`): two soft rings spreading from the belfry, and a flock of birds rising and
// wheeling over it — layers; the belfry's point `belfry` (the children look round to it)
const BX = CX - 2, BY = CY - 30;
e.at(BX, BY, 'belfry');
for (let i = 0; i < 2; i++) e.layer('ring' + i, { pivot: [BX, BY], box: [BX - 70, BY - 70, BX + 70, BY + 70] }, q => {
  const rg = q.createRadialGradient(BX, BY, 46, BX, BY, 66);
  rg.addColorStop(0, 'rgba(250,240,220,0)');
  rg.addColorStop(0.75, 'rgba(250,240,220,0.22)');
  rg.addColorStop(1, 'rgba(250,240,220,0)');
  q.fillStyle = rg;
  q.beginPath(); q.arc(BX, BY, 66, 0, 7); q.fill();
});
for (let i = 0; i < 7; i++) e.layer('bird' + i, { pivot: [BX, BY - 12], box: [BX - 4, BY - 16, BX + 4, BY - 8] }, q => {
  const x = BX, y = BY - 12;
  q.fillStyle = 'rgba(120,124,112,0.9)';
  q.beginPath();
  q.moveTo(x - 3, y - 1.2); q.quadraticCurveTo(x - 1.2, y - 0.5, x, y + 0.6); q.quadraticCurveTo(x + 1.2, y - 0.5, x + 3, y - 1.2);
  q.quadraticCurveTo(x + 1.2, y + 0.4, x, y + 1.2); q.quadraticCurveTo(x - 1.2, y + 0.4, x - 3, y - 1.2);
  q.fill();
});
