// tiny far windows (2.2 km), not called — glowing
for (let i = 0; i < 12; i++) {
  const x = -2600 + e.rnd() * 5600;
  if (e.rnd() < 0.3) continue;
  g.fillStyle = '#e6b46e'; g.fillRect(x - 0.6, -2.2, 1.2, 1.2);
  e.light(x, -1.6, 9, '#e0a868', 0.3);
}
