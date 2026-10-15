// The fissure in the back wall, right of the windows, from the vault down: `crack` 0…1 how far down it has run and how
// deep it gapes (past 0.35 it branches). Its lines (layer 1) are lit as the wall is; a glow along it (layer 2) is what
// shines from within while he sings (fissure.wgsl, `song`). Painted again only as `crack` steps (redraw) — a small card.
const K = e.lib.num(e.state.crack);
const pts = [
  [2.75, -11], [2.5, -10.2], [2.85, -9.5], [2.55, -8.7], [2.72, -8.0], [2.28, -7.3], [2.52, -6.6], [2.16, -5.9],
  [2.42, -5.1], [2.02, -4.4], [2.3, -3.65], [1.94, -2.95], [2.2, -2.25], [1.9, -1.5], [2.06, -0.75],
];
const n = pts.length - 1;
const reach = (0.6 + 0.4 * K) * n;
e.layer("lines", {}, (c) => {
  c.lineCap = "round";
  c.lineJoin = "round";
  for (let i = 0; i < n; i++) {
    const f = Math.min(1, reach - i);
    if (f <= 0) break;
    const [x0, y0] = pts[i],
      [x1, y1] = pts[i + 1];
    const xe = x0 + (x1 - x0) * f,
      ye = y0 + (y1 - y0) * f;
    const taper = 1 - 0.55 * (i / n);
    // the lit lip above it
    c.strokeStyle = "rgba(150,168,180," + (0.18 + 0.12 * K) + ")";
    c.lineWidth = (0.012 + 0.01 * K) * taper;
    c.beginPath();
    c.moveTo(x0 - 0.035, y0 - 0.02);
    c.lineTo(xe - 0.035, ye - 0.02);
    c.stroke();
    // the gap
    c.strokeStyle = "rgba(5,8,11," + (0.5 + 0.5 * K) + ")";
    c.lineWidth = (0.028 + 0.08 * K) * taper;
    c.beginPath();
    c.moveTo(x0, y0);
    c.lineTo(xe, ye);
    c.stroke();
  }
  if (K > 0.35) {
    const bA = (K - 0.35) / 0.65;
    c.strokeStyle = "rgba(5,8,11," + 0.7 * bA + ")";
    c.lineWidth = 0.02;
    c.beginPath();
    for (const [i, dx, dy] of [[3, 0.5, 0.35], [6, -0.45, 0.4], [9, 0.4, 0.3], [11, -0.35, 0.3]]) {
      if (i > reach) continue;
      const [x, y] = pts[i];
      c.moveTo(x, y);
      c.lineTo(x + dx * 0.55 * bA, y + dy * 0.4);
      c.lineTo(x + dx * bA, y + dy * 0.9 * bA);
    }
    c.stroke();
  }
});
// what shines from within it as he sings
e.layer("glow", {}, (c) => {
  c.filter = "blur(0.03px)";
  c.strokeStyle = "rgba(196,186,166,0.5)";
  c.lineWidth = 0.09;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.beginPath();
  c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i <= Math.min(n, Math.floor(reach)); i++) c.lineTo(pts[i][0], pts[i][1]);
  c.stroke();
});
