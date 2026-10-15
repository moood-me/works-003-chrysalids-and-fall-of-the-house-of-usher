// Roderick's high-backed gothic chair, dark carved oak (its arms' front posts: chair_front.js, before whoever sits).
// Painted once in its own colours: the candles' warm edge and the windows' cold are the scene's light.
const ch = new Path2D();
ch.moveTo(-0.34, -0.45);
ch.lineTo(-0.34, -1.74);
ch.lineTo(0, -2.04);
ch.lineTo(0.34, -1.74);
ch.lineTo(0.34, -0.45);
ch.closePath();
g.fillStyle = "#2c2624";
g.fill(ch);
g.save();
g.clip(ch);
// the carved panel of its back: a pointed arch
g.strokeStyle = "rgba(120,104,92,0.4)";
g.lineWidth = 0.012;
g.beginPath();
g.moveTo(-0.2, -1.0);
g.lineTo(-0.2, -1.62);
g.quadraticCurveTo(-0.2, -1.78, 0, -1.88);
g.quadraticCurveTo(0.2, -1.78, 0.2, -1.62);
g.lineTo(0.2, -1.0);
g.stroke();
g.strokeStyle = "rgba(0,0,0,0.35)";
g.beginPath();
g.moveTo(-0.19, -0.99);
g.lineTo(0.19, -0.99);
g.stroke();
g.restore();
// the seat, its rear legs and the arm rails
g.fillStyle = "#221d1c";
g.fillRect(-0.36, -0.5, 0.72, 0.06);
g.fillRect(-0.33, -0.45, 0.04, 0.45);
g.fillRect(0.29, -0.45, 0.04, 0.45);
g.fillStyle = "#28221f";
for (const s of [-1, 1]) g.fillRect(s > 0 ? 0.3 : -0.43, -0.72, 0.13, 0.035);
