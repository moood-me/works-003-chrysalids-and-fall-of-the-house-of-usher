// The front posts of the chair's arms, before whoever sits in it.
const ar = new Path2D();
for (const s of [-1, 1]) {
  const x = s * 0.4;
  ar.moveTo(x - 0.03, -0.68);
  ar.lineTo(x + 0.03, -0.68);
  ar.lineTo(x + 0.025, 0);
  ar.lineTo(x - 0.025, 0);
  ar.closePath();
  ar.moveTo(x + 0.065, -0.7);
  ar.ellipse(x, -0.7, 0.065, 0.03, 0, 0, 7);
}
g.fillStyle = "#2a2422";
g.fill(ar);
