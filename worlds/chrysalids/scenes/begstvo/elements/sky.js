const A = e.aspect,
  S = e.state || {},
  d = S.dawn ?? 0.3,
  H = 0.62,
  DX = A * 0.74;
const L = (a, b, t) => "rgb(" + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",") + ")";
let gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, L([6, 11, 25], [18, 30, 54], d));
gr.addColorStop(0.3, L([13, 22, 43], [34, 52, 84], d));
gr.addColorStop(0.5, L([29, 43, 72], [66, 84, 112], d));
gr.addColorStop(0.61, L([54, 70, 100], [118, 128, 140], d));
gr.addColorStop(0.7, "#1a2438");
gr.addColorStop(1, "#0e1424");
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
for (let i = 0; i < 150; i++) {
  const x = -0.3 + e.rnd() * (A + 0.6),
    y = -0.35 + e.rnd() * 0.8,
    r = e.rnd();
  const tw = 0.5 + 0.5 * Math.sin(e.t * (0.3 + r) + i * 1.7);
  const nd = Math.max(0, 1 - Math.hypot(x - DX, (y - H) * 1.6) / 0.8);
  const a = (0.1 + 0.45 * r * r) * (0.6 + 0.4 * tw) * (1 - 0.85 * d) * (1 - nd) * (1 - Math.max(0, (y - 0.35) / 0.25));
  if (a <= 0) continue;
  g.globalAlpha = a;
  g.fillStyle = "#c9d4ea";
  const s = 0.0015 + r * 0.0016;
  g.fillRect(x, y, s, s);
}
g.globalAlpha = 1;
function blob(cx, cy, rx, ry, st) {
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
  for (const s of st) rg.addColorStop(s[0], s[1]);
  g.save();
  g.translate(cx, cy);
  g.scale(rx, ry);
  g.fillStyle = rg;
  g.beginPath();
  g.arc(0, 0, 1, 0, 7);
  g.fill();
  g.restore();
}
const p = 1 + 0.04 * Math.sin(e.t * 0.21) + 0.02 * Math.sin(e.t * 0.53);
blob(DX, H, 1.3, 0.34, [
  [0, "rgba(160,166,176," + (0.3 + 0.4 * d) * p + ")"],
  [0.5, "rgba(110,126,152," + (0.06 + 0.2 * d) + ")"],
  [1, "rgba(90,110,140,0)"],
]);
blob(DX, H - 0.012, 0.9, 0.085, [
  [0, "rgba(222,206,178," + (0.62 + 0.38 * d) * p + ")"],
  [0.6, "rgba(186,186,176," + (0.08 + 0.25 * d) + ")"],
  [1, "rgba(170,180,180,0)"],
]);
blob(DX + 0.04, H - 0.006, 0.42, 0.02, [
  [0, "rgba(236,218,184," + (0.6 + 0.4 * d) * p + ")"],
  [1, "rgba(220,206,180,0)"],
]);
const vx = A * 0.84,
  vy = 0.3,
  va = 0.45 + 0.4 * (1 - d) + 0.1 * Math.sin(e.t * 0.9);
let vg = g.createRadialGradient(vx, vy, 0, vx, vy, 0.012);
vg.addColorStop(0, "rgba(226,230,236," + va + ")");
vg.addColorStop(0.25, "rgba(210,218,230," + va * 0.35 + ")");
vg.addColorStop(1, "rgba(200,210,230,0)");
g.fillStyle = vg;
g.beginPath();
g.arc(vx, vy, 0.012, 0, 7);
g.fill();
