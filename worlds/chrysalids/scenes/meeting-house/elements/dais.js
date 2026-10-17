// the elders' platform seen from above (0.35 m high, centre across −0.4, 6.2 m away)
g.fillStyle = '#7a5e46';
g.fillRect(-2, -1.2, 4, 2.4);
for (let y = -1.2; y < 1.2; y += 0.22) {
  g.fillStyle = 'rgba(48,34,24,0.4)';
  g.fillRect(-2, y, 4, 0.012);
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(60,44,30,0.1)' : 'rgba(200,170,130,0.08)';
  g.fillRect(-2, y + 0.012, 4, 0.2);
}
