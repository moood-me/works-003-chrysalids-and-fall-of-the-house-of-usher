// the shelter belts far off (2.4 km)
g.fillStyle = '#3e4636';
const rows = [[-5800, -2600, 0], [-1900, -300, 0.5], [400, 2300, 0.2], [3000, 5800, 0.7]];
for (let r = 0; r < rows.length; r++) {
  const [a, b] = rows[r];
  g.beginPath(); g.moveTo(a, 6);
  for (let x = a; x <= b; x += 25) g.lineTo(x, -(9 + 6 * Math.sin(x * 0.013 + r) + 4 * Math.sin(x * 0.041 + r * 2) + 3 * e.rnd()));
  g.lineTo(b, 6); g.closePath(); g.fill();
}
