// the fields of the valley seen from above (from 16 m on): patches of grass, stubble, plough, their rows
g.fillStyle = '#5a5e48';
g.fillRect(-3000, -692, 6000, 1384);
const cols = ['#64684e', '#545842', '#6a6a50', '#706c52', '#5c6048'];
for (let i = 0; i < 520; i++) {
  const x = -3000 + e.rnd() * 6000, y = -692 + e.rnd() * 1360, w = 40 + e.rnd() * 170, h = 30 + e.rnd() * 130;
  g.fillStyle = cols[Math.floor(e.rnd() * 5)];
  g.globalAlpha = 0.75; g.fillRect(x, y, w, h);
  g.globalAlpha = 0.16; g.strokeStyle = e.rnd() < 0.5 ? '#7a7a60' : '#46483a'; g.lineWidth = 1.2;
  const dir = e.rnd() < 0.5;
  for (let k = 4; k < (dir ? w : h); k += 6 + e.rnd() * 3) { g.beginPath(); if (dir) { g.moveTo(x + k, y); g.lineTo(x + k, y + h); } else { g.moveTo(x, y + k); g.lineTo(x + w, y + k); } g.stroke(); }
}
g.globalAlpha = 1;
