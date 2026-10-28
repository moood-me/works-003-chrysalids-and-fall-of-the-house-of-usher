// The Mortons' farm on the far rise (60 m): the hill, the house, the barn, the trees — and Rosalind's lit window (its
// own glow: morton.animate.js swells it as a thought arrives or leaves). Its point `window` — where the thoughts go.
g.fillStyle = '#56664e';
g.beginPath();
g.moveTo(-26, 1);
g.bezierCurveTo(-14, -2, -8, -6.2, 0, -6.3);
g.bezierCurveTo(8, -6.2, 14, -3, 26, 1);
g.closePath();
g.fill();
g.fillStyle = '#8a7a66';
g.fillRect(-2.2, -8.8, 3.8, 2.8);
g.fillStyle = '#5a4a3e';
g.beginPath(); g.moveTo(-2.6, -8.7); g.lineTo(-0.4, -10.4); g.lineTo(2.0, -8.7); g.fill();
g.fillStyle = '#7a6a56';
g.fillRect(2.8, -8.0, 2.6, 2.0);
g.fillStyle = '#5a4a3e';
g.beginPath(); g.moveTo(2.6, -7.9); g.lineTo(4.1, -9.0); g.lineTo(5.6, -7.9); g.fill();
g.fillStyle = '#4a5a40';
for (const [x, h] of [[-6, 3.0], [-7.2, 2.4], [8.2, 2.7]]) {
  g.beginPath();
  g.ellipse(x, -5.4 - h * 0.5, h * 0.45, h * 0.55, 0, 0, 7);
  g.fill();
}
g.fillStyle = '#f2c27a';
g.fillRect(-0.4, -8.05, 0.8, 0.9);
e.light(0, -7.6, 3, '#f0b868', 1, 'window');
e.at(0, -7.6, 'window');
