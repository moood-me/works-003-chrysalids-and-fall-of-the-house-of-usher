// The table with books (its candles: candles.js), dark oak on two carved trestles, books on it and under it. Painted
// once in its own colours: the candles' warmth on it is the scene's light.
// legs: two carved trestles
g.fillStyle = "#2a2420";
for (const x of [-0.5, 0.42]) {
  g.beginPath();
  g.moveTo(x - 0.05, -0.74);
  g.lineTo(x + 0.05, -0.74);
  g.quadraticCurveTo(x + 0.02, -0.45, x + 0.045, -0.3);
  g.quadraticCurveTo(x + 0.03, -0.12, x + 0.12, -0.03);
  g.lineTo(x + 0.12, 0);
  g.lineTo(x - 0.12, 0);
  g.lineTo(x - 0.12, -0.03);
  g.quadraticCurveTo(x - 0.03, -0.12, x - 0.045, -0.3);
  g.quadraticCurveTo(x - 0.02, -0.45, x - 0.05, -0.74);
  g.closePath();
  g.fill();
}
g.fillRect(-0.48, -0.2, 0.88, 0.035);
// top slab and visible top surface
g.fillStyle = "#2e2723";
g.beginPath();
g.moveTo(-0.62, -0.8);
g.lineTo(0.6, -0.8);
g.lineTo(0.58, -0.73);
g.lineTo(-0.6, -0.73);
g.closePath();
g.fill();
g.fillStyle = "#3a332e";
g.beginPath();
g.moveTo(-0.6, -0.8);
g.lineTo(0.58, -0.8);
g.lineTo(0.55, -0.85);
g.lineTo(-0.57, -0.85);
g.closePath();
g.fill();
// books
const book = (x, y, w, h, col, lit) => {
  g.fillStyle = col;
  g.fillRect(x, y - h, w, h);
  g.fillStyle = "rgba(225,200,160," + (0.12 + 0.2 * lit) + ")";
  g.fillRect(x + w - 0.012, y - h + 0.004, 0.012, h - 0.008);
};
book(-0.5, -0.82, 0.32, 0.045, "#4a3a34", 0.3);
book(-0.47, -0.865, 0.27, 0.04, "#34403f", 0.4);
book(-0.49, -0.905, 0.3, 0.038, "#553c34", 0.4);
book(-0.44, -0.943, 0.22, 0.035, "#3a4440", 0.5);
// a tall volume leaning
g.save();
g.translate(-0.12, -0.83);
g.rotate(0.22);
g.fillStyle = "#3e3a36";
g.fillRect(-0.03, -0.3, 0.05, 0.3);
g.fillStyle = "rgba(225,200,160,0.2)";
g.fillRect(0.012, -0.3, 0.008, 0.3);
g.restore();
// an open book, pale pages
g.fillStyle = "#d8cdb8";
g.beginPath();
g.moveTo(-0.05, -0.84);
g.quadraticCurveTo(0.03, -0.87, 0.1, -0.85);
g.quadraticCurveTo(0.17, -0.87, 0.24, -0.84);
g.lineTo(0.22, -0.82);
g.lineTo(-0.03, -0.82);
g.closePath();
g.fill();
// books on the floor
book(-0.95, 0, 0.3, 0.05, "#38403e", 0.2);
book(-0.92, -0.05, 0.24, 0.045, "#4c3c34", 0.25);
g.save();
g.translate(-0.62, 0);
g.rotate(-0.35);
g.fillStyle = "#3e3a36";
g.fillRect(-0.02, -0.26, 0.045, 0.26);
g.restore();
