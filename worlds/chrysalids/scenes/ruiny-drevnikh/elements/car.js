const S = e.state || {};
const ov = S.overgrowth ?? 0.6;
const s = S.sun ?? 0.2;
const L = (a, b, t) => "rgb(" + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",") + ")";
let sg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
sg.addColorStop(0, "rgba(58,64,44,0.32)");
sg.addColorStop(1, "rgba(58,64,44,0)");
g.save();
g.translate(0.9, 0.14);
g.scale(3.3, 0.24);
g.fillStyle = sg;
g.beginPath();
g.arc(0, 0, 1, 0, 7);
g.fill();
g.restore();
g.save();
g.translate(0, 0.3);
g.rotate(-0.05);
function body() {
  g.beginPath();
  g.moveTo(2.2, 0.05);
  g.bezierCurveTo(2.42, -0.15, 2.45, -0.45, 2.25, -0.62);
  g.bezierCurveTo(2.0, -0.78, 1.75, -0.82, 1.5, -0.86);
  g.bezierCurveTo(1.2, -1.25, 0.7, -1.45, 0.1, -1.46);
  g.bezierCurveTo(-0.45, -1.45, -0.8, -1.2, -1.05, -0.9);
  g.bezierCurveTo(-1.25, -0.86, -1.4, -0.98, -1.62, -0.96);
  g.bezierCurveTo(-1.95, -0.93, -2.2, -0.82, -2.32, -0.6);
  g.bezierCurveTo(-2.45, -0.4, -2.42, -0.2, -2.3, 0.05);
  g.closePath();
}
let gr = g.createLinearGradient(0, -1.35, 0, 0.05);
gr.addColorStop(0, L([146, 124, 106], [166, 128, 98], s));
gr.addColorStop(0.45, L([118, 94, 78], [128, 94, 72], s));
gr.addColorStop(1, "#4f4238");
body();
g.fillStyle = gr;
g.fill();
g.save();
body();
g.clip();
const hg = g.createLinearGradient(-2.4, 0, 2.4, 0);
hg.addColorStop(0, "rgba(255,236,206,0.1)");
hg.addColorStop(1, "rgba(40,30,24,0.18)");
g.fillStyle = hg;
g.fillRect(-2.5, -1.4, 5, 1.5);
for (let i = 0; i < 26; i++) {
  const x = -2.2 + e.rnd() * 4.5,
    y = -1.2 + e.rnd() * 1.2,
    r = 0.08 + e.rnd() * 0.32;
  const rg = g.createRadialGradient(x, y, 0, x, y, r);
  const c = e.rnd();
  rg.addColorStop(0, c < 0.55 ? "rgba(82,54,40,0.45)" : c < 0.8 ? "rgba(146,146,126,0.28)" : "rgba(160,104,72,0.3)");
  rg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = rg;
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
}
g.strokeStyle = "rgba(62,44,36,0.5)";
g.lineWidth = 0.02;
g.beginPath();
g.moveTo(-0.95, -0.86);
g.quadraticCurveTo(-1.0, -0.4, -0.97, -0.05);
g.moveTo(0.2, -0.88);
g.quadraticCurveTo(0.24, -0.4, 0.22, -0.05);
g.moveTo(1.25, -0.84);
g.quadraticCurveTo(1.27, -0.4, 1.2, -0.1);
g.stroke();
g.strokeStyle = "rgba(206,196,176,0.16)";
g.lineWidth = 0.03;
g.beginPath();
g.moveTo(-2.3, -0.5);
g.quadraticCurveTo(0, -0.47, 2.38, -0.5);
g.stroke();
g.fillStyle = "rgba(52,40,34,0.75)";
g.beginPath();
g.moveTo(0.26, -0.86);
g.lineTo(1.2, -0.84);
g.quadraticCurveTo(1.22, -0.4, 1.16, -0.1);
g.lineTo(0.28, -0.08);
g.closePath();
g.fill();
g.restore();
function win(P) {
  g.beginPath();
  g.moveTo(P[0], P[1]);
  for (let i = 2; i < P.length; i += 2) g.lineTo(P[i], P[i + 1]);
  g.closePath();
}
const W1 = [-0.85, -0.92, -0.62, -1.18, -0.3, -1.32, 0.08, -1.34, 0.08, -0.92],
  W2 = [0.24, -0.92, 0.24, -1.34, 0.6, -1.3, 0.95, -1.14, 1.2, -0.92];
for (const W of [W1, W2]) {
  win(W);
  g.fillStyle = "#3f3832";
  g.fill();
  g.save();
  win(W);
  g.clip();
  const sk = g.createLinearGradient(0, -1.22, 0, -0.9);
  sk.addColorStop(0, "rgba(214,208,184,0.55)");
  sk.addColorStop(0.6, "rgba(150,156,120,0.4)");
  sk.addColorStop(1, "rgba(90,100,70,0.3)");
  g.fillStyle = sk;
  g.fillRect(-1, -1.4, 2.4, 0.5);
  g.fillStyle = "#55603f";
  for (let i = 0; i < 34; i++) {
    const x = -0.9 + e.rnd() * 2;
    const h = 0.04 + e.rnd() * (0.1 + 0.2 * ov);
    g.beginPath();
    g.moveTo(x - 0.015, -0.88);
    g.lineTo(x + 0.03 * Math.sin(e.t * 0.5 + i), -0.88 - h);
    g.lineTo(x + 0.015, -0.88);
    g.fill();
  }
  g.restore();
}
g.strokeStyle = s > 0.5 ? "rgba(246,206,150,0.5)" : "rgba(238,220,188,0.42)";
g.lineWidth = 0.035;
g.beginPath();
g.moveTo(-2.3, -0.62);
g.bezierCurveTo(-2.15, -0.85, -1.9, -0.93, -1.62, -0.96);
g.moveTo(-1.0, -0.95);
g.bezierCurveTo(-0.8, -1.2, -0.45, -1.45, 0.1, -1.46);
g.bezierCurveTo(0.4, -1.46, 0.6, -1.43, 0.8, -1.38);
g.stroke();
g.fillStyle = "#3a332c";
for (const wx of [-1.45, 1.5]) {
  g.beginPath();
  g.ellipse(wx, 0.06, 0.44, 0.42, 0, Math.PI, 0);
  g.fill();
}
g.restore();
const gc = ["#6f7b56", "#7f875d", "#9e966a", "#5e6a48"];
for (let i = 0; i < 280; i++) {
  const x = -2.7 + e.rnd() * 5.6;
  const y0 = 0.1 + e.rnd() * 0.2;
  const h = (0.2 + 0.55 * ov) * (0.3 + 0.7 * e.rnd()) * (1 - (0.25 * Math.abs(x)) / 2.7);
  const ph = e.rnd() * 6.28;
  const l = (e.rnd() - 0.5) * 0.7 + 0.08 * Math.sin(e.t * 0.43 + ph) + 0.03 * Math.sin(e.t * 1.07 + ph);
  g.fillStyle = gc[Math.floor(e.rnd() * 4)];
  g.beginPath();
  g.moveTo(x - 0.025, y0);
  g.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.01, y0 - h * 0.5, x + 0.025, y0);
  g.fill();
}
if (ov > 0.1) {
  const k = Math.min(1, (ov - 0.1) / 0.8);
  const BC = ["#525d3c", "#454f33", "#5f6a46", "#4b5637"];
  const n = Math.round(420 * k);
  for (let i = 0; i < n; i++) {
    const u = e.rnd(),
      v = e.rnd();
    const bx = -2.7 + u * (1.2 + 1.4 * k);
    const top = -0.15 - (0.55 + 0.5 * k) * Math.sin(Math.PI * Math.min(1, u * 1.1)) * (0.6 + 0.4 * e.rnd());
    const by = 0.25 + (top - 0.25) * Math.sqrt(v);
    const sw = 0.02 * Math.sin(e.t * 0.5 + i * 0.7) * (0.25 - by);
    g.fillStyle = BC[i % 4];
    g.beginPath();
    g.ellipse(bx + sw, by, 0.05 + 0.03 * e.rnd(), 0.032 + 0.015 * e.rnd(), e.rnd() * 3, 0, 7);
    g.fill();
    if (i % 37 === 0) {
      g.fillStyle = "#3b3034";
      g.beginPath();
      g.arc(bx + 0.03, by + 0.03, 0.022, 0, 7);
      g.fill();
    }
  }
  g.strokeStyle = "#4a4f36";
  g.lineWidth = 0.018;
  g.lineCap = "round";
  for (let c2 = 0; c2 < 3; c2++) {
    if (c2 > k * 3) break;
    const x0 = -2.3 + c2 * 0.5;
    const sw = 0.03 * Math.sin(e.t * 0.4 + c2);
    g.beginPath();
    g.moveTo(x0, -0.2);
    g.quadraticCurveTo(x0 + 0.4, -1.1 - 0.2 * c2 + sw, x0 + 0.9 + 0.3 * c2, -0.75 + sw);
    g.stroke();
    for (let j = 1; j < 6; j++) {
      const t = j / 6,
        it = 1 - t;
      const px = it * it * x0 + 2 * it * t * (x0 + 0.4) + t * t * (x0 + 0.9 + 0.3 * c2),
        py = it * it * -0.2 + 2 * it * t * (-1.1 - 0.2 * c2 + sw) + t * t * (-0.75 + sw);
      g.fillStyle = BC[(j + c2) % 4];
      g.beginPath();
      g.ellipse(px, py + 0.03, 0.05, 0.032, j, 0, 7);
      g.fill();
    }
  }
}
for (let i = 0; i < 9; i++) {
  const x = -2.4 + e.rnd() * 5;
  const h = 0.35 + 0.4 * e.rnd() * (0.5 + ov);
  const sw = 0.04 * Math.sin(e.t * 0.5 + i * 1.3);
  g.strokeStyle = "rgba(106,118,82,0.9)";
  g.lineWidth = 0.012;
  g.beginPath();
  g.moveTo(x, 0.2);
  g.quadraticCurveTo(x, 0.2 - h * 0.5, x + sw, 0.2 - h);
  g.stroke();
  g.fillStyle = "rgba(228,222,200,0.9)";
  for (let m = 0; m < 6; m++) {
    g.beginPath();
    g.arc(x + sw + (m - 2.5) * 0.018, 0.2 - h - 0.01 * Math.sin(m * 1.3), 0.014, 0, 7);
    g.fill();
  }
}
