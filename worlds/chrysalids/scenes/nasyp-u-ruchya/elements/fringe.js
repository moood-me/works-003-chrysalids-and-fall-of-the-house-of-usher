// tall grass on the bank's top (in front of whoever stands or hides there) and along its edge, seed heads over it, a
// dense clump where someone can hide — in tufts swaying in the wind (lib.js: tufts)
const { TOPX, bankL, tufts, blade } = e.lib, d1 = '#4e5833', d2 = '#65703f', lit = '#e9dca2';
const blades = [];
for (let i = 0; i < 560; i++) {
  const x = -12 + e.rnd() * (8.05 + TOPX + 4.1), y = -bankL(x) + 0.04, far = x > TOPX - 0.25 ? 0.45 : 1;
  const h = (0.35 + e.rnd() * 0.6) * far, lean = (e.rnd() - 0.35) * 0.18;
  const color = e.rnd() < 0.5 ? d1 : d2, width = 0.008 + e.rnd() * 0.012;
  blades.push(blade(x, y, h, lean, color, width, e.rnd() < 0.4 ? { color: lit, alpha: 0.8, k: 0.6, from: 0.6, at: 0.75 } : null));
}
// seed heads
for (let i = 0; i < 40; i++) {
  const x = -11.5 + e.rnd() * (7.2 + TOPX + 4.1 - 0.4), y = -bankL(x) + 0.04, h = 0.55 + e.rnd() * 0.4;
  blades.push({ x, y, h: h + 0.09, draw: q => {
    q.globalAlpha = 0.95;
    q.strokeStyle = d1;
    q.lineWidth = 0.008;
    q.beginPath();
    q.moveTo(x, y);
    q.quadraticCurveTo(x, y - h * 0.6, x, y - h);
    q.stroke();
    q.fillStyle = lit;
    q.globalAlpha = 0.8;
    q.beginPath();
    q.ellipse(x, y - h - 0.04, 0.016, 0.05, 0, 0, 7);
    q.fill();
  } });
}
// a dense clump where someone can hide
for (let i = 0; i < 260; i++) {
  const x = TOPX - 1.15 + e.rnd() * 0.8, y = -bankL(x) + 0.04, h = 0.45 + e.rnd() * 0.35, lean = (e.rnd() - 0.4) * 0.25;
  const color = e.rnd() < 0.5 ? d1 : d2, width = 0.012 + e.rnd() * 0.014;
  blades.push(blade(x, y, h, lean, color, width, e.rnd() < 0.35 ? { color: lit, alpha: 0.8, k: 0.6, from: 0.6, at: 0.75 } : null));
}
tufts(e, blades, { width: 0.4, wind: { strength: 0.45, gust: 0.6 }, below: 0.3, name: 'tuft' });
