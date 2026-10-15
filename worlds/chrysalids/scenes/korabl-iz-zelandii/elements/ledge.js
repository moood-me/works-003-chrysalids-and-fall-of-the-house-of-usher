// the ledge's front and the stone the children hide behind (metres at 7.3 m); the threads the wind brings onto them
const S = e.state || {},
  A = e.anim,
  T = e.t,
  d = typeof S.dawn === "number" ? S.dawn : 0.5,
  cw = typeof S.cave_web === "number" ? S.cave_web : 0;
const LH = 1.0,
  top = (x) => LH + 0.12 * Math.sin(x * 1.7) + 0.06 * Math.sin(x * 4.1);
const C = "#241f2a";
g.fillStyle = C;
g.beginPath();
g.moveTo(-16, 5);
for (let x = -16; x <= -1.0; x += 0.2) {
  const h = x < -1.6 ? top(x) : A.mix(top(-1.6), 0, (x + 1.6) / 0.6);
  g.lineTo(x, -h);
}
g.lineTo(-0.5, 0.4);
g.lineTo(-0.1, 1.4);
g.lineTo(0, 5);
g.closePath();
g.fill();
// the stone
g.beginPath();
g.ellipse(-1.9, -1.0, 0.95, 0.55, -0.15, 0, 7);
g.fill();
g.beginPath();
g.ellipse(-2.8, -1.05, 0.6, 0.35, 0.1, 0, 7);
g.fill();
g.strokeStyle = "rgba(214,180,182," + 0.32 * d + ")";
g.lineWidth = 0.03;
g.beginPath();
g.ellipse(-1.9, -1.0, 0.95, 0.55, -0.15, 3.4, 4.9);
g.stroke();
g.beginPath();
for (let x = -16; x <= -1.8; x += 0.2) x === -16 ? g.moveTo(x, -top(x)) : g.lineTo(x, -top(x));
g.stroke();
g.fillStyle = C;
for (let i = 0; i < 70; i++) {
  const x = -15.5 + A.hash(i, 1) * 14;
  const y = -top(x);
  const h = 0.1 + A.hash(i, 2) * 0.35;
  const l = (A.hash(i, 3) - 0.5) * 0.6 + 0.06 * Math.sin(T * 0.5 + i);
  g.beginPath();
  g.moveTo(x - 0.02, y + 0.02);
  g.quadraticCurveTo(x + l * h * 0.4, y - h * 0.6, x + l * h, y - h);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.01, y - h * 0.5, x + 0.02, y + 0.02);
  g.fill();
}
// threads over the children (drawn at this depth; the children lie just behind)
if (cw > 0.01) {
  g.lineCap = "round";
  for (let i = 0; i < 80; i++) {
    const k = A.clamp((cw - A.hash(i, 9) * 0.6) / 0.4, 0, 1);
    if (k <= 0) continue;
    const x1 = -5.6 + A.hash(i, 5) * 4.4,
      y1 = -(LH + A.hash(i, 6) * 0.75) * 0.9,
      x2 = x1 + (A.hash(i, 7) - 0.5) * 2,
      y2 = -(LH + A.hash(i, 8) * 0.4) * 0.9;
    g.strokeStyle = "rgba(240,232,238," + 0.42 * k + ")";
    g.lineWidth = 0.012;
    g.beginPath();
    g.moveTo(x1, y1);
    g.quadraticCurveTo((x1 + x2) / 2 + 0.05 * Math.sin(T * 0.3 + i), (y1 + y2) / 2 + 0.08, x2, y2);
    g.stroke();
    if (i % 2 === 0) {
      const tw = Math.max(0, Math.sin(T * (0.7 + A.hash(i, 4)) + i));
      g.fillStyle = "rgba(255,246,236," + 0.85 * k * tw + ")";
      g.beginPath();
      g.arc(x1, y1, 0.022, 0, 7);
      g.fill();
    }
  }
}
