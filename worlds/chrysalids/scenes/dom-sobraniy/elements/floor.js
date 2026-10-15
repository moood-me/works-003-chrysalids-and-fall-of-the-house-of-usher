// the floor of the hall seen from above (centre 5 m away): planks running away from us, the
// light's pool
const lib = e.lib,
  S = e.state,
  t = e.t;
const L = lib.light(S, t);
const k = Math.min(1.2, L.k);
const Y = (d) => 5 - d;
g.fillStyle = "#171211";
g.fillRect(-10, -2.5, 20, 5);
for (let x = -10; x < 10; x += 0.2) {
  g.fillStyle = "rgba(255,230,200," + (0.005 + e.rnd() * 0.014) + ")";
  g.fillRect(x, -2.5, 0.2, 5);
  g.fillStyle = "rgba(0,0,0,0.3)";
  g.fillRect(x, -2.5, 0.01, 5);
}
const lx = L.x,
  ly = Y(L.d);
let gr = g.createRadialGradient(lx, ly, 0.1, lx, ly, L.low ? 3.2 : 4.2);
gr.addColorStop(0, "rgba(" + L.col.join(",") + "," + (L.low ? 0.45 : 0.24) * k + ")");
gr.addColorStop(1, "rgba(" + L.col.join(",") + ",0)");
g.fillStyle = gr;
g.fillRect(-10, -2.5, 20, 5);
// a cold breath of the night from the windows
gr = g.createLinearGradient(0, -2.5, 0, 0);
gr.addColorStop(0, "rgba(90,110,150,0.05)");
gr.addColorStop(1, "rgba(90,110,150,0)");
g.fillStyle = gr;
g.fillRect(-10, -2.5, 20, 2.5);
