// the farmyard (a plane seen from above): trodden earth, ruts, straw, a puddle or two
g.fillStyle = '#8a7a5e';
g.fillRect(-60, -29, 120, 58);
for (let i = 0; i < 120; i++) {
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(100,86,64,0.35)' : 'rgba(176,156,112,0.3)';
  g.beginPath();
  g.ellipse(-60 + e.rnd() * 120, -29 + e.rnd() * 58, 0.4 + e.rnd() * 2, 0.15 + e.rnd() * 0.5, e.rnd() * 3, 0, 7);
  g.fill();
}
g.fillStyle = 'rgba(150,156,160,0.55)';
for (const [x, y, w] of [[-2.5, 21, 1.3], [3.4, 23.5, 0.9], [-7, 17, 1.1]]) { g.beginPath(); g.ellipse(x, y, w, w * 0.35, 0, 0, 7); g.fill(); }
