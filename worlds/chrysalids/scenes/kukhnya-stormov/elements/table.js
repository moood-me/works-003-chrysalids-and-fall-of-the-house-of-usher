const L = e.state.lamp === true ? 1 : Math.max(0, Math.min(1, +e.state.lamp || 0));
{
  const ug = g.createLinearGradient(0, -0.66, 0, 0);
  ug.addColorStop(0, "rgba(8,6,6,0.6)");
  ug.addColorStop(1, "rgba(8,6,6,0.15)");
  g.fillStyle = ug;
  g.fillRect(-1.2, -0.66, 2.36, 0.66);
}
g.fillStyle = "#19130f";
for (const x of [-1.24, 1.14]) {
  g.beginPath();
  g.moveTo(x, -0.66);
  g.lineTo(x + 0.1, -0.66);
  g.lineTo(x + 0.088, 0);
  g.lineTo(x + 0.012, 0);
  g.closePath();
  g.fill();
}
g.fillStyle = "#201813";
g.beginPath();
g.moveTo(-1.3, -0.785);
g.lineTo(1.3, -0.785);
g.lineTo(1.29, -0.65);
g.quadraticCurveTo(0, -0.656, -1.29, -0.65);
g.closePath();
g.fill();
const gr = g.createLinearGradient(-1.3, 0, 1.3, 0);
gr.addColorStop(0, "rgba(230,165,100,0)");
gr.addColorStop(0.48, "rgba(230,165,100," + 0.45 * L + ")");
gr.addColorStop(1, "rgba(230,165,100,0)");
g.fillStyle = gr;
g.fillRect(-1.3, -0.79, 2.6, 0.016);
