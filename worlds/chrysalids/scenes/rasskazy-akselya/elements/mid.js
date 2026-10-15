// the hedge between the fields (90 m)
g.fillStyle = '#4c5640';
g.beginPath();
g.moveTo(-140, 0.4);
for (let x = -140; x <= 140; x += 1.5) {
  const n = Math.sin(x * 0.09) * Math.sin(x * 0.031 + 1);
  g.lineTo(x, -(n > 0.2 ? 0.9 + 1.6 * (n - 0.2) + e.rnd() * 0.5 : 0.3 + e.rnd() * 0.25));
}
g.lineTo(140, 0.4);
g.closePath();
g.fill();
