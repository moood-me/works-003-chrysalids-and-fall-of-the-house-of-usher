const S = e.state || {};
const f = S.fire ?? 0.8;
const t = e.t;
const fl = 0.8 + 0.1 * Math.sin(t * 6.1) + 0.06 * Math.sin(t * 9.7);
const w = f * 0.28 * fl;
g.lineCap = "round";
g.strokeStyle = "#120f14";
const poles = [
  [-0.45, -2.55, -0.25, 0.06],
  [0.3, -2.6, 0.2, 0.05],
  [0.02, -2.75, 0.0, 0.045],
];
for (const p of poles) {
  g.lineWidth = p[3];
  g.beginPath();
  g.moveTo(p[2], -1.9);
  g.quadraticCurveTo(p[2] * 1.5 + p[0] * 0.2, -2.3, p[0], p[1]);
  g.stroke();
}
const gr = g.createLinearGradient(-1.9, 0, 0.8, 0);
gr.addColorStop(
  0,
  "rgb(" + (26 + Math.round(90 * w)) + "," + (26 + Math.round(44 * w)) + "," + (34 + Math.round(14 * w)) + ")",
);
gr.addColorStop(1, "#16151e");
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
for (let i = 0; i < 8; i++) {
  const cx = -1.6 + e.rnd() * 3.2,
    cy = -0.2 - e.rnd() * 1.9,
    rx = 0.35 + e.rnd() * 0.5,
    ry = 0.25 + e.rnd() * 0.35;
  g.fillStyle = e.rnd() < 0.5 ? "rgba(0,0,0,0.14)" : "rgba(120,90,70,0.04)";
  g.beginPath();
  g.ellipse(cx, cy, rx, ry, e.rnd() * 3, 0, 7);
  g.fill();
}
const bg = g.createLinearGradient(0, -0.6, 0, 0.05);
bg.addColorStop(0, "rgba(10,8,12,0)");
bg.addColorStop(1, "rgba(10,8,12,0.5)");
g.fillStyle = bg;
g.fillRect(-2, -0.6, 4, 0.7);
g.restore();
g.fillStyle = "#0b0a0e";
g.beginPath();
g.moveTo(-0.6, 0.05);
g.quadraticCurveTo(-0.58, -1.1, -0.25, -1.18);
g.quadraticCurveTo(0.08, -1.1, 0.1, 0.05);
g.closePath();
g.fill();
