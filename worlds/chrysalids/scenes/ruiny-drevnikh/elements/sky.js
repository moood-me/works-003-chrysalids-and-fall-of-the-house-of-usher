const A = e.aspect,
  S = e.state || {},
  s = S.sun ?? 0.2;
const L = (a, b, t) => "rgb(" + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",") + ")";
const LA = (a, b, t, al) => "rgba(" + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",") + "," + al + ")";
let gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, L([132, 146, 160], [104, 112, 134], s));
gr.addColorStop(0.3, L([172, 180, 182], [170, 160, 158], s));
gr.addColorStop(0.48, L([210, 207, 193], [216, 184, 152], s));
gr.addColorStop(0.58, L([228, 221, 202], [238, 202, 154], s));
gr.addColorStop(0.75, L([200, 198, 180], [196, 172, 140], s));
gr.addColorStop(1, L([170, 170, 154], [150, 132, 112], s));
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
function blob(cx, cy, rx, ry, st) {
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
  for (const q of st) rg.addColorStop(q[0], q[1]);
  g.save();
  g.translate(cx, cy);
  g.scale(rx, ry);
  g.fillStyle = rg;
  g.beginPath();
  g.arc(0, 0, 1, 0, 7);
  g.fill();
  g.restore();
}
const sx = A * (0.2 + 0.05 * s),
  sy = 0.16 + 0.3 * s;
const p = 1 + 0.03 * Math.sin(e.t * 0.23) + 0.015 * Math.sin(e.t * 0.61);
blob(sx, sy, 1.0, 0.75, [
  [0, LA([252, 240, 212], [252, 222, 170], s, (0.42 + 0.18 * s) * p)],
  [0.4, LA([246, 228, 194], [244, 206, 156], s, 0.14 + 0.14 * s)],
  [1, "rgba(240,220,190,0)"],
]);
blob(sx, sy, 0.1, 0.1, [
  [0, "rgba(255,249,232," + 0.8 * p + ")"],
  [0.3, "rgba(255,240,212,0.45)"],
  [1, "rgba(255,236,200,0)"],
]);
blob(A * 0.5, 0.58, 1.5, 0.1, [
  [0, LA([242, 232, 210], [246, 214, 170], s, 0.3 + 0.2 * s)],
  [1, "rgba(240,228,206,0)"],
]);
for (let c = 0; c < 9; c++) {
  const y = 0.06 + e.rnd() * 0.32;
  const len = 0.3 + e.rnd() * 0.5;
  const sp = 0.5 + e.rnd();
  let x = e.rnd() * (A + 1.2) - 0.6 + e.t * 0.0012 * sp;
  x = ((((x + 0.8) % (A + 1.6)) + (A + 1.6)) % (A + 1.6)) - 0.8;
  const n = 6 + Math.floor(e.rnd() * 5);
  for (let k = 0; k < n; k++) {
    const u = k / (n - 1) - 0.5;
    const cx = x + u * len + (e.rnd() - 0.5) * 0.04,
      cy = y + (e.rnd() - 0.5) * 0.012 + u * u * 0.01;
    const rx = 0.05 + e.rnd() * 0.08,
      ry = 0.007 + e.rnd() * 0.009;
    const a = (0.13 + 0.1 * e.rnd()) * (1 - Math.abs(u) * 1.2);
    if (a <= 0) continue;
    blob(cx, cy, rx, ry, [
      [0, LA([248, 244, 232], [252, 232, 200], s, a)],
      [1, "rgba(246,240,226,0)"],
    ]);
    blob(cx + 0.012, cy + ry * 0.8, rx * 0.8, ry * 0.5, [
      [0, LA([150, 154, 158], [176, 140, 128], s, a * 0.45)],
      [1, "rgba(150,150,150,0)"],
    ]);
  }
}
