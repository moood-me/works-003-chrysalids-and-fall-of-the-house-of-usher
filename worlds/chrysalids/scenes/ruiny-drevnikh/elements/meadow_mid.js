const D = 12,
  d0 = 9.5,
  d1 = 13.9,
  N = 200;
const S = e.state || {};
const ov = S.overgrowth ?? 0.6;
const s = S.sun ?? 0.2;
const pal = ["#6f7b55", "#7a865d", "#66724e", "#838d63"],
  dry = ["#9d9569", "#a8a074"];
const C = [];
for (let i = 0; i < N; i++) {
  const d = d0 + (d1 - d0) * e.rnd();
  C.push([d, e.rnd(), e.rnd(), e.rnd(), e.rnd(), e.rnd()]);
}
C.sort((a, b) => b[0] - a[0]);
for (const c of C) {
  const [d, r1, r2, r3, r4, r5] = c;
  const k = D / d;
  const cy = (1.7 / d - 1.7 / D) * D;
  const cx = (r1 - 0.5) * 2.1 * D;
  if (r5 < 0.25) {
    const r = (0.6 + r4 * 1.4) * k;
    const pg = g.createRadialGradient(cx, cy, 0, cx, cy, r);
    pg.addColorStop(0, r4 < 0.6 ? "rgba(64,74,48,0.16)" : "rgba(170,166,120,0.12)");
    pg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = pg;
    g.save();
    g.translate(cx, cy);
    g.scale(2.4, 0.3);
    g.translate(-cx, -cy);
    g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    g.restore();
  }
  const n = 4 + Math.floor(r2 * 9);
  const H = (0.1 + 0.3 * ov) * (0.35 + 0.65 * r3) * k;
  const ph = r4 * 6.28;
  for (let j = 0; j < n; j++) {
    const x = cx + (e.rnd() - 0.5) * 0.4 * k;
    const h = H * (0.4 + 0.6 * e.rnd());
    const l =
      ((x - cx) / k) * 1.2 +
      (e.rnd() - 0.5) * 0.3 +
      0.08 * Math.sin(e.t * 0.42 + ph + j * 0.2) +
      0.03 * Math.sin(e.t * 1.1 + ph);
    g.fillStyle = e.rnd() < 0.16 ? dry[j % 2] : pal[Math.floor(e.rnd() * 4)];
    const w = 0.011 * k;
    g.beginPath();
    g.moveTo(x - w, cy + 0.01 * k);
    g.quadraticCurveTo(x + l * h * 0.4, cy - h * 0.6, x + l * h, cy - h);
    g.quadraticCurveTo(x + l * h * 0.4 + w * 0.5, cy - h * 0.5, x + w, cy + 0.01 * k);
    g.fill();
  }
  if (r5 > 0.972) {
    const h = H * 1.5 + 0.1 * k;
    const sw = 0.04 * k * Math.sin(e.t * 0.5 + ph);
    g.strokeStyle = "rgba(110,122,84,0.9)";
    g.lineWidth = 0.008 * k;
    g.beginPath();
    g.moveTo(cx, cy);
    g.quadraticCurveTo(cx, cy - h * 0.5, cx + sw, cy - h);
    g.stroke();
    g.fillStyle = r4 < 0.75 ? "rgba(222,216,192,0.85)" : "rgba(214,198,138,0.95)";
    for (let m = 0; m < 6; m++) {
      const a = (m / 6) * 6.28;
      g.beginPath();
      g.arc(cx + sw + Math.cos(a) * 0.022 * k, cy - h - 0.008 * k + Math.sin(a) * 0.008 * k, 0.012 * k, 0, 7);
      g.fill();
    }
  }
}
