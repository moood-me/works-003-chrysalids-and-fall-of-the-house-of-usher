const A = e.aspect,
  S = e.state || {},
  s = S.season ?? 0,
  r = S.rain ?? 0;
const M = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const C = (c, a) => "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (a === undefined ? 1 : a) + ")";
const top = M(M([132, 127, 116], [110, 113, 117], s), [84, 87, 93], r);
const mid = M(M([178, 167, 141], [150, 150, 146], s), [116, 119, 122], r);
const hor = M(M([210, 195, 157], [180, 177, 166], s), [146, 147, 146], r);
let gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, C(top));
gr.addColorStop(0.3, C(mid));
gr.addColorStop(0.56, C(hor));
gr.addColorStop(0.75, C(M(hor, [150, 135, 105], 0.5)));
gr.addColorStop(1, C(M(hor, [110, 98, 80], 0.6)));
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
function blob(cx, cy, rx, ry, col, a) {
  if (a <= 0) return;
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
  rg.addColorStop(0, C(col, a));
  rg.addColorStop(0.55, C(col, a * 0.45));
  rg.addColorStop(1, C(col, 0));
  g.save();
  g.translate(cx, cy);
  g.scale(rx, ry);
  g.fillStyle = rg;
  g.beginPath();
  g.arc(0, 0, 1, 0, 7);
  g.fill();
  g.restore();
}
const p = 1 + 0.05 * Math.sin(e.t * 0.13) + 0.03 * Math.sin(e.t * 0.31);
const SX = A * 0.47 + 0.01 * Math.sin(e.t * 0.02);
blob(SX, 0.3, 0.85, 0.34, M([240, 224, 184], [212, 212, 208], s), 0.36 * (1 - 0.7 * r) * p);
blob(SX + 0.03, 0.33, 0.32, 0.1, M([248, 236, 202], [228, 228, 224], s), 0.3 * (1 - 0.8 * r) * p);
const dk = M(M([122, 116, 106], [104, 106, 110], s), [78, 80, 86], r),
  lt = M(M([228, 216, 188], [202, 202, 200], s), [162, 164, 166], r);
for (let c = 0; c < 36; c++) {
  const y = -0.32 + Math.pow(e.rnd(), 0.8) * 0.86;
  const x0 = e.rnd() * (A + 2) - 1;
  const sp = (0.0012 + e.rnd() * 0.0016) * (1 + r);
  const x = ((((x0 + e.t * sp + 1) % (A + 2)) + (A + 2)) % (A + 2)) - 1;
  const ps = Math.max(0.22, 1 - (y + 0.3) * 0.95);
  const rx = 0.3 + e.rnd() * 0.6,
    ry = (0.03 + e.rnd() * 0.06) * ps;
  const dark = e.rnd() < 0.55;
  const a = (dark ? 0.17 + 0.16 * r : 0.15 * (1 - 0.5 * r)) * (0.8 + 0.2 * Math.sin(e.t * 0.05 + c));
  blob(x, y, rx, ry, dark ? dk : lt, a);
  if (dark) blob(x + 0.02, y + ry * 0.6, rx * 0.8, ry * 0.35, lt, 0.07 * (1 - r));
}
if (r > 0.02) {
  for (let i = 0; i < 7; i++) {
    const x = e.rnd() * A + 0.01 * Math.sin(e.t * 0.05 + i);
    blob(x, 0.5, 0.12 + e.rnd() * 0.1, 0.14, dk, 0.22 * r);
  }
}
const bc = C(M([74, 68, 60], [62, 62, 64], s), 0.55);
for (let i = 0; i < 4; i++) {
  const bx = ((e.rnd() * (A + 0.6) + e.t * (0.005 + 0.003 * e.rnd())) % (A + 0.6)) - 0.3;
  const by = 0.17 + e.rnd() * 0.16 + 0.012 * Math.sin(e.t * 0.27 + i);
  const f = Math.sin(e.t * (1.6 + 0.6 * e.rnd()) + i * 2);
  const k = 0.0065;
  g.fillStyle = bc;
  g.beginPath();
  g.moveTo(bx - k, by - k * 0.7 * f);
  g.quadraticCurveTo(bx - k * 0.4, by - k * 0.2, bx, by + k * 0.15);
  g.quadraticCurveTo(bx + k * 0.4, by - k * 0.2, bx + k, by - k * 0.7 * f);
  g.quadraticCurveTo(bx + k * 0.3, by + k * 0.15, bx, by + k * 0.4);
  g.quadraticCurveTo(bx - k * 0.3, by + k * 0.15, bx - k, by - k * 0.7 * f);
  g.fill();
}
