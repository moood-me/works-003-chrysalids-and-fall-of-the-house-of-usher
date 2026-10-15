const A = e.aspect,
  S = e.state || {};
const c = S.craft ?? 0.6,
  d = S.dream ?? 0.7,
  w = S.waking ?? 0;
if (c < 0.01) return;
const cx0 = A * 0.665;
const defs = [
  [-0.07, 0.37, 1.0, 0.0],
  [0.14, 0.3, 0.72, 0.25],
  [-0.24, 0.43, 0.58, 0.55],
];
for (let k = 0; k < 3; k++) {
  const D = defs[k];
  const ap = Math.max(0, Math.min(1, (c - D[3]) / 0.3));
  if (ap <= 0) continue;
  const t = e.t;
  const x =
    cx0 +
    D[0] +
    (k == 0 && S.lead_x != null ? +S.lead_x : 0.035 * Math.sin(t * 0.031 + k * 2.1)) +
    0.012 * Math.sin(t * 0.077 + k);
  const y =
    D[1] -
    0.07 * c +
    (k == 0 && S.lead_y != null ? +S.lead_y : 0.008 * Math.sin(t * 0.05 + k * 1.3)) +
    0.003 * Math.sin(t * 0.19 + k);
  const L = (0.03 + 0.05 * c) * D[2];
  const vis = ap * (0.45 + 0.55 * d) * (1 - w);
  if (vis < 0.01) continue;
  const dir = k == 1 ? -1 : 1;
  const tilt = 0.03 * Math.sin(t * 0.07 + k) - 0.02;
  g.save();
  g.translate(x, y);
  g.save();
  g.scale(1, 0.45);
  let hg = g.createRadialGradient(0, 0, 0, 0, 0, L * 0.9);
  hg.addColorStop(0, "rgba(236,228,240," + 0.14 * vis + ")");
  hg.addColorStop(1, "rgba(236,228,240,0)");
  g.fillStyle = hg;
  g.beginPath();
  g.arc(0, 0, L * 0.9, 0, 7);
  g.fill();
  g.restore();
  g.save();
  g.translate(-L * 0.05 * dir, L * 0.085);
  g.scale(L * 0.5, L * 0.09);
  const ug = g.createRadialGradient(0, 0, 0, 0, 0, 1);
  ug.addColorStop(0, "rgba(250,236,236," + 0.35 * vis * (0.8 + 0.2 * Math.sin(t * 0.45 + k)) + ")");
  ug.addColorStop(1, "rgba(250,236,236,0)");
  g.fillStyle = ug;
  g.beginPath();
  g.arc(0, 0, 1, 0, 7);
  g.fill();
  g.restore();
  g.rotate(tilt * dir);
  g.scale(L * dir, L);
  const lw = e.px / L;
  g.globalAlpha = vis;
  function fin(a) {
    g.beginPath();
    g.moveTo(0.28, a * 0.04);
    g.bezierCurveTo(0.4, a * 0.05, 0.52, a * 0.09, 0.6, a * 0.13);
    g.bezierCurveTo(0.55, a * 0.07, 0.52, a * 0.03, 0.5, a * 0.006);
    g.closePath();
  }
  for (const a of [-1, 1]) {
    fin(a);
    g.fillStyle = "rgba(230,228,240,0.18)";
    g.fill();
    g.strokeStyle = "rgba(255,252,255,0.32)";
    g.lineWidth = lw * 0.8;
    g.stroke();
    g.strokeStyle = "rgba(255,250,255,0.12)";
    for (let j = 1; j < 4; j++) {
      g.beginPath();
      g.moveTo(0.3 + j * 0.05, a * (0.035 + j * 0.002));
      g.lineTo(0.42 + j * 0.05, a * (0.05 + j * 0.018));
      g.stroke();
    }
  }
  g.strokeStyle = "rgba(236,232,242,0.5)";
  g.lineWidth = lw * 1.4;
  g.beginPath();
  g.moveTo(-0.11, -0.09);
  g.lineTo(-0.1, -0.15);
  g.stroke();
  function H() {
    g.beginPath();
    g.moveTo(-0.5, 0.0);
    g.bezierCurveTo(-0.5, -0.07, -0.37, -0.096, -0.15, -0.096);
    g.bezierCurveTo(0.1, -0.096, 0.32, -0.048, 0.52, -0.006);
    g.lineTo(0.52, 0.004);
    g.bezierCurveTo(0.32, 0.042, 0.1, 0.078, -0.15, 0.08);
    g.bezierCurveTo(-0.37, 0.08, -0.5, 0.06, -0.5, 0.0);
    g.closePath();
  }
  H();
  const bg = g.createLinearGradient(0, -0.1, 0, 0.08);
  bg.addColorStop(0, "#f7f3f5");
  bg.addColorStop(0.4, "#d8d4de");
  bg.addColorStop(0.8, "#a3a2b6");
  bg.addColorStop(1, "#8c8ca2");
  g.fillStyle = bg;
  g.globalAlpha = vis * 0.86;
  g.fill();
  g.globalAlpha = vis;
  g.save();
  H();
  g.clip();
  const bands = [
    [200, 222, 242, 0.22],
    [244, 206, 224, 0.2],
    [212, 238, 226, 0.14],
    [236, 224, 250, 0.16],
  ];
  for (let j = 0; j < 4; j++) {
    const cc = bands[j];
    const bx = -0.32 + j * 0.22 + 0.06 * Math.sin(t * 0.09 + j * 1.7 + k);
    const byy = -0.05 + j * 0.028;
    g.save();
    g.translate(bx, byy);
    g.scale(0.34, 0.018);
    const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    rg.addColorStop(0, "rgba(" + cc[0] + "," + cc[1] + "," + cc[2] + "," + cc[3] + ")");
    rg.addColorStop(1, "rgba(" + cc[0] + "," + cc[1] + "," + cc[2] + ",0)");
    g.fillStyle = rg;
    g.beginPath();
    g.arc(0, 0, 1, 0, 7);
    g.fill();
    g.restore();
  }
  const sh = ((t * 0.03 + k * 0.5) % 1.6) - 0.8;
  const sg = g.createLinearGradient(sh - 0.12, 0, sh + 0.12, 0);
  sg.addColorStop(0, "rgba(255,250,250,0)");
  sg.addColorStop(0.5, "rgba(255,250,250,0.14)");
  sg.addColorStop(1, "rgba(255,250,250,0)");
  g.fillStyle = sg;
  g.fillRect(-0.6, -0.12, 1.2, 0.24);
  g.strokeStyle = "rgba(110,110,140,0.2)";
  g.lineWidth = lw * 0.8;
  g.beginPath();
  g.moveTo(-0.48, 0.03);
  g.bezierCurveTo(-0.2, 0.05, 0.15, 0.045, 0.5, 0.004);
  g.stroke();
  g.restore();
  g.strokeStyle = "rgba(255,253,252,0.6)";
  g.lineWidth = lw * 1.2;
  g.beginPath();
  g.moveTo(-0.47, -0.035);
  g.bezierCurveTo(-0.38, -0.088, -0.1, -0.094, 0.25, -0.062);
  g.stroke();
  for (let j = 0; j < 5; j++) {
    const pp = 0.6 + 0.4 * Math.sin(t * 0.5 + j * 0.9 + k);
    g.fillStyle = "rgba(255,226,196," + 0.55 * pp + ")";
    g.beginPath();
    g.ellipse(-0.34 + j * 0.075, -0.018, 0.008, 0.006, 0, 0, 7);
    g.fill();
  }
  g.save();
  g.translate(-0.1, -0.155);
  g.strokeStyle = "rgba(250,248,252,0.12)";
  g.lineWidth = lw;
  g.beginPath();
  g.ellipse(0, 0, 0.6, 0.036, 0, 0, 7);
  g.stroke();
  for (let j = 0; j < 3; j++) {
    const a = t * 1.2 + j * 2.094 + k;
    g.strokeStyle = "rgba(255,252,255,0.16)";
    g.lineWidth = lw * 1.3;
    g.beginPath();
    g.ellipse(0, 0, 0.58 - j * 0.12, 0.034 - j * 0.007, 0, a, a + 0.55);
    g.stroke();
  }
  g.restore();
  g.restore();
  e.light(x, y, L * 0.6, "#f2e2e6", 0.1 * vis);
}
