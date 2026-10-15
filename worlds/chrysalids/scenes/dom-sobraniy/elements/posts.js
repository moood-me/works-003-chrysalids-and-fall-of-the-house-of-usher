// two posts near us, holding the roof — seen only at the frame's edges
const lib = e.lib,
  S = e.state,
  t = e.t;
const L = lib.light(S, t);
for (const x of [-2.6, 2.65]) {
  g.fillStyle = "#0d0a0b";
  g.fillRect(x - 0.12, -4.3, 0.24, 4.3);
  g.fillStyle = "rgba(" + L.col.join(",") + "," + 0.18 * Math.min(1, L.k) + ")";
  g.fillRect(x < 0 ? x + 0.09 : x - 0.12, -4.3, 0.03, 4.3);
}
