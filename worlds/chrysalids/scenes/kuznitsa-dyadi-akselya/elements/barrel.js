// The barrel David sits on, lit by the forge from the left and the night from the right.
const s = e.state,
  F = (s.fire ?? 0.75) * (0.85 + 0.1 * Math.sin(e.t * 2.3) + 0.05 * Math.sin(e.t * 5.1 + 1));
function barrel(col, ox) {
  g.fillStyle = col;
  g.beginPath();
  g.moveTo(-0.22 + ox, 0.02);
  g.bezierCurveTo(-0.3 + ox, -0.25, -0.3 + ox, -0.45, -0.22 + ox, -0.7);
  g.lineTo(0.22 + ox, -0.7);
  g.bezierCurveTo(0.3 + ox, -0.45, 0.3 + ox, -0.25, 0.22 + ox, 0.02);
  g.closePath();
  g.fill();
}
const sh = g.createRadialGradient(0, 0, 0, 0, 0, 0.5);
sh.addColorStop(0, "rgba(0,0,0,0.45)");
sh.addColorStop(1, "rgba(0,0,0,0)");
g.save();
g.scale(1, 0.18);
g.fillStyle = sh;
g.fillRect(-0.5, -0.5, 1, 1);
g.restore();
barrel("rgba(200,104,52," + (0.5 * F).toFixed(3) + ")", -0.025);
barrel("rgba(120,140,190,0.25)", 0.02);
barrel("#1a130f", 0);
g.strokeStyle = "rgba(8,6,5,0.7)";
g.lineWidth = 0.025;
for (const y of [-0.12, -0.58]) {
  g.beginPath();
  g.moveTo(-0.26, y);
  g.quadraticCurveTo(0, y + 0.03, 0.26, y);
  g.stroke();
}
g.strokeStyle = "rgba(8,6,5,0.35)";
g.lineWidth = 0.008;
for (const x of [-0.12, 0.02, 0.15]) {
  g.beginPath();
  g.moveTo(x, 0);
  g.quadraticCurveTo(x * 1.25, -0.35, x, -0.7);
  g.stroke();
}
