const L = e.state.lamp === true ? 1 : Math.max(0, Math.min(1, +e.state.lamp || 0)),
  yd = Math.max(0, Math.min(1, +e.state.yard_door || 0));
g.fillStyle = "#1a1514";
g.fillRect(-8, -2.75, 16, 5.5);
for (let x = -8; x < 8; x += 0.21) {
  g.fillStyle = "rgba(255,230,200," + (0.006 + e.rnd() * 0.016) + ")";
  g.fillRect(x, -2.75, 0.21, 5.5);
  g.fillStyle = "rgba(0,0,0,0.3)";
  g.fillRect(x, -2.75, 0.01, 5.5);
}
let gr = g.createRadialGradient(0.3, -1.0, 0.1, 0.3, -1.0, 3.0);
gr.addColorStop(0, "rgba(210,145,85," + 0.24 * L + ")");
gr.addColorStop(1, "rgba(210,145,85,0)");
g.fillStyle = gr;
g.fillRect(-8, -2.75, 16, 5.5);
gr = g.createRadialGradient(3.35, -2.7, 0.05, 3.35, -2.7, 1.5);
gr.addColorStop(0, "rgba(200,90,40,0.14)");
gr.addColorStop(1, "rgba(200,90,40,0)");
g.fillStyle = gr;
g.fillRect(1, -2.75, 5, 3);
g.fillStyle = "rgba(6,5,5,0.4)";
g.beginPath();
g.ellipse(0.3, -1.05, 1.45, 0.62, 0, 0, 7);
g.fill();
// the yard door, off to the left, opened: cold evening light lies across the boards
if (yd > 0.01) {
  g.save();
  g.beginPath();
  g.moveTo(-7.5, 0.1);
  g.lineTo(-7.5, -1.3);
  g.lineTo(-2.2, -1.6);
  g.lineTo(-1.6, 0.9);
  g.closePath();
  g.clip();
  gr = g.createLinearGradient(-7.5, 0, -1.6, 0);
  gr.addColorStop(0, "rgba(120,145,190," + 0.42 * yd + ")");
  gr.addColorStop(1, "rgba(120,145,190,0)");
  g.fillStyle = gr;
  g.fillRect(-8, -2, 7, 3.5);
  g.restore();
}
