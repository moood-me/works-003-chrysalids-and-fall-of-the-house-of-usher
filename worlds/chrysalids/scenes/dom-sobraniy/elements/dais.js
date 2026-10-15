// the elders' platform seen from above (0.35 m high, centre across −0.4, 6.2 m away)
const lib = e.lib,
  S = e.state,
  t = e.t;
const L = lib.light(S, t);
g.fillStyle = "#1b1513";
g.fillRect(-2, -1.2, 4, 2.4);
for (let y = -1.2; y < 1.2; y += 0.22) {
  g.fillStyle = "rgba(0,0,0,0.3)";
  g.fillRect(-2, y, 4, 0.012);
  g.fillStyle = "rgba(255,230,200," + (0.006 + e.rnd() * 0.012) + ")";
  g.fillRect(-2, y + 0.012, 4, 0.2);
}
const lx = L.x + 0.4,
  ly = 6.2 - L.d;
const gr = g.createRadialGradient(lx, ly, 0.1, lx, ly, 2.6);
gr.addColorStop(0, "rgba(" + L.col.join(",") + "," + 0.3 * Math.min(1.2, L.k) + ")");
gr.addColorStop(1, "rgba(" + L.col.join(",") + ",0)");
g.fillStyle = gr;
g.fillRect(-2, -1.2, 4, 2.4);
