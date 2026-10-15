// the elders' table seen from above (centre across −0.3, 5.6 m away): the book, the papers,
// the inkwell; the lamp's ring of light
const lib = e.lib,
  S = e.state,
  t = e.t;
const L = lib.light(S, t);
g.fillStyle = "#1e1714";
g.fillRect(-1.3, -0.4, 2.6, 0.8);
for (let y = -0.4; y < 0.4; y += 0.2) {
  g.fillStyle = "rgba(0,0,0,0.3)";
  g.fillRect(-1.3, y, 2.6, 0.01);
}
const b = 0.25 + 0.75 * Math.min(1, L.low ? L.k * 0.4 : L.k);
const paper = (x, y, w, h, r) => {
  g.save();
  g.translate(x, y);
  g.rotate(r);
  g.fillStyle = "rgba(" + Math.round(60 + 150 * b) + "," + Math.round(52 + 125 * b) + "," + Math.round(42 + 90 * b) + ",1)";
  g.fillRect(-w / 2, -h / 2, w, h);
  g.restore();
};
paper(0.42, 0.05, 0.3, 0.21, 0.1);
paper(0.5, -0.05, 0.3, 0.21, -0.15);
paper(0.18, 0.12, 0.21, 0.3, 0.05);
g.fillStyle = "#16100e";
g.fillRect(-0.05, -0.18, 0.3, 0.22);
paper(0.1, -0.07, 0.12, 0.2, 0);
g.fillStyle = "#0c0909";
g.beginPath();
g.arc(0.85, 0.08, 0.04, 0, 7);
g.fill();
g.strokeStyle = "rgba(200,180,150," + 0.4 * b + ")";
g.lineWidth = 0.008;
g.beginPath();
g.moveTo(0.83, 0.06);
g.lineTo(0.95, -0.1);
g.stroke();
if (!L.low) {
  const gr = g.createRadialGradient(-0.45, 0.3, 0.02, -0.45, 0.3, 1.2);
  gr.addColorStop(0, "rgba(" + L.col.join(",") + "," + 0.35 * Math.min(1.2, L.k) + ")");
  gr.addColorStop(1, "rgba(" + L.col.join(",") + ",0)");
  g.fillStyle = gr;
  g.fillRect(-1.3, -0.4, 2.6, 0.8);
}
