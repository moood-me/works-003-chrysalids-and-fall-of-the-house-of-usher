// the front of the elders' table: a plain heavy panel
const lib = e.lib,
  S = e.state,
  t = e.t;
const L = lib.light(S, t);
g.fillStyle = "#140f0e";
g.fillRect(-1.3, -0.78, 2.6, 0.78);
g.fillStyle = "#231b17";
g.fillRect(-1.34, -0.8, 2.68, 0.06);
g.strokeStyle = "rgba(0,0,0,0.4)";
g.lineWidth = 0.014;
for (const x of [-1.25, -0.42, 0.42]) g.strokeRect(x + 0.06, -0.66, 0.71, 0.56);
const k = Math.min(1.2, L.k);
g.fillStyle = "rgba(" + L.col.join(",") + "," + (L.low ? 0.08 : 0.3) * k + ")";
g.fillRect(-1.34, -0.8, 2.68, 0.02);
if (L.low) {
  const gr = g.createLinearGradient(0, 0, 0, -0.78);
  gr.addColorStop(0, "rgba(" + L.col.join(",") + "," + 0.4 * k + ")");
  gr.addColorStop(1, "rgba(" + L.col.join(",") + ",0)");
  g.fillStyle = gr;
  g.fillRect(-1.3, -0.78, 2.6, 0.78);
}
