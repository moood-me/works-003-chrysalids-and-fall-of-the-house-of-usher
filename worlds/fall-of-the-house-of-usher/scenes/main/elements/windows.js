// The windows and the door of the facade: the dark windows and their sills; the door's two leaves (layers door_l and
// door_r, hinged at the jambs: `door` 0…1 swings them in — its animate), the hall behind them; the lit upper window (a
// layer: the lamp, its glow "lamp" — dimmed by the gloom in its animate).
const L = e.lib, S = e.state || {}, lt = L.light(S), [dx, dt, dw, dh] = L.DOOR;
L.windows(g, L.colours());
e.layer("door_l", { pivot: [dx - dw / 2, dt + dh] }, (g) => L.doorLeaf(g, -1));
e.layer("door_r", { pivot: [dx + dw / 2, dt + dh] }, (g) => L.doorLeaf(g, 1));
if (lt.lamp > 0.01) e.layer("lamp", {}, (g) => {
  g.globalAlpha = Math.min(1, lt.lamp / 0.45);
  L.lampWindow(g);
  e.light(-12, -11.4, 2.6, "#d8a670", 0.7 * lt.lamp, "lamp");
});
// where the windows are pressed (a game offering them): one of the dark upper ones
e.at(L.UW[1][0], L.UW[1][1] + L.UW[1][3] / 2);
