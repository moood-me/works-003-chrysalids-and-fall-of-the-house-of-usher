const S = e.state || {};
const f = S.fire ?? 0.8;
const F = f * (0.88 + 0.08 * Math.sin(e.t * 2.3) + 0.04 * Math.sin(e.t * 5.3));
const wall = () => {
  g.beginPath();
  g.moveTo(-6, 0.3);
  g.lineTo(-6, -4.5);
  g.lineTo(2.4, -3.35);
  g.lineTo(2.4, 0.3);
  g.closePath();
};
g.fillStyle = "#0b0e17";
wall();
g.fill();
g.save();
wall();
g.clip();
for (let x = -5.8; x < 2.4; x += 0.26 + e.rnd() * 0.1) {
  g.fillStyle = "rgba(4,5,9," + (0.3 + e.rnd() * 0.3) + ")";
  g.fillRect(x, -5, 0.02, 5.4);
  g.fillStyle = "rgba(28,34,50," + (0.08 + e.rnd() * 0.12) + ")";
  g.fillRect(x + 0.03, -5, 0.08 + e.rnd() * 0.08, 5.4);
}
const rg = g.createRadialGradient(3.6, -0.2, 0, 3.6, -0.2, 4.2);
rg.addColorStop(0, "rgba(190,104,56," + 0.16 * F + ")");
rg.addColorStop(1, "rgba(150,80,44,0)");
g.fillStyle = rg;
g.fillRect(-6, -5, 9, 5.4);
const sg = g.createLinearGradient(0, -4.5, 0, -2.6);
sg.addColorStop(0, "rgba(3,4,8,0.7)");
sg.addColorStop(1, "rgba(3,4,8,0)");
g.fillStyle = sg;
g.fillRect(-6, -5, 9, 2.6);
g.restore();
const ey = (x) => -5.02 + ((x + 6) / 8.84) * 1.5;
g.fillStyle = "#06080d";
g.beginPath();
g.moveTo(-6, -4.45);
g.lineTo(2.42, -3.33);
g.lineTo(2.8, ey(2.8));
g.lineTo(-6, ey(-6));
g.closePath();
g.fill();
for (let x = -5.7; x < 2.6; x += 0.62) {
  g.beginPath();
  g.moveTo(x, ey(x) - 0.02);
  g.lineTo(x + 0.12, ey(x + 0.12) - 0.02);
  g.lineTo(x + 0.12, ey(x + 0.12) + 0.13);
  g.lineTo(x, ey(x) + 0.12);
  g.closePath();
  g.fill();
}
g.fillStyle = "#07090f";
g.beginPath();
g.moveTo(-6, -5.32);
g.quadraticCurveTo(-1.6, -4.62, 2.82, -3.66);
g.lineTo(2.86, -3.5);
g.quadraticCurveTo(-1.6, -4.36, -6, ey(-6));
g.closePath();
g.fill();
g.strokeStyle = "rgba(60,72,104,0.35)";
g.lineWidth = 0.02;
g.beginPath();
g.moveTo(-6, -5.33);
g.quadraticCurveTo(-1.6, -4.63, 2.82, -3.67);
g.stroke();
g.fillStyle = "rgba(200,110,60," + 0.2 * F + ")";
g.beginPath();
g.moveTo(2.36, -3.3);
g.lineTo(2.42, -3.3);
g.lineTo(2.42, 0.3);
g.lineTo(2.34, 0.3);
g.closePath();
g.fill();
g.strokeStyle = "#080a11";
g.lineWidth = 0.08;
const wx = 1.5,
  wy = -0.56,
  R = 0.56;
g.beginPath();
g.ellipse(wx, wy, R * 0.92, R, 0, 0, 7);
g.stroke();
g.lineWidth = 0.04;
for (let k = 0; k < 8; k++) {
  const a = (k * Math.PI) / 4 + 0.2;
  g.beginPath();
  g.moveTo(wx, wy);
  g.lineTo(wx + Math.cos(a) * R * 0.92, wy + Math.sin(a) * R);
  g.stroke();
}
g.fillStyle = "#080a11";
g.beginPath();
g.arc(wx, wy, 0.1, 0, 7);
g.fill();
g.strokeStyle = "rgba(200,110,60," + 0.22 * F + ")";
g.lineWidth = 0.025;
g.beginPath();
g.ellipse(wx + 0.02, wy, R * 0.92, R, 0, -1.2, 0.9);
g.stroke();
