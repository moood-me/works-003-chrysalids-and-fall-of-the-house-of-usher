// a hummock of weeds in the near left foreground (3.2 m): dark earth, thistles and dock (a layer swaying)
const yb = x => -0.35 - 0.25 * Math.exp(-Math.pow((x + 3.2) / 2.2, 2)) - 0.12 * Math.sin(x * 0.6 + 1) * Math.exp(-Math.pow((x + 2) / 4, 2));
g.fillStyle = '#4e4a3a';
g.beginPath();
g.moveTo(-9, 0.5);
for (let x = -9; x <= 1.5; x += 0.1) { const k = Math.min(1, Math.max(0, (1.5 - x) / 2.5)); g.lineTo(x, yb(x) * k + 0.2 * (1 - k)); }
g.lineTo(1.5, 0.5);
g.closePath();
g.fill();
e.layer('weeds', { pivot: [-4, 0.3], wind: { strength: 0.35, gust: 0.6 }, box: [-9, -1.2, 2, 0.5] }, q => {
  for (let i = 0; i < 220; i++) {
    const x = -8.5 + e.rnd() * 9.5, k = Math.min(1, Math.max(0, (1.5 - x) / 2.5)), y0 = yb(x) * k + 0.2 * (1 - k) + 0.03;
    const h = (0.12 + Math.pow(e.rnd(), 1.8) * 0.6) * (0.3 + 0.7 * k), l = (e.rnd() - 0.35) * 0.5;
    q.fillStyle = e.rnd() < 0.5 ? '#5e5a44' : '#6a6450';
    q.beginPath();
    q.moveTo(x - 0.012, y0);
    q.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
    q.quadraticCurveTo(x + l * h * 0.4 + 0.006, y0 - h * 0.5, x + 0.012, y0);
    q.fill();
  }
});
