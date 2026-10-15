const t = e.t;
const sw = (x) => 0.07 * Math.sin(t * 0.37 + x) + 0.035 * Math.sin(t * 0.15 + x * 2.3);
g.lineCap = "round";
g.fillStyle = "#2e322d";
g.beginPath();
g.moveTo(0.5, 1);
g.quadraticCurveTo(0.1, -3, 0.6, -9);
g.lineTo(1.2, -9);
g.quadraticCurveTo(0.9, -3, 1.4, 1);
g.closePath();
g.fill();
const br = [
  [0.45, -5.6, -2.6, -6.4, -5.0, -5.2, 0.13],
  [0.5, -7.3, -2.2, -8.2, -4.2, -7.9, 0.1],
  [0.45, -4.6, -1.2, -4.6, -2.3, -4.1, 0.07],
];
g.strokeStyle = "#2e322d";
for (const B of br) {
  g.lineWidth = B[6];
  g.beginPath();
  g.moveTo(B[0], B[1]);
  g.quadraticCurveTo(B[2], B[3], B[4] + sw(B[4]), B[5]);
  g.stroke();
}
const P = (B, u) => [
  (1 - u) * (1 - u) * B[0] + 2 * (1 - u) * u * B[2] + u * u * B[4] + sw(B[4]) * u,
  (1 - u) * (1 - u) * B[1] + 2 * (1 - u) * u * B[3] + u * u * B[5],
];
for (let k = 0; k < 520; k++) {
  const B = br[Math.floor(e.rnd() * 3)];
  const u = 0.2 + e.rnd() * 0.8;
  const p = P(B, u);
  const dx = (e.rnd() - 0.5) * 1.3,
    dy = (e.rnd() - 0.35) * 0.9;
  const r = 0.045 + e.rnd() * 0.06;
  const s2 = 0.03 * Math.sin(t * 0.8 + k);
  g.globalAlpha = 0.7 + e.rnd() * 0.3;
  g.fillStyle = e.rnd() < 0.55 ? "#2c302b" : e.rnd() < 0.7 ? "#353a33" : "#40463e";
  g.beginPath();
  g.ellipse(p[0] + dx + s2, p[1] + dy, r * 1.6, r * 0.7, 0.4 + e.rnd() * 0.9, 0, 7);
  g.fill();
}
g.strokeStyle = "#2f332d";
for (let k = 0; k < 30; k++) {
  const B = br[Math.floor(e.rnd() * 2)];
  const u = 0.4 + e.rnd() * 0.6;
  const p = P(B, u);
  const L = 0.3 + e.rnd() * 0.7;
  const s2 = 0.07 * Math.sin(t * 0.45 + k * 1.7);
  g.globalAlpha = 0.75;
  g.lineWidth = 0.015;
  g.beginPath();
  g.moveTo(p[0], p[1]);
  g.quadraticCurveTo(p[0] - 0.04, p[1] + L * 0.5, p[0] + s2, p[1] + L);
  g.stroke();
  for (let j = 0; j < 3; j++) {
    const v = 0.35 + j * 0.25;
    g.fillStyle = "#30342e";
    g.beginPath();
    g.ellipse(p[0] + s2 * v, p[1] + L * v, 0.04, 0.018, 1.2, 0, 7);
    g.fill();
  }
}
g.globalAlpha = 1;
