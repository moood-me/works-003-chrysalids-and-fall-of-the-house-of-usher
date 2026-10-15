// the floor of the hall seen from above (centre 5 m away): planks running away from us
g.fillStyle = '#8a6c50';
g.fillRect(-10, -2.5, 20, 5);
for (let x = -10; x < 10; x += 0.2) {
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(60,44,30,0.14)' : 'rgba(200,170,130,0.1)';
  g.fillRect(x, -2.5, 0.2, 5);
  g.fillStyle = 'rgba(48,34,24,0.45)';
  g.fillRect(x, -2.5, 0.012, 5);
}
