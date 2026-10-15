const S = e.state || {};
const ov = S.overgrowth ?? 0.6;
const s = S.sun ?? 0.2;
const L = (a, b, t) => "rgb(" + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",") + ")";
const lit = L([206, 198, 180], [220, 192, 152], s),
  mid = L([170, 164, 150], [172, 150, 126], s),
  dk = L([128, 124, 114], [120, 106, 94], s),
  deep = "#77736a";
g.save();
g.rotate(-0.022);
function pier(x, w, h) {
  const gr = g.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
  gr.addColorStop(0, lit);
  gr.addColorStop(0.4, mid);
  gr.addColorStop(1, dk);
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(x - w / 2 - 0.2, 0.4);
  g.lineTo(x - w / 2, -h);
  g.lineTo(x + w / 2, -h);
  g.lineTo(x + w / 2 + 0.2, 0.4);
  g.closePath();
  g.fill();
  g.fillStyle = mid;
  g.beginPath();
  g.moveTo(x - w / 2 - 0.35, -h);
  g.lineTo(x - w / 2 - 0.3, -h - 0.45);
  g.lineTo(x + w / 2 + 0.3, -h - 0.45);
  g.lineTo(x + w / 2 + 0.35, -h);
  g.closePath();
  g.fill();
  const sh = g.createLinearGradient(0, -h, 0, -h + 2.2);
  sh.addColorStop(0, "rgba(70,66,58,0.45)");
  sh.addColorStop(1, "rgba(70,66,58,0)");
  g.fillStyle = sh;
  g.fillRect(x - w / 2 - 0.2, -h, w + 0.4, 2.2);
  for (let i = 0; i < 7; i++) {
    const sx = x - w / 2 + e.rnd() * w,
      sl = 1 + e.rnd() * 4.5;
    const sg = g.createLinearGradient(0, -h, 0, -h + sl);
    sg.addColorStop(0, "rgba(88,82,70,0.3)");
    sg.addColorStop(1, "rgba(88,82,70,0)");
    g.fillStyle = sg;
    g.fillRect(sx, -h, 0.08 + e.rnd() * 0.2, sl);
  }
  const ag = g.createLinearGradient(0, -2, 0, 0.4);
  ag.addColorStop(0, "rgba(92,102,72,0)");
  ag.addColorStop(1, "rgba(92,102,72,0.5)");
  g.fillStyle = ag;
  g.fillRect(x - w / 2 - 0.2, -2, w + 0.4, 2.4);
}
pier(-5.2, 1.6, 6.7);
pier(5.0, 1.6, 6.7);
const top = (x) => -9.0 + 0.06 * Math.sin(x * 0.6) + 0.03 * Math.sin(x * 1.7);
const ux = (x) => {
  if (x > -4.4 && x < 4.2) {
    const u = (x + 0.1) / 4.3;
    return -7.15 - 1.1 * (1 - u * u);
  }
  return -7.15;
};
function deck() {
  g.beginPath();
  g.moveTo(-8.6, -7.4);
  g.lineTo(-8.9, -8.0);
  g.lineTo(-8.5, -8.35);
  g.lineTo(-8.8, -8.75);
  g.lineTo(-8.3, -9.0);
  for (let x = -8; x <= 16; x += 0.4) g.lineTo(x, top(x));
  g.lineTo(16, -7.15);
  g.lineTo(5.8, -7.15);
  g.lineTo(4.2, -7.15);
  for (let x = 4.2; x >= -4.4; x -= 0.2) g.lineTo(x, ux(x));
  g.lineTo(-6.0, -7.15);
  g.lineTo(-7.6, -7.25);
  g.lineTo(-7.9, -7.05);
  g.lineTo(-8.3, -7.3);
  g.closePath();
}
let dg = g.createLinearGradient(0, -9.1, 0, -7.1);
dg.addColorStop(0, lit);
dg.addColorStop(0.18, lit);
dg.addColorStop(0.24, mid);
dg.addColorStop(0.75, dk);
dg.addColorStop(1, deep);
deck();
g.fillStyle = dg;
g.fill();
g.save();
deck();
g.clip();
g.fillStyle = "rgba(70,66,58,0.28)";
g.beginPath();
g.moveTo(4.2, -7.15);
for (let x = 4.2; x >= -4.4; x -= 0.2) g.lineTo(x, ux(x));
for (let x = -4.4; x <= 4.2; x += 0.2) g.lineTo(x, ux(x) - 0.35);
g.closePath();
g.fill();
for (let i = 0; i < 22; i++) {
  const x = -8 + e.rnd() * 23,
    sl = 0.5 + e.rnd() * 1.4;
  const sg = g.createLinearGradient(0, -8.7, 0, -8.7 + sl);
  sg.addColorStop(0, "rgba(88,82,70,0.28)");
  sg.addColorStop(1, "rgba(88,82,70,0)");
  g.fillStyle = sg;
  g.fillRect(x, -8.75, 0.1 + e.rnd() * 0.35, sl);
}
g.strokeStyle = "rgba(84,78,68,0.45)";
g.lineWidth = 0.04;
for (let i = 0; i < 7; i++) {
  let x = -8 + e.rnd() * 22,
    y = top(x) + 0.1;
  g.beginPath();
  g.moveTo(x, y);
  for (let k = 0; k < 4; k++) {
    x += (e.rnd() - 0.5) * 0.6;
    y += 0.25 + e.rnd() * 0.25;
    g.lineTo(x, y);
  }
  g.stroke();
}
g.restore();
g.fillStyle = lit;
for (let x = -7.8; x < 16; x += 0.6 + e.rnd() * 0.3) {
  if (e.rnd() < 0.28) {
    x += 0.8;
    continue;
  }
  const w = 0.5 + e.rnd() * 0.25,
    hh = 0.45 + e.rnd() * 0.15;
  g.beginPath();
  g.moveTo(x, top(x) + 0.02);
  g.lineTo(x + 0.06, top(x) - hh);
  g.lineTo(x + w - 0.06, top(x) - hh + 0.03 * (e.rnd() - 0.5));
  g.lineTo(x + w, top(x) + 0.02);
  g.closePath();
  g.fill();
}
g.strokeStyle = "rgba(106,78,60,0.85)";
g.lineWidth = 0.06;
g.lineCap = "round";
for (let i = 0; i < 8; i++) {
  const y0 = -8.8 + i * 0.2;
  const ex = -9.2 - e.rnd() * 0.9,
    ey = y0 + 0.4 + e.rnd() * 1.4;
  g.beginPath();
  g.moveTo(-8.6, y0);
  g.quadraticCurveTo(-9.2, y0 - 0.2, ex, ey);
  g.stroke();
}
g.fillStyle = mid;
g.beginPath();
g.moveTo(-8.4, -7.3);
g.lineTo(-9.4, -6.2);
g.lineTo(-9.0, -5.7);
g.lineTo(-8.0, -6.9);
g.closePath();
g.fill();
const leafC = ["#6b7853", "#56623f", "#86915f", "#737f56", "#5e6b47"];
const nv = Math.round(4 + 12 * ov);
for (let i = 0; i < nv; i++) {
  const x = -8 + e.rnd() * 23.5;
  if ((x > -6.2 && x < -4.2) || (x > 4.0 && x < 6.0)) {
    e.rnd();
    e.rnd();
    continue;
  }
  const len = (0.3 + 4.2 * ov) * (0.25 + 0.75 * e.rnd());
  const ph = e.rnd() * 6.28;
  const y0 = ux(x) - 0.1;
  const wid = 0.25 + 0.6 * e.rnd();
  const strands = 3 + Math.floor(wid * 6);
  for (let st = 0; st < strands; st++) {
    const sx = x + (st / (strands - 1) - 0.5) * wid;
    const sl = len * (0.4 + 0.6 * Math.abs(Math.sin(st * 2.3 + ph)));
    const sw = (0.18 * Math.sin(e.t * 0.41 + ph + st * 0.4) + 0.07 * Math.sin(e.t * 1.07 + ph * 2)) * (sl / 4);
    const n = Math.max(2, Math.round(sl * 4));
    for (let j = 0; j <= n; j++) {
      const t = j / n;
      const px = sx + sw * t * t + 0.06 * Math.sin(t * 4 + ph + st),
        py = y0 + sl * t;
      const sz = 0.16 * (1 - 0.5 * t) * (0.7 + 0.6 * Math.abs(Math.sin(j * 1.7 + st)));
      g.fillStyle = leafC[(j * 3 + st * 7 + i) % 5];
      g.beginPath();
      g.ellipse(px + 0.07 * Math.sin(j * 2.1 + st), py, sz, sz * 0.6, Math.sin(j + st), 0, 7);
      g.fill();
    }
  }
}
for (let i = 0; i < Math.round(40 + 80 * ov); i++) {
  const x = -8 + e.rnd() * 23.5;
  const y0 = top(x) + 0.05;
  const h = (0.15 + 0.6 * ov) * (0.3 + 0.7 * e.rnd());
  const l = (e.rnd() - 0.5) * 0.8 + 0.1 * Math.sin(e.t * 0.5 + i);
  g.fillStyle = e.rnd() < 0.3 ? "#a19a6c" : "#7d8a5c";
  g.beginPath();
  g.moveTo(x - 0.05, y0);
  g.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.02, y0 - h * 0.5, x + 0.05, y0);
  g.fill();
}
if (ov > 0.2) {
  const k = (ov - 0.2) / 0.8;
  const bx = 9.6,
    by = top(9.6) + 0.05,
    h = 0.6 + 2.6 * k;
  const sw = 0.05 * h * Math.sin(e.t * 0.5) + 0.025 * h * Math.sin(e.t * 1.3);
  g.fillStyle = "#ddd8c8";
  g.beginPath();
  g.moveTo(bx - 0.07, by);
  g.quadraticCurveTo(bx + 0.05, by - h * 0.5, bx + sw, by - h);
  g.lineTo(bx + sw + 0.03, by - h);
  g.quadraticCurveTo(bx + 0.08, by - h * 0.5, bx + 0.07, by);
  g.closePath();
  g.fill();
  for (let j = 0; j < Math.round(14 + 26 * k); j++) {
    const t = 0.3 + 0.7 * e.rnd();
    const lx = bx + sw * t + (e.rnd() - 0.5) * h * 0.5 * (1.2 - t),
      ly = by - h * t + 0.1 * e.rnd();
    g.fillStyle = leafC[j % 5];
    g.beginPath();
    g.ellipse(lx, ly, 0.13 + 0.08 * e.rnd(), 0.08 + 0.05 * e.rnd(), e.rnd(), 0, 7);
    g.fill();
  }
}
for (let i = 0; i < Math.round(80 * ov); i++) {
  const left = i % 2 === 0;
  const px = left ? -6.0 + Math.pow(e.rnd(), 0.7) * 0.8 : 4.2 + e.rnd() * 0.8;
  const py = 0.3 - Math.pow(e.rnd(), 1.3) * 6.5 * ov;
  g.fillStyle = leafC[i % 5];
  g.beginPath();
  g.ellipse(px, py, 0.15 + 0.1 * e.rnd(), 0.1, e.rnd() * 3, 0, 7);
  g.fill();
}
g.restore();
for (let i = 0; i < 16; i++) {
  const x = -14 + e.rnd() * 30;
  const r = 0.3 + e.rnd() * 0.7 * (0.5 + ov);
  g.fillStyle = e.rnd() < 0.5 ? "#76825b" : "#7e8a63";
  g.beginPath();
  g.moveTo(x - r * 2.2, 0.5);
  g.bezierCurveTo(x - r * 1.4, 0.5 - r * 0.5, x - r * 0.6, 0.5 - r * 0.75 - 0.1 * e.rnd(), x + r * 0.2, 0.5 - r * 0.7);
  g.bezierCurveTo(x + r * 1.0, 0.5 - r * 0.6, x + r * 1.6, 0.5 - r * 0.3, x + r * 2.4, 0.5);
  g.closePath();
  g.fill();
}
for (let i = 0; i < 300; i++) {
  const x = -15 + e.rnd() * 31;
  const y0 = 0.4 + e.rnd() * 0.25;
  const nearP = Math.abs(x + 5.2) < 1.4 || Math.abs(x - 5) < 1.4 ? 1.6 : 1;
  const h = (0.25 + 0.9 * ov) * (0.25 + 0.75 * e.rnd()) * nearP;
  const ph = e.rnd() * 6.28;
  const l = (e.rnd() - 0.5) * 0.7 + 0.09 * Math.sin(e.t * 0.45 + ph) + 0.04 * Math.sin(e.t * 1.1 + ph);
  const c = e.rnd();
  g.fillStyle = c < 0.25 ? "#a69f72" : c < 0.6 ? "#7c8860" : "#6c7853";
  g.beginPath();
  g.moveTo(x - 0.06, y0);
  g.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.02, y0 - h * 0.5, x + 0.06, y0);
  g.fill();
}
