// The ridge's shoulder (8.85 m — just before the track): the same crest from x 2 on, faded in from its left end, so what goes
// down into the hollow behind it — the horses, their riders — sinks behind it, their heads still over it (relief.js lays
// the track down there)
const { cr } = e.lib, X0 = 2, k = 8.85 / 9;
g.translate(0, (k - 1) * 1.7);
g.scale(k, k);
const prof = () => { g.beginPath(); g.moveTo(X0, 0.4); for (let x = X0; x <= 80; x += 0.2) g.lineTo(x, -cr(x)); g.lineTo(80, 0.4); g.closePath(); };
g.fillStyle = '#5e6a4e';
for (let j = 0; j < 24; j++) {
  g.save();
  g.beginPath();
  g.rect(X0 + j * 0.125, -4, j < 23 ? 0.125 : 80, 5);
  g.clip();
  g.globalAlpha = (j + 1) / 24;
  prof();
  g.fill();
  g.restore();
}
g.fillStyle = '#6a7656';
for (let i = 0; i < 420; i++) {
  const x = X0 + e.rnd() * 50, h = 0.05 + Math.pow(e.rnd(), 2.6) * 0.45, l = (e.rnd() - 0.5) * 0.6, y0 = -cr(x) + 0.04 + e.rnd() * 0.08;
  g.beginPath();
  g.moveTo(x - 0.018, y0);
  g.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.008, y0 - h * 0.5, x + 0.018, y0);
  g.fill();
}
