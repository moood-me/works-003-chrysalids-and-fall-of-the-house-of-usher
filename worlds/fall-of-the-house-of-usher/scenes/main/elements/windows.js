// The windows and the door of the facade: the dark windows and their sills; the door's two leaves (layers door_l and
// door_r, hinged at the jambs: `door` 0…1 swings them in — its animate), the hall behind them. The lit upper window is
// an element of its own (lamp: it glows).
const L = e.lib, [dx, dt, dw, dh] = L.DOOR;
L.windows(g, L.colours());
e.layer("door_l", { pivot: [dx - dw / 2, dt + dh] }, (g) => L.doorLeaf(g, -1));
e.layer("door_r", { pivot: [dx + dw / 2, dt + dh] }, (g) => L.doorLeaf(g, 1));
// where the windows are pressed (a game offering them): one of the dark upper ones
e.at(L.UW[1][0], L.UW[1][1] + L.UW[1][3] / 2);
