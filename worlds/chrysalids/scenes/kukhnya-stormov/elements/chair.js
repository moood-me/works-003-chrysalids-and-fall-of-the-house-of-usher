const L = e.state.lamp === true ? 1 : Math.max(0, Math.min(1, +e.state.lamp || 0));
function chairBack(s) {
  const C = new Path2D();
  C.rect(-0.2 * s, -0.47 * s, 0.035 * s, 0.47 * s);
  C.rect(0.165 * s, -0.47 * s, 0.035 * s, 0.47 * s);
  C.rect(-0.22 * s, -0.49 * s, 0.44 * s, 0.04 * s);
  C.rect(-0.205 * s, -0.92 * s, 0.03 * s, 0.45 * s);
  C.rect(0.175 * s, -0.92 * s, 0.03 * s, 0.45 * s);
  C.rect(-0.215 * s, -0.95 * s, 0.43 * s, 0.05 * s);
  C.rect(-0.2 * s, -0.75 * s, 0.4 * s, 0.035 * s);
  return C;
}
const gr = g.createRadialGradient(-0.3, -1.1, 0.05, -0.3, -1.1, 0.9);
gr.addColorStop(0, "rgba(225,160,92," + 0.6 * L + ")");
gr.addColorStop(1, "rgba(225,160,92,0)");
g.save();
g.rotate(-0.03);
const C = chairBack(0.95);
g.fillStyle = gr;
g.fill(C);
g.translate(0.008, 0.008);
g.fillStyle = "#140f0e";
g.fill(C);
g.restore();
