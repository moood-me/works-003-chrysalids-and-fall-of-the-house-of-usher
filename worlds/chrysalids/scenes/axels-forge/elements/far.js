// Waknuk far off across the fields (70 m): the low hills, the church with its spire, a barn — painted in their daylight
// colours; the night and the haze are the scene's
g.fillStyle = '#5c6a54';
g.beginPath();
g.moveTo(-150, 1);
for (let x = -150; x <= 150; x += 3) g.lineTo(x, -(2.5 + 2 * Math.sin(x * 0.05 + 1) + 1.5 * Math.sin(x * 0.13) + e.rnd() * 1.8));
g.lineTo(150, 1);
g.closePath();
g.fill();
g.fillStyle = '#7a6a58';
g.beginPath();
g.moveTo(38, 0.5); g.lineTo(38, -5); g.lineTo(43, -8.5); g.lineTo(48, -5); g.lineTo(48, 0.5);
g.fill();
g.fillStyle = '#8a8070';
g.beginPath();
g.moveTo(12, 0.5); g.lineTo(12, -5); g.lineTo(15, -7.5); g.lineTo(18, -5); g.lineTo(18, 0.5);
g.fill();
g.beginPath();
g.moveTo(13.4, -5.5); g.lineTo(13.4, -10); g.lineTo(14.2, -13.5); g.lineTo(15, -10); g.lineTo(15, -5.5);
g.fill();
