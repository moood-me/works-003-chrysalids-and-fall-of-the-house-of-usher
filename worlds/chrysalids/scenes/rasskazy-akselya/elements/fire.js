// The fire on the rise: its ring of stones, the logs crossed; the embers' glow a layer (fire.animate.js: as `fire`
// says); its flames, sparks and smoke are particles, its light the scene's `fire` (of its point `flame`)
for (let i = 0; i < 9; i++) {
  const x = -0.44 + i * 0.11 + (e.rnd() - 0.5) * 0.03, r = 0.055 + e.rnd() * 0.03;
  g.fillStyle = e.rnd() < 0.5 ? '#7a7468' : '#8a8478';
  g.beginPath(); g.ellipse(x, -0.025, r, r * 0.7, 0, 0, 7); g.fill();
}
g.fillStyle = '#4a3828';
g.save(); g.translate(0, -0.07); g.rotate(-0.3); g.fillRect(-0.32, -0.035, 0.64, 0.07); g.restore();
g.save(); g.translate(0, -0.08); g.rotate(0.38); g.fillRect(-0.3, -0.03, 0.6, 0.06); g.restore();
e.layer('embers', { blend: 'add', box: [-0.5, -0.4, 0.5, 0.05] }, q => {
  const cg = q.createRadialGradient(0, -0.1, 0, 0, -0.1, 0.45);
  cg.addColorStop(0, 'rgba(255,170,90,0.6)');
  cg.addColorStop(1, 'rgba(200,80,30,0)');
  q.fillStyle = cg;
  q.save(); q.translate(0, -0.1); q.scale(1, 0.5); q.beginPath(); q.arc(0, 0, 0.45, 0, 7); q.fill(); q.restore();
});
e.light(0, -0.3, 1.2, '#ff9a50', 0.8, 'flame');
e.at(0, -0.3, 'flame');
