const L = e.state.lamp === true ? 1 : Math.max(0, Math.min(1, +e.state.lamp || 0)),
  t = e.t,
  fl = 1 + 0.05 * Math.sin(t * 8.3) + 0.035 * Math.sin(t * 12.9 + 1) + 0.03 * Math.sin(t * 2.7);
g.fillStyle = "#2b2019";
g.fillRect(-1.3, -0.45, 2.6, 0.9);
for (let i = 0; i < 36; i++) {
  const y = -0.44 + e.rnd() * 0.88;
  g.fillStyle = "rgba(0,0,0," + (0.06 + e.rnd() * 0.08) + ")";
  g.fillRect(-1.3 + e.rnd() * 0.4, y, 1.8 + e.rnd() * 0.8, 0.006);
}
// bowls: Mary's, the farmhand's, the mother's at the far end, David's on the near side; bread on its board
for (const [x, y, f] of [
  [-0.6, -0.22, 1],
  [0.7, -0.22, 1],
  [1.1, 0.02, 1],
  [0.3, 0.25, 1],
]) {
  g.fillStyle = "#463f39";
  g.beginPath();
  g.arc(x, y, 0.12, 0, 7);
  g.fill();
  g.fillStyle = "#38322d";
  g.beginPath();
  g.arc(x, y, 0.075, 0, 7);
  g.fill();
  if (f) {
    g.fillStyle = "#4a3424";
    g.beginPath();
    g.ellipse(x + 0.01, y, 0.06, 0.045, 0.3, 0, 7);
    g.fill();
  }
}
g.fillStyle = "#3a2a1c";
g.fillRect(-0.45, 0.08, 0.3, 0.2);
g.fillStyle = "#5a4128";
g.beginPath();
g.ellipse(-0.3, 0.18, 0.11, 0.07, 0.1, 0, 7);
g.fill();
g.globalCompositeOperation = "screen";
const gr = g.createRadialGradient(0, 0.05, 0.02, 0, 0.05, 1.6);
gr.addColorStop(0, "rgba(240,175,100," + 0.62 * L * fl + ")");
gr.addColorStop(1, "rgba(240,175,100,0)");
g.fillStyle = gr;
g.fillRect(-1.3, -0.45, 2.6, 0.9);
g.globalCompositeOperation = "source-over";
