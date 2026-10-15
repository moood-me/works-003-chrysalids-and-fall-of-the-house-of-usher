const S = e.state || {},
  s = S.season ?? 0,
  r = S.rain ?? 0,
  t = e.t;
const sg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
sg.addColorStop(0, "rgba(36,30,24,0.4)");
sg.addColorStop(1, "rgba(36,30,24,0)");
g.save();
g.translate(0.6, 0.15);
g.scale(5.6, 0.5);
g.fillStyle = sg;
g.beginPath();
g.arc(0, 0, 1, 0, 7);
g.fill();
g.restore();
g.fillStyle = "#332d28";
g.beginPath();
g.moveTo(2.4, -3.7);
g.lineTo(2.92, -3.38);
g.lineTo(2.92, -0.27);
g.lineTo(2.4, 0.02);
g.closePath();
g.fill();
g.fillStyle = "#57504a";
g.beginPath();
g.moveTo(-0.6, -6.38);
g.lineTo(2.72, -3.56);
g.lineTo(3.18, -3.26);
g.lineTo(0.4, -5.63);
g.closePath();
g.fill();
g.strokeStyle = "rgba(40,34,30,0.3)";
g.lineWidth = 0.03;
for (let k = 1; k < 8; k++) {
  const u = k / 8;
  g.beginPath();
  g.moveTo(-0.6 + 3.32 * u, -6.38 + 2.82 * u);
  g.lineTo(0.4 + 2.78 * u, -5.63 + 2.37 * u);
  g.stroke();
}
g.fillStyle = "#463e37";
g.beginPath();
g.moveTo(-3.6, 0.02);
g.lineTo(-3.6, -3.7);
g.lineTo(-0.6, -6.2);
g.lineTo(2.4, -3.7);
g.lineTo(2.4, 0.02);
g.closePath();
g.fill();
g.save();
g.clip();
for (let x = -3.6; x < 2.4; x += 0.26) {
  const v = e.rnd();
  g.fillStyle =
    v < 0.5 ? "rgba(30,26,22," + (0.08 + 0.12 * v) + ")" : "rgba(150,136,116," + (0.03 + 0.06 * (v - 0.5)) + ")";
  g.fillRect(x, -6.3, 0.26, 6.4);
  g.fillStyle = "rgba(30,26,22,0.32)";
  g.fillRect(x + 0.245, -6.3, 0.018, 6.4);
}
for (let i = 0; i < 16; i++) {
  const x = -3.5 + e.rnd() * 5.8,
    y = -5.5 + e.rnd() * 4.5,
    h = 0.6 + e.rnd() * 2;
  const gr = g.createLinearGradient(0, y, 0, y + h);
  gr.addColorStop(0, "rgba(28,24,20,0)");
  gr.addColorStop(0.5, "rgba(28,24,20,0.14)");
  gr.addColorStop(1, "rgba(28,24,20,0)");
  g.fillStyle = gr;
  g.fillRect(x, y, 0.1 + e.rnd() * 0.2, h);
}
const tg = g.createLinearGradient(0, -6.2, 0, -3);
tg.addColorStop(0, "rgba(220,206,170,0.1)");
tg.addColorStop(1, "rgba(220,206,170,0)");
g.fillStyle = tg;
g.fillRect(-3.6, -6.3, 6, 3.3);
const wg = g.createLinearGradient(0, -1.4, 0, 0);
wg.addColorStop(0, "rgba(30,26,20,0)");
wg.addColorStop(1, "rgba(30,26,20,0.4)");
g.fillStyle = wg;
g.fillRect(-3.6, -1.4, 6, 1.45);
if (r > 0) {
  g.fillStyle = "rgba(30,30,34," + 0.22 * r + ")";
  g.fillRect(-3.6, -6.3, 6, 6.4);
}
g.restore();
g.fillStyle = "#211c19";
g.fillRect(-1.7, -2.8, 2.2, 2.82);
g.fillStyle = "#3e3731";
g.fillRect(-1.7, -2.8, 1.75, 2.82);
g.strokeStyle = "rgba(26,22,18,0.5)";
g.lineWidth = 0.08;
g.beginPath();
g.moveTo(-1.65, -0.1);
g.lineTo(0.0, -2.72);
g.moveTo(-1.65, -2.72);
g.lineTo(0.0, -0.1);
g.stroke();
g.strokeStyle = "rgba(26,22,18,0.45)";
g.lineWidth = 0.06;
g.strokeRect(-1.68, -2.78, 1.71, 2.78);
g.fillStyle = "#231e1a";
g.fillRect(-1.05, -4.85, 0.9, 0.9);
g.strokeStyle = "rgba(190,170,116,0.4)";
g.lineWidth = 0.02;
for (let k = 0; k < 9; k++) {
  const x = -1.0 + k * 0.1 + 0.02 * Math.sin(k * 3),
    sw = 0.02 * Math.sin(t * 0.6 + k);
  g.beginPath();
  g.moveTo(x, -3.95);
  g.quadraticCurveTo(x + sw, -3.85, x + sw * 2 + 0.01, -3.72 - 0.06 * (k % 3));
  g.stroke();
}
g.fillStyle = "#2f2924";
g.beginPath();
g.moveTo(-3.9, -3.53);
g.lineTo(-0.6, -6.42);
g.lineTo(2.72, -3.53);
g.lineTo(2.62, -3.42);
g.lineTo(-0.6, -6.2);
g.lineTo(-3.8, -3.42);
g.closePath();
g.fill();
g.fillStyle = "#3a3a2a";
for (let i = 0; i < 50; i++) {
  const x = -3.5 + e.rnd() * 6.4,
    h = 0.1 + e.rnd() * 0.4,
    sw = 0.04 * Math.sin(t * 0.5 + i);
  if (x > -1.75 && x < 0.55) continue;
  const yy = x > 2.4 ? (-0.27 * (x - 2.4)) / 0.52 : 0;
  g.beginPath();
  g.moveTo(x - 0.04, yy + 0.03);
  g.quadraticCurveTo(x + sw, yy - h * 0.6, x + sw * 2, yy - h);
  g.quadraticCurveTo(x + sw + 0.02, yy - h * 0.5, x + 0.04, yy + 0.03);
  g.fill();
}
