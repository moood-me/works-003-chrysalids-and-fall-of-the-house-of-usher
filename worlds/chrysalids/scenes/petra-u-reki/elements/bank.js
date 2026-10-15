const ys = (x) => {
  if (x < -5.5) return -1.6 + 0.08 * Math.sin(x * 0.7);
  if (x > 2) return 0.25;
  const u = (x + 5.5) / 7.5;
  return -1.6 + 1.85 * u * u * (3 - 2 * u);
};
const wl = (x) => 0.25 + Math.pow(Math.max(0, x - 2), 1.25) * 0.75 + 0.05 * Math.sin(x * 4.1);
const edge = (x) => (x > 2 ? wl(x) : ys(x) + 0.015 * Math.sin(x * 9));
g.beginPath();
g.moveTo(-14, 4.5);
for (let x = -14; x <= 7.5; x += 0.08) g.lineTo(x, Math.min(4.5, edge(x)));
g.lineTo(7.5, 4.5);
g.closePath();
const gr = g.createLinearGradient(0, -1.8, 0, 4.5);
gr.addColorStop(0, "#5a5b4c");
gr.addColorStop(0.18, "#4e4a40");
gr.addColorStop(0.55, "#3d3932");
gr.addColorStop(1, "#2b2a25");
g.fillStyle = gr;
g.fill();
g.save();
g.clip();
for (let i = 0; i < 160; i++) {
  const x = -13 + e.rnd() * 20;
  const y = ys(Math.min(x, 2)) + 0.1 + e.rnd() * 4.2;
  const w = 0.3 + e.rnd() * 1.4,
    h = 0.05 + e.rnd() * 0.18;
  g.globalAlpha = 0.07 + e.rnd() * 0.08;
  g.fillStyle = e.rnd() < 0.5 ? "#25231f" : "#726c5e";
  g.beginPath();
  g.ellipse(x, y, w, h, 0.18 + e.rnd() * 0.2, 0, 7);
  g.fill();
}
for (let i = 0; i < 70; i++) {
  const x = -5 + e.rnd() * 11;
  const y = edge(x) + 0.05 + e.rnd() * 0.9;
  const L = 0.2 + e.rnd() * 0.6;
  g.globalAlpha = 0.08 + e.rnd() * 0.08;
  g.strokeStyle = "#7d786a";
  g.lineWidth = 0.02;
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(x + L * 0.5, y + L * 0.4, x + L * 0.6, y + L);
  g.stroke();
}
g.restore();
g.save();
g.beginPath();
for (let x = 1.2; x <= 7.5; x += 0.08) g.lineTo(x, edge(x));
for (let x = 7.5; x >= 1.2; x -= 0.08) g.lineTo(x - 0.25, edge(x) - 0.12);
g.closePath();
g.globalAlpha = 0.35;
g.fillStyle = "#7a7d74";
g.fill();
g.restore();
g.globalAlpha = 1;
g.lineCap = "round";
for (let i = 0; i < 520; i++) {
  const x = -14 + e.rnd() * 13.5;
  const y = edge(x) + 0.02 + e.rnd() * 0.08;
  const h = (0.08 + e.rnd() * 0.32) * (x < -5 ? 1 : 0.7);
  const ph = e.rnd() * 6.28;
  const s = 0.04 * Math.sin(e.t * 0.8 + ph + x) + 0.02 * Math.sin(e.t * 0.3 + ph);
  g.strokeStyle = e.rnd() < 0.5 ? "#4c5242" : "#5e6351";
  g.globalAlpha = 0.9;
  g.lineWidth = 0.018 + e.rnd() * 0.012;
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(x + s * 0.4, y - h * 0.6, x + s + 0.04, y - h);
  g.stroke();
}
const xd = Math.min((e.state.dv_a ?? -20) + 2.4, 1.9);
for (let x = -5; x < Math.min(xd, 1.5) - 0.4; x += 0.55 + 0.1 * Math.sin(x * 5)) {
  g.globalAlpha = 0.28;
  g.fillStyle = "#24221d";
  g.beginPath();
  g.ellipse(x, ys(x) + 0.06, 0.13, 0.035, 0.2, 0, 7);
  g.fill();
}
function reed(x, y, h, c, w, bend) {
  const ph = x * 3.7;
  const s = 0.07 * h * Math.sin(e.t * 0.5 + ph) + 0.03 * h * Math.sin(e.t * 0.19 + ph * 1.7) + bend * h;
  g.strokeStyle = c;
  g.lineWidth = w;
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(x + s * 0.2, y - h * 0.6, x + s, y - h);
  g.stroke();
  return s;
}
for (let c = 0; c < 5; c++) {
  const cx = 1.6 + c * 1.2 + e.rnd() * 0.6;
  const n = 10 + Math.floor(e.rnd() * 8);
  for (let i = 0; i < n; i++) {
    const x = cx + (e.rnd() - 0.5) * 0.8;
    const y = edge(x) + 0.04;
    const h = 0.35 + e.rnd() * 1.0 * (c < 3 ? 1 : 0.6);
    const bend = (e.rnd() - 0.4) * 0.35;
    g.globalAlpha = 0.92;
    const s = reed(x, y, h, e.rnd() < 0.5 ? "#2f332c" : "#3e4237", 0.016 + e.rnd() * 0.014, bend);
    if (e.rnd() < 0.08) {
      g.fillStyle = "#302b25";
      g.beginPath();
      g.ellipse(x + s, y - h - 0.06, 0.025, 0.08, s * 0.4, 0, 7);
      g.fill();
    }
  }
}
for (let i = 0; i < 55; i++) {
  const x = -13.5 + e.rnd() * 5;
  const h = 1.4 + e.rnd() * 2.4;
  reed(x, 4.6, h, e.rnd() < 0.5 ? "#232521" : "#2c2e29", 0.03 + e.rnd() * 0.03, (e.rnd() - 0.3) * 0.25);
}
g.globalAlpha = 1;
