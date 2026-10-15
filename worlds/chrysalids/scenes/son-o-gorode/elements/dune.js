const S = e.state || {};
const li = S.lights ?? 0.7,
  w = S.waking ?? 0;
const top = (x) => {
  let y = -0.7 - 0.1 * Math.sin(-x * 0.5) - 0.04 * Math.sin(x * 1.9);
  if (x > 0.6) {
    const f = Math.min(1, (x - 0.6) / 4.5);
    y += 0.85 * f * f * (3 - 2 * f);
  }
  return y;
};
g.beginPath();
g.moveTo(-10, 2);
for (let x = -10; x <= 14; x += 0.1) g.lineTo(x, top(x));
g.lineTo(14, 2);
g.closePath();
const gr = g.createLinearGradient(0, -0.9, 0, 1.6);
gr.addColorStop(0, "#2a2944");
gr.addColorStop(0.4, "#1e1e35");
gr.addColorStop(1, "#121226");
g.fillStyle = gr;
g.fill();
g.save();
g.clip();
const sl = g.createLinearGradient(2, 0, 12, 0);
sl.addColorStop(0, "rgba(120,116,160,0)");
sl.addColorStop(1, "rgba(120,116,160,0.14)");
g.fillStyle = sl;
g.fillRect(2, -1, 12, 3);
g.save();
g.translate(7.5, 0.5);
g.scale(1, 0.2);
let rg = g.createRadialGradient(0, 0, 0, 0, 0, 5);
rg.addColorStop(0, "rgba(226,196,160," + 0.12 * li * (1 - w) + ")");
rg.addColorStop(1, "rgba(226,196,160,0)");
g.fillStyle = rg;
g.beginPath();
g.arc(0, 0, 5, 0, 7);
g.fill();
g.restore();
for (let i = 0; i < 90; i++) {
  const x = -9 + e.rnd() * 22,
    y = -0.6 + e.rnd() * 2.2,
    r = 0.3 + e.rnd() * 1.3;
  const rr = g.createRadialGradient(x, y, 0, x, y, r);
  rr.addColorStop(0, e.rnd() < 0.6 ? "rgba(10,10,24,0.28)" : "rgba(116,110,156,0.08)");
  rr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = rr;
  g.save();
  g.translate(x, y);
  g.scale(1, 0.28);
  g.translate(-x, -y);
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
  g.restore();
}
g.lineCap = "round";
for (let i = 0; i < 110; i++) {
  const x = -2 + e.rnd() * 14,
    y = top(x) + 0.06 + e.rnd() * 1.4,
    L = 0.15 + e.rnd() * 0.45,
    lt = e.rnd() < 0.35;
  g.strokeStyle = lt ? "rgba(150,144,190,0.08)" : "rgba(10,10,26,0.3)";
  g.lineWidth = 0.008 + 0.01 * Math.max(0, y);
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(x + L / 2, y - 0.02 - 0.02 * e.rnd(), x + L, y);
  g.stroke();
}
g.restore();
const hl = g.createLinearGradient(-8, 0, 5, 0);
hl.addColorStop(0, "rgba(232,206,170,0.04)");
hl.addColorStop(0.65, "rgba(232,206,170," + 0.32 * li * (1 - 0.7 * w) + ")");
hl.addColorStop(1, "rgba(232,206,170,0)");
g.strokeStyle = hl;
g.lineWidth = 0.016;
g.beginPath();
for (let x = -9; x <= 5; x += 0.1) {
  x == -9 ? g.moveTo(x, top(x) + 0.01) : g.lineTo(x, top(x) + 0.01);
}
g.stroke();
const lap = 0.05 * Math.sin(e.t * 0.33) + 0.025 * Math.sin(e.t * 0.71);
g.lineCap = "round";
for (let k = 0; k < 3; k++) {
  const off = k * 0.1 + lap * (1 + k * 0.6);
  for (let x = 3; x < 14; x += 0.12) {
    const m = Math.sin(x * 1.7 + k * 2 + e.t * 0.15) * 0.6 + Math.sin(x * 0.63 - k + e.t * 0.09) * 0.6;
    if (m < 0.1) continue;
    const a = (0.24 - k * 0.07) * Math.min(1, m) * (1 - 0.5 * w) * Math.min(1, (x - 3) / 1.5);
    const y1 = top(x) + off + 0.02 * Math.sin(x * 2.3 + e.t * 0.4 + k),
      y2 = top(x + 0.12) + off + 0.02 * Math.sin((x + 0.12) * 2.3 + e.t * 0.4 + k);
    g.strokeStyle = "rgba(206,200,228," + a + ")";
    g.lineWidth = 0.01;
    g.beginPath();
    g.moveTo(x, y1);
    g.lineTo(x + 0.12, y2);
    g.stroke();
  }
}
g.fillStyle = "#1a1a31";
for (let i = 0; i < 34; i++) {
  const x = 0.5 + e.rnd() * 6,
    y0 = top(x) + 0.02 + e.rnd() * e.rnd() * 1.0;
  const n = 3 + Math.floor(e.rnd() * 4);
  const ph = e.rnd() * 6.28;
  const sc = 0.7 + 0.5 * Math.max(0, y0);
  for (let j = 0; j < n; j++) {
    const h = (0.08 + e.rnd() * 0.22) * sc;
    const l = (e.rnd() - 0.5) * 0.8 + 0.06 * Math.sin(e.t * 0.4 + ph + j) + 0.03 * Math.sin(e.t * 0.93 + ph);
    g.beginPath();
    g.moveTo(x - 0.01, y0);
    g.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
    g.quadraticCurveTo(x + l * h * 0.4 + 0.005, y0 - h * 0.5, x + 0.01, y0);
    g.fill();
  }
}
for (let i = 0; i < 300; i++) {
  const x = -9 + Math.pow(e.rnd(), 0.7) * 10.5;
  const p = Math.min(1, Math.max(0, (1.0 - x) / 3.2));
  const keep = e.rnd();
  const h = 0.55 + e.rnd() * 0.45;
  const ph = e.rnd() * 6.28;
  const lean = (e.rnd() - 0.5) * 0.25;
  const dep = e.rnd();
  if (keep > p) continue;
  if (Math.abs(x) < 0.45) continue;
  const y0 = top(x) + dep * 0.45;
  const sw = 0.05 * Math.sin(e.t * 0.35 + ph + x * 0.4) + 0.025 * Math.sin(e.t * 0.83 + ph * 1.3);
  const mx = x + lean * h * 0.2,
    my = y0 - h * 0.6;
  const tx = x + (lean + sw) * h,
    ty = y0 - h;
  g.strokeStyle = dep > 0.5 ? "#17172b" : "#24243e";
  g.lineWidth = 0.012;
  g.beginPath();
  g.moveTo(x, y0);
  g.quadraticCurveTo(mx, my, tx, ty);
  g.stroke();
  const an = Math.atan2(ty - my, tx - mx);
  g.save();
  g.translate(tx, ty);
  g.rotate(an);
  g.fillStyle = dep > 0.5 ? "#17172b" : "#24243e";
  g.beginPath();
  g.ellipse(0.055, 0, 0.065, 0.018, 0, 0, 7);
  g.fill();
  g.strokeStyle = g.fillStyle;
  g.lineWidth = 0.004;
  for (let a = -1; a <= 1; a++) {
    g.beginPath();
    g.moveTo(0.1, a * 0.008);
    g.lineTo(0.2, a * 0.03);
    g.stroke();
  }
  g.strokeStyle = "rgba(236,210,160," + 0.28 * li * (1 - dep * 0.6) * (1 - 0.7 * w) + ")";
  g.lineWidth = 0.008;
  g.beginPath();
  g.ellipse(0.055, 0, 0.065, 0.018, 0, -2.6, -0.5);
  g.stroke();
  g.restore();
}
