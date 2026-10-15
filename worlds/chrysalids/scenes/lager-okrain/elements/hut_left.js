const S = e.state || {};
const f = S.fire ?? 0.8;
const t = e.t;
const LIT = 1,
  WS = 0.5;
const fl = 0.8 + 0.1 * Math.sin(t * 6.1) + 0.06 * Math.sin(t * 9.7);
const w = f * WS * fl;
g.lineCap = "round";
g.strokeStyle = "#120e12";
const poles = [
  [-0.45, -2.6, -0.25, 0.06],
  [0.3, -2.7, 0.2, 0.05],
  [0.02, -2.85, 0.0, 0.045],
  [0.55, -2.4, 0.35, 0.035],
];
for (const p of poles) {
  g.lineWidth = p[3];
  g.beginPath();
  g.moveTo(p[2], -1.9);
  g.quadraticCurveTo(p[2] * 1.5 + p[0] * 0.2, -2.3, p[0], p[1]);
  g.stroke();
}
const gr = g.createLinearGradient(LIT * 1.9, 0, -LIT * 0.6, 0);
gr.addColorStop(
  0,
  "rgb(" + (26 + Math.round(92 * w)) + "," + (22 + Math.round(44 * w)) + "," + (28 + Math.round(14 * w)) + ")",
);
gr.addColorStop(1, "#14111a");
const dome = () => {
  g.beginPath();
  g.moveTo(-1.8, 0.05);
  g.bezierCurveTo(-1.85, -0.9, -1.25, -2.05, -0.1, -2.15);
  g.quadraticCurveTo(0.2, -2.25, 0.45, -2.08);
  g.bezierCurveTo(1.3, -1.85, 1.8, -1.0, 1.85, 0.05);
  g.closePath();
};
g.fillStyle = gr;
dome();
g.fill();
g.save();
dome();
g.clip();
for (let i = 0; i < 9; i++) {
  const cx = -1.6 + e.rnd() * 3.2,
    cy = -0.2 - e.rnd() * 1.9,
    rx = 0.35 + e.rnd() * 0.5,
    ry = 0.25 + e.rnd() * 0.35;
  g.fillStyle = e.rnd() < 0.5 ? "rgba(0,0,0,0.15)" : "rgba(120,90,70,0.05)";
  g.beginPath();
  g.ellipse(cx, cy, rx, ry, e.rnd() * 3, 0, 7);
  g.fill();
}
g.strokeStyle = "rgba(12,9,12,0.45)";
g.lineWidth = 0.05;
for (let i = 0; i < 4; i++) {
  const xx = -1.2 + i * 0.8;
  g.beginPath();
  g.moveTo(xx * 1.2, 0.1);
  g.quadraticCurveTo(xx * 0.9, -1.6, xx * 0.1, -2.1);
  g.stroke();
}
const bg = g.createLinearGradient(0, -0.6, 0, 0.05);
bg.addColorStop(0, "rgba(10,8,12,0)");
bg.addColorStop(1, "rgba(10,8,12,0.55)");
g.fillStyle = bg;
g.fillRect(-2, -0.6, 4, 0.7);
g.restore();
const dx = LIT * 0.8;
g.fillStyle = "#0a080c";
g.beginPath();
g.moveTo(dx - 0.36, 0.05);
g.quadraticCurveTo(dx - 0.34, -1.15, dx + 0.02, -1.22);
g.quadraticCurveTo(dx + 0.34, -1.12, dx + 0.36, 0.05);
g.closePath();
g.fill();
const fw = 0.03 * Math.sin(t * 0.6) + 0.015 * Math.sin(t * 1.3);
g.fillStyle = gr;
g.beginPath();
g.moveTo(dx - LIT * 0.02, -1.2);
g.quadraticCurveTo(dx - LIT * 0.3 + fw, -0.6, dx - LIT * 0.42 + fw, 0.03);
g.lineTo(dx - LIT * 0.2 + fw, 0.05);
g.quadraticCurveTo(dx - LIT * 0.12 + fw * 0.5, -0.6, dx + LIT * 0.05, -1.15);
g.closePath();
g.fill();
