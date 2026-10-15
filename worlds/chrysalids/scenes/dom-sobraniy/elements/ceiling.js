// the ceiling: boards and heavy beams, a little of the lamp's light
const lib = e.lib,
  S = e.state,
  t = e.t;
const L = lib.light(S, t);
g.fillStyle = "#0e0b0c";
g.fillRect(-10, -2.5, 20, 5);
for (const y of [-2.2, -0.9, 0.4, 1.7]) {
  g.fillStyle = "#090708";
  g.fillRect(-10, y - 0.13, 20, 0.26);
  g.fillStyle = "rgba(" + L.col.join(",") + "," + 0.05 * Math.min(1, L.k) + ")";
  g.fillRect(-10, y + 0.1, 20, 0.03);
}
const gr = g.createRadialGradient(L.x, 5 - L.d, 0.1, L.x, 5 - L.d, 3.5);
gr.addColorStop(0, "rgba(" + L.col.join(",") + "," + 0.12 * Math.min(1.2, L.k) + ")");
gr.addColorStop(1, "rgba(" + L.col.join(",") + ",0)");
g.fillStyle = gr;
g.fillRect(-10, -2.5, 20, 5);
