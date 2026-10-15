// The boarded floor (a plane seen from above: x across, y toward us; its middle 3.45 m off): planks running away from
// us, their joints, a worn path from the yard door to the hearth. The lamp's pool, the hearth's glow, the yard door's
// cold light and the shadows on it are the scene's light.
g.fillStyle = '#866648';
g.fillRect(-8, -2.75, 16, 5.5);
for (let x = -8; x < 8; x += 0.21) {
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(60,40,26,0.12)' : 'rgba(255,236,206,0.08)';
  g.fillRect(x, -2.75, 0.21, 5.5);
  g.fillStyle = 'rgba(40,26,16,0.5)';
  g.fillRect(x, -2.75, 0.012, 5.5);
}
g.fillStyle = 'rgba(200,170,130,0.12)';
g.beginPath();
g.ellipse(-1.2, 0.1, 4.2, 0.6, -0.08, 0, 7);
g.fill();
