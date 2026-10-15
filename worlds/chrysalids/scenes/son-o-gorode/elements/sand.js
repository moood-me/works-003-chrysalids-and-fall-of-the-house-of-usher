// the dune's sand (a plane draped over the land, seen from above): drifts of light and shade, ripples, the wet sand
// toward the sea on the right
g.fillStyle = '#8a8478';
g.fillRect(-20, -10, 40, 20);
for (let i = 0; i < 90; i++) {
  g.fillStyle = e.rnd() < 0.6 ? 'rgba(80,76,72,0.25)' : 'rgba(176,168,150,0.18)';
  g.beginPath(); g.ellipse(-18 + e.rnd() * 36, -9 + e.rnd() * 18, 0.4 + e.rnd() * 1.6, 0.15 + e.rnd() * 0.5, 0, 0, 7); g.fill();
}
g.strokeStyle = 'rgba(70,66,64,0.3)';
g.lineWidth = 0.03;
for (let i = 0; i < 110; i++) {
  const x = -12 + e.rnd() * 30, y = -9 + e.rnd() * 18, L = 0.15 + e.rnd() * 0.45;
  g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + L / 2, y - 0.03, x + L, y); g.stroke();
}
const wet = g.createLinearGradient(2, 0, 12, 0);
wet.addColorStop(0, 'rgba(90,88,110,0)');
wet.addColorStop(1, 'rgba(90,88,110,0.6)');
g.fillStyle = wet;
g.fillRect(2, -10, 18, 20);
