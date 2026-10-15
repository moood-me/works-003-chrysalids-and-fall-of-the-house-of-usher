const S = e.state || {};
const f = S.fire ?? 0.7;
const t = e.t;
const fl = 0.85 + 0.1 * Math.sin(t * 2.3) + 0.05 * Math.sin(t * 5.1 + 1);
const F = f * fl;
g.fillStyle = "#15100d";
g.beginPath();
g.moveTo(-0.3, -7);
g.lineTo(-0.28, -3.0);
g.bezierCurveTo(-0.5, -2.5, -0.85, -2.0, -0.98, -1.8);
g.lineTo(0.98, -1.8);
g.bezierCurveTo(0.85, -2.0, 0.5, -2.5, 0.28, -3.0);
g.lineTo(0.3, -7);
g.closePath();
g.fill();
let hg = g.createLinearGradient(0, -1.8, 0, -3.0);
hg.addColorStop(0, "rgba(210,112,56," + 0.5 * F + ")");
hg.addColorStop(1, "rgba(120,60,30,0)");
g.fillStyle = hg;
g.beginPath();
g.moveTo(-0.28, -3.0);
g.bezierCurveTo(-0.5, -2.5, -0.85, -2.0, -0.98, -1.8);
g.lineTo(0.98, -1.8);
g.bezierCurveTo(0.85, -2.0, 0.5, -2.5, 0.28, -3.0);
g.closePath();
g.fill();
g.fillStyle = "#1b1410";
g.beginPath();
g.moveTo(-0.9, 0.05);
g.lineTo(-0.86, -0.92);
g.quadraticCurveTo(0, -0.98, 0.86, -0.93);
g.lineTo(0.9, 0.05);
g.closePath();
g.fill();
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 5; c++) {
    const x = -0.86 + c * 0.36 + (r % 2) * 0.18,
      y = -0.02 - r * 0.23;
    g.strokeStyle = "rgba(8,6,5,0.45)";
    g.lineWidth = 0.012;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x, y - 0.22);
    g.stroke();
  }
  g.beginPath();
  g.moveTo(-0.88, -0.22 * (r + 1));
  g.lineTo(0.88, -0.22 * (r + 1));
  g.stroke();
}
let wg = g.createLinearGradient(0, -0.95, 0, 0.05);
wg.addColorStop(0, "rgba(210,108,52," + 0.45 * F + ")");
wg.addColorStop(0.5, "rgba(130,64,32," + 0.18 * F + ")");
wg.addColorStop(1, "rgba(60,30,16,0)");
g.fillStyle = wg;
g.fillRect(-0.9, -0.97, 1.8, 1.02);
g.save();
g.globalCompositeOperation = "lighter";
let cg = g.createRadialGradient(0, -0.98, 0, 0, -0.98, 0.9);
cg.addColorStop(0, "rgba(255,170,90," + 0.75 * F + ")");
cg.addColorStop(0.35, "rgba(220,100,40," + 0.4 * F + ")");
cg.addColorStop(1, "rgba(120,40,10,0)");
g.fillStyle = cg;
g.save();
g.translate(0, -0.98);
g.scale(1, 0.55);
g.translate(0, 0.98);
g.beginPath();
g.arc(0, -0.98, 0.9, 0, 7);
g.fill();
g.restore();
for (let i = 0; i < 5; i++) {
  const x = -0.36 + i * 0.18 + 0.04 * Math.sin(t * 0.9 + i * 2);
  const h = (0.18 + 0.2 * (0.5 + 0.5 * Math.sin(t * (1.1 + i * 0.23) + i * 2))) * (0.3 + 0.9 * f);
  const w = 0.13;
  const lean = 0.05 * Math.sin(t * 0.7 + i);
  const fgr = g.createLinearGradient(0, -0.95, 0, -0.95 - h);
  fgr.addColorStop(0, "rgba(255,160,70," + 0.4 * f + ")");
  fgr.addColorStop(1, "rgba(220,90,30,0)");
  g.fillStyle = fgr;
  g.beginPath();
  g.moveTo(x - w, -0.94);
  g.bezierCurveTo(x - w, -0.95 - h * 0.5, x + lean, -0.95 - h * 0.7, x + lean * 1.5, -0.95 - h);
  g.bezierCurveTo(x + lean + w * 0.4, -0.95 - h * 0.5, x + w, -0.95 - h * 0.3, x + w, -0.94);
  g.fill();
}
g.restore();
for (let i = 0; i < 16; i++) {
  const x = -0.62 + e.rnd() * 1.24,
    y = -0.95 - e.rnd() * 0.05;
  const b = 0.5 + 0.5 * Math.sin(t * (0.5 + e.rnd() * 0.8) + i);
  g.fillStyle = "rgba(" + Math.floor(120 + 110 * b * f) + "," + Math.floor(40 + 60 * b * f) + ",20,0.9)";
  g.beginPath();
  g.ellipse(x, y, 0.05 + e.rnd() * 0.05, 0.025 + e.rnd() * 0.015, 0, 0, 7);
  g.fill();
}
e.light(0, -1.1, 5 + 3 * f, "#e07a38", 0.85 * F);
// the bellows: open as `pump` leaves it (David presses the lever down: the board closes, the fire breathes)
const B = e.lib.bellows(S.pump),
  open = B.open;
// (the lever's handle: where David's hands hold it)
e.at(B.handle[0], B.handle[1], "handle");
g.fillStyle = "#120d0b";
g.beginPath();
g.moveTo(-0.88, -0.8);
g.lineTo(-1.75, -0.95 - open);
g.quadraticCurveTo(-1.86, -0.8, -1.75, -0.62 + open * 0.3);
g.lineTo(-0.88, -0.72);
g.closePath();
g.fill();
g.strokeStyle = "#120d0b";
g.lineWidth = 0.05;
g.lineCap = "round";
g.beginPath();
g.moveTo(B.end[0], B.end[1]);
g.lineTo(B.handle[0], B.handle[1]);
g.stroke();
g.lineWidth = 0.07;
g.beginPath();
g.moveTo(B.handle[0] - 0.09, B.handle[1] + 0.01);
g.lineTo(B.handle[0] + 0.05, B.handle[1] - 0.01);
g.stroke();
g.strokeStyle = "rgba(170,88,44," + 0.28 * F + ")";
g.lineWidth = 0.015;
for (let k = 1; k < 4; k++) {
  g.beginPath();
  g.moveTo(-0.88 - k * 0.21, -0.81 - (open * k) / 4.5);
  g.lineTo(-0.88 - k * 0.21, -0.71 + (open * k) / 12);
  g.stroke();
}
g.fillStyle = "#120d0b";
g.fillRect(-1.6, -0.66, 0.06, 0.69);
g.fillRect(-1.0, -0.74, 0.06, 0.77);
g.fillStyle = "#130f0c";
g.beginPath();
g.moveTo(0.98, 0.04);
g.lineTo(0.96, -0.5);
g.quadraticCurveTo(1.3, -0.53, 1.62, -0.5);
g.lineTo(1.6, 0.04);
g.closePath();
g.fill();
g.fillStyle = "rgba(180,90,44," + 0.2 * F + ")";
g.fillRect(0.96, -0.52, 0.66, 0.025);
