const S = e.state || {};
const w = typeof S.web === "number" ? S.web : 1;
const C = "#332c39";
function hut(x, h, wd, lean) {
  g.fillStyle = C;
  g.beginPath();
  g.moveTo(x - wd / 2, 0);
  g.lineTo(x - wd / 2 + lean, -h * 0.75);
  g.lineTo(x + lean * 0.3, -h);
  g.lineTo(x + wd / 2, -h * 0.6);
  g.lineTo(x + wd / 2, 0);
  g.closePath();
  g.fill();
  g.strokeStyle = C;
  g.lineWidth = 0.08;
  g.lineCap = "round";
  for (let i = 0; i < 4; i++) {
    g.beginPath();
    g.moveTo(x - wd * 0.3 + i * wd * 0.2, -h * 0.8);
    g.lineTo(x - wd * 0.35 + i * wd * 0.22 + 0.4, -h * 1.15);
    g.stroke();
  }
  g.fillStyle = "#18141c";
  g.fillRect(x - wd * 0.1, -h * 0.55, wd * 0.22, h * 0.55);
  g.strokeStyle = "rgba(210,176,178,0.18)";
  g.lineWidth = 0.05;
  g.beginPath();
  g.moveTo(x - wd / 2, 0);
  g.lineTo(x - wd / 2 + lean, -h * 0.75);
  g.lineTo(x + lean * 0.3, -h);
  g.stroke();
}
hut(-3.2, 2.6, 4.2, 0.3);
hut(3.6, 2.2, 3.4, -0.2);
// a fence of poles and a cart wheel
g.strokeStyle = C;
g.lineWidth = 0.09;
for (let i = 0; i < 7; i++) {
  const x = -9 + i * 0.9;
  g.beginPath();
  g.moveTo(x, 0);
  g.lineTo(x + 0.05 * Math.sin(i * 3), -1.1 - 0.2 * Math.sin(i * 2));
  g.stroke();
}
g.beginPath();
g.moveTo(-9, -0.8);
g.lineTo(-3.6, -0.85);
g.stroke();
if (w > 0.01) {
  g.lineWidth = 0.02;
  for (let i = 0; i < 40; i++) {
    const x1 = -9 + (((i * 37) % 100) / 100) * 16,
      x2 = x1 + (((i * 53) % 10) - 5) * 0.4,
      y1 = -0.3 - (((i * 29) % 10) / 10) * 2.4,
      y2 = (-((i * 17) % 10) / 10) * 1.5;
    const a = Math.max(0, Math.min(1, (w - 0.3 - ((i * 13) % 10) / 40) / 0.4));
    g.strokeStyle = "rgba(236,226,232," + 0.3 * a + ")";
    g.beginPath();
    g.moveTo(x1, y1);
    g.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 + 0.3, x2, y2);
    g.stroke();
  }
}
