// The fence along the left of the yard, from beside us away to the barn's corner (a card turned along its line: x from
// its near end): weathered posts, two rails sagging a little between them
const len = Math.hypot(e.lib.FENCE.a1 - e.lib.FENCE.a0, e.lib.FENCE.d1 - e.lib.FENCE.d0);
g.fillStyle = '#857762';
g.strokeStyle = '#857762';
g.lineCap = 'round';
for (let x = 0; x <= len + 0.01; x += 2.3) {
  const t = 1.25 + 0.08 * e.rnd();
  g.fillRect(x - 0.07, -t, 0.14, t + 0.05);
  g.fillStyle = '#6e6250';
  g.fillRect(x - 0.08, -t - 0.04, 0.16, 0.06);
  g.fillStyle = '#857762';
}
g.lineWidth = 0.08;
for (const y of [-0.55, -1.05]) {
  g.beginPath();
  g.moveTo(0, y);
  for (let x = 0; x < len; x += 2.3) g.quadraticCurveTo(x + 1.15, y + 0.05 + 0.02 * e.rnd(), Math.min(len, x + 2.3), y);
  g.stroke();
}
