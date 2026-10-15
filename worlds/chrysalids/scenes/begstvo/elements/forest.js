const t = e.t;
function spruce(x, h, sw, col) {
  g.fillStyle = col;
  const T = 9;
  g.beginPath();
  g.moveTo(x + sw, -h - 0.5);
  for (let i = 1; i <= T; i++) {
    const f = i / T;
    const w = h * 0.2 * f + 0.25 + (e.rnd() - 0.3) * 0.35;
    const y = -h + h * 0.92 * f;
    g.lineTo(x + sw * (1 - f) + w * 0.4, y - h * 0.06);
    g.quadraticCurveTo(x + sw * (1 - f) + w * 0.9, y - h * 0.02, x + sw * (1 - f) + w, y + 0.15);
  }
  g.lineTo(x + 0.25, 0.4);
  g.lineTo(x - 0.25, 0.4);
  for (let i = T; i >= 1; i--) {
    const f = i / T;
    const w = h * 0.2 * f + 0.25 + (e.rnd() - 0.3) * 0.35;
    const y = -h + h * 0.92 * f;
    g.quadraticCurveTo(x + sw * (1 - f) - w * 0.9, y - h * 0.01, x + sw * (1 - f) - w, y + 0.2);
    g.lineTo(x + sw * (1 - f) - w * 0.4, y - h * 0.06);
  }
  g.closePath();
  g.fill();
}
function decid(x, h, sw, col) {
  g.fillStyle = col;
  g.beginPath();
  g.moveTo(x - 0.3, 0.4);
  g.quadraticCurveTo(x - 0.12, -h * 0.3, x - 0.18, -h * 0.5);
  g.lineTo(x + 0.18, -h * 0.5);
  g.quadraticCurveTo(x + 0.12, -h * 0.3, x + 0.3, 0.4);
  g.fill();
  for (let k = 0; k < 11; k++) {
    const a = (k / 11) * 6.28 + e.rnd();
    const rr = e.rnd();
    const cx = x + Math.cos(a) * h * 0.2 * rr + sw * 0.7,
      cy = -h * 0.66 + Math.sin(a) * h * 0.17 * rr;
    g.beginPath();
    g.ellipse(cx, cy, h * (0.09 + 0.06 * e.rnd()), h * (0.07 + 0.05 * e.rnd()), e.rnd(), 0, 7);
    g.fill();
  }
}
const S0 = 22;
const ramp = (x) => Math.min(1, 0.3 + Math.max(0, x - S0) / 22);
let i = 0;
for (let x = S0 + 6; x < 260; x += 1.6 + e.rnd() * 2.6) {
  i++;
  const h = (12 + e.rnd() * 7) * ramp(x);
  const sw = 0.12 * Math.sin(t * 0.13 + i * 0.9) + 0.06 * Math.sin(t * 0.31 + i * 1.7);
  spruce(x, h, sw, "#1a253d");
}
i = 0;
for (let x = S0; x < 260; x += 1.3 + e.rnd() * 2.4 + (x < S0 + 10 ? 2.5 * e.rnd() : 0)) {
  i++;
  const h = (9 + e.rnd() * 9) * ramp(x);
  const sw = 0.14 * Math.sin(t * 0.11 + i * 1.3) + 0.06 * Math.sin(t * 0.29 + i * 2.1);
  e.rnd() < 0.7 ? spruce(x, h, sw, "#131c30") : decid(x, h * 0.85, sw, "#131c30");
}
g.fillStyle = "#131c30";
for (let x = S0 - 6; x < 260; x += 0.9 + e.rnd() * 1.4) {
  const r = (0.5 + e.rnd() * 1.2) * Math.min(1, 0.3 + (x - S0 + 6) / 16);
  g.beginPath();
  g.ellipse(x, 0.1, r * 1.5, r, 0, Math.PI, 0);
  g.fill();
}
