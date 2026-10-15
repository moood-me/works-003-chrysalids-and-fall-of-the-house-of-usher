const S = e.state || {};
const ov = S.overgrowth ?? 0.6;
const s = 0;
g.save();
g.rotate(0.17);
const gr = g.createLinearGradient(-0.14, 0, 0.14, 0);
gr.addColorStop(0, s > 0.5 ? "#a99478" : "#9c9586");
gr.addColorStop(0.5, "#78726a");
gr.addColorStop(1, "#5c574f");
g.fillStyle = gr;
g.beginPath();
g.moveTo(-0.24, 0.3);
g.lineTo(-0.17, -0.5);
g.lineTo(-0.09, -5.6);
g.quadraticCurveTo(-0.06, -6.27, 0.5, -6.32);
g.lineTo(1.2, -6.3);
g.lineTo(1.2, -6.17);
g.lineTo(0.5, -6.19);
g.quadraticCurveTo(0.07, -6.15, 0.07, -5.6);
g.lineTo(0.17, -0.5);
g.lineTo(0.24, 0.3);
g.closePath();
g.fill();
g.fillStyle = "#6a645b";
g.beginPath();
g.moveTo(1.0, -6.34);
g.quadraticCurveTo(1.5, -6.52, 1.98, -6.3);
g.quadraticCurveTo(1.6, -6.1, 1.05, -6.13);
g.closePath();
g.fill();
g.strokeStyle = "rgba(226,212,184,0.45)";
g.lineWidth = 0.04;
g.beginPath();
g.moveTo(1.02, -6.36);
g.quadraticCurveTo(1.5, -6.52, 1.9, -6.34);
g.stroke();
g.fillStyle = "rgba(204,204,190,0.35)";
g.beginPath();
g.moveTo(1.3, -6.14);
g.lineTo(1.62, -6.16);
g.lineTo(1.48, -5.98 + 0.02 * Math.sin(0 * 0.6));
g.closePath();
g.fill();
g.fillStyle = "rgba(122,86,64,0.35)";
for (let i = 0; i < 8; i++) {
  const y = -0.5 - e.rnd() * 5;
  g.beginPath();
  g.ellipse(0, y, 0.1, 0.15 + e.rnd() * 0.3, 0, 0, 7);
  g.fill();
}
const leafC = ["#6b7853", "#56623f", "#86915f", "#737f56"];
const n = Math.round(26 * ov);
for (let i = 0; i < n; i++) {
  const t = Math.pow(e.rnd(), 1.4);
  const y = 0.2 - t * 6.0 * Math.min(1, ov * 1.3);
  const x = (e.rnd() - 0.5) * 0.35 + 0.03 * Math.sin(0 * 0.4 + i);
  const k = 1 + Math.floor(e.rnd() * 3);
  for (let m = 0; m < k; m++) {
    g.fillStyle = leafC[(i + m) % 4];
    g.beginPath();
    g.ellipse(x + (m - 1) * 0.1, y + (m % 2) * 0.1, 0.12 + 0.06 * e.rnd(), 0.08, e.rnd() * 3, 0, 7);
    g.fill();
  }
}
if (ov > 0.5) {
  const k = (ov - 0.5) * 2;
  for (let i = 0; i < Math.round(12 * k); i++) {
    const x = 0.4 + i * 0.07,
      len = 0.3 + 1.2 * k * (((i * 37) % 10) / 10);
    const sw = 0.05 * Math.sin(0 * 0.5 + i);
    g.fillStyle = leafC[i % 4];
    for (let j = 0; j < 4; j++) {
      g.beginPath();
      g.ellipse(x + (sw * j) / 3, -6.2 + (len * j) / 3, 0.1, 0.06, 0.4, 0, 7);
      g.fill();
    }
  }
}
g.restore();
for (let i = 0; i < 70; i++) {
  const x = -0.9 + e.rnd() * 1.8;
  const y0 = 0.3 + e.rnd() * 0.15;
  const h = (0.25 + 0.7 * ov) * (0.3 + 0.7 * e.rnd());
  const l = x * 0.6 + 0.08 * Math.sin(0 * 0.42 + i);
  g.fillStyle = e.rnd() < 0.3 ? "#a39c70" : "#788458";
  g.beginPath();
  g.moveTo(x - 0.04, y0);
  g.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.02, y0 - h * 0.5, x + 0.04, y0);
  g.fill();
}
