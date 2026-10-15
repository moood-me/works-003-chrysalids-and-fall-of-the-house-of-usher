// The table's top (a plane seen from above): scrubbed boards; the bowls — Mary's, the farmhand's, the mother's at the
// far end, David's on our side —, the bread on its board. It casts the lamp's shadow on those sitting at it (their
// knees in the dark, their faces lit). Its point `bowl` — David's bowl (the steam over it; the last shot of upstairs)
g.fillStyle = '#8a6a4a';
g.fillRect(-1.3, -0.45, 2.6, 0.9);
for (let i = 0; i < 36; i++) {
  const y = -0.44 + e.rnd() * 0.88;
  g.fillStyle = 'rgba(50,34,22,' + (0.08 + e.rnd() * 0.1) + ')';
  g.fillRect(-1.3 + e.rnd() * 0.4, y, 1.8 + e.rnd() * 0.8, 0.006);
}
for (const [x, y] of [[-0.6, -0.22], [0.7, -0.22], [1.1, 0.02], [0.3, 0.25]]) {
  g.fillStyle = '#9c8e7a';
  g.beginPath();
  g.arc(x, y, 0.12, 0, 7);
  g.fill();
  g.fillStyle = '#7d705e';
  g.beginPath();
  g.arc(x, y, 0.08, 0, 7);
  g.fill();
  g.fillStyle = '#8a5e3a';
  g.beginPath();
  g.ellipse(x + 0.01, y, 0.06, 0.045, 0.3, 0, 7);
  g.fill();
}
g.fillStyle = '#6a4e36';
g.fillRect(-0.45, 0.08, 0.3, 0.2);
g.fillStyle = '#b08250';
g.beginPath();
g.ellipse(-0.3, 0.18, 0.11, 0.07, 0.1, 0, 7);
g.fill();
e.at(0.3, 0.25, 'bowl');
