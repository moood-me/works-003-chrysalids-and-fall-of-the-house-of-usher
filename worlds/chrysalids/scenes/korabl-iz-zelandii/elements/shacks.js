// the Fringes' huts on the right of the clearing (27 m): leaning walls of boards and poles, dark doorways, a pole fence
const hut = (x, h, wd, lean) => {
  g.fillStyle = '#6e6252';
  g.beginPath();
  g.moveTo(x - wd / 2, 0); g.lineTo(x - wd / 2 + lean, -h * 0.75); g.lineTo(x + lean * 0.3, -h); g.lineTo(x + wd / 2, -h * 0.6); g.lineTo(x + wd / 2, 0);
  g.closePath();
  g.fill();
  g.strokeStyle = '#5a4e40';
  g.lineWidth = 0.08;
  g.lineCap = 'round';
  for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(x - wd * 0.3 + i * wd * 0.2, -h * 0.8); g.lineTo(x - wd * 0.35 + i * wd * 0.22 + 0.4, -h * 1.15); g.stroke(); }
  g.fillStyle = '#2e2a26';
  g.fillRect(x - wd * 0.1, -h * 0.55, wd * 0.22, h * 0.55);
};
hut(-3.2, 2.6, 4.2, 0.3);
hut(3.6, 2.2, 3.4, -0.2);
g.strokeStyle = '#5a4e40';
g.lineWidth = 0.09;
for (let i = 0; i < 7; i++) { const x = -9 + i * 0.9; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 0.05 * Math.sin(i * 3), -1.1 - 0.2 * Math.sin(i * 2)); g.stroke(); }
g.beginPath(); g.moveTo(-9, -0.8); g.lineTo(-3.6, -0.85); g.stroke();
