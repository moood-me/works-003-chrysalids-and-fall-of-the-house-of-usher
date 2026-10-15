const S = e.state || {};
const f = S.fire ?? 0.7;
const fl = 0.85 + 0.1 * Math.sin(e.t * 2.3) + 0.05 * Math.sin(e.t * 5.1 + 1);
const F = f * fl;
g.fillStyle = "#16110e";
g.fillRect(-9, -3.7, 18, 7.4);
for (let i = 0; i < 26; i++) {
  const x = -9 + e.rnd() * 18,
    y = -3.7 + e.rnd() * 7.4,
    r = 0.6 + e.rnd() * 1.4;
  const dk = e.rnd() < 0.5;
  const rg = g.createRadialGradient(x, y, 0, x, y, r);
  rg.addColorStop(0, dk ? "rgba(6,5,4,0.35)" : "rgba(40,30,22,0.3)");
  rg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = rg;
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
}
for (let i = 0; i < 50; i++) {
  const x = -9 + e.rnd() * 18,
    y = -3.7 + e.rnd() * 7.4;
  g.fillStyle = "rgba(10,8,6,0.4)";
  g.beginPath();
  g.ellipse(x, y, 0.04 + e.rnd() * 0.06, 0.03, 0, 0, 7);
  g.fill();
}
let mg = g.createLinearGradient(0, -3, 0, 2.5);
mg.addColorStop(0, "rgba(64,80,118,0.3)");
mg.addColorStop(1, "rgba(60,76,112,0)");
g.fillStyle = mg;
const ed = Math.min(5.0, 0.9 + 3.55 * (S.door ?? 1));
g.beginPath();
g.moveTo(0.9, -3);
g.lineTo(ed, -3);
g.lineTo(1.4 + (ed - 0.9) * 1.56, 2.5);
g.lineTo(1.4, 2.5);
g.closePath();
g.fill();
const so = S.st_on ?? 0;
if (so > 0.01) {
  const lx = Math.min(ed - 0.3, Math.max(1.1, ((S.st_a ?? 2) * 7.5) / 8.4));
  const lg = g.createRadialGradient(lx, -3, 0, lx, -3, 2.4);
  lg.addColorStop(0, "rgba(220,160,90," + 0.22 * so + ")");
  lg.addColorStop(1, "rgba(220,160,90,0)");
  g.fillStyle = lg;
  g.beginPath();
  g.moveTo(0.9, -3);
  g.lineTo(ed, -3);
  g.lineTo(1.4 + (ed - 0.9) * 1.56, 2.5);
  g.lineTo(1.4, 2.5);
  g.closePath();
  g.fill();
}
let fg = g.createRadialGradient(-3.8, -2, 0, -3.8, -2, 6);
fg.addColorStop(0, "rgba(200,100,48," + 0.42 * F + ")");
fg.addColorStop(0.4, "rgba(140,66,32," + 0.2 * F + ")");
fg.addColorStop(1, "rgba(80,40,20,0)");
g.fillStyle = fg;
g.fillRect(-9, -3.7, 18, 7.4);
