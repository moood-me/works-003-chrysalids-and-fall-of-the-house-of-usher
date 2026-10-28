// stooks standing in the far stubble (62 m), each a little sheaf tent
g.fillStyle = '#c8b072';
for (let i = 0; i < 28; i++) {
  const x = -88 + e.rnd() * 176;
  g.beginPath(); g.moveTo(x - 0.7, 0.2); g.lineTo(x, -1.4 - e.rnd() * 0.3); g.lineTo(x + 0.7, 0.2); g.closePath(); g.fill();
}
