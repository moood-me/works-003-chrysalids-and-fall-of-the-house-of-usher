const S = e.state || {};
const s = S.sun ?? 0.2;
const gr = g.createRadialGradient(-1.3, -1.0, 0, -1.3, -1.0, 2.8);
gr.addColorStop(0, "rgba(255,238,204," + (0.12 + 0.08 * s) + ")");
gr.addColorStop(1, "rgba(255,238,204,0)");
g.fillStyle = gr;
g.fillRect(-4, -2, 8, 4);
if (s > 0.01) {
  g.globalCompositeOperation = "multiply";
  g.fillStyle = "rgba(252,206,150," + 0.22 * s + ")";
  g.fillRect(-4, -2, 8, 4);
  g.globalCompositeOperation = "source-over";
}
