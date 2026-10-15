const S = e.state || {};
const ov = S.overgrowth ?? 0.6;
const s = S.sun ?? 0.2;
const topf = (x) =>
  x < 1.6 ? -3.7 + 0.15 * Math.sin(x * 2.3) + 0.08 * Math.sin(x * 5.1) : -3.7 + (x - 1.6) * 1.5 + 0.1 * Math.sin(x * 6);
function wall() {
  g.beginPath();
  g.moveTo(-3.6, 0.4);
  g.lineTo(-3.62, -2.9);
  g.lineTo(-3.45, -3.35);
  for (let x = -3.3; x <= 3.4; x += 0.1) g.lineTo(x, topf(x));
  g.lineTo(3.45, 0.4);
  g.closePath();
}
wall();
g.fillStyle = "#9d978a";
g.fill();
g.save();
wall();
g.clip();
const cols = ["#aab5b1", "#b7beb5", "#a2aca8", "#bfc3b8", "#b0b8b0"];
for (let ty = -3.6; ty < -0.5; ty += 0.3) {
  for (let tx = -3.4; tx < 3.4; tx += 0.3) {
    const r = e.rnd();
    const edge = Math.max(0, (tx - 1.0) / 2.4) + Math.max(0, (-3.2 - ty) * 0.8);
    if (r < 0.12 + 0.35 * edge) continue;
    g.fillStyle = cols[Math.floor(e.rnd() * 5)];
    g.fillRect(tx + 0.018, ty + 0.018, 0.265, 0.265);
  }
}
const lg = g.createLinearGradient(-3.6, 0, 3.4, 0);
lg.addColorStop(0, s > 0.4 ? "rgba(255,220,170,0.16)" : "rgba(255,244,220,0.14)");
lg.addColorStop(1, "rgba(70,70,60,0.2)");
g.fillStyle = lg;
g.fillRect(-4, -4, 8, 4.5);
for (let i = 0; i < 8; i++) {
  const x = -3.4 + e.rnd() * 6.6,
    sl = 0.6 + e.rnd() * 2;
  const sg = g.createLinearGradient(0, -3.6, 0, -3.6 + sl);
  sg.addColorStop(0, "rgba(96,90,76,0.28)");
  sg.addColorStop(1, "rgba(96,90,76,0)");
  g.fillStyle = sg;
  g.fillRect(x, -3.7, 0.1 + e.rnd() * 0.25, sl);
}
g.save();
g.translate(-1.3, -2.25);
g.rotate(0.06);
g.fillStyle = "rgba(184,164,118,0.9)";
g.fillRect(-0.95, -0.34, 1.9, 0.68);
const rg = g.createLinearGradient(0, 0.34, 0, 1.2);
rg.addColorStop(0, "rgba(124,90,64,0.35)");
rg.addColorStop(1, "rgba(124,90,64,0)");
g.fillStyle = rg;
g.fillRect(-0.7, 0.34, 0.5, 0.9);
g.fillRect(0.3, 0.34, 0.3, 0.6);
g.fillStyle = "rgba(104,90,68,0.5)";
const gl = [
  [1, 1, 0, 1],
  [1, 0, 1, 1],
  [0, 1, 1, 0],
  [1, 1, 1, 0],
  [1, 0, 0, 1],
  [0, 1, 0, 1],
];
for (let k = 0; k < 6; k++) {
  const x = -0.78 + k * 0.27;
  const q = gl[k];
  if (q[0]) g.fillRect(x, -0.2, 0.05, 0.38);
  if (q[1]) g.fillRect(x, -0.2, 0.17, 0.05);
  if (q[2]) g.fillRect(x + 0.12, -0.2, 0.05, 0.38);
  if (q[3]) g.fillRect(x, -0.03, 0.15, 0.045);
}
g.fillStyle = "rgba(150,150,138,0.5)";
g.fillRect(-0.95, -0.34, 0.5, 0.25);
g.fillRect(0.4, 0.05, 0.55, 0.29);
g.restore();
g.restore();
g.fillStyle = "#878276";
g.beginPath();
g.moveTo(3.45, 0.4);
for (let x = 3.4; x >= 1.6; x -= 0.1) g.lineTo(x + 0.08, topf(x) + 0.05);
g.lineTo(1.75, topf(1.6) + 0.3);
g.lineTo(3.5, 0.4);
g.closePath();
g.fill();
const leafC = ["#66734f", "#55613f", "#7d8a5c", "#6f7b55"];
for (let i = 0; i < Math.round(140 * ov); i++) {
  const fromTop = e.rnd() < 0.4;
  let x, y;
  if (fromTop) {
    x = -3.5 + e.rnd() * 4.8;
    y = topf(x) + e.rnd() * 1.2 * ov * e.rnd();
  } else {
    x = -3.7 + Math.pow(e.rnd(), 1.5) * 4;
    y = 0.3 - Math.pow(e.rnd(), 1.3) * 3.2 * ov;
  }
  g.fillStyle = leafC[i % 4];
  g.beginPath();
  g.ellipse(x, y, 0.13 + 0.07 * e.rnd(), 0.08 + 0.04 * e.rnd(), e.rnd() * 3, 0, 7);
  g.fill();
}
for (let i = 0; i < 200; i++) {
  const x = -4.5 + e.rnd() * 9;
  const y0 = 0.35 + e.rnd() * 0.2;
  const h = (0.2 + 0.7 * ov) * (0.3 + 0.7 * e.rnd());
  const ph = e.rnd() * 6.28;
  const l = (e.rnd() - 0.5) * 0.7 + 0.09 * Math.sin(e.t * 0.45 + ph);
  const c = e.rnd();
  g.fillStyle = c < 0.3 ? "#a69f72" : c < 0.65 ? "#7c8860" : "#6c7853";
  g.beginPath();
  g.moveTo(x - 0.05, y0);
  g.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.02, y0 - h * 0.5, x + 0.05, y0);
  g.fill();
}
