const S = e.state || {};
const gl = S.glow ?? 0.6,
  p = 0.86 + 0.1 * Math.sin(e.t * 0.37) + 0.04 * Math.sin(e.t * 0.91);
g.fillStyle = "#1a2238";
g.beginPath();
g.moveTo(-1800, 5);
const pts = [];
for (let x = -1800; x <= 1800; x += 30) {
  let y = -16 - 12 * Math.sin(x * 0.004 + 1) - 7 * Math.sin(x * 0.013) - 5 * e.rnd();
  if (x > 40 && x < 420 && e.rnd() < 0.3) y -= 8 + e.rnd() * 16;
  pts.push([x, y]);
  g.lineTo(x, y);
}
g.lineTo(1800, 5);
g.closePath();
g.fill();
const sg = g.createLinearGradient(-350, 0, 750, 0);
sg.addColorStop(0, "rgba(196,184,112,0)");
sg.addColorStop(0.5, "rgba(204,190,116," + 0.8 * gl * p + ")");
sg.addColorStop(1, "rgba(196,184,112,0)");
g.strokeStyle = sg;
g.lineWidth = 3;
g.beginPath();
pts.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])));
g.stroke();
e.light(200, -18, 260, "#b9b26e", 0.4 * gl * p);
