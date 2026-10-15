// The crack from the roof down to the water (the tarn mirrors it on). Stands at its line (CRACK_X, at the water line).
// Its points k0 (at the roof's edge) … k16 (at the water) — the line a game traces (crack#k0 …). Painted once, as layers
// its animate shows: the crack thin and deep
// (`crack` 0…1 — how deep: the one into the other), each stretch of it paled as if lit from inside (`crack_trace` 0…1
// — how far down from the roof it has been traced: trace0…), and a light where the trace has got to (tip).
const L = e.lib, X = -L.CRACK_X;
const wall = (g) => g.translate(X, 0);
// the damp the crack lets in: a dark streak down the stone
wall(g);
g.lineJoin = "round"; g.lineCap = "round";
g.strokeStyle = "rgba(9,14,17,0.18)"; g.lineWidth = 0.6;
L.crackPath(g); g.stroke();
// the crack as deep as cr
function crack(g, cr) {
  wall(g);
  g.lineJoin = "miter"; g.lineCap = "round";
  g.strokeStyle = "rgba(150,164,174," + (0.3 + 0.3 * cr) + ")"; g.lineWidth = 0.1;
  g.save(); g.translate(0.14, 0); L.crackPath(g); g.stroke(); g.restore();
  g.strokeStyle = "rgba(5,7,9," + (0.1 + 0.9 * cr) + ")"; g.lineWidth = 0.08 + 0.2 * cr;
  L.crackPath(g);
  g.moveTo(6.1, -15); g.lineTo(6.9, -14.5); g.lineTo(7.2, -14.9);
  g.moveTo(5.9, -7.6); g.lineTo(5.2, -7.1); g.lineTo(4.9, -6.5);
  g.stroke();
}
e.layer("thin", {}, (g) => crack(g, 0.12));
e.layer("deep", {}, (g) => crack(g, 1));
// the trace, stretch by stretch: the crack paled
for (let i = 0; i < L.CK.length - 1; i++) {
  e.layer(`trace${i}`, {}, (g) => {
    wall(g);
    g.lineJoin = "round"; g.lineCap = "round";
    g.strokeStyle = "rgba(150,172,186,0.1)"; g.lineWidth = 1.1; L.crackPath(g, i, i + 1); g.stroke();
    g.strokeStyle = "rgba(170,190,202,0.32)"; g.lineWidth = 0.11; L.crackPath(g, i, i + 1); g.stroke();
  });
}
// its line, point by point, from the roof down
L.CK.forEach(([x, y], i) => e.at(x + X, y, `k${i}`));
// where the trace has got to glows (its animate carries it down)
e.layer("tip", {}, () => e.light(L.CK[0][0] + X, L.CK[0][1], 1.4, "#c8dae4", 0.35, "tip"));
