// The earthen floor of the forge (a plane seen from above): trodden dark earth, cinders and scale scattered near the
// forge and the anvil, a worn way to the gate. Its light — the fire's, the moon's through the gate — is the scene's.
g.fillStyle = '#6a5646';
g.fillRect(-9, -3.7, 18, 7.4);
for (let i = 0; i < 40; i++) {
  const x = -9 + e.rnd() * 18, y = -3.7 + e.rnd() * 7.4, r = 0.4 + e.rnd() * 1.2;
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(40,30,22,0.22)' : 'rgba(140,118,94,0.16)';
  g.beginPath();
  g.ellipse(x, y, r, r * 0.6, e.rnd() * 3, 0, 7);
  g.fill();
}
for (let i = 0; i < 80; i++) {
  const x = -6 + e.rnd() * 6, y = -3.2 + e.rnd() * 3;
  g.fillStyle = 'rgba(40,34,30,0.55)';
  g.beginPath();
  g.ellipse(x, y, 0.03 + e.rnd() * 0.05, 0.02, 0, 0, 7);
  g.fill();
}
g.fillStyle = 'rgba(150,130,104,0.18)';
g.beginPath();
g.moveTo(0.9, -3.7); g.lineTo(5.0, -3.7); g.lineTo(3.4, 1.0); g.lineTo(1.4, 1.0);
g.closePath();
g.fill();
