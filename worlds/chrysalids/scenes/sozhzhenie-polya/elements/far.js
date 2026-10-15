const { cl, mixc } = e.lib;
const { T, DAWN } = e.lib.now(e);
const c1 = mixc("#141219", "#4a4a54", DAWN),
  c2 = mixc("#0f0d13", "#3c3c44", DAWN);
g.fillStyle = c1;
g.beginPath();
g.moveTo(-1400, 3);
for (let x = -1400; x <= 1400; x += 20) {
  g.lineTo(x, -10 - 8 * Math.sin(x * 0.004 + 0.7) - 4 * Math.sin(x * 0.011 + 1));
}
g.lineTo(1400, 3);
g.closePath();
g.fill();
g.fillStyle = c2;
g.beginPath();
g.moveTo(-1400, 3);
for (let x = -1400; x <= 1400; x += 6) {
  const n = Math.sin(x * 0.05) * Math.sin(x * 0.013 + 2);
  g.lineTo(x, -2 - Math.max(0, n) * 7 - 1.5 * Math.sin(x * 0.37));
}
g.lineTo(1400, 3);
g.closePath();
g.fill();
// Waknuk on the left: the meeting house with its spire, roofs, a windmill
g.beginPath();
g.moveTo(-40.0, 0);
g.lineTo(-40.0, -13);
g.lineTo(-37.0, -13);
g.lineTo(-35.0, -32);
g.lineTo(-33.0, -13);
g.lineTo(-30.0, -13);
g.lineTo(-30.0, 0);
g.closePath();
g.moveTo(-60.0, 0);
g.lineTo(-60.0, -8);
g.lineTo(-54.0, -13);
g.lineTo(-48.0, -8);
g.lineTo(-48.0, 0);
g.closePath();
g.moveTo(-24.0, 0);
g.lineTo(-24.0, -7);
g.lineTo(-18.0, -11);
g.lineTo(-12.0, -7);
g.lineTo(-12.0, 0);
g.closePath();
g.moveTo(-78.0, 0);
g.lineTo(-77.0, -12);
g.lineTo(-75.0, -12);
g.lineTo(-74.0, 0);
g.closePath();
g.fill();
g.save();
g.translate(-76.0, -13);
g.rotate(T * 0.05);
g.strokeStyle = c2;
g.lineWidth = 0.8;
for (let i = 0; i < 4; i++) {
  g.rotate(Math.PI / 2);
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(0, -7);
  g.stroke();
}
g.restore();
e.light(-54.0, -4, 6, "#c88a58", 0.3 * cl(1 - DAWN * 1.6, 0, 1));
e.light(-18.0, -3, 5, "#c88a58", 0.2 * cl(1 - DAWN * 1.6, 0, 1));
