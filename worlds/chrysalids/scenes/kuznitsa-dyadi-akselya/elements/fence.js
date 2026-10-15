const c = "#0f1522";
g.fillStyle = c;
g.strokeStyle = c;
g.lineCap = "round";
const posts = [
  [0, 1.35, 0.13],
  [2.4, 1.25, 0.11],
  [4.9, 1.3, 0.11],
  [7.4, 1.2, 0.1],
];
for (const p of posts) {
  g.beginPath();
  g.moveTo(p[0] - p[2] * 0.6, 0.05);
  g.lineTo(p[0] - p[2] * 0.5, -p[1]);
  g.lineTo(p[0] + p[2] * 0.4, -p[1] - 0.04);
  g.lineTo(p[0] + p[2] * 0.6, 0.05);
  g.fill();
}
g.lineWidth = 0.07;
for (const r of [0.45, 0.95]) {
  g.beginPath();
  g.moveTo(0, -r * 1.35);
  g.quadraticCurveTo(3.7, -r * 1.28 + 0.06, 7.6, -r * 1.2);
  g.stroke();
}
g.strokeStyle = "rgba(120,138,176,0.25)";
g.lineWidth = 0.02;
g.beginPath();
g.moveTo(0, -0.95 * 1.35 - 0.04);
g.quadraticCurveTo(3.7, -0.95 * 1.28 + 0.02, 7.6, -0.95 * 1.2 - 0.04);
g.stroke();
g.fillStyle = c;
for (let i = 0; i < 60; i++) {
  const x = -1 + e.rnd() * 9,
    h = 0.1 + e.rnd() * 0.35,
    l = (e.rnd() - 0.5) * 0.4 + 0.05 * Math.sin(e.t * 0.5 + i);
  g.beginPath();
  g.moveTo(x - 0.03, 0.02);
  g.quadraticCurveTo(x + l * h * 0.4, -h * 0.6, x + l * h, -h);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.01, -h * 0.5, x + 0.03, 0.02);
  g.fill();
}
