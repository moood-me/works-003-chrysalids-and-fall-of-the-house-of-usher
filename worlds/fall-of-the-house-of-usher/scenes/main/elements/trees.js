// The two dead trees standing in the water off the near shore, left and right of the causeway: a seeded recursion of
// tapering branches — each tree a layer that leans a little on its own in the still air (its animate).
const rn = (i) => { const s = Math.sin(i * 45.17 + 7.9) * 43758.5453; return s - Math.floor(s); };
const L = e.lib;
let c = 0;
const R = () => rn(c++);
function seg(g, x, y, x2, y2, w, w2, bend) {
  const a = Math.atan2(y2 - y, x2 - x), nx = -Math.sin(a), ny = Math.cos(a);
  const mx = (x + x2) / 2 + nx * bend, my = (y + y2) / 2 + ny * bend;
  g.beginPath();
  g.moveTo(x + (nx * w) / 2, y + (ny * w) / 2);
  g.quadraticCurveTo(mx + (nx * (w + w2)) / 4, my + (ny * (w + w2)) / 4, x2 + (nx * w2) / 2, y2 + (ny * w2) / 2);
  g.lineTo(x2 - (nx * w2) / 2, y2 - (ny * w2) / 2);
  g.quadraticCurveTo(mx - (nx * (w + w2)) / 4, my - (ny * (w + w2)) / 4, x - (nx * w) / 2, y - (ny * w) / 2);
  g.closePath(); g.fill();
}
function br(g, x, y, a, len, w, d, bias) {
  if (d == 0 || len < 0.06) return;
  const a1 = a + (R() - 0.5) * 0.5, xm = x + Math.cos(a1) * len * 0.5, ym = y + Math.sin(a1) * len * 0.5;
  const a2 = a + (R() - 0.5) * 0.6, x2 = xm + Math.cos(a2) * len * 0.5, y2 = ym + Math.sin(a2) * len * 0.5;
  const w2 = Math.max(0.012, w * 0.62), wm = (w + w2) / 2;
  seg(g, x, y, xm, ym, w, wm, (R() - 0.5) * len * 0.12);
  seg(g, xm, ym, x2, y2, wm, w2, (R() - 0.5) * len * 0.12);
  const nb = R() < 0.7 ? 2 : 3;
  for (let i = 0; i < nb; i++) {
    const s = i / (nb - 1) - 0.5;
    let na = a + s * (0.7 + R() * 0.6) + (R() - 0.5) * 0.4 + bias;
    na += 0.1 * Math.cos(na) * Math.cos(na);
    br(g, x2, y2, na, len * (0.58 + R() * 0.22), w2, d - 1, bias);
  }
}
// a tree at x (m): its scale, seed, lean (rad), trunk length and width, which way its branches bias, its colour
function tree(name, x, scale, seed, lean, len, w, bias, col) {
  e.layer(name, { pivot: [x, 0.3] }, (g) => {
    c = seed;
    g.translate(x, 0.3);
    g.scale(scale, scale);
    g.fillStyle = L.paint(col);
    br(g, 0, 0, -Math.PI / 2 + lean, len, w, 9, bias);
    g.beginPath(); g.ellipse(0, -0.05, w, w * 0.36, 0, 0, 7); g.fill();
  });
}
tree("left", -10, 1.09, 0, 0.06, 2.5, 0.42, 0.05, "#262c30");
tree("right", 5.4, 0.92, 777, -0.08, 2.8, 0.48, -0.05, "#272d31");
// where the trees are pressed (a game offering them: trees#trunk): the right one, on its trunk under the fork — within
// the middle 4:3
e.at(5.2, -2.6, "trunk");
