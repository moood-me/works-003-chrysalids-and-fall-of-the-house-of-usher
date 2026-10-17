// stooks nearer (34 m)
g.fillStyle = '#ccb478';
g.strokeStyle = 'rgba(140,120,70,0.6)';
g.lineWidth = 0.05;
for (let i = 0; i < 18; i++) {
  const x = -48 + e.rnd() * 96, h = 1.3 + e.rnd() * 0.4;
  g.beginPath(); g.moveTo(x - 0.75, 0.2); g.lineTo(x, -h); g.lineTo(x + 0.75, 0.2); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(x, -h); g.lineTo(x - 0.3, 0.2); g.moveTo(x, -h); g.lineTo(x + 0.3, 0.2); g.stroke();
}
