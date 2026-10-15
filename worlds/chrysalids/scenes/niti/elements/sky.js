// The night sky behind the chapters: deep, a faint mist low down, stars — twinkling in its shader. Painted once.
const A = e.aspect;
const bg = g.createLinearGradient(0, -0.35, 0, 1.25);
bg.addColorStop(0, '#04050b');
bg.addColorStop(0.5, '#0a0e1f');
bg.addColorStop(1, '#130f20');
g.fillStyle = bg;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
for (let i = 0; i < 220; i++) {
  const s = e.rnd(), x = -0.3 + e.rnd() * (A + 0.6), y = -0.3 + e.rnd() * 1.4, ph = e.rnd(), r = 0.0012 + 0.0022 * s;
  g.globalAlpha = (0.1 + 0.45 * s) * (0.6 + 0.4 * ph);
  g.fillStyle = s > 0.85 ? '#ffe9c4' : '#c9d2ff';
  g.fillRect(x - r / 2, y - r / 2, r, r);
}
g.globalAlpha = 1;
const mist = g.createRadialGradient(A / 2, 1.1, 0.05, A / 2, 1.1, 0.9);
mist.addColorStop(0, 'rgba(80, 60, 110, 0.22)');
mist.addColorStop(1, 'rgba(80, 60, 110, 0)');
g.fillStyle = mist;
g.fillRect(-0.4, 0.2, A + 0.8, 1.1);
