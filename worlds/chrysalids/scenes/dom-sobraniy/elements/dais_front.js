// the front of the elders' platform
const lib = e.lib,
  S = e.state,
  t = e.t;
const L = lib.light(S, t);
g.fillStyle = "#151010";
g.fillRect(-2, -0.35, 4, 0.35);
g.fillStyle = "#211916";
g.fillRect(-2.03, -0.37, 4.06, 0.04);
for (let x = -2; x < 2; x += 0.5) {
  g.fillStyle = "rgba(0,0,0,0.35)";
  g.fillRect(x, -0.33, 0.012, 0.33);
}
const lx = L.x + 0.4;
const gr = g.createRadialGradient(lx, L.low ? 0 : -0.4, 0.05, lx, L.low ? 0 : -0.4, L.low ? 1.6 : 1.2);
gr.addColorStop(0, "rgba(" + L.col.join(",") + "," + (L.low ? 0.55 : 0.12) * Math.min(1.2, L.k) + ")");
gr.addColorStop(1, "rgba(" + L.col.join(",") + ",0)");
g.fillStyle = gr;
g.fillRect(-2, -0.37, 4, 0.37);
